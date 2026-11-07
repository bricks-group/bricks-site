/**
 * Contextual help referrals: the specific help articles a visitor on a given
 * page most likely needs, instead of a generic link to /help.
 * Every slug must resolve to a published article (checked in tests).
 */
import { articleBySlug, articleHref } from './index'

export type ContextLink = { href: string; title: string }

const BY_PATH: Record<string, string[]> = {
  '/': ['what-is-bricks', 'choose-an-account-type', 'book-a-listing-shoot', 'plans-overview'],
  '/contact': ['contact-us', 'request-a-walkthrough', 'raise-a-concern', 'privacy-requests'],
  '/book': ['book-a-listing-shoot', 'choose-a-shoot-time', 'pay-for-a-booking', 'reschedule-a-shoot', 'prepare-for-a-shoot'],
  '/book/property': ['how-quote-requests-work', 'book-without-an-account', 'pay-for-a-booking', 'cancel-a-shoot'],
  '/book/site': ['site-progress-overview', 'site-progress-pricing', 'site-pilots-insurance', 'progress-reports'],
  '/pricing': ['how-pricing-works', 'packages-explained', 'travel-fees', 'monthly-or-yearly', 'tax-and-currency'],
  '/platform': ['plans-overview', 'integrations-overview', 'agent-quick-start', 'upgrade-your-plan'],
  '/media': ['packages-explained', 'what-you-get', 'drone-rules', 'virtual-tour-or-virtual-visit', 'using-your-media'],
  '/builders': ['site-progress-overview', 'site-progress-pricing', 'progress-reports', 'measurements-and-3d'],
}

/** Exact path first, then the closest parent with a mapping (e.g. /book/x -> /book). Root never matches sub-paths. */
export function contextHelpFor(pathname: string): ContextLink[] {
  const clean = (pathname || '/').split(/[?#]/)[0].replace(/\/+$/, '') || '/'
  let key = clean
  while (!BY_PATH[key] && key.lastIndexOf('/') > 0) key = key.slice(0, key.lastIndexOf('/'))
  const slugs = BY_PATH[key]
  if (!slugs) return []
  return slugs
    .map((slug) => articleBySlug(slug))
    .filter((a): a is NonNullable<typeof a> => !!a)
    .map((a) => ({ href: articleHref(a), title: a.title }))
}

export const CONTEXT_HELP_PATHS = Object.keys(BY_PATH)
export const CONTEXT_HELP_SLUGS = BY_PATH
