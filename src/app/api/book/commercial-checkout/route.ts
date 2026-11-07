import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** Builder/developer checkout: proxy to Bricks OS, which recomputes the price
 * from its catalog (never the client total), creates the Stripe Checkout
 * Session (live catalog Prices) and, once paid, the Dispatch jobs. */
const OS_COMMERCIAL_CHECKOUT = 'https://api.brxs.ca/api/book/commercial-checkout'

const FIELDS = [
  'mode', 'service_key', 'mapped_setup', 'plan_key', 'plan_kind', 'cadence', 'site_address', 'company',
  'contact_name', 'contact_email', 'contact_phone', 'site_contact_name', 'site_contact_phone', 'access_notes',
  'min_insurance_cad', 'requires_rpas_advanced', 'preferred_date', 'dry_run', 'terms_version',
] as const

export async function POST(req: Request) {
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 })
  }
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ ok: false, error: 'Expected JSON object' }, { status: 400 })
  }
  const key = (process.env.INTERNAL_API_KEY || process.env.BRICKS_INTERNAL_API_KEY || '').trim()
  if (!key) return NextResponse.json({ ok: false, error: 'Booking is not configured' }, { status: 503 })
  const payload: Record<string, unknown> = {}
  for (const f of FIELDS) if (f in body) payload[f] = body[f]
  try {
    const res = await fetch(OS_COMMERCIAL_CHECKOUT, {
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
    return NextResponse.json({ ok: false, error: 'Checkout service unreachable' }, { status: 502 })
  }
}
