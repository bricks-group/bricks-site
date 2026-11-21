import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
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
    'AJANI SHORTERMERCHANT', '6330 Montevideo Road', '(289) 312-7425', 'help@brxs.ca', '798370003 RT0001', // supplier + GST/HST number
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

test('sendCopyForSession sends once and marks the session', async () => {
  const calls: string[] = []
  const f = (async (u: string, init: any = {}) => {
    calls.push((init.method || 'GET') + ' ' + u.replace('https://', '').slice(0, 40))
    if (u.includes('stripe.com')) return { ok: true, json: async () => session }
    return { ok: true }
  }) as any
  const out = await sendCopyForSession('cs_test_123', { STRIPE_SECRET_KEY: 'sk_test_x', RESEND_API_KEY: 're_x', BOOKING_COPY_TO_OVERRIDE: 'delivered@resend.dev' }, f)
  assert.equal(out.ok, true)
  assert.ok(calls.some((c) => c.startsWith('POST api.resend.com')) && calls.some((c) => c.startsWith('POST api.stripe.com')))
  const again = await sendCopyForSession('cs_test_123', { STRIPE_SECRET_KEY: 'sk_test_x' }, (async () => ({ ok: true, json: async () => ({ ...session, metadata: { ...session.metadata, copy_sent_at: 'x' } }) })) as any)
  assert.equal(again.already_sent, true)
})

test('quote lines fit Stripe metadata and skip included items', () => {
  const s = quoteLinesForCopy({ photo_rate: 149, drone_rate: 99, floor_plan_included: true, travel_fee: 0, addons: [{ label: 'Twilight', amount: 150 }] })
  assert.ok(s.length > 0 && s.length <= 500)
  assert.ok(!s.includes('Branded floor plan'))
})

test('checkout review step shows supplier, total, cancel, weather and an edit or leave path', () => {
  const wiz = readFileSync(new URL('../app/book/BookingWizard.tsx', import.meta.url), 'utf8')
  for (const n of ['SUPPLIER.legalName', 'SUPPLIER.gstHst', 'What you pay today', 'Weather:', 'Edit your details', 'leave without booking', 'Accept &amp; pay'.replace('&amp;', '&')]) assert.ok(wiz.includes(n), n)
})
