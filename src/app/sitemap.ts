import type { MetadataRoute } from 'next'

const BASE = 'https://www.brxs.ca'

// Static route list. Add new top-level/section routes here as the site grows.
const routes = [
  '',
  '/pricing',
  '/fall-market',
  '/gallery',
  '/about',
  '/contact',
  '/photographers',
  '/book',
  '/service-areas',
  '/terms',
  '/privacy',
  '/blog',
  '/blog/3d-tour-vs-video-walkthrough',
  '/blog/drone-photography-rules-ontario',
  '/blog/gta-real-estate-media-cost-2026',
  '/blog/whats-included-listing-shoot',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return routes.map((route) => ({
    url: BASE + route,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : 0.8,
  }))
}
