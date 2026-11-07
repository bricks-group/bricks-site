/**
 * One-off visits a property manager, commercial owner, investor or REIT can
 * pay for on /book/property. Approved CAD prices, before HST. Bricks recomputes
 * every price on the server (common/client_booking.py) before Stripe Checkout,
 * so these are for display and early checks only. Plans (rentals plan, leasing
 * desk, portfolio watch) and spaces over 20,000 sq ft stay on the request form.
 */
import type { PropertyClient } from './clientServices'

export type Scope = 'unit' | 'space' | 'building' | 'property'
export type MoveKind = 'move_in' | 'move_out'
export type OneOff = { key: string; name: string; cents: number; scope: Scope; what: string; move?: MoveKind[]; maxSqft?: number; drone?: boolean }

export const ONE_OFFS: Record<string, OneOff> = {
  pm_turnover: { key: 'pm_turnover', name: 'Turnover media bundle', cents: 29500, scope: 'unit', move: ['move_out'], what: 'Move-out condition report plus listing photos and floor plan in one visit. Media only: cleaning and repairs are not included.' },
  pm_condition_report: { key: 'pm_condition_report', name: 'Condition report', cents: 14500, scope: 'unit', move: ['move_in', 'move_out'], what: 'Dated photos of every room at move-in or move-out, compared with the last report.' },
  pm_listing_set: { key: 'pm_listing_set', name: 'Listing set', cents: 19500, scope: 'unit', what: 'Photos and a floor plan for the listing.' },
  pm_listing_video: { key: 'pm_listing_video', name: 'Listing set with video', cents: 25500, scope: 'unit', what: 'Photos, floor plan and a short video.' },
  pm_building_set: { key: 'pm_building_set', name: 'Building set', cents: 65000, scope: 'building', what: 'Exterior, lobby, amenities and an aerial.' },
  cre_leasing_s: { key: 'cre_leasing_s', name: 'Leasing set, up to 2,500 sq ft', cents: 59500, scope: 'space', maxSqft: 2500, what: 'Photos, measured floor plan and a Virtual Visit of the space.' },
  cre_leasing_m: { key: 'cre_leasing_m', name: 'Leasing set, up to 7,500 sq ft', cents: 89500, scope: 'space', maxSqft: 7500, what: 'Photos, measured floor plan and a Virtual Visit of the space.' },
  cre_leasing_l: { key: 'cre_leasing_l', name: 'Leasing set, up to 20,000 sq ft', cents: 145000, scope: 'space', maxSqft: 20000, what: 'Photos, measured floor plan and a Virtual Visit of the space.' },
  cre_aerial: { key: 'cre_aerial', name: 'Aerial set', cents: 34900, scope: 'property', drone: true, what: 'Aerial photos and video of the site.' },
  inv_acquisition: { key: 'inv_acquisition', name: 'Acquisition capture', cents: 125000, scope: 'property', drone: true, what: 'Interior, exterior, aerial and a Virtual Visit: your dated baseline.' },
  inv_acquisition_mapped: { key: 'inv_acquisition_mapped', name: 'Mapped acquisition capture', cents: 225000, scope: 'property', drone: true, what: 'The acquisition capture plus a measured site map.' },
}

const PM = ['pm_turnover', 'pm_condition_report', 'pm_listing_set', 'pm_listing_video', 'pm_building_set']
const CRE = ['cre_leasing_s', 'cre_leasing_m', 'cre_leasing_l', 'cre_aerial']
const INV = ['inv_acquisition', 'inv_acquisition_mapped']
export const ONE_OFFS_FOR: Record<PropertyClient, string[]> = {
  property_manager: PM,
  commercial: CRE,
  investor: INV,
  reit_leasing: [...PM, ...CRE, ...INV],
}

export const money = (cents: number) =>
  `$${(cents / 100).toLocaleString('en-CA', { minimumFractionDigits: cents % 100 ? 2 : 0, maximumFractionDigits: cents % 100 ? 2 : 0 })}`

/** Lowest one-off visit price for a property client type, from the same table /book/property charges. */
export const fromPriceFor = (kind: PropertyClient) => money(Math.min(...ONE_OFFS_FOR[kind].map((k) => ONE_OFFS[k].cents)))

