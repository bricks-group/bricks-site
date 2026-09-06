import { msg, notifyOwner, parseQuote, resolvePropertyTimezone, restHeaders, verify, ymd } from './helpers.ts';
import { ensureDispatchJob, fetchLeadBySession } from './job.ts';

Deno.serve(async (req: Request) => {
if (req.method !== 'POST') return msg('method not allowed', 405);
const raw = await req.text();
const secret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
const sig = req.headers.get('stripe-signature');
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