/**
 * Spec for the support-review bearer leak.
 *
 * These tests fail while an untrusted visitor can cause an owner alert whose
 * Reply-To is outside @brxs.ca and whose body contains a signed admin token
 * that /admin/support/login will exchange for a review session.
 *
 * Run:
 *   npx --yes tsx --test src/lib/support/alert-reply-to-session.test.ts
 */
import 'next/dist/server/node-environment-baseline.js'
import { createRequire } from 'node:module'
import { Module } from 'node:module'
import test from 'node:test'
import assert from 'node:assert/strict'
import { NextRequest } from 'next/server'
import { verifyAdminToken, signAdminToken, ALERT_TO } from './alert.ts'
import { inboxDbDownAlert, signForTest } from './inbound.ts'
import { _resetMemory } from './rate-limit.ts'

const require = createRequire(process.cwd() + '/package.json')

const extensions = (Module as unknown as { _extensions: Record<string, (mod: NodeJS.Module, filename: string) => void> })._extensions
extensions['.css'] = (mod, filename) => {
  ;(mod as unknown as { _compile: (code: string, filename: string) => void })._compile('module.exports = {}', filename)
}

const { workAsyncStorage } = require('next/dist/server/app-render/work-async-storage.external.js') as {
  workAsyncStorage: { run: <T>(store: object, fn: () => T) => T }
}
const { workUnitAsyncStorage } = require('next/dist/server/app-render/work-unit-async-storage.external.js') as {
  workUnitAsyncStorage: { run: <T>(store: object, fn: () => T) => T }
}
const { RequestCookies } = require('next/dist/server/web/spec-extension/cookies.js') as {
  RequestCookies: new (headers: Headers) => { get: (name: string) => { value: string } | undefined }
}

const ADMIN_SECRET = 'placeholder-support-admin-secret'
const WEBHOOK_SECRET = 'whsec_' + Buffer.from('placeholder-webhook-secret').toString('base64')
const VISITOR = 'visitor@evil.example'
const CUSTOMER = 'customer@example.com'
const EDITED_REPLY = 'Edited reply from the review form.'
const CUSTOMER_MARKER = 'customer-correspondence-marker'
const SIX_DAYS = 6 * 86400

const ENV_KEYS = [
  'SUPPORT_ADMIN_SECRET', 'SUPPORT_INBOUND_ENABLED', 'SUPPORT_AUTOSEND_ENABLED', 'SUPPORT_SHADOW_MODE',
  'RESEND_API_KEY', 'RESEND_INBOUND_API_KEY', 'RESEND_INBOUND_WEBHOOK_SECRET', 'BRICKS_OS_API_URL',
  'INTERNAL_API_KEY', 'HELP_CHAT_ENABLED', 'HELP_CHAT_MODE', 'SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY',
  'VERCEL_ENV', 'SUPPORT_REVIEW_LIVE', 'NODE_ENV', 'SUPPORT_ALERT_TO', 'SUPPORT_REVIEW_BASE_URL',
] as const

type AlertPayload = { from?: string; to?: string[]; cc?: string[]; bcc?: string[]; reply_to?: string | string[]; subject?: string; text?: string; html?: string }

type Report = {
  visitorReceivedAdminLink: boolean
  loginSetCookie: boolean
  acceptedSixDaysLater: boolean
  secondUseStillWorks: boolean
  sentEditedReplyFromHelp: boolean
}

const closed: Report = {
  visitorReceivedAdminLink: false,
  loginSetCookie: false,
  acceptedSixDaysLater: false,
  secondUseStillWorks: false,
  sentEditedReplyFromHelp: false,
}

function snapshotEnv(): Map<string, string | undefined> {
  return new Map(ENV_KEYS.map((key) => [key, process.env[key]]))
}

function writeEnv(key: string, value: string | undefined) {
  const env = process.env as Record<string, string | undefined>
  if (value === undefined) delete env[key]
  else env[key] = value
}

function restoreEnv(snap: Map<string, string | undefined>) {
  for (const [key, value] of snap) writeEnv(key, value)
}

