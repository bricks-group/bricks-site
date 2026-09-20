/**
 * Node/TS port of supabase/functions/quote/index.ts — same rates, geocode,
 * OSM footprint, package ladder, staging always false, refuse legacy IDs.
 * Keep lockstep with src/lib/pricing.ts and the Deno edge function.
 */
import {
  PHOTO_RATE,
  DRONE_RATE,
  REEL_RATE,
  TWILIGHT_RATE,
  TOUR_RATE,
  RUSH_FLAT,
  STAGING_PER_IMAGE,
  FLOOR_PLAN_ONLY_RATE,
  BAND_LABELS,
  LEGACY_COMPANION_PACKAGE_IDS,
} from '@/lib/pricing'

const BASE = { lat: 43.5860724, lon: -79.7482435 } // Mississauga
const FREE_KM = 25
const PER_KM = 0.75
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
  base_rate: number
  travel_free_km: number
  travel_per_km: number
  travel_km_billable: number
  travel_fee: number
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

function band(sqft: number): number {
  if (sqft <= 1200) return 0
  if (sqft <= 2500) return 1
  if (sqft <= 4000) return 2
  return 3
}

function haversine(a: { lat: number; lon: number }, b: { lat: number; lon: number }): number {
  const R = 6371
  const dLat = ((b.lat - a.lat) * Math.PI) / 180
  const dLon = ((b.lon - a.lon) * Math.PI) / 180
  const la1 = (a.lat * Math.PI) / 180
  const la2 = (b.lat * Math.PI) / 180
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin(dLon / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

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

  // Launch honesty: owned staging not ready — never price/charge staging.
  const staging = false
  const stagingImages = 0
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

  const typeBand: Record<string, number> = {
    Condo: 0,
    'Semi / Town': 1,
    Detached: 1,
    Multiplex: 2,
    Commercial: 2,
    Estate: 3,
  }
  const finalBand = Math.max(band(sqft!), typeBand[pt] ?? 1)

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

  const dist = haversine(BASE, geo)
  const billableKm = Math.max(0, dist - FREE_KM)
  const travel = Math.round(billableKm * PER_KM * 100) / 100

  const addons: QuoteAddon[] = []
  if (reel) addons.push({ label: 'Cinematic reel', amount: REEL_RATE[finalBand] })
  if (tour) addons.push({ label: 'Virtual tour', amount: TOUR_RATE[finalBand] })
  if (twilight) addons.push({ label: 'Twilight photography', amount: TWILIGHT_RATE[finalBand] })
  if (rush) addons.push({ label: 'Rush delivery', amount: RUSH_FLAT })
  // staging always false at launch — keep branch for lockstep with edge quote
  if (staging && stagingImages > 0) {
    const n = stagingImages as number
    addons.push({
      label: n === 1 ? 'Virtual staging (1 image)' : `Virtual staging (${n} images)`,
      amount: n * STAGING_PER_IMAGE,
    })
  }
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
      base_rate: base,
      travel_free_km: FREE_KM,
      travel_per_km: PER_KM,
      travel_km_billable: Math.round(billableKm * 10) / 10,
      travel_fee: travel,
      addons,
      addons_total: addonsTotal,
      subtotal: Math.round(subtotal * 100) / 100,
      hst_rate: HST,
      hst: tax,
      total,
    },
  }
}
