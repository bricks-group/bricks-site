/** Shared brand geography, coverage, product status, and spatial-product naming. */

/** Live product URLs — keep marketing links in one place. */
export const OS_URL = 'https://app.brxs.ca'
export const OS_LOGIN = `${OS_URL}/login`
export const COMPANION_URL = 'https://companion.brxs.ca'
export const GO_URL = 'https://go.brxs.ca'
/** Interactive demo build (mock data, nothing saves). Override per deploy with NEXT_PUBLIC_DEMO_APP_URL. */
export const DEMO_APP_URL = (process.env.NEXT_PUBLIC_DEMO_APP_URL || 'https://demo.brxs.ca').trim().replace(/\/$/, '')

/**
 * Locked product truth. Do not invent softer/harder versions.
 * One status beat per page (hero or a single closer). Store line: footer only.
 */
export const STATUS = {
  media: 'Media is live to book on this site and in Companion.',
  os: 'The Bricks app is live in preview at app.brxs.ca.',
  companion: 'Companion is live on the web.',
  go: 'The Bricks app for photographers is live on the web.',
  line: 'Media is live to book. The Bricks app is live in preview at app.brxs.ca. Companion and the photographer app are live on the web.',
  chrome: 'The system for Canadian real estate. Media is live to book. The Bricks app is live in preview at app.brxs.ca.',
  stores: 'Not in the App Store or Google Play yet.',
} as const

export const TOUR_SHORT = 'path walkthrough'
export const VISIT_SHORT = 'free-roam 3D'

/** Public name on www. Legal string is schema-only — never lead with it. */
export const FOUNDER_NAME = 'Raphael Merchant'
export const FOUNDER_LEGAL_NAME = 'Ajani Kamali Akio Shorter Merchant'
export const FOUNDER_PERSON = {
  '@type': 'Person' as const,
  name: FOUNDER_NAME,
  alternateName: FOUNDER_LEGAL_NAME,
  jobTitle: 'Founder',
  url: 'https://www.brxs.ca/about',
}

export const BROKERAGE_LOGOS = [
  { src: '/media/logos/royallepage.svg', alt: 'Royal LePage' },
  { src: '/media/logos/remax.png', alt: 'RE/MAX' },
  { src: '/media/logos/century21.png', alt: 'Century 21' },
  { src: '/media/logos/sothebys.png', alt: "Sotheby's International Realty" },
  { src: '/media/logos/sutton.svg', alt: 'Sutton' },
  { src: '/media/logos/cushman.svg', alt: 'Cushman & Wakefield' },
  { src: '/media/logos/smartcentres.svg', alt: 'SmartCentres' },
  { src: '/media/logos/boardwalk.png', alt: 'Boardwalk' },
  { src: '/media/logos/realstar.png', alt: 'Realstar' },
  { src: '/media/logos/homestead.svg', alt: 'Homestead' },
  { src: '/media/logos/engelvoelkers.png', alt: 'Engel & Völkers' },
] as const

/** Hub names for internal lists — live map geometry lives in lib/coverage.ts. */
export const COVERAGE_CITIES = [
  'Golden Horseshoe',
  'Ottawa',
  'Calgary',
  'Edmonton',
  'Vancouver',
] as const

/** Public coverage beat — Canada-wide launch; no city laundry list. */
export const COVERAGE_LINE = 'Serving Canada.'

export const AREA_SERVED_SCHEMA = [
  { '@type': 'Country' as const, name: 'Canada' },
]

export const KNOWS_ABOUT = [
  'Real estate photography',
  'Listing photos',
  'MLS photos',
  'Listing media',
  'Aerial photography',
  'Drone real estate photos',
  'Floor plans',
  'Virtual tours',
  'Virtual visits',
  'Gaussian splat',
  'Real estate media',
  'Drone photography',
  'Real estate photographer Canada',
]

/** Path-confined walkthrough. May be included in Showcase and Full suite. */
export const TOUR_NAME = 'Virtual tour'
export const TOUR_BLURB = 'Path walkthrough. You stay on the path.'

/** Free-roam Gaussian splat. Paid add-on to residential packages (included in commercial leasing/acquisition scopes). Never called a tour. */
export const VISIT_NAME = 'Virtual visit'
export const VISIT_BLURB = 'Free-roam 3D (Gaussian splat). Not a tour. Always a paid add-on.'
export const VISIT_PACKAGING = 'Virtual Visit is a separately priced add-on to residential listing-media packages; it is not included in Photos only, Essentials, Story, Showcase or Full suite. Commercial leasing sets and acquisition captures include it as specified in their scope.'

export const WORK_PHOTOS = [
  { src: '/media/work/01.jpg', alt: 'Row of brick homes on a tree-lined street — listing exterior' },
  { src: '/media/work/02.jpg', alt: 'Detached stone home exterior — listing photo' },
  { src: '/media/work/03.jpg', alt: 'Condo bedroom with a window view — listing photo' },
  { src: '/media/work/04.jpg', alt: 'Condo living room with a city view — listing photo' },
  { src: '/media/work/05.jpg', alt: 'Condo towers — exterior listing photo' },
  { src: '/media/work/06.jpg', alt: 'Drone view of a commercial park' },
  { src: '/media/work/07.jpg', alt: 'Living room — HDR listing photo' },
  { src: '/media/work/08.jpg', alt: 'Bedroom with artwork — listing photo' },
  { src: '/media/work/09.jpg', alt: 'Condo lobby with seating — listing photo' },
  { src: '/media/work/10.jpg', alt: 'Drone view of a new commercial development' },
  { src: '/media/work/11.jpg', alt: 'Drone view of an active construction site' },
  { src: '/media/work/12.jpg', alt: 'Commercial building exterior — listing photo' },
] as const

/** Sign-up account types the app's onboarding understands (app.brxs.ca signupIntent.js). */
export type SignupType =
  | 'solo' | 'team' | 'brokerage'
  | 'builder' | 'reit_leasing' | 'investor' | 'commercial' | 'property_manager'

/**
 * Create-account link with the account type highlighted in onboarding.
 * The person still confirms the type there; nothing is assumed.
 */
export function signupUrl(type: SignupType, email?: string): string {
  const q = new URLSearchParams({ mode: 'register', type })
  if (email) q.set('email', email)
  return `${OS_LOGIN}?${q.toString()}`
}