function enableReviewCrypto() {
  process.env.SUPPORT_ADMIN_SECRET = ADMIN_SECRET
  process.env.SUPPORT_REVIEW_BASE_URL = 'https://help.brxs.ca'
  process.env.SUPPORT_ALERT_TO = ALERT_TO
  process.env.RESEND_API_KEY = 'placeholder-resend-key'
}

function decodeLayers(value: string): string {
  let cur = value
  for (let i = 0; i < 3; i++) {
    const entities = cur.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    let next = entities
    try { next = decodeURIComponent(entities) } catch { next = entities }
    if (next === cur) break
    cur = next
  }
  return cur
}

function usableTokens(text: string, nowSec: number): string[] {
  const found = new Set<string>()
  const re = /[0-9]{9,12}\.[A-Za-z0-9_-]{16,}/g
  for (const source of [text, decodeLayers(text)]) {
    for (const match of source.matchAll(re)) {
      if (verifyAdminToken(ADMIN_SECRET, match[0], nowSec)) found.add(match[0])
    }
  }
  return [...found]
}

function replyAddresses(payload: AlertPayload): string[] {
  const raw = payload.reply_to
  const list = Array.isArray(raw) ? raw : raw == null || raw === '' ? [] : [raw]
  return list.map((item) => {
    const text = String(item)
    const bracket = text.match(/<([^>]+)>/)
    return (bracket ? bracket[1] : text).trim().toLowerCase()
  })
}

function payloadLeaksToken(payload: AlertPayload, nowSec: number): boolean {
  const untrustedReply = replyAddresses(payload).some((address) => address.length > 0 && !address.endsWith('@brxs.ca'))
  if (!untrustedReply) return false
  const body = `${payload.text || ''}\n${payload.html || ''}`
  return usableTokens(body, nowSec).length > 0
}

function leakedToken(payloads: AlertPayload[], nowSec: number): string | undefined {
  for (const payload of payloads) {
    if (!payloadLeaksToken(payload, nowSec)) continue
    const token = usableTokens(`${payload.text || ''}\n${payload.html || ''}`, nowSec)[0]
    if (token) return token
  }
  return undefined
}

type FetchHandler = (url: string, init: RequestInit | undefined) => Response | Promise<Response>

function installFetch(handler: FetchHandler): { calls: { url: string; method: string; body: string }[]; restore: () => void } {
  const previous = globalThis.fetch
  const calls: { url: string; method: string; body: string }[] = []
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input)
    const body = typeof init?.body === 'string' ? init.body : ''
    calls.push({ url, method: (init?.method || 'GET').toUpperCase(), body })
    return handler(url, init)
  }) as typeof fetch
  return { calls, restore: () => { globalThis.fetch = previous } }
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } })
}

function alertPayloads(calls: { url: string; body: string }[]): AlertPayload[] {
  return calls
    .filter((call) => call.url === 'https://api.resend.com/emails')
    .map((call) => JSON.parse(call.body) as AlertPayload)
}

function cookieValues(res: Response): string[] {
  const jar = (res as Response & { cookies?: { getAll: () => { value: string }[] } }).cookies
  if (!jar) return []
  return jar.getAll().map((cookie) => cookie.value)
}

async function loginSetsSession(token: string, nowSec: number): Promise<{ set: boolean; stillValidInSixDays: boolean; secondUse: boolean; session: string }> {
  const { GET } = await import('../../app/admin/support/login/route.ts')
  const open = async () => GET(new NextRequest(`https://help.brxs.ca/admin/support/login?t=${encodeURIComponent(token)}`))
  const first = await open()
  const second = await open()
  const firstValues = cookieValues(first)
  const secondValues = cookieValues(second)
  const session = firstValues.find((value) => verifyAdminToken(ADMIN_SECRET, value, nowSec)) || ''
  return {
    set: session.length > 0,
    stillValidInSixDays: firstValues.some((value) => verifyAdminToken(ADMIN_SECRET, value, nowSec + SIX_DAYS)),
    secondUse: secondValues.some((value) => verifyAdminToken(ADMIN_SECRET, value, nowSec)),
    session,
  }
}

