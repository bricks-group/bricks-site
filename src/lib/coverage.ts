/**
 * Bricks coverage — single source of truth for www /service-areas map + copy.
 *
 * Update this file when business growth changes hubs (new active market,
 * city moves from on-confirm → active, travel base moves). Do not scatter
 * duplicate hub lists in page or map components.
 *
 * Geography rules (Kam, 2026-09-12):
 * - Launch Ontario footprint ≈ anything within ~2 hours’ drive of Mississauga
 *   (INTERNAL sizing rule — never put “2 hour” / “2hr” in public UI copy).
 * - Public label: Golden Horseshoe (GGH+) with travel base Mississauga.
 * - Geometry must stay in Canada — clip the US (no NY/PA bleed across the lakes).
 * - Includes GTA, Hamilton, Niagara (ON), Waterloo Region (Cambridge/KW), Guelph,
 *   London, Barrie corridor, etc. as ONE hub — not a city laundry list of chips.
 * - Beyond that shed (e.g. Ottawa) and other provinces = status 'confirm'.
 * - Brand line stays Canada-wide; no city laundry list on the homepage hero.
 */
export type CoverageStatus = 'base' | 'active' | 'confirm'

export type CoverageHub = {
  id: string
  name: string
  /** Short chip / map label meta */
  region: string
  lng: number
  lat: number
  /** Circle radius in km when `ring` is omitted */
  radiusKm: number
  status: CoverageStatus
  /** Optional custom polygon ring [lng, lat][] — preferred for irregular metros */
  ring?: [number, number][]
  /** One-line note when the hub is selected on the map */
  note: string
  /** Optional SEO / detail card below the map */
  detail?: {
    headline: string
    desc: string
  }
}

/** Mississauga travel base */
export const TRAVEL_BASE = { lng: -79.6441, lat: 43.589, name: 'Mississauga' } as const

/**
 * INTERNAL: ~2 h highway from Mississauga. Used when estimating radius only.
 * Public map uses LAUNCH_RING (Canada-clipped) — do not draw a raw circle.
 */
export const LAUNCH_DRIVE_HOURS = 2
export const LAUNCH_DRIVE_RADIUS_KM = 175

/**
 * Canada-only launch footprint (Ontario).
 * Sized for ~2 h from Mississauga; clipped so nothing paints into the US.
 * Clockwise from London.
 */
const LAUNCH_RING: [number, number][] = [
  [-81.5, 43.2], // London west
  [-81.35, 43.55], // north of London
  [-80.7, 43.7], // Waterloo Region north
  [-80.3, 43.75], // Guelph north
  [-79.95, 44.05], // Dufferin / toward Barrie
  [-79.7, 44.42], // Barrie / Orillia
  [-79.15, 44.32], // east Simcoe
  [-78.5, 44.12], // Peterborough corridor
  [-78.2, 43.88], // Cobourg — Canadian shore only
  [-78.55, 43.68], // Clarington lakeshore (ON)
  [-79.05, 43.62], // Ajax / Pickering shore
  [-79.35, 43.62], // Scarborough shore — stay north of mid-lake
  [-79.55, 43.58], // Toronto waterfront
  [-79.72, 43.5], // Mississauga lakeshore
  [-79.88, 43.35], // Oakville / Burlington
  [-79.88, 43.22], // Hamilton harbour
  [-79.55, 43.18], // Stoney Creek / Grimsby
  [-79.15, 43.12], // Niagara ON north
  [-79.05, 43.0], // Niagara Falls ON
  [-79.0, 42.92], // Fort Erie ON (not Buffalo)
  [-79.55, 42.88], // peninsula west, Canada
  [-80.25, 42.86], // Haldimand / Erie north shore ON
  [-80.85, 42.84], // toward Port Stanley — stay in ON
  [-81.35, 42.88], // south of London
  [-81.5, 43.2], // close
]

/**
 * Live coverage hubs for the map.
 * Order = chip rail order. Keep Canada-first; no city laundry list in brand line.
 */
