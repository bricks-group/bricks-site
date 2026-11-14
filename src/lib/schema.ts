import {
  AREA_SERVED_SCHEMA,
  OS_URL,
  TOUR_BLURB,
  TOUR_NAME,
  VISIT_BLURB,
  VISIT_NAME,
  VISIT_PACKAGING,
} from '@/lib/brand'
import { OFFICE_PLANS, SOFTWARE_PLANS } from '@/lib/catalog'
import { SOFTWARE_MODULES } from '@/lib/software-modules'
import { BRICKS_DEFINITION, LISTING_MEDIA_DESCRIPTION, VIRTUAL_VISIT_DESCRIPTION, SITE_PROGRESS_DESCRIPTION } from '@/lib/public-content'
import {
  DRONE_RATE,
  MEDIA_PACKAGE_FROM,
  REEL_RATE,
  RUSH_FLAT,
  STAGING_PER_IMAGE,
  VIRTUAL_STAGING_ENABLED,
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
  description: BRICKS_DEFINITION,
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
  telephone: '+12893127425',
  contactPoint: [
    {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'help@brxs.ca',
      telephone: '+12893127425',
      areaServed: 'CA',
      availableLanguage: ['en'],
    },
    {
      '@type': 'ContactPoint',
      contactType: 'general enquiries',
      email: 'hello@brxs.ca',
      areaServed: 'CA',
      availableLanguage: ['en'],
    },
    {
      '@type': 'ContactPoint',
      contactType: 'privacy enquiries',
      email: 'privacy@brxs.ca',
      areaServed: 'CA',
      availableLanguage: ['en'],
    },
  ],
  knowsAbout: ['Real estate software', 'Listing media', 'Virtual Visit', 'Site Progress', 'Drone mapping', 'Orthomosaics', 'Progress reports', 'Real estate photography'],
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

/** Emit only the plans visibly covered by the page. Amounts derive from the public catalog. */
export function osSoftwareApplicationSchema(pageUrl: string) {
  const individual = SOFTWARE_PLANS.flatMap((plan) => {
    const monthly = Number(plan.price.match(/[\d,]+/)?.[0].replaceAll(',', '') ?? 0)
    const annual = plan.yearly.match(/\$([\d,]+)/)?.[1]
    return [
      { '@type': 'Offer', name: `${plan.name} — monthly`, url: 'https://www.brxs.ca/pricing', priceCurrency: 'CAD', price: monthly,
        priceSpecification: { '@type': 'UnitPriceSpecification', price: monthly, priceCurrency: 'CAD', billingDuration: 'P1M' } },
      ...(annual ? [{ '@type': 'Offer', name: `${plan.name} — annual`, url: 'https://www.brxs.ca/pricing', priceCurrency: 'CAD', price: Number(annual.replaceAll(',', '')),
        priceSpecification: { '@type': 'UnitPriceSpecification', price: Number(annual.replaceAll(',', '')), priceCurrency: 'CAD', billingDuration: 'P1Y' } }] : []),
    ]
  })
  const brokerage = OFFICE_PLANS.map((p) => ({
    '@type': 'Offer', name: `${p.name} (${p.seats})`, url: pageUrl, priceCurrency: 'CAD', price: p.seatPricePerYear,
    priceSpecification: { '@type': 'UnitPriceSpecification', price: p.seatPricePerYear, priceCurrency: 'CAD', unitText: 'seat per year', billingDuration: 'P1Y' },
  }))
  const offers = pageUrl.endsWith('/brokerage') ? brokerage
    : pageUrl.endsWith('/pricing') ? [...individual, ...brokerage]
    : individual.filter((p) => p.name === 'Clay — monthly' || p.name === 'Keystone — monthly')
  return {
    '@context': 'https://schema.org', '@type': 'SoftwareApplication', '@id': 'https://www.brxs.ca/#software',
    name: 'Bricks', description: BRICKS_DEFINITION, applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web', url: OS_URL, provider: { '@id': ORG_ID }, publisher: { '@id': ORG_ID }, offers,
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
  rush: fixed('Rush delivery', RUSH_FLAT, 'Flat fee, faster than the standard target (photos 24h · other media 24–48h).'),
} as const

export type MediaOfferId = keyof typeof MEDIA_OFFERS

/** Service + OfferCatalog for listing media. Pass only the offers the page visibly prices. */
export function mediaServiceSchema(opts: { url: string; name?: string; offers: readonly MediaOfferId[] }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': 'https://www.brxs.ca/#listing-media',
    name: opts.name ?? 'Bricks listing media',
    description: LISTING_MEDIA_DESCRIPTION,
    serviceType: 'Real estate photography and media',
    url: opts.url,
    provider: ORG_REF,
    areaServed: AREA_SERVED_SCHEMA,
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Bricks listing media (CAD, pre-tax)',
      itemListElement: opts.offers.filter((id) => VIRTUAL_STAGING_ENABLED || id !== 'staging').map((id) => MEDIA_OFFERS[id]),
    },
  }
}


