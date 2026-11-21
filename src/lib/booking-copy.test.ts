import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import { buildBookingCopy, quoteLinesForCopy, sendBookingCopy, sendCopyForSession, type CopySession } from './booking-copy'

const session: CopySession = {
  id: 'cs_test_123', created: 1795300000, amount_total: 11187 + 24800 - 11187 + 0, payment_status: 'paid',
  metadata: {
    email: 'agent@example.com', agent_name: 'Alex Agent', brokerage: 'Example Realty', property_address: '1 Test St, Mississauga, ON',
    package_interest: 'Essentials', selected_slot_start: '2026-12-02T15:00:00Z', timezone: 'America/Toronto',
    subtotal_cents: '24800', tax_cents: '3224', total_cents: '28024', tax_type: 'HST', tax_rate: '0.13',
    terms_version: '2026-11-21', terms_accepted_at: '2026-11-21T18:00:00Z', quote_id: 'q_abc123',
    quote_lines: JSON.stringify([['HDR photography', 149], ['Licensed drone', 99]]),
  },
}
session.amount_total = 28024

test('written copy carries every CPA s.32/33 and CRA invoice item', () => {
  const c = buildBookingCopy(session)!
  for (const needle of [
    'Ajani Shorter Merchant', 'sole proprietor operating as Bricks', '6330 Montevideo Road', '(289) 312-7425', 'help@brxs.ca', '798370003 RT0001', // supplier + GST/HST number
    'Alex Agent', '2026-11-21', // consumer name + agreement date
    'HDR photography', '$149.00', 'Licensed drone', '$99.00', '$32.24', '$280.24', 'Total paid (CAD)', // itemized, tax, total
    '1 Test St', 'December 2, 2026', // place + date
    '24 hours or more', 'weather', 'refund that part', // cancel + weather partial
    'q_abc123', 'cs_test_123', '2026-11-21', // quote id, reference, terms version
  ]) assert.ok(c.text.includes(needle), `missing: ${needle}`)
  assert.equal(c.to, 'agent@example.com')
})

test('no copy for unpaid sessions or missing email', () => {
  assert.equal(buildBookingCopy({ ...session, payment_status: 'unpaid' }), null)
  assert.equal(buildBookingCopy({ ...session, metadata: { ...session.metadata, email: '' } }), null)
})

test('escapes client-supplied text in html', () => {
  const c = buildBookingCopy({ ...session, metadata: { ...session.metadata, agent_name: '<script>x</script>' } })!
  assert.ok(!c.html.includes('<script>'))
})

test('send redirects to override address and never needs the real customer in previews', async () => {
  let body: any
  const f = (async (_u: string, init: any) => { body = JSON.parse(init.body); return { ok: true } }) as any
  const out = await sendBookingCopy(buildBookingCopy(session)!, { RESEND_API_KEY: 're_x', BOOKING_COPY_TO_OVERRIDE: 'delivered@resend.dev' }, f)
  assert.equal(out.ok, true)
  assert.deepEqual(body.to, ['delivered@resend.dev'])
})

function stripeMock(opts: { failMark?: boolean; failResend?: boolean } = {}) {
  const meta: Record<string, string> = { ...(session.metadata as Record<string, string>) }
  const log: { u: string; m: string; h: any }[] = []
  const f = (async (u: string, init: any = {}) => {
    const m = init.method || 'GET'
    log.push({ u, m, h: init.headers })
    if (u.includes('api.resend.com')) return { ok: !opts.failResend }
    if (m === 'POST') {
      const p = new URLSearchParams(init.body)
      if (opts.failMark && p.has('metadata[copy_sent_at]')) return { ok: false }
      for (const [k, v] of p) meta[k.replace('metadata[', '').replace(']', '')] = v
      return { ok: true, json: async () => ({}) }
    }
    return { ok: true, json: async () => ({ ...session, metadata: { ...meta } }) }
  }) as any
  return { f, meta, log }
}
const ENV = { STRIPE_SECRET_KEY: 'sk_test_x', RESEND_API_KEY: 're_x', BOOKING_COPY_TO_OVERRIDE: 'delivered@resend.dev' }

test('sendCopyForSession sends once with an idempotency key and marks the session', async () => {
  const { f, meta, log } = stripeMock()
  const out = await sendCopyForSession('cs_test_123', ENV, f)
  assert.equal(out.ok, true)
  const resend = log.filter((c) => c.u.includes('api.resend.com'))
  assert.equal(resend.length, 1)
  assert.equal(resend[0].h['Idempotency-Key'], 'booking-copy-cs_test_123')
  assert.ok(meta.copy_sent_at)
  const again = await sendCopyForSession('cs_test_123', ENV, f)
  assert.equal(again.already_sent, true)
  assert.equal(log.filter((c) => c.u.includes('api.resend.com')).length, 1)
})

test('a failed copy_sent_at write is reported, not swallowed', async () => {
  const { f } = stripeMock({ failMark: true })
  const out = await sendCopyForSession('cs_test_123', ENV, f)
  assert.equal(out.ok, false)
  assert.equal(out.error, 'mark_failed')
})

test('a fresh claim by another caller blocks a second send', async () => {
  const { f, meta, log } = stripeMock()
  meta.copy_claim = `abc.${Date.now()}`
  const out = await sendCopyForSession('cs_test_123', ENV, f)
  assert.equal(out.already_sent, true)
  assert.equal(log.filter((c) => c.u.includes('api.resend.com')).length, 0)
})

test('a failed send leaves the session unmarked', async () => {
  const { f, meta } = stripeMock({ failResend: true })
  const out = await sendCopyForSession('cs_test_123', ENV, f)
  assert.equal(out.error, 'send_failed')
  assert.ok(!meta.copy_sent_at)
})

test('there is no public booking-copy route', () => {
  assert.ok(!existsSync(new URL('../app/api/booking-copy/route.ts', import.meta.url)))
})

test('quote lines fit Stripe metadata and skip included items', () => {
  const s = quoteLinesForCopy({ photo_rate: 149, drone_rate: 99, floor_plan_included: true, travel_fee: 0, addons: [{ label: 'Twilight', amount: 150 }] })
  assert.ok(s.length > 0 && s.length <= 500)
  assert.ok(!s.includes('Branded floor plan'))
})

test('checkout review step shows supplier, total, cancel, weather and an edit or leave path', () => {
  const wiz = readFileSync(new URL('../app/book/BookingWizard.tsx', import.meta.url), 'utf8')
  for (const n of ['SUPPLIER.legalPartyLine', 'SUPPLIER.gstHst', 'What you pay today', 'Weather:', 'Edit your details', 'leave without booking', 'Accept &amp; pay'.replace('&amp;', '&')]) assert.ok(wiz.includes(n), n)
})
