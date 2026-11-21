/**
 * Same-page payment (Kam 2026-11-21): when the browser asks for it and a
 * publishable key for the same Stripe mode is configured, the session is
 * created for Stripe's embedded Checkout and paid on brxs.ca. Anything else
 * (older callers, missing key) keeps the hosted page and its `url`.
 */
export function embeddedPublishableKey(
  stripeKey: string,
  env: Record<string, string | undefined>,
): string | null {
  const pk = (env.STRIPE_PUBLISHABLE_KEY || env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '').trim()
  if (!pk.startsWith('pk_')) return null
  const skLive = /^(sk|rk)_live_/.test(stripeKey)
  const pkLive = pk.startsWith('pk_live_')
  return skLive === pkLive ? pk : null
}

export function wantsEmbedded(body: Record<string, unknown>): boolean {
  const v = String(body.ui_mode || body.checkout_ui || '').toLowerCase()
  return v === 'embedded' || v === 'embedded_page'
}


/** Stripe Checkout branding for the embedded form (globals.css --paper / --brick). */
export const EMBEDDED_BRANDING: Record<string, string> = {
  border_style: 'rectangular',
  button_color: '#D2542B',
  background_color: '#F4F1EB',
  display_name: 'Bricks',
}
