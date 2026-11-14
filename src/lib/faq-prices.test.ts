import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { AGENT_FAQS, PM_FAQS, BROKERAGE_FAQS, SITE_PROGRESS_FAQS } from './public-content'
import { OFFICE_SEAT_PRICE_PER_YEAR, OFFICE_SEAT_PRICE_PER_MONTH, SOFTWARE_PLANS } from './catalog'
import { ONE_OFFS, ONE_OFFS_FOR, PROPERTY_PRICE_GROUPS, money } from './propertyCheckout'
import { PER_VISIT, PLANS, SITE_PRICE_GROUPS, fmt } from './commercial'
import { BROKERAGE_SOFTWARE_ONTARIO_FAQS, DRONE_PROGRESS_REPORTS_ONTARIO_BUILDERS_FAQS, MOVE_OUT_CONDITION_REPORT_ONTARIO_FAQS } from './guide-faqs'

const read = (p: string) => readFileSync(join(__dirname, '..', '..', p), 'utf8')

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

// Kam (2026-11-14): the agents FAQ names no plans and shows no prices; the pricing page does.
test('agent FAQ has no plan names or prices', () => {
  for (const f of AGENT_FAQS) {
    const text = `${f.q} ${f.a}`
    assert.ok(!/\$\d/.test(text), `price in: ${f.q}`)
    for (const p of SOFTWARE_PLANS) assert.ok(!text.includes(p.name), `${p.name} in: ${f.q}`)
  }
})

// W2: the server-rendered lists above the /book/property and /book/site forms come from the
// same tables the forms charge, and both pages render them.
test('/book/property price list is the checkout table', () => {
  const listed = PROPERTY_PRICE_GROUPS.flatMap((g) => g.items)
  const keys = [...new Set([...ONE_OFFS_FOR.property_manager, ...ONE_OFFS_FOR.commercial, ...ONE_OFFS_FOR.investor])]
  assert.equal(listed.length, keys.length)
  for (const k of keys) assert.ok(listed.some((i) => i.name === ONE_OFFS[k].name && i.price === money(ONE_OFFS[k].cents)), k)
  assert.match(read('src/app/book/property/page.tsx'), /<BookPriceList groups=\{PROPERTY_PRICE_GROUPS\}/)
})

test('/book/site price list is the site catalog', () => {
  const listed = SITE_PRICE_GROUPS.flatMap((g) => g.items.map((i) => i.price)).join(' | ')
  for (const v of PER_VISIT) assert.ok(listed.includes(fmt(v.price)), v.key)
  for (const p of PLANS) for (const r of p.rows) assert.ok(listed.includes(fmt(r.price)), `${p.kind} ${r.cadence}`)
  assert.match(read('src/app/book/site/page.tsx'), /<BookPriceList groups=\{SITE_PRICE_GROUPS\}/)
})

test('W2 guide and hub FAQ prices match the catalog', () => {
  const seats = BROKERAGE_SOFTWARE_ONTARIO_FAQS.find((f) => f.q.includes('month to month'))!.a
  for (const v of [...Object.values(OFFICE_SEAT_PRICE_PER_YEAR), ...Object.values(OFFICE_SEAT_PRICE_PER_MONTH)]) assert.ok(seats.includes(`$${v}`), `$${v}`)
  const report = MOVE_OUT_CONDITION_REPORT_ONTARIO_FAQS.find((f) => f.q.includes('cost'))!.a
  assert.ok(report.startsWith(money(ONE_OFFS.pm_condition_report.cents)), report)
  const site = SITE_PROGRESS_FAQS.find((f) => f.q.includes('construction progress report cost'))!.a
  for (const v of [PER_VISIT[0].price, PER_VISIT[1].price, PLANS[0].rows[0].price]) assert.ok(site.includes(fmt(v)), fmt(v))
  assert.ok(DRONE_PROGRESS_REPORTS_ONTARIO_BUILDERS_FAQS.every((f) => !/\$\d{3}/.test(f.a.replace('$2M', ''))), 'post 03 FAQs carry no service prices')
})

test('/property-managers copy repeats the checkout prices', () => {
  const pm = read('src/app/property-managers/page.tsx')
  for (const k of ['pm_condition_report', 'pm_turnover']) assert.ok(pm.includes(money(ONE_OFFS[k].cents)), k)
  assert.equal(PM_FAQS.length, 9)
})
