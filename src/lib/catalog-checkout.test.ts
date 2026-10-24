import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import {
  OFFICE_PLANS, OFFICE_SEAT_PRICE_PER_MONTH, OFFICE_SEAT_PRICE_PER_YEAR, SOFTWARE_PLANS, SOFTWARE_PRICES, ADDONS,
} from './catalog'

/**
 * Mirrors of what the app actually charges (Bricks OS, origin/main, 2026-10-24):
 * - backend/server.py BROKERAGE_MONTHLY_SEAT_CENTS (monthly seats, "yearly rate +25%, no lock-in")
 * - Supabase software_tiers price_cents (yearly seats; monthly individual plans)
 * - frontend/src/lib/plans.js annualPrice and AI_ADDONS
 * If the app changes a price, change it there first, then here and in catalog.ts.
 */
const OS_BROKERAGE_MONTHLY_SEAT_CENTS = { boutique: 7400, growth: 5600, enterprise: 4400, franchise: 3100 }
const DB_BROKERAGE_YEARLY_SEAT_CENTS = { boutique: 70800, growth: 54000, enterprise: 42000, franchise: 30000 }
const DB_SEAT_BANDS = { boutique: '5–24 seats', growth: '25–74 seats', enterprise: '75–199 seats', franchise: '200+ seats' }
const DB_SOLO_MONTHLY_CENTS = { keystone: 4900, marble: 9900, diamond: 14900 }
const OS_SOLO_ANNUAL = { keystone: 490, marble: 990, diamond: 1490 }
const OS_AI_ADDONS = { 'AI Listing Copy': 19, 'AI CMA': 25, 'AI Document Drafter': 19 }

type Office = keyof typeof OS_BROKERAGE_MONTHLY_SEAT_CENTS
const offices = Object.keys(OS_BROKERAGE_MONTHLY_SEAT_CENTS) as Office[]

test('brokerage yearly seat prices match software_tiers', () => {
  for (const k of offices) assert.equal(OFFICE_SEAT_PRICE_PER_YEAR[k] * 100, DB_BROKERAGE_YEARLY_SEAT_CENTS[k], k)
  for (const p of OFFICE_PLANS) assert.equal(p.seats, DB_SEAT_BANDS[p.id], p.id)
})

test('brokerage monthly seat prices match the app checkout and equal yearly / 12 + 25%', () => {
  for (const k of offices) {
    assert.equal(OFFICE_SEAT_PRICE_PER_MONTH[k] * 100, OS_BROKERAGE_MONTHLY_SEAT_CENTS[k], k)
    assert.equal(OFFICE_SEAT_PRICE_PER_MONTH[k], Math.round((OFFICE_SEAT_PRICE_PER_YEAR[k] / 12) * 1.25), k)
  }
  assert.deepEqual(OFFICE_PLANS.map((p) => p.priceMonthly), ['$74 / seat / mo', '$56 / seat / mo', '$44 / seat / mo', '$31 / seat / mo'])
})

test('individual plans: monthly matches the app, yearly is 10 months (2 months free)', () => {
  for (const [id, cents] of Object.entries(DB_SOLO_MONTHLY_CENTS) as [keyof typeof SOFTWARE_PRICES, number][]) {
    assert.equal(SOFTWARE_PRICES[id].monthly * 100, cents, id)
    assert.equal(SOFTWARE_PRICES[id].yearly, OS_SOLO_ANNUAL[id], id)
    assert.equal(SOFTWARE_PRICES[id].yearly, SOFTWARE_PRICES[id].monthly * 10, id)
    const card = SOFTWARE_PLANS.find((p) => p.id === id)!
    assert.equal(card.price, `$${SOFTWARE_PRICES[id].monthly} / mo`)
    assert.ok(card.yearly.startsWith(`$${SOFTWARE_PRICES[id].yearly.toLocaleString('en-US')} / yr`), card.yearly)
  }
})

test('AI add-on prices match the app', () => {
  for (const a of ADDONS) assert.equal(a.price, `$${OS_AI_ADDONS[a.name]} / mo`, a.name)
})

test('pricing page renders seat and plan prices from the catalog, not hard-coded', () => {
  const page = readFileSync(new URL('../app/pricing/page.tsx', import.meta.url), 'utf8')
  const grid =
    readFileSync(new URL('../app/pricing/PlanGrid.tsx', import.meta.url), 'utf8') +
    readFileSync(new URL('../app/pricing/CompareFeatures.tsx', import.meta.url), 'utf8') +
    readFileSync(new URL('../app/pricing/Savings.tsx', import.meta.url), 'utf8')
  assert.match(page, /seatPricePerYear/)
  assert.match(page, /seatPricePerMonth/)
  assert.match(grid, /SOFTWARE_PRICES/)
  for (const n of ['49', '99', '149', '490', '990', '1,490', '74', '56', '44', '31', '708', '540', '420', '300']) {
    assert.doesNotMatch(page + grid, new RegExp(`\\$${n.replace(',', ',?')}\\b`), `hard-coded $${n}`)
  }
})

test('no claim of on-PDF e-sign field placement (not shipped in the app)', () => {
  const src = readFileSync(new URL('./catalog.ts', import.meta.url), 'utf8')
  assert.doesNotMatch(src, /fields placed on the PDF/)
})
