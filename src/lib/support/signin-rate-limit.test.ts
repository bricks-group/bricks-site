/**
 * Support sign-in and the help-chat routes limit attempts by client IP, but
 * they read that IP from a header the caller can set.
 *
 * Cloudflare's published request-header behavior (the page Workers docs point
 * at for headers on an incoming request) is:
 *   - CF-Connecting-IP is the address that connected to Cloudflare
 *   - if the request already had X-Forwarded-For, that value is kept and the
 *     connecting address is appended
 *   - X-Real-IP is not a substitute for CF-Connecting-IP
 * These tests hand the actions the header list that behavior produces and
 * require the limit to follow CF-Connecting-IP (and, for sign-in, the account
 * actually being checked). They fail while the first forwarded hop is the key.
 */
import { afterEach, describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { NextRequest } from 'next/server'
import { createRequestStoreForAPI } from 'next/dist/server/async-storage/request-store.js'
import { workAsyncStorage } from 'next/dist/server/app-render/work-async-storage.external.js'
import { workUnitAsyncStorage } from 'next/dist/server/app-render/work-unit-async-storage.external.js'
import { middleware, isPublicPath } from '../../middleware.ts'
import { _resetMemory } from './rate-limit.ts'
import { requestCode, signInCode, signInPassword } from '../../app/admin/support/actions.ts'
import { POST as helpChatPost } from '../../app/api/help-chat/route.ts'
import { POST as helpEscalatePost } from '../../app/api/help-chat/escalate/route.ts'

const CONNECTING = '198.51.100.8'
const ACCOUNT = 'owner@example.com'
const ENV_KEYS = [
  'SUPABASE_URL', 'SUPABASE_ANON_KEY', 'SUPABASE_SERVICE_ROLE_KEY',
  'NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY', 'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY',
  'SUPPORT_ADMIN_SECRET', 'WWW_SITE_GATE_PASSWORD', 'HELP_CHAT_ENABLED', 'HELP_CHAT_MODE', 'RESEND_API_KEY',
] as const
const savedEnv = Object.fromEntries(ENV_KEYS.map((k) => [k, process.env[k]]))
const savedFetch = globalThis.fetch

type AuthCall = { path: string; email: string }
type Sink = { auth: AuthCall[]; inserts: number }
let sink: Sink = { auth: [], inserts: 0 }

function restoreEnv() {
  for (const k of ENV_KEYS) {
    if (savedEnv[k] === undefined) delete process.env[k]
    else process.env[k] = savedEnv[k]
  }
  globalThis.fetch = savedFetch
  _resetMemory()
}

afterEach(restoreEnv)

/** Header list Cloudflare documents for a client that already sent X-Forwarded-For. */
function edgeHeaders(opts: { connecting?: string; spoof: string; realIp?: string; cookie?: string }): Headers {
  const headers = new Headers({ host: 'help.brxs.ca' })
  if (opts.connecting) {
    headers.set('cf-connecting-ip', opts.connecting)
    headers.set('x-forwarded-for', `${opts.spoof},${opts.connecting}`)
  } else {
    headers.set('x-forwarded-for', opts.spoof)
  }
  if (opts.realIp) headers.set('x-real-ip', opts.realIp)
  if (opts.cookie) headers.set('cookie', opts.cookie)
  return headers
}

function installFetch(mode: 'db' | 'down') {
  sink = { auth: [], inserts: 0 }
  const hits = new Map<string, number>()
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input)
    const method = String(init?.method || 'GET').toUpperCase()
    if (url.includes('/rpc/www_rate_limit_hit')) {
      if (mode === 'down') return new Response('unavailable', { status: 503 })
      const body = JSON.parse(String(init?.body || '{}')) as { p_key?: string }
      const key = String(body.p_key || '')
      const n = (hits.get(key) || 0) + 1
      hits.set(key, n)
      return Response.json(n)
    }
    if (url.includes('/auth/v1/')) {
      const body = JSON.parse(String(init?.body || '{}')) as { email?: string }
      sink.auth.push({ path: new URL(url).pathname, email: String(body.email || '') })
      return new Response('{}', { status: 400 })
    }
    if (method === 'POST' && url.includes('/rest/v1/support_cases')) {
      sink.inserts += 1
      return Response.json([{ id: 'case-1', help_no: 1 }])
    }
    if (method === 'POST' && url.includes('/rest/v1/ops_escalations')) return Response.json([{ id: 'ops-1' }])
    if (method === 'PATCH') return new Response(null, { status: 204 })
    return new Response('{}', { status: 404 })
  }) as typeof fetch
}

function signinEnv() {
  process.env.SUPABASE_URL = 'https://project.example.test'
  process.env.SUPABASE_ANON_KEY = 'anon-placeholder'
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-placeholder'
  process.env.SUPPORT_ADMIN_SECRET = 'admin-secret-placeholder'
  delete process.env.RESEND_API_KEY
}

