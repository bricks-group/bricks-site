import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  // Site is hidden until launch — disallow all crawlers.
  return {
    rules: {
      userAgent: '*',
      disallow: '/',
    },
    host: 'https://www.brxs.ca',
  }
}
