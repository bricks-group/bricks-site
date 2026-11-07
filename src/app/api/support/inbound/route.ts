import { NextRequest, NextResponse } from 'next/server'
import { supportDb } from '@/lib/support/db'
import { flags, processEvent, resendFetcher, resendSender, verifySignature, type WebhookEvent } from '@/lib/support/inbound'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Resend Receiving webhook for help@brxs.ca. Kill switch: SUPPORT_INBOUND_ENABLED.
 * Signature: RESEND_INBOUND_WEBHOOK_SECRET (Svix). Shadow mode by default; auto-send
 * needs SUPPORT_AUTOSEND_ENABLED=true and SUPPORT_SHADOW_MODE=false; only verified routine answers are sent.
 */
export async function POST(req: NextRequest) {
  const f = flags()
  if (!f.enabled) return NextResponse.json({ ok: false, error: 'inbound disabled' }, { status: 503 })
  const secret = (process.env.RESEND_INBOUND_WEBHOOK_SECRET || '').trim()
  if (!secret) return NextResponse.json({ ok: false, error: 'not configured' }, { status: 503 })
  const body = await req.text()
  if (body.length > 256_000) return NextResponse.json({ ok: false }, { status: 413 })
  const h = { id: req.headers.get('svix-id'), timestamp: req.headers.get('svix-timestamp'), signature: req.headers.get('svix-signature') }
  if (!verifySignature(secret, h, body)) return NextResponse.json({ ok: false, error: 'bad signature' }, { status: 401 })
  let ev: WebhookEvent
  try { ev = JSON.parse(body) } catch { return NextResponse.json({ ok: false }, { status: 400 }) }
  const db = supportDb()
  if (!db) return NextResponse.json({ ok: false, error: 'db unavailable' }, { status: 503 })
  // Sending happens only when SUPPORT_AUTOSEND_ENABLED=true AND SUPPORT_SHADOW_MODE=false, for verified routine answers.
  const out = await processEvent(h.id!, ev, { db, fetchEmail: resendFetcher(), flags: f, send: f.autosend && !f.shadow ? resendSender() : undefined })
  return NextResponse.json({ ok: out.http < 300, status: out.status }, { status: out.http })
}

export async function GET() {
  const f = flags()
  return NextResponse.json({ enabled: f.enabled, shadow: f.shadow, autosend: f.autosend && !f.shadow, configured: Boolean((process.env.RESEND_INBOUND_WEBHOOK_SECRET || '').trim()), fetchConfigured: Boolean((process.env.RESEND_INBOUND_API_KEY || '').trim()) })
}
