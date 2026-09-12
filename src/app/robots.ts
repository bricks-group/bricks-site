import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  // App-level password gate protects marketing pages. Do not blanket-disallow crawlers —
  // public paths (/book, /photographers, /blog, SEO landings) must remain crawlable.
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://www.brxs.ca/sitemap.xml',
    host: 'https://www.brxs.ca',
  }
}
