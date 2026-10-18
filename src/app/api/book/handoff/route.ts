import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Redeem a Book media handoff from Bricks (`/book?h=<token>`).
 * The token is ids-only, HMAC-signed and expires 30 minutes after Bricks mints
 * it; Bricks OS verifies it, re-checks the agent's access to the listing and
 * answers with the address, property details and the agent's own contact.
 * Server-side so the app API never needs a CORS rule for www previews.
 */
const OS_API = (process.env.BRICKS_OS_API_URL || 'https://api.brxs.ca').replace(/\/$/, '')
const TOKEN = /^[A-Za-z0-9_\-]{16,560}\.[a-f0-9]{32}$/

export async function GET(req: NextRequest) {
  const t = req.nextUrl.searchParams.get('t') || ''
  const headers = { 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer' }
  if (!TOKEN.test(t)) return NextResponse.json({ ok: false, error: 'invalid' }, { status: 400, headers })
  try {
    const r = await fetch(`${OS_API}/api/book/handoff/${encodeURIComponent(t)}`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(12000),
    })
    if (!r.ok) return NextResponse.json({ ok: false, error: r.status === 410 ? 'expired' : 'unavailable' }, { status: r.status === 410 ? 410 : 502, headers })
    const j = await r.json()
    return NextResponse.json({ ok: true, handoff: j }, { headers })
  } catch {
    return NextResponse.json({ ok: false, error: 'unavailable' }, { status: 502, headers })
  }
}
