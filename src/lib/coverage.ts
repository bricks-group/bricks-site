/**
 * Bricks coverage — single source of truth for www /service-areas map + copy.
 *
 * Update this file when business growth changes hubs (new active market,
 * city moves from on-confirm → active, travel base moves). Do not scatter
 * duplicate hub lists in page or map components.
 *
 * Geography rules:
 * - GTA = Toronto + Peel + York + Durham + Halton only (not Hamilton, not Niagara, not Ottawa).
 * - Hamilton and Niagara are separate Ontario hubs.
 * - National cities start as onConfirm until local photographers are live.
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

/** Approximate GTA outline (Toronto, Peel, York, Durham, Halton). Excludes Hamilton & Niagara. */
const GTA_RING: [number, number][] = [
  [-79.88, 43.4], // Burlington / Halton west
  [-79.78, 43.32], // Oakville lakeshore
  [-79.55, 43.48], // Mississauga lakeshore
  [-79.35, 43.58], // Toronto waterfront
  [-79.15, 43.72], // Scarborough / Pickering
  [-78.88, 43.82], // Oshawa
  [-78.92, 44.02], // north Durham
  [-79.25, 44.08], // east York / Newmarket edge
  [-79.55, 43.98], // Vaughan / north Peel
  [-79.82, 43.78], // Brampton west
  [-79.9, 43.55], // Halton north-west
  [-79.88, 43.4], // close
]

/**
 * Live coverage hubs for the map.
 * Order = chip rail order. Keep Canada-first; no city laundry list in brand line.
 */
export const COVERAGE_HUBS: CoverageHub[] = [
  {
    id: 'gta',
    name: 'Greater Toronto',
    region: 'Ontario · base',
    lng: -79.45,
    lat: 43.7,
    radiusKm: 45,
    status: 'base',
    ring: GTA_RING,
    note:
      ' — Toronto, Mississauga, Brampton, Vaughan, Markham, Richmond Hill, Durham, Oakville, and Burlington. Travel quotes from Mississauga (first 25 km free, then per km before you pay). Hamilton and Niagara are separate hubs.',
    detail: {
      headline: 'Listing photos across the GTA',
      desc: 'Toronto, Peel, York, Durham, and Halton — one footprint. Travel quotes from Mississauga (first 25 km free). Licensed Advanced RPAS where airspace requires it.',
    },
  },
  {
    id: 'hamilton',
    name: 'Hamilton',
    region: 'Ontario',
    lng: -79.8661,
    lat: 43.2557,
    radiusKm: 20,
    status: 'active',
    note: ' — Hamilton and the mountain. Travel quoted from Mississauga before you confirm. Not part of the GTA footprint.',
    detail: {
      headline: 'Listing photos Hamilton and the mountain',
      desc: 'Character homes and new inventory. Travel quoted from Mississauga before you confirm. Separate from the GTA coverage area.',
    },
  },
  {
    id: 'niagara',
    name: 'Niagara',
    region: 'Ontario',
    lng: -79.2469,
    lat: 43.1594,
    radiusKm: 24,
    status: 'active',
    note: ' — Niagara peninsula coverage when travel pencils. Confirm drone feasibility and travel before you lock the slot. Not part of the GTA.',
    detail: {
      headline: 'Toward the Niagara peninsula',
      desc: 'Coverage when travel pencils. We confirm drone feasibility and quote travel before you lock the slot. Separate from the GTA footprint.',
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
  const seen = new Set<string>()
  for (const hub of COVERAGE_HUBS) {
    if (!hub.detail) continue
    if (hub.id === 'edmonton') continue // folded into Calgary card copy
    if (hub.id === 'calgary') {
      cards.push({
        name: 'Calgary & Edmonton',
        region: 'Alberta',
        headline: hub.detail.headline,
        desc: hub.detail.desc,
      })
      continue
    }
    if (seen.has(hub.id)) continue
    seen.add(hub.id)
    cards.push({
      name: hub.id === 'gta' ? 'Greater Toronto Area' : hub.name,
      region: hub.status === 'base' ? 'Ontario · travel base Mississauga' : hub.region,
      headline: hub.detail.headline,
      desc: hub.detail.desc,
    })
  }
  return cards
}
