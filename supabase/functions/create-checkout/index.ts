// Supabase Edge Function: create-checkout
// Creates a Stripe Checkout Session for the dynamic Bricks quote total.
// The wizard posts the finalized quote + agent/booking details; we create a
// one-time payment Session for the exact CAD amount (incl HST) and return the
// Checkout URL. A webhook (stripe-webhook fn) confirms payment, writes the
// paid lead. Preferred date + exact selected_slot_* ISO go to Stripe metadata
// (property-local Canada timezone; no Cal.com). preferred_window is optional back-compat only.
//
// The client-submitted `quote` is NEVER trusted for the charged amount --
// it's just what the wizard displayed. We re-run the same pricing engine
// server-side (an internal call to the `quote` function, using the same
// address/package/add-ons/sqft the client says it used) and charge that
// number instead. Without this, editing `quote.total` in devtools before
// hitting Pay would let anyone check out for any amount.
//
// Wallets: this is hosted Stripe Checkout (not Payment Element / PaymentIntent).
// Apple Pay and Google Pay are NOT separate payment_method_types — they show
// on Checkout when `card` is enabled and the shopper's device/browser supports
// them (Safari/iOS → Apple Pay, Chrome/Android → Google Pay). Stripe Link is
// `link`. We do not add PayPal, Klarna, Afterpay, or Interac (acss_debit).
// Dashboard must still have Apple Pay / Google Pay / Link enabled.
//
// Deploy:  supabase functions deploy create-checkout
// Needs:   STRIPE_SECRET_KEY (set via `supabase secrets set STRIPE_SECRET_KEY=...`)
//          APP_URL (your public prelaunch site; set already)
//          SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY (auto-injected)
//
// Invoke:  POST /functions/v1/create-checkout
//          body: { agent_name, email, property_address, property_type,
//                  package_interest, sqft, preferred_date, selected_slot_start,
//                  selected_slot_end, timezone, province, preferred_window (optional),
//                  drone_addon, reel_addon, tour_addon, twilight_addon, rush_addon, staging_addon, staging_images, floor_plan_only,
//                  phone, brokerage, notes }
// drone_addon defaults true if omitted (matches the `quote` function) --
// forward whatever the client actually selected, never assume, or a
// "Photos only" booking gets silently re-priced at the full drone rate here.

import { civilYmd, resolvePropertyTimezone } from '../_shared/canada-tz.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const WALLET_DOMAINS = ['brxs.ca', 'www.brxs.ca'];

