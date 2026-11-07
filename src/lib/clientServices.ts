/**
 * Services each property client type can request, by key. Mirrors the app's
 * per-type catalog (Bricks backend common/client_catalog.py). This list feeds
 * the request form (plans, quotes, several properties). One-off visits with
 * prices and checkout live in ./propertyCheckout.ts.
 */
export type PropertyClient = 'property_manager' | 'commercial' | 'investor' | 'reit_leasing'

export type ClientService = { key: string; name: string; detail: string }

export const CLIENT_LABEL: Record<PropertyClient, string> = {
  property_manager: 'Property managers and landlords',
  commercial: 'Commercial real estate',
  investor: 'Investors',
  reit_leasing: 'REITs',
}

const PM: ClientService[] = [
  { key: 'pm_listing_set', name: 'Rental listing set', detail: 'Photos and a measured floor plan for one unit.' },
  { key: 'pm_listing_video', name: 'Rental listing set with video', detail: 'The listing set plus a short vertical walkthrough.' },
  { key: 'pm_condition_report', name: 'Condition report', detail: 'Dated room-by-room photos at move-in or move-out, compared with the last report.' },
  { key: 'pm_turnover', name: 'Turnover media bundle', detail: 'Move-out condition report and new listing set in one visit. Media only: cleaning and repairs are not included.' },
  { key: 'pm_building_set', name: 'Building set', detail: 'Exterior, aerials and shared spaces for the whole building.' },
  { key: 'pm_rentals_plan', name: 'Rentals plan', detail: '5, 12 or 25 turnover media bundles a month, as credits you can spend on any rentals visit across your buildings.' },
]
const CRE: ClientService[] = [
  { key: 'cre_leasing', name: 'Leasing set', detail: 'Photos, a measured floor plan and a Virtual Visit of the space. Priced by size.' },
  { key: 'cre_aerial', name: 'Aerial set', detail: 'Licensed drone photos of the site and its access.' },
  { key: 'cre_leasing_desk', name: 'Leasing desk', detail: 'A monthly allowance of leasing sets across your properties.' },
]
const INV: ClientService[] = [
  { key: 'inv_acquisition', name: 'Acquisition capture', detail: 'A dated baseline of the property when you buy: photos, aerials and a report.' },
  { key: 'inv_acquisition_mapped', name: 'Mapped acquisition capture', detail: 'The baseline plus a measured map and 3D model of the site.' },
  { key: 'inv_watch', name: 'Portfolio watch', detail: 'A dated check of each property every quarter or every month, compared with the last one.' },
]
const SITE: ClientService = { key: 'site_progress', name: 'Site progress', detail: 'Drone visits, maps, models, reports and comparisons for anything under construction.' }

export const SERVICES_FOR: Record<PropertyClient, ClientService[]> = {
  property_manager: PM,
  commercial: [...CRE, SITE],
  investor: [...INV, SITE],
  reit_leasing: [...PM, ...CRE, ...INV, SITE],
}

export function isPropertyClient(v: string | null | undefined): v is PropertyClient {
  return !!v && v in SERVICES_FOR
}