export function virtualVisitServiceSchema(pageUrl: string) {
  return {
    '@context': 'https://schema.org', '@type': 'Service', '@id': 'https://www.brxs.ca/#virtual-visit',
    name: 'Bricks Virtual Visit', serviceType: 'Free-roam 3D property visit',
    description: VIRTUAL_VISIT_DESCRIPTION, url: pageUrl, provider: ORG_REF, areaServed: AREA_SERVED_SCHEMA,
  }
}

export function siteProgressServiceSchema(pageUrl: string) {
  return {
    '@context': 'https://schema.org', '@type': 'Service', '@id': 'https://www.brxs.ca/#site-progress',
    name: 'Bricks Site Progress', serviceType: 'Site progress documentation and drone mapping',
    description: SITE_PROGRESS_DESCRIPTION, url: pageUrl, provider: ORG_REF, areaServed: AREA_SERVED_SCHEMA,
  }
}

/** One focused Service entity for a single-service landing page. Offers come from MEDIA_OFFERS only. */
export function focusedServiceSchema(opts: {
  url: string; id: string; name: string; serviceType: string; description: string
  offers?: readonly MediaOfferId[]; areaServed?: readonly object[]
}) {
  const offers = (opts.offers ?? []).filter((id) => VIRTUAL_STAGING_ENABLED || id !== 'staging').map((id) => MEDIA_OFFERS[id])
  return {
    '@context': 'https://schema.org', '@type': 'Service', '@id': `https://www.brxs.ca${opts.id}`,
    name: opts.name, serviceType: opts.serviceType, description: opts.description, url: opts.url,
    provider: ORG_REF, areaServed: opts.areaServed ?? AREA_SERVED_SCHEMA,
    ...(offers.length ? { hasOfferCatalog: { '@type': 'OfferCatalog', name: `${opts.name} (CAD, pre-tax)`, itemListElement: offers } } : {}),
  }
}

export const ONTARIO_AREA_SCHEMA = [{ '@type': 'State', name: 'Ontario', containedInPlace: { '@type': 'Country', name: 'Canada' } }] as const

export function cityAreaSchema(city: string, province: string) {
  return [{ '@type': 'City', name: city, containedInPlace: { '@type': 'State', name: province } }] as const
}

/** BlogPosting for a guide under /blog. Same shape as the hand-written posts. */
export function blogPostingSchema(opts: { path: string; headline: string; description: string; datePublished: string; dateModified?: string; keywords: string; image: string }) {
  return {
    '@context': 'https://schema.org', '@type': 'BlogPosting',
    headline: opts.headline, description: opts.description,
    author: { '@type': 'Organization', name: 'Bricks', url: 'https://www.brxs.ca' },
    datePublished: opts.datePublished, dateModified: opts.dateModified ?? opts.datePublished,
    publisher: { ...ORG_REF, logo: LOGO_SCHEMA },
    mainEntityOfPage: `https://www.brxs.ca${opts.path}`,
    keywords: opts.keywords, image: opts.image,
  }
}

