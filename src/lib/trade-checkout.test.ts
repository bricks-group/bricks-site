import assert from 'node:assert/strict'
import { priceTrade, VENDOR_TYPE } from './trade-checkout'

assert.equal(VENDOR_TYPE.repairs, 'handyman')
const ok = priceTrade({ trade: 'repairs', scope: 'rep_1h', address: '100 Queen St W, Toronto, ON' })
assert.equal(ok.ok, true)
if (ok.ok) {
  assert.equal(ok.quote.subtotal_cents, 14900)
  assert.equal(ok.quote.vendor_type, 'handyman')
  assert.ok(ok.quote.total_cents > ok.quote.subtotal_cents)
}
const bad = priceTrade({ trade: 'staging', scope: 'nope', address: '100 Queen St W, Toronto, ON' })
assert.equal(bad.ok, false)
const insp = priceTrade({ trade: 'inspections', scope: 'insp_condo', address: '10 Main St, Vancouver, BC' })
assert.equal(insp.ok, false)
console.log('trade-checkout.test.ts ok')
