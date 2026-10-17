import type { MetadataRoute } from 'next'

const BASE = 'https://www.brxs.ca'

/** Routes currently allowlisted while the marketing gate is on (immediate SEO). */
const PUBLIC_NOW = [
  { path: '/book', changeFrequency: 'weekly' as const, priority: 1 },
  { path: '/photographers', changeFrequency: 'weekly' as const, priority: 0.9 },
  { path: '/real-estate-photography', changeFrequency: 'weekly' as const, priority: 0.95 },
  { path: '/blog', changeFrequency: 'weekly' as const, priority: 0.85 },
  { path: '/blog/canada-real-estate-photography-cost-2026', changeFrequency: 'monthly' as const, priority: 0.8 },
  { path: '/blog/gta-real-estate-media-cost-2026', changeFrequency: 'monthly' as const, priority: 0.75 },
  { path: '/blog/whats-included-listing-shoot', changeFrequency: 'monthly' as const, priority: 0.75 },
  { path: '/blog/3d-tour-vs-video-walkthrough', changeFrequency: 'monthly' as const, priority: 0.7 },
  { path: '/blog/drone-photography-rules-ontario', changeFrequency: 'monthly' as const, priority: 0.7 },
]

/** Shipped in repo / sitemap for launch; still behind the marketing gate today. */
const GATED_READY = [
  { path: '/', changeFrequency: 'weekly' as const, priority: 1 },
  { path: '/pricing', changeFrequency: 'weekly' as const, priority: 0.9 },
  { path: '/gallery', changeFrequency: 'monthly' as const, priority: 0.7 },
  { path: '/about', changeFrequency: 'monthly' as const, priority: 0.6 },
  { path: '/service-areas', changeFrequency: 'weekly' as const, priority: 0.8 },
  { path: '/fall-market', changeFrequency: 'monthly' as const, priority: 0.65 },
  { path: '/platform', changeFrequency: 'monthly' as const, priority: 0.55 },
  { path: '/agents', changeFrequency: 'monthly' as const, priority: 0.55 },
  { path: '/brokerage', changeFrequency: 'monthly' as const, priority: 0.55 },
  { path: '/contact', changeFrequency: 'yearly' as const, priority: 0.4 },
  { path: '/terms', changeFrequency: 'yearly' as const, priority: 0.3 },
  { path: '/privacy', changeFrequency: 'yearly' as const, priority: 0.3 },
  { path: '/account-deletion', changeFrequency: 'yearly' as const, priority: 0.2 },
  { path: '/legal', changeFrequency: 'yearly' as const, priority: 0.3 },
  { path: '/dpa', changeFrequency: 'yearly' as const, priority: 0.3 },
  { path: '/builders', changeFrequency: 'monthly' as const, priority: 0.6 },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return [...PUBLIC_NOW, ...GATED_READY].map((r) => ({
    url: `${BASE}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }))
}
