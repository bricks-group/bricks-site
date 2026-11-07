import { NextRequest, NextResponse } from 'next/server'
import { chatStatus } from '@/lib/help/assistant/config'
import { buildIndex } from '@/lib/help/assistant/corpus'
import { parseEscalation, saveEscalation } from '@/lib/help/assistant/escalate'
import { supportDb } from '@/lib/support/db'
import { resendAlerter } from '@/lib/support/alert'
import { clientKey, limited, requestIp } from '@/lib/support/rate-limit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  if (!chatStatus().enabled) return NextResponse.json({ ok: false, error: 'Email help@brxs.ca and a person will reply.' }, { status: 503 })
  if (Number(req.headers.get('content-length') || 0) > 64_000) return NextResponse.json({ ok: false, error: 'Conversation too long. Email help@brxs.ca.' }, { status: 413 })
  let body: unknown
  try { body = await req.json() } catch { return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 }) }
  const parsed = parseEscalation(body)
  if (!parsed.ok) return NextResponse.json({ ok: false, error: parsed.error }, { status: 400 })

  const db = supportDb()
  if (!db) return NextResponse.json({ ok: false, error: 'Couldn’t reach support. Email help@brxs.ca.' }, { status: 503 })
  if (await limited(db, clientKey('help-esc', requestIp(req.headers)), { windowSec: 3600, max: 5 })) {
    return NextResponse.json({ ok: false, error: 'Too many requests. Email help@brxs.ca.' }, { status: 429, headers: { 'Retry-After': '3600' } })
  }
  const saved = await saveEscalation(db, parsed.value, buildIndex().version, resendAlerter())
  if (!saved.ok) return NextResponse.json({ ok: false, error: 'Couldn’t save that. Email help@brxs.ca.' }, { status: 502 })
  return NextResponse.json({ ok: true, ref: saved.ref })
}