export const COVERAGE_HUBS: CoverageHub[] = [
  {
    id: 'ggh',
    name: 'Golden Horseshoe',
    region: 'Ontario · base',
    lng: TRAVEL_BASE.lng,
    lat: TRAVEL_BASE.lat,
    radiusKm: LAUNCH_DRIVE_RADIUS_KM,
    status: 'base',
    ring: LAUNCH_RING,
    note:
      ' — Toronto through the Golden Horseshoe, plus Cambridge, Kitchener, Waterloo, Guelph, London, Hamilton, Niagara, Barrie, and nearby. Travel quotes from Mississauga (first 25 km free, then per km before you pay). Address on /book confirms the quote.',
    detail: {
      headline: 'Listing photos across the Golden Horseshoe',
      desc: 'GTA and the Greater Golden Horseshoe, plus Cambridge, Guelph, London, Hamilton, Niagara, Barrie corridor, and nearby Ontario. Travel quotes from Mississauga (first 25 km free). Licensed Advanced RPAS where airspace requires it.',
    },
  },
  {
    id: 'ottawa',
    name: 'Ottawa',
    region: 'National Capital',
    lng: -75.6972,
    lat: 45.4215,
    radiusKm: 28,
    status: 'confirm',
    note: ' — photographer coverage expands with booked demand. Confirm before you lock the slot.',
    detail: {
      headline: 'Coverage on confirm',
      desc: 'National Capital inventory from downtown condos to suburban detached. Confirm photographer coverage before you pay.',
    },
  },
  {
    id: 'calgary',
    name: 'Calgary',
    region: 'Alberta',
    lng: -114.0719,
    lat: 51.0447,
    radiusKm: 28,
    status: 'confirm',
    note: ' — photographer coverage expands with booked demand. Confirm before you lock the slot.',
    detail: {
      headline: 'Alberta via the Bricks network',
      desc: 'Same standard: HDR, optional licensed drone, floor plan on every standard shoot. Confirm local contractor coverage at booking.',
    },
  },
  {
    id: 'edmonton',
    name: 'Edmonton',
    region: 'Alberta',
    lng: -113.4909,
    lat: 53.5461,
    radiusKm: 28,
    status: 'confirm',
    note: ' — photographer coverage expands with booked demand. Confirm before you lock the slot.',
  },
  {
    id: 'vancouver',
    name: 'Vancouver',
    region: 'British Columbia',
    lng: -123.1207,
    lat: 49.2827,
    radiusKm: 26,
    status: 'confirm',
    note: ' — photographer coverage expands with booked demand. Confirm before you lock the slot.',
    detail: {
      headline: 'BC coverage on confirm',
      desc: 'Condo-dense cores and North Shore detached need disciplined HDR and careful aerial planning. We confirm a local photographer first.',
    },
  },
]

export function hubKind(hub: CoverageHub): 'base' | 'hub' | 'soft' {
  if (hub.status === 'base') return 'base'
  if (hub.status === 'confirm') return 'soft'
  return 'hub'
}

export function chipMeta(hub: CoverageHub): string {
  if (hub.status === 'base') return 'Base · Mississauga'
  if (hub.status === 'confirm') return 'Confirm'
  return hub.region
}

/** Detail cards under the map (dedupe Alberta into one card). */
export function coverageDetailCards() {
  const cards: { name: string; region: string; headline: string; desc: string }[] = []
  for (const hub of COVERAGE_HUBS) {
    if (!hub.detail) continue
    if (hub.id === 'edmonton') continue
    if (hub.id === 'calgary') {
      cards.push({
        name: 'Calgary & Edmonton',
        region: 'Alberta',
        headline: hub.detail.headline,
        desc: hub.detail.desc,
      })
      continue
    }
    cards.push({
      name: hub.id === 'ggh' ? 'Greater Golden Horseshoe' : hub.name,
      region: hub.status === 'base' ? 'Ontario · travel base Mississauga' : hub.region,
      headline: hub.detail.headline,
      desc: hub.detail.desc,
    })
  }
  return cards
}
