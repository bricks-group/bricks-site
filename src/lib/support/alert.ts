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


/* ---------- plain-language helpers ---------- */
export const helpRef = (n: number | string | null | undefined) => (n ? `Help #${n}` : 'Help request')

const REASON_WORDS: Record<string, string> = {
  human_requested: 'They asked for a person', refund: 'Refund question', cancellation_change: 'Wants to cancel or change a booking',
  money: 'Billing or payment question', account_specific: 'About their own account or booking', legal: 'Legal question',
  privacy: 'Privacy request', security: 'Security concern', complaint: 'Complaint', not_in_help: 'Not covered by the help centre',
  not_allowlisted: 'Not a routine question', sender_unverified: "We couldn't verify the sender", no_draft: "We couldn't draft a reply",
}
export function plainReasons(reasons: string[]): string[] {
  const out = reasons.map((r) => REASON_WORDS[r] ?? r.replace(/_/g, ' ').replace(/^./, (c) => c.toUpperCase()))
  return [...new Set(out)]
}

export type AlertKind = 'email_needs_kam' | 'email_draft_waiting' | 'chat_handoff'
export type AlertView = {
  kind: AlertKind
  helpNo: number | string | null
  who: string            // name or email
  replyTo: string        // email to reply to
  subject?: string       // their email subject
  latest: string         // their latest message
  history?: string[]     // earlier messages, oldest first
  pagePath?: string
  reasons: string[]      // raw codes; rendered in plain words
  draft?: string | null
  reviewUrl: string
  test?: boolean
}

const clip = (t: string, n: number) => { const s = t.replace(/\s+/g, ' ').trim(); return s.length > n ? s.slice(0, n - 1) + '…' : s }
const pageLabel = (p: string) => {
  const t = p.replace(/^\/+|\/+$/g, '').split('/').filter(Boolean).map((x) => x.replace(/-/g, ' '))
  return t.length ? t.map((x) => x[0].toUpperCase() + x.slice(1)).join(' › ') : 'Home page'
}

export function headline(v: AlertView): string {
  if (v.kind === 'chat_handoff') return 'Someone asked to talk to a person'
  if (v.kind === 'email_draft_waiting') return 'A reply is ready for you to check'
  return 'An email to help@ needs you'
}

export function alertSubject(v: AlertView): string {
  return `${v.test ? '[Test] ' : ''}${headline(v)} · ${helpRef(v.helpNo)}`.slice(0, 200)
}

function replySubject(v: AlertView): string {
  const base = v.subject ? (/^re:/i.test(v.subject) ? v.subject : `Re: ${v.subject}`) : 'Your Bricks help request'
  return `${base} · ${helpRef(v.helpNo)}`
}
export const mailtoReply = (v: AlertView) => `mailto:${encodeURIComponent(v.replyTo)}?subject=${encodeURIComponent(replySubject(v))}`

export function alertText(v: AlertView): string {
  const why = plainReasons(v.reasons)
  const lines: string[] = ([
    v.test ? 'TEST ALERT, nothing to do.' : null,
    `${headline(v)} · ${helpRef(v.helpNo)}`,
    v.kind === 'email_draft_waiting' ? 'Auto-send is off, so nothing has been sent.' : 'Nothing has been sent to them yet.',
    '',
    `From: ${v.who}${v.who !== v.replyTo ? ` <${v.replyTo}>` : ''}`,
    v.subject ? `Subject: ${v.subject}` : null,
    v.pagePath ? `Page: ${pageLabel(v.pagePath)} (https://www.brxs.ca${v.pagePath})` : null,
    why.length ? `Why it needs you: ${why.join('; ')}` : null,
    '',
    'What they said:',
    `"${clip(v.latest, 600) || '(no message)'}"`,
  ] as (string | null)[]).filter((l): l is string => l !== null)
  const hist = (v.history ?? []).filter((h) => h.trim() && h.trim() !== v.latest.trim()).slice(-3)
  if (hist.length) lines.push('', 'Earlier:', ...hist.map((h) => `- ${clip(h, 160)}`))
  if (v.draft) lines.push('', 'Suggested reply:', v.draft.trim())
  lines.push('', `Open in review page: ${v.reviewUrl}`, `Reply by email: ${v.replyTo}`)
  return lines.filter((l, i, a) => !(l === '' && (i === 0 || a[i - 1] === ''))).filter((l, i) => !(i === 0 && l === '')).join('\n').trim()
}

const esc = (t: string) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
export const EMAIL_FONT = "'General Sans','Helvetica Neue',Helvetica,Arial,sans-serif"

