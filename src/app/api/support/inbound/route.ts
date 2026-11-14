import { NextRequest, NextResponse } from 'next/server'
import { resendAlerter } from '@/lib/support/alert'
import { flags, handleInboundRequest, osInboundSaver, resendFetcher, resendSender } from '@/lib/support/inbound'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Resend Receiving webhook for help@brxs.ca. Kill switch: SUPPORT_INBOUND_ENABLED.
 * Signature is verified on the raw body before the event is parsed. The parsed
 * message is POSTed to api.brxs.ca (direct Postgres), not Supabase REST.
 */
export async function POST(req: NextRequest) {
  const f = flags()
  if (!f.enabled) return NextResponse.json({ ok: false, error: 'inbound disabled' }, { status: 503 })
  const secret = (process.env.RESEND_INBOUND_WEBHOOK_SECRET || '').trim()
  if (!secret) return NextResponse.json({ ok: false, error: 'not configured' }, { status: 503 })
  const body = await req.text()
  if (body.length > 256_000) return NextResponse.json({ ok: false }, { status: 413 })
  const h = { id: req.headers.get('svix-id'), timestamp: req.headers.get('svix-timestamp'), signature: req.headers.get('svix-signature') }
  const out = await handleInboundRequest({
    secret, headers: h, body,
    deps: {
      saveInbound: osInboundSaver(),
      fetchEmail: resendFetcher(),
      flags: f,
      send: f.autosend && !f.shadow ? resendSender() : undefined,
      alert: resendAlerter(),
    },
  })
  return NextResponse.json(out.body, { status: out.http })
}

export async function GET() {
  const f = flags()
  return NextResponse.json({ enabled: f.enabled, shadow: f.shadow, autosend: f.autosend && !f.shadow, configured: Boolean((process.env.RESEND_INBOUND_WEBHOOK_SECRET || '').trim()), fetchConfigured: Boolean((process.env.RESEND_INBOUND_API_KEY || '').trim()) })
}
