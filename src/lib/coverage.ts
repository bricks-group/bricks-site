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
 * - Public label: Golden Horseshoe (GGH+) with Mississauga as coverage map hub.
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

/** Mississauga coverage map hub (market hub — NOT founder home, NOT travel-fee base when a vendor is known). */
export const TRAVEL_BASE = { lng: -79.7482435, lat: 43.5860724, name: 'Mississauga' } as const

/**
 * INTERNAL: ~2 h highway from Mississauga. Used when estimating radius only.
 * Public map uses LAUNCH_RING (Canada-clipped) — do not draw a raw circle.
 */
export const LAUNCH_DRIVE_HOURS = 2
export const LAUNCH_DRIVE_RADIUS_KM = 175

/**
 * Canada-only launch footprint (Ontario), land-hugging.
 * Dense ring follows L. Ontario shore, Niagara River (ON bank), and L. Erie
 * north shore — no lake chords, no US. Sized for ~2 h from Mississauga.
 * Counter-clockwise exterior (GeoJSON).
 */
const LAUNCH_RING: [number, number][] = [
  [-78.17, 43.959],
  [-78.29, 43.951],
  [-78.45, 43.92],
  [-78.58, 43.905],
  [-78.68, 43.898],
  [-78.82, 43.868],
  [-78.93, 43.855],
  [-79.02, 43.848],
  [-79.09, 43.825],
  [-79.14, 43.805],
  [-79.2, 43.755],
  [-79.24, 43.712],
  [-79.3, 43.675],
  [-79.34, 43.655],
  [-79.38, 43.642],
  [-79.4, 43.635],
  [-79.44, 43.632],
  [-79.48, 43.63],
  [-79.52, 43.615],
  [-79.56, 43.592],
  [-79.585, 43.565],
  [-79.62, 43.555],
  [-79.67, 43.52],
  [-79.69, 43.47],
  [-79.71, 43.42],
  [-79.74, 43.36],
  [-79.77, 43.325],
  [-79.79, 43.295],
  [-79.78, 43.27],
  [-79.74, 43.255],
  [-79.68, 43.24],
  [-79.6, 43.225],
  [-79.55, 43.21],
  [-79.48, 43.195],
  [-79.4, 43.185],
  [-79.33, 43.18],
  [-79.27, 43.195],
  [-79.18, 43.22],
  [-79.1, 43.245],
  [-79.08, 43.2],
  [-79.085, 43.15],
  [-79.09, 43.11],
  [-79.08, 43.06],
  [-79.06, 43.02],
  [-79.04, 42.98],
  [-79.02, 42.935],
  [-79.01, 42.905],
  [-79.08, 42.875],
  [-79.17, 42.87],
  [-79.25, 42.875],
  [-79.35, 42.868],
  [-79.48, 42.875],
  [-79.58, 42.87],
  [-79.7, 42.865],
  [-79.85, 42.85],
  [-80.0, 42.835],
  [-80.15, 42.81],
  [-80.22, 42.785],
  [-80.35, 42.77],
  [-80.5, 42.76],
  [-80.65, 42.745],
  [-80.8, 42.73],
  [-80.95, 42.72],
  [-81.1, 42.7],
  [-81.22, 42.675],
  [-81.3, 42.72],
  [-81.35, 42.82],
  [-81.4, 42.92],
  [-81.45, 43.0],
  [-81.42, 43.08],
  [-81.25, 43.2],
  [-81.05, 43.32],
  [-80.85, 43.4],
  [-80.7, 43.48],
  [-80.55, 43.52],
  [-80.4, 43.56],
  [-80.2, 43.62],
  [-80.0, 43.7],
  [-79.9, 43.85],
  [-79.8, 44.05],
  [-79.72, 44.25],
  [-79.68, 44.38],
  [-79.45, 44.36],
  [-79.2, 44.3],
  [-78.95, 44.2],
  [-78.7, 44.1],
  [-78.45, 44.0],
  [-78.3, 43.97],
  [-78.17, 43.959],
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
    lng: -79.55,
    lat: 43.45,
    radiusKm: LAUNCH_DRIVE_RADIUS_KM,
    status: 'base',
    ring: LAUNCH_RING,
    note:
      ' — Toronto through the Golden Horseshoe, plus Cambridge, Kitchener, Waterloo, Guelph, London, Hamilton, Niagara, Barrie, and nearby. Travel is from the assigned photographer’s base (first 25 km free, then per km). Address on /book confirms the quote.',
    detail: {
      headline: 'Listing photos across the Golden Horseshoe',
      desc: 'GTA and the Greater Golden Horseshoe, plus Cambridge, Guelph, London, Hamilton, Niagara, Barrie corridor, and nearby Ontario. Travel from the assigned photographer’s base (first 25 km free). Licensed Advanced RPAS where airspace requires it.',
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
