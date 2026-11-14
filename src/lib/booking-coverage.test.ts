import assert from 'node:assert/strict'
import { afterEach, describe, it } from 'node:test'
import { NOT_COVERED_MESSAGE, UNAVAILABLE_MESSAGE, interpretCoverage, isNotCoveredCode } from './booking-coverage'
import { POST as coveragePOST } from '../app/api/book/coverage/route'
import { POST as waitlistPOST } from '../app/api/book/coverage-waitlist/route'
import { POST as quotePOST } from '../app/api/quote/route'
import { POST as checkoutPOST } from '../app/api/create-checkout/route'
import { connectingIp, _resetMemory } from './support/rate-limit'

// Three addresses, as the Bricks API answers them (backend/tests/test_booking_coverage.py).
const COVERED = { address: '1 King St W, Toronto, ON', os: { status: 200, body: { ok: true, covered: true, code: 'covered' } } }
const FAR_NORTH = { address: '1 Revillon Rd, Moosonee, ON', os: { status: 200, body: { ok: true, covered: false, code: 'not_covered', message: NOT_COVERED_MESSAGE } } }
const OUT_OF_PROVINCE = { address: '401 W Georgia St, Vancouver, BC', os: { status: 200, body: { ok: true, covered: false, code: 'outside_service_area', message: NOT_COVERED_MESSAGE } } }

describe('booking coverage: client state', () => {
  it('covered address -> covered', () => {
    assert.deepEqual(interpretCoverage(COVERED.os.status, COVERED.os.body), { status: 'covered' })
  })
  it('uncovered Ontario address -> calm not-in-area message', () => {
    assert.deepEqual(interpretCoverage(FAR_NORTH.os.status, FAR_NORTH.os.body), { status: 'not_covered', message: NOT_COVERED_MESSAGE })
  })
  it('out-of-province address -> not in area', () => {
    assert.equal(interpretCoverage(OUT_OF_PROVINCE.os.status, OUT_OF_PROVINCE.os.body).status, 'not_covered')
  })
  it('quote/checkout 409 codes read as not covered', () => {
    assert.equal(interpretCoverage(409, { ok: false, code: 'not_covered' }).status, 'not_covered')
    assert.equal(isNotCoveredCode('outside_service_area'), true)
    assert.equal(isNotCoveredCode('province'), false)
  })
  it('anything else fails closed as an error, never covered', () => {
    for (const [s, b] of [[503, { ok: false, code: 'coverage_unavailable' }], [200, {}], [500, null], [200, { ok: true }]] as const) {
      assert.deepEqual(interpretCoverage(s, b), { status: 'error', message: UNAVAILABLE_MESSAGE })
    }
  })
})

// ── server routes: proxy the Bricks API, fail closed, never charge ──────────
const realFetch = globalThis.fetch
const realKey = process.env.INTERNAL_API_KEY
afterEach(() => {
  globalThis.fetch = realFetch
  if (realKey === undefined) delete process.env.INTERNAL_API_KEY
  else process.env.INTERNAL_API_KEY = realKey
})

