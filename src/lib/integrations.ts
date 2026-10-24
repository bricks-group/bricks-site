/**
 * Integrations: single source of truth for the marketing site.
 * Status source: Brixton, 2026-10-11 (see public/integrations/SOURCES.md for logo files and usage rules).
 * LIVE = works today. SOON = not shipped; never on a logo row or in "works with" copy.
 * Vendors without a logo licence (Follow Up Boss, kvCORE/BoldTrail) are plain text, never a logo.
 * Repliers forbids recolouring: its official amethyst logo shows in its own colour on light. Repliers publishes no
 * transparent white file for dark backgrounds, so dark mode shows the name as plain text instead.
 * Stripe uses its official slate wordmark on light and white wordmark on dark (Stripe logo kit), never a recoloured mark.
 * Commodity tools (Google Calendar, Apple Calendar, Google sign-in) are not listed (Kam, 24 Oct).
 * Wording rule: "Works with" / "Connects to" only. Never partner, certified or official.
 */

/** scale: optical-size multiplier on the base logo height (uniform; never distorts). */
export type IntegrationLogo = {
  src: string; w: number; h: number; scale?: number; alt?: string
  /** Render in the file's own colours (no grey filter). Required when the vendor forbids recolouring. */
  own?: boolean
  /** Official dark-mode file (own colours). If own is set and this is missing, dark mode shows the name as text. */
  srcDark?: string
}

export type Integration = {
  /** Vendor / product name, used for alt text or the text wordmark. */
  name: string
  /** What Bricks does with it today. Keep MLS® with the ®. */
  what: string
  /** Official asset. Omit to render a text wordmark. */
  logo?: IntegrationLogo
  /** Logo is a symbol without a wordmark; show the name next to it. */
  symbolOnly?: boolean
}

export const LIVE_INTEGRATIONS: Integration[] = [
  { name: 'Follow Up Boss', what: 'Contact sync' },
  { name: 'kvCORE / BoldTrail', what: 'Contact sync' },
  { name: 'PropTx', what: 'TRREB MLS® feed via RESO Web API', logo: { src: '/integrations/proptx-symbol.svg', w: 102, h: 92, scale: 1.1, alt: 'PropTx logo symbol' }, symbolOnly: true },
  { name: 'Bridge Interactive', what: 'Cornerstone and ITSO MLS® feeds', logo: { src: '/integrations/bridge-interactive.png', w: 263, h: 80, scale: 1.1 } },
  { name: 'Repliers', what: 'MLS® feed', logo: { src: '/integrations/repliers.png', w: 401, h: 101, scale: 0.85, own: true } },
  { name: 'Stripe', what: 'Payments', logo: { src: '/integrations/stripe-slate.svg', srcDark: '/integrations/stripe-white.svg', own: true, w: 360, h: 151, scale: 0.95 } },
]

export const SOON_INTEGRATIONS: Integration[] = [
  { name: 'Docusign', what: 'Send from the deal', logo: { src: '/integrations/docusign.svg', w: 70, h: 15 } },
]

export const LOGO_FINE_PRINT = 'Logos are trademarks of their respective owners. No endorsement implied.'