async function withSession<T>(session: string, fn: () => Promise<T>): Promise<T> {
  const headers = new Headers()
  headers.set('cookie', `bricks_support_admin=${session}`)
  const cookies = new RequestCookies(headers)
  const work = { incrementalCache: {}, page: '/admin/support', route: '/admin/support' }
  const unit = { type: 'request', phase: 'action', cookies, userspaceMutableCookies: cookies }
  return workAsyncStorage.run(work, () => workUnitAsyncStorage.run(unit, fn))
}

async function sendEditedReply(session: string): Promise<boolean> {
  const { calls, restore } = installFetch(async (url, init) => {
    if (url.startsWith('https://placeholder.supabase.co/rest/v1/support_email_outbound') && (init?.method || 'GET') === 'GET') {
      return json([{
        id: 'draft-1', status: 'shadow', to_email: CUSTOMER, subject: 'Re: Refund', body_text: 'Original draft',
        idempotency_key: 'reply:recv-1', ops_escalation_id: null,
        support_email_messages: { rfc_message_id: '<customer@example.com>' },
      }])
    }
    if (url.startsWith('https://placeholder.supabase.co/rest/v1/') && init?.method === 'PATCH') return new Response(null, { status: 204 })
    if (url === 'https://api.resend.com/emails' && init?.method === 'POST') return json({ id: 'sent-1' })
    throw new Error(`unexpected fetch ${(init?.method || 'GET')} ${new URL(url).host}${new URL(url).pathname}`)
  })
  const previousUrl = process.env.SUPABASE_URL
  const previousKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  process.env.SUPABASE_URL = 'https://placeholder.supabase.co'
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'placeholder-service-role'
  try {
    const { approveAndSend } = await import('../../app/admin/support/actions.ts')
    const form = new FormData()
    form.set('id', 'draft-1')
    form.set('body', EDITED_REPLY)
    await withSession(session, () => approveAndSend(form))
    return calls.some((call) => {
      if (call.url !== 'https://api.resend.com/emails' || call.method !== 'POST') return false
      const payload = JSON.parse(call.body) as { from?: string; to?: string[]; text?: string }
      return String(payload.from || '').includes('help@brxs.ca')
        && (payload.to || []).includes(CUSTOMER)
        && String(payload.text || '').includes(EDITED_REPLY)
    })
  } finally {
    restore()
    if (previousUrl === undefined) delete process.env.SUPABASE_URL
    else process.env.SUPABASE_URL = previousUrl
    if (previousKey === undefined) delete process.env.SUPABASE_SERVICE_ROLE_KEY
    else process.env.SUPABASE_SERVICE_ROLE_KEY = previousKey
  }
}

async function reportFromPayloads(payloads: AlertPayload[], nowSec: number): Promise<Report> {
  const token = leakedToken(payloads, nowSec)
  const report: Report = { ...closed, visitorReceivedAdminLink: Boolean(token) }
  if (!token) return report
  const login = await loginSetsSession(token, nowSec)
  report.loginSetCookie = login.set
  report.acceptedSixDaysLater = login.stillValidInSixDays
  report.secondUseStillWorks = login.secondUse
  if (login.session) report.sentEditedReplyFromHelp = await sendEditedReply(login.session)
  return report
}

function assertClosed(report: Report) {
  assert.deepEqual(report, closed)
}

function receivedEmail(over: { subject: string; text: string; emailId: string }) {
  return {
    from: `Visitor <${VISITOR}>`,
    to: ['help@brxs.ca'],
    subject: over.subject,
    text: over.text,
    headers: {},
    message_id: `<${over.emailId}@evil.example>`,
    authentication: { dkim: 'pass', dmarc: 'pass' },
  }
}

