/**
 * Set prices for every trade (decided 21 Nov 2026: no quotes, set price and set cut).
 * Source: trade-price-sheet.json, the same file Dispatch and OS read.
 * Client prices are before HST.
 */
import sheet from './trade-price-sheet.json'
import type { TradeSlug } from './services'

export type TradePrice = { key: string; name: string; price: string; note?: string }

type Row = { key: string; name: string; price?: number; unit?: string; price_rule?: string }

const SHEET_TRADE: Record<TradeSlug, keyof typeof sheet.trades> = {
  staging: 'staging',
  cleaning: 'cleaning',
  inspections: 'inspection',
  measurement: 'measuring',
  repairs: 'repairs',
}

export function money(n: number): string {
  return Number.isInteger(n) ? `$${n.toLocaleString('en-CA')}` : `$${n.toFixed(2)}`
}

const STAGING_LABEL: Record<string, string> = {
  small: 'up to 1,200 sq ft',
  mid: '1,201 to 2,500 sq ft',
  large: '2,501 to 4,000 sq ft',
  xl: 'over 4,000 sq ft',
}

function label(r: Row): string {
  const m = /^(Occupied|Vacant) staging, 30 days, (small|mid|large|xl)$/.exec(r.name)
  if (m) return `${m[1]} home, ${STAGING_LABEL[m[2]]}, 30 days`
  return r.name
}

/** Client-facing price list for one trade, in sheet order. */
export function tradePrices(slug: TradeSlug): TradePrice[] {
  const rows = (sheet.trades[SHEET_TRADE[slug]] as Row[]) || []
  return rows.map((r) => {
    if (typeof r.price === 'number') {
      return { key: r.key, name: label(r), price: money(r.price), note: r.unit === 'per 30 min' ? 'per 30 minutes' : undefined }
    }
    if (r.key === 'stg_extend_30') return { key: r.key, name: 'Each extra 30 days', price: '25% of the first 30 days' }
    return { key: r.key, name: r.name, price: 'At cost', note: 'with the receipt' }
  })
}

/** Lowest set price for a trade, for "from $X" lines. */
export function tradeFrom(slug: TradeSlug): string {
  const rows = (sheet.trades[SHEET_TRADE[slug]] as Row[]).filter((r) => typeof r.price === 'number' && r.unit !== 'per 30 min')
  return money(Math.min(...rows.map((r) => r.price as number)))
}

export function tradePriceByKey(key: string): TradePrice | undefined {
  for (const slug of Object.keys(SHEET_TRADE) as TradeSlug[]) {
    const p = tradePrices(slug).find((x) => x.key === key)
    if (p) return p
  }
  return undefined
}

/** Vendor pay for a trade, Tier 1 / 2 / 3, for the apply and help pages. */
export function tradePay(slug: TradeSlug): { name: string; pay: string }[] {
  const rows = sheet.trades[SHEET_TRADE[slug]] as (Row & { payout?: number[]; vendor_share?: number })[]
  return rows.map((r) => {
    if (r.vendor_share === 1) return { name: r.name, pay: 'Paid back at cost' }
    if (r.vendor_share) return { name: label(r), pay: `${Math.round(r.vendor_share * 100)}% of the price` }
    return { name: label(r), pay: (r.payout || []).map(money).join(' / ') }
  })
}

export const SURVEY_GRADE = sheet.formulas.survey_grade
export const LEASING_XL = sheet.formulas.cre_leasing_xl

/** Survey-grade mapping price before HST. First visit to a site adds the one-time setup. */
export function surveyGradePrice(acres: number, firstVisit = true): number {
  const f = SURVEY_GRADE
  const a = Math.max(0, Math.min(Math.ceil(acres || 0), f.max_acres))
  return f.base_price + Math.max(0, a - f.included_acres) * f.per_extra_acre + (firstVisit ? f.setup_once : 0)
}

/** Leasing set price over 20,000 sq ft, or null outside 20,001 to 100,000. */
export function leasingXlPrice(sqft: number): number | null {
  const f = LEASING_XL
  if (!(sqft > f.from_sqft) || sqft > f.max_sqft) return null
  return Math.round(f.base_price + (sqft - f.from_sqft) * f.per_sqft)
}

export const PAYOUT_TIMING = 'Paid every Monday for jobs delivered and approved. Your first 3 jobs are held until the client rates them or they release on their own.'
export const DISPUTES = 'Questions about a payout: help@brxs.ca within 30 days.'
