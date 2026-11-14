import { NextResponse } from 'next/server'
import { UNAVAILABLE_CODE, UNAVAILABLE_MESSAGE } from '@/lib/booking-coverage'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** Booking coverage check (Kam 2026-11-14). Proxies the Bricks API; fails closed (503). */
const OS_COVERAGE = 'https://api.brxs.ca/api/book/www-coverage'

const unavailable = () =>
  NextResponse.json({ ok: false, code: UNAVAILABLE_CODE, error: UNAVAILABLE_MESSAGE }, { status: 503 })

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
  const address = String(body.address || '').trim().slice(0, 300)
  if (!address) return NextResponse.json({ ok: false, code: 'address_not_found', error: 'Enter the property address.' }, { status: 400 })
  const key = (process.env.INTERNAL_API_KEY || process.env.BRICKS_INTERNAL_API_KEY || '').trim()
  if (!key) return unavailable()
  try {
    const res = await fetch(OS_COVERAGE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Internal-Api-Key': key },
      // Address only: OS geocodes server-side. Never forward client lat/lon.
      body: JSON.stringify({ address }),
    })
    const j = (await res.json().catch(() => null)) as Record<string, unknown> | null
    if (!j) return unavailable()
    if (res.ok && j.ok === true && typeof j.covered === 'boolean') {
      return NextResponse.json({ ok: true, covered: j.covered, code: j.code, ...(j.covered ? {} : { message: j.message }) })
    }
    if (res.status === 422 || res.status === 400) {
      return NextResponse.json({ ok: false, code: 'address_not_found', error: typeof j.error === 'string' ? j.error : 'We couldn’t find that address.' }, { status: 422 })
    }
    return unavailable()
  } catch {
    return unavailable()
  }
}
