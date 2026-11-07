/**
 * Canonical retrieval index for the Bricks help assistant.
 *
 * Built only from the published help articles in lib/help (the same source that
 * renders www.brxs.ca/help), so the assistant can never cite anything that is not
 * a live help page. Each article carries a content hash; the index version is a
 * hash over every article hash, so a content change always produces a new version
 * that is recorded with every answer and escalation.
 */
import { createHash } from 'node:crypto'
import { ARTICLES, HELP_UPDATED, articleHref, blockText, getCollection, plain, slugify } from '../index'
import type { ArticleWithCollection } from '../types'

export const SITE = 'https://www.brxs.ca'

export type Chunk = {
  id: string
  url: string
  /** Section anchor URL when the chunk is under an h2. */
  anchorUrl: string
  title: string
  section: string
  collection: string
  text: string
  articleHash: string
}

export type RetrievalIndex = {
  version: string
  helpUpdated: string
  articleCount: number
  chunks: Chunk[]
  articles: { url: string; title: string; hash: string }[]
}

const sha = (s: string) => createHash('sha256').update(s).digest('hex')

function articleChunks(a: ArticleWithCollection, articleHash: string): Chunk[] {
  const url = `${SITE}${articleHref(a)}`
  const col = getCollection(a.collection)?.title ?? a.collection
  const sections: { section: string; parts: string[] }[] = [{ section: '', parts: [a.summary] }]
  for (const b of a.body) {
    if (b.t === 'h2') sections.push({ section: plain(b.x), parts: [] })
    else sections[sections.length - 1].parts.push(plain(blockText(b)))
  }
  return sections
    .map((s, i) => ({ s, i, text: s.parts.join(' ').replace(/\s+/g, ' ').trim() }))
    .filter((x) => x.text.length > 0)
    .map(({ s, i, text }) => ({
      id: `${a.slug}#${i}`,
      url,
      anchorUrl: s.section ? `${url}#${slugify(s.section)}` : url,
      title: a.title,
      section: s.section,
      collection: col,
      text,
      articleHash,
    }))
}

let cached: RetrievalIndex | null = null

export function buildIndex(): RetrievalIndex {
  if (cached) return cached
  const articles = ARTICLES.map((a) => {
    const canonical = JSON.stringify({ c: a.collection, s: a.slug, t: a.title, m: a.summary, b: a.body, u: a.updated })
    return { a, hash: sha(canonical) }
  })
  const version = sha(HELP_UPDATED + '|' + articles.map((x) => `${x.a.slug}:${x.hash}`).join('|')).slice(0, 16)
  cached = {
    version,
    helpUpdated: HELP_UPDATED,
    articleCount: articles.length,
    chunks: articles.flatMap((x) => articleChunks(x.a, x.hash.slice(0, 12))),
    articles: articles.map((x) => ({ url: `${SITE}${articleHref(x.a)}`, title: x.a.title, hash: x.hash.slice(0, 12) })),
  }
  return cached
}

export function isIndexedUrl(url: string): boolean {
  const base = url.split('#')[0]
  return buildIndex().articles.some((a) => a.url === base)
}
