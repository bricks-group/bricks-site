import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Self-serve change card / cancel for a /book/site monthly plan. The OS checks
// the Checkout Session is a paid plan and returns a Stripe portal link.
const OS_SITE_MANAGE = 'https://api.brxs.ca/api/book/site-manage'

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { session_id?: unknown } | null
  const sessionId = String(body?.session_id || '').trim()
  if (!/^cs_[A-Za-z0-9_]{1,200}$/.test(sessionId)) {
    return NextResponse.json({ ok: false, error: "That link isn't valid." }, { status: 400 })
  }
  const key = process.env.INTERNAL_API_KEY || process.env.BRICKS_INTERNAL_API_KEY || ''
  if (!key) return NextResponse.json({ ok: false, error: 'Billing is unavailable. Email help@brxs.ca.' }, { status: 503 })
  try {
    const res = await fetch(OS_SITE_MANAGE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Internal-Api-Key': key },
      body: JSON.stringify({ session_id: sessionId }),
      cache: 'no-store',
    })
    const j = (await res.json().catch(() => ({}))) as { url?: string; detail?: string }
    if (!res.ok || !j.url || !j.url.startsWith('https://billing.stripe.com/')) {
      return NextResponse.json({ ok: false, error: j.detail || 'Billing is unavailable. Email help@brxs.ca.' }, { status: res.ok ? 502 : res.status })
    }
    return NextResponse.json({ ok: true, url: j.url })
  } catch {
    return NextResponse.json({ ok: false, error: 'Billing is unavailable. Email help@brxs.ca.' }, { status: 502 })
  }
}
