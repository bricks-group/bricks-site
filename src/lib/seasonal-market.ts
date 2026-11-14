// Seasonal market pages (Kam 2026-11-14: "updated to the current season, not just removed").
// One config, four seasons. The current season's URL renders; any other seasonal URL (and
// /market) 307s to it from middleware, so the switch happens on the date with no redeploy.

export type SeasonKey = 'winter' | 'spring' | 'summer' | 'fall'

export type SeasonReason = { title: string; body: string }
export type SeasonFaq = { q: string; a: string }

export type Season = {
  key: SeasonKey
  slug: string
  /** Breadcrumb / PAGE_NAMES label. */
  name: string
  title: string
  description: string
  badge: string
  h1: string
  sub: string
  cta: string
  reasonsOver: string
  reasonsH2: string
  reasons: readonly [SeasonReason, SeasonReason, SeasonReason]
  note: string
  closingOver: string
  closingH2: string
  closingLead: string
  faqs: readonly SeasonFaq[]
}

export const MARKET_ALIAS = '/market'
export const MARKET_TZ = 'America/Toronto'

const INCLUDED_FAQ: SeasonFaq = {
  q: "What's included?",
  a: 'HDR photos, licensed drone and a floor plan on every standard shoot. Reels and virtual tours are add-ons or come in larger packages. Virtual Visit is always a separate add-on.',
}
const WHERE_FAQ: SeasonFaq = {
  q: 'Where do you shoot?',
  a: 'Enter the address when you book and we confirm coverage before you pick a time or pay. Our service areas page lists where we shoot.',
}
const delivery = (tail: string): SeasonFaq => ({
  q: 'When do I get my media?',
  a: `We aim to deliver edited, MLS®-ready photos in 24 hours, other media in 24–48 hours, ${tail} included.`,
})
const PRICE_FAQ: SeasonFaq = {
  q: 'Do prices change by season?',
  a: 'No. Prices stay the same all year. Booking ahead only holds your date.',
}

