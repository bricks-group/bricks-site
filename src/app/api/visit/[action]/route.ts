import { NextResponse } from 'next/server'
import { fetchVisitState, planVisitsApi, validToken } from '@/lib/plan-visit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const NO_STORE = { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' }

// Same-origin proxy for the plan visit one-tap page (token in the body, not the path).
export async function POST(req: Request, ctx: { params: Promise<{ action: string }> }) {
  const { action } = await ctx.params
  let body: { token?: unknown; date?: unknown } = {}
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, message: 'Invalid request' }, { status: 400, headers: NO_STORE })
  }
  const token = body?.token
  if (!validToken(token)) return NextResponse.json({ ok: false, state: 'expired' }, { status: 404, headers: NO_STORE })

  if (action === 'state') return NextResponse.json(await fetchVisitState(token), { headers: NO_STORE })
  if (action !== 'confirm' && action !== 'decline') {
    return NextResponse.json({ ok: false }, { status: 404, headers: NO_STORE })
  }
  const date = typeof body.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(body.date) ? body.date : undefined
  try {
    const r = await fetch(`${planVisitsApi()}/api/public/plan-visits/${encodeURIComponent(token)}/${action}`, {
      method: 'POST',
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(date ? { date } : {}),
    })
    const j = await r.json().catch(() => ({ ok: false }))
    return NextResponse.json(j, { status: r.status === 404 ? 404 : 200, headers: NO_STORE })
  } catch {
    return NextResponse.json({ ok: false, message: "We couldn't reach Bricks. Try again in a moment." }, { status: 502, headers: NO_STORE })
  }
}
