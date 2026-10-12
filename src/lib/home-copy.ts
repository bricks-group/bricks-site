/**
 * Homepage copy, keyed by locale so FR can land without touching layout.
 * EN is the source of truth; FR is intentionally empty until a reviewed translation exists
 * (falls back to EN). Keep claims identical to the live site.
 */
export type Locale = 'en' | 'fr'

const en = {
  heroKicker: 'Listing media · Dispatch · The deal',
  heroTitleA: 'The system for',
  heroTitleSerif: 'Canadian',
  heroTitleB: 'real estate.',
  heroSub: 'Replace the patchwork. Book professional listing media today — the desk, dispatch, and the deal follow on one file.',
  ctaPrimary: 'Book a shoot',
  ctaSecondary: 'Talk to us — brokerages',
  heroTrust: 'Canada-wide · 24–48h target · Pay to lock an exact clock time',
  proofLabel: 'Proof',
  proofStat: '14,000+',
  proofLine: 'properties shot before Bricks.',
  proofSource: 'Raphael Merchant, founder — at CoStar',
  pathsLabel: 'Two ways in',
  dataLabel: 'For brokerages',
  dataTitle: 'How we handle your data.',
}

export const HOME_COPY: Record<Locale, typeof en> = { en, fr: { ...en } }
export const HREFLANG = { en: '/', fr: null as string | null } // set fr route when translated
