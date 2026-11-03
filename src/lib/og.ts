// Self-hosted link-preview image (public/og.png, 1200x630). Source: scripts/og/og.html.
// Keep previews on our own domain so a storage bucket change can never break them.
export const OG_IMAGE_URL = 'https://www.brxs.ca/og.png'
export const OG_IMAGE = {
  url: OG_IMAGE_URL,
  width: 1200,
  height: 630,
  alt: 'Bricks — the system for Canadian real estate',
  type: 'image/png',
} as const
