// Supabase Edge Function: stripe-webhook
// Stripe calls this on checkout.session.completed.
// Path: payment success → media_booking_leads (status=paid, OS /bookings queue)
//     → jobs row auto-assigned (location/package/tier/skills/RPAS) or left unassigned
//     → owner SMS/email (best-effort). Cal.com is NOT called (native selected_slot_*).
// Does NOT auto-charge photographers. Does NOT create Connect transfers.
//
// HMAC: Stripe signs with v1=… (not v=). The previous verifier read parts.v and
// rejected every live delivery, so media_booking_leads stayed empty.
//
// Deploy:  supabase functions deploy stripe-webhook --no-verify-jwt
// Needs:   STRIPE_WEBHOOK_SECRET, SUPABASE_SERVICE_ROLE_KEY
// Register: endpoint = /functions/v1/stripe-webhook, events = checkout.session.completed

import { civilClockHm, civilYmd, formatLocalWhen, resolvePropertyTimezone } from '../_shared/canada-tz.ts';

const corsHeaders = { 'Access-Control-Allow-Origin': '*' };

const KAM_VENDOR_ID = '0c3fa7c2-d23b-4e44-90ad-ab2d19af2580';
const ORG_VENDOR_ID = 'default_vendor';
const GTA = ['gta','toronto','mississauga','brampton','vaughan','markham','oakville','peel','halton','york','durham','etobicoke','scarborough'];

function packageIdOf(name: string, explicit?: string): string {
  // Prefer Stripe metadata package_id from /book (photos_only|essentials|story|showcase|suite).
  const raw = (explicit || '').toLowerCase().replace(/[^a-z0-9_]+/g, '');
  const aliases: Record<string, string> = {
    photosonly: 'photos_only', photo_only: 'photos_only', photos: 'photos_only',
    fullsuite: 'suite', full: 'suite',
  };
  if (raw) {
    if (aliases[raw]) return aliases[raw];
    if (['photos_only', 'essentials', 'story', 'showcase', 'suite', 'estate', 'luxury', 'premium', 'standard'].includes(raw)) {
      return raw;
    }
    if (raw) return raw;
  }
  const n = (name || '').toLowerCase();
  if (n.includes('photos only') || n.includes('photo only')) return 'photos_only';
  if (n.includes('full suite')) return 'suite';
  for (const token of ['showcase', 'essentials', 'story', 'suite', 'estate', 'luxury', 'premium', 'standard']) {
    if (n.includes(token)) return token;
  }
  const first = n.split(/[^a-z0-9]+/).filter(Boolean)[0] || 'essentials';
  if (aliases[first]) return aliases[first];
  if (first === 'hdr' || first === 'photo' || first === 'listing') return 'essentials';
  return first;
}
function minTierOf(pkg: string): number {
  if (pkg === 'estate' || pkg === 'luxury' || pkg === 'suite' || pkg === 'showcase') return 3;
  if (pkg === 'premium' || pkg === 'story') return 2;
  return 1;
}
function tourPurchased(m: Record<string, string>, pkg: string): boolean {
  if (m.tour_addon === 'true') return true;
  return pkg === 'showcase' || pkg === 'suite' || pkg === 'full';
}
function floorplanPurchased(m: Record<string, string>, pkg: string): boolean {
  if (m.floor_plan_included === 'true') return true;
  if (m.floor_plan_included === 'false') return false;
  const photosOnly = pkg === 'photos_only' || pkg === 'photosonly' || pkg === 'photos';
  if (photosOnly) return false;
  const drone = m.drone_addon === 'true';
  return drone || ['essentials', 'story', 'showcase', 'suite', 'full', 'standard', 'premium', 'luxury', 'estate'].includes(pkg);
}
function isOwner(m: any): boolean {
  const role = String(m?.role || '').toLowerCase();
  const email = String(m?.email || '').toLowerCase();
  return role === 'owner' || m?.id === KAM_VENDOR_ID || email === 'akashorter@icloud.com' || email === 'akashorter@gmail.com';
}
function isAman(m: any): boolean {
  const status = String(m?.onboarding_status || '').toLowerCase();
  if (status !== 'approved') return true;
  const name = String(m?.name || '').toLowerCase();
  return name.includes('aman') && name.includes('sammy');
}
function hasAdvancedRpas(m: any): boolean {
  if (m?.rpas_advanced === true) return true;
  return String(m?.rpas_certificate_level || '').toLowerCase() === 'advanced';
}
function vendorSkills(m: any): Set<string> {
  const s = new Set<string>();
  for (const x of (m?.skills || [])) s.add(String(x).toLowerCase());
  const spec = String(m?.specialty || '').toLowerCase();
  if (spec) s.add(spec === 'photography' ? 'photo' : spec);
  if (m?.drone_certified || hasAdvancedRpas(m)) s.add('drone');
  if (m?.polycam_equipped) s.add('tour');
  if (!s.size) s.add('photo');
  return s;
}
function locationOk(m: any, address: string, city: string): boolean {
  const hay = `${city || ''} ${address || ''}`.toLowerCase();
  const areas = [...(m?.service_areas || []), m?.home_city || ''].map((a: string) => String(a).toLowerCase()).filter(Boolean);
  if (!areas.length) return true;
  if (areas.some((a: string) => a && hay.includes(a))) return true;
  const vgta = areas.some((a: string) => GTA.some((g) => a.includes(g)));
  const jgta = GTA.some((g) => hay.includes(g));
  return vgta && (jgta || !hay.trim());
}

