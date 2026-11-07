import { NextRequest, NextResponse } from 'next/server'
import { timingSafeEqual } from 'crypto'
import {
  clampInviteDays,
  mintDemoInvite,
} from '@/lib/demo-invite'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const GATE_COOKIE = 'bricks_www_gate'

function json(data: Record<string, unknown>, status = 200) {
  return NextResponse.json(data, { status })
}

function inviteAuthSecret(): string {
  const a = (process.env.DEMO_INVITE_SECRET || '').trim()
  if (a) return a
  return (process.env.WWW_SITE_GATE_PASSWORD || '').trim()
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a, 'utf8')
  const bb = Buffer.from(b, 'utf8')
  if (ab.length !== bb.length) {
    timingSafeEqual(ab, ab)
    return false
  }
  return timingSafeEqual(ab, bb)
}

function authorized(req: NextRequest): boolean {
  if (req.cookies.get(GATE_COOKIE)?.value === '1') return true
  const auth = req.headers.get('authorization') || ''
  const m = /^Bearer\s+(.+)$/i.exec(auth)
  if (!m) return false
  const secret = inviteAuthSecret()
  if (!secret) return false
  return safeEqual(m[1].trim(), secret)
}

function siteOrigin(req: NextRequest): string {
  const explicit = (process.env.NEXT_PUBLIC_SITE_URL || '').trim().replace(/\/$/, '')
  if (explicit) return explicit
  const host = req.headers.get('x-forwarded-host') || req.headers.get('host') || ''
  const proto = req.headers.get('x-forwarded-proto') || 'https'
  if (host) {
    const h = host.split(',')[0].trim()
    if (h.includes('brxs.ca') || h.includes('vercel.app') || h.includes('localhost')) {
      // Prefer canonical www in production.
      if (h === 'brxs.ca' || h === 'www.brxs.ca') return 'https://www.brxs.ca'
      return `${proto === 'http' ? 'http' : 'https'}://${h}`
    }
  }
  const vercel = (process.env.VERCEL_URL || '').trim().replace(/\/$/, '')
  if (vercel) {
    if (vercel.includes('brxs.ca')) return 'https://www.brxs.ca'
    return `https://${vercel}`
  }
  if (process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production') {
    return 'https://www.brxs.ca'
  }
  return 'https://www.brxs.ca'
}

function inviteHtml(name: string | undefined, unlockUrl: string, days: number): string {
  const hello = name ? `Hello ${escapeHtml(name)},` : 'Hello,'
  return `<div style="font-family:system-ui,sans-serif;max-width:520px;color:#14110E">
<p style="font-size:16px;line-height:1.5">${hello}</p>
<p style="color:#555;line-height:1.6">You're invited to explore Bricks with sample data. No account needed; open the link below.</p>
<p style="margin:24px 0"><a href="${escapeAttr(unlockUrl)}" style="display:inline-block;padding:12px 20px;background:#D2542B;color:#fff;text-decoration:none;border-radius:0;font-weight:500">Open walkthrough</a></p>
<p style="color:#555;font-size:13px;line-height:1.5">Or paste this URL:<br/><a href="${escapeAttr(unlockUrl)}" style="color:#D2542B;word-break:break-all">${escapeHtml(unlockUrl)}</a></p>
<p style="color:#999;font-size:12px;margin-top:28px">This invite expires in ${days} day${days === 1 ? '' : 's'}. Questions: help@brxs.ca</p>
</div>`
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function escapeAttr(s: string): string {
  return escapeHtml(s).replace(/'/g, '&#39;')
}

export async function POST(req: NextRequest) {
  if (!authorized(req)) {
    return json({ ok: false, error: 'unauthorized' }, 401)
  }

  let body: { email?: string; name?: string; send?: boolean; days?: number }
  try {
    body = await req.json()
  } catch {
    return json({ ok: false, error: 'invalid_body' }, 400)
  }

  const email = (body.email || '').toString().trim().toLowerCase()
  const name = (body.name || '').toString().trim() || undefined
  const send = Boolean(body.send)
  const days = clampInviteDays(body.days)

  if (!EMAIL_RE.test(email)) {
    return json({ ok: false, error: 'Enter a valid email.' }, 400)
  }

  let minted: ReturnType<typeof mintDemoInvite>
  try {
    minted = mintDemoInvite({ email, days })
  } catch (e) {
    return json({
      ok: false,
      error: e instanceof Error ? e.message : 'mint_failed',
    }, 500)
  }

  const origin = siteOrigin(req)
  const url = `${origin}/demo/unlock?t=${encodeURIComponent(minted.token)}`

  // Invites are simulated: no email leaves this route. The link is returned to copy and share by hand,
  // with the email body that would have gone out, for preview.
  return json({
    ok: true,
    url,
    emailed: false,
    simulated: send,
    exp: minted.exp,
    days,
    ...(send ? { preview: { to: email, subject: 'Your Bricks walkthrough', html: inviteHtml(name, url, days) } } : {}),
  })
}
