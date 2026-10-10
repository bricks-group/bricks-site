import { NextResponse } from 'next/server'

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

  try {
    const res = await fetch(OS_CONFIRM_PAID, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const j = await res.json().catch(() => ({}))
    return NextResponse.json(j, { status: res.status })
  } catch {
    return NextResponse.json(
      { ok: false, error: 'confirm_paid_unreachable' },
      { status: 502 },
    )
  }
}
