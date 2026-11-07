import { NextRequest, NextResponse } from 'next/server'
import { respond } from '@/lib/help/assistant/answer'
import { buildIndex } from '@/lib/help/assistant/corpus'
import { chatStatus, gatewayModel } from '@/lib/help/assistant/config'
import { supportDb } from '@/lib/support/db'
import { clientKey, limited, requestIp } from '@/lib/support/rate-limit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const MINUTE = { windowSec: 60, max: 8 }
const DAY = { windowSec: 86_400, max: 80 }

export async function GET() {
  const s = chatStatus()
  const i = buildIndex()
  return NextResponse.json({ enabled: s.enabled, ...(s.enabled ? { mode: s.mode } : { reason: s.reason }), index: { version: i.version, articles: i.articleCount, chunks: i.chunks.length, helpUpdated: i.helpUpdated } })
}

export async function POST(req: NextRequest) {
  const s = chatStatus()
  if (!s.enabled) return NextResponse.json({ ok: false, error: 'The help assistant is off right now. Search the help centre or email help@brxs.ca.' }, { status: 503 })
  const len = Number(req.headers.get('content-length') || 0)
  if (len > 16_000) return NextResponse.json({ ok: false, error: 'Message too long.' }, { status: 413 })
  let body: { question?: unknown }
  try { body = await req.json() } catch { return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 }) }

  const db = supportDb()
  const ip = requestIp(req.headers)
  if (await limited(db, clientKey('help-chat-m', ip), MINUTE) || await limited(db, clientKey('help-chat-d', ip), DAY)) {
    return NextResponse.json({ ok: false, error: 'Too many questions in a short time. Try again in a minute, or email help@brxs.ca.' }, { status: 429, headers: { 'Retry-After': '60' } })
  }
  const reply = await respond(body.question, { model: s.mode === 'model' ? gatewayModel() : null })
  return NextResponse.json({ ok: true, reply })
}
