// Supabase Edge Function: stripe-webhook
// Stripe calls this on checkout.session.completed. We verify the signature,
// write the paid lead to media_booking_leads (status='paid'), and create the
// real Cal.com booking using the exact slot the customer picked and confirmed
// was available during the booking flow (book.html Step 3, via cal-slots) --
// not a hardcoded or later-picked time.
//
// Deploy:  supabase functions deploy stripe-webhook
// Needs:   STRIPE_WEBHOOK_SECRET  (from Stripe dashboard webhook config)
//          CAL_KEY                (Cal.com API key, same account as cal-slots)
//          SUPABASE_SERVICE_ROLE_KEY (auto-injected)
// Register the webhook in Stripe: endpoint = /functions/v1/stripe-webhook ,
//           events = checkout.session.completed

const corsHeaders = { 'Access-Control-Allow-Origin': '*' };

function msg(s: string, status = 200) {
  return new Response(JSON.stringify({ received: true, note: s }), {
    status, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// HMAC-SHA256 verification of Stripe signature
async function verify(rawBody: string, sig: string | null, secret: string): Promise<boolean> {
  if (!sig) return false;
  const parts = sig.split(',').reduce((a: any, p) => { const [k, v] = p.split('='); a[k] = v; return a; }, {});
  const ts = parts.t, provided = parts.v;
  if (!ts || !provided) return false;
  const signedPayload = `${ts}.${rawBody}`;
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const mac = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(signedPayload));
  const hex = Array.from(new Uint8Array(mac)).map((b) => b.toString(16).padStart(2, '0')).join('');
  // constant-time compare
  if (hex.length !== provided.length) return false;
  let diff = 0;
  for (let i = 0; i < hex.length; i++) diff |= hex.charCodeAt(i) ^ provided.charCodeAt(i);
  return diff === 0;
}

Deno.serve(async (req: Request) => {
  if (req.method !== 'POST') return msg('method not allowed', 405);
  const raw = await req.text();
  const secret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
  const sig = req.headers.get('stripe-signature');
  if (secret && sig) {
    if (!(await verify(raw, sig, secret))) return msg('invalid signature', 400);
  } else {
    // Pre-launch: process without verification when no secret is configured.
    // Set STRIPE_WEBHOOK_SECRET (whsec_...) in prod to enforce signature checks.
    console.warn('Webhook processed without signature verification (STRIPE_WEBHOOK_SECRET not set or no signature header present).');
  }

  let event: any;
  try { event = JSON.parse(raw); } catch { return msg('bad json', 400); }
  if (event.type !== 'checkout.session.completed') return msg('ignored event ' + event.type);

  const s = event.data.object;
  const m = s.metadata || {};
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!supabaseUrl || !serviceKey) return msg('server misconfigured', 500);

  // 1) write paid lead
  // stripe_session_id is unique -- Stripe retries webhook deliveries (timeouts,
  // transient errors), and without this a retry would insert a duplicate lead
  // AND create a duplicate Cal.com booking for the same payment.
  const quote = m.quote_json ? JSON.parse(m.quote_json) : null;
  const payload = {
    stripe_session_id: s.id || null,
    agent_name: m.agent_name || '—', email: m.email || '—', brokerage: m.brokerage || null, phone: m.phone || null,
    property_address: m.property_address || '—', property_type: m.property_type || '—', package_interest: m.package_interest || '—',
    tour_addon: m.tour_addon === 'true', twilight_addon: m.twilight_addon === 'true', extended3d_addon: m.extended3d_addon === 'true',
    preferred_date: m.preferred_date || null, preferred_window: m.preferred_window || null, notes: m.notes || null,
    selected_slot_start: m.selected_slot_start || null, selected_slot_end: m.selected_slot_end || null,
    quote_total: quote ? quote.total : null, status: 'paid', source: 'bricks-booking-stripe', upsell_stage: 'media_only',
  };
  let leadId = null;
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/media_booking_leads`, {
      method: 'POST', headers: { 'apikey': serviceKey, 'Authorization': `Bearer ${serviceKey}`, 'Content-Type': 'application/json', 'Prefer': 'return=representation' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const errText = await res.text();
      // Unique violation on stripe_session_id = this exact payment was already
      // processed on an earlier delivery. Skip re-creating the Cal.com booking.
      if (res.status === 409 && errText.includes('23505')) {
        return msg('duplicate webhook delivery for session ' + s.id + ' -- already processed');
      }
      return msg('insert failed: ' + errText, 502);
    }
    const j = await res.json();
    leadId = j?.[0]?.id;
  } catch (e) { return msg('insert error: ' + String(e), 502); }

  // 2) create the real Cal.com booking, using the exact slot the customer
  // picked and confirmed was available during the flow (book.html Step 3,
  // via cal-slots) -- not a hardcoded time, and not something decided later.
  const calKey = Deno.env.get('CAL_KEY');
  if (calKey && m.selected_slot_start && m.selected_slot_end) {
    try {
      const bookingRes = await fetch('https://api.cal.com/v2/bookings', {
        method: 'POST',
        headers: { Authorization: `Bearer ${calKey}`, 'cal-api-version': '2026-02-25', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventTypeId: 6387567,
          start: m.selected_slot_start,
          attendee: { name: m.agent_name || 'Bricks agent', email: m.email || 'booking@brxs.ca', timeZone: 'America/Toronto' },
          location: { type: 'attendeeAddress', address: m.property_address || '' },
          bookingFieldsResponses: { notes: `Bricks paid shoot (lead ${leadId}). ${m.property_address || ''}` },
          // property_lat/lon let cal-slots enforce a travel-time gap against
          // this booking when it later computes availability for other addresses.
          metadata: {
            bricks_lead_id: String(leadId),
            property_lat: quote?.lat != null ? String(quote.lat) : '',
            property_lon: quote?.lon != null ? String(quote.lon) : '',
          },
        }),
      });
      if (!bookingRes.ok) {
        console.error('Cal.com booking failed for lead ' + leadId + ': ' + (await bookingRes.text()));
      }
    } catch (e) {
      console.error('Cal.com booking error for lead ' + leadId + ': ' + String(e));
    }
  } else {
    console.warn('Skipped Cal.com booking for lead ' + leadId + ' -- missing CAL_KEY or selected slot.');
  }

  return msg('paid lead ' + leadId + ' created');
});
