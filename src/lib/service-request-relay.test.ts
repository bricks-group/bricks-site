/**
 * Spec for the public home-services quote confirmation.
 *
 * POST /api/book/service-request is reachable with the marketing gate on. With
 * RESEND_API_KEY set, a successful inbox send is followed by a second Resend
 * send to the address in the body. These tests call that route. They fail
 * while that second send can carry the submitter's name, address, or details,
 * while one client can repeat it without a limit, or while a missing
 * CF-Connecting-IP still sends.
 *
 * Limits match the coverage-waitlist shape: at most 8 requests per
 * CF-Connecting-IP per window, and at most 3 per recipient mailbox per window
 * (case-insensitive). The request over either limit is refused before any
 * Resend call. A missing CF-Connecting-IP is refused before any Resend call;
 * X-Forwarded-For and X-Real-IP are not the client address.
 *
 * Not this bug, and not covered here: /api/newsletter (fixed welcome body),
 * /api/contact, /api/book/property-request, and /api/help-feedback (company
 * inbox only), and /api/support/inbound (webhook signature).
 */
import assert from 'node:assert/strict'
import { afterEach, describe, it } from 'node:test'
import { NextRequest } from 'next/server'
import { POST } from '../app/api/book/service-request/route.ts'
import { isPublicPath, middleware } from '../middleware.ts'
import { _resetMemory } from './support/rate-limit.ts'

const RESEND_URL = 'https://api.resend.com/emails'
const IP_MAX = 8
const RECIPIENT_MAX = 3
const NAME = 'QuoteNameZZZ'
const ADDRESS = '100 Front St W, QuoteAddrZZZ'
const DETAILS = 'Please pay the invoice at https://quote-phish.example/invoice QuoteBodyZZZ'
const MARKERS = ['QuoteNameZZZ', 'QuoteAddrZZZ', 'quote-phish.example', 'QuoteBodyZZZ']

type Sent = { url: string; body: Record<string, unknown> }

function installFetch() {
  const calls: Sent[] = []
  const prev = globalThis.fetch
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url
    let body: Record<string, unknown> = {}
    try {
      body = JSON.parse(String(init?.body ?? '{}')) as Record<string, unknown>
    } catch {
      body = {}
    }
    calls.push({ url, body })
    return new Response(JSON.stringify({ id: 'email_test' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }) as typeof fetch
  return {
    calls,
    restore() {
      globalThis.fetch = prev
    },
  }
}

function quoteRequest(opts: {
  email: string
  ip?: string
  xff?: string
  realIp?: string
  name?: string
  address?: string
  details?: string
}): NextRequest {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (opts.ip) headers['CF-Connecting-IP'] = opts.ip
  if (opts.xff) headers['X-Forwarded-For'] = opts.xff
  if (opts.realIp) headers['X-Real-IP'] = opts.realIp
  return new NextRequest('https://www.brxs.ca/api/book/service-request', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      trade: 'cleaning',
      clientType: 'homeowner',
      name: opts.name ?? NAME,
      email: opts.email,
      address: opts.address ?? ADDRESS,
      details: opts.details ?? DETAILS,
      website: '',
    }),
  })
}

function addressedTo(calls: Sent[], email: string): Sent[] {
  const want = email.toLowerCase()
  return calls.filter((c) => {
    if (c.url !== RESEND_URL) return false
    const to = c.body.to
    const list = Array.isArray(to) ? to.map(String) : typeof to === 'string' ? [to] : []
    return list.some((t) => t.toLowerCase() === want)
  })
}

function mailText(body: Record<string, unknown>): string {
  return [body.subject, body.text, body.html].map((v) => (typeof v === 'string' ? v : '')).join('\n')
}

