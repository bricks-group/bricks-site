/**
 * Every blog post, with its owner, review dates and sources.
 *
 * - owner: who keeps the post accurate. Markez drafts; Raphael approves before it goes live.
 * - reviewedOn: the day every fact in the post was last checked against FACTS, the price
 *   modules and the sources below. Shown under each post and used as dateModified.
 * - nextReview: the quarterly check. The accuracy test fails once a post is overdue.
 * - sources: every outside claim (law, regulator, market figure) needs one here.
 * - outsideFigures: dollar figures in the post that are not Bricks prices. Each must be
 *   covered by a source. Bricks prices come from the price modules and need no entry.
 *
 * Checked by src/lib/content/content-accuracy.test.ts.
 */

export type Source = { label: string; href?: string; note?: string }
export type PostMeta = {
  slug: string
  title: string
  topic: 'Software' | 'Brokerages' | 'Site Progress' | 'Property managers' | 'Listing media' | 'Drone' | 'Home services'
  published: string
  reviewedOn: string
  nextReview: string
  owner: string
  sources: readonly Source[]
  outsideFigures?: readonly string[]
}

const OWNER = 'Markez (drafts) · Raphael Merchant (approves)'
const REVIEWED = '2026-11-21'
const NEXT = '2027-02-21'

export const TC_CATEGORIES: Source = {
  label: 'Transport Canada: Drone operation categories and pilot certificates',
  href: 'https://tc.canada.ca/en/aviation/drone-safety/learn-rules-you-fly-your-drone/drone-operation-categories-pilot-certificates',
}
export const TC_SAFELY: Source = {
  label: 'Transport Canada: Flying your drone safely and legally',
  href: 'https://tc.canada.ca/en/aviation/drone-safety/learn-rules-you-fly-your-drone/flying-your-drone-safely-legally',
}
export const TC_ADVANCED: Source = {
  label: 'Transport Canada: Advanced operations',
  href: 'https://tc.canada.ca/en/aviation/drone-safety/learn-rules-you-fly-your-drone/advanced-operations',
}
export const TC_2025: Source = {
  label: 'Transport Canada: 2025 summary of changes to Canada’s drone regulations',
  href: 'https://tc.canada.ca/en/aviation/drone-safety/2025-summary-changes-canada-drone-regulations',
}
export const TC_CERT: Source = {
  label: 'Transport Canada: Getting a drone pilot certificate',
  href: 'https://tc.canada.ca/en/aviation/drone-safety/drone-pilot-licensing/getting-drone-pilot-certificate',
}
export const CARS_ALTITUDE: Source = {
  label: 'Canadian Aviation Regulations, section 901.25 (maximum altitude)',
  href: 'https://laws-lois.justice.gc.ca/eng/regulations/SOR-96-433/section-901.25.html',
}
export const NAV_CANADA: Source = {
  label: 'NAV CANADA: Drone flight planning (NAV Drone)',
  href: 'https://www.navcanada.ca/en/flight-planning/drone-flight-planning.aspx',
}
export const LTB_FORMER_TENANT: Source = {
  label: 'Landlord and Tenant Board: Collecting money a former tenant owes',
  href: 'https://tribunalsontario.ca/documents/ltb/Brochures/Collecting%20Money%20a%20Former%20Tenant%20Owes%20%28EN%29.html',
}
export const TRESA: Source = {
  label: 'Trust in Real Estate Services Act, 2002 (Ontario e-Laws)',
  href: 'https://www.ontario.ca/laws/statute/02r30',
}
export const RECO: Source = { label: 'Real Estate Council of Ontario (RECO)', href: 'https://www.reco.on.ca/' }
export const HOME_INSPECTION_ACT: Source = {
  label: 'Home Inspection Act, 2017 (Ontario e-Laws): not yet in force',
  href: 'https://www.ontario.ca/laws/statute/17h05',
}
export const GTA_RATE_REVIEW: Source = {
  label: 'Bricks review of published starting rates from eight GTA listing-media providers, 22 July 2026',
  note: 'Provider names are kept off this site. Next check due with this post’s review.',
}

