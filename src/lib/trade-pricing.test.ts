import { test } from 'node:test'
import assert from 'node:assert/strict'
import { tradePrices, tradeFrom, leasingXlPrice, surveyGradePrice, tradePay } from './trade-pricing'
import { ALL_TRADES } from './services'

test('every trade is on sale with a set price for each scope', () => {
  for (const t of ALL_TRADES) {
    assert.equal(t.enabled, true, t.slug)
    const keys = new Set(tradePrices(t.slug).map((p) => p.key))
    for (const s of t.scopes) assert.ok(keys.has(s), `${t.slug}:${s}`)
  }
})

test('handyman and floor plan prices', () => {
  assert.deepEqual(tradePrices('repairs').slice(0, 3).map((p) => p.price), ['$149', '$47.50', '$449'])
  assert.ok(!tradePrices('repairs').some((p) => p.key === 'rep_day'), 'no handyman full day')
  assert.equal(tradeFrom('measurement'), '$99')
  assert.equal(tradeFrom('cleaning'), '$229')
})

test('formulas', () => {
  assert.equal(leasingXlPrice(30000), 1850)
  assert.equal(leasingXlPrice(20000), null)
  assert.equal(surveyGradePrice(12), 1499 + 120 + 650)
})

test('no quote words in client copy', () => {
  for (const t of ALL_TRADES) {
    const text = JSON.stringify([t.description, t.sub, t.h1, t.handles, t.receive])
    assert.doesNotMatch(text, /quot/i, t.slug)
  }
  assert.equal(tradePay('staging')[1].pay, '80% of the price')
})

test('checkout refuses the retired handyman full day', async () => {
  const { priceTrade } = await import('./trade-checkout')
  const r = priceTrade({ trade: 'repairs', scope: 'rep_day', address: '12 King St W, Toronto, ON' })
  assert.equal(r.ok, false)
  const half = priceTrade({ trade: 'repairs', scope: 'rep_half', address: '12 King St W, Toronto, ON' })
  assert.ok(half.ok && half.quote.subtotal_cents === 44900)
})
