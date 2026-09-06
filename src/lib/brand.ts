/** Shared brand geography, coverage, product status, and spatial-product naming. */

/** Live product URLs — keep marketing links in one place. */
export const OS_URL = 'https://app.brxs.ca'
export const OS_LOGIN = `${OS_URL}/login`
export const COMPANION_URL = 'https://companion.brxs.ca'
export const GO_URL = 'https://go.brxs.ca'

/**
 * Locked product truth. Do not invent softer/harder versions.
 * One status beat per page (hero or a single closer). Store line: footer only.
 */
export const STATUS = {
  media: 'Media is live to book on this site and in Companion.',
  os: 'OS is live in preview at app.brxs.ca.',
  companion: 'Companion is live on the web.',
  go: 'GO is live on the web.',
  line: 'Media is live to book. OS is live in preview at app.brxs.ca. Companion and GO are live on the web.',
  chrome: 'The operating system for Canadian real estate. Media is live to book. OS is live in preview at app.brxs.ca.',
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

/** Cities Bricks currently covers — operational, not brand identity. */
export const COVERAGE_CITIES = [
  'Toronto',
  'Mississauga',
  'Hamilton',
  'Durham',
  'York',
  'Niagara',
] as const

export const COVERAGE_LINE =
  'Currently covering Toronto, Mississauga, Hamilton, Durham, York, and Niagara.'

export const AREA_SERVED_SCHEMA = [
  { '@type': 'Country' as const, name: 'Canada' },
  ...COVERAGE_CITIES.map((name) => ({ '@type': 'City' as const, name })),
]

export const KNOWS_ABOUT = [
  'Real estate photography',
  'Aerial photography',
  'Floor plans',
  'Virtual tours',
  'Virtual visits',
  'Gaussian splat',
  'Real estate media',
  'Drone photography',
]

/** Path-confined walkthrough. May be included in Showcase and Full suite. */
export const TOUR_NAME = 'Virtual tour'
export const TOUR_BLURB = 'Path walkthrough. You stay on the path.'

/** Free-roam Gaussian splat. Always a paid add-on. Never packaged. Never called a tour. */
export const VISIT_NAME = 'Virtual visit'
export const VISIT_BLURB = 'Free-roam 3D (Gaussian splat). Not a tour. Always a paid add-on.'
export const VISIT_PACKAGING = 'Always a paid add-on — never included in any package.'

export const WORK_PHOTOS = [
  { src: '/media/work/01.jpg', alt: 'Residential street exterior' },
  { src: '/media/work/02.jpg', alt: 'Residential interior' },
  { src: '/media/work/03.jpg', alt: 'Residential interior' },
  { src: '/media/work/04.jpg', alt: 'Residential interior' },
  { src: '/media/work/05.jpg', alt: 'Residential interior' },
  { src: '/media/work/06.jpg', alt: 'Residential interior' },
  { src: '/media/work/07.jpg', alt: 'Residential interior' },
  { src: '/media/work/08.jpg', alt: 'Residential bedroom' },
  { src: '/media/work/09.jpg', alt: 'Retail interior' },
  { src: '/media/work/10.jpg', alt: 'Building exterior' },
  { src: '/media/work/11.jpg', alt: 'Interior HDR' },
  { src: '/media/work/12.jpg', alt: 'Residential interior' },
] as const