export const POSTS: readonly PostMeta[] = [
  { slug: 'what-is-a-real-estate-operating-system', title: 'What is a real estate operating system?', topic: 'Software', published: '2026-11-14', reviewedOn: REVIEWED, nextReview: NEXT, owner: OWNER, sources: [] },
  { slug: 'brokerage-software-ontario', title: 'What brokerage software needs to do in Ontario', topic: 'Brokerages', published: '2026-11-14', reviewedOn: REVIEWED, nextReview: NEXT, owner: OWNER, sources: [TRESA, RECO] },
  { slug: 'drone-progress-reports-ontario-builders', title: 'Drone progress reporting for Ontario builders', topic: 'Site Progress', published: '2026-11-14', reviewedOn: REVIEWED, nextReview: NEXT, owner: OWNER, sources: [TC_CATEGORIES, NAV_CANADA] },
  { slug: 'move-out-condition-report-ontario', title: 'Move-in and move-out condition reports in Ontario', topic: 'Property managers', published: '2026-11-14', reviewedOn: REVIEWED, nextReview: NEXT, owner: OWNER, sources: [LTB_FORMER_TENANT] },
  { slug: 'drone-licence-canada', title: 'Drone licence in Canada: Basic vs Advanced', topic: 'Drone', published: '2026-11-07', reviewedOn: REVIEWED, nextReview: NEXT, owner: OWNER, sources: [TC_CATEGORIES, TC_CERT, TC_SAFELY, TC_2025, NAV_CANADA], outsideFigures: ['1,000', '3,000', '5,000'] },
  { slug: 'drone-photography-rules-ontario', title: 'Drone photography rules for real estate in Ontario', topic: 'Drone', published: '2026-07-22', reviewedOn: REVIEWED, nextReview: NEXT, owner: OWNER, sources: [TC_SAFELY, TC_CATEGORIES, TC_ADVANCED, TC_2025, CARS_ALTITUDE, NAV_CANADA] },
  { slug: 'home-inspection-cost-ontario', title: 'Home inspection cost in Ontario: what sets the price', topic: 'Home services', published: '2026-11-07', reviewedOn: REVIEWED, nextReview: NEXT, owner: OWNER, sources: [HOME_INSPECTION_ACT] },
  { slug: 'move-out-cleaning-checklist', title: 'Move-out cleaning checklist, room by room', topic: 'Home services', published: '2026-11-07', reviewedOn: REVIEWED, nextReview: NEXT, owner: OWNER, sources: [] },
  { slug: 'what-is-an-orthomosaic', title: 'What is an orthomosaic?', topic: 'Site Progress', published: '2026-11-07', reviewedOn: REVIEWED, nextReview: NEXT, owner: OWNER, sources: [] },
  { slug: 'photogrammetry-for-construction', title: 'Photogrammetry for construction: a practical guide', topic: 'Site Progress', published: '2026-11-07', reviewedOn: REVIEWED, nextReview: NEXT, owner: OWNER, sources: [NAV_CANADA] },
  { slug: 'canada-real-estate-photography-cost-2026', title: 'What real estate photography costs in Canada', topic: 'Listing media', published: '2026-09-12', reviewedOn: REVIEWED, nextReview: NEXT, owner: OWNER, sources: [TC_CATEGORIES] },
  { slug: 'gta-real-estate-media-cost-2026', title: 'What real estate photography costs in the GTA', topic: 'Listing media', published: '2026-07-22', reviewedOn: REVIEWED, nextReview: NEXT, owner: OWNER, sources: [GTA_RATE_REVIEW],
    outsideFigures: ['149', '329', '200', '289', '39', '100', '90', '325', '99', '300', '169', '400', '525', '175', '225', '25', '349', '599'] },
  { slug: '3d-tour-vs-video-walkthrough', title: 'Virtual tour or video walkthrough: which fits the listing?', topic: 'Listing media', published: '2026-07-22', reviewedOn: REVIEWED, nextReview: NEXT, owner: OWNER, sources: [] },
  { slug: 'whats-included-listing-shoot', title: 'What’s included in a Bricks listing shoot', topic: 'Listing media', published: '2026-07-22', reviewedOn: REVIEWED, nextReview: NEXT, owner: OWNER, sources: [] },
]

export function postMeta(slug: string): PostMeta {
  const p = POSTS.find((x) => x.slug === slug)
  if (!p) throw new Error(`No post meta for ${slug}`)
  return p
}

/** "21 November 2026" */
export function longDate(iso: string): string {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-CA', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
}