export const SEASONS: Record<SeasonKey, Season> = {
  winter: {
    key: 'winter',
    slug: '/winter-market',
    name: 'Winter listing media',
    title: 'Winter Listing Photos & Real Estate Photography | Bricks',
    description: 'Winter listing media with Bricks: HDR photos, licensed drone and floor plans, planned around short daylight and snow. Same standard, same prices.',
    badge: 'Winter listing season',
    h1: 'Winter listings, shot for the light.',
    sub: 'Short days, planned around. Book ahead of the February relist.',
    cta: 'Book a winter shoot',
    reasonsOver: 'Why plan now',
    reasonsH2: 'Winter rewards a plan.',
    reasons: [
      { title: 'Short daylight', body: 'In December the sun sets before five. We book exteriors in the light that is left, and twilight exteriors show a warm, lit home.' },
      { title: 'Snow and ice', body: 'Cleared walks and a swept front step read well on camera. Plan a quick clear-up before the shoot.' },
      { title: 'The February relist', body: 'Listings slow over the holidays, then relist from late January into the early spring push. Holding a date now keeps you ready for it.' },
    ],
    note: 'Twilight exteriors help in short winter daylight. Drone flights depend on weather.',
    closingOver: 'Book ahead',
    closingH2: 'Be ready before the spring push.',
    closingLead: 'Same prices as always. Your shoot date is held once you book.',
    faqs: [
      PRICE_FAQ,
      { q: 'Can the drone fly in winter?', a: 'Often, yes. Drone flights depend on weather. If wind, snow or cold make a flight unsafe, the pilot skips the aerials and the rest of the shoot is still delivered. Email help@brxs.ca if you want to plan a later flight.' },
      { q: 'Should I clear the snow first?', a: 'Yes, if you can. Clear the driveway, walks and front step, and turn on the exterior lights. Snow on the lawn and roof is fine.' },
      { q: 'When should I book for a February listing?', a: 'Once you have a listing date. Late January and February fill as listings come back after the holidays.' },
      INCLUDED_FAQ,
      WHERE_FAQ,
      delivery('winter'),
    ],
  },
  spring: {
    key: 'spring',
    slug: '/spring-market',
    name: 'Spring listing media',
    title: 'Spring Listing Photos & Real Estate Photography | Bricks',
    description: 'Plan spring listing media with Bricks: HDR photos, licensed drone and floor plans, booked ahead of the busiest season. Same standard, same prices.',
    badge: 'Spring listing season',
    h1: 'Spring is the busiest market.',
    sub: 'Book ahead and hold your shoot date.',
    cta: 'Book a spring shoot',
    reasonsOver: 'Why book ahead',
    reasonsH2: 'The peak fills first.',
    reasons: [
      { title: 'Peak listings', body: 'March to May brings the most new listings of the year, and the most shoot requests.' },
      { title: 'Weekend open houses', body: 'Miss your shoot by a few days and you can miss the weekend your listing needed.' },
      { title: 'Finite capacity', body: "Capacity doesn't grow when demand does. Earlier bookings keep their date." },
    ],
    note: 'Longer days bring back early evening exteriors. Drone flights depend on weather.',
    closingOver: 'Book ahead',
    closingH2: 'Lock your date before the calendar fills.',
    closingLead: 'Same prices as always. Your shoot date is held once you book.',
    faqs: [
      { q: 'Is booking early a discount?', a: 'No. Prices stay the same. Booking early holds your shoot date before the spring rush.' },
      { q: 'How far out should I book?', a: 'As soon as you have a listing date in mind. April and May fill fastest.' },
      { q: 'What about spring rain?', a: 'Interiors shoot in any weather. Drone flights depend on weather; if it is not safe to fly, the pilot skips the aerials and the rest of the shoot is still delivered.' },
      INCLUDED_FAQ,
      WHERE_FAQ,
      delivery('spring'),
    ],
  },
  summer: {
    key: 'summer',
    slug: '/summer-market',
    name: 'Summer listing media',
    title: 'Summer Listing Photos & Cottage Photography | Bricks',
    description: 'Summer listing media with Bricks: HDR photos, licensed drone and floor plans for homes, cottages and recreational property. Same standard, same prices.',
    badge: 'Summer listing season',
    h1: 'Long light, full gardens.',
    sub: 'The year’s best exteriors. Book your summer shoot.',
    cta: 'Book a summer shoot',
    reasonsOver: 'Why summer',
    reasonsH2: 'Show the whole property.',
    reasons: [
      { title: 'Long light', body: 'Long evenings give more time for exteriors, and green lawns and gardens at their best.' },
      { title: 'Cottage and recreational', body: 'Waterfront, cottage and recreational property shows best when the water is open and the trees are full.' },
      { title: 'Aerials that explain the lot', body: 'Licensed drone shows the shoreline, the acreage and how the property sits.' },
    ],
    note: 'Drone flights depend on weather and airspace. Waterfront and rural addresses are confirmed when you book.',
    closingOver: 'Book',
    closingH2: 'Shoot while the light is long.',
    closingLead: 'Same prices as always. Your shoot date is held once you book.',
    faqs: [
      PRICE_FAQ,
      { q: 'Do you shoot cottages?', a: 'Yes, where we cover the area. Enter the address when you book and we confirm before you pick a time or pay.' },
      { q: 'Can the drone show the waterfront?', a: 'Usually. Drone flights depend on weather and airspace. If a flight is not safe or allowed, the pilot skips the aerials and the rest of the shoot is still delivered.' },
      INCLUDED_FAQ,
      WHERE_FAQ,
      delivery('summer'),
    ],
  },
  fall: {
    key: 'fall',
    slug: '/fall-market',
    name: 'Fall listing media',
    title: 'Fall Listing Photos & Real Estate Photography | Bricks',
    description: 'Plan fall listing media with Bricks: HDR photos, licensed drone and floor plans, with optional tours and Virtual Visit. Same standard, same prices.',
    badge: 'Fall listing season',
    h1: 'The fall market moves fast.',
    sub: 'Book early and hold your shoot date.',
    cta: 'Reserve a fall slot',
    reasonsOver: 'Why book early',
    reasonsH2: 'Everyone lists at once.',
    reasons: [
      { title: 'Compressed timing', body: 'Fall listings cluster between Labour Day and late October.' },
      { title: 'Weekend open houses', body: 'Miss your shoot by a few days and you can miss the weekend your listing needed.' },
      { title: 'Finite capacity', body: "Capacity doesn't grow when demand does. Earlier bookings keep their date." },
    ],
    note: 'Twilight exteriors and cinematic reels help in shorter fall daylight.',
    closingOver: 'Book early',
    closingH2: 'Lock your date before the calendar fills.',
    closingLead: 'Same prices as always. Your shoot date is held once you book.',
    faqs: [
      { q: 'Is booking early a discount?', a: 'No. Prices stay the same. Booking early holds your shoot date before the fall rush.' },
      { q: 'How far out should I book?', a: 'As soon as you have a listing date in mind. September and early October fill fastest.' },
      INCLUDED_FAQ,
      WHERE_FAQ,
      delivery('fall'),
    ],
  },
}

export const SEASON_SLUGS: readonly string[] = Object.values(SEASONS).map((s) => s.slug)

/** Calendar month (1-12) and day in Toronto time. */
export function torontoMonthDay(now: Date): { month: number; day: number } {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: MARKET_TZ, month: 'numeric', day: 'numeric' }).formatToParts(now)
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value)
  return { month: get('month'), day: get('day') }
}

/** Ontario listing seasons: winter Nov 15–Feb, spring Mar–May, summer Jun–Aug, fall Sep 1–Nov 14. */
export function seasonFor(now: Date = new Date()): SeasonKey {
  const { month, day } = torontoMonthDay(now)
  if (month === 11) return day >= 15 ? 'winter' : 'fall'
  if (month === 12 || month <= 2) return 'winter'
  if (month <= 5) return 'spring'
  if (month <= 8) return 'summer'
  return 'fall'
}

export function currentSeason(now: Date = new Date()): Season {
  return SEASONS[seasonFor(now)]
}

/** Where a seasonal URL should go right now, or null to render it. */
export function marketRedirect(pathname: string, now: Date = new Date()): string | null {
  const p = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname
  if (p !== MARKET_ALIAS && !SEASON_SLUGS.includes(p)) return null
  const target = currentSeason(now).slug
  return p === target ? null : target
}