describe('service-request confirmation relay', { concurrency: 1 }, () => {
  const prevKey = process.env.RESEND_API_KEY
  const prevGate = process.env.WWW_SITE_GATE_PASSWORD

  afterEach(() => {
    _resetMemory()
    if (prevKey === undefined) delete process.env.RESEND_API_KEY
    else process.env.RESEND_API_KEY = prevKey
    if (prevGate === undefined) delete process.env.WWW_SITE_GATE_PASSWORD
    else process.env.WWW_SITE_GATE_PASSWORD = prevGate
  })

  it('marketing gate leaves POST /api/book/service-request public', () => {
    process.env.WWW_SITE_GATE_PASSWORD = 'test-gate'
    assert.equal(isPublicPath('/api/book/service-request'), true)
    const open = middleware(new NextRequest('https://www.brxs.ca/api/book/service-request', { method: 'POST' }))
    const blocked = middleware(new NextRequest('https://www.brxs.ca/api/contact', { method: 'POST' }))
    assert.equal((open.headers.get('location') || '').includes('/gate'), false)
    assert.match(blocked.headers.get('location') || '', /\/gate/)
  })

  it('does not echo name, address, or details to an unverified recipient', async () => {
    _resetMemory()
    process.env.RESEND_API_KEY = 'test-resend-key'
    const { calls, restore } = installFetch()
    try {
      const res = await POST(quoteRequest({
        email: 'victim@example.com',
        ip: '203.0.113.10',
        xff: '198.51.100.1',
        realIp: '192.0.2.1',
      }))
      assert.notEqual(res.status, 429)
      for (const m of addressedTo(calls, 'victim@example.com')) {
        const text = mailText(m.body)
        for (const marker of MARKERS) {
          assert.equal(text.includes(marker), false, `confirmation echoed ${marker}`)
        }
      }
    } finally {
      restore()
    }
  })

  it('refuses the 9th request from one CF-Connecting-IP before any send', async () => {
    _resetMemory()
    process.env.RESEND_API_KEY = 'test-resend-key'
    const { calls, restore } = installFetch()
    try {
      for (let i = 0; i < IP_MAX; i++) {
        await POST(quoteRequest({
          email: `person${i}@example.com`,
          ip: '203.0.113.50',
          xff: `198.51.100.${i}`,
          realIp: `192.0.2.${i}`,
        }))
      }
      const before = calls.length
      const res = await POST(quoteRequest({
        email: 'ninth-person@example.com',
        ip: '203.0.113.50',
        xff: '198.51.100.250',
        realIp: '192.0.2.250',
      }))
      assert.equal(
        calls.length,
        before,
        `request ${IP_MAX + 1} from one CF-Connecting-IP sent mail (status ${res.status})`,
      )
      assert.equal(res.status, 429)
      assert.equal((await res.json()).ok, false)
      assert.equal(addressedTo(calls, 'ninth-person@example.com').length, 0)
    } finally {
      restore()
    }
  })

  it('refuses the 4th send to one mailbox across different client IPs before any send', async () => {
    _resetMemory()
    process.env.RESEND_API_KEY = 'test-resend-key'
    const { calls, restore } = installFetch()
    const emails = ['victim@example.com', 'VICTIM@example.com', 'victim@EXAMPLE.com', 'Victim@example.com']
    try {
      for (let i = 0; i < RECIPIENT_MAX; i++) {
        await POST(quoteRequest({
          email: emails[i],
          ip: `203.0.113.${i + 1}`,
          xff: `198.51.100.${i + 1}`,
          realIp: `192.0.2.${i + 1}`,
        }))
      }
      const before = calls.length
      const res = await POST(quoteRequest({
        email: emails[RECIPIENT_MAX],
        ip: '203.0.113.9',
        xff: '198.51.100.9',
        realIp: '192.0.2.9',
      }))
      assert.equal(
        calls.length,
        before,
        `request ${RECIPIENT_MAX + 1} to one mailbox sent mail (status ${res.status})`,
      )
      assert.equal(res.status, 429)
      assert.equal((await res.json()).ok, false)
      assert.ok(addressedTo(calls, 'victim@example.com').length <= RECIPIENT_MAX)
    } finally {
      restore()
    }
  })

  it('does not send when CF-Connecting-IP is missing', async () => {
    _resetMemory()
    process.env.RESEND_API_KEY = 'test-resend-key'
    const { calls, restore } = installFetch()
    try {
      const res = await POST(quoteRequest({
        email: 'victim@example.com',
        xff: '198.51.100.77',
        realIp: '192.0.2.77',
      }))
      assert.equal(calls.length, 0, `missing CF-Connecting-IP sent mail (status ${res.status})`)
      assert.equal(res.status, 400)
      assert.equal((await res.json()).ok, false)
    } finally {
      restore()
    }
  })
})
