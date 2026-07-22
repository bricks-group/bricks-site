// Supabase Edge Function: create-checkout
// Creates a Stripe Checkout Session for the dynamic Bricks quote total.
// The wizard posts the finalized quote + agent/booking details; we create a
// one-time payment Session for the exact CAD amount (incl HST) and return the
// Checkout URL. A webhook (stripe-webhook fn) confirms payment, writes the
// paid lead, and books the Cal.com slot.
//
// The client-submitted `quote` is NEVER trusted for the charged amount --
// it's just what the wizard displayed. We re-run the same pricing engine
// server-side (an internal call to the `quote` function, using the same
// address/package/add-ons/sqft the client says it used) and charge that
// number instead. Without this, editing `quote.total` in devtools before
// hitting Pay would let anyone check out for any amount.
//
// Deploy:  supabase functions deploy create-checkout
// Needs:   STRIPE_SECRET_KEY (set via `supabase secrets set STRIPE_SECRET_KEY=...`)
//          APP_URL (your public prelaunch site; set already)
//          SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY (auto-injected)
//
// Invoke:  POST /functions/v1/create-checkout
//          body: { agent_name, email, property_address, property_type,
//                  package_interest, sqft, preferred_date, preferred_window,
//                  reel_addon, tour_addon, twilight_addon, rush_addon, phone, brokerage, notes }

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function bad(msg: string, status = 400) {
  return new Response(JSON.stringify({ ok: false, error: msg }), {
    status, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return bad('Method not allowed');

  const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
  if (!stripeKey) return bad('Stripe not configured (set STRIPE_SECRET_KEY)', 503);
  const appUrl = Deno.env.get('APP_URL') || 'https://bricks-booking.prelaunch';
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!supabaseUrl || !serviceKey) return bad('Server misconfigured', 500);

  let body: any;
  try { body = await req.json(); } catch { return bad('Invalid JSON'); }

  if (!body.selected_slot_start || !body.selected_slot_end) return bad('A real shoot slot must be selected before checkout');

  // Re-derive the trusted price server-side -- ignore body.quote entirely for
  // pricing. Pass the same sqft the wizard used (agent-confirmed or the
  // auto-estimate) so the recompute matches exactly, not a fresh re-estimate.
  let q: any;
  try {
    const quoteRes = await fetch(`${supabaseUrl}/functions/v1/quote`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${serviceKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        address: body.property_address,
        property_type: body.property_type,
        reel_addon: body.reel_addon,
        tour_addon: body.tour_addon,
        twilight_addon: body.twilight_addon,
        rush_addon: body.rush_addon,
        sqft: body.sqft || undefined,
      }),
    });
    const quoteJson = await quoteRes.json();
    if (!quoteRes.ok || !quoteJson.ok) return bad('Could not verify pricing for this booking: ' + (quoteJson.error || quoteRes.status), 502);
    q = quoteJson.quote;
  } catch (e) {
    return bad('Pricing verification error: ' + String(e), 502);
  }
  if (!q || typeof q.total !== 'number') return bad('Quote total required');
  const amountCents = Math.round(q.total * 100);
  if (amountCents < 50) return bad('Amount too small');

  const meta: Record<string, string> = {
    agent_name: (body.agent_name || '').toString().slice(0, 200),
    email: (body.email || '').toString().slice(0, 200),
    property_address: (body.property_address || '').toString().slice(0, 300),
    property_type: (body.property_type || '').toString(),
    package_interest: (body.package_interest || '').toString(),
    preferred_date: (body.preferred_date || '').toString(),
    selected_slot_start: (body.selected_slot_start || '').toString(),
    selected_slot_end: (body.selected_slot_end || '').toString(),
    reel_addon: String(body.reel_addon === true),
    tour_addon: String(body.tour_addon === true),
    twilight_addon: String(body.twilight_addon === true),
    rush_addon: String(body.rush_addon === true),
    phone: (body.phone || '').toString(),
    brokerage: (body.brokerage || '').toString(),
    notes: (body.notes || '').toString().slice(0, 500),
    // Stripe metadata values are capped at 500 chars -- store only what
    // stripe-webhook actually reads back (total, and lat/lon for the
    // travel-time check against neighboring bookings), not the full quote.
    quote_json: JSON.stringify({ total: q.total, lat: q.lat ?? null, lon: q.lon ?? null }).slice(0, 480),
  };

  const form = new URLSearchParams();
  form.set('mode', 'payment');
  form.set('currency', 'cad');
  form.set('success_url', `${appUrl}/book.html?paid=1&session_id={CHECKOUT_SESSION_ID}`);
  form.set('cancel_url', `${appUrl}/book.html?paid=0`);
  form.append('line_items[0][price_data][currency]', 'cad');
  form.append('line_items[0][price_data][product_data][name]', `Bricks listing media — ${meta.property_address}`);
  form.append('line_items[0][price_data][product_data][description]', `${meta.package_interest || 'HDR photo + drone'} (incl. HST). Travel ${q.travel_fee} CAD, base ${q.base_rate} CAD.`);
  form.append('line_items[0][price_data][unit_amount]', String(amountCents));
  form.append('line_items[0][quantity]', '1');
  form.append('metadata[agent_name]', meta.agent_name);
  form.append('metadata[email]', meta.email);
  form.append('metadata[phone]', meta.phone);
  form.append('metadata[brokerage]', meta.brokerage);
  form.append('metadata[property_address]', meta.property_address);
  form.append('metadata[property_type]', meta.property_type);
  form.append('metadata[package_interest]', meta.package_interest);
  form.append('metadata[reel_addon]', meta.reel_addon);
  form.append('metadata[tour_addon]', meta.tour_addon);
  form.append('metadata[twilight_addon]', meta.twilight_addon);
  form.append('metadata[rush_addon]', meta.rush_addon);
  form.append('metadata[preferred_date]', meta.preferred_date);
  form.append('metadata[selected_slot_start]', meta.selected_slot_start);
  form.append('metadata[selected_slot_end]', meta.selected_slot_end);
  form.append('metadata[notes]', meta.notes);
  form.append('metadata[quote_json]', meta.quote_json);

  try {
    const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${stripeKey}`, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: form.toString(),
    });
    const j = await res.json();
    if (!res.ok) return bad('Stripe error: ' + (j.error?.message || res.status), 502);
    return new Response(JSON.stringify({ ok: true, url: j.url, session_id: j.id }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return bad('Stripe upstream error: ' + String(e), 502);
  }
});
