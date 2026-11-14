/**
 * Node/TS port of supabase/functions/quote/index.ts — same rates, geocode,
 * OSM footprint, package ladder, visit bands + staging per image, refuse legacy IDs.
 * Keep lockstep with src/lib/pricing.ts and the Deno edge function.
 */
import {
  PHOTO_RATE,
  DRONE_RATE,
  REEL_RATE,
  TWILIGHT_RATE,
  TOUR_RATE,
  VISIT_RATE,
  RUSH_FLAT,
  STAGING_PER_IMAGE,
  VIRTUAL_STAGING_ENABLED,
  FLOOR_PLAN_ONLY_RATE,
  BAND_LABELS,
  LEGACY_COMPANION_PACKAGE_IDS,
  finalFootprintBand,
  TRAVEL_FREE_KM,
  TRAVEL_PER_KM,
} from '@/lib/pricing'
import { isGtaMajorMarket, GTA_MAJOR_TRAVEL_ZERO_LABEL } from '@/lib/coverage'

// Travel fee product law (Kam 2026-09-26):
// Assign photographer near-instant BEFORE checkout; show final fee then pay.
// GTA major markets (coverage LAUNCH_RING) = $0 travel. Outside GTA: travel from
// assigned vendor service/home lat/lng (25 km free, $0.75/km). Never founder home
// / Montevideo / Mississauga HQ as fee base. travel_pending is NOT the happy path.
// Coverage TRAVEL_BASE is map-only. www quote uses GTA $0 locally; checkout/OS
// allocates vendor and blocks if none available.
const FREE_KM = TRAVEL_FREE_KM
const PER_KM = TRAVEL_PER_KM
const HST = 0.13

export type QuoteAddon = { label: string; amount: number }

export type QuoteResult = {
  address: string
  lat: number
  lon: number
  distance_km: number
  sqft: number | null
  sqft_source: string
  sqft_estimated: boolean
  footprint_band: number
  footprint_label: string
  photo_rate: number
  drone_rate: number
  drone_included: boolean
  floor_plan_included: boolean
  floor_plan_only: boolean
  floor_plan_only_rate: number
  staging_addon: boolean
  staging_images: number
  staging_per_image: number
  visit_addon: boolean
  visit_rate: number
  base_rate: number
  travel_free_km: number
  travel_per_km: number
  travel_km_billable: number
  travel_fee: number
  /** True only when assign failed — checkout must block (not the happy path). */
  travel_pending: boolean
  travel_basis?: 'gta_major' | 'vendor_assigned' | 'pending'
  gta_major?: boolean
  assignee_id?: string | null
  addons: QuoteAddon[]
  addons_total: number
  subtotal: number
  hst_rate: number
  hst: number
  total: number
}

export type BuildQuoteOk = { ok: true; quote: QuoteResult }
export type BuildQuoteErr = { ok: false; error: string; status: number }
export type BuildQuoteResult = BuildQuoteOk | BuildQuoteErr