async function postInbound(emailId: string, subject: string, text: string, save: Record<string, unknown>) {
  const { POST } = await import('../../app/api/support/inbound/route.ts')
  const event = {
    type: 'email.received',
    created_at: '2026-11-07T15:00:00Z',
    data: { email_id: emailId, from: `Visitor <${VISITOR}>`, to: ['help@brxs.ca'], subject, message_id: `<${emailId}@evil.example>` },
  }
  const body = JSON.stringify(event)
  const now = Math.floor(Date.now() / 1000)
  const id = `msg_${emailId}`
  const { calls, restore } = installFetch(async (url, init) => {
    if (url === `https://api.resend.com/emails/receiving/${encodeURIComponent(emailId)}`) return json(receivedEmail({ subject, text, emailId }))
    if (url === 'https://os.placeholder.test/api/support/inbound') return json(save, save.ok === false ? 500 : 200)
    if (url === 'https://api.resend.com/emails' && init?.method === 'POST') return json({ id: `alert-${emailId}` })
    throw new Error(`unexpected fetch ${(init?.method || 'GET')} ${new URL(url).host}${new URL(url).pathname}`)
  })
  try {
    const req = new NextRequest('https://help.brxs.ca/api/support/inbound', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'svix-id': id,
        'svix-timestamp': String(now),
        'svix-signature': signForTest(WEBHOOK_SECRET, id, String(now), body),
      },
      body,
    })
    const res = await POST(req)
    const payloads = alertPayloads(calls)
    return { status: res.status, payloads }
  } finally {
    restore()
  }
}

test('inbound help@ mail does not hand the visitor a reusable review session', async () => {
  const snap = snapshotEnv()
  enableReviewCrypto()
  process.env.SUPPORT_INBOUND_ENABLED = 'true'
  process.env.RESEND_INBOUND_API_KEY = 'placeholder-resend-inbound-key'
  process.env.RESEND_INBOUND_WEBHOOK_SECRET = WEBHOOK_SECRET
  process.env.BRICKS_OS_API_URL = 'https://os.placeholder.test'
  process.env.INTERNAL_API_KEY = 'placeholder-internal-key'
  delete process.env.SUPPORT_AUTOSEND_ENABLED
  delete process.env.SUPPORT_SHADOW_MODE
  const now = Math.floor(Date.now() / 1000)
  try {
    const needsKam = await postInbound('recv-needs-kam', 'Refund please', 'I want a refund for my shoot', {
      ok: true, duplicate: false, status: 'escalated', thread_id: 'thread-1', help_no: 1042, outbound_id: 'draft-1',
    })
    const draftWaiting = await postInbound('recv-draft', 'Drone rules?', 'What are the drone rules for a shoot?', {
      ok: true, duplicate: false, status: 'shadow_drafted', thread_id: 'thread-2', help_no: 1043, outbound_id: 'draft-2',
    })
    assert.equal(needsKam.status, 200)
    assert.equal(draftWaiting.status, 200)
    if (needsKam.payloads.length === 0 || draftWaiting.payloads.length === 0) throw new Error('inbound route did not send an owner alert')
    const report = await reportFromPayloads([...needsKam.payloads, ...draftWaiting.payloads], now)
    assertClosed(report)
  } finally {
    restoreEnv(snap)
  }
})

test('help chat handoff does not hand the visitor a reusable review session', async () => {
  const snap = snapshotEnv()
  enableReviewCrypto()
  process.env.HELP_CHAT_ENABLED = 'true'
  process.env.HELP_CHAT_MODE = 'extract'
  process.env.SUPABASE_URL = 'https://placeholder.supabase.co'
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'placeholder-service-role'
  _resetMemory()
  const now = Math.floor(Date.now() / 1000)
  const { calls, restore } = installFetch(async (url, init) => {
    const method = (init?.method || 'GET').toUpperCase()
    if (url.includes('/rest/v1/rpc/')) return json(1)
    if (method === 'POST' && url.includes('/rest/v1/support_cases')) return json([{ id: 'case-1', help_no: 77 }])
    if (method === 'POST' && url.includes('/rest/v1/ops_escalations')) return json([{ id: 'ops-1' }])
    if (method === 'PATCH' && url.includes('/rest/v1/')) return new Response(null, { status: 204 })
    if (url === 'https://api.resend.com/emails' && method === 'POST') return json({ id: 'alert-chat' })
    throw new Error(`unexpected fetch ${method} ${new URL(url).host}${new URL(url).pathname}`)
  })
  try {
    const { POST } = await import('../../app/api/help-chat/escalate/route.ts')
    const req = new NextRequest('https://www.brxs.ca/api/help-chat/escalate', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-real-ip': '203.0.113.10' },
      body: JSON.stringify({
        consent: true,
        email: VISITOR,
        transcript: [{ role: 'user', text: 'I need a person to look at my booking' }],
        pagePath: '/help',
        note: '',
      }),
    })
    const res = await POST(req)
    assert.equal(res.status, 200)
    const payloads = alertPayloads(calls)
    if (payloads.length === 0) throw new Error('chat escalation did not send an owner alert')
    assertClosed(await reportFromPayloads(payloads, now))
  } finally {
    restore()
    restoreEnv(snap)
  }
})

