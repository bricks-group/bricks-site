import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { FX, SAVINGS_FOOTNOTE, TOOLS, DRONE_SOFTWARE, stackFor, cad } from './savings'
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
  assert.ok(sources.includes(DRONE_SOFTWARE.url))
  assert.ok(sources.includes(SAVINGS_FOOTNOTE))
})

test('page shows the footnote, the rate and a link to sources', () => {
  const src = readFileSync(new URL('../app/pricing/Savings.tsx', import.meta.url), 'utf8')
  assert.match(src, /SAVINGS_FOOTNOTE/)
  assert.match(src, /FX\.usdToCad/)
  assert.match(src, /SAVINGS_SOURCES_PATH/)
  assert.match(src, /tool\.url/)
  assert.doesNotMatch(src, /<img/, 'no logos')
})
