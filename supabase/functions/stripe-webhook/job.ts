import { KAM_VENDOR_ID, ORG_VENDOR_ID, floorplanPurchased, minTierOf, packageIdOf, pickAssignee, restHeaders, tourPurchased, windowBounds } from './helpers.ts';

async function memberName(supabaseUrl: string, serviceKey: string, memberId: string): Promise<string> {
  if (!memberId) return '';
  if (memberId === KAM_VENDOR_ID) return 'Ajani Kamali Akio';
  try {
    const url = `${supabaseUrl}/rest/v1/vendor_members?id=eq.${encodeURIComponent(memberId)}&select=name&limit=1`;
    const res = await fetch(url, { headers: restHeaders(serviceKey) });
    if (!res.ok) return '';
    const rows = await res.json();
    return String(rows?.[0]?.name || '').trim();
  } catch {
    return '';
  }
}

async function jobNotifyFields(
  supabaseUrl: string,
  serviceKey: string,
  jobId: string | null,
  fallbackPkg: string,
): Promise<{ jobId: string | null; created: boolean; package_name?: string; vendor_name?: string; assignee_id?: string }> {
  if (!jobId) return { jobId: null, created: false, package_name: fallbackPkg };
  try {
    const url = `${supabaseUrl}/rest/v1/jobs?id=eq.${encodeURIComponent(jobId)}&select=id,assignee_id,vendor_name,package_name&limit=1`;
    const res = await fetch(url, { headers: restHeaders(serviceKey) });
    if (!res.ok) return { jobId, created: true, package_name: fallbackPkg };
    const rows = await res.json();
    const row = rows?.[0] || {};
    let vendor = String(row.vendor_name || '').trim();
    const assignee = String(row.assignee_id || '').trim();
    if (!vendor && assignee) vendor = await memberName(supabaseUrl, serviceKey, assignee);
    return {
      jobId,
      created: true,
      package_name: String(row.package_name || fallbackPkg || '').trim(),
      vendor_name: vendor,
      assignee_id: assignee || undefined,
    };
  } catch {
    return { jobId, created: true, package_name: fallbackPkg };
  }
}

