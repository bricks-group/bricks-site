/**
 * Owner alerts for help@ inbound mail. Every inbound support email that isn't
 * suppressed produces exactly one alert to the Bricks alert inbox (raph@brxs.ca):
 *  - "needs you" when needs_kam / escalated / no draft could be made
 *  - "draft waiting" (lighter) for routine shadow drafts while auto-send is off
 * Loop guard: alerts go out from alerts@brxs.ca with X-Bricks-Alert and
 * Auto-Submitted headers; suppressionReason() drops both if they ever come back.
 */
import { createHmac, timingSafeEqual } from 'node:crypto'

type Env = Record<string, string | undefined>
export const ALERT_TO = 'raph@brxs.ca'
export const ALERT_FROM = 'Bricks Alerts <alerts@brxs.ca>'
export const REVIEW_PATH = '/admin/support'

export type AlertInput = {
  kind: 'needs_kam' | 'draft_waiting'
  emailId: string
  from: string
  subject: string
  text: string
  reasons: string[]
  draft: string | null
  outboundId?: string | null
  test?: boolean
}

const site = (env: Env) => (env.SUPPORT_REVIEW_BASE_URL || 'https://www.brxs.ca').replace(/\/$/, '')

/* ---------- admin link tokens (HMAC, no DB) ---------- */
export function adminSecret(env: Env = process.env): string {
  return (env.SUPPORT_ADMIN_SECRET || '').trim()
}
export function signAdminToken(secret: string, expSec: number): string {
  const mac = createHmac('sha256', secret).update(`support-admin:${expSec}`).digest('base64url')
  return `${expSec}.${mac}`
}
export function verifyAdminToken(secret: string, token: string | undefined | null, nowSec = Math.floor(Date.now() / 1000)): boolean {
  if (!secret || !token) return false
  const [expStr, mac] = token.split('.')
  const exp = Number(expStr)
  if (!Number.isFinite(exp) || exp < nowSec || !mac) return false
  const want = signAdminToken(secret, exp).split('.')[1]
  const a = Buffer.from(mac), b = Buffer.from(want)
  return a.length === b.length && timingSafeEqual(a, b)
}
export function reviewLink(env: Env = process.env, days = 7, nowSec = Math.floor(Date.now() / 1000)): string {
  const secret = adminSecret(env)
  const base = `${site(env)}${REVIEW_PATH}`
  if (!secret) return base
  return `${base}/login?t=${encodeURIComponent(signAdminToken(secret, nowSec + days * 86400))}`
}

/* ---------- alert content ---------- */
const snippet = (t: string, n = 400) => { const s = t.replace(/\s+/g, ' ').trim(); return s.length > n ? s.slice(0, n) + '…' : s }

export function buildAlert(a: AlertInput, link: string): { subject: string; text: string } {
  const tag = a.test ? '[TEST] ' : ''
  if (a.kind === 'needs_kam') {
    return {
      subject: `${tag}help@ needs you: ${a.subject || '(no subject)'} (from ${a.from})`.slice(0, 200),
      text: [
        `A help@brxs.ca email needs you. Nothing was sent to the customer.`,
        ``,
        `From: ${a.from}`,
        `Subject: ${a.subject || '(no subject)'}`,
        `Why: ${a.reasons.length ? a.reasons.join(', ') : (a.draft ? 'not a routine question' : 'no draft could be made')}`,
        ``,
        `Their message:`,
        snippet(a.text) || '(empty)',
        ``,
        `Suggested reply:`,
        a.draft ? a.draft : '(no draft)',
        ``,
        `Review, edit and send (or dismiss): ${link}`,
      ].join('\n'),
    }
  }
  return {
    subject: `${tag}help@ draft waiting: ${a.subject || '(no subject)'} (from ${a.from})`.slice(0, 200),
    text: [
      `A routine help@brxs.ca email has a draft reply waiting. Auto-send is off, so nothing was sent.`,
      ``,
      `From: ${a.from}`,
      `Subject: ${a.subject || '(no subject)'}`,
      `Message: ${snippet(a.text, 240) || '(empty)'}`,
      ``,
      `Suggested reply:`,
      a.draft ?? '(no draft)',
      ``,
      `Review and send: ${link}`,
    ].join('\n'),
  }
}

export type AlertSender = (a: AlertInput) => Promise<{ ok: boolean; id?: string; error?: string }>

export function resendAlerter(env: Env = process.env, f: typeof fetch = fetch): AlertSender | undefined {
  const key = (env.RESEND_API_KEY || '').trim()
  if (!key) return undefined
  const to = (env.SUPPORT_ALERT_TO || ALERT_TO).trim()
  return async (a) => {
    const { subject, text } = buildAlert(a, reviewLink(env))
    const r = await f('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', 'Idempotency-Key': `alert:${a.emailId}`.slice(0, 256) },
      body: JSON.stringify({ from: ALERT_FROM, to: [to], subject, text, headers: { 'Auto-Submitted': 'auto-generated', 'X-Bricks-Alert': '1' } }),
    })
    if (!r.ok) return { ok: false, error: `resend_alert_${r.status}` }
    const j = (await r.json().catch(() => ({}))) as { id?: string }
    return { ok: true, id: j.id }
  }
}
