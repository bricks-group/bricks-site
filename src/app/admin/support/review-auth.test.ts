/**
 * Support review must not read help@ drafts unless the caller is an admin.
 *
 * Run:
 *   npx tsx --test src/app/admin/support/review-auth.test.ts
 *
 * These tests fail while /admin/support skips isAdmin() on VERCEL_ENV=preview
 * and then selects support_email_outbound with the service-role client.
 */
import { createRequire } from 'node:module'
import { Module } from 'node:module'
import { afterEach, before, describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { NextRequest } from 'next/server'
import { parseUrl } from 'next/dist/shared/lib/router/utils/parse-url.js'
import { signAdminToken } from '@/lib/support/alert.ts'
import { config as middlewareConfig, middleware } from '@/middleware.ts'

type ReviewPage = typeof import('./page.tsx').default
type SendAction = typeof import('./actions.ts').approveAndSend
type DismissAction = typeof import('./actions.ts').dismiss

let SupportReview: ReviewPage
let approveAndSend: SendAction
let dismiss: DismissAction

const nodeRequire = createRequire(import.meta.url)

const { getMiddlewareMatchers } = nodeRequire('next/dist/build/analysis/get-page-static-info.js') as {
  getMiddlewareMatchers: (matcher: unknown, nextConfig: { i18n?: undefined }) => unknown
}
const { getMiddlewareRouteMatcher } = nodeRequire('next/dist/shared/lib/router/utils/middleware-route-matcher.js') as {
  getMiddlewareRouteMatcher: (matchers: unknown) => (pathname: string, req: NextRequest, query?: Record<string, string | string[]>) => boolean
}

before(async () => {
  // tsx compiles the page to CommonJS. The stylesheet import is not JavaScript.
  const extensions = (Module as unknown as {
    _extensions: Record<string, (mod: { _compile: (source: string, filename: string) => void }, filename: string) => void>
  })._extensions
  extensions['.css'] = (mod, filename) => {
    mod._compile('module.exports = {}', filename)
  }
  // cookies() in next/dist/server/request/cookies.js throws without a Next
  // request store. The stub returns the request's admin cookie; isAdmin()
  // still verifies it with the real HMAC check.
  const headersId = nodeRequire.resolve('next/headers')
  nodeRequire.cache[headersId] = {
    id: headersId,
    filename: headersId,
    loaded: true,
    exports: {
      async cookies() {
        const token = globalThis.__bricksSupportReviewCookie
        return {
          get(name: string) {
            if (name === 'bricks_support_admin' && typeof token === 'string' && token.length > 0) {
              return { name, value: token }
            }
            return undefined
          },
          set() {},
          delete() {},
        }
      },
      async headers() {
        return new Headers()
      },
      async draftMode() {
        return { isEnabled: false, enable() {}, disable() {} }
      },
    },
  } as NodeModule
  const page = await import('./page.tsx')
  const actions = await import('./actions.ts')
  SupportReview = page.default
  approveAndSend = actions.approveAndSend
  dismiss = actions.dismiss
})

const PLACEHOLDER_SERVICE_ROLE = 'placeholder-service-role'
const PLACEHOLDER_ADMIN_SECRET = 'placeholder-admin-secret'
const PLACEHOLDER_GATE = 'placeholder-gate'
const SUPABASE_ORIGIN = 'https://support-db.invalid'

const FROM = 'patron-9f3c1a@example.test'
const INBOUND = 'inbound-body-9f3c1a'
const DRAFT = 'draft-reply-9f3c1a'
const SENT_BODY = 'sent-body-9f3c1a'
const REASON = 'reason_9f3c1a'

const ENV_KEYS = [
  'VERCEL_ENV',
  'SUPPORT_REVIEW_LIVE',
  'SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'SUPPORT_ADMIN_SECRET',
  'WWW_SITE_GATE_PASSWORD',
  'BRICKS_SITE_PREVIEW',
] as const

type EnvKey = (typeof ENV_KEYS)[number]

const saved = new Map<string, string | undefined>(ENV_KEYS.map((key) => [key, process.env[key]]))

function restoreEnv() {
  for (const key of ENV_KEYS) {
    const prev = saved.get(key)
    if (prev === undefined) delete process.env[key]
    else process.env[key] = prev
  }
  delete globalThis.__bricksSupportReviewCookie
}

afterEach(() => {
  restoreEnv()
})

function setEnv(values: Partial<Record<EnvKey, string | undefined>>) {
  for (const [key, value] of Object.entries(values)) {
    if (value === undefined) delete process.env[key]
    else process.env[key] = value
  }
}

function serviceRoleEnv(): Partial<Record<EnvKey, string>> {
  return {
    SUPABASE_URL: SUPABASE_ORIGIN,
    SUPABASE_SERVICE_ROLE_KEY: PLACEHOLDER_SERVICE_ROLE,
    SUPPORT_ADMIN_SECRET: PLACEHOLDER_ADMIN_SECRET,
  }
}

/** Rows the service-role select would return. Distinct from the page's SAMPLE cards. */
function inboxRows() {
  return [
    {
      id: 'row-9f3c1a',
      status: 'shadow',
      mode: 'shadow',
      needs_kam: true,
      escalation_reasons: [REASON],
      to_email: FROM,
      subject: 'subject-9f3c1a',
      body_text: DRAFT,
      category: null,
      created_at: '2026-11-01T15:00:00Z',
      sent_at: null,
      last_error: null,
      support_email_messages: {
        from_email: FROM,
        subject: 'subject-9f3c1a',
        text_body: INBOUND,
        received_at: '2026-11-01T15:00:00Z',
      },
      support_email_threads: { help_no: 9001 },
    },
    {
      id: 'row-sent-9f3c1a',
      status: 'sent',
      mode: 'manual',
      needs_kam: false,
      escalation_reasons: [],
      to_email: FROM,
      subject: 'sent-subject-9f3c1a',
      body_text: SENT_BODY,
      category: null,
      created_at: '2026-10-02T15:00:00Z',
      sent_at: '2026-10-02T16:00:00Z',
      last_error: null,
      support_email_messages: {
        from_email: FROM,
        subject: 'sent-subject-9f3c1a',
        text_body: INBOUND,
        received_at: '2026-10-02T15:00:00Z',
      },
      support_email_threads: { help_no: 9000 },
    },
  ]
}

/**
 * Same query object Next passes to the page: parseUrl -> searchParamsToUrlQuery
 * (next/dist/shared/lib/router/utils/parse-url.js), then Promise.resolve in
 * makeUntrackedSearchParams (next/dist/server/request/search-params.js).
 */
function pageSearchParams(requestUrl: string): Promise<Record<string, string | string[] | undefined>> {
  const parsed = parseUrl(requestUrl)
  const query = parsed.query
  if (typeof query === 'string') {
    return Promise.resolve(Object.fromEntries(new URLSearchParams(query)))
  }
  return Promise.resolve(query)
}

function textOf(node: unknown): string {
  if (node == null || typeof node === 'boolean') return ''
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(textOf).join('\n')
  if (typeof node === 'object' && node !== null && 'props' in node) {
    const props = (node as { props?: Record<string, unknown> }).props
    if (!props) return ''
    const bits: string[] = []
    for (const [key, value] of Object.entries(props)) {
      if (key === 'children') bits.push(textOf(value))
      else if (typeof value === 'string' || typeof value === 'number') bits.push(String(value))
    }
    return bits.join('\n')
  }
  return ''
}

async function render(requestUrl: string): Promise<{ text: string; urls: string[] }> {
  const urls: string[] = []
  const previous = globalThis.fetch
  globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url
    urls.push(url)
    const headerBag = new Headers(init?.headers)
    const authorization = headerBag.get('authorization')
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (key && authorization !== `Bearer ${key}`) {
      return new Response('missing service role', { status: 401 })
    }
    if (url.startsWith(`${SUPABASE_ORIGIN}/rest/v1/support_email_outbound`)) {
      // supportDb select returns the JSON array unchanged (src/lib/support/db.ts).
      // The page puts status=in.(shadow,failed,queued) on the query unless ?all=1.
      // Apply that filter here so a pending request does not invent sent rows.
      const status = new URL(url).searchParams.get('status')
      const allowed = status?.match(/^in\.\(([^)]*)\)$/)?.[1].split(',')
      const rows = allowed ? inboxRows().filter((row) => allowed.includes(row.status)) : inboxRows()
      return new Response(JSON.stringify(rows), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      })
    }
    return new Response('not found', { status: 404 })
  }
  try {
    const element = await SupportReview({ searchParams: pageSearchParams(requestUrl) })
    return { text: textOf(element), urls }
  } finally {
    globalThis.fetch = previous
  }
}