async function pickAssignee(supabaseUrl: string, serviceKey: string, job: any): Promise<string> {
  const url = `${supabaseUrl}/rest/v1/vendor_members?select=*&is_active=eq.true&limit=200`;
  const res = await fetch(url, { headers: restHeaders(serviceKey) });
  if (!res.ok) return '';
  const rows = await res.json();
  const needed = new Set<string>(['photo']);
  const addKeys = (job.add_ons || []).map((a: any) => String(a?.key || a).toLowerCase());
  if (job.job_type === 'drone' || addKeys.includes('drone')) needed.add('drone');
  if (addKeys.includes('reel')) needed.add('reel');
  if (addKeys.includes('tour')) needed.add('tour');
  if (addKeys.includes('twilight')) needed.add('twilight');
  const minTier = job.min_tier_required || 1;
  const eligible = (rows || []).filter((m: any) => {
    if (isAman(m)) return false;
    if ((m.tier || 1) < minTier) return false;
    if (!locationOk(m, job.address, job.city)) return false;
    const have = vendorSkills(m);
    for (const k of needed) if (!have.has(k) && !(k === 'photo' && have.has('photography'))) return false;
    if (needed.has('drone') && !hasAdvancedRpas(m)) return false;
    return true;
  });
  eligible.sort((a: any, b: any) => {
    const oa = isOwner(a) ? 1 : 0;
    const ob = isOwner(b) ? 1 : 0;
    if (oa !== ob) return ob - oa;
    return (b.tier || 1) - (a.tier || 1);
  });
  return eligible[0]?.id || '';
}

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

