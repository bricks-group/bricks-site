import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { FX, SAVINGS_FOOTNOTE, TOOLS, SITE_TOOLS, SITE_FIRST_CAPTURE, builderStack, stackFor, cad } from './savings'
import { PLANS as SITE_PLANS, PER_VISIT } from './commercial'
import { BROKERAGE_PITCH, BROKERAGE_PILLARS, AGENT_STACK_MONTHLY, SEAT_MONTHLY_RANGE } from './brokerage-pitch'
import { planHas } from './plan-matrix'
import { SOFTWARE_PRICES } from './catalog'

const sources = readFileSync(new URL('../../public/pricing/SAVINGS_SOURCES.md', import.meta.url), 'utf8')

test('totals per plan (CAD a month)', () => {
  assert.deepEqual([stackFor('keystone').separate, stackFor('marble').separate, stackFor('diamond').separate], [90, 145, 172])
  for (const p of ['keystone', 'marble', 'diamond'] as const) {
    const s = stackFor(p)
    assert.equal(s.bricks, SOFTWARE_PRICES[p].monthly)
    assert.equal(s.keep, s.separate - s.bricks)
    assert.ok(s.keep > 0, `${p} should not show a negative saving`)
  }
})

test('like for like: a plan only counts tools for jobs it fully includes', () => {
  for (const p of ['keystone', 'marble', 'diamond'] as const) {
    for (const { tool } of stackFor(p).tools) for (const label of tool.covers) assert.ok(planHas(label, p), `${p}: ${label}`)
  }
  assert.ok(!stackFor('keystone').tools.some((t) => t.tool.id === 'ai-copy'), 'add-ons are never counted')
})

test('every counted tool, price and source is recorded in SAVINGS_SOURCES.md', () => {
  for (const t of TOOLS) {
    assert.ok(sources.includes(t.tool), t.tool)
    assert.ok(sources.includes(t.url), t.url)
    assert.ok(sources.includes(`$${t.usdMonthly}`), `${t.tool} $${t.usdMonthly}`)
    assert.ok(sources.includes(`$${cad(t.usdMonthly)}`), `${t.tool} CAD`)
    assert.match(t.url, /^https:\/\//)
  }
  assert.ok(sources.includes(String(FX.usdToCad)) && sources.includes(FX.date), 'FX rate and date')
  for (const t of SITE_TOOLS) {
    assert.ok(sources.includes(t.tool), t.tool)
    assert.ok(sources.includes(t.url), t.url)
    assert.ok(sources.includes(`$${t.cadPerVisit.toLocaleString('en-CA')}`), `${t.tool} $${t.cadPerVisit}`)
  }
  assert.ok(sources.includes(`$${SITE_FIRST_CAPTURE.toLocaleString('en-CA')} first capture`))
  assert.ok(sources.includes(SAVINGS_FOOTNOTE))
})

test('page shows the footnote, the rate and a link to sources', () => {
  const src = readFileSync(new URL('../app/pricing/Savings.tsx', import.meta.url), 'utf8')
  assert.match(src, /SAVINGS_FOOTNOTE/)
  assert.match(src, /FX\.usdToCad/)
  assert.match(src, /SAVINGS_SOURCES_PATH/)
  assert.match(src, /tool\.url/)
  assert.doesNotMatch(src, /<img/, 'no logos')
  assert.doesNotMatch(src, /DroneDeploy|DRONE_SOFTWARE/, 'DIY drone software is not a competitor')
  assert.doesNotMatch(src.split('export default function')[1].split('sv-foot')[0], /SAVINGS_CHECKED/, 'check dates live only in the footnote')
})

test('builder view: services at one mapped visit a month vs the Bricks mapped plan', () => {
  const mapped = SITE_PLANS[1]
  assert.equal(mapped.kind, 'Mapped')
  assert.equal(mapped.rows[0].visits, 1)
  const s = builderStack(mapped.rows[0].price, PER_VISIT[2].price)
  assert.equal(s.separate, 1275)
  assert.equal(s.bricks, 1200)
  assert.equal(s.keep, 75)
  assert.equal(s.setupSeparate, 650)
  assert.equal(s.setupBricks, 650)
})

test('brokerage pitch: swappable, defensible, numbers from the catalog', () => {
  assert.equal(BROKERAGE_PITCH.title, 'Give your agents more than a desk.')
  const text = [BROKERAGE_PITCH.title, BROKERAGE_PITCH.lede, ...BROKERAGE_PILLARS.flatMap((p) => [p.title, p.detail])].join(' ')
  assert.doesNotMatch(text, /\bonly\b|no other|down the street|competitor|can[’']t offer/i)
  assert.equal(AGENT_STACK_MONTHLY, 172)
  assert.ok(text.includes(`$${SEAT_MONTHLY_RANGE.min} to $${SEAT_MONTHLY_RANGE.max}`))
  for (const page of ['../app/pricing/page.tsx', '../app/brokerage/page.tsx']) {
    const src = readFileSync(new URL(page, import.meta.url), 'utf8')
    assert.match(src, /BROKERAGE_PITCH\.title/, page)
    const jsx = src.split('export default function')[1]
    assert.ok(jsx.indexOf('BROKERAGE_PITCH.title') < jsx.indexOf('BROKERAGE_PILLARS'), `${page}: headline above the pillars`)
  }
})
