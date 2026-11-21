/**
 * Bricks fact sheet: the plain-word truths blog posts and newsletters may state.
 *
 * Posts import these lines instead of retyping them. Prices are never typed here:
 * they come from the price modules checkout uses (pricing, catalog, commercial,
 * propertyCheckout). When a policy changes, change it here and every post follows.
 *
 * Checked by src/lib/content/content-accuracy.test.ts.
 */
import { TRAVEL_FREE_KM, TRAVEL_PER_KM } from '../pricing'

export const PRODUCT_NAME = 'Bricks'
export const AI_NAME = 'Brixton'

/** Who Bricks is for: the whole business, not only media. */
export const WHAT_BRICKS_IS =
  'Bricks is the one system for running a real estate business: deals, listings, bookings, vendors, documents, team and payments in one place.'

export const DELIVERY = {
  photos: 'Photos usually arrive within 24 hours of the shoot.',
  other: 'Other media usually arrives within 24 to 48 hours.',
  note: 'These are targets, not guarantees. Weather, airspace and site access can cause delays.',
} as const
export const DELIVERY_LINE = `${DELIVERY.photos} ${DELIVERY.other} ${DELIVERY.note}`

export const REFUND_LINE =
  'Cancel 24 hours or more before the shoot window for a full refund. Inside 24 hours, or on a no-show, there is no refund.'

export const BOOKING_LINE =
  'You pick an exact time from photographers’ live calendars. Bricks assigns the photographer before you pay, so travel is on the quote.'

export const TRAVEL_LINE = `Travel is free inside the no-travel-fee area on our coverage map. Outside it, the first ${TRAVEL_FREE_KM} km from the assigned photographer are free, then $${TRAVEL_PER_KM.toFixed(2)} a km.`

export const TAX_LINE = 'Prices are in CAD, plus tax based on the property’s province.'

/** Kam, 21 Nov 2026: every Bricks drone pilot holds an Advanced certificate. */
export const DRONE_PILOT_LINE = 'Every Bricks drone pilot holds a Transport Canada Advanced certificate.'
export const DRONE_SITE_INSURANCE_LINE = 'Builder site work also needs at least $2M in drone liability insurance, checked for the flight date.'

/** Listing-media package names customers see. Nothing else is a "tier". */
export const PACKAGE_NAMES = ['Photos only', 'Essentials', 'Story', 'Showcase', 'Full suite', 'Floor plan only'] as const

export const VISIT_PLAIN = 'Virtual Visit is free-roam 3D. It is always booked on its own and is never part of a package.'

/** Non-price dollar figures Bricks states as policy (insurance minimums). */
export const POLICY_FIGURES = ['2M', '5M'] as const

/**
 * Words and phrases that must never appear in a post. Each has the reason, so the
 * test failure tells the writer what to do.
 */
export const BANNED_TERMS: readonly { re: RegExp; why: string }[] = [
  { re: /\bBricks OS\b/i, why: 'Customers see just "Bricks".' },
  { re: /\bBricks GO\b|\bGO app\b|\bGO\b/, why: 'The vendor app is not named "GO" to customers.' },
  { re: /\bthe OS\b/i, why: 'Say "Bricks", not "the OS".' },
  { re: /\bBricks AI\b/i, why: `The AI is called ${AI_NAME}.` },
  { re: /\b(Premium|Luxury|Elite) (tier|package)\b|bundled into Premium/i, why: `Bricks packages are: ${PACKAGE_NAMES.join(', ')}.` },
  { re: /two business days/i, why: 'Delivery promise must match DELIVERY.' },
  { re: /tailored per booking|tuned to (their|your) volume|volume (rates|discount)/i, why: 'Every price is public. No unpublished discounts.' },
  { re: /Gaussian splat|\bsplat\b/i, why: 'Jargon. Say "free-roam 3D".' },
  { re: /highest[- ]converting|sells? (listings )?faster|more saves and views/i, why: 'Performance claim without data (Competition Act s.74.01(1)(b)).' },
  { re: /guaranteed next morning|\bhonest (answer|standard)\b|padded (national )?package|serious desks/i, why: 'No jabs at other providers.' },
  { re: /on the hook|protects? (the listing, the client, and )?your licen[cs]e/i, why: 'No unsourced legal-liability claims.' },
  { re: /search both ways|never imply/i, why: 'Internal SEO notes do not belong in customer copy.' },
  { re: /\(2026\)|, 2026 \|/, why: 'Keep titles evergreen; the review date shows freshness.' },
]

/**
 * Other providers and marketplaces. Never named or linked (Kam's rule).
 * Matched case-insensitively as whole words.
 */
export const COMPETITOR_NAMES = [
  'HomeStars', 'Matterport', 'iGUIDE', 'REPhotos', 'Dee Visuals', 'Dreamhouse Photo', 'Green Day Photography',
  'Rise Real Estate Media', 'SnapScene', 'HDR E Photo', 'Virtuance', 'HDPhotoHub', 'Zillow', 'Houzz', 'Jiffy',
  'TaskRabbit', 'Thumbtack', 'DJI', 'Follow Up Boss', 'kvCORE', 'Lone Wolf', 'SkySlope', 'Dotloop', 'DocuSign',
  'Lofty', 'BoldTrail', 'BrokerBay', 'DroneDeploy', 'Pix4D', 'Propeller Aero',
] as const

/** Imports that pull jargon or long boilerplate into posts. */
export const FORBIDDEN_POST_IMPORTS = ['VISIT_BLURB', 'VISIT_PACKAGING', 'COVERAGE_LINE'] as const
