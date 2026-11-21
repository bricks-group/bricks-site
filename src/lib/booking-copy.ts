/**
 * Written copy of the booking agreement (Ontario Consumer Protection Act, 2002;
 * O. Reg. 17/05 s. 32-33), emailed after payment so the client has something to
 * keep and print. Also meets CRA invoice details: trading name, date, total,
 * GST/HST number and tax amount.
 *
 * Built from Stripe Checkout Session metadata written by /api/create-checkout.
 * Pure functions here; the route does the Stripe read and the Resend send.
 */
import { packageLines } from '@/lib/quote-lines'
import { SUPPLIER } from '@/lib/supplier'

type Meta = Record<string, string | undefined>
export type CopySession = { id: string; created?: number; amount_total?: number | null; currency?: string | null; payment_status?: string; metadata?: Meta | null }

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string)
const money = (cents: number) => `$${(cents / 100).toFixed(2)}`

type LineQuote = {
  floor_plan_only?: boolean; floor_plan_only_rate?: number; base_rate?: number; photo_rate: number; drone_rate: number
  drone_included?: boolean; floor_plan_included?: boolean; travel_fee?: number; addons?: { label: string; amount: number }[]
}

/** Compact itemization stored in metadata (Stripe caps a value at 500 chars). Empty when it would not fit. */
export function quoteLinesForCopy(q: LineQuote): string {
  const lines: [string, number][] = []
  for (const l of packageLines(q as never, 99)) if (l.amount > 0) lines.push([l.label, l.amount])
  if ((q.travel_fee ?? 0) > 0) lines.push(['Travel', q.travel_fee as number])
  for (const a of q.addons || []) lines.push([a.label, a.amount])
  const json = JSON.stringify(lines)
  return json.length <= 500 ? json : ''
}

function parseLines(raw?: string): [string, number][] {
  try {
    const v = JSON.parse(raw || '[]')
    return Array.isArray(v) ? v.filter((x) => Array.isArray(x) && typeof x[0] === 'string' && typeof x[1] === 'number') : []
  } catch { return [] }
}

function when(meta: Meta): string {
  const iso = meta.selected_slot_start || ''
  const tz = meta.timezone || 'America/Toronto'
  const d = new Date(iso)
  if (!iso || Number.isNaN(d.getTime())) return meta.preferred_date || 'To be confirmed'
  return d.toLocaleString('en-CA', { timeZone: tz, dateStyle: 'full', timeStyle: 'short' }) + ` (${tz.replace('_', ' ')})`
}

export type BookingCopy = { subject: string; html: string; text: string; to: string } | null

export function buildBookingCopy(session: CopySession): BookingCopy {
  const m = session.metadata || {}
  const to = (m.email || '').trim()
  if (!to || session.payment_status !== 'paid') return null
  const total = session.amount_total ?? Number(m.total_cents || 0)
  const tax = Number(m.tax_cents || 0)
  const sub = Number(m.subtotal_cents || 0) || Math.max(0, total - tax)
  const lines = parseLines(m.quote_lines)
  const agreed = (m.terms_accepted_at || '').slice(0, 10) || (session.created ? new Date(session.created * 1000).toISOString().slice(0, 10) : '')
  const taxLabel = `${m.tax_type || 'HST'}${m.tax_rate ? ` (${Math.round(Number(m.tax_rate) * 1000) / 10}%)` : ''}`
  const name = m.agent_name || 'there'
  const rows: [string, string][] = [
    ['Client', `${name}${m.brokerage ? `, ${m.brokerage}` : ''} · ${to}`],
    ['Agreement date', agreed],
    ['Property', m.property_address || ''],
    ['Services', m.package_interest || 'Listing media'],
    ['Shoot time', when(m)],
    ['Reference', `${session.id} · quote ${m.quote_id || 'n/a'}`],
  ]
  const priceRows: [string, string][] = [
    ...lines.map(([l, a]) => [l, `$${a.toFixed(2)}`] as [string, string]),
    ['Subtotal', money(sub)],
    [`${taxLabel} on this order`, money(tax)],
    ['Total paid (CAD)', money(total)],
  ]
  const terms = [
    ['Payment', 'Paid in full by card through Stripe. No other charges.'],
    ['Delivery', 'Photos typically within 24 hours of the shoot, other media within 24–48 hours. Targets, not guarantees.'],
    ['Cancel', '24 hours or more before the start of your shoot window: full refund to your original payment method. Less than 24 hours before, or a no-show or no access: no refund. No callout fee. If we cancel or cannot finish for reasons on our side: full refund or a free reshoot, your choice.'],
    ['Weather and safety', 'If weather or safety stops part of your package (for example the drone, or twilight), we deliver the rest and refund that part: its add-on price for your property size plus the tax you paid on it.'],
    ['Change something', `Email ${SUPPLIER.email} or call ${SUPPLIER.phone}.`],
    ['Terms', `Terms version ${m.terms_version || ''} at https://www.brxs.ca/terms and Privacy Policy at https://www.brxs.ca/privacy. Keep this email as your copy of the agreement.`],
  ]
  const supplier = `${SUPPLIER.legalPartyLine} · ${SUPPLIER.address} · ${SUPPLIER.phone} · ${SUPPLIER.email} · GST/HST ${SUPPLIER.gstHst}`
  const td = 'padding:6px 0;vertical-align:top;font-size:14px;line-height:1.5'
  const tbl = (r: [string, string][]) => `<table style="border-collapse:collapse;width:100%">${r.map(([k, v]) => `<tr><td style="${td};color:#8A8178;width:38%">${esc(k)}</td><td style="${td}">${esc(v)}</td></tr>`).join('')}</table>`
  const html = `<!doctype html><html><body style="margin:0;background:#F6F3EE"><div style="max-width:560px;margin:0 auto;padding:32px 24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#14110E">`
    + `<div style="font-size:18px;font-weight:600;margin-bottom:20px">bricks</div>`
    + `<h1 style="font-size:20px;font-weight:500;margin:0 0 8px">Your booking agreement and receipt</h1>`
    + `<p style="margin:0 0 20px;font-size:14px;line-height:1.5;color:#4A443E">Hi ${esc(name)}, thanks for booking. Keep this email: it is your written copy of the agreement.</p>`
    + `<h2 style="font-size:14px;margin:20px 0 6px">Booking</h2>${tbl(rows)}`
    + `<h2 style="font-size:14px;margin:20px 0 6px">Price</h2>${tbl(priceRows)}`
    + `<h2 style="font-size:14px;margin:20px 0 6px">Terms in short</h2>${tbl(terms as [string, string][])}`
    + `<p style="margin:28px 0 0;padding-top:16px;border-top:1px solid #E4DED6;font-size:12px;line-height:1.6;color:#8A8178">Supplier: ${esc(supplier)}</p>`
    + `</div></body></html>`
  const text = [
    'Your booking agreement and receipt', '', `Hi ${name}, keep this email: it is your written copy of the agreement.`, '',
    ...rows.map(([k, v]) => `${k}: ${v}`), '',
    ...priceRows.map(([k, v]) => `${k}: ${v}`), '',
    ...terms.map(([k, v]) => `${k}: ${v}`), '', `Supplier: ${supplier}`,
  ].join('\n')
  return { subject: `Your Bricks booking agreement and receipt — ${m.property_address || 'listing media'}`, html, text, to }
}