function ymd(raw: string | null, fallbackIso: string | null, tz: string): string {
  if (raw && /^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;
  if (fallbackIso) {
    const d = new Date(fallbackIso);
    if (!Number.isNaN(d.getTime())) return civilYmd(fallbackIso, tz);
  }
  return civilYmd(new Date().toISOString(), tz);
}

const PREFERRED_WINDOWS: Record<string, [string, string]> = {
  morning: ['09:00', '12:00'],
  afternoon: ['12:00', '16:00'],
  evening: ['16:00', '19:00'],
};

function windowBounds(
  preferredWindow: string | null | undefined,
  slotStart: string | null | undefined,
  slotEnd: string | null | undefined,
  tz: string,
): [string, string] {
  // Exact booked clock is the source of truth when present — property local zone.
  if (slotStart) {
    const start = civilClockHm(slotStart, tz);
    const end = slotEnd ? civilClockHm(slotEnd, tz) : '';
    if (end) return [start, end];
  }
  const key = String(preferredWindow || '').trim().toLowerCase();
  if (key in PREFERRED_WINDOWS) return PREFERRED_WINDOWS[key];
  return [civilClockHm(slotStart || null, tz), slotEnd ? civilClockHm(slotEnd, tz) : '11:00'];
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
  timezone: string;
}) {
  const smsTo = (Deno.env.get('BRXS_FORWARD_PHONE') || '3434534578').replace(/\D/g, '');
  const emailTo = Deno.env.get('NOTIFY_EMAIL') || 'booking@brxs.ca';
  const when = lead.selected_slot_start
    ? formatLocalWhen(lead.selected_slot_start, lead.timezone)
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
  timezone: string;
  province: string | null;
}): Promise<{ jobId: string | null; created: boolean; error?: string }> {
  const existingUrl = `${opts.supabaseUrl}/rest/v1/jobs?booking_id=eq.${encodeURIComponent(opts.leadId)}&select=id&limit=1`;
  const existingRes = await fetch(existingUrl, { headers: restHeaders(opts.serviceKey, 'return=representation') });
  if (existingRes.ok) {
    const rows = await existingRes.json();
    if (rows?.[0]?.id) return { jobId: rows[0].id, created: false };
  }

  const now = new Date().toISOString();
  const rush = opts.m.rush_addon === 'true';
  const drone = opts.m.drone_addon === 'true';
  const pkg = packageIdOf(opts.m.package_interest || '', opts.m.package_id || '');
  const tour = tourPurchased(opts.m, pkg);
  const floorplan = floorplanPurchased(opts.m, pkg);
  // Match confirm-paid / book_checkout: stamp tour + floorplan so GO gates and
  // skill matching stay honest even when package metadata was thin.
  const addOns = [
    drone ? { key: 'drone', included: true } : null,
    opts.m.reel_addon === 'true' ? { key: 'reel', included: true } : null,
    tour ? { key: 'tour', included: true } : null,
    opts.m.twilight_addon === 'true' ? { key: 'twilight', included: true } : null,
    rush ? { key: 'rush', included: true } : null,
    floorplan ? { key: 'floorplan_2d', included: true } : null,
  ].filter(Boolean);
  const minTier = minTierOf(pkg);
  const cityGuess = (opts.m.property_address || '').split(',').slice(-2, -1)[0]?.trim() || '';

  const [twStart, twEnd] = windowBounds(
    opts.m.preferred_window, opts.m.selected_slot_start, opts.m.selected_slot_end, opts.timezone,
  );
  const job: Record<string, unknown> = {
    id: crypto.randomUUID(),
    booking_id: opts.leadId,
    address: opts.m.property_address || '—',
    city: cityGuess,
    state: opts.province || '',
    zip_code: '',
    lat: opts.quote.lat,
    lng: opts.quote.lon,
    time_window_start: twStart,
    time_window_end: twEnd,
    job_type: drone ? 'drone' : 'photo',
    status: 'unassigned',
    priority: rush ? 'rush' : 'normal',
    property_details: `${opts.m.property_type || 'listing'} · paid www.brxs.ca/book · lead ${opts.leadId} · stripe ${opts.sessionId} · tz ${opts.timezone}`,
    client_instructions: opts.m.notes || '',
    checklist: [],
    assignee_id: '',
    vendor_id: ORG_VENDOR_ID,
    scheduled_date: opts.preferredDate,
    agent_name: opts.m.agent_name || null,
    agent_email: opts.m.email || null,
    agent_brokerage: opts.m.brokerage || null,
    package_id: pkg,
    package_name: opts.m.package_interest || 'Listing media',
    package_price: opts.quote.total != null ? Math.round(opts.quote.total) : null,
    rack_price: opts.quote.total != null ? Math.round(opts.quote.total) : null,
    add_ons: addOns,
    billing_type: 'stripe_prepaid',
    created_at: now,
    updated_at: now,
    payout_status: 'unpaid',
    payout_amount: null,
    payout_transfer_id: null,
    // jobs.vendor_name is NOT NULL (default ''); an explicit null in the
    // PostgREST payload overrides that default and 500s the insert whenever
    // no assignee is found (or the assignee isn't Kam) below.
    vendor_name: '',
    vendor_tier: minTier,
    min_tier_required: minTier,
    preferred_tier: minTier,
    vendor_payout: null,
    platform_margin: null,
    is_rush: rush,
    ai_flags: [],
  };

  let assignee = '';
  const dispatchUrl = (Deno.env.get('DISPATCH_API_URL') || 'https://dispatch-api.brxs.ca').replace(/\/$/, '');
  const internalKey = (Deno.env.get('INTERNAL_API_KEY') || (Deno.env.get('INTERNAL_API_KEYS') || '').split(',')[0] || '').trim();
  if (internalKey) {
    try {
      const intake = await fetch(`${dispatchUrl}/api/v1/dispatch/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Internal-Api-Key': internalKey },
        body: JSON.stringify({
          booking_id: opts.leadId,
          address: job.address,
          city: job.city,
          state: job.state,
          timezone: opts.timezone,
          province: opts.province,
          lat: job.lat,
          lng: job.lng,
          time_window_start: job.time_window_start,
          time_window_end: job.time_window_end,
          job_type: job.job_type,
          priority: job.priority,
          property_details: job.property_details,
          client_instructions: job.client_instructions,
          scheduled_date: job.scheduled_date,
          vendor_id: ORG_VENDOR_ID,
          assignee_id: '',
          agent_name: job.agent_name,
          agent_email: job.agent_email,
          agent_brokerage: job.agent_brokerage,
          package_id: pkg,
          package_name: job.package_name,
          package_price: job.package_price,
          rack_price: job.rack_price,
          add_ons: addOns,
          min_tier_required: minTier,
          preferred_tier: minTier,
          is_rush: rush,
        }),
      });
      if (intake.ok) {
        const body = await intake.json();
        return { jobId: body.job_id || body.id || null, created: true };
      }
      console.error('dispatch intake failed: ' + (await intake.text()).slice(0, 300));
    } catch (e) {
      console.error('dispatch intake error: ' + String(e));
    }
  }

  assignee = await pickAssignee(opts.supabaseUrl, opts.serviceKey, job);
  if (assignee) {
    job.assignee_id = assignee;
    job.status = 'assigned';
    job.vendor_name = assignee === KAM_VENDOR_ID ? 'Ajani Kamali Akio' : '';
    job.vendor_tier = assignee === KAM_VENDOR_ID ? 3 : job.vendor_tier;
  } else {
    job.status = 'unassigned';
    job.assignee_id = '';
  }

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
  // Fail CLOSED: an unset STRIPE_WEBHOOK_SECRET must never let requests through
  // unverified. Anyone who discovers this endpoint could otherwise POST a fake
  // checkout.session.completed and create free "paid" bookings + dispatch jobs.
  if (!secret) {
    console.error('STRIPE_WEBHOOK_SECRET not set -- rejecting webhook (fail closed).');
    return msg('server misconfigured', 500);
  }
  if (!sig || !(await verify(raw, sig, secret))) return msg('invalid signature', 401);

  let event: any;
  try { event = JSON.parse(raw); } catch { return msg('bad json', 400); }
  if (event.type !== 'checkout.session.completed') return msg('ignored event ' + event.type);

  const s = event.data.object;
  const m = s.metadata || {};
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!supabaseUrl || !serviceKey) return msg('server misconfigured', 500);

  const quote = parseQuote(m.quote_json);
  const zone = resolvePropertyTimezone({
    timezone: m.timezone || null,
    province: m.province || null,
    address: m.property_address || null,
  });
  const preferredDate = ymd(m.preferred_date || null, m.selected_slot_start || null, zone.tz);
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
  // Check for an existing lead for this Stripe session BEFORE inserting.
  // Stripe redelivers on timeout/non-2xx, and a DB unique constraint on
  // stripe_session_id may not be present in every environment -- so the
  // insert's own 409/23505 is a backstop, not the primary defense, against
  // double-creating the dispatch job / owner notification.
  if (s.id) {
    const existing = await fetchLeadBySession(supabaseUrl, serviceKey, s.id);
    if (existing) {
      duplicate = true;
      leadId = existing;
    }
  }
  if (!leadId) {
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
  }
  if (!leadId) return msg('paid lead missing after write', 502);

  const jobResult = await ensureDispatchJob({
    supabaseUrl, serviceKey, leadId, sessionId: s.id, m, quote, preferredDate,
    timezone: zone.tz, province: zone.province,
  });

  if (!duplicate) {
    // Cal.com booking removed — selected_slot_* is native; Dispatch/OS own the schedule.
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
        timezone: zone.tz,
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
