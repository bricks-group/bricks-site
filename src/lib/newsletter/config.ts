type Env = Record<string, string | undefined>

export const NEWSLETTER_FROM = 'Raphael at Bricks <hello@brxs.ca>'
export const NEWSLETTER_REPLY_TO = 'hello@brxs.ca'
export const ALERT_FROM = 'Bricks Alerts <alerts@brxs.ca>'
export const DEFAULT_ALERT_TO = 'raph@brxs.ca'
/** CASL: every message names the sender and a mailing address. Set the full address in NEWSLETTER_POSTAL_ADDRESS. */
export const DEFAULT_POSTAL = 'Mississauga, Ontario, Canada'
export const CONSENT_TEXT = 'By signing up you agree to get email updates from Bricks Group. Unsubscribe anytime.'

export const newsletterSecret = (env: Env = process.env) => (env.NEWSLETTER_SECRET || '').trim()
/** Sending key (restricted keys are fine). */
export const sendKey = (env: Env = process.env) => (env.RESEND_API_KEY || '').trim()
/** Contacts need a full-access key; falls back to the one www already holds for inbound mail. */
export const contactsKey = (env: Env = process.env) => (env.NEWSLETTER_RESEND_KEY || env.RESEND_INBOUND_API_KEY || '').trim()
export const segmentId = (env: Env = process.env) => (env.NEWSLETTER_SEGMENT_ID || '').trim()
export const alertTo = (env: Env = process.env) => (env.NEWSLETTER_ALERT_TO || DEFAULT_ALERT_TO).trim()
export const postalAddress = (env: Env = process.env) => (env.NEWSLETTER_POSTAL_ADDRESS || DEFAULT_POSTAL).trim()

/** Links point back at the host that served the request, but only our own hosts. */
export function siteBase(origin: string | null | undefined, env: Env = process.env): string {
  const fixed = (env.NEWSLETTER_BASE_URL || '').trim().replace(/\/$/, '')
  if (fixed) return fixed
  try {
    const u = new URL(origin || '')
    const h = u.hostname
    const ours = h === 'brxs.ca' || h.endsWith('.brxs.ca') || h.endsWith('.workers.dev') || h === 'localhost' || h === '127.0.0.1'
    if (ours) return `${u.protocol}//${u.host}`
  } catch { /* fall through */ }
  return 'https://www.brxs.ca'
}
