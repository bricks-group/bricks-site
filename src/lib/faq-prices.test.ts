import { test } from 'node:test'
import assert from 'node:assert/strict'
import { AGENT_FAQS, PM_FAQS, BROKERAGE_FAQS } from './public-content'
import { OFFICE_SEAT_PRICE_PER_YEAR, OFFICE_SEAT_PRICE_PER_MONTH, SOFTWARE_PLANS } from './catalog'
import { ONE_OFFS } from './propertyCheckout'

// FAQ copy repeats catalog prices; fail if the catalog moves and the FAQs don't.
test('brokerage FAQ seat prices match the catalog', () => {
  for (const v of [...Object.values(OFFICE_SEAT_PRICE_PER_YEAR), ...Object.values(OFFICE_SEAT_PRICE_PER_MONTH)]) {
    assert.ok(BROKERAGE_FAQS[0].a.includes(`$${v}`), `$${v}`)
  }
})

test('property manager FAQ prices match the catalog', () => {
  for (const k of ['pm_turnover', 'pm_condition_report', 'pm_listing_set', 'pm_listing_video', 'pm_building_set']) {
    assert.ok(PM_FAQS[0].a.includes(`$${ONE_OFFS[k].cents / 100}`), k)
  }
})

test('agent FAQ plan prices match the catalog', () => {
  for (const p of SOFTWARE_PLANS) {
    if (p.price === 'Free') continue
    const monthly = p.price.match(/\$[\d,]+/)?.[0]
    assert.ok(monthly && AGENT_FAQS[0].a.includes(monthly), `${p.id} ${p.price}`)
  }
  for (const v of ['$490', '$990', '$1,490']) assert.ok(AGENT_FAQS[0].a.includes(v), v)
})