function redirectTo(error: unknown): string {
  const digest = (error as { digest?: string } | null)?.digest || ''
  if (!digest.startsWith('NEXT_REDIRECT;')) throw error
  return digest.split(';').slice(2, -2).join(';')
}

async function callAction(
  action: (form: FormData) => Promise<unknown>,
  headers: Headers,
  fields: Record<string, string>,
): Promise<string> {
  const url = new URL('https://help.brxs.ca/admin/support')
  const store = createRequestStoreForAPI({ headers } as never, url, [] as never, () => {}, {} as never)
  const form = new FormData()
  for (const [key, value] of Object.entries(fields)) form.set(key, value)
  return workAsyncStorage.run({ route: '/admin/support' } as never, () =>
    workUnitAsyncStorage.run(store, async () => {
      try {
        await action(form)
        throw new Error('sign-in action returned instead of redirecting')
      } catch (error) {
        return redirectTo(error)
      }
    }),
  )
}

describe('support sign-in rate limit', { concurrency: 1 }, () => {
  it('leaves /admin/support public and forwards the client X-Forwarded-For value', () => {
    assert.equal(isPublicPath('/admin/support'), true)
    assert.equal(isPublicPath('/admin/support/'), true)
    process.env.WWW_SITE_GATE_PASSWORD = 'gate-placeholder'
    const spoofed = `203.0.113.9,${CONNECTING}`
    const res = middleware(new NextRequest('https://help.brxs.ca/admin/support', {
      method: 'POST',
      headers: {
        host: 'help.brxs.ca',
        'x-forwarded-for': spoofed,
        'cf-connecting-ip': CONNECTING,
        'x-real-ip': '192.0.2.9',
      },
    }))
    assert.equal(res.headers.get('location'), null)
    assert.equal(res.headers.get('x-middleware-request-x-forwarded-for'), spoofed)
    assert.equal(res.headers.get('x-middleware-request-cf-connecting-ip'), CONNECTING)
  })

  it('stops the 9th password guess when the forwarded header does not change', async () => {
    signinEnv()
    installFetch('db')
    const headers = edgeHeaders({ connecting: CONNECTING, spoof: '203.0.113.9', realIp: '192.0.2.9' })
    const destinations: string[] = []
    for (let i = 0; i < 9; i++) {
      destinations.push(await callAction(signInPassword, headers, { email: ACCOUNT, password: 'placeholder-guess' }))
    }
    assert.equal(sink.auth.length, 8)
    assert.equal(destinations[8], '/admin/support?e=busy')
    assert.ok(sink.auth.every((call) => call.path === '/auth/v1/token'))
  })

  it('counts password guesses by CF-Connecting-IP when X-Forwarded-For and X-Real-IP change', async () => {
    signinEnv()
    installFetch('db')
    const destinations: string[] = []
    for (let i = 0; i < 9; i++) {
      destinations.push(await callAction(
        signInPassword,
        edgeHeaders({ connecting: CONNECTING, spoof: `203.0.113.${i + 1}`, realIp: `192.0.2.${i + 1}` }),
        { email: `person${i}@example.com`, password: 'placeholder-guess' },
      ))
    }
    assert.equal(sink.auth.length, 8)
    assert.equal(destinations[8], '/admin/support?e=busy')
  })

  it('still counts those password guesses when the shared counter is unreachable', async () => {
    signinEnv()
    installFetch('down')
    for (let i = 0; i < 9; i++) {
      await callAction(
        signInPassword,
        edgeHeaders({ connecting: CONNECTING, spoof: `203.0.113.${i + 1}`, realIp: `192.0.2.${i + 1}` }),
        { email: `person${i}@example.com`, password: 'placeholder-guess' },
      )
    }
    assert.equal(sink.auth.length, 8)
  })

  it('does not check a password when CF-Connecting-IP is missing', async () => {
    signinEnv()
    installFetch('db')
    for (let i = 0; i < 9; i++) {
      const to = await callAction(
        signInPassword,
        edgeHeaders({ spoof: `203.0.113.${i + 1}`, realIp: `192.0.2.${i + 1}` }),
        { email: ACCOUNT, password: 'placeholder-guess' },
      )
      assert.equal(to, '/admin/support?e=busy')
    }
    assert.equal(sink.auth.length, 0)
  })

  it('limits password guesses per normalized email across connecting addresses', async () => {
    signinEnv()
    installFetch('db')
    const emails = [ACCOUNT, ' Owner@Example.com ', ACCOUNT]
    for (let i = 0; i < 9; i++) {
      const ip = `198.51.100.${10 + i}`
      const to = await callAction(
        signInPassword,
        edgeHeaders({ connecting: ip, spoof: ip }),
        { email: emails[i % emails.length], password: 'placeholder-guess' },
      )
      if (i === 8) assert.equal(to, '/admin/support?e=busy')
    }
    assert.equal(sink.auth.length, 8)
    assert.ok(sink.auth.every((call) => call.path === '/auth/v1/token' && call.email === ACCOUNT))
  })

  it('counts code requests by CF-Connecting-IP and does not send once the limit is reached', async () => {
    signinEnv()
    installFetch('db')
    const destinations: string[] = []
    for (let i = 0; i < 9; i++) {
      destinations.push(await callAction(
        requestCode,
        edgeHeaders({ connecting: CONNECTING, spoof: `203.0.113.${i + 1}`, realIp: `192.0.2.${i + 1}` }),
        { email: `person${i}@example.com` },
      ))
    }
    assert.equal(sink.auth.filter((call) => call.path === '/auth/v1/otp').length, 8)
    assert.equal(destinations[8], '/admin/support?e=busy')
  })

  it('limits code requests per normalized email across connecting addresses', async () => {
    signinEnv()
    installFetch('db')
    for (let i = 0; i < 9; i++) {
      const ip = `198.51.100.${20 + i}`
      const to = await callAction(
        requestCode,
        edgeHeaders({ connecting: ip, spoof: ip }),
        { email: i % 2 === 0 ? ACCOUNT : ' Owner@Example.com ' },
      )
      if (i === 8) assert.equal(to, '/admin/support?e=busy')
    }
    const sent = sink.auth.filter((call) => call.path === '/auth/v1/otp')
    assert.equal(sent.length, 8)
    assert.ok(sent.every((call) => call.email === ACCOUNT))
  })

  it('counts code checks by CF-Connecting-IP and does not verify once the limit is reached', async () => {
    signinEnv()
    installFetch('db')
    const destinations: string[] = []
    for (let i = 0; i < 9; i++) {
      destinations.push(await callAction(
        signInCode,
        edgeHeaders({ connecting: CONNECTING, spoof: `203.0.113.${i + 1}`, realIp: `192.0.2.${i + 1}` }),
        { email: `person${i}@example.com`, code: '000000' },
      ))
    }
    assert.equal(sink.auth.filter((call) => call.path === '/auth/v1/verify').length, 8)
    assert.equal(destinations[8], '/admin/support?e=busy')
  })

  it('limits code checks for the cookie email, which is the account that is verified', async () => {
    signinEnv()
    installFetch('db')
    const cookie = `bricks_support_signin_email=${encodeURIComponent(ACCOUNT)}`
    for (let i = 0; i < 9; i++) {
      const ip = `198.51.100.${40 + i}`
      const to = await callAction(
        signInCode,
        edgeHeaders({ connecting: ip, spoof: ip, cookie }),
        { email: `other${i}@example.com`, code: '000000' },
      )
      if (i === 8) assert.equal(to, '/admin/support?e=busy')
    }
    const checks = sink.auth.filter((call) => call.path === '/auth/v1/verify')
    assert.equal(checks.length, 8)
    assert.ok(checks.every((call) => call.email === ACCOUNT))
  })
})