function assertNoInbox(text: string, urls: string[]) {
  const markers = [FROM, INBOUND, DRAFT, SENT_BODY, REASON, 'Reason 9f3c1a']
  assert.deepEqual(
    {
      serviceRoleReads: urls.filter((url) => url.includes('/rest/v1/')),
      rendered: markers.filter((marker) => text.includes(marker)),
    },
    { serviceRoleReads: [], rendered: [] },
  )
}

function adminCookie() {
  const exp = Math.floor(Date.now() / 1000) + 3600
  globalThis.__bricksSupportReviewCookie = signAdminToken(PLACEHOLDER_ADMIN_SECRET, exp)
}

const PREVIEW = 'https://bricks-site-git-feature-team.vercel.app/admin/support'

describe('support review authentication', () => {
  it('site gate matcher runs for /admin/support and does not send the visitor to /gate', () => {
    setEnv({ WWW_SITE_GATE_PASSWORD: PLACEHOLDER_GATE })
    const request = new NextRequest(`${PREVIEW}?all=1`)
    const matchers = getMiddlewareMatchers(middlewareConfig.matcher, {})
    const matches = getMiddlewareRouteMatcher(matchers)
    assert.equal(matches('/admin/support', request), true)
    assert.equal(matches('/admin/support/', request), true)
    const response = middleware(request)
    const location = response.headers.get('location')
    assert.equal(location, null)
    assert.equal(response.status, 200)
  })

  it('preview without an admin cookie does not read support mail', async () => {
    setEnv({ ...serviceRoleEnv(), VERCEL_ENV: 'preview' })
    delete globalThis.__bricksSupportReviewCookie
    const { text, urls } = await render(PREVIEW)
    assertNoInbox(text, urls)
  })

  it('preview ?all=1 without an admin cookie does not read every status', async () => {
    setEnv({ ...serviceRoleEnv(), VERCEL_ENV: 'preview' })
    delete globalThis.__bricksSupportReviewCookie
    const { text, urls } = await render(`${PREVIEW}?all=1`)
    assertNoInbox(text, urls)
  })

  it('preview with a cookie that is not an admin token does not read support mail', async () => {
    setEnv({ ...serviceRoleEnv(), VERCEL_ENV: 'preview' })
    globalThis.__bricksSupportReviewCookie = 'not-an-admin-token'
    const { text, urls } = await render(PREVIEW)
    assertNoInbox(text, urls)
  })

  it('preview with a token signed by a different secret does not read support mail', async () => {
    setEnv({ ...serviceRoleEnv(), VERCEL_ENV: 'preview' })
    const exp = Math.floor(Date.now() / 1000) + 3600
    globalThis.__bricksSupportReviewCookie = signAdminToken('placeholder-other-secret', exp)
    const { text, urls } = await render(`${PREVIEW}?all=1`)
    assertNoInbox(text, urls)
  })

  it('a signed-in admin on preview still receives the drafts', async () => {
    setEnv({ ...serviceRoleEnv(), VERCEL_ENV: 'preview' })
    adminCookie()
    const { text, urls } = await render(`${PREVIEW}?all=1`)
    assert.ok(urls.some((url) => url.startsWith(`${SUPABASE_ORIGIN}/rest/v1/support_email_outbound`)))
    assert.equal(text.includes(FROM), true)
    assert.equal(text.includes(INBOUND), true)
    assert.equal(text.includes(DRAFT), true)
    assert.equal(text.includes(SENT_BODY), true)
  })

  it('preview without a service-role key does not fetch and does not show inbox rows', async () => {
    setEnv({
      VERCEL_ENV: 'preview',
      SUPABASE_URL: SUPABASE_ORIGIN,
      SUPPORT_ADMIN_SECRET: PLACEHOLDER_ADMIN_SECRET,
    })
    delete process.env.SUPABASE_SERVICE_ROLE_KEY
    delete process.env.NEXT_PUBLIC_SUPABASE_URL
    delete globalThis.__bricksSupportReviewCookie
    const { text, urls } = await render(PREVIEW)
    assertNoInbox(text, urls)
  })

  it('production stays dark until SUPPORT_REVIEW_LIVE and still does not fetch', async () => {
    setEnv({ ...serviceRoleEnv(), VERCEL_ENV: 'production' })
    delete process.env.SUPPORT_REVIEW_LIVE
    delete globalThis.__bricksSupportReviewCookie
    const { text, urls } = await render(PREVIEW)
    assertNoInbox(text, urls)
    assert.equal(text.includes('waiting for your go-ahead'), true)
  })

  it('production with SUPPORT_REVIEW_LIVE still requires an admin before reading mail', async () => {
    setEnv({ ...serviceRoleEnv(), VERCEL_ENV: 'production', SUPPORT_REVIEW_LIVE: 'true' })
    delete globalThis.__bricksSupportReviewCookie
    const { text, urls } = await render(`${PREVIEW}?all=1`)
    assertNoInbox(text, urls)
    assert.equal(text.includes('Sign in'), true)
  })

  it('Cloudflare preview flag alone does not skip the admin check', async () => {
    setEnv({ ...serviceRoleEnv(), BRICKS_SITE_PREVIEW: '1' })
    delete process.env.VERCEL_ENV
    delete globalThis.__bricksSupportReviewCookie
    const { text, urls } = await render(`${PREVIEW}?all=1`)
    assertNoInbox(text, urls)
    assert.equal(text.includes('Sign in'), true)
  })

  it('approve and dismiss on preview do not touch the inbox without an admin cookie', async () => {
    setEnv({ ...serviceRoleEnv(), VERCEL_ENV: 'preview' })
    delete globalThis.__bricksSupportReviewCookie
    const urls: string[] = []
    const previous = globalThis.fetch
    globalThis.fetch = async (input: RequestInfo | URL) => {
      const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url
      urls.push(url)
      return new Response('[]', { status: 200, headers: { 'content-type': 'application/json' } })
    }
    try {
      const send = new FormData()
      send.set('id', 'row-9f3c1a')
      send.set('body', DRAFT)
      await assert.rejects(() => approveAndSend(send), { message: 'unauthorized' })
      const drop = new FormData()
      drop.set('id', 'row-9f3c1a')
      await assert.rejects(() => dismiss(drop), { message: 'unauthorized' })
      assert.deepEqual(urls, [])
    } finally {
      globalThis.fetch = previous
    }
  })
})

declare global {
  var __bricksSupportReviewCookie: string | undefined
}
