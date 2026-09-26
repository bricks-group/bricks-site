// Supabase Edge Function: quote
// Dynamic pricing engine for Bricks listing-media booking — à la carte.
// Flow: address -> Nominatim geocode (lat/lng, travel distance) ->
// FREE sqft guess (OSM building footprint at the coord, clamped to the
// property-type range; agent confirms in wizard) -> footprint band ->
// photo + drone base (always included) -> travel (pre-assign: $0 pending
// photographer assign — not founder-home Montevideo) -> add-ons ->
// +13% HST = total.
// No paid sqft API: CleverTech's free tier is unusable for sqft and its
// monthly limit is too small to call per-quote; GeoWarehouse (~$100/mo) is
// the paid upgrade path. The agent's confirmed sqft overrides the guess.
// Returns an itemized quote so the wizard can show "data speaks for itself".
//
// Deploy:  supabase functions deploy quote
// Invoke:  POST /functions/v1/quote   body: {address, property_type, drone_addon?, reel_addon, tour_addon, twilight_addon, rush_addon, staging_addon?, staging_images?, floor_plan_only?, sqft?}
// drone_addon defaults true (photo+drone is the standard included base); pass
// false for the "Photos only" bare-minimum tier -- drops drone and the floor
// plan deliverable, photo_rate alone is charged.
//
// All outbound calls use a proper User-Agent (Nominatim policy) and are
// best-effort; if geo/sqft lookup fails we fall back to a category estimate
// and flag `sqft_estimated: true` so the wizard asks the agent to confirm.

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// ----- Config (change here; one-line constants) -----
// Coverage map hub is map-only. Pre-assign fee: $0 until photographer base known.
const FREE_KM = 25;
const PER_KM = 0.75; // market rate (CRA vehicle cost ~$0.73/km)
const HST = 0.13;
// GTA major = coverage LAUNCH_RING (Golden Horseshoe base hub). $0 travel.
const GTA_MAJOR_RING: [number, number][] = [[-78.17, 43.959], [-78.29, 43.951], [-78.45, 43.92], [-78.58, 43.905], [-78.68, 43.898], [-78.82, 43.868], [-78.93, 43.855], [-79.02, 43.848], [-79.09, 43.825], [-79.14, 43.805], [-79.2, 43.755], [-79.24, 43.712], [-79.3, 43.675], [-79.34, 43.655], [-79.38, 43.642], [-79.4, 43.635], [-79.44, 43.632], [-79.48, 43.63], [-79.52, 43.615], [-79.56, 43.592], [-79.585, 43.565], [-79.62, 43.555], [-79.67, 43.52], [-79.69, 43.47], [-79.71, 43.42], [-79.74, 43.36], [-79.77, 43.325], [-79.79, 43.295], [-79.78, 43.27], [-79.74, 43.255], [-79.68, 43.24], [-79.6, 43.225], [-79.55, 43.21], [-79.48, 43.195], [-79.4, 43.185], [-79.33, 43.18], [-79.27, 43.195], [-79.18, 43.22], [-79.1, 43.245], [-79.08, 43.2], [-79.085, 43.15], [-79.09, 43.11], [-79.08, 43.06], [-79.06, 43.02], [-79.04, 42.98], [-79.02, 42.935], [-79.01, 42.905], [-79.08, 42.875], [-79.17, 42.87], [-79.25, 42.875], [-79.35, 42.868], [-79.48, 42.875], [-79.58, 42.87], [-79.7, 42.865], [-79.85, 42.85], [-80.0, 42.835], [-80.15, 42.81], [-80.22, 42.785], [-80.35, 42.77], [-80.5, 42.76], [-80.65, 42.745], [-80.8, 42.73], [-80.95, 42.72], [-81.1, 42.7], [-81.22, 42.675], [-81.3, 42.72], [-81.35, 42.82], [-81.4, 42.92], [-81.45, 43.0], [-81.42, 43.08], [-81.25, 43.2], [-81.05, 43.32], [-80.85, 43.4], [-80.7, 43.48], [-80.55, 43.52], [-80.4, 43.56], [-80.2, 43.62], [-80.0, 43.7], [-79.9, 43.85], [-79.8, 44.05], [-79.72, 44.25], [-79.68, 44.38], [-79.45, 44.36], [-79.2, 44.3], [-78.95, 44.2], [-78.7, 44.1], [-78.45, 44.0], [-78.3, 43.97], [-78.17, 43.959]];
function pointInRing(lng: number, lat: number, ring: [number, number][]): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i][0], yi = ring[i][1], xj = ring[j][0], yj = ring[j][1];
    if ((yi > lat) !== (yj > lat) && lng < ((xj - xi) * (lat - yi)) / (yj - yi || 1e-15) + xi) inside = !inside;
  }
  return inside;
}
function isGtaMajorMarket(lat: number, lon: number): boolean {
  return pointInRing(lon, lat, GTA_MAJOR_RING);
}


