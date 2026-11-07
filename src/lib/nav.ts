import { moduleBySlug, moduleHref } from './software-modules'

export const HELP_URL = 'https://help.brxs.ca'

export type NavItem = { href: string; label: string; detail: string }
export type NavGroup = { label: string; items: NavItem[] }

function mod(slug: string, label: string, href?: string): NavItem {
  const m = moduleBySlug(slug)
  if (!m) throw new Error(`nav: unknown software module ${slug}`)
  return { href: href ?? moduleHref(slug), label, detail: m.blurb }
}

/** Software menu: "All software", then three labelled groups. Every item opens its /software/* page. */
export const softwareGroups: NavGroup[] = [
  { label: 'Sell', items: [mod('deals', 'Deals'), mod('listings', 'Listings')] },
  {
    label: 'Get it done',
    items: [
      mod('booking-and-dispatch', 'Bookings'),
      { ...mod('booking-and-dispatch', 'Vendor dispatch', `${moduleHref('booking-and-dispatch')}#how`), detail: 'The right vendor, assigned and paid' },
      mod('documents-and-delivery', 'Delivery'),
    ],
  },
  // There is no chat in Bricks: "Updates" covers notifications, emails and deal rooms.
  { label: 'Run the business', items: [mod('updates', 'Updates'), mod('teams-and-roles', 'Team'), mod('payments', 'Payments')] },
]

/** Flat list (footer, tests). */
export const softwareParts: NavItem[] = softwareGroups.flatMap((g) => g.items)

/** Who it's for: equal weight, builders first. */
export const audienceLinks: NavItem[] = [
  { href: '/builders', label: 'Builders & developers', detail: 'Site Progress, reports and investor updates' },
  { href: '/agents', label: 'Agents & brokerages', detail: 'Listings, media and deals in one file' },
  { href: '/teams', label: 'Teams', detail: 'Brokerage teams on one system' },
  { href: '/property-managers', label: 'Property managers', detail: 'Condition reports and turnovers' },
  { href: '/photographers', label: 'Vendors', detail: 'Jobs at a fixed rate, paid automatically' },
]
