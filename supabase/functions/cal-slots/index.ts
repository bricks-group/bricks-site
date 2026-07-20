// Supabase Edge Function: cal-slots
// Proxies Cal.com's real v2 availability for the Bricks Listing Media Shoot
// event type, so book.html can show real bookable times during the flow
// instead of a plain date/window input.
//
// Deploy:  supabase functions deploy cal-slots
// Needs:   CAL_KEY (Cal.com API key)
// Invoke:  GET /functions/v1/cal-slots?date=YYYY-MM-DD

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

const EVENT_TYPE_ID = 6387567; // bricks-media-shoot -- recreated 2026-07-20 after Hermes deleted the original (6358903)

function bad(msg: string, status = 400) {
  return new Response(JSON.stringify({ ok: false, error: msg }), {
    status, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
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
    const daySlots = j.data?.[date] || [];
    return new Response(JSON.stringify({ ok: true, date, slots: daySlots }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return bad('Cal.com upstream error: ' + String(e), 502);
  }
});