export function tierForSqft(sqft: string | number | undefined): string | null {
  const n = Number(String(sqft ?? '').replace(/,/g, ''))
  if (!n || n <= 0) return null
  if (n <= 2500) return 'cre_leasing_s'
  if (n <= 7500) return 'cre_leasing_m'
  if (n <= 20000) return 'cre_leasing_l'
  return null
}

export function addDays(iso: string, n: number) {
  const d = new Date(`${iso}T12:00:00Z`)
  d.setUTCDate(d.getUTCDate() + n)
  return d.toISOString().slice(0, 10)
}

export type CheckoutFields = {
  service_key: string; street: string; unit: string; city: string; sqft: string; move_kind: string; move_date: string
  preferred_date: string; contact_name: string; contact_email: string; contact_phone: string; site_contact_phone: string; access_notes: string
}

const ISO = /^\d{4}-\d{2}-\d{2}$/
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Same rules as the server (client_booking.validate). "" when ready. */
export function checkCheckout(f: CheckoutFields, today: string): string {
  const s = ONE_OFFS[f.service_key]
  if (!s) return 'Pick a service.'
  if (f.street.trim().length < 6) return 'Add the street address.'
  if (s.scope === 'space' && !f.unit.trim()) return 'Add the suite or unit for this space.'
  if (s.maxSqft) {
    const right = tierForSqft(f.sqft)
    if (!right) return Number(f.sqft.replace(/,/g, '')) > 20000 ? 'Spaces over 20,000 sq ft are quoted. Send a request and we reply with a price.' : 'Add the space size in square feet.'
    if (right !== s.key) return `A ${Number(f.sqft.replace(/,/g, '')).toLocaleString('en-CA')} sq ft space takes the ${ONE_OFFS[right].name.toLowerCase()}.`
  }
  if (s.move) {
    if (!s.move.includes(f.move_kind as MoveKind)) return 'Say whether this is for a move-in or a move-out.'
    if (!ISO.test(f.move_date)) return 'Add the move-in or move-out date.'
  }
  const lead = s.drone ? 2 : 1
  if (!ISO.test(f.preferred_date)) return 'Pick a visit date.'
  if (f.preferred_date < addDays(today, lead)) return `Pick a date at least ${lead} day${lead > 1 ? 's' : ''} out.`
  if (f.preferred_date > addDays(today, 180)) return 'Pick a date within the next six months.'
  if (s.move) {
    const gap = Math.round((Date.parse(f.preferred_date) - Date.parse(f.move_date)) / 86400000)
    if (f.move_kind === 'move_out' && !(gap >= 0 && gap <= 14)) return 'A move-out report is shot within two weeks after the move-out date.'
    if (f.move_kind === 'move_in' && !(gap >= -14 && gap <= 0)) return 'A move-in report is shot within two weeks before the move-in date, while the unit is empty.'
  }
  if (!f.contact_name.trim() || !EMAIL.test(f.contact_email.trim())) return 'Add your name and a valid email.'
  if (!f.site_contact_phone.trim() && !f.access_notes.trim()) return 'Tell us who lets us in (a phone number) or how to get in (lockbox, concierge).'
  return ''
}

/** Only the fields the chosen service uses. */
export function checkoutBody(kind: PropertyClient, f: CheckoutFields & { company?: string }) {
  const s = ONE_OFFS[f.service_key]
  const b: Record<string, string> = {
    for: kind, service_key: f.service_key, street: f.street.trim(), city: f.city.trim(), preferred_date: f.preferred_date,
    contact_name: f.contact_name.trim(), contact_email: f.contact_email.trim(), contact_phone: f.contact_phone.trim(),
    site_contact_phone: f.site_contact_phone.trim(), access_notes: f.access_notes.trim(), company: (f.company || '').trim(),
  }
  if (s && (s.scope === 'unit' || s.scope === 'space') && f.unit.trim()) b.unit = f.unit.trim()
  if (s?.maxSqft) b.sqft = f.sqft.replace(/,/g, '').trim()
  if (s?.move) { b.move_kind = f.move_kind; b.move_date = f.move_date }
  return b
}
