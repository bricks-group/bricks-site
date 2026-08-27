/** Shared brand geography, coverage, and spatial-product naming. */

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
export const TOUR_BLURB = 'Path-confined walkthrough. You stay on the path.'

/** Free-roam Gaussian splat. Always a paid add-on. Never packaged. Never called a tour. */
export const VISIT_NAME = 'Virtual visit'
export const VISIT_BLURB = 'Free-roam Gaussian splat (SuperSplat). You are not confined to a path.'
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
