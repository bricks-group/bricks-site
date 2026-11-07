import { PER_VISIT, PLANS } from './commercial'
import { PHOTO_RATE } from './pricing'
import { ONE_OFFS } from './propertyCheckout'

/**
 * Published GTA/Ontario market rates for work Bricks also sells, checked 2026-11-07.
 * Each range is the lowest and highest published starting price among the cited sources, CAD before tax.
 * Bricks figures come from the same price modules as checkout, never typed here.
 */
export type Source = { id: number; name: string; url: string; note: string }
export type PriceRow = { job: string; unit: string; market: [number, number]; sources: number[]; bricks: number; bricksNote?: string }

export const SOURCES: Source[] = [
  { id: 1, name: 'Grace Multimedia', url: 'https://getgrace.ca/commercial-drone-services', note: 'Construction progress, from $349 a site visit (GTA)' },
  { id: 2, name: 'Recon Aerial', url: 'https://reconaerialmedia.com/construction-progress-drone-photography/', note: 'Progress photos, monthly $699 a visit (Ontario)' },
  { id: 3, name: 'Razor Aerial', url: 'https://razoraerialproductions.ca/drone-mapping-rtk-surveys/', note: 'Mapping with orthomosaic and 3D model, from $895 (up to 25 acres)' },
  { id: 4, name: 'Buildmode Aerial', url: 'https://buildmodeaerial.ca/pricing', note: 'Orthomosaic site survey, from $2,150 a site' },
  { id: 5, name: 'Green Day Photography', url: 'https://greendayphotography.ca/real-estate-photography-packages-toronto/', note: 'Essential listing photos, $180 (Toronto)' },
  { id: 6, name: 'Wide & Bright', url: 'https://www.wideandbright.ca/pricing', note: 'Photos only, small home, $199 (Toronto)' },
  { id: 7, name: 'Gluzberg Property Management', url: 'https://toronto-property-management.ca/property-management-rates-and-prices/', note: 'Move-in or move-out inspection report, others charge $75 to $200' },
]

const visualMonthly = PLANS[0].rows[0].price
const mappedMonthly = PLANS[1].rows[0].price

export const PRICE_ROWS: Record<'builder' | 'agent' | 'pm', PriceRow[]> = {
  builder: [
    { job: 'Progress visit', unit: 'a month, one visit', market: [349, 699], sources: [1, 2], bricks: visualMonthly },
    { job: 'Mapped capture', unit: 'a month, orthomosaic and 3D model', market: [895, 2150], sources: [3, 4], bricks: mappedMonthly, bricksNote: `plus ${'$' + PER_VISIT[2].price.toLocaleString('en-CA')} setup once` },
  ],
  agent: [
    { job: 'Listing photos', unit: 'home up to 2,000 sq ft', market: [180, 199], sources: [5, 6], bricks: PHOTO_RATE[1], bricksNote: 'covers up to 2,500 sq ft' },
  ],
  pm: [
    { job: 'Condition report', unit: 'move-in or move-out', market: [75, 200], sources: [7], bricks: ONE_OFFS.pm_condition_report.cents / 100, bricksNote: 'compared with the last report' },
  ],
}
