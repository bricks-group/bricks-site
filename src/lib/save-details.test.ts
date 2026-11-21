import { test } from 'node:test'
import assert from 'node:assert/strict'
import { detailsFromPaidSession } from './save-details'

const now = 1_800_000_000

test('only a paid, recent session gives details, taken from Stripe', () => {
  assert.deepEqual(detailsFromPaidSession({ status: 'open', payment_status: 'unpaid', created: now }, now), { error: 'not_paid' })
  assert.deepEqual(detailsFromPaidSession({ status: 'complete', payment_status: 'paid', created: now - 90000 }, now), { error: 'expired' })
  const ok = detailsFromPaidSession({
    status: 'complete', payment_status: 'paid', created: now - 60,
    customer_email: 'Jane@Example.com',
    metadata: { agent_name: 'Jane Agent', phone: '416-555-0100', brokerage: 'North Realty' },
  }, now)
  assert.deepEqual(ok, { email: 'jane@example.com', data: { signup_source: 'www_booking', name: 'Jane Agent', full_name: 'Jane Agent', phone: '416-555-0100', brokerage: 'North Realty' } })
  assert.deepEqual(detailsFromPaidSession({ status: 'complete', payment_status: 'paid', created: now }, now), { error: 'no_email' })
})
