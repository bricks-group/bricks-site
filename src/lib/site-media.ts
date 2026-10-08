/** First-party media URLs for www — do not depend on Supabase Storage for marketing assets.
 *
 * The shared Supabase project's Storage API currently returns NoSuchKey / NoSuchBucket for
 * the legacy `Bricks Images` / `BRX Images` buckets (Postgres rows remain, S3 objects do not).
 * Keep share images, film, and visit fallbacks on Vercel-hosted `/media/*`.
 */

export const SITE_ORIGIN = 'https://www.brxs.ca'

/** Absolute OG/Twitter share image (must be absolute for crawlers). */
export const OG_SHARE_IMAGE = `${SITE_ORIGIN}/media/og-share.jpg`

/** Homepage film reel (local mp4). */
export const FILM_REEL_MP4 = '/media/film-reel.mp4'

/** Virtual Visit placeholder while the SuperSplat iframe loads. */
export const VIRTUAL_VISIT_FALLBACK = '/media/reel-poster.jpg'
