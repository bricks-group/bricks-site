// Supabase Edge Function: create-checkout
// Creates a Stripe Checkout Session for the dynamic Bricks quote total.
// The wizard posts the finalized quote + agent/booking details; we create a
// one-time payment Session for the exact CAD amount (incl HST) and return the
// Checkout URL. A webhook (stripe-webhook fn) confirms payment, writes the
// paid lead, and books the Cal.com slot.
//
// Deploy:  supabase functions deploy create-checkout
// Needs:   STRIPE_SECRET_KEY (set via `supabase secrets set STRIPE_SECRET_KEY=...`)
//          APP_URL (your public prelaunch site; set already)
//
// Invoke:  POST /functions/v1/create-checkout
//          body: { quote, agent_name, email, property_address, property_type,
//                  package_interest, preferred_date, preferred_window,
//                  tour_addon, twilight_addon, extended3d_addon, phone, brokerage, notes }

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

  let body: any;
  try { body = await req.json(); } catch { return bad('Invalid JSON'); }

  const q = body.quote;
  if (!q || typeof q.total !== 'number') return bad('Quote total required');
  if (!body.selected_slot_start || !body.selected_slot_end) return bad('A real shoot slot must be selected before checkout');
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
    tour_addon: String(body.tour_addon === true),
    twilight_addon: String(body.twilight_addon === true),
    extended3d_addon: String(body.extended3d_addon === true),
    phone: (body.phone || '').toString(),
    brokerage: (body.brokerage || '').toString(),
    notes: (body.notes || '').toString().slice(0, 500),
    quote_json: JSON.stringify(q).slice(0, 1900),
  };

  const form = new URLSearchParams();
  form.set('mode', 'payment');
  form.set('currency', 'cad');
  form.set('success_url', `${appUrl}/book.html?paid=1&session_id={CHECKOUT_SESSION_ID}`);
  form.set('cancel_url', `${appUrl}/book.html?paid=0`);
  form.append('line_items[0][price_data][currency]', 'cad');
  form.append('line_items[0][price_data][product_data][name]', `Bricks ${meta.package_interest} — ${meta.property_address}`);
  form.append('line_items[0][price_data][product_data][description]', `Listing media shoot (incl. HST). Travel ${q.travel_fee} CAD, base ${q.base_rate} CAD.`);
  form.append('line_items[0][price_data][unit_amount]', String(amountCents));
  form.append('line_items[0][quantity]', '1');
  form.append('metadata[agent_name]', meta.agent_name);
  form.append('metadata[email]', meta.email);
  form.append('metadata[property_address]', meta.property_address);
  form.append('metadata[package_interest]', meta.package_interest);
  form.append('metadata[preferred_date]', meta.preferred_date);
  form.append('metadata[selected_slot_start]', meta.selected_slot_start);
  form.append('metadata[selected_slot_end]', meta.selected_slot_end);
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
