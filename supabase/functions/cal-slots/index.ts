// Supabase Edge Function: cal-slots
// Proxies Cal.com's real v2 availability for the Bricks Listing Media Shoot
// event type, so book.html can show real bookable times during the flow
// instead of a plain date/window input.
//
// Also enforces a travel-time gap: Cal.com's own availability only knows
// whether a time is booked, not where the shoot is. If the caller passes the
// candidate property's lat/lon (already geocoded client-side by the /quote
// call in Step 2), we pull the day's neighboring Cal.com bookings, read the
// property_lat/property_lon stripe-webhook stamped into each booking's
// metadata, and drop any slot that doesn't leave enough drive time to/from
// whichever real shoot is adjacent to it.
//
// Deploy:  supabase functions deploy cal-slots
// Needs:   CAL_KEY (Cal.com API key)
// Invoke:  GET /functions/v1/cal-slots?date=YYYY-MM-DD&lat=43.6&lon=-79.4

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

const EVENT_TYPE_ID = 6387567; // bricks-media-shoot -- recreated 2026-07-20 after Hermes deleted the original (6358903)

// ----- Travel-time config (change here; one-line constants) -----
const AVG_SPEED_KMH = 35; // blended GTA city/highway driving speed w/ traffic
const SETUP_BUFFER_MIN = 20; // flat pack-up-at-A + set-up-at-B overhead
const MIN_GAP_MIN = 30; // floor even for two addresses right next to each other
const BOOKINGS_WINDOW_PAD_HOURS = 4; // catch bookings just outside the target day

function bad(msg: string, status = 400) {
  return new Response(JSON.stringify({ ok: false, error: msg }), {
    status, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function haversineKm(a: { lat: number; lon: number }, b: { lat: number; lon: number }): number {
  const R = 6371;
  const dLat = (b.lat - a.lat) * Math.PI / 180;
  const dLon = (b.lon - a.lon) * Math.PI / 180;
  const la1 = a.lat * Math.PI / 180, la2 = b.lat * Math.PI / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function requiredGapMin(distKm: number): number {
  return Math.max(MIN_GAP_MIN, (distKm / AVG_SPEED_KMH) * 60 + SETUP_BUFFER_MIN);
}

// Fetches this event type's upcoming bookings in a padded window around the
// target day and returns only the ones we can geo-check (metadata carries
// property_lat/property_lon). Bookings without that metadata (pre-existing
// or manually made) are left out of the check entirely rather than blocking
// every slot -- missing data should never fail the whole day closed.
async function fetchNeighborBookings(calKey: string, date: string): Promise<{ start: string; end: string; lat: number; lon: number }[]> {
  const dayStart = new Date(`${date}T00:00:00Z`);
  const after = new Date(dayStart); after.setUTCHours(after.getUTCHours() - BOOKINGS_WINDOW_PAD_HOURS);
  const before = new Date(dayStart); before.setUTCDate(before.getUTCDate() + 1); before.setUTCHours(before.getUTCHours() + BOOKINGS_WINDOW_PAD_HOURS);

  const qs = new URLSearchParams({
    eventTypeId: String(EVENT_TYPE_ID),
    status: 'upcoming',
    afterStart: after.toISOString(),
    beforeEnd: before.toISOString(),
    take: '250',
  });
  try {
    const res = await fetch(`https://api.cal.com/v2/bookings?${qs.toString()}`, {
      headers: { Authorization: `Bearer ${calKey}`, 'cal-api-version': '2026-05-01' },
    });
    const j = await res.json();
    if (!res.ok || j.status !== 'success') return [];
    const bookings = j.data ?? [];
    const out: { start: string; end: string; lat: number; lon: number }[] = [];
    for (const b of bookings) {
      const lat = parseFloat(b?.metadata?.property_lat);
      const lon = parseFloat(b?.metadata?.property_lon);
      if (Number.isFinite(lat) && Number.isFinite(lon) && b.start && b.end) {
        out.push({ start: b.start, end: b.end, lat, lon });
      }
    }
    return out;
  } catch {
    return []; // upstream hiccup -- degrade to no travel-time filtering, not a hard fail
  }
}

// Drops any candidate slot that doesn't leave enough drive time between it
// and whichever real, geo-tagged booking is immediately before/after it.
function filterByTravelTime<T extends { start: string; end: string }>(
  slots: T[],
  candidate: { lat: number; lon: number },
  neighbors: { start: string; end: string; lat: number; lon: number }[],
): T[] {
  if (!neighbors.length) return slots;
  return slots.filter((s) => {
    const slotStart = new Date(s.start).getTime();
    const slotEnd = new Date(s.end).getTime();
    for (const n of neighbors) {
      const nStart = new Date(n.start).getTime();
      const nEnd = new Date(n.end).getTime();
      const distKm = haversineKm(candidate, n);
      const needMin = requiredGapMin(distKm);
      // neighbor ends before this slot starts -- check the gap after it
      if (nEnd <= slotStart) {
        const gapMin = (slotStart - nEnd) / 60000;
        if (gapMin < needMin) return false;
      }
      // neighbor starts after this slot ends -- check the gap before it
      if (nStart >= slotEnd) {
        const gapMin = (nStart - slotEnd) / 60000;
        if (gapMin < needMin) return false;
      }
      // overlapping bookings shouldn't be possible (Cal.com already blocks the
      // time itself), but if one somehow does, reject the slot outright.
      if (nStart < slotEnd && nEnd > slotStart) return false;
    }
    return true;
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'GET') return bad('Method not allowed');

  const calKey = Deno.env.get('CAL_KEY');
  if (!calKey) return bad('Cal.com not configured (set CAL_KEY)', 503);

  const url = new URL(req.url);
  const date = url.searchParams.get('date');
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return bad('date=YYYY-MM-DD required');
  const latParam = url.searchParams.get('lat');
  const lonParam = url.searchParams.get('lon');
  const candidate = (latParam && lonParam && Number.isFinite(+latParam) && Number.isFinite(+lonParam))
    ? { lat: +latParam, lon: +lonParam }
    : null;

  const start = `${date}T00:00:00`;
  const endDate = new Date(`${date}T00:00:00Z`);
  endDate.setUTCDate(endDate.getUTCDate() + 1);
  const end = endDate.toISOString().slice(0, 19);

  const qs = new URLSearchParams({
    eventTypeId: String(EVENT_TYPE_ID),
    start,
    end,
    timeZone: 'America/Toronto',
    format: 'range',
  });

  try {
    const res = await fetch(`https://api.cal.com/v2/slots?${qs.toString()}`, {
      headers: { Authorization: `Bearer ${calKey}`, 'cal-api-version': '2024-09-04' },
    });
    const j = await res.json();
    if (!res.ok || j.status !== 'success') return bad('Cal.com error: ' + (j.error?.message || res.status), 502);
    let daySlots = j.data?.[date] || [];

    if (candidate && daySlots.length) {
      const neighbors = await fetchNeighborBookings(calKey, date);
      daySlots = filterByTravelTime(daySlots, candidate, neighbors);
    }

    return new Response(JSON.stringify({ ok: true, date, slots: daySlots }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return bad('Cal.com upstream error: ' + String(e), 502);
  }
});
