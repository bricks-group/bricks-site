/**
 * FAQ copy for /pricing and /book. The visible .faq block and the FAQPage JSON-LD are both
 * built from these arrays, so the schema always matches what visitors read. Every price comes
 * from the catalog (pricing.ts, catalog.ts); faq-prices.test.ts checks them.
 */
import { CORE_FROM, RUSH_FLAT, STAGING_PER_IMAGE, STAGING_PRICE_LABEL, TOUR_RANGE, TRAVEL_FREE_KM, TRAVEL_PER_KM, TWILIGHT_RANGE, VIRTUAL_STAGING_ENABLED, VISIT_PRICE_LABEL } from './pricing'
import { ADDONS_BLURB, OFFICE_PLANS, OFFICE_SEAT_PRICE_PER_MONTH, SOFTWARE_PLANS } from './catalog'
import { TOUR_NAME, VISIT_NAME } from './brand'

/** An answer is text plus optional links; `a` is the plain text used in the schema. */
export type FaqPart = string | { href: string; label: string }
export type RichFaq = { q: string; a: string; parts: readonly FaqPart[] }

const faq = (q: string, ...parts: FaqPart[]): RichFaq => ({ q, parts, a: parts.map((p) => (typeof p === 'string' ? p : p.label)).join('') })

export const TRAVEL_ANSWER = `Travel is $0 for properties inside the no-travel-fee area shown on our coverage map. Outside that area, travel is priced from the assigned photographer’s location: the first ${TRAVEL_FREE_KM} km are free, then $${TRAVEL_PER_KM.toFixed(2)} per additional km. Your assigned photographer and final travel fee are confirmed before payment.`
const MLS_SAFE = 'Yes. We keep real window views and don’t add fake skies by default. Twilight is shot for real at blue hour.'

const seatLine = OFFICE_PLANS.map((p) => `${p.name} (${p.id === 'boutique' ? p.seats : p.seats.replace(' seats', '')}), $${OFFICE_SEAT_PRICE_PER_MONTH[p.id]} monthly or $${p.seatPricePerYear} annually`).join('; ')
const planNames = SOFTWARE_PLANS.map((p) => p.name)
const planList = `${planNames.slice(0, -1).join(', ')} or ${planNames[planNames.length - 1]}`

export const PRICING_FAQS: readonly RichFaq[] = [
  faq('What’s in Essentials?', `HDR photos, licensed drone and a floor plan in one shoot, from $${CORE_FROM}.`),
  faq('Are the photos MLS®-safe?', MLS_SAFE),
  faq('How does travel work?', TRAVEL_ANSWER),
  faq('How is home size measured?', 'By finished area and complexity. Not sure? Choose “advise me” when you book and we’ll size it from the address.'),
  faq('Virtual tour or virtual visit?', `A virtual tour follows a set path (${TOUR_RANGE}) and comes with Showcase and Full suite. A virtual visit is free-roam 3D, booked as an add-on (${VISIT_PRICE_LABEL.toLowerCase()}).`),
  ...(VIRTUAL_STAGING_ENABLED ? [faq('What is virtual staging?', `Furniture added to photos of vacant rooms, marked as virtually staged. $${STAGING_PER_IMAGE} per photo, before tax, and not part of any package.`)] : []),
  faq('Where do you shoot?', 'Across Canada. Ask and we’ll confirm your area and quote any travel.'),
  faq('Can I add AI without upgrading?', ADDONS_BLURB),
  faq('Brokerage or individual plan?', `Agents choose ${planList}. Brokerages buy seats: ${seatLine}. Prices are per seat in CAD, before tax. Every seat gets all of Bricks plus trust accounting.`),
]

export const BOOK_FAQS: readonly RichFaq[] = [
  faq('What’s in Essentials?', `HDR interiors and exteriors, licensed drone and a branded floor plan, from $${CORE_FROM}.`),
  faq('Are the photos MLS®-safe?', MLS_SAFE),
  faq('How does travel work?', TRAVEL_ANSWER),
  faq(`Is the ${TOUR_NAME.toLowerCase()} included?`, `Not à la carte. It’s a ${TOUR_RANGE} add-on, and Showcase and Full suite include it.`),
  faq(`Is the ${VISIT_NAME.toLowerCase()} included?`, `No. It’s an add-on, ${VISIT_PRICE_LABEL.toLowerCase()}. Pick it in Step 2.`),
  faq('How fast is delivery?', `We aim to deliver photos 24 hours after the shoot, and other media in 24–48 hours. Rush (+$${RUSH_FLAT}) is faster. You get a media link and a property website, with MLS®, web and print downloads.`),
  faq('What’s included with twilight?', `Exterior photos at blue hour, with the windows lit and colour still in the sky. It’s an add-on, +${TWILIGHT_RANGE} by home size. Add it to any shoot in Step 2.`),
  ...(VIRTUAL_STAGING_ENABLED ? [faq('What is virtual staging?', `Furniture added to photos of vacant rooms, marked as virtually staged. ${STAGING_PRICE_LABEL}, before tax, and not part of any package. Choose how many photos in Step 2.`)] : []),
  faq('Can I reschedule after booking?', '24 hours or more before the shoot window is free. Inside 24 hours we will try; if we cannot, the cancellation schedule applies. Email ', { href: 'mailto:help@brxs.ca', label: 'help@brxs.ca' }, ' as soon as you know. See the ', { href: '/terms#refunds', label: 'cancellation policy' }, '.'),
  faq('What if I need to cancel?', '24 hours or more before the shoot window: full refund. Inside 24 hours, or no-show / no access: no refund. If we cancel on our side: full refund or a free reshoot, your choice. No callout fee. Full schedule in the ', { href: '/terms#refunds', label: 'Terms' }, '.'),
  faq('How do refunds work?', 'Refunds go back to your original payment method, typically within 5–10 business days.'),
  faq('Can I pay with Apple Pay or Google Pay?', 'Yes, plus cards. Apple Pay works in Safari and on iOS, Google Pay in Chrome and on Android. We don’t take PayPal, Klarna, Afterpay or Interac.'),
]
