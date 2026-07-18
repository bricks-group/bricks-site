// Supabase Edge Function: booking-lead
// Receives a JSON booking payload from bricks-site/book.html and writes it to
// public.media_booking_leads using the service-role key (injected at runtime,
// never shipped to the browser). An AFTER INSERT trigger mirrors the lead into
// public.contact_requests for the team's existing lead view.
//
// Deploy:  supabase functions deploy booking-lead
// Local:    supabase functions serve
// Invoke:   POST https://<project-ref>.supabase.co/functions/v1/booking-lead
//
// CORS is open for the static bricks-site origin; tighten allowlist in prod.

const ALLOWED_TYPES = ['Condo','Semi / Town','Detached','Multiplex','Commercial','Estate'];
const ALLOWED_PKGS = ['Standard (+ floor plan)','Premium','Luxury (+ twilight)','Estate (flat)','Not sure — advise me'];
const ALLOWED_WINS = ['Morning','Afternoon','Either'];

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function bad(msg: string) {
  return new Response(JSON.stringify({ ok: false, error: msg }), {
    status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  if (req.method !== 'POST') {
    return bad('Method not allowed');
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return bad('Invalid JSON');
  }

  const agent_name = (body.agent_name || '').toString().trim();
  const email = (body.email || '').toString().trim();
  const property_address = (body.property_address || '').toString().trim();
  const property_type = (body.property_type || '').toString().trim();
  const package_interest = (body.package_interest || '').toString().trim();
  const preferred_date = (body.preferred_date || '').toString().trim();
  const tour_addon = body.tour_addon === true || body.tour_addon === 'true';
  const brokerage = body.brokerage ? body.brokerage.toString().trim() : null;
  const phone = body.phone ? body.phone.toString().trim() : null;
  const preferred_window = body.preferred_window && ALLOWED_WINS.includes(body.preferred_window)
    ? body.preferred_window : null;
  const notes = body.notes ? body.notes.toString().trim() : null;

  // validation
  if (!agent_name) return bad('Agent name is required');
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return bad('Valid email is required');
  if (!property_address) return bad('Property address is required');
  if (!ALLOWED_TYPES.includes(property_type)) return bad('Invalid property type');
  if (!ALLOWED_PKGS.includes(package_interest)) return bad('Invalid package');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(preferred_date)) return bad('Preferred date must be YYYY-MM-DD');

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!supabaseUrl || !serviceKey) {
    return new Response(JSON.stringify({ ok: false, error: 'Server misconfigured' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const payload = {
    agent_name, email, brokerage, phone,
    property_address, property_type, package_interest,
    tour_addon, preferred_date, preferred_window, notes,
    upsell_stage: 'media_only', source: 'bricks-booking', status: 'new',
  };

  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/media_booking_leads`, {
      method: 'POST',
      headers: {
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const txt = await res.text();
      return new Response(JSON.stringify({ ok: false, error: 'Insert failed', detail: txt }), {
        status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: 'Upstream error', detail: String(e) }), {
      status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});
