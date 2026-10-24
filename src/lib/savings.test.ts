import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { FX, SAVINGS_FOOTNOTE, TOOLS, SITE_TOOLS, SITE_FIRST_CAPTURE, builderStack, stackFor, cad } from './savings'
import { PLANS as SITE_PLANS, PER_VISIT } from './commercial'
import { BROKERAGE_PITCH, BROKERAGE_PILLARS, AGENT_STACK_MONTHLY, SEAT_MONTHLY_RANGE } from './brokerage-pitch'
import { planHas } from './plan-matrix'
import { BUILDER_EDGE, BUILDER_EDGE_LEDE } from './builder-edge'
import { SOFTWARE_PRICES } from './catalog'

const sources = readFileSync(new URL('../../public/pricing/SAVINGS_SOURCES.md', import.meta.url), 'utf8')

test('totals per plan (CAD a month)', () => {
  assert.deepEqual([stackFor('keystone').separate, stackFor('marble').separate, stackFor('diamond').separate], [146, 146, 174])
  assert.deepEqual([stackFor('keystone').keep, stackFor('marble').keep, stackFor('diamond').keep], [97, 47, 25])
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
    assert.ok(sources.includes(`$${t.usdMonthly} /`), `${t.tool} $${t.usdMonthly}`)
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
  assert.equal(AGENT_STACK_MONTHLY, 174)
  assert.ok(text.includes(`$${SEAT_MONTHLY_RANGE.min} to $${SEAT_MONTHLY_RANGE.max}`))
  for (const page of ['../app/pricing/page.tsx', '../app/brokerage/page.tsx']) {
    const src = readFileSync(new URL(page, import.meta.url), 'utf8')
    assert.match(src, /BROKERAGE_PITCH\.title/, page)
    const jsx = src.split('export default function')[1]
    assert.ok(jsx.indexOf('BROKERAGE_PITCH.title') < jsx.indexOf('BROKERAGE_PILLARS'), `${page}: headline above the pillars`)
  }
})

test('market leaders: FUB Grow, dotloop Premium, ChatGPT Plus; each job once; cheapest tools only in the appendix', () => {
  assert.deepEqual(TOOLS.map((t) => [t.tool, t.usdMonthly]), [['Follow Up Boss Grow', 69], ['dotloop Premium', 34.99], ['ChatGPT Plus', 20]])
  const labels = TOOLS.flatMap((t) => t.covers)
  assert.equal(new Set(labels).size, labels.length, 'no job counted twice')
  for (const u of ['https://www.followupboss.com/pricing', 'https://www.dotloop.com/products/plans-pricing/', 'https://chatgpt.com/pricing/']) assert.ok(sources.includes(u), u)
  const appendix = sources.split('## Appendix')[1] ?? ''
  for (const cheap of ['Wise Agent', 'Dropbox Sign', 'Jotform', 'ListingAI']) {
    assert.ok(appendix.includes(cheap), `${cheap} in appendix`)
    assert.ok(!sources.split('## Appendix')[0].includes(`| ${cheap}`), `${cheap} not in the counted tables`)
  }
  const code = ['./savings.ts', '../app/pricing/Savings.tsx'].map((f) => readFileSync(new URL(f, import.meta.url), 'utf8')).join('\n')
  assert.doesNotMatch(code, /Wise Agent|Dropbox Sign|Jotform|ListingAI/, 'cheapest tools stay out of the page')
})

test('builder view: no savings figure, leads with one vendor / one portal, local-vendor list only claims shipped features', () => {
  const src = readFileSync(new URL('../app/pricing/Savings.tsx', import.meta.url), 'utf8')
  const builder = src.split('function BuilderView')[1]
  assert.ok(builder, 'BuilderView exists')
  assert.doesNotMatch(builder, /you keep|keep|sv-bars|s\.keep/i, 'no saving shown to builders')
  assert.match(builder, /BuilderEdge/)
  assert.equal(BUILDER_EDGE_LEDE, 'One vendor, one portal, dated evidence for every draw.')
  const text = BUILDER_EDGE.map((r) => `${r.topic} ${r.vendor} ${r.bricks}`).join(' ')
  assert.doesNotMatch(text, /procore|draw report|lender report|coming soon/i, 'not in code, so not claimed')
  assert.ok(BUILDER_EDGE.length >= 5)
  const builders = readFileSync(new URL('../app/builders/page.tsx', import.meta.url), 'utf8')
  assert.match(builders, /<BuilderEdge/)
})

test('app screenshots: every AppShot used on a page has alt text and its files exist', () => {
  for (const page of ['../app/builders/page.tsx', '../app/brokerage/page.tsx', '../app/agents/page.tsx', '../app/platform/page.tsx', '../app/pricing/Savings.tsx']) {
    const src = readFileSync(new URL(page, import.meta.url), 'utf8')
    const uses = [...src.matchAll(/<AppShot name="([a-z-]+)"[^>]*?alt="([^"]+)"/g)]
    assert.ok(uses.length > 0, `${page} shows real screens`)
    for (const [, name, alt] of uses) {
      assert.ok(alt.length > 20, `${page} ${name} alt`)
      for (const f of ['avif', 'webp']) readFileSync(new URL(`../../public/media/app/${name}-${name.startsWith('agent') ? 360 : 1100}.${f}`, import.meta.url))
    }
  }
  const comp = readFileSync(new URL('../components/AppShot.tsx', import.meta.url), 'utf8')
  assert.match(comp, /loading="lazy"/)
  assert.match(comp, /image\/avif/)
})
