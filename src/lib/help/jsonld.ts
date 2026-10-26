import type { ArticleWithCollection, Block } from './types'
import { articleHref, getCollection, plain } from './index'

export const BASE = 'https://www.brxs.ca'

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((x, i) => ({ '@type': 'ListItem', position: i + 1, name: x.name, item: BASE + x.path })),
  }
}

/** FAQPage from qa blocks, HowTo from the first numbered list when the article is a how-to. */
export function articleLd(a: ArticleWithCollection): object[] {
  const out: object[] = []
  const c = getCollection(a.collection)!
  out.push(breadcrumbLd([
    { name: 'Help centre', path: '/help' },
    { name: c.title, path: `/help/${c.slug}` },
    { name: a.title, path: articleHref(a) },
  ]))
  const qas = a.body.filter((b): b is Extract<Block, { t: 'qa' }> => b.t === 'qa').flatMap((b) => b.items)
  if (qas.length) {
    out.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: qas.map((x) => ({ '@type': 'Question', name: plain(x.q), acceptedAnswer: { '@type': 'Answer', text: plain(x.a) } })),
    })
  }
  const steps = a.howto ? a.body.find((b): b is Extract<Block, { t: 'ol' }> => b.t === 'ol') : undefined
  if (steps) {
    out.push({
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: a.title,
      description: a.summary,
      step: steps.items.map((s, i) => ({ '@type': 'HowToStep', position: i + 1, text: plain(s) })),
    })
  }
  if (!qas.length && !steps) {
    out.push({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: a.title,
      description: a.summary,
      dateModified: a.updated,
      publisher: { '@type': 'Organization', name: 'Bricks Group', url: BASE },
      mainEntityOfPage: BASE + articleHref(a),
    })
  }
  return out
}