export function faqPageSchema(faqs: readonly { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  }
}

export const PAGE_NAMES: Record<string, string> = {
  '/about': 'About', '/pricing': 'Pricing', '/platform': 'Software', '/why-bricks': 'With and without Bricks',
  ...Object.fromEntries(SOFTWARE_MODULES.map((m) => [`/software/${m.slug}`, m.name])), '/media': 'Listing media',
  '/builders': 'Site Progress for builders', '/investors': 'Investors', '/agents': 'Agents',
  '/brokerage': 'Brokerages', '/teams': 'Teams', '/reits': 'REITs', '/commercial': 'Commercial',
  '/property-managers': 'Property managers', '/book': 'Book listing media',
  '/book/property': 'Book a property visit', '/book/site': 'Book Site Progress',
  '/contact': 'Contact', '/gallery': 'Gallery', '/service-areas': 'Service areas',
  '/real-estate-photography': 'Real estate photography', '/photographers': 'Photographers',
  '/work-with-bricks': 'Work with Bricks', '/services': 'Home services', '/blog': 'Guides',
  '/fall-market': 'Fall listing media', '/legal': 'Legal', '/terms': 'Terms of Service',
  '/privacy': 'Privacy Policy', '/dpa': 'Data Processing Agreement', '/account-deletion': 'Account deletion',
  '/blog/3d-tour-vs-video-walkthrough': 'Virtual tours vs video walkthroughs',
  '/blog/canada-real-estate-photography-cost-2026': 'Canada photography costs',
  '/blog/gta-real-estate-media-cost-2026': 'GTA media costs',
  '/blog/whats-included-listing-shoot': 'What a listing shoot includes',
  '/blog/drone-photography-rules-ontario': 'Ontario drone rules',
  '/work-with-bricks/staging': 'Staging vendors', '/work-with-bricks/cleaning': 'Cleaning vendors',
  '/work-with-bricks/inspections': 'Inspection vendors', '/work-with-bricks/measurement': 'Measurement vendors',
  '/drone-photography': 'Drone photography', '/virtual-tours': 'Virtual tours', '/real-estate-video': 'Real estate video',
  '/drone-mapping': 'Drone mapping', '/home-staging': 'Home staging', '/home-inspection-ontario': 'Home inspection (Ontario)',
  '/move-out-cleaning': 'Move-out and turnover cleaning',
  '/real-estate-photography/toronto': 'Toronto', '/real-estate-photography/ottawa': 'Ottawa',
  '/real-estate-photography/calgary': 'Calgary', '/real-estate-photography/vancouver': 'Vancouver',
  '/blog/drone-licence-canada': 'Drone licence in Canada', '/blog/what-is-an-orthomosaic': 'What is an orthomosaic',
  '/blog/photogrammetry-for-construction': 'Photogrammetry for construction',
  '/blog/home-inspection-cost-ontario': 'Home inspection cost in Ontario',
  '/blog/move-out-cleaning-checklist': 'Move-out cleaning checklist',
}

/** Help pages already have their own visible breadcrumbs and JSON-LD. */
export function siteBreadcrumbItems(pathname: string) {
  const name = PAGE_NAMES[pathname]
  if (!name) return []
  const parent = pathname.startsWith('/blog/') ? '/blog'
    : pathname.startsWith('/work-with-bricks/') ? '/work-with-bricks'
    : pathname.startsWith('/real-estate-photography/') ? '/real-estate-photography'
    : pathname.startsWith('/software/') ? '/platform' : undefined
  return [{ name: 'Home', path: '/' }, ...(parent ? [{ name: PAGE_NAMES[parent], path: parent }] : []), { name, path: pathname }]
}
