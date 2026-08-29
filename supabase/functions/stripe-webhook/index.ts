// Supabase Edge Function: stripe-webhook
// Stripe calls this on checkout.session.completed.
// Path: payment success → media_booking_leads (status=paid, OS /bookings queue)
//     → jobs row assigned to Kam (Dispatch fulfill) with payout_status=unpaid
//     → Cal.com slot (best-effort) → owner SMS/email (best-effort).
// Does NOT auto-charge photographers. Does NOT create Connect transfers.
//
// HMAC: Stripe signs with v1=… (not v=). The previous verifier read parts.v and
// rejected every live delivery, so media_booking_leads stayed empty.
//
// Deploy:  supabase functions deploy stripe-webhook --no-verify-jwt
// Needs:   STRIPE_WEBHOOK_SECRET, CAL_KEY (optional), SUPABASE_SERVICE_ROLE_KEY
// Register: endpoint = /functions/v1/stripe-webhook, events = checkout.session.completed

const corsHeaders = { 'Access-Control-Allow-Origin': '*' };

// Kam is the photographer/vendor who fulfills first bookings.
const KAM_VENDOR_ID = '0c3fa7c2-d23b-4e44-90ad-ab2d19af2580';
const KAM_VENDOR_NAME = 'Ajani Kamali Akio';

