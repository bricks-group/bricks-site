import { PER_VISIT, PLANS } from './commercial'
import { PHOTO_RATE } from './pricing'
import { ONE_OFFS } from './propertyCheckout'

/**
 * Market ranges from published GTA and Ontario starting rates, checked 2026-11-07, CAD before tax.
 * Sources are kept outside the site on purpose: the site never names or links other providers.
 * Bricks figures come from the same price modules as checkout, never typed here.
 */
export type PriceRow = { job: string; unit: string; market?: [number, number]; bricks: number; bricksNote?: string; included?: string[] }


const visualMonthly = PLANS[0].rows[0].price
const mappedMonthly = PLANS[1].rows[0].price

export const PRICE_ROWS: Record<'builder' | 'agent' | 'pm', PriceRow[]> = {
  builder: [
    { job: 'Progress visit', unit: 'a month, one visit', market: [349, 699], bricks: visualMonthly },
    { job: 'Mapped capture', unit: 'a month, orthomosaic and 3D model', market: [895, 2150], bricks: mappedMonthly, bricksNote: `plus ${'$' + PER_VISIT[2].price.toLocaleString('en-CA')} setup once` },
  ],
  agent: [
    { job: 'Listing photos', unit: 'one shoot', bricks: PHOTO_RATE[1], included: ['Homes up to 2,500 sq ft', 'Book, brief, files and payment in one place', 'Vetted photographer, edited by Bricks'] },
  ],
  pm: [
    { job: 'Condition report', unit: 'move-in or move-out', market: [75, 200], bricks: ONE_OFFS.pm_condition_report.cents / 100, bricksNote: 'compared with the last report' },
  ],
}

/**
 * Calculator "what you pay today" starting values, per visit, CAD before tax.
 * Median of published Canadian one-off prices (private research, 17 Oct and 7 Nov 2026):
 * progress visit, 7 prices from $199 to $750, median $400; mapped capture
 * (orthomosaic + 3D), 5 prices from $950 to $1,950, median $1,499, rounded to $1,500.
 * Labelled on the site as examples; visitors replace them with their own.
 */
export const TODAY_PER_VISIT = { visual: 400, mapped: 1500 } as const
