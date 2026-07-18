// Supabase Edge Function: quote
// Dynamic pricing engine for Bricks listing-media booking.
// Flow: address -> Nominatim geocode (lat/lng) -> sqft (CleverTech if key set,
// else OSM Overpass footprint x storeys) -> footprint tier -> base rate ->
// travel fee (haversine from BASE address, FREE_KM free, $/km after) ->
// add-ons (3D tour +$199, twilight, extended 3D) -> +13% HST = total.
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
  'Advise':   [149, 149, 149, 149], // consult floor; final quoted after
};
const ADDON = { tour: 199, twilight: 149, extended3d: 249 };

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
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`;
  try {
    const r = await fetch(url, { headers: { 'User-Agent': 'BricksPreLaunch/1.0 (booking@brxs.ca)' } });
    const j = await r.json();
    if (Array.isArray(j) && j.length) return { lat: +j[0].lat, lon: +j[0].lon, display: j[0].display_name };
  } catch { /* ignore */ }
  return null;
}

// OSM footprint area (m^2) via Overpass, x storeys if tagged -> sqft estimate
async function osmSqft(lat: number, lon: number): Promise<{ sqft: number; storeys: number | null; area_m2: number } | null> {
  const q = `[out:json];way[building](${lat - 0.0008},${lon - 0.0008},${lat + 0.0008},${lon + 0.0008});out center 1;`;
  try {
    const r = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST', body: new URLSearchParams({ data: q }).toString(),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'User-Agent': 'BricksPreLaunch/1.0' },
    });
    const j = await r.json();
    const el = j.elements?.find((e: any) => e.lat !== undefined || e.center);
    if (!el) return null;
    const latc = el.lat ?? el.center.lat, lonc = el.lon ?? el.center.lon;
    // fetch full geometry for area
    const q2 = `[out:json];way(id:${el.id});out geom;`;
    const r2 = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST', body: new URLSearchParams({ data: q2 }).toString(),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'User-Agent': 'BricksPreLaunch/1.0' },
    });
    const j2 = await r2.json();
    const w = j2.elements?.find((e: any) => e.type === 'way' && e.geometry?.length > 2);
    if (!w) return null;
    // shoelace on geometry (degrees -> meters via equirectangular)
    let area = 0;
    const n = w.geometry.length;
    const latRef = latc * Math.PI / 180;
    const mPerDegLat = 111320;
    const mPerDegLon = 111320 * Math.cos(latRef);
    const pts = w.geometry.map((p: any) => [p.lon * mPerDegLon, p.lat * mPerDegLat]);
    for (let i = 0; i < n; i++) {
      const [x1, y1] = pts[i], [x2, y2] = pts[(i + 1) % n];
      area += x1 * y2 - x2 * y1;
    }
    const area_m2 = Math.abs(area / 2);
    const storeys = w.tags?.['building:levels'] ? parseInt(w.tags['building:levels']) : null;
    // footprint sqft; if storeys known, living area ~ footprint x storeys (rough)
    const footprint_sqft = area_m2 * 10.7639;
    const sqft = storeys && storeys > 0 ? Math.round(footprint_sqft * storeys) : Math.round(footprint_sqft);
    return { sqft, storeys, area_m2: Math.round(area_m2) };
  } catch { return null; }
}

// CleverTech property assessment (free key). Returns sqft if available.
async function clevertechSqft(address: string, city: string, key: string): Promise<number | null> {
  try {
    const r = await fetch(`https://clevertech.ca/api/${city}/property/search?q=${encodeURIComponent(address)}&limit=1`, {
      headers: { 'X-API-Key': key },
    });
    if (!r.ok) return null;
    const j = await r.json();
    const rec = j?.data?.[0] ?? j?.results?.[0] ?? j?.[0];
    if (!rec) return null;
    // assessment records vary; pull any living-area-like field
    const cand = rec.living_area ?? rec.floor_area ?? rec.sqft ?? rec.area_sqft ?? rec.total_floor_area;
    if (cand) return Math.round(parseFloat(cand));
  } catch { /* ignore */ }
  return null;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return bad('Method not allowed');

  let body: any;
  try { body = await req.json(); } catch { return bad('Invalid JSON'); }

  const address = (body.address || '').toString().trim();
  const pkg = (body.package_interest || body.package || '').toString().trim();
  const city = (body.city || 'mississauga').toString().trim().toLowerCase();
  const tour = body.tour_addon === true || body.tour_addon === 'true';
  const twilight = body.twilight_addon === true || body.twilight_addon === 'true';
  const ext3d = body.extended3d_addon === true || body.extended3d_addon === 'true';
  const manualSqft = body.sqft ? parseInt(body.sqft) : null;

  if (!address) return bad('Address is required');
  const pkgKey = ['Standard', 'Premium', 'Luxury', 'Estate', 'Advise'].find((k) => pkg.startsWith(k)) || 'Standard';

  // 1) geocode
  const geo = await geocode(address);
  if (!geo) return bad('Could not geocode address', 422);

  // 2) sqft: manual override > CleverTech > OSM (clamped) > property-type band
  let sqft: number | null = manualSqft;
  let sqft_source = manualSqft ? 'agent' : 'none';
  let sqft_estimated = false;
  if (!sqft) {
    const ct = Deno.env.get('CLEVERTECH_KEY');
    if (ct) {
      sqft = await clevertechSqft(address, city, ct);
      if (sqft) sqft_source = 'clevertech';
    }
  }
  if (!sqft) {
    const o = await osmSqft(geo.lat, geo.lon);
    // OSM footprint x storeys over-estimates wildly; clamp to plausible
    // residential range and defer the exact number to agent confirmation.
    if (o && o.area_m2 > 30) {
      const clamped = Math.min(12000, Math.max(600, o.sqft));
      sqft = clamped; sqft_source = 'osm'; sqft_estimated = true;
    }
  }
  // property-type band nudges the tier when we lack a real sqft
  const typeBand: Record<string, number> = {
    'Condo': 0, 'Semi / Town': 1, 'Detached': 1, 'Multiplex': 2, 'Commercial': 2, 'Estate': 3,
  };
  if (!sqft) {
    sqft = 2000; sqft_source = 'type-default'; sqft_estimated = true;
  }

  // 3) base rate by tier (sqft band, nudged up by property type so OSM under-estimates don't under-price)
  const rates = BASE_RATE[pkgKey] ?? BASE_RATE['Standard'];
  const pt = (body.property_type || '').toString().trim();
  const tb = typeBand[pt] ?? 1;
  const finalBand = Math.max(band(sqft), tb);
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
      package: pkgKey,
      base_rate: base,
      travel_free_km: FREE_KM, travel_per_km: PER_KM, travel_km_billable: Math.round(billableKm * 10) / 10, travel_fee: travel,
      addons, addons_total: addonsTotal,
      subtotal: Math.round(subtotal * 100) / 100,
      hst_rate: HST, hst: tax,
      total,
    },
  }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
});