function bad(msg: string, status = 400) {
  return new Response(JSON.stringify({ ok: false, error: msg }), {
    status, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function publicAppUrl() {
  return (Deno.env.get('APP_URL') || 'https://www.brxs.ca').replace(/\/$/, '');
}

// Register Apple Pay / Google Pay / Link domains with Stripe. Hosted Checkout
// itself is on checkout.stripe.com (Stripe registers that), but Stripe still
// wants brxs.ca + www.brxs.ca registered for wallet buttons and for Apple's
// domain association check. Duplicate domains return an error we ignore so
// checkout never depends on this succeeding.
async function ensureWalletDomains(stripeKey: string) {
  await Promise.all(WALLET_DOMAINS.map((domain_name) =>
    fetch('https://api.stripe.com/v1/payment_method_domains', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${stripeKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ domain_name }).toString(),
    }).catch((e) => {
      console.warn('payment_method_domains register failed for ' + domain_name + ': ' + String(e));
      return null;
    }),
  ));
}

async function createCheckoutSession(stripeKey: string, form: URLSearchParams) {
  const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${stripeKey}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: form.toString(),
  });
  const j = await res.json();
  return { ok: res.ok, status: res.status, j };
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return bad('Method not allowed');

  const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
  if (!stripeKey) return bad('Stripe not configured (set STRIPE_SECRET_KEY)', 503);
  const appUrl = publicAppUrl();
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!supabaseUrl || !serviceKey) return bad('Server misconfigured', 500);

  let body: any;
  try { body = await req.json(); } catch { return bad('Invalid JSON'); }

  const preferredDate = (body.preferred_date || '').toString().trim();
  const preferredWindow = (body.preferred_window || '').toString().trim().toLowerCase();
  const slotStart = (body.selected_slot_start || '').toString().trim();
  const slotEnd = (body.selected_slot_end || '').toString().trim();
  if (!preferredDate || !/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(preferredDate)) {
    return bad('preferred_date (YYYY-MM-DD) is required');
  }
  const startMs = Date.parse(slotStart);
  const endMs = Date.parse(slotEnd);
  if (!slotStart || !slotEnd || Number.isNaN(startMs) || Number.isNaN(endMs) || endMs <= startMs) {
    return bad('selected_slot_start and selected_slot_end (ISO) are required');
  }
  const zone = resolvePropertyTimezone({
    timezone: (body.timezone || '').toString(),
    province: (body.province || '').toString(),
    address: (body.property_address || '').toString(),
  });
  const slotDay = civilYmd(slotStart, zone.tz);
  if (slotDay !== preferredDate) {
    return bad('selected_slot_start must fall on preferred_date in the property local timezone');
  }

  // Re-derive the trusted price server-side -- ignore body.quote entirely for
  // pricing. Pass the same sqft the wizard used (agent-confirmed or the
  // auto-estimate) so the recompute matches exactly, not a fresh re-estimate.
  // Always forward package_id so quote expands the ladder (Showcase ≠ Essentials).
  const pkgNormEarly = String(body.package_id || '').toLowerCase().replace(/[^a-z0-9_]+/g, '_')
  let q: any;
  try {
    const quoteRes = await fetch(`${supabaseUrl}/functions/v1/quote`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${serviceKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        address: body.property_address,
        property_type: body.property_type,
        drone_addon: body.drone_addon === true || body.drone_addon === 'true'
          || ['essentials','story','showcase','suite','full','standard','premium','luxury','estate'].includes(pkgNormEarly),
        reel_addon: body.reel_addon === true || body.reel_addon === 'true'
          || ['story','showcase','suite','full'].includes(pkgNormEarly),
        tour_addon: body.tour_addon === true || body.tour_addon === 'true'
          || ['showcase','suite','full','premium','luxury','estate'].includes(pkgNormEarly),
        twilight_addon: body.twilight_addon === true || body.twilight_addon === 'true'
          || ['suite','full','luxury','estate'].includes(pkgNormEarly),
        rush_addon: body.rush_addon === true || body.rush_addon === 'true',
        staging_addon: body.staging_addon === true || body.staging_addon === 'true',
        staging_images: body.staging_images,
        floor_plan_only: body.floor_plan_only === true || body.floor_plan_only === 'true'
          || pkgNormEarly === 'floor_plan_only',
        package_id: body.package_id,
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

  const pkgNorm = String(body.package_id || '').toLowerCase().replace(/[^a-z0-9_]+/g, '_')
  const floorPlanOnly = body.floor_plan_only === true || body.floor_plan_only === 'true'
    || pkgNorm === 'floor_plan_only' || pkgNorm === 'floorplan_only'
  const photosOnly = pkgNorm === 'photos_only'
    || /photos\s*only/i.test(String(body.package_interest || ''))
  // Launch honesty (2026-09-12): refuse virtual staging in Stripe until owned pipeline ships.
  if (body.staging_addon === true || body.staging_addon === 'true' || (parseInt(String(body.staging_images || '0'), 10) || 0) > 0) {
    return bad('Virtual staging is not sold in online checkout yet. Email booking@brxs.ca for a quote.')
  }
  const stagingOn = false
  const stagingImages = 0
  // Mirror quote package ladder into Stripe metadata so webhook/GO stamps match paid SKU
  // even when the client only sent package_id.
  const droneOn = !photosOnly && !floorPlanOnly && (
    body.drone_addon === true || body.drone_addon === 'true'
    || ['essentials','story','showcase','suite','full','standard','premium','luxury','estate'].includes(pkgNorm)
  )
  const reelOn = !floorPlanOnly && (
    body.reel_addon === true || body.reel_addon === 'true'
    || ['story','showcase','suite','full'].includes(pkgNorm)
  )
  const tourOn = !floorPlanOnly && (
    body.tour_addon === true || body.tour_addon === 'true'
    || ['showcase','suite','full','premium','luxury','estate'].includes(pkgNorm)
  )
  const twilightOn = !floorPlanOnly && (
    body.twilight_addon === true || body.twilight_addon === 'true'
    || ['suite','full','luxury','estate'].includes(pkgNorm)
  )
  const floorPlan = floorPlanOnly
    || body.floor_plan_included === true || body.floor_plan_included === 'true'
    || (body.floor_plan_included == null && droneOn && !photosOnly)
  const meta: Record<string, string> = {
    agent_name: (body.agent_name || '').toString().slice(0, 200),
    email: (body.email || '').toString().slice(0, 200),
    property_address: (body.property_address || '').toString().slice(0, 300),
    property_type: (body.property_type || '').toString(),
    package_id: (floorPlanOnly ? 'floor_plan_only' : (body.package_id || '')).toString().slice(0, 64),
    package_interest: (body.package_interest || '').toString(),
    floor_plan_included: String(!!floorPlan),
    preferred_date: preferredDate,
    preferred_window: ['morning', 'afternoon', 'evening'].includes(preferredWindow) ? preferredWindow : '',
    selected_slot_start: slotStart,
    selected_slot_end: slotEnd,
    timezone: zone.tz,
    province: (zone.province || (body.province || '').toString().trim()).slice(0, 8),
    // Explicit false for Photos only — never coerce omitted/string into drone.
    drone_addon: String(droneOn),
    reel_addon: String(reelOn),
    tour_addon: String(tourOn),
    twilight_addon: String(twilightOn),
    rush_addon: String(body.rush_addon === true || body.rush_addon === 'true'),
    staging_addon: String(stagingOn),
    staging_images: String(stagingImages),
    floor_plan_only: String(!!floorPlanOnly),
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
  // Stripe Checkout locales do not include en-CA (use en; CAD/Canada stay).
  form.set('locale', 'en');
  form.set('submit_type', 'book');
  // Live route is /book (Next.js). book.html is a leftover static page.
  form.set('success_url', `${appUrl}/book?paid=1&session_id={CHECKOUT_SESSION_ID}`);
  form.set('cancel_url', `${appUrl}/book?paid=0`);
  // card → Apple Pay / Google Pay wallets on supported devices. link → Stripe Link.
  // Explicit list so Dashboard toggles for PayPal / Klarna / Afterpay / Interac
  // cannot appear on this session.
  form.append('payment_method_types[0]', 'card');
  form.append('payment_method_types[1]', 'link');
  // TEAMLAUNCH / BRXLAUNCH (and other launch coupons) enter on Stripe Checkout.
  form.set('allow_promotion_codes', 'true');
  if (meta.email) form.set('customer_email', meta.email);
  form.append('line_items[0][price_data][currency]', 'cad');
  form.append('line_items[0][price_data][product_data][name]', `Bricks listing media — ${meta.property_address}`);
  form.append('line_items[0][price_data][product_data][description]', `${meta.package_interest || (floorPlanOnly ? 'Floor plan only' : 'HDR photo + drone')} (incl. HST). Travel ${q.travel_fee} CAD, base ${q.base_rate} CAD.`);
  form.append('line_items[0][price_data][unit_amount]', String(amountCents));
  form.append('line_items[0][quantity]', '1');
  form.append('metadata[agent_name]', meta.agent_name);
  form.append('metadata[email]', meta.email);
  form.append('metadata[phone]', meta.phone);
  form.append('metadata[brokerage]', meta.brokerage);
  form.append('metadata[property_address]', meta.property_address);
  form.append('metadata[property_type]', meta.property_type);
  form.append('metadata[package_id]', meta.package_id);
  form.append('metadata[package_interest]', meta.package_interest);
  form.append('metadata[floor_plan_included]', meta.floor_plan_included);
  form.append('metadata[drone_addon]', meta.drone_addon);
  form.append('metadata[reel_addon]', meta.reel_addon);
  form.append('metadata[tour_addon]', meta.tour_addon);
  form.append('metadata[twilight_addon]', meta.twilight_addon);
  form.append('metadata[rush_addon]', meta.rush_addon);
  form.append('metadata[staging_addon]', meta.staging_addon);
  form.append('metadata[staging_images]', meta.staging_images);
  form.append('metadata[floor_plan_only]', meta.floor_plan_only);
  form.append('metadata[preferred_date]', meta.preferred_date);
  form.append('metadata[preferred_window]', meta.preferred_window);
  form.append('metadata[selected_slot_start]', meta.selected_slot_start);
  form.append('metadata[selected_slot_end]', meta.selected_slot_end);
  form.append('metadata[timezone]', meta.timezone);
  form.append('metadata[province]', meta.province);
  form.append('metadata[notes]', meta.notes);
  form.append('metadata[quote_json]', meta.quote_json);

  try {
    await ensureWalletDomains(stripeKey);
    let session = await createCheckoutSession(stripeKey, form);
    // If Link is not enabled on the Stripe account yet, retry cards-only so
    // checkout (and Apple Pay / Google Pay, which ride on `card`) keep working.
    const linkErr = String(session.j?.error?.message || '');
    if (!session.ok && /link/i.test(linkErr)) {
      form.delete('payment_method_types[1]');
      session = await createCheckoutSession(stripeKey, form);
    }
    if (!session.ok) return bad('Stripe error: ' + (session.j.error?.message || session.status), 502);
    return new Response(JSON.stringify({ ok: true, url: session.j.url, session_id: session.j.id }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return bad('Stripe upstream error: ' + String(e), 502);
  }
});
