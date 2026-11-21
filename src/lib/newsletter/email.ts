/** Newsletter emails: CASL footer (sender, address, unsubscribe) + RFC 8058 one-click headers. */
import { NEWSLETTER_FROM, NEWSLETTER_REPLY_TO } from './config'

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string)

export const unsubscribePageUrl = (base: string, token: string) => `${base}/newsletter/unsubscribe?t=${encodeURIComponent(token)}`
export const unsubscribeApiUrl = (base: string, token: string) => `${base}/api/newsletter/unsubscribe?t=${encodeURIComponent(token)}`
export const confirmPageUrl = (base: string, token: string) => `${base}/newsletter/confirm?t=${encodeURIComponent(token)}`

export function listUnsubscribeHeaders(base: string, unsubToken: string): Record<string, string> {
  return {
    'List-Unsubscribe': `<${unsubscribeApiUrl(base, unsubToken)}>, <mailto:${NEWSLETTER_REPLY_TO}?subject=unsubscribe>`,
    'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
  }
}

export function footerHtml(base: string, unsubToken: string, postal: string): string {
  return `<p style="margin:32px 0 0;padding-top:16px;border-top:1px solid #E4DED6;font-size:12px;line-height:1.6;color:#8A8178">`
    + `Bricks Group · ${esc(postal)} · <a href="mailto:${NEWSLETTER_REPLY_TO}" style="color:#8A8178">${NEWSLETTER_REPLY_TO}</a><br>`
    + `<a href="${esc(unsubscribePageUrl(base, unsubToken))}" style="color:#8A8178">Unsubscribe</a></p>`
}
export function footerText(base: string, unsubToken: string, postal: string): string {
  return `\n--\nBricks Group · ${postal} · ${NEWSLETTER_REPLY_TO}\nUnsubscribe: ${unsubscribePageUrl(base, unsubToken)}\n`
}

function frame(inner: string): string {
  return `<!doctype html><html><body style="margin:0;background:#F6F3EE"><div style="max-width:520px;margin:0 auto;padding:32px 24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#14110E">`
    + `<div style="font-size:18px;font-weight:600;letter-spacing:-0.02em;margin-bottom:28px">bricks</div>${inner}</div></body></html>`
}

export type BuiltEmail = { from: string; reply_to: string; to: string[]; subject: string; html: string; text: string; headers: Record<string, string> }

export function confirmEmail(opts: { to: string; base: string; confirmToken: string; unsubToken: string; postal: string }): BuiltEmail {
  const link = confirmPageUrl(opts.base, opts.confirmToken)
  const html = frame(
    `<p style="font-size:22px;font-weight:500;margin:0 0 12px">Confirm your email</p>`
    + `<p style="font-size:15px;line-height:1.6;color:#4A433C;margin:0 0 24px">Tap below to get Bricks updates. About once a month.</p>`
    + `<p style="margin:0 0 24px"><a href="${esc(link)}" style="display:inline-block;padding:13px 22px;background:#D2542B;color:#14110E;text-decoration:none;border-radius:0;font-weight:500">Confirm</a></p>`
    + `<p style="font-size:14px;line-height:1.6;color:#4A433C;margin:0">Didn't ask for this? Ignore this email and nothing happens.</p>`
    + `<p style="font-size:14px;line-height:1.6;color:#4A433C;margin:20px 0 0">Raphael<br>Bricks</p>`
    + footerHtml(opts.base, opts.unsubToken, opts.postal),
  )
  const text = `Confirm your email\n\nOpen this link to get Bricks updates. About once a month.\n${link}\n\nDidn't ask for this? Ignore this email and nothing happens.\n\nRaphael\nBricks\n`
    + footerText(opts.base, opts.unsubToken, opts.postal)
  return {
    from: NEWSLETTER_FROM, reply_to: NEWSLETTER_REPLY_TO, to: [opts.to], subject: 'Confirm your Bricks updates', html, text,
    headers: listUnsubscribeHeaders(opts.base, opts.unsubToken),
  }
}

/** Wrap any future newsletter body so it always carries the footer and one-click headers. */
export function newsletterEmail(opts: { to: string; subject: string; bodyHtml: string; bodyText: string; base: string; unsubToken: string; postal: string }): BuiltEmail {
  return {
    from: NEWSLETTER_FROM, reply_to: NEWSLETTER_REPLY_TO, to: [opts.to], subject: opts.subject,
    html: frame(opts.bodyHtml + `<p style="font-size:14px;line-height:1.6;color:#4A433C;margin:24px 0 0">Raphael<br>Bricks</p>` + footerHtml(opts.base, opts.unsubToken, opts.postal)),
    text: `${opts.bodyText}\n\nRaphael\nBricks\n` + footerText(opts.base, opts.unsubToken, opts.postal),
    headers: listUnsubscribeHeaders(opts.base, opts.unsubToken),
  }
}

export const maskEmail = (e: string) => e.replace(/^(.)(.*)(@.*)$/, (_m, a, b, d) => `${a}${'•'.repeat(Math.min(Math.max(b.length, 1), 6))}${d}`)