export function alertHtml(v: AlertView): string {
  const F = EMAIL_FONT, FONTS = 'https://www.brxs.ca/fonts'
  const why = plainReasons(v.reasons)
  const hist = (v.history ?? []).filter((h) => h.trim() && h.trim() !== v.latest.trim()).slice(-3)
  const row = (k: string, val: string) => `<tr><td style="padding:4px 16px 4px 0;color:#6B6054;font-size:13px;white-space:nowrap;vertical-align:top" class="mute">${k}</td><td style="padding:4px 0;font-size:14px;color:#14110E" class="ink">${val}</td></tr>`
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><meta name="color-scheme" content="light dark"><meta name="supported-color-schemes" content="light dark"><title>${esc(alertSubject(v))}</title><style>
@font-face{font-family:'General Sans';src:url('${FONTS}/GeneralSans-Regular.woff2') format('woff2');font-weight:400;}
@font-face{font-family:'General Sans';src:url('${FONTS}/GeneralSans-Medium.woff2') format('woff2');font-weight:500;}
@media (prefers-color-scheme: dark){
 body,.bg{background:#141210 !important}.card{background:#1C1A17 !important;border-color:#2E2A25 !important}
 .ink{color:#F4F1EB !important}.soft{color:#D6CFC2 !important}.mute{color:#9F978C !important}
 .quote{border-color:#4A4642 !important}.btn{background:#F4F1EB !important;color:#14110E !important}.draft{background:#23201C !important}
}
</style></head>
<body class="bg" style="margin:0;padding:0;background:#F4F1EB">
<div style="display:none;max-height:0;overflow:hidden">${esc(clip(v.latest, 120))}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="bg" style="background:#F4F1EB"><tr><td align="center" style="padding:32px 16px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;font-family:${F}">
<tr><td style="padding:0 4px 20px"><span class="ink" style="font-family:${F};font-weight:500;font-size:18px;letter-spacing:-.02em;color:#14110E">bricks</span>${v.test ? `<span style="margin-left:10px;font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:#A8401F">Test</span>` : ''}</td></tr>
<tr><td class="card" style="background:#FFFFFF;border:1px solid #E6E2DA;border-radius:0;padding:28px">
<div class="mute" style="font-size:13px;color:#6B6054;margin-bottom:6px">${esc(helpRef(v.helpNo))}</div>
<h1 class="ink" style="margin:0 0 6px;font-family:${F};font-weight:500;font-size:22px;line-height:1.25;letter-spacing:-.02em;color:#14110E">${esc(headline(v))}</h1>
<p class="soft" style="margin:0 0 20px;font-size:14px;color:#3B332A">${v.kind === 'email_draft_waiting' ? 'Auto-send is off, so nothing has been sent.' : 'Nothing has been sent to them yet.'}</p>
<table role="presentation" cellpadding="0" cellspacing="0" style="margin-bottom:20px">
${row('From', esc(v.who) + (v.who !== v.replyTo ? ` <span class="mute" style="color:#6B6054">${esc(v.replyTo)}</span>` : ''))}
${v.subject ? row('Subject', esc(v.subject)) : ''}
${v.pagePath ? row('Page', `<a href="https://www.brxs.ca${esc(v.pagePath)}" class="ink" style="color:#14110E">${esc(pageLabel(v.pagePath))}</a>`) : ''}
${why.length ? row('Why', esc(why.join(' · '))) : ''}
</table>
<div class="quote ink" style="border-left:3px solid #D6D2CA;padding:2px 0 2px 14px;font-size:15px;line-height:1.55;color:#14110E;margin-bottom:${hist.length ? 12 : 20}px">${esc(clip(v.latest, 600) || '(no message)')}</div>
${hist.length ? `<div class="mute" style="font-size:13px;color:#6B6054;margin-bottom:20px">Earlier: ${hist.map((h) => esc(clip(h, 140))).join(' · ')}</div>` : ''}
${v.draft ? `<div class="mute" style="font-size:13px;color:#6B6054;margin-bottom:6px">Suggested reply</div><div class="draft soft" style="background:#F4F1EB;border-radius:0;padding:14px 16px;font-size:14px;line-height:1.55;color:#3B332A;white-space:pre-wrap;margin-bottom:24px">${esc(v.draft.trim())}</div>` : ''}
<table role="presentation" cellpadding="0" cellspacing="0"><tr>
<td style="border-radius:0" class="btn" bgcolor="#14110E"><a href="${esc(v.reviewUrl)}" class="btn" style="display:inline-block;padding:12px 20px;font-family:${F};font-weight:500;font-size:14px;color:#F4F1EB;text-decoration:none;border-radius:0;background:#14110E">Open in review page</a></td>
<td style="padding-left:16px"><a href="${esc(mailtoReply(v))}" class="ink" style="font-family:${F};font-size:14px;color:#14110E">Reply by email</a></td>
</tr></table>
</td></tr>
<tr><td class="mute" style="padding:16px 4px 0;font-size:12px;color:#6B6054">Bricks help alerts · sent to raph@brxs.ca</td></tr>
</table></td></tr></table></body></html>`
}

/* ---------- sending ---------- */
export type AlertSendInput = { view: AlertView; idempotencyKey: string; meta: Record<string, string> }
export type AlertSender = (a: AlertSendInput) => Promise<{ ok: boolean; id?: string; error?: string }>

/** One sender for every support alert. Idempotent per key, never throws, Bricks-alert headers (loop guard).
 *  Internal ids ride only in X-Bricks-* headers. */
export function resendAlerter(env: Env = process.env, f: typeof fetch = fetch): AlertSender | undefined {
  const key = (env.RESEND_API_KEY || '').trim()
  if (!key) return undefined
  const to = (env.SUPPORT_ALERT_TO || ALERT_TO).trim()
  return async ({ view, idempotencyKey, meta }) => {
    try {
      const headers: Record<string, string> = { 'Auto-Submitted': 'auto-generated', 'X-Bricks-Alert': '1' }
      for (const [k, val] of Object.entries(meta)) if (val) headers[`X-Bricks-${k}`] = val.slice(0, 200)
      const r = await f('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', 'Idempotency-Key': idempotencyKey.slice(0, 256) },
        body: JSON.stringify({ from: ALERT_FROM, to: [to], reply_to: view.replyTo, subject: alertSubject(view), text: alertText(view), html: alertHtml(view), headers }),
      })
      if (!r.ok) return { ok: false, error: `resend_alert_${r.status}` }
      const j = (await r.json().catch(() => ({}))) as { id?: string }
      return { ok: true, id: j.id }
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e.message : 'alert_failed' }
    }
  }
}
