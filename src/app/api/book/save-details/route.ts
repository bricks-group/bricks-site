import { NextResponse } from 'next/server'
import { detailsFromPaidSession, type PaidSession } from '@/lib/save-details'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * After paying as a guest: email a one-time sign-in link that creates the
 * Bricks account with the details already given at booking. No password.
 * Uses the auth gateway's existing email-link sign-in (create_user), so the
 * gateway itself is unchanged. Input is only the paid session id.
 */
const AUTH_URL = () => (process.env.AUTH_GATEWAY_URL || 'https://db.brxs.ca').replace(/\/$/, '')
const APP_CALLBACK = 'https://app.brxs.ca/auth/callback'

export async function POST(req: Request) {
  let body: Record<string, unknown> = {}
  try { body = await req.json() } catch { /* empty */ }
  const sessionId = String(body.session_id || '').trim()
  if (!/^cs_(test|live)_[A-Za-z0-9]{10,200}$/.test(sessionId)) {
    return NextResponse.json({ ok: false, error: 'session_id is required' }, { status: 400 })
  }
  const sk = (process.env.STRIPE_SECRET_KEY || '').trim()
  if (!sk) return NextResponse.json({ ok: false, error: 'unavailable' }, { status: 503 })
  if (sk.startsWith('sk_test_') !== sessionId.startsWith('cs_test_')) {
    return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 })
  }

  let s: PaidSession
  try {
    const r = await fetch(`https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`, {
      headers: { Authorization: `Bearer ${sk}` },
    })
    if (!r.ok) return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 })
    s = (await r.json()) as PaidSession
  } catch {
    return NextResponse.json({ ok: false, error: 'unavailable' }, { status: 502 })
  }
  const d = detailsFromPaidSession(s, Math.floor(Date.now() / 1000))
  if ('error' in d) return NextResponse.json({ ok: false, error: d.error }, { status: 409 })

  // Test-key deployments (previews) never create real accounts or send email.
  const dryRun = process.env.SAVE_DETAILS_DRY_RUN === '1' || sk.startsWith('sk_test_')
  if (dryRun) return NextResponse.json({ ok: true, dry_run: true, email_hint: hint(d.email) })

  const anon = (process.env.AUTH_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '').trim()
  if (!anon) return NextResponse.json({ ok: false, error: 'unavailable' }, { status: 503 })
  try {
    const r = await fetch(`${AUTH_URL()}/auth/v1/otp?redirect_to=${encodeURIComponent(APP_CALLBACK)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: anon },
      body: JSON.stringify({ email: d.email, create_user: true, data: d.data, redirect_to: APP_CALLBACK }),
    })
    if (r.status === 429) return NextResponse.json({ ok: false, error: 'rate_limited' }, { status: 429 })
    if (!r.ok) return NextResponse.json({ ok: false, error: 'unavailable' }, { status: 502 })
    return NextResponse.json({ ok: true, email_hint: hint(d.email) })
  } catch {
    return NextResponse.json({ ok: false, error: 'unavailable' }, { status: 502 })
  }
}

/** j•••@example.com: enough to recognise, not a lookup. */
function hint(email: string): string {
  const [u, dom] = email.split('@')
  return `${u.slice(0, 1)}•••@${dom}`
}
