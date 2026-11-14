import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { AGENT_FAQS, PM_FAQS, BROKERAGE_FAQS, SITE_PROGRESS_FAQS, TEAMS_FAQS, COMMERCIAL_FAQS, INVESTORS_FAQS, REITS_FAQS } from './public-content'
import { PRICING_FAQS, BOOK_FAQS, TRAVEL_ANSWER } from './faq-content'
import { CORE_FROM, RUSH_FLAT, TOUR_RANGE, TWILIGHT_RANGE, VISIT_PRICE_LABEL, TRAVEL_FREE_KM, TRAVEL_PER_KM } from './pricing'
import { faqPageSchema } from './schema'
import { OFFICE_SEAT_PRICE_PER_YEAR, OFFICE_SEAT_PRICE_PER_MONTH, SOFTWARE_PLANS, TEAM_EXTRA_SEAT } from './catalog'
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

// W2.1: /pricing and /book build the visible FAQ and the FAQPage JSON-LD from one array, with catalog prices.
for (const [page, faqs, files] of [
  ['/pricing', PRICING_FAQS, ['src/app/pricing/page.tsx']],
  ['/book', BOOK_FAQS, ['src/app/book/page.tsx', 'src/app/book/BookingWizard.tsx']],
] as const) {
  test(`${page} FAQ schema is generated from the visible FAQ array`, () => {
    const src = files.map(read).join('\n')
    assert.doesNotMatch(src, /'@type': 'FAQPage'/, 'no hand-written FAQPage')
    assert.doesNotMatch(src, /className="qa"/, 'no hand-written visible Q&As')
    assert.match(src, page === '/book' ? /faqPageSchema\(BOOK_FAQS\)/ : /faqPageSchema\(PRICING_FAQS\)/)
    assert.match(src, page === '/book' ? /<RichFaqList faqs=\{BOOK_FAQS\}/ : /<RichFaqList faqs=\{PRICING_FAQS\}/)
    const schema = faqPageSchema(faqs)
    assert.equal(schema.mainEntity.length, faqs.length)
    for (const f of faqs) {
      assert.equal(f.a, f.parts.map((p) => (typeof p === 'string' ? p : p.label)).join(''), f.q)
      assert.doesNotMatch(`${f.q} ${f.a}`, /'/, `straight apostrophe in: ${f.q}`)
    }
  })
}

// Kam (2026-11-14): /pricing keeps the calm FAQ (no per-tier lists, Brixton named); /book keeps its catalog prices.
test('/pricing FAQ is the calm version; /book FAQ prices come from the catalog', () => {
  const all = (fs: readonly { a: string }[]) => fs.map((f) => f.a).join(' ')
  const p = all(PRICING_FAQS), b = all(BOOK_FAQS)
  for (const t of [p, b]) assert.ok(t.includes(TRAVEL_ANSWER))
  assert.ok(b.includes(`$${CORE_FROM}.`))
  assert.ok(TRAVEL_ANSWER.includes(`first ${TRAVEL_FREE_KM} km`) && TRAVEL_ANSWER.includes(`$${TRAVEL_PER_KM.toFixed(2)} per additional km`))
  assert.ok(PRICING_FAQS.some((f) => f.q === 'Can I add Brixton AI without changing plan?' && f.a === 'Yes. Brixton AI is one switch on a paid plan. Diamond includes it.'))
  const bro = PRICING_FAQS.find((f) => f.q === 'Brokerage or individual plan?')!.a
  assert.ok(bro.startsWith(`Agents start free, or pick a paid plan. Offices buy seats, from $${OFFICE_SEAT_PRICE_PER_YEAR.franchise} a year.`), bro)
  const noTravel = PRICING_FAQS.filter((f) => f.a !== TRAVEL_ANSWER && f !== PRICING_FAQS.find((x) => x.q === 'Brokerage or individual plan?'))
  for (const f of noTravel) assert.ok(!/\$\d/.test(f.a), `price in: ${f.q}`)
  for (const v of Object.values(OFFICE_SEAT_PRICE_PER_MONTH)) assert.ok(!p.includes(`$${v} monthly`), `$${v} monthly`)
  for (const pl of SOFTWARE_PLANS) assert.ok(!p.includes(pl.name) || pl.name === 'Diamond', pl.name)
  assert.ok(b.includes(`+$${RUSH_FLAT}`) && b.includes(TWILIGHT_RANGE) && b.includes(TOUR_RANGE))
})

test('team FAQ has no prices; commercial, investor and REIT FAQs use catalog prices', () => {
  // Kam (2026-11-14): no plan names or prices in the /teams FAQ.
  for (const f of TEAMS_FAQS) {
    assert.ok(!/\$\d/.test(`${f.q} ${f.a}`), `price in: ${f.q}`)
    for (const pl of SOFTWARE_PLANS) assert.ok(!`${f.q} ${f.a}`.includes(pl.name), `${pl.name} in: ${f.q}`)
  }
  assert.doesNotMatch(read('src/app/teams/page.tsx'), new RegExp(`\\$${TEAM_EXTRA_SEAT.monthly} per agent`))
  const cre = COMMERCIAL_FAQS.map((f) => f.a).join(' ')
  for (const k of ['cre_leasing_s', 'cre_leasing_m', 'cre_leasing_l', 'cre_aerial']) assert.ok(cre.includes(money(ONE_OFFS[k].cents)), k)
  for (const f of [...INVESTORS_FAQS, ...REITS_FAQS]) assert.ok(!/\$\d/.test(f.a), f.q)
  for (const [p, n] of [['teams', 'TEAMS_FAQS'], ['commercial', 'COMMERCIAL_FAQS'], ['investors', 'INVESTORS_FAQS'], ['reits', 'REITS_FAQS']]) {
    assert.match(read(`src/app/${p}/page.tsx`), new RegExp(`<PublicFaqs title="[^"]+" faqs=\\{${n}\\} />`), p)
  }
})