function mockOs(handler: (url: string, body: Record<string, unknown>) => { status: number; body: unknown }) {
  const calls: string[] = []
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input)
    calls.push(url)
    const r = handler(url, init?.body ? JSON.parse(String(init.body)) : {})
    return new Response(JSON.stringify(r.body), { status: r.status, headers: { 'Content-Type': 'application/json' } })
  }) as typeof fetch
  return calls
}
const req = (path: string, body: unknown) => new Request(`https://www.brxs.ca${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })

describe('booking coverage: /api/book/coverage', () => {
  it('passes covered / uncovered Ontario / out-of-province through', async () => {
    process.env.INTERNAL_API_KEY = 'test'
    for (const c of [COVERED, FAR_NORTH, OUT_OF_PROVINCE]) {
      mockOs(() => c.os)
      const res = await coveragePOST(req('/api/book/coverage', { address: c.address }))
      const j = await res.json()
      assert.equal(res.status, 200)
      assert.equal(j.covered, c.os.body.covered)
      assert.equal(j.code, c.os.body.code)
    }
  })
  it('fails closed: no key, API down, or garbage -> 503', async () => {
    delete process.env.INTERNAL_API_KEY
    assert.equal((await coveragePOST(req('/api/book/coverage', { address: COVERED.address }))).status, 503)
    process.env.INTERNAL_API_KEY = 'test'
    globalThis.fetch = (async () => { throw new Error('down') }) as typeof fetch
    assert.equal((await coveragePOST(req('/api/book/coverage', { address: COVERED.address }))).status, 503)
    mockOs(() => ({ status: 500, body: { detail: 'boom' } }))
    const res = await coveragePOST(req('/api/book/coverage', { address: COVERED.address }))
    assert.equal(res.status, 503)
    assert.equal((await res.json()).code, 'coverage_unavailable')
  })
  it('forwards the address only — never client lat/lon', async () => {
    process.env.INTERNAL_API_KEY = 'test'
    let sent: Record<string, unknown> = {}
    mockOs((_url, body) => {
      sent = body
      return COVERED.os
    })
    const res = await coveragePOST(req('/api/book/coverage', { address: COVERED.address, lat: 43.65, lon: -79.38, province: 'ON' }))
    assert.equal(res.status, 200)
    assert.equal(sent.address, COVERED.address)
    assert.equal('lat' in sent, false)
    assert.equal('lon' in sent, false)
    assert.equal('lng' in sent, false)
    assert.equal('province' in sent, false)
  })
})

describe('booking coverage: /api/quote and /api/create-checkout (bypassed UI)', () => {
  const notCovered = (code: string) => ({ status: 409, body: { ok: false, code, error: NOT_COVERED_MESSAGE, detail: NOT_COVERED_MESSAGE } })

  it('quote: uncovered Ontario and out-of-province -> 409, no quote', async () => {
    process.env.INTERNAL_API_KEY = 'test'
    for (const code of ['not_covered', 'outside_service_area']) {
      mockOs(() => notCovered(code))
      const res = await quotePOST(req('/api/quote', { address: FAR_NORTH.address, package_id: 'essentials' }))
      const j = await res.json()
      assert.equal(res.status, 409)
      assert.equal(j.code, code)
      assert.equal(j.quote, undefined)
    }
  })
  it('quote: covered address returns the API quote', async () => {
    process.env.INTERNAL_API_KEY = 'test'
    mockOs(() => ({ status: 200, body: { ok: true, quote: { total: 300, assignee_id: 'v1' } } }))
    const res = await quotePOST(req('/api/quote', { address: COVERED.address, package_id: 'essentials' }))
    assert.equal(res.status, 200)
    assert.equal((await res.json()).quote.assignee_id, 'v1')
  })
  it('quote: strips vendor home coordinates from the public response', async () => {
    process.env.INTERNAL_API_KEY = 'test'
    mockOs(() => ({ status: 200, body: { ok: true, quote: { total: 300, assignee_id: 'v1', vendor_base_lat: 43.589, vendor_base_lng: -79.644, _base_lat: 43.589 } } }))
    const res = await quotePOST(req('/api/quote', { address: COVERED.address, package_id: 'essentials' }))
    const q = (await res.json()).quote
    assert.equal(res.status, 200)
    assert.equal(q.assignee_id, 'v1')
    assert.equal(q.total, 300)
    for (const k of ['vendor_base_lat', 'vendor_base_lng', 'vendor_home_lat', 'vendor_home_lng', '_base_lat', '_base_lng']) {
      assert.equal(k in q, false, k)
    }
  })
  it('quote: no local fallback when the API is unreachable -> 503', async () => {
    delete process.env.INTERNAL_API_KEY
    const res = await quotePOST(req('/api/quote', { address: COVERED.address, package_id: 'essentials' }))
    assert.equal(res.status, 503)
    assert.equal((await res.json()).code, 'coverage_unavailable')
  })

  const checkoutBody = (address: string) => ({
    agent_name: 'Test Agent', email: 'agent@example.com', phone: '4165550100', brokerage: 'Test Realty',
    property_address: address, package_id: 'essentials', preferred_date: '2026-12-01',
    selected_slot_start: '2026-12-01T15:00:00.000Z', selected_slot_end: '2026-12-01T16:00:00.000Z',
    timezone: 'America/Toronto', terms_accepted: true, privacy_accepted: true,
  })

  const realStripe = process.env.STRIPE_SECRET_KEY
  afterEach(() => { if (realStripe === undefined) delete process.env.STRIPE_SECRET_KEY; else process.env.STRIPE_SECRET_KEY = realStripe })
  for (const [label, addr, code, stripe] of [
    ['uncovered Ontario', FAR_NORTH.address, 'not_covered', 'sk_test_local'],
    ['out-of-province', OUT_OF_PROVINCE.address, 'outside_service_area', 'sk_test_local'],
    ['uncovered Ontario (API checkout path)', FAR_NORTH.address, 'not_covered', ''],
  ] as const) {
    it(`create-checkout: ${label} -> 409 and Stripe is never called`, async () => {
      process.env.INTERNAL_API_KEY = 'test'
      if (stripe) process.env.STRIPE_SECRET_KEY = stripe
      else delete process.env.STRIPE_SECRET_KEY
      const calls = mockOs((url) => (url.includes('stripe.com') ? { status: 200, body: { id: 'cs_x', url: 'https://checkout' } } : notCovered(code)))
      const res = await checkoutPOST(req('/api/create-checkout', checkoutBody(addr)))
      const j = await res.json()
      assert.equal(res.status, 409, JSON.stringify(j))
      assert.equal(j.code, code)
      assert.equal(calls.some((u) => u.includes('stripe.com')), false)
    })
  }
  it('create-checkout: API lookup failure -> no charge', async () => {
    process.env.INTERNAL_API_KEY = 'test'
    process.env.STRIPE_SECRET_KEY = 'sk_test_local'
    const calls = mockOs((url) => (url.includes('stripe.com') ? { status: 200, body: { id: 'cs_x' } } : { status: 503, body: { ok: false, code: 'coverage_unavailable', error: UNAVAILABLE_MESSAGE } }))
    const res = await checkoutPOST(req('/api/create-checkout', checkoutBody(COVERED.address)))
    assert.equal(res.status, 503)
    assert.equal(calls.some((u) => u.includes('stripe.com')), false)
  })
})

describe('connectingIp and coverage waitlist', () => {
  afterEach(() => _resetMemory())

  it('keys only on CF-Connecting-IP, never the first X-Forwarded-For hop', () => {
    const h = new Headers({
      'CF-Connecting-IP': '203.0.113.9',
      'X-Forwarded-For': '198.51.100.1, 10.0.0.1',
      'X-Real-IP': '192.0.2.1',
    })
    assert.equal(connectingIp(h), '203.0.113.9')
    assert.equal(connectingIp(new Headers({ 'X-Forwarded-For': '198.51.100.1', 'x-real-ip': '192.0.2.1' })), 'unknown')
  })

  it('returns 400 when CF-Connecting-IP is missing and does not call OS', async () => {
    process.env.INTERNAL_API_KEY = 'test'
    _resetMemory()
    let called = 0
    mockOs(() => {
      called += 1
      return { status: 200, body: { ok: true } }
    })
    const res = await waitlistPOST(new Request('https://www.brxs.ca/api/book/coverage-waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Forwarded-For': '198.51.100.1' },
      body: JSON.stringify({ email: 'a@example.com', address: FAR_NORTH.address, flow: 'book' }),
    }))
    assert.equal(res.status, 400)
    const j = await res.json()
    assert.equal(j.ok, false)
    assert.equal(called, 0)
  })

  it('forwards CF-Connecting-IP to OS and returns 200; a ninth request from the same IP is 429', async () => {
    process.env.INTERNAL_API_KEY = 'test'
    _resetMemory()
    const headersSeen: string[] = []
    mockOs((_url, _body) => {
      return { status: 200, body: { ok: true } }
    })
    // Capture headers by wrapping fetch after mockOs
    const inner = globalThis.fetch
    globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
      const h = new Headers(init?.headers)
      headersSeen.push(h.get('cf-connecting-ip') || '')
      return inner(input, init)
    }) as typeof fetch
    const waitReq = (n: number) => new Request('https://www.brxs.ca/api/book/coverage-waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'CF-Connecting-IP': '203.0.113.40' },
      body: JSON.stringify({ email: `a${n}@example.com`, address: FAR_NORTH.address, flow: 'book' }),
    })
    for (let i = 0; i < 8; i++) {
      const res = await waitlistPOST(waitReq(i))
      assert.equal(res.status, 200, `request ${i}`)
    }
    assert.ok(headersSeen.every((ip) => ip === '203.0.113.40'))
    const limited = await waitlistPOST(waitReq(8))
    assert.equal(limited.status, 429)
    const j = await limited.json()
    assert.equal(j.ok, false)
  })
})

