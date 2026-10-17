import {
  AREA_SERVED_SCHEMA,
  OS_URL,
  TOUR_BLURB,
  TOUR_NAME,
  VISIT_BLURB,
  VISIT_NAME,
  VISIT_PACKAGING,
} from '@/lib/brand'
import { OFFICE_PLANS } from '@/lib/catalog'
import {
  DRONE_RATE,
  MEDIA_PACKAGE_FROM,
  REEL_RATE,
  RUSH_FLAT,
  STAGING_PER_IMAGE,
  TOUR_RATE,
  TWILIGHT_RATE,
  VISIT_RATE,
} from '@/lib/pricing'

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

/* ------------------------------------------------------------------ */
/* Pricing structured data. Every number is imported from the same     */
/* constants the visible pages render (pricing.ts / catalog.ts).       */
/* ------------------------------------------------------------------ */

/** Bricks OS for brokerages: one Offer per seat tier (CAD per seat per year). */
export function osSoftwareApplicationSchema(pageUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': 'https://www.brxs.ca/#bricks-os',
    name: 'Bricks OS',
    applicationCategory: 'BusinessApplication',
    // Web only: the site states the apps are not in the App Store or Google Play yet.
    operatingSystem: 'Web',
    url: OS_URL,
    provider: { '@id': ORG_ID },
    publisher: { '@id': ORG_ID },
    offers: OFFICE_PLANS.map((p) => ({
      '@type': 'Offer',
      name: `${p.name} (${p.seats})`,
      url: pageUrl,
      priceCurrency: 'CAD',
      price: p.seatPricePerYear,
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: p.seatPricePerYear,
        priceCurrency: 'CAD',
        unitText: 'seat per year',
        referenceQuantity: { '@type': 'QuantitativeValue', value: 1, unitCode: 'ANN' },
      },
    })),
  }
}

const from = (name: string, minPrice: number, description?: string) => ({
  '@type': 'Offer',
  itemOffered: { '@type': 'Service', name, ...(description ? { description } : {}) },
  priceSpecification: { '@type': 'PriceSpecification', minPrice, priceCurrency: 'CAD' },
})
const band = (name: string, rate: readonly number[], description?: string) => ({
  '@type': 'Offer',
  itemOffered: { '@type': 'Service', name, ...(description ? { description } : {}) },
  priceSpecification: { '@type': 'PriceSpecification', minPrice: rate[0], maxPrice: rate[rate.length - 1], priceCurrency: 'CAD' },
})
const fixed = (name: string, price: number, description?: string, unitText?: string) => ({
  '@type': 'Offer',
  itemOffered: { '@type': 'Service', name, ...(description ? { description } : {}) },
  price,
  priceCurrency: 'CAD',
  priceSpecification: unitText
    ? { '@type': 'UnitPriceSpecification', price, priceCurrency: 'CAD', unitText }
    : { '@type': 'PriceSpecification', price, priceCurrency: 'CAD' },
})

/** Every media package / add-on with a public price, keyed so each page lists only what it shows. */
export const MEDIA_OFFERS = {
  photos_only: from('Photos only', MEDIA_PACKAGE_FROM.photos_only, 'HDR photography only — no drone, no floor plan. Small footprint from-price.'),
  essentials: from('Essentials', MEDIA_PACKAGE_FROM.essentials, 'HDR + licensed drone + floor plan. Small footprint from-price.'),
  story: from('Story', MEDIA_PACKAGE_FROM.story, 'Essentials plus cinematic reel. Small footprint from-price.'),
  showcase: from('Showcase', MEDIA_PACKAGE_FROM.showcase, `Story plus ${TOUR_NAME}. Small footprint from-price.`),
  suite: from('Full suite', MEDIA_PACKAGE_FROM.suite, 'Showcase plus twilight exterior. Small footprint from-price.'),
  floor_plan_only: fixed('Floor plan only', MEDIA_PACKAGE_FROM.floor_plan_only, 'Standalone branded 2D floor plan capture — no HDR, no drone.'),
  drone: band('Licensed drone', DRONE_RATE, 'Add-on, priced by footprint.'),
  reel: band('Cinematic reel', REEL_RATE, 'Add-on, priced by footprint.'),
  tour: band(TOUR_NAME, TOUR_RATE, TOUR_BLURB),
  visit: band(VISIT_NAME, VISIT_RATE, `${VISIT_BLURB} ${VISIT_PACKAGING}`),
  twilight: band('Twilight exterior', TWILIGHT_RATE, 'Add-on, priced by footprint.'),
  staging: fixed('Virtual staging', STAGING_PER_IMAGE, 'Per photo, before tax. Not included in any package.', 'photo'),
  rush: fixed('Rush delivery', RUSH_FLAT, 'Flat fee, faster than the standard 24–48h target.'),
} as const

export type MediaOfferId = keyof typeof MEDIA_OFFERS

/** Service + OfferCatalog for listing media. Pass only the offers the page visibly prices. */
export function mediaServiceSchema(opts: { url: string; name?: string; offers: readonly MediaOfferId[] }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    ...(opts.name ? { name: opts.name } : {}),
    serviceType: 'Real estate photography and media',
    url: opts.url,
    provider: ORG_REF,
    areaServed: AREA_SERVED_SCHEMA,
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Bricks listing media (CAD, pre-tax)',
      itemListElement: opts.offers.map((id) => MEDIA_OFFERS[id]),
    },
  }
}
