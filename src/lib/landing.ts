import { BAND_LABELS, bandCells } from '@/lib/pricing'

/** Footprint band wording for rate rows. Matches FOOTPRINT_BANDS in pricing.ts. */
export const BAND_DETAIL = ['Up to 1,200 sq ft', '1,201 to 2,500 sq ft', '2,501 to 4,000 sq ft', 'Over 4,000 sq ft'] as const

/** One Calm row per footprint band, values straight from a pricing.ts rate array. */
export function bandRows(rate: readonly number[]) {
  return bandCells(rate).map((value, i) => ({ title: BAND_LABELS[i], detail: BAND_DETAIL[i], value }))
}

/** Per-band totals for a package built from rate arrays (packages are the sum of their parts). */
export function sumRates(...rates: readonly (readonly number[])[]) {
  return BAND_LABELS.map((_, i) => rates.reduce((t, r) => t + r[i], 0))
}
