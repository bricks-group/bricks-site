import { NextResponse } from 'next/server'
import { sendCopyForSession } from '@/lib/booking-copy'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const OS_CONFIRM_PAID = 'https://api.brxs.ca/api/book/confirm-paid'

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

  const sessionId = String(body.session_id || '').trim()
  if (!sessionId.startsWith('cs_')) {
    return NextResponse.json({ ok: false, error: 'session_id (cs_…) is required' }, { status: 400 })
  }

  // Preview Workers run on Stripe test keys: check the test session here and
  // never hand it to the live booking service (no jobs from test payments).
  const sk = (process.env.STRIPE_SECRET_KEY || '').trim()
  if (process.env.PREVIEW_CONFIRM_LOCAL === '1' && sk.startsWith('sk_test_') && sessionId.startsWith('cs_test_')) {
    try {
      const r = await fetch(`https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`, {
        headers: { Authorization: `Bearer ${sk}` },
      })
      const s = (await r.json().catch(() => ({}))) as { status?: string; payment_status?: string }
      const paid = r.ok && s.status === 'complete' && s.payment_status === 'paid'
      return NextResponse.json({ ok: paid, preview: true, agent_user_id: null }, { status: paid ? 200 : 409 })
    } catch {
      return NextResponse.json({ ok: false, preview: true }, { status: 502 })
    }
  }

  try {
    const res = await fetch(OS_CONFIRM_PAID, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const j = await res.json().catch(() => ({}))
    if (res.ok && (j as { ok?: boolean }).ok) {
      // Written copy of the agreement (CPA s. 33). Best effort; never blocks the confirmation.
      try {
        await sendCopyForSession(sessionId)
      } catch {}
    }
    return NextResponse.json(j, { status: res.status })
  } catch {
    return NextResponse.json(
      { ok: false, error: 'confirm_paid_unreachable' },
      { status: 502 },
    )
  }
}
