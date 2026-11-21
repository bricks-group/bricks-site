import { NextResponse } from 'next/server'
import { sendCopyForSession } from '@/lib/booking-copy'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** Emails the client their written copy of the agreement after payment. Safe to call twice. */
export async function POST(req: Request) {
  let sessionId = ''
  try { sessionId = String((await req.json())?.session_id || '').trim() } catch {}
  if (!sessionId.startsWith('cs_')) return NextResponse.json({ ok: false, error: 'session_id (cs_…) is required' }, { status: 400 })
  const out = await sendCopyForSession(sessionId)
  return NextResponse.json({ ok: out.ok, error: out.error, already_sent: out.already_sent }, { status: out.status })
}