function msg(s: string, status = 200) {
  return new Response(JSON.stringify({ received: true, note: s }), {
    status, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function restHeaders(serviceKey: string, prefer = 'return=representation'): Record<string, string> {
  return {
    apikey: serviceKey,
    Authorization: `Bearer ${serviceKey}`,
    'Content-Type': 'application/json',
    Prefer: prefer,
  };
}

function parseQuote(raw: string | undefined): { total: number | null; lat: number | null; lon: number | null } {
  if (!raw) return { total: null, lat: null, lon: null };
  try {
    const q = JSON.parse(raw);
    const total = typeof q?.total === 'number' && Number.isFinite(q.total) ? q.total : null;
    const lat = typeof q?.lat === 'number' && Number.isFinite(q.lat) ? q.lat : null;
    const lon = typeof q?.lon === 'number' && Number.isFinite(q.lon) ? q.lon : null;
    return { total, lat, lon };
  } catch {
    return { total: null, lat: null, lon: null };
  }
}

function ymd(raw: string | null, fallbackIso: string | null): string {
  if (raw && /^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;
  if (fallbackIso) {
    const d = new Date(fallbackIso);
    if (!Number.isNaN(d.getTime())) {
      return d.toLocaleDateString('en-CA', { timeZone: 'America/Toronto' });
    }
  }
  return new Date().toLocaleDateString('en-CA', { timeZone: 'America/Toronto' });
}

function torontoClock(iso: string | null): string {
  if (!iso) return '10:00';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '10:00';
  const t = d.toLocaleTimeString('en-CA', {
    hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'America/Toronto',
  });
  return t || '10:00';
}

// Stripe header is t=timestamp,v1=hex[,v1=hex…][,v0=…]. Not v=.
async function verify(rawBody: string, sig: string | null, secret: string): Promise<boolean> {
  if (!sig) return false;
  const buckets: Record<string, string[]> = {};
  for (const part of sig.split(',')) {
    const eq = part.indexOf('=');
    if (eq < 0) continue;
    const k = part.slice(0, eq).trim();
    const v = part.slice(eq + 1).trim();
    if (!k || !v) continue;
    (buckets[k] ||= []).push(v);
  }
  const ts = buckets.t?.[0];
  const candidates = buckets.v1 || [];
  if (!ts || !candidates.length) return false;
  const tsNum = parseInt(ts, 10);
  if (!Number.isFinite(tsNum)) return false;
  if (Math.abs(Date.now() / 1000 - tsNum) > 300) return false;
  const signedPayload = `${ts}.${rawBody}`;
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const mac = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(signedPayload));
  const hex = Array.from(new Uint8Array(mac)).map((b) => b.toString(16).padStart(2, '0')).join('');
  for (const provided of candidates) {
    if (hex.length !== provided.length) continue;
    let diff = 0;
    for (let i = 0; i < hex.length; i++) diff |= hex.charCodeAt(i) ^ provided.charCodeAt(i);
    if (diff === 0) return true;
  }
  return false;
}

async function notifyOwner(lead: {
  id: any;
  agent_name: string;
  email: string;
  phone: string | null;
  property_address: string;
  brokerage: string | null;
  quote_total: number | null;
  selected_slot_start: string | null;
}) {
  const smsTo = (Deno.env.get('BRXS_FORWARD_PHONE') || '3434534578').replace(/\D/g, '');
  const emailTo = Deno.env.get('NOTIFY_EMAIL') || 'booking@brxs.ca';
  const when = lead.selected_slot_start
    ? new Date(lead.selected_slot_start).toLocaleString('en-CA', { timeZone: 'America/Toronto' })
    : 'TBD';
  const total = lead.quote_total != null ? `$${lead.quote_total.toFixed(2)}` : '';
  const office = lead.brokerage ? ` · ${lead.brokerage}` : '';
  const text = `Bricks booking paid #${lead.id}: ${lead.agent_name} (${lead.email})${office} — ${lead.property_address}. Shoot: ${when} ${total}`;
  const emailSubject = `New Bricks booking #${lead.id} — ${lead.agent_name}`;
  const emailHtml = `<div style="font-family:Helvetica,Arial,sans-serif;max-width:520px;padding:18px;">
    <h2 style="margin:0 0 12px;color:#D2542B;">New booking paid</h2>
    <p><b>Lead #${lead.id}</b></p>
    <p><b>Agent:</b> ${lead.agent_name} &lt;${lead.email}&gt;${lead.phone ? ' · ' + lead.phone : ''}</p>
    ${lead.brokerage ? `<p><b>Office:</b> ${lead.brokerage}</p>` : ''}
    <p><b>Property:</b> ${lead.property_address}</p>
    <p><b>Shoot time:</b> ${when}</p>
    ${total ? `<p><b>Total:</b> ${total} CAD (incl. HST). Photographer payout is unpaid — not auto-charged.</p>` : ''}
    <p style="color:#666;font-size:13px;margin-top:16px;">Visible on app.brxs.ca/bookings. Dispatch job assigned to fulfill. Reply to this email or text the team.</p>
  </div>`;

  const twSid = Deno.env.get('TWILIO_ACCOUNT_SID');
  const twTok = Deno.env.get('TWILIO_AUTH_TOKEN');
  const twFrom = Deno.env.get('TWILIO_FROM_NUMBER');
  if (twSid && twTok && twFrom) {
    try {
      const body = new URLSearchParams({ To: smsTo, From: twFrom, Body: text });
      const r = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twSid}/Messages.json`, {
        method: 'POST',
        headers: { Authorization: `Basic ${btoa(twSid + ':' + twTok)}`, 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
      });
      if (!r.ok) console.error('Twilio SMS failed for lead ' + lead.id + ': ' + (await r.text()).slice(0, 200));
    } catch (e) { console.error('Twilio SMS error for lead ' + lead.id + ': ' + String(e)); }
  } else {
    console.warn('Skipped SMS for lead ' + lead.id + ' -- missing Twilio env.');
  }

  const resendKey = Deno.env.get('RESEND_API_KEY');
  if (resendKey) {
    try {
      const r = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'Bricks Bookings <booking@brxs.ca>',
          to: [emailTo],
          subject: emailSubject,
          html: emailHtml,
        }),
      });
      if (!r.ok) console.error('Resend email failed for lead ' + lead.id + ': ' + (await r.text()).slice(0, 200));
    } catch (e) { console.error('Resend email error for lead ' + lead.id + ': ' + String(e)); }
  } else {
    console.warn('Skipped email for lead ' + lead.id + ' -- missing RESEND_API_KEY.');
  }
}

async function fetchLeadBySession(supabaseUrl: string, serviceKey: string, sessionId: string): Promise<string | null> {
  const url = `${supabaseUrl}/rest/v1/media_booking_leads?stripe_session_id=eq.${encodeURIComponent(sessionId)}&select=id&limit=1`;
  const res = await fetch(url, { headers: restHeaders(serviceKey, 'return=representation') });
  if (!res.ok) return null;
  const rows = await res.json();
  return rows?.[0]?.id || null;
}

async function ensureDispatchJob(opts: {
  supabaseUrl: string;
  serviceKey: string;
  leadId: string;
  sessionId: string;
  m: Record<string, string>;
  quote: { total: number | null; lat: number | null; lon: number | null };
  preferredDate: string;
}): Promise<{ jobId: string | null; created: boolean; error?: string }> {
  const existingUrl = `${opts.supabaseUrl}/rest/v1/jobs?booking_id=eq.${encodeURIComponent(opts.leadId)}&select=id&limit=1`;
  const existingRes = await fetch(existingUrl, { headers: restHeaders(opts.serviceKey, 'return=representation') });
  if (existingRes.ok) {
    const rows = await existingRes.json();
    if (rows?.[0]?.id) return { jobId: rows[0].id, created: false };
  }

  const now = new Date().toISOString();
  const rush = opts.m.rush_addon === 'true';
  const addOns = [
    opts.m.reel_addon === 'true' ? { key: 'reel', included: true } : null,
    opts.m.tour_addon === 'true' ? { key: 'tour', included: true } : null,
    opts.m.twilight_addon === 'true' ? { key: 'twilight', included: true } : null,
    rush ? { key: 'rush', included: true } : null,
  ].filter(Boolean);

  const job = {
    id: crypto.randomUUID(),
    booking_id: opts.leadId,
    address: opts.m.property_address || '—',
    city: '',
    state: '',
    zip_code: '',
    lat: opts.quote.lat,
    lng: opts.quote.lon,
    time_window_start: torontoClock(opts.m.selected_slot_start || null),
    time_window_end: opts.m.selected_slot_end ? torontoClock(opts.m.selected_slot_end) : '',
    job_type: 'photo',
    status: 'assigned',
    priority: rush ? 'rush' : 'normal',
    property_details: `${opts.m.property_type || 'listing'} · paid www.brxs.ca/book · lead ${opts.leadId} · stripe ${opts.sessionId}`,
    client_instructions: opts.m.notes || '',
    checklist: [],
    assignee_id: KAM_VENDOR_ID,
    vendor_id: KAM_VENDOR_ID,
    scheduled_date: opts.preferredDate,
    agent_name: opts.m.agent_name || null,
    agent_email: opts.m.email || null,
    agent_brokerage: opts.m.brokerage || null,
    package_name: opts.m.package_interest || 'Listing media',
    package_price: opts.quote.total != null ? Math.round(opts.quote.total) : null,
    add_ons: addOns,
    billing_type: 'stripe_prepaid',
    created_at: now,
    updated_at: now,
    payout_status: 'unpaid',
    payout_amount: null,
    payout_transfer_id: null,
    vendor_name: KAM_VENDOR_NAME,
    vendor_tier: 1,
    vendor_payout: null,
    platform_margin: null,
    is_rush: rush,
    ai_flags: [],
  };

  const res = await fetch(`${opts.supabaseUrl}/rest/v1/jobs`, {
    method: 'POST',
    headers: restHeaders(opts.serviceKey, 'return=representation'),
    body: JSON.stringify(job),
  });
  if (!res.ok) {
    const errText = await res.text();
    console.error('jobs insert failed for lead ' + opts.leadId + ': ' + errText.slice(0, 400));
    return { jobId: null, created: false, error: errText.slice(0, 200) };
  }
  const rows = await res.json();
  return { jobId: rows?.[0]?.id || job.id, created: true };
}

Deno.serve(async (req: Request) => {
  if (req.method !== 'POST') return msg('method not allowed', 405);
  const raw = await req.text();
  const secret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
  const sig = req.headers.get('stripe-signature');
  if (secret) {
    if (!sig || !(await verify(raw, sig, secret))) return msg('invalid signature', 401);
  } else {
    console.warn('Webhook processed without signature verification (STRIPE_WEBHOOK_SECRET not set).');
  }

  let event: any;
  try { event = JSON.parse(raw); } catch { return msg('bad json', 400); }
  if (event.type !== 'checkout.session.completed') return msg('ignored event ' + event.type);

  const s = event.data.object;
  const m = s.metadata || {};
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!supabaseUrl || !serviceKey) return msg('server misconfigured', 500);

  const quote = parseQuote(m.quote_json);
  const preferredDate = ymd(m.preferred_date || null, m.selected_slot_start || null);
  const payload = {
    stripe_session_id: s.id || null,
    agent_name: m.agent_name || '—',
    email: m.email || '—',
    brokerage: m.brokerage || null,
    phone: m.phone || null,
    property_address: m.property_address || '—',
    property_type: m.property_type || '—',
    package_interest: m.package_interest || '—',
    tour_addon: m.tour_addon === 'true',
    twilight_addon: m.twilight_addon === 'true',
    reel_addon: m.reel_addon === 'true',
    rush_addon: m.rush_addon === 'true',
    preferred_date: preferredDate,
    preferred_window: m.preferred_window || null,
    notes: m.notes || null,
    selected_slot_start: m.selected_slot_start || null,
    selected_slot_end: m.selected_slot_end || null,
    quote_total: quote.total,
    status: 'paid',
    source: 'bricks-booking-stripe',
    upsell_stage: 'media_only',
  };

  let leadId: string | null = null;
  let duplicate = false;
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/media_booking_leads`, {
      method: 'POST',
      headers: restHeaders(serviceKey, 'return=representation'),
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const errText = await res.text();
      if (res.status === 409 || errText.includes('23505')) {
        duplicate = true;
        leadId = await fetchLeadBySession(supabaseUrl, serviceKey, s.id);
      } else {
        return msg('insert failed: ' + errText, 502);
      }
    } else {
      const j = await res.json();
      leadId = j?.[0]?.id || null;
    }
  } catch (e) {
    return msg('insert error: ' + String(e), 502);
  }
  if (!leadId) return msg('paid lead missing after write', 502);

  const jobResult = await ensureDispatchJob({
    supabaseUrl, serviceKey, leadId, sessionId: s.id, m, quote, preferredDate,
  });

  if (!duplicate) {
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
            metadata: {
              bricks_lead_id: String(leadId),
              property_lat: quote.lat != null ? String(quote.lat) : '',
              property_lon: quote.lon != null ? String(quote.lon) : '',
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

    try {
      await notifyOwner({
        id: leadId,
        agent_name: payload.agent_name,
        email: payload.email,
        phone: payload.phone,
        property_address: payload.property_address,
        brokerage: payload.brokerage,
        quote_total: payload.quote_total,
        selected_slot_start: payload.selected_slot_start,
      });
    } catch (e) {
      console.error('notifyOwner failed for lead ' + leadId + ': ' + String(e));
    }
  }

  return msg(
    (duplicate ? 'duplicate session already processed; ' : '') +
    'paid lead ' + leadId +
    (jobResult.jobId ? ' dispatch job ' + jobResult.jobId + (jobResult.created ? ' created' : ' existed') : ' dispatch job missing') +
    (jobResult.error ? ' job_error=' + jobResult.error : ''),
  );
});
