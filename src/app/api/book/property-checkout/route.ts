// Property-manager checkout is deliberately exempt from agent brokerage validation.
// Keep this separate from /api/create-checkout; this is not a listing-agent booking.
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** /book/property checkout: proxy to Bricks, which validates the booking,
 * prices it from its own catalog (never the client's total), adds HST,
 * creates the Stripe Checkout Session and, once paid, the Dispatch job. */
const OS_PROPERTY_CHECKOUT = 'https://api.brxs.ca/api/book/property-checkout'

const FIELDS = [
  'for', 'service_key', 'street', 'unit', 'city', 'sqft', 'move_kind', 'move_date', 'preferred_date',
  'contact_name', 'contact_email', 'contact_phone', 'site_contact_name', 'site_contact_phone', 'access_notes', 'company', 'dry_run',
] as const

export async function POST(req: Request) {
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 })
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return NextResponse.json({ ok: false, error: 'Expected JSON object' }, { status: 400 })
  }
  const key = (process.env.INTERNAL_API_KEY || process.env.BRICKS_INTERNAL_API_KEY || '').trim()
  if (!key) return NextResponse.json({ ok: false, error: 'Booking is not configured. Email help@brxs.ca.' }, { status: 503 })
  const payload: Record<string, unknown> = {}
  for (const f of FIELDS) if (f in body) payload[f] = body[f]
  try {
    const res = await fetch(OS_PROPERTY_CHECKOUT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Internal-Api-Key': key },
      body: JSON.stringify(payload),
    })
    const j = (await res.json().catch(() => ({}))) as Record<string, unknown>
    if (!res.ok) {
      const detail = typeof j.detail === 'string' ? j.detail : 'Checkout failed'
      return NextResponse.json({ ok: false, error: detail }, { status: res.status })
    }
    return NextResponse.json(j)
  } catch {
    return NextResponse.json({ ok: false, error: 'Checkout is unreachable right now. Email help@brxs.ca.' }, { status: 502 })
  }
}
