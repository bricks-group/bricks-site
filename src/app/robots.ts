import type { MetadataRoute } from 'next'

// Search/retrieval agents and the model-training controls requested by the owner.
// These permissions do not bypass authentication or hosting security controls.
export const AI_CRAWLERS = [
  'GPTBot', 'OAI-SearchBot', 'ChatGPT-User',
  'PerplexityBot', 'Perplexity-User',
  'ClaudeBot', 'Claude-SearchBot', 'Claude-User',
  'Googlebot', 'Google-Extended', 'Applebot', 'Applebot-Extended', 'bingbot',
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      { userAgent: AI_CRAWLERS, allow: '/' },
    ],
    sitemap: 'https://www.brxs.ca/sitemap.xml',
    host: 'https://www.brxs.ca',
  }
}
