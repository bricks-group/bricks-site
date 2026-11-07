import type { Article, ArticleWithCollection, Block, Collection, CollectionSlug } from './types'
import { COLLECTIONS } from './collections'
import { GETTING_STARTED } from './articles/getting-started'
import { BOOKING } from './articles/booking'
import { CHANGES_REFUNDS } from './articles/changes-refunds'
import { PLANS_BILLING } from './articles/plans-billing'
import { AGENTS, TEAMS, BROKERAGES, BUILDERS, PROPERTY_MANAGERS, COMMERCIAL, INVESTORS, REITS } from './articles/clients'
import { INTEGRATIONS } from './articles/integrations'
import { ACCOUNT_SECURITY } from './articles/account-security'
import { PHOTOGRAPHERS } from './articles/photographers'
import { HOME_SERVICES, TRADE_VENDORS } from './articles/home-services'
import { TROUBLESHOOTING } from './articles/troubleshooting'
import { CONTACT } from './articles/contact'

export { COLLECTIONS }
export type { Article, ArticleWithCollection, Block, Collection, CollectionSlug }

/** Content review date. Bump when articles are re-checked against the product. */
export const HELP_UPDATED = '2026-10-26'

const BY_COLLECTION: Record<CollectionSlug, Article[]> = {
  'getting-started': GETTING_STARTED,
  booking: BOOKING,
  'changes-refunds': CHANGES_REFUNDS,
  'plans-billing': PLANS_BILLING,
  agents: AGENTS,
  teams: TEAMS,
  brokerages: BROKERAGES,
  builders: BUILDERS,
  'property-managers': PROPERTY_MANAGERS,
  commercial: COMMERCIAL,
  investors: INVESTORS,
  reits: REITS,
  'home-services': HOME_SERVICES,
  integrations: INTEGRATIONS,
  'account-security': ACCOUNT_SECURITY,
  photographers: [...PHOTOGRAPHERS, ...TRADE_VENDORS],
  troubleshooting: TROUBLESHOOTING,
  contact: CONTACT,
}

export const ARTICLES: ArticleWithCollection[] = COLLECTIONS.flatMap((c) =>
  BY_COLLECTION[c.slug].map((a) => ({ ...a, collection: c.slug, updated: a.updated ?? HELP_UPDATED })),
)

const BY_SLUG = new Map(ARTICLES.map((a) => [a.slug, a]))

export const articleHref = (a: { collection: string; slug: string }) => `/help/${a.collection}/${a.slug}`
/** Absolute canonical on the help hub host (help.brxs.ca serves /help at its root). */
export const helpCanonical = (href: string) => `https://help.brxs.ca${href.replace(/^\/help/, '') || '/'}`
export const collectionHref = (slug: string) => `/help/${slug}`

export function getCollection(slug: string): Collection | undefined {
  return COLLECTIONS.find((c) => c.slug === slug)
}
export function articlesIn(slug: string): ArticleWithCollection[] {
  return ARTICLES.filter((a) => a.collection === slug)
}
export function getArticle(collection: string, slug: string): ArticleWithCollection | undefined {
  const a = BY_SLUG.get(slug)
  return a && a.collection === collection ? a : undefined
}
export function articleBySlug(slug: string): ArticleWithCollection | undefined {
  return BY_SLUG.get(slug)
}
export function relatedTo(a: Article): ArticleWithCollection[] {
  const explicit = (a.related ?? []).map((s) => BY_SLUG.get(s)).filter((x): x is ArticleWithCollection => !!x)
  if (explicit.length >= 3) return explicit.slice(0, 5)
  const fill = ARTICLES.filter((x) => x.slug !== a.slug && !explicit.includes(x) && x.collection === (BY_SLUG.get(a.slug)?.collection))
  return [...explicit, ...fill].slice(0, 4)
}
export const POPULAR: ArticleWithCollection[] = ARTICLES.filter((a) => a.popular)

/** Strip inline marks: [label](href) -> label, **bold** -> bold. */
export function plain(s: string): string {
  return s.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/\*\*([^*]+)\*\*/g, '$1')
}

export function blockText(b: Block): string {
  switch (b.t) {
    case 'p': case 'h2': case 'note': case 'code': return b.x
    case 'ul': case 'ol': return b.items.join(' ')
    case 'table': return [...b.head, ...b.rows.flat()].join(' ')
    case 'fig': return b.caption
    case 'flow': return b.steps.map((s) => `${s.k} ${s.v}`).join(' ')
    case 'qa': return b.items.map((i) => `${i.q} ${i.a}`).join(' ')
  }
}
export function articleText(a: Article): string {
  return plain(a.body.map(blockText).join(' ')).replace(/\s+/g, ' ').trim()
}

/** Heading anchors for the table of contents. */
export function slugify(s: string): string {
  return plain(s).toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}
export function headings(a: Article): { id: string; text: string }[] {
  return a.body.filter((b): b is Extract<Block, { t: 'h2' }> => b.t === 'h2').map((b) => ({ id: slugify(b.x), text: plain(b.x) }))
}

import type { SearchDoc } from './search'
export type { SearchDoc }
export function searchIndex(): SearchDoc[] {
  return ARTICLES.map((a) => ({
    u: articleHref(a),
    t: a.title,
    s: a.summary,
    c: getCollection(a.collection)!.title,
    b: articleText(a),
  }))
}

/** Every link inside article text, for validation. */
export function articleLinks(a: Article): string[] {
  const out: string[] = []
  const all = a.body.map(blockText).join(' ') + ' ' + a.summary
  for (const m of all.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) out.push(m[1])
  return out
}
