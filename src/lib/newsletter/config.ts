type Env = Record<string, string | undefined>
import { legalPartyName } from '@/lib/legal-config'

export const NEWSLETTER_FROM = 'Raphael at Bricks <hello@brxs.ca>'
export const NEWSLETTER_REPLY_TO = 'hello@brxs.ca'
export const ALERT_FROM = 'Bricks Alerts <alerts@brxs.ca>'
export const DEFAULT_ALERT_TO = 'raph@brxs.ca'
/** CASL: every message names the sender and a mailing address. Set the full address in NEWSLETTER_POSTAL_ADDRESS. */
export const DEFAULT_POSTAL = `${legalPartyName()} · 6330 Montevideo Road, Mississauga, ON L5N 3V2, Canada`
export const CONSENT_TEXT = `By signing up you agree to get email updates from Bricks. Unsubscribe anytime.`

export const newsletterSecret = (env: Env = process.env) => (env.NEWSLETTER_SECRET || '').trim()
/** Sending key (restricted keys are fine). */
export const sendKey = (env: Env = process.env) => (env.RESEND_API_KEY || '').trim()
/** Contacts need a full-access key; falls back to the one www already holds for inbound mail. */
export const contactsKey = (env: Env = process.env) => (env.NEWSLETTER_RESEND_KEY || env.RESEND_INBOUND_API_KEY || '').trim()
/** Resend segment "Newsletter" (an ID, not a secret). */
export const DEFAULT_SEGMENT_ID = 'd51b56c0-a701-41db-9a71-c36b08c33470'
export const segmentId = (env: Env = process.env) => (env.NEWSLETTER_SEGMENT_ID || DEFAULT_SEGMENT_ID).trim()
export const alertTo = (env: Env = process.env) => (env.NEWSLETTER_ALERT_TO || DEFAULT_ALERT_TO).trim()
export const postalAddress = (env: Env = process.env) => (env.NEWSLETTER_POSTAL_ADDRESS || DEFAULT_POSTAL).trim()

/**
 * Links in emails. Prod always uses https://www.brxs.ca (Sentinel: do not let *.workers.dev leak into live mail).
 * Preview Workers (BRICKS_SITE_PREVIEW=1) may use the request host or NEWSLETTER_BASE_URL.
 */
export function siteBase(origin: string | null | undefined, env: Env = process.env): string {
  const fixed = (env.NEWSLETTER_BASE_URL || '').trim().replace(/\/$/, '')
  if (fixed) return fixed
  const preview = (env.BRICKS_SITE_PREVIEW || '').trim() === '1'
  if (!preview) return 'https://www.brxs.ca'
  try {
    const u = new URL(origin || '')
    const h = u.hostname
    const ours = h === 'brxs.ca' || h.endsWith('.brxs.ca') || h.endsWith('.workers.dev') || h === 'localhost' || h === '127.0.0.1'
    if (ours) return `${u.protocol}//${u.host}`
  } catch { /* fall through */ }
  return 'https://www.brxs.ca'
}
