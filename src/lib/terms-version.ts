/**
 * Terms version shown next to every pay button (Counsel, 2026-11-07).
 * Sent with checkout; the booking API records it with the acceptance time.
 * Bump with every change to /terms and mirror in Bricks-OS common/terms.py
 * (KNOWN_TERMS_VERSIONS). 2026-11-07: refund boundary reads "24 hours or more".
 */
export const TERMS_VERSION = '2026-11-07'

/** {terms_version, terms_accepted_at} for Stripe metadata at checkout creation. */
export function termsAcceptanceMeta(now: Date = new Date()): { terms_version: string; terms_accepted_at: string } {
  return { terms_version: TERMS_VERSION, terms_accepted_at: new Date(Math.floor(now.getTime() / 1000) * 1000).toISOString().replace('.000Z', 'Z') }
}