describe('help routes that share the forwarded-IP key', { concurrency: 1 }, () => {
  it('counts help-chat questions by CF-Connecting-IP when X-Forwarded-For and X-Real-IP change', async () => {
    process.env.HELP_CHAT_ENABLED = 'true'
    process.env.HELP_CHAT_MODE = 'extract'
    delete process.env.SUPABASE_URL
    delete process.env.SUPABASE_SERVICE_ROLE_KEY
    const statuses: number[] = []
    for (let i = 0; i < 9; i++) {
      const res = await helpChatPost(new Request('https://help.brxs.ca/api/help-chat', {
        method: 'POST',
        headers: edgeHeaders({ connecting: CONNECTING, spoof: `203.0.113.${i + 1}`, realIp: `192.0.2.${i + 1}` }),
        body: JSON.stringify({ question: 'How do I book a shoot?' }),
      }) as never)
      statuses.push(res.status)
    }
    assert.deepEqual(statuses.slice(0, 8).every((status) => status !== 429), true)
    assert.equal(statuses[8], 429)
  })

  it('counts help escalations by CF-Connecting-IP and does not save the one past the limit', async () => {
    signinEnv()
    installFetch('db')
    process.env.HELP_CHAT_ENABLED = 'true'
    process.env.HELP_CHAT_MODE = 'extract'
    const statuses: number[] = []
    for (let i = 0; i < 6; i++) {
      const res = await helpEscalatePost(new Request('https://help.brxs.ca/api/help-chat/escalate', {
        method: 'POST',
        headers: edgeHeaders({ connecting: CONNECTING, spoof: `203.0.113.${i + 1}`, realIp: `192.0.2.${i + 1}` }),
        body: JSON.stringify({
          consent: true,
          email: `visitor${i}@example.com`,
          transcript: [{ role: 'user', text: 'I need a person to look at this' }],
          pagePath: '/help',
          note: '',
        }),
      }) as never)
      statuses.push(res.status)
    }
    assert.equal(statuses[5], 429)
    assert.equal(sink.inserts, 5)
  })
})
