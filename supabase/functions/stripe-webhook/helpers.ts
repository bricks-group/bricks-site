import { civilYmd, civilClockHm, formatLocalWhen } from './tz.ts';

export const corsHeaders = { 'Access-Control-Allow-Origin': '*' };
export const KAM_VENDOR_ID = '0c3fa7c2-d23b-4e44-90ad-ab2d19af2580';
export const ORG_VENDOR_ID = 'default_vendor';
export const GTA = ['gta','toronto','mississauga','brampton','vaughan','markham','oakville','peel','halton','york','durham','etobicoke','scarborough'];
export function packageIdOf(name: string, explicit?: string): string {
const raw = (explicit || '').toLowerCase().replace(/[^a-z0-9_]+/g, '');
const aliases: Record<string, string> = {
photosonly: 'photos_only', photo_only: 'photos_only', photos: 'photos_only',
fullsuite: 'suite', full: 'suite',
floorplanonly: 'floor_plan_only', floor_planonly: 'floor_plan_only', floorplanonl: 'floor_plan_only',
};
if (raw) {
if (aliases[raw]) return aliases[raw];
if (['photos_only', 'essentials', 'story', 'showcase', 'suite', 'estate', 'luxury', 'premium', 'standard', 'floor_plan_only'].includes(raw)) {
return raw;
}
if (raw) return raw;
}
const n = (name || '').toLowerCase();
if (n.includes('photos only') || n.includes('photo only')) return 'photos_only';
if (n.includes('floor plan only') || n.includes('floorplan only')) return 'floor_plan_only';
if (n.includes('full suite')) return 'suite';
for (const token of ['showcase', 'essentials', 'story', 'suite', 'estate', 'luxury', 'premium', 'standard']) {
if (n.includes(token)) return token;
}
const first = n.split(/[^a-z0-9]+/).filter(Boolean)[0] || 'essentials';
if (aliases[first]) return aliases[first];
if (first === 'hdr' || first === 'photo' || first === 'listing') return 'essentials';
return first;
}
export function minTierOf(pkg: string): number {
if (pkg === 'estate' || pkg === 'luxury' || pkg === 'suite' || pkg === 'showcase') return 3;
if (pkg === 'premium' || pkg === 'story') return 2;
return 1;
}
export function tourPurchased(m: Record<string, string>, pkg: string): boolean {
if (m.tour_addon === 'true') return true;
return ['showcase', 'suite', 'full', 'premium', 'luxury', 'estate'].includes(pkg);
}
export function floorplanPurchased(m: Record<string, string>, pkg: string): boolean {
if (m.floor_plan_only === 'true' || pkg === 'floor_plan_only' || pkg === 'floorplanonly') return true;
if (m.floor_plan_included === 'true') return true;
if (m.floor_plan_included === 'false') return false;
const photosOnly = pkg === 'photos_only' || pkg === 'photosonly' || pkg === 'photos';
if (photosOnly) return false;
const drone = m.drone_addon === 'true';
return drone || ['essentials', 'story', 'showcase', 'suite', 'full', 'standard', 'premium', 'luxury', 'estate'].includes(pkg);
}
export function isOwner(m: any): boolean {
const role = String(m?.role || '').toLowerCase();
const email = String(m?.email || '').toLowerCase();
return role === 'owner' || m?.id === KAM_VENDOR_ID || email === 'akashorter@icloud.com' || email === 'akashorter@gmail.com';
}
export function isAman(m: any): boolean {
const status = String(m?.onboarding_status || '').toLowerCase();
if (status !== 'approved') return true;
const name = String(m?.name || '').toLowerCase();
return name.includes('aman') && name.includes('sammy');
}
export function hasAdvancedRpas(m: any): boolean {
if (m?.rpas_advanced === true) return true;
return String(m?.rpas_certificate_level || '').toLowerCase() === 'advanced';
}
export function vendorSkills(m: any): Set<string> {
const s = new Set<string>();
for (const x of (m?.skills || [])) s.add(String(x).toLowerCase());
const spec = String(m?.specialty || '').toLowerCase();
if (spec) s.add(spec === 'photography' ? 'photo' : spec);
if (m?.drone_certified || hasAdvancedRpas(m)) s.add('drone');
if (m?.polycam_equipped) s.add('tour');
if (!s.size) s.add('photo');
return s;
}
export function locationOk(m: any, address: string, city: string): boolean {
const hay = `${city || ''} ${address || ''}`.toLowerCase();
const areas = [...(m?.service_areas || []), m?.home_city || ''].map((a: string) => String(a).toLowerCase()).filter(Boolean);
if (!areas.length) return true;
if (areas.some((a: string) => a && hay.includes(a))) return true;
const vgta = areas.some((a: string) => GTA.some((g) => a.includes(g)));
const jgta = GTA.some((g) => hay.includes(g));
return vgta && (jgta || !hay.trim());
}
export async function pickAssignee(supabaseUrl: string, serviceKey: string, job: any): Promise<string> {
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
export function msg(s: string, status = 200) {
return new Response(JSON.stringify({ received: true, note: s }), {
status, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
});
}
export function restHeaders(serviceKey: string, prefer = 'return=representation'): Record<string, string> {
return {
apikey: serviceKey,
Authorization: `Bearer ${serviceKey}`,
'Content-Type': 'application/json',
Prefer: prefer,
};
}
export function parseQuote(raw: string | undefined): { total: number | null; lat: number | null; lon: number | null } {
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
export function ymd(raw: string | null, fallbackIso: string | null, tz: string): string {
if (raw && /^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;
if (fallbackIso) {
const d = new Date(fallbackIso);
if (!Number.isNaN(d.getTime())) return civilYmd(fallbackIso, tz);
}
return civilYmd(new Date().toISOString(), tz);
}
export const PREFERRED_WINDOWS: Record<string, [string, string]> = {
morning: ['09:00', '12:00'],
afternoon: ['12:00', '16:00'],
evening: ['16:00', '19:00'],
};
export function windowBounds(
preferredWindow: string | null | undefined,
slotStart: string | null | undefined,
slotEnd: string | null | undefined,
tz: string,
): [string, string] {
if (slotStart) {
const start = civilClockHm(slotStart, tz);
const end = slotEnd ? civilClockHm(slotEnd, tz) : '';
if (end) return [start, end];
}
const key = String(preferredWindow || '').trim().toLowerCase();
if (key in PREFERRED_WINDOWS) return PREFERRED_WINDOWS[key];
return [civilClockHm(slotStart || null, tz), slotEnd ? civilClockHm(slotEnd, tz) : '11:00'];
}
export async function verify(rawBody: string, sig: string | null, secret: string): Promise<boolean> {
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
export async function notifyOwner(lead: {
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
const emailHtml = `<div><b>Lead #${lead.id}</b> ${lead.agent_name} ${lead.property_address} ${when} ${total}</div>`;
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
export { resolvePropertyTimezone } from './tz.ts';


