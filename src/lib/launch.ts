/**
 * Release switch for agent features that are built but not yet public on www.
 *
 * AGENT_LAUNCH_LIVE covers the listing launch kit and the deal room on the homepage,
 * /agents, /brokerage and the pricing feature list. It stays false on production until
 * Kam confirms; flipping it to true (one-line commit + prod deploy) publishes both.
 *
 * Preview builds can show the content without touching production by building with
 * NEXT_PUBLIC_WWW_AGENT_LAUNCH_PREVIEW=1 (vercel deploy --build-env ...). Production
 * never sets that variable.
 */
const PUBLISHED = false

export const AGENT_LAUNCH_LIVE: boolean =
  PUBLISHED || process.env.NEXT_PUBLIC_WWW_AGENT_LAUNCH_PREVIEW === '1'
