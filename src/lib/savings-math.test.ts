import { test } from 'node:test'
import assert from 'node:assert/strict'
import { agentSavings, builderSavings } from './savings-math'
import { PER_VISIT, PLANS } from './commercial'
import { TODAY_PER_VISIT } from './market-rates'

const SITE = {
  setup: PER_VISIT[2].price, visualPerVisit: PER_VISIT[0].price, mappedPerVisit: PER_VISIT[1].price,
  visualPlans: PLANS[0].rows.map((r) => ({ visits: r.visits, price: r.price })),
  mappedPlans: PLANS[1].rows.map((r) => ({ visits: r.visits, price: r.price })),
}

function adds(s: ReturnType<typeof agentSavings>) {
  assert.equal(s.today.total, s.today.cash + s.today.time)
  assert.equal(s.bricks.total, s.bricks.price + s.bricks.time)
  assert.equal(s.today.total - s.bricks.total, s.save)
  assert.equal(s.lines.cash + s.lines.time, s.save)
  for (const n of [s.today.cash, s.today.time, s.bricks.price, s.bricks.time]) assert.ok(Number.isInteger(n))
}

test('agent defaults: $960 today, $679 with Bricks, save $281', () => {
  const s = agentSavings({ listings: 4, coordHours: 3, subs: 60, rate: 75, share: 30, planPrice: 49 })
  adds(s)
  assert.deepEqual([s.today.cash, s.today.time, s.today.total], [60, 900, 960])
  assert.deepEqual([s.bricks.price, s.bricks.time, s.bricks.total], [49, 630, 679])
  assert.equal(s.save, 281)
})

test('builder defaults: progress and mapped add up', () => {
  const base = { sites: 2, visits: 2, reports: 1, reportHours: 4, rate: 90, share: 50 }
  const p = builderSavings({ ...base, mapped: false, payNow: TODAY_PER_VISIT.visual }, SITE)
  adds(p)
  assert.deepEqual([p.today.total, p.bricks.total, p.save], [2320, 2060, 260])
  const m = builderSavings({ ...base, mapped: true, payNow: TODAY_PER_VISIT.mapped }, SITE)
  adds(m)
  assert.deepEqual([m.today.total, m.bricks.total, m.save, m.setupOnce], [6720, 5560, 1160, 1300])
})

test('random inputs always add up exactly', () => {
  let seed = 42
  const rnd = (max: number, dp = 0) => { seed = (seed * 1103515245 + 12345) % 2 ** 31; const f = 10 ** dp; return Math.round((seed / 2 ** 31) * max * f) / f }
  for (let k = 0; k < 500; k++) {
    adds(agentSavings({ listings: rnd(30), coordHours: rnd(12, 1), subs: rnd(500, 2), rate: rnd(300, 2), share: rnd(120), planPrice: [0, 49, 99, 149][k % 4] }))
    adds(builderSavings({ sites: rnd(10), visits: rnd(6), mapped: k % 2 === 0, payNow: rnd(3000, 2), reports: rnd(4), reportHours: rnd(10, 1), rate: rnd(250, 2), share: rnd(100) }, SITE))
  }
})
