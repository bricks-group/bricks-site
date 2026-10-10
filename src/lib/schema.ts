import { FOUNDER_PERSON } from '@/lib/brand'

/**
 * Single source of truth for www structured data.
 * One Organization node; every other page references it by @id.
 * legalName lives here only (LEGAL_NAME); other pages reference ORG_ID instead of repeating it.
 * foundingDate is year-only (FOUNDING_YEAR).
 */

export const SITE_URL = 'https://www.brxs.ca/'
export const ORG_ID = 'https://www.brxs.ca/#organization'
export const SITE_ID = 'https://www.brxs.ca/#website'
export const LOGO_ID = 'https://www.brxs.ca/#logo'

/** Confirmed legal name (Kam, 2026-10-10). Single source for schema legalName. */
export const LEGAL_NAME = 'Bricks Group'

/** Confirmed founding year (Kam, 2026-10-10). Year only. */
export const FOUNDING_YEAR = '2026'

/** Public profiles. Also rendered as footer links (reciprocal sameAs). */
export const SOCIAL_PROFILES = [
  { label: 'LinkedIn', url: 'https://www.linkedin.com/company/bricksbybricks/' },
  { label: 'Instagram', url: 'https://www.instagram.com/bricks.os/' },
  { label: 'Facebook', url: 'https://www.facebook.com/people/Bricks-Media/61584944974375/' },
] as const

export const GOOGLE_PROFILE_URL = 'https://share.google/7ttYfc6W7JRwlqA9U'

export const SAME_AS = [...SOCIAL_PROFILES.map((p) => p.url), GOOGLE_PROFILE_URL]

export const LOGO_SCHEMA = {
  '@type': 'ImageObject',
  '@id': LOGO_ID,
  url: 'https://www.brxs.ca/bricks-mark.png',
  contentUrl: 'https://www.brxs.ca/bricks-mark.png',
  width: 128,
  height: 128,
  caption: 'Bricks',
}

/** Founder node — values come from brand.ts (no new name strings here). */
export const FOUNDER_SCHEMA = { ...FOUNDER_PERSON }

export const ORGANIZATION_SCHEMA = {
  '@type': 'Organization',
  '@id': ORG_ID,
  name: 'Bricks',
  alternateName: ['Bricks brxs', 'brxs.ca'],
  legalName: LEGAL_NAME,
  url: SITE_URL,
  logo: LOGO_SCHEMA,
  image: { '@id': LOGO_ID },
  description:
    'Bricks is a Canadian real estate media and software company based in Mississauga, Ontario. Agents book HDR listing photography, licensed drone, and floor plans online at brxs.ca; the Bricks OS is live in preview at app.brxs.ca.',
  slogan: 'The system for Canadian real estate.',
  foundingDate: FOUNDING_YEAR,
  founder: FOUNDER_SCHEMA,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Mississauga',
    addressRegion: 'ON',
    addressCountry: 'CA',
  },
  areaServed: { '@type': 'Country', name: 'Canada' },
  email: 'help@brxs.ca',
  telephone: '+1-343-453-4578',
  contactPoint: [
    {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'help@brxs.ca',
      telephone: '+1-343-453-4578',
      areaServed: 'CA',
      availableLanguage: ['en'],
    },
    {
      '@type': 'ContactPoint',
      contactType: 'sales',
      email: 'booking@brxs.ca',
      areaServed: 'CA',
      availableLanguage: ['en'],
    },
  ],
  knowsAbout: ['Real estate photography', 'Listing photos', 'Drone photography', 'Floor plans', 'Virtual tours', 'Real estate software'],
  sameAs: SAME_AS,
}

export const WEBSITE_SCHEMA = {
  '@type': 'WebSite',
  '@id': SITE_ID,
  url: SITE_URL,
  name: 'Bricks',
  alternateName: ['brxs.ca', 'Bricks brxs'],
  publisher: { '@id': ORG_ID },
  inLanguage: 'en-CA',
}

/** Reference to the single Organization (for publisher / provider / mainEntity). */
export const ORG_REF = {
  '@type': 'Organization',
  '@id': ORG_ID,
  name: 'Bricks',
  url: SITE_URL,
}