// Footprint bands, aligned to the pricing page: small <=1,200 / mid <=2,500 /
// large <=4,000 / xl 4,000+ sq ft.
const BAND_LABEL = ['Small', 'Mid', 'Large', 'XL'];

// À la carte rates (CAD, pre-tax) by footprint band. Photo + drone are the
// always-included base; everything else is an optional add-on.
const PHOTO_RATE = [149, 199, 249, 299];
const DRONE_RATE = [99, 119, 139, 159];
const REEL_RATE = [149, 179, 209, 249];
const TWILIGHT_RATE = [150, 170, 185, 200];
const TOUR_RATE = [149, 199, 249, 299];
const RUSH_FLAT = 75;
const STAGING_PER_IMAGE = 35;
const FLOOR_PLAN_ONLY_RATE = 99;

function bad(msg: string, status = 400) {
  return new Response(JSON.stringify({ ok: false, error: msg }), {
    status, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function band(sqft: number): number {
  if (sqft <= 1200) return 0;
  if (sqft <= 2500) return 1;
  if (sqft <= 4000) return 2;
  return 3;
}


async function geocode(address: string): Promise<{ lat: number; lon: number; display: string } | null> {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1&countrycodes=ca`;
  try {
    const r = await fetch(url, { headers: { 'User-Agent': 'BricksPreLaunch/1.0 (booking@brxs.ca)' } });
    const j = await r.json();
    if (Array.isArray(j) && j.length) {
      const disp = j[0].display_name || '';
      // Hard guard: only Canadian addresses are in scope for the GTA pre-launch.
      if (!/Canada/i.test(disp)) return null;
      return { lat: +j[0].lat, lon: +j[0].lon, display: disp };
    }
  } catch { /* ignore */ }
  return null;
}

// No paid sqft source (CleverTech free tier is unusable for sqft; GeoWarehouse
// is ~$100/mo). For a FREE guess we use the OSM building footprint at the
// geocoded coord: a single fast Overpass call. Footprint over-estimates living
// area (includes garage/porch, and storeys are mostly untagged), so we treat it
// as a ceiling and blend it with the property-type default. Agent confirms.
async function osmFootprintSqft(lat: number, lon: number): Promise<number | null> {
  const d = 0.00045; // ~45m box around the address
  const q = `[out:json];way[building](${lat - d},${lon - d},${lat + d},${lon + d});out geom 1;`;
  try {
    const r = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST', body: new URLSearchParams({ data: q }).toString(),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'User-Agent': 'BricksPreLaunch/1.0' },
    });
    const j = await r.json();
    // pick the largest nearby footprint (the building the address sits on)
    let best = 0;
    for (const e of j.elements ?? []) {
      const g = e.geometry;
      if (!g || g.length < 3) continue;
      const latr = (g[0].lat * Math.PI) / 180;
      const mLat = 111320, mLon = 111320 * Math.cos(latr);
      const pts = g.map((p: any) => [p.lon * mLon, p.lat * mLat]);
      const n = pts.length; let a = 0;
      for (let i = 0; i < n; i++) { const [x1, y1] = pts[i], [x2, y2] = pts[(i + 1) % n]; a += x1 * y2 - x2 * y1; }
      const area_m2 = Math.abs(a / 2);
      best = Math.max(best, area_m2 * 10.7639);
    }
    // living area ~ footprint * 0.55 (garage/porch/multi-unit fudge); sane range
    const living = Math.round(best * 0.55);
    if (living >= 500 && living <= 20000) return living;
    return null;
  } catch { return null; }
}


Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return bad('Method not allowed');

  let body: any;
  try { body = await req.json(); } catch { return bad('Invalid JSON'); }

  const address = (body.address || '').toString().trim();
  // drone defaults true (existing "always included" behavior); explicit false
  // is the "Photos only" bare-minimum tier -- drone dropped, floor plan also
  // dropped from the deliverable (it was never a separate priced line, so
  // that half of the drop doesn't change the total).
  // Package ladder (www /book): expand package_id into included lines so a
  // Showcase/Suite checkout cannot undercharge when only package_id is sent.
  // Explicit addon flags still OR-in (custom mixes / add-ons on Essentials).
  const pkgRaw = String(body.package_id || '').toLowerCase().replace(/[^a-z0-9_]+/g, '_');
  // Honest mapping: Companion legacy IDs are NOT charge aliases for www à-la-carte rates.
  if (['standard', 'premium', 'luxury', 'estate'].includes(pkgRaw)) {
    return bad(
      'Legacy Companion package_id is not sold on www. Use essentials/story/showcase/suite (or photos_only / floor_plan_only) — same ladder Companion now charges.',
      400,
    );
  }
  const floorPlanOnly = body.floor_plan_only === true || body.floor_plan_only === 'true'
    || pkgRaw === 'floor_plan_only' || pkgRaw === 'floorplan_only';
  const photosOnly = pkgRaw === 'photos_only' || pkgRaw === 'photosonly';
  let drone = !(body.drone_addon === false || body.drone_addon === 'false');
  let reel = body.reel_addon === true || body.reel_addon === 'true';
  let tour = body.tour_addon === true || body.tour_addon === 'true';
  let twilight = body.twilight_addon === true || body.twilight_addon === 'true';
  const rush = body.rush_addon === true || body.rush_addon === 'true';
  if (photosOnly) {
    drone = false;
  } else if (!floorPlanOnly) {
    // www / Companion shared ladder only (no silent Standard→Essentials remap)
    if (['story', 'showcase', 'suite', 'full'].includes(pkgRaw)) reel = true;
    if (['showcase', 'suite', 'full'].includes(pkgRaw)) tour = true;
    if (['suite', 'full'].includes(pkgRaw)) twilight = true;
    if (['essentials', 'story', 'showcase', 'suite', 'full'].includes(pkgRaw)) {
      drone = true;
    }
  }
  // Launch honesty (2026-09-12): owned staging not ready — never price/charge staging in quote.
  const staging = false;
  const stagingImages = 0;
  const manualSqft = body.sqft ? parseInt(body.sqft) : null;

  if (!address) return bad('Address is required');

  // 1) geocode
  const geo = await geocode(address);
  if (!geo) return bad('Could not geocode address', 422);

  // 2) sqft: agent manual override wins. Otherwise take a FREE guess.
  //    OSM building footprint is trusted ONLY for free-standing types
  //    (Detached/Commercial/Estate) where the polygon ≈ the building. For
  //    attached types (Semi / Town, Condo, Multiplex) OSM captures the whole
  //    shared structure (e.g. a semi pair = ~7000 sqft), so we use the
  //    property-type default instead. All guesses are flagged for agent
  //    confirmation in the wizard.
  const DEFAULT_SQFT: Record<string, number> = {
    'Condo': 850, 'Semi / Town': 1600, 'Detached': 2600,
    'Multiplex': 3200, 'Commercial': 4000, 'Estate': 6000,
  };
  // types where an OSM footprint ≈ the actual building (not shared walls)
  const FREE_STANDING = new Set(['Detached', 'Commercial', 'Estate']);
  let sqft: number | null = manualSqft;
  let sqft_source = manualSqft ? 'agent' : 'none';
  let sqft_estimated = false;
  const pt = (body.property_type || '').toString().trim();
  if (!sqft) {
    const def = DEFAULT_SQFT[pt] ?? 2200;
    if (FREE_STANDING.has(pt)) {
      const fp = await osmFootprintSqft(geo.lat, geo.lon);
      if (fp && fp >= def * 0.5 && fp <= def * 1.6) {
        sqft = fp; sqft_source = 'osm-footprint'; sqft_estimated = true;
      } else {
        sqft = def; sqft_source = 'type-default'; sqft_estimated = true;
      }
    } else {
      sqft = def; sqft_source = 'type-default'; sqft_estimated = true;
    }
  }
  // property-type band nudges the tier when we lack a real sqft
  const typeBand: Record<string, number> = {
    'Condo': 0, 'Semi / Town': 1, 'Detached': 1, 'Multiplex': 2, 'Commercial': 2, 'Estate': 3,
  };

  // 3) footprint band (sqft band, nudged up by property type so type defaults don't under-price)
  const finalBand = Math.max(band(sqft), typeBand[pt] ?? 1);

  // 4) base = photo+drone (standard), photos-only (photo alone), or floor-plan-only ($99 flat).
  let photo_rate = 0;
  let drone_rate = 0;
  let base = 0;
  let floor_plan_included = false;
  let drone_included = false;
  if (floorPlanOnly) {
    photo_rate = 0;
    drone_rate = 0;
    base = FLOOR_PLAN_ONLY_RATE;
    floor_plan_included = true;
    drone_included = false;
  } else {
    photo_rate = PHOTO_RATE[finalBand];
    drone_rate = drone ? DRONE_RATE[finalBand] : 0;
    base = photo_rate + drone_rate;
    floor_plan_included = drone; // floor plan travels with the standard tier, dropped on Photos only
    drone_included = drone;
  }

  // 5) travel
  // Assign-first: GTA major = $0 final. Outside GTA needs OS assign (pending here blocks checkout).
  const gta_major = isGtaMajorMarket(geo.lat, geo.lon);
  const dist = 0;
  const billableKm = 0;
  const travel = 0;
  const travel_pending = !gta_major;
  const travel_basis = gta_major ? 'gta_major' : 'pending';

  // 6) add-ons
  const addons: { label: string; amount: number }[] = [];
  if (reel) addons.push({ label: 'Cinematic reel', amount: REEL_RATE[finalBand] });
  if (tour) addons.push({ label: 'Virtual tour', amount: TOUR_RATE[finalBand] });
  if (twilight) addons.push({ label: 'Twilight photography', amount: TWILIGHT_RATE[finalBand] });
  if (rush) addons.push({ label: 'Rush delivery', amount: RUSH_FLAT });
  if (staging && stagingImages > 0) {
    addons.push({
      label: stagingImages === 1 ? 'Virtual staging (1 image)' : `Virtual staging (${stagingImages} images)`,
      amount: stagingImages * STAGING_PER_IMAGE,
    });
  }
  const addonsTotal = addons.reduce((s, a) => s + a.amount, 0);

  // 7) subtotal + HST
  const subtotal = base + travel + addonsTotal;
  const tax = Math.round(subtotal * HST * 100) / 100;
  const total = Math.round((subtotal + tax) * 100) / 100;

  return new Response(JSON.stringify({
    ok: true,
    quote: {
      address: geo.display,
      lat: geo.lat, lon: geo.lon,
      distance_km: Math.round(dist * 10) / 10,
      sqft, sqft_source, sqft_estimated,
      footprint_band: finalBand,
      footprint_label: BAND_LABEL[finalBand],
      photo_rate, drone_rate, drone_included, floor_plan_included,
      floor_plan_only: floorPlanOnly,
      floor_plan_only_rate: floorPlanOnly ? FLOOR_PLAN_ONLY_RATE : 0,
      staging_addon: staging, staging_images: stagingImages, staging_per_image: STAGING_PER_IMAGE,
      base_rate: base,
      travel_free_km: FREE_KM, travel_per_km: PER_KM, travel_km_billable: Math.round(billableKm * 10) / 10, travel_fee: travel, travel_pending, travel_basis, gta_major, assignee_id: null,
      addons, addons_total: addonsTotal,
      subtotal: Math.round(subtotal * 100) / 100,
      hst_rate: HST, hst: tax,
      total,
    },
  }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
});