test('fail-open inbox alert does not hand the visitor a reusable review session', async () => {
  const snap = snapshotEnv()
  enableReviewCrypto()
  process.env.SUPPORT_INBOUND_ENABLED = 'true'
  process.env.RESEND_INBOUND_API_KEY = 'placeholder-resend-inbound-key'
  process.env.RESEND_INBOUND_WEBHOOK_SECRET = WEBHOOK_SECRET
  process.env.BRICKS_OS_API_URL = 'https://os.placeholder.test'
  process.env.INTERNAL_API_KEY = 'placeholder-internal-key'
  inboxDbDownAlert.reset()
  const now = Math.floor(Date.now() / 1000)
  try {
    const failed = await postInbound('recv-save-failed', 'Booking question', 'Can I book a shoot next week?', {
      ok: false, error: 'save_failed',
    })
    assert.equal(failed.status, 500)
    if (failed.payloads.length === 0) throw new Error('save failure did not send an owner alert')
    const down = failed.payloads.find((payload) => `${payload.text || ''}\n${payload.html || ''}`.includes('Support inbox database is down'))
    assert.ok(down, 'expected the hourly database-down alert')
    assert.ok(replyAddresses(down).every((address) => address.endsWith('@brxs.ca')))
    const aboutTheVisitor = failed.payloads.filter((payload) => payload !== down)
    if (aboutTheVisitor.length === 0) throw new Error('save failure did not alert about the visitor message')
    assertClosed(await reportFromPayloads(aboutTheVisitor, now))
  } finally {
    inboxDbDownAlert.reset()
    restoreEnv(snap)
  }
})

function textOf(node: unknown): string {
  if (node == null || typeof node === 'boolean') return ''
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(textOf).join(' ')
  if (typeof node === 'object' && node && 'props' in node) {
    const props = (node as { props?: { children?: unknown } }).props
    return textOf(props?.children)
  }
  return ''
}

test('review console stays off on Cloudflare unless SUPPORT_REVIEW_LIVE is set', async () => {
  const snap = snapshotEnv()
  process.env.SUPPORT_ADMIN_SECRET = ADMIN_SECRET
  writeEnv('NODE_ENV', 'production')
  writeEnv('VERCEL_ENV', undefined)
  delete process.env.SUPPORT_REVIEW_LIVE
  process.env.SUPABASE_URL = 'https://placeholder.supabase.co'
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'placeholder-service-role'
  const now = Math.floor(Date.now() / 1000)
  const session = signAdminToken(ADMIN_SECRET, now + 7 * 86400)
  const { restore } = installFetch(async (url, init) => {
    if (url.startsWith('https://placeholder.supabase.co/rest/v1/support_email_outbound') && (init?.method || 'GET') === 'GET') {
      return json([{
        id: 'draft-1', status: 'shadow', mode: 'shadow', needs_kam: true, escalation_reasons: ['refund'],
        to_email: CUSTOMER, subject: 'Re: Refund', body_text: 'Original draft', category: null,
        created_at: '2026-11-07T18:15:33Z', sent_at: null, last_error: null,
        support_email_messages: { from_email: CUSTOMER, subject: 'Refund', text_body: CUSTOMER_MARKER, received_at: '2026-11-07T18:15:33Z' },
        support_email_threads: { help_no: 1042 },
      }])
    }
    throw new Error(`unexpected fetch ${(init?.method || 'GET')} ${new URL(url).host}${new URL(url).pathname}`)
  })
  try {
    const { default: SupportReview } = await import('../../app/admin/support/page.tsx')
    const element = await withSession(session, () => SupportReview({ searchParams: Promise.resolve({}) }))
    const text = textOf(element)
    assert.deepEqual(
      { waiting: text.includes('waiting for your go-ahead'), showsCustomerMail: text.includes(CUSTOMER_MARKER) },
      { waiting: true, showsCustomerMail: false },
    )
  } finally {
    restore()
    restoreEnv(snap)
  }
})
