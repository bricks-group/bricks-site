// Supabase Edge Function: quote
// Dynamic pricing engine for Bricks listing-media booking.
// Flow: address -> Nominatim geocode (lat/lng, travel distance) ->
// FREE sqft guess (OSM building footprint at the coord, clamped to the
// property-type range; agent confirms in wizard) -> footprint tier ->
// base rate -> travel fee (haversine from BASE, FREE_KM free, $/km after)
// -> add-ons (3D tour +$199, twilight, extended 3D) -> +13% HST = total.
// No paid sqft API: CleverTech's free tier is unusable for sqft and its
// monthly limit is too small to call per-quote; GeoWarehouse (~$100/mo) is
// the paid upgrade path. The agent's confirmed sqft overrides the guess.
// Returns an itemized quote so the wizard can show "data speaks for itself".
//
// Deploy:  supabase functions deploy quote
// Invoke:  POST /functions/v1/quote   body: {address, property_type, package_interest, tour_addon, twilight_addon, extended3d_addon}
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
const BASE = { lat: 43.5860724, lon: -79.7482435 }; // 6330 Montevideo Rd, Mississauga
const FREE_KM = 25;
const PER_KM = 0.75; // market rate (CRA vehicle cost ~$0.73/km)
const HST = 0.13;

// Footprint-tier base rates (CAD, pre-tax) keyed by package + size band.
// sqft bands: small <1500, medium 1500-2999, large 3000-4999, xlarge 5000+
const BASE_RATE: Record<string, [number, number, number, number]> = {
  //            small    medium   large    xlarge
  'Standard': [349, 429, 519, 599],
  'Premium':  [749, 899, 1049, 1199],
  'Luxury':   [1199, 1399, 1699, 2099],
  'Estate':   [2899, 2899, 2899, 2899],
  // NOTE: 'Advise' is NOT a pricable package. It's a recommendation mode handled
  // below — it maps to a real package based on sqft/type and quotes THAT.
};
const ADDON = { tour: 199, twilight: 149, extended3d: 249 };

// Maps a sqft band + property type to the package we'd recommend.
function recommendPackage(sqft: number, propertyType: string): string {
  const b = band(sqft);
  // Estate-level footprint (5000+ sqft) -> Estate
  if (b >= 3) return 'Estate';
  // Commercial / multiplex -> at least Premium
  if (['Commercial', 'Multiplex', 'Estate'].includes(propertyType)) return b >= 2 ? 'Luxury' : 'Premium';
  // Condos: small -> Standard, larger -> Premium
  if (propertyType === 'Condo') return b >= 1 ? 'Premium' : 'Standard';
  // Default residential by footprint band
  if (b === 0) return 'Standard';
  if (b === 1) return 'Premium';
  if (b === 2) return 'Luxury';
  return 'Estate';
}

function bad(msg: string, status = 400) {
  return new Response(JSON.stringify({ ok: false, error: msg }), {
    status, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function band(sqft: number): number {
  if (sqft < 1500) return 0;
  if (sqft < 3000) return 1;
  if (sqft < 5000) return 2;
  return 3;
}

function haversine(a: { lat: number; lon: number }, b: { lat: number; lon: number }): number {
  const R = 6371;
  const dLat = (b.lat - a.lat) * Math.PI / 180;
  const dLon = (b.lon - a.lon) * Math.PI / 180;
  const la1 = a.lat * Math.PI / 180, la2 = b.lat * Math.PI / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
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
  const pkg = (body.package_interest || body.package || '').toString().trim();
  const tour = body.tour_addon === true || body.tour_addon === 'true';
  const twilight = body.twilight_addon === true || body.twilight_addon === 'true';
  const ext3d = body.extended3d_addon === true || body.extended3d_addon === 'true';
  const manualSqft = body.sqft ? parseInt(body.sqft) : null;

  if (!address) return bad('Address is required');
  const pkgKey = ['Standard', 'Premium', 'Luxury', 'Estate', 'Advise'].find((k) => pkg.startsWith(k)) || 'Standard';
  const isAdvise = pkgKey === 'Advise';

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
  if (!sqft) {
    const pt = (body.property_type || '').toString().trim();
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

  // 3) base rate by tier (sqft band, nudged up by property type so type defaults don't under-price)
  //    In 'Advise' mode, recommend a real package from sqft + property type (no invented fee).
  const pt = (body.property_type || '').toString().trim();
  const finalBand = Math.max(band(sqft), typeBand[pt] ?? 1);
  let effectivePkg = pkgKey;
  let recommended = false;
  if (isAdvise) {
    effectivePkg = recommendPackage(sqft, pt);
    recommended = true;
  }
  const rates = BASE_RATE[effectivePkg] ?? BASE_RATE['Standard'];
  const base = rates[finalBand];

  // 4) travel
  const dist = haversine(BASE, geo);
  const billableKm = Math.max(0, dist - FREE_KM);
  const travel = Math.round(billableKm * PER_KM * 100) / 100;

  // 5) add-ons
  const addons: { label: string; amount: number }[] = [];
  if (tour) addons.push({ label: '3D virtual tour', amount: ADDON.tour });
  if (twilight) addons.push({ label: 'Twilight photography', amount: ADDON.twilight });
  if (ext3d) addons.push({ label: 'Extended 3D coverage', amount: ADDON.extended3d });
  const addonsTotal = addons.reduce((s, a) => s + a.amount, 0);

  // 6) subtotal + HST
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
      package: effectivePkg,
      recommended: recommended,
      recommended_package: recommended ? effectivePkg : null,
      base_rate: base,
      travel_free_km: FREE_KM, travel_per_km: PER_KM, travel_km_billable: Math.round(billableKm * 10) / 10, travel_fee: travel,
      addons, addons_total: addonsTotal,
      subtotal: Math.round(subtotal * 100) / 100,
      hst_rate: HST, hst: tax,
      total,
    },
  }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
});
