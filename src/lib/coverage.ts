/**
 * Bricks coverage — single source of truth for www /service-areas map + copy.
 *
 * Update this file when business growth changes hubs (new active market,
 * city moves from on-confirm → active, travel base moves). Do not scatter
 * duplicate hub lists in page or map components.
 *
 * Geography rules (Kam, 2026-09-12):
 * - Launch Ontario footprint = anything within ~2 hours' drive of Mississauga
 *   (travel base). That includes the GGH, Cambridge, Guelph, London, Hamilton,
 *   Niagara, Barrie corridor, etc. — do not list every city as its own hub.
 * - Do not call Hamilton (or other GGH cities) “GTA”; GTA is a subset only.
 * - Markets beyond ~2 hours (e.g. Ottawa) start as status 'confirm' until local
 *   photographers are live.
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
 * ~2 hours highway drive from Mississauga at launch.
 * ~175 km ≈ 2 h at typical 401 / QEW speeds; covers London, Guelph, Cambridge,
 * full GGH, Niagara, Barrie — not Ottawa.
 */
export const LAUNCH_DRIVE_HOURS = 2
export const LAUNCH_DRIVE_RADIUS_KM = 175

/**
 * Live coverage hubs for the map.
 * Order = chip rail order. Keep Canada-first; no city laundry list in brand line.
 */
export const COVERAGE_HUBS: CoverageHub[] = [
  {
    id: 'drive2h',
    name: '2-hour range',
    region: 'Ontario · base',
    lng: TRAVEL_BASE.lng,
    lat: TRAVEL_BASE.lat,
    radiusKm: LAUNCH_DRIVE_RADIUS_KM,
    status: 'base',
    note:
      ' — launch coverage is anything within about 2 hours’ drive of Mississauga: Greater Golden Horseshoe, Cambridge, Kitchener, Waterloo, Guelph, London, Hamilton, Niagara, Barrie corridor, and nearby. First 25 km free, then travel billed per km before you pay. Address on /book confirms the quote.',
    detail: {
      headline: 'Within ~2 hours of Mississauga',
      desc: 'At launch we cover listings inside about a 2-hour drive of Mississauga — GTA and the full Greater Golden Horseshoe, plus Cambridge, Guelph, London, Hamilton, Niagara, Barrie, and the rest of that shed. Travel is quoted before you pay (first 25 km free). Licensed Advanced RPAS where airspace requires it.',
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
    note: ' — beyond the 2-hour Mississauga drive shed. Photographer coverage expands with booked demand — confirm before you lock the slot.',
    detail: {
      headline: 'Coverage on confirm',
      desc: 'National Capital is outside the launch 2-hour drive range. Confirm photographer coverage before you pay.',
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
  if (hub.status === 'base') return '≤2 hr · Mississauga'
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
      name: hub.id === 'drive2h' ? '2-hour drive range' : hub.name,
      region: hub.status === 'base' ? 'Ontario · travel base Mississauga' : hub.region,
      headline: hub.detail.headline,
      desc: hub.detail.desc,
    })
  }
  return cards
}