async function geocode(address: string): Promise<{ lat: number; lon: number; display: string } | null> {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1&countrycodes=ca`
  try {
    const r = await fetch(url, {
      headers: { 'User-Agent': 'BricksPreLaunch/1.0 (booking@brxs.ca)' },
    })
    const j = await r.json()
    if (Array.isArray(j) && j.length) {
      const disp = j[0].display_name || ''
      if (!/Canada/i.test(disp)) return null
      return { lat: +j[0].lat, lon: +j[0].lon, display: disp }
    }
  } catch {
    /* ignore */
  }
  return null
}

async function osmFootprintSqft(lat: number, lon: number): Promise<number | null> {
  const d = 0.00045
  const q = `[out:json];way[building](${lat - d},${lon - d},${lat + d},${lon + d});out geom 1;`
  try {
    const r = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: new URLSearchParams({ data: q }).toString(),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'BricksPreLaunch/1.0',
      },
    })
    const j = await r.json()
    let best = 0
    for (const e of j.elements ?? []) {
      const g = e.geometry
      if (!g || g.length < 3) continue
      const latr = (g[0].lat * Math.PI) / 180
      const mLat = 111320
      const mLon = 111320 * Math.cos(latr)
      const pts = g.map((p: { lon: number; lat: number }) => [p.lon * mLon, p.lat * mLat])
      const n = pts.length
      let a = 0
      for (let i = 0; i < n; i++) {
        const [x1, y1] = pts[i]
        const [x2, y2] = pts[(i + 1) % n]
        a += x1 * y2 - x2 * y1
      }
      const area_m2 = Math.abs(a / 2)
      best = Math.max(best, area_m2 * 10.7639)
    }
    const living = Math.round(best * 0.55)
    if (living >= 500 && living <= 20000) return living
    return null
  } catch {
    return null
  }
}

function normPkg(raw: unknown): string {
  return String(raw || '')
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, '_')
}


export function mediaAddonLines(opts: {
  finalBand: number
  reel: boolean
  tour: boolean
  twilight: boolean
  rush: boolean
  visit: boolean
  stagingImages: number
}): QuoteAddon[] {
  const addons: QuoteAddon[] = []
  const b = opts.finalBand
  if (opts.reel) addons.push({ label: 'Cinematic reel', amount: REEL_RATE[b] })
  if (opts.tour) addons.push({ label: 'Virtual tour', amount: TOUR_RATE[b] })
  if (opts.twilight) addons.push({ label: 'Twilight photography', amount: TWILIGHT_RATE[b] })
  if (opts.rush) addons.push({ label: 'Rush delivery', amount: RUSH_FLAT })
  if (opts.visit) addons.push({ label: 'Virtual visit', amount: VISIT_RATE[b] })
  if (opts.stagingImages > 0) {
    const n = opts.stagingImages
    addons.push({
      label: n === 1 ? 'Virtual staging (1 image)' : `Virtual staging (${n} images)`,
      amount: n * STAGING_PER_IMAGE,
    })
  }
  return addons
}

/** Server-side quote. Never trusts client total. */
export async function buildQuote(body: Record<string, unknown>): Promise<BuildQuoteResult> {
  const address = (body.address || body.property_address || '').toString().trim()
  const pkgRaw = normPkg(body.package_id)

  if ((LEGACY_COMPANION_PACKAGE_IDS as readonly string[]).includes(pkgRaw)) {
    return {
      ok: false,
      error:
        'Legacy Companion package_id is not sold on www. Use essentials/story/showcase/suite (or photos_only / floor_plan_only) — same ladder Companion now charges.',
      status: 400,
    }
  }

  const floorPlanOnly =
    body.floor_plan_only === true ||
    body.floor_plan_only === 'true' ||
    pkgRaw === 'floor_plan_only' ||
    pkgRaw === 'floorplan_only'
  const photosOnly = pkgRaw === 'photos_only' || pkgRaw === 'photosonly'

  let drone = !(body.drone_addon === false || body.drone_addon === 'false')
  let reel = body.reel_addon === true || body.reel_addon === 'true'
  let tour = body.tour_addon === true || body.tour_addon === 'true'
  let twilight = body.twilight_addon === true || body.twilight_addon === 'true'
  const rush = body.rush_addon === true || body.rush_addon === 'true'

  if (photosOnly) {
    drone = false
  } else if (!floorPlanOnly) {
    if (['story', 'showcase', 'suite', 'full'].includes(pkgRaw)) reel = true
    if (['showcase', 'suite', 'full'].includes(pkgRaw)) tour = true
    if (['suite', 'full'].includes(pkgRaw)) twilight = true
    if (['essentials', 'story', 'showcase', 'suite', 'full'].includes(pkgRaw)) {
      drone = true
    }
  }

  // Virtual staging is $35/photo. Visit is the footprint-band add-on. Neither is packaged.
  // Off sale while VIRTUAL_STAGING_ENABLED is false (lib/pricing): requests are ignored, never priced.
  const stagingRequested = VIRTUAL_STAGING_ENABLED && (body.staging_addon === true || body.staging_addon === 'true')
  let stagingImages = parseInt(String(body.staging_images ?? '0'), 10)
  if (!Number.isFinite(stagingImages) || stagingImages < 0) stagingImages = 0
  if (stagingRequested && stagingImages < 1) stagingImages = 1
  if (!stagingRequested) stagingImages = 0
  const staging = stagingImages > 0
  const visit = body.visit_addon === true || body.visit_addon === 'true'
  const manualSqft = body.sqft ? parseInt(String(body.sqft), 10) : null

  if (!address) return { ok: false, error: 'Address is required', status: 400 }

  const geo = await geocode(address)
  if (!geo) return { ok: false, error: 'Could not geocode address', status: 422 }

  const DEFAULT_SQFT: Record<string, number> = {
    Condo: 850,
    'Semi / Town': 1600,
    Detached: 2600,
    Multiplex: 3200,
    Commercial: 4000,
    Estate: 6000,
  }
  const FREE_STANDING = new Set(['Detached', 'Commercial', 'Estate'])
  let sqft: number | null = Number.isFinite(manualSqft as number) ? (manualSqft as number) : null
  let sqft_source = sqft ? 'agent' : 'none'
  let sqft_estimated = false
  const pt = (body.property_type || '').toString().trim()

  if (!sqft) {
    const def = DEFAULT_SQFT[pt] ?? 2200
    if (FREE_STANDING.has(pt)) {
      const fp = await osmFootprintSqft(geo.lat, geo.lon)
      if (fp && fp >= def * 0.5 && fp <= def * 1.6) {
        sqft = fp
        sqft_source = 'osm-footprint'
        sqft_estimated = true
      } else {
        sqft = def
        sqft_source = 'type-default'
        sqft_estimated = true
      }
    } else {
      sqft = def
      sqft_source = 'type-default'
      sqft_estimated = true
    }
  }

  const finalBand = finalFootprintBand(sqft!, pt)

  let photo_rate = 0
  let drone_rate = 0
  let base = 0
  let floor_plan_included = false
  let drone_included = false
  if (floorPlanOnly) {
    base = FLOOR_PLAN_ONLY_RATE
    floor_plan_included = true
  } else {
    photo_rate = PHOTO_RATE[finalBand]
    drone_rate = drone ? DRONE_RATE[finalBand] : 0
    base = photo_rate + drone_rate
    floor_plan_included = drone
    drone_included = drone
  }

  // Assign-first law: GTA major = $0 final travel. Outside GTA, www quote cannot
  // invent a vendor base — mark pending so checkout/OS allocate+block path runs.
  // (OS www-create-checkout / www-quote allocates near-instant and refuses pay if unassigned.)
  const gta_major = isGtaMajorMarket(geo.lat, geo.lon)
  let dist = 0
  let billableKm = 0
  let travel = 0
  let travel_pending = false
  let travel_basis: 'gta_major' | 'vendor_assigned' | 'pending' = 'gta_major'
  if (gta_major) {
    travel = 0
    billableKm = 0
    travel_pending = false
    travel_basis = 'gta_major'
  } else {
    // Outside GTA major: final travel requires assigned vendor (OS checkout).
    // Do not bill Mississauga/Montevideo. Soft-pending here; checkout blocks until assign.
    travel = 0
    billableKm = 0
    dist = 0
    travel_pending = true
    travel_basis = 'pending'
  }

  const addons = mediaAddonLines({
    finalBand,
    reel,
    tour,
    twilight,
    rush,
    visit,
    stagingImages,
  })
  const addonsTotal = addons.reduce((s, a) => s + a.amount, 0)
  const subtotal = base + travel + addonsTotal
  const tax = Math.round(subtotal * HST * 100) / 100
  const total = Math.round((subtotal + tax) * 100) / 100

  return {
    ok: true,
    quote: {
      address: geo.display,
      lat: geo.lat,
      lon: geo.lon,
      distance_km: Math.round(dist * 10) / 10,
      sqft,
      sqft_source,
      sqft_estimated,
      footprint_band: finalBand,
      footprint_label: BAND_LABELS[finalBand],
      photo_rate,
      drone_rate,
      drone_included,
      floor_plan_included,
      floor_plan_only: floorPlanOnly,
      floor_plan_only_rate: floorPlanOnly ? FLOOR_PLAN_ONLY_RATE : 0,
      staging_addon: staging,
      staging_images: stagingImages,
      staging_per_image: STAGING_PER_IMAGE,
      visit_addon: visit,
      visit_rate: visit ? VISIT_RATE[finalBand] : 0,
      base_rate: base,
      travel_free_km: FREE_KM,
      travel_per_km: PER_KM,
      travel_km_billable: Math.round(billableKm * 10) / 10,
      travel_fee: travel,
      travel_pending,
      travel_basis,
      gta_major,
      assignee_id: null,
      addons,
      addons_total: addonsTotal,
      subtotal: Math.round(subtotal * 100) / 100,
      hst_rate: HST,
      hst: tax,
      total,
    },
  }
}