type Env = Record<string, string | undefined>

/** Send via Resend. BOOKING_COPY_TO_OVERRIDE redirects every send (previews use delivered@resend.dev).
 *  The Idempotency-Key makes Resend drop any repeat of the same session's copy for 24 hours. */
export async function sendBookingCopy(copy: NonNullable<BookingCopy>, env: Env = process.env, f: typeof fetch = fetch, idempotencyKey?: string): Promise<{ ok: boolean; to: string }> {
  const key = (env.RESEND_API_KEY || '').trim()
  const to = (env.BOOKING_COPY_TO_OVERRIDE || '').trim() || copy.to
  if (!key) return { ok: false, to }
  const headers: Record<string, string> = { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' }
  if (idempotencyKey) headers['Idempotency-Key'] = idempotencyKey
  const r = await f('https://api.resend.com/emails', {
    method: 'POST',
    headers,
    body: JSON.stringify({ from: `Bricks <hello@brxs.ca>`, to: [to], reply_to: [SUPPLIER.email], subject: copy.subject, html: copy.html, text: copy.text }),
  })
  return { ok: r.ok, to }
}

const CLAIM_TTL_MS = 10 * 60 * 1000

/** Reads the paid Stripe session, sends the copy once, marks it sent. Called only from /api/confirm-paid (server side).
 *  Double-send protection: (1) a claim token written to Stripe metadata and re-read, (2) a Resend Idempotency-Key per session,
 *  (3) the sent mark is checked: a failed write is reported, never swallowed. */
export async function sendCopyForSession(sessionId: string, env: Env = process.env, f: typeof fetch = fetch): Promise<{ ok: boolean; status: number; error?: string; already_sent?: boolean }> {
  const key = (env.STRIPE_SECRET_KEY || '').trim()
  if (!key) return { ok: false, status: 503, error: 'not_configured' }
  const auth = { Authorization: `Bearer ${key}` }
  const url = `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`
  const form = { ...auth, 'Content-Type': 'application/x-www-form-urlencoded' }
  const read = async () => { const r = await f(url, { headers: auth }); return r.ok ? ((await r.json()) as CopySession) : null }
  const session = await read()
  if (!session) return { ok: false, status: 404, error: 'session_not_found' }
  if (session.metadata?.copy_sent_at) return { ok: true, status: 200, already_sent: true }
  const copy = buildBookingCopy(session)
  if (!copy) return { ok: false, status: 409, error: 'not_paid_or_no_email' }
  // Claim: another caller holding a fresh claim means a send is in flight.
  const prior = String(session.metadata?.copy_claim || '')
  const priorAt = Number(prior.split('.')[1] || 0)
  if (prior && Date.now() - priorAt < CLAIM_TTL_MS) return { ok: true, status: 200, already_sent: true }
  const token = `${Math.random().toString(36).slice(2, 10)}.${Date.now()}`
  const claimRes = await f(url, { method: 'POST', headers: form, body: new URLSearchParams({ 'metadata[copy_claim]': token }).toString() })
  if (!claimRes.ok) return { ok: false, status: 502, error: 'claim_failed' }
  const again = await read()
  if (!again || again.metadata?.copy_claim !== token) return { ok: true, status: 200, already_sent: true }
  if (again.metadata?.copy_sent_at) return { ok: true, status: 200, already_sent: true }
  const sent = await sendBookingCopy(copy, env, f, `booking-copy-${sessionId}`)
  if (!sent.ok) return { ok: false, status: 502, error: 'send_failed' }
  const mark = await f(url, { method: 'POST', headers: form, body: new URLSearchParams({ 'metadata[copy_sent_at]': new Date().toISOString() }).toString() })
  if (!mark.ok) return { ok: false, status: 502, error: 'mark_failed' }
  return { ok: true, status: 200 }
}
