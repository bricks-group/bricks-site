/**
 * One-step trade book + pay (Kam t648u). Server prices from the decided sheet;
 * the browser never sets the charged amount.
 */
import sheet from './trade-price-sheet.json'
import { propertyTax, provinceFromAddress } from './property-tax'
import type { TradeSlug } from './services'

type Row = { key: string; name: string; price?: number }

const SHEET_TRADE: Record<TradeSlug, keyof typeof sheet.trades> = {
  staging: 'staging', cleaning: 'cleaning', inspections: 'inspection',
  measurement: 'measuring', repairs: 'repairs',
}

export const VENDOR_TYPE: Record<TradeSlug, string> = {
  staging: 'stager', cleaning: 'cleaner', inspections: 'inspector',
  measurement: 'measurer', repairs: 'handyman',
}

export function tradeRow(slug: TradeSlug, key: string): (Row & { price: number }) | null {
  const rows = sheet.trades[SHEET_TRADE[slug]] as Row[]
  const r = rows.find((x) => x.key === key)
  return r && typeof r.price === 'number' ? { ...r, price: r.price } : null
}

export function priceTrade(input: {
  trade: TradeSlug
  scope: string
  address: string
  preferred_date?: string
}): { ok: true; quote: TradeQuote } | { ok: false; error: string } {
  const row = tradeRow(input.trade, input.scope)
  if (!row) return { ok: false, error: 'Pick the service and price.' }
  const address = String(input.address || '').trim()
  if (address.length < 5) return { ok: false, error: 'Add the property address.' }
  const prov = provinceFromAddress(address) || 'ON'
  if (input.trade === 'inspections' && prov !== 'ON') {
    return { ok: false, error: 'Inspections are available in Ontario only.' }
  }
  const tax = propertyTax(prov)
  const subtotal_cents = Math.round(row.price * 100)
  const tax_cents = Math.round(subtotal_cents * tax.rate)
  return {
    ok: true,
    quote: {
      trade: input.trade,
      scope: input.scope,
      name: row.name,
      vendor_type: VENDOR_TYPE[input.trade],
      package_id: input.scope,
      address,
      province: tax.province,
      tax_label: tax.label,
      tax_rate: tax.rate,
      subtotal_cents,
      tax_cents,
      total_cents: subtotal_cents + tax_cents,
      preferred_date: (input.preferred_date || '').slice(0, 10) || null,
    },
  }
}

export type TradeQuote = {
  trade: TradeSlug
  scope: string
  name: string
  vendor_type: string
  package_id: string
  address: string
  province: string
  tax_label: string
  tax_rate: number
  subtotal_cents: number
  tax_cents: number
  total_cents: number
  preferred_date: string | null
}
