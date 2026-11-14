import { NextResponse } from 'next/server'
import { clientKey, connectingIp, limited } from '@/lib/support/rate-limit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const WAITLIST_LIMIT = { windowSec: 600, max: 8 }

/** "We're not in your area yet" email capture -> Bricks API /book/coverage-waitlist. */
const OS_WAITLIST = 'https://api.brxs.ca/api/book/coverage-waitlist'
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const FAIL = 'We couldn’t save that just now. Please email help@brxs.ca.'

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
  const email = String(body.email || '').trim().slice(0, 254)
  if (!EMAIL_RE.test(email)) return NextResponse.json({ ok: false, error: 'Enter a valid email.' }, { status: 400 })
  const key = (process.env.INTERNAL_API_KEY || process.env.BRICKS_INTERNAL_API_KEY || '').trim()
  if (!key) return NextResponse.json({ ok: false, error: FAIL }, { status: 503 })
  const ip = connectingIp(req.headers)
  // R1: missing CF-Connecting-IP must not share one 'unknown' rate-limit bucket,
  // and must not be forwarded to OS as a real client IP.
  if (!ip || ip === 'unknown') {
    return NextResponse.json({ ok: false, error: 'We couldn’t confirm this request. Please try again.' }, { status: 400 })
  }
  if (await limited(null, clientKey('coverage-waitlist', ip), WAITLIST_LIMIT)) {
    return NextResponse.json({ ok: false, error: 'Please try again in a moment.' }, { status: 429 })
  }
  const flow = ['book', 'property', 'site'].includes(String(body.flow)) ? String(body.flow) : 'book'
  try {
    const res = await fetch(OS_WAITLIST, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Internal-Api-Key': key,
        // Forward the browser IP so OS can apply the same CF-Connecting-IP limit.
        'CF-Connecting-IP': ip,
      },
      body: JSON.stringify({ email, address: String(body.address || '').slice(0, 300), flow }),
    })
    const j = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string }
    if (!res.ok || !j.ok) return NextResponse.json({ ok: false, error: typeof j.error === 'string' ? j.error : FAIL }, { status: res.status >= 400 ? res.status : 502 })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false, error: FAIL }, { status: 502 })
  }
}