export async function fetchLeadBySession(supabaseUrl: string, serviceKey: string, sessionId: string): Promise<string | null> {
const url = `${supabaseUrl}/rest/v1/media_booking_leads?stripe_session_id=eq.${encodeURIComponent(sessionId)}&select=id&limit=1`;
const res = await fetch(url, { headers: restHeaders(serviceKey, 'return=representation') });
if (!res.ok) return null;
const rows = await res.json();
return rows?.[0]?.id || null;
}
export async function ensureDispatchJob(opts: {
supabaseUrl: string;
serviceKey: string;
leadId: string;
sessionId: string;
m: Record<string, string>;
quote: { total: number | null; lat: number | null; lon: number | null };
preferredDate: string;
timezone: string;
province: string | null;
}): Promise<{ jobId: string | null; created: boolean; error?: string; package_name?: string; vendor_name?: string; assignee_id?: string }> {
const existingUrl = `${opts.supabaseUrl}/rest/v1/jobs?booking_id=eq.${encodeURIComponent(opts.leadId)}&select=id&limit=1`;
const existingRes = await fetch(existingUrl, { headers: restHeaders(opts.serviceKey, 'return=representation') });
if (existingRes.ok) {
const rows = await existingRes.json();
if (rows?.[0]?.id) {
  const pkgName = String(opts.m.package_interest || opts.m.package_id || '').trim();
  const fields = await jobNotifyFields(opts.supabaseUrl, opts.serviceKey, rows[0].id, pkgName);
  return { ...fields, created: false };
}
}
const pkg = packageIdOf(opts.m.package_id);
if (!pkg) {
return { jobId: null, created: false, error: 'dispatch held: package_id is not a sold package' };
}
const now = new Date().toISOString();
const rush = opts.m.rush_addon === 'true';
const drone = opts.m.drone_addon === 'true';
const tour = tourPurchased(opts.m, pkg);
const floorplan = floorplanPurchased(opts.m, pkg);
const floorPlanOnly = pkg === 'floor_plan_only' || opts.m.floor_plan_only === 'true';
const visitOn = opts.m.visit_addon === 'true';
const stagingOn = opts.m.staging_addon === 'true';
const stagingImages = stagingOn ? Math.max(1, parseInt(String(opts.m.staging_images || '1'), 10) || 1) : 0;
const addOns = [
drone && !floorPlanOnly ? { key: 'drone', included: true } : null,
opts.m.reel_addon === 'true' ? { key: 'reel', included: true } : null,
tour ? { key: 'tour', included: true } : null,
opts.m.twilight_addon === 'true' ? { key: 'twilight', included: true } : null,
rush ? { key: 'rush', included: true } : null,
visitOn ? { key: 'visit', included: true, sqft_tier: String(opts.m.visit_sqft_tier || '') } : null,
stagingOn ? { key: 'staging', included: true, images: stagingImages } : null,
floorplan ? { key: floorPlanOnly ? 'floor_plan_only' : 'floorplan_2d', included: true } : null,
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
job_type: floorPlanOnly ? 'floor_plan_only' : (drone ? 'drone' : 'photo'),
status: 'unassigned',
priority: rush ? 'rush' : 'normal',
property_details: `${opts.m.property_type || 'listing'} · paid www.brxs.ca/book · lead ${opts.leadId} · stripe ${opts.sessionId} · tz ${opts.timezone}`,
client_instructions: opts.m.notes || '',
checklist: [],
assignee_id: String(opts.m.assignee_id || '').trim(),
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
vendor_name: '',
vendor_tier: minTier,
min_tier_required: minTier,
preferred_tier: minTier,
vendor_payout: null,
platform_margin: null,
is_rush: rush,
ai_flags: [],
selected_slot_start: opts.m.selected_slot_start || null,
selected_slot_end: opts.m.selected_slot_end || null,
preferred_window: opts.m.preferred_window || null,
};
let assignee = '';
const dispatchUrl = (Deno.env.get('DISPATCH_API_URL') || 'https://dispatch-api.brxs.ca').replace(/\/$/, '');
let internalKey = (Deno.env.get('INTERNAL_API_KEY') || (Deno.env.get('INTERNAL_API_KEYS') || '').split(',')[0] || '').trim();
if (!internalKey) {
  try {
    const sr = await fetch(`${opts.supabaseUrl}/rest/v1/app_secrets?key=eq.INTERNAL_API_KEY&select=value&limit=1`, {
      headers: { apikey: opts.serviceKey, Authorization: `Bearer ${opts.serviceKey}` },
    });
    if (sr.ok) {
      const rows = await sr.json();
      internalKey = String(rows?.[0]?.value || '').trim();
    }
  } catch {}
}
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
assignee_id: String(opts.m.assignee_id || job.assignee_id || '').trim(),
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
selected_slot_start: opts.m.selected_slot_start || null,
selected_slot_end: opts.m.selected_slot_end || null,
preferred_window: opts.m.preferred_window || null,
}),
});
if (intake.ok) {
const body = await intake.json();
const jid = body.job_id || body.id || null;
const pkgName = String(job.package_name || opts.m.package_interest || '').trim();
const fields = await jobNotifyFields(opts.supabaseUrl, opts.serviceKey, jid, pkgName);
let vendor = fields.vendor_name || '';
if (!vendor && (body.assignee_id || body.assigneeId)) {
  vendor = await memberName(opts.supabaseUrl, opts.serviceKey, String(body.assignee_id || body.assigneeId));
}
return { ...fields, vendor_name: vendor || fields.vendor_name, created: true };
}
console.error('dispatch intake failed: ' + (await intake.text()).slice(0, 300));
} catch (e) {
console.error('dispatch intake error: ' + String(e));
}
}
assignee = String(opts.m.assignee_id || job.assignee_id || '').trim();
if (!assignee) {
assignee = await pickAssignee(opts.supabaseUrl, opts.serviceKey, job);
}
let vendorName = '';
if (assignee) {
job.assignee_id = assignee;
job.status = 'assigned';
vendorName = await memberName(opts.supabaseUrl, opts.serviceKey, assignee);
job.vendor_name = vendorName;
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
return { jobId: null, created: false, error: errText.slice(0, 200), package_name: String(job.package_name || '') };
}
const rows = await res.json();
return {
  jobId: rows?.[0]?.id || job.id,
  created: true,
  package_name: String(rows?.[0]?.package_name || job.package_name || ''),
  vendor_name: String(rows?.[0]?.vendor_name || vendorName || ''),
  assignee_id: String(rows?.[0]?.assignee_id || assignee || '') || undefined,
};
}


