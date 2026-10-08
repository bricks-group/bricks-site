// Supabase Edge Function: cal-slots
// Returns bookable times for a civil date.
//
// Prefer Cal.com when CAL_KEY is set (legacy path + travel-time filtering).
// When CAL_KEY is missing, fall back to the same native hours + paid-lead
// occupancy model as www `/api/book/slots` so booking never hard-fails with 503.
//
// Deploy:  supabase functions deploy cal-slots
// Optional: CAL_KEY (Cal.com API key)
// Invoke:  GET /functions/v1/cal-slots?date=YYYY-MM-DD&lat=43.6&lon=-79.4

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

const EVENT_TYPE_ID = 6387567; // bricks-media-shoot

const WORK_START = '09:00';
const WORK_END = '17:00';
const SLOT_DURATION_MIN = 60;
const SLOT_STEP_MIN = 30;
const FALLBACK_TZ = 'America/Toronto';

// ----- Travel-time config (Cal.com path only) -----
const AVG_SPEED_KMH = 35;
const SETUP_BUFFER_MIN = 20;
const MIN_GAP_MIN = 30;
const BOOKINGS_WINDOW_PAD_HOURS = 4;

function bad(msg: string, status = 400) {
  return new Response(JSON.stringify({ ok: false, error: msg }), {
    status, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function ok(body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
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
    return [];
  }
}

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
      if (nEnd <= slotStart) {
        const gapMin = (slotStart - nEnd) / 60000;
        if (gapMin < needMin) return false;
      }
      if (nStart >= slotEnd) {
        const gapMin = (nStart - slotEnd) / 60000;
        if (gapMin < needMin) return false;
      }
      if (nStart < slotEnd && nEnd > slotStart) return false;
    }
    return true;
  });
}

function pad2(n: number) {
  return String(n).padStart(2, '0');
}

/** Build 30-min-step slots for a civil date in America/Toronto (native fallback). */
function buildNativeSlots(date: string): { start: string; end: string }[] {
  const [ys, ms, ds] = date.split('-').map(Number);
  const [sh, sm] = WORK_START.split(':').map(Number);
  const [eh, em] = WORK_END.split(':').map(Number);
  const startMin = sh * 60 + sm;
  const endMin = eh * 60 + em;
  const slots: { start: string; end: string }[] = [];
  const now = Date.now();

  for (let m = startMin; m + SLOT_DURATION_MIN <= endMin; m += SLOT_STEP_MIN) {
    const h0 = Math.floor(m / 60);
    const mi0 = m % 60;
    const h1 = Math.floor((m + SLOT_DURATION_MIN) / 60);
    const mi1 = (m + SLOT_DURATION_MIN) % 60;
    // Build ISO via Intl parts so DST is respected without a TZ library.
    const start = zonedCivilToUtcIso(ys, ms, ds, h0, mi0, FALLBACK_TZ);
    const end = zonedCivilToUtcIso(ys, ms, ds, h1, mi1, FALLBACK_TZ);
    if (!start || !end) continue;
    if (new Date(start).getTime() <= now) continue;
    slots.push({ start, end });
  }
  return slots;
}

/** Convert a civil local time in `tz` to an ISO UTC string. */
function zonedCivilToUtcIso(
  year: number, month: number, day: number,
  hour: number, minute: number, tz: string,
): string | null {
  // Binary-search a UTC instant whose tz wall-clock matches the civil time.
  let lo = Date.UTC(year, month - 1, day - 1, 0, 0);
  let hi = Date.UTC(year, month - 1, day + 1, 23, 59);
  const target = `${year}-${pad2(month)}-${pad2(day)}T${pad2(hour)}:${pad2(minute)}`;
  for (let i = 0; i < 40; i++) {
    const mid = Math.floor((lo + hi) / 2);
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: tz,
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
    }).formatToParts(new Date(mid));
    const get = (t: string) => parts.find((p) => p.type === t)?.value || '';
    const wall = `${get('year')}-${get('month')}-${get('day')}T${get('hour')}:${get('minute')}`;
    if (wall === target) return new Date(mid).toISOString();
    if (wall < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return null;
}

type Taken = { start: string; end: string };

async function takenFromPaidLeads(ymd: string): Promise<Taken[]> {
  const supabaseUrl = (Deno.env.get('SUPABASE_URL') || '').replace(/\/$/, '');
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
  if (!supabaseUrl || !serviceKey) return [];
  const qs =
    `preferred_date=eq.${encodeURIComponent(ymd)}` +
    `&status=eq.paid` +
    `&select=selected_slot_start,selected_slot_end`;
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/media_booking_leads?${qs}`, {
      headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` },
    });
    if (!res.ok) return [];
    const rows = await res.json();
    if (!Array.isArray(rows)) return [];
    const out: Taken[] = [];
    for (const row of rows) {
      const start = typeof row.selected_slot_start === 'string' ? row.selected_slot_start : '';
      if (!start) continue;
      const end = typeof row.selected_slot_end === 'string' && row.selected_slot_end
        ? row.selected_slot_end
        : start;
      out.push({ start, end });
    }
    return out;
  } catch {
    return [];
  }
}

function overlaps(a: Taken, b: Taken): boolean {
  const as = new Date(a.start).getTime();
  const ae = new Date(a.end).getTime();
  const bs = new Date(b.start).getTime();
  const be = new Date(b.end).getTime();
  return as < be && ae > bs;
}

function filterOpenSlots(slots: Taken[], taken: Taken[]): Taken[] {
  if (!taken.length) return slots;
  return slots.filter((s) => !taken.some((t) => overlaps(s, t)));
}

async function nativeSlotsResponse(date: string) {
  const generated = buildNativeSlots(date);
  const taken = await takenFromPaidLeads(date);
  const slots = filterOpenSlots(generated, taken);
  return ok({
    ok: true,
    date,
    source: 'native',
    slots,
  });
}

async function calSlotsResponse(
  calKey: string,
  date: string,
  candidate: { lat: number; lon: number } | null,
) {
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
    if (!res.ok || j.status !== 'success') {
      // Cal misconfigured / upstream error → native fallback, not a hard 502 for bookers.
      return nativeSlotsResponse(date);
    }
    let daySlots = j.data?.[date] || [];

    if (candidate && daySlots.length) {
      const neighbors = await fetchNeighborBookings(calKey, date);
      daySlots = filterByTravelTime(daySlots, candidate, neighbors);
    }

    return ok({ ok: true, date, source: 'cal', slots: daySlots });
  } catch {
    return nativeSlotsResponse(date);
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'GET') return bad('Method not allowed');

  const url = new URL(req.url);
  const date = url.searchParams.get('date');
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return bad('date=YYYY-MM-DD required');
  const latParam = url.searchParams.get('lat');
  const lonParam = url.searchParams.get('lon');
  const candidate = (latParam && lonParam && Number.isFinite(+latParam) && Number.isFinite(+lonParam))
    ? { lat: +latParam, lon: +lonParam }
    : null;

  const calKey = Deno.env.get('CAL_KEY');
  if (!calKey) return nativeSlotsResponse(date);
  return calSlotsResponse(calKey, date, candidate);
});
