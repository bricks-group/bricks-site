import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { ARTICLES, COLLECTIONS, articleBySlug, articleLinks, articlesIn, articleText, headings, searchIndex } from './index.ts'
import { search } from './search.ts'
import { DIAGRAMS } from './diagrams/svgs.ts'
import { articleLd } from './jsonld.ts'

describe('help centre content', () => {
  it('has a deep set of articles in every collection', () => {
    assert.ok(ARTICLES.length >= 60, `only ${ARTICLES.length} articles`)
    for (const c of COLLECTIONS) assert.ok(articlesIn(c.slug).length >= 2, `${c.slug} is thin`)
  })

  it('uses globally unique slugs and unique heading anchors', () => {
    const seen = new Set<string>()
    for (const a of ARTICLES) {
      assert.ok(/^[a-z0-9-]+$/.test(a.slug), a.slug)
      assert.ok(!seen.has(a.slug), `duplicate slug ${a.slug}`)
      seen.add(a.slug)
      const ids = headings(a).map((h) => h.id)
      assert.equal(new Set(ids).size, ids.length, `duplicate heading in ${a.slug}`)
    }
  })

  it('resolves every related slug and internal /help link', () => {
    for (const a of ARTICLES) {
      for (const r of a.related ?? []) assert.ok(articleBySlug(r), `${a.slug} -> missing related ${r}`)
      for (const href of articleLinks(a)) {
        if (!href.startsWith('/help')) continue
        const [, , col, slug] = href.split(/[?#]/)[0].split('/')
        if (slug) assert.equal(articleBySlug(slug)?.collection, col, `${a.slug} -> broken link ${href}`)
        else if (col) assert.ok(COLLECTIONS.some((c) => c.slug === col), `${a.slug} -> broken link ${href}`)
      }
    }
  })

  it('has a drawing for every diagram it references', () => {
    for (const a of ARTICLES) for (const b of a.body) if (b.t === 'fig') assert.ok(DIAGRAMS[b.id], `${a.slug} -> ${b.id}`)
  })

  it('never uses internal product names, the founder, or banned phrasing', () => {
    for (const a of ARTICLES) {
      const all = `${a.title} ${a.summary} ${articleText(a)}`
      assert.ok(!/bricks\s*os\b/i.test(all), `${a.slug}: "Bricks OS"`)
      assert.ok(!/\bGO\b/.test(all), `${a.slug}: "GO" as a product name`)
      assert.ok(!/vendor\s*os/i.test(all), `${a.slug}: "Vendor OS"`)
      assert.ok(!/down the street/i.test(all), `${a.slug}: "down the street"`)
      assert.ok(!/\b(raphael|merchant|kam)\b/i.test(all), `${a.slug}: founder name`)
      assert.ok(!/\b(color|center|favorite|organize|cancelation)\b/i.test(all), `${a.slug}: US spelling`)
    }
  })

  it('emits FAQPage for Q&A articles and HowTo for step articles', () => {
    for (const a of ARTICLES) {
      const types = articleLd(a).map((x) => (x as { '@type': string })['@type'])
      if (a.body.some((b) => b.t === 'qa')) assert.ok(types.includes('FAQPage'), a.slug)
      if (a.howto) assert.ok(types.includes('HowTo'), `${a.slug} is howto without steps`)
    }
  })
})

describe('help search', () => {
  const docs = searchIndex()
  it('indexes every article', () => assert.equal(docs.length, ARTICLES.length))
  it('finds refunds, drone and invite queries', () => {
    assert.ok(search(docs, 'refund').length > 0)
    assert.ok(search(docs, 'drone').some((h) => h.doc.u.includes('/photographers/') || h.doc.u.includes('/booking/')))
    assert.ok(search(docs, 'invite').length > 0)
  })
  it('requires every word to match', () => {
    assert.equal(search(docs, 'refund zzzqqq').length, 0)
    assert.equal(search(docs, '').length, 0)
  })
})
