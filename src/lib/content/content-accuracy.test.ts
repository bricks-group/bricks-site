/**
 * Content accuracy gate for the blog.
 *
 * Fails when a post:
 *  - has no entry (owner, review dates, sources) in src/lib/content/posts.ts,
 *  - is past its next review date,
 *  - uses a banned term or names a competitor,
 *  - imports jargon boilerplate,
 *  - states a $ figure that is not a Bricks price, a policy figure, or a listed outside figure,
 *  - states outside figures without a source.
 *
 * Fix the copy or the fact sheet (src/lib/content/facts.ts); don't loosen the test.
 */
import { test } from 'node:test'
import tradeSheet from '../trade-price-sheet.json'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { POSTS, postMeta } from './posts'
import { BANNED_TERMS, COMPETITOR_NAMES, FORBIDDEN_POST_IMPORTS, POLICY_FIGURES } from './facts'
import * as pricing from '../pricing'
import * as catalog from '../catalog'
import * as commercial from '../commercial'
import * as checkout from '../propertyCheckout'
import * as marketRates from '../market-rates'

const ROOT = join(__dirname, '..', '..', '..')
const BLOG = join(ROOT, 'src', 'app', 'blog')
const read = (p: string) => readFileSync(p, 'utf8')

const postDirs = readdirSync(BLOG, { withFileTypes: true })
  .filter((d) => d.isDirectory() && existsSync(join(BLOG, d.name, 'page.tsx')))
  .map((d) => d.name)
  .sort()

const postFile = (slug: string) => join(BLOG, slug, 'page.tsx')
const SHARED_FILES = [
  join(BLOG, 'page.tsx'),
  join(ROOT, 'src', 'components', 'BlogPostLayout.tsx'),
  join(ROOT, 'src', 'lib', 'guide-faqs.ts'),
  join(ROOT, 'src', 'lib', 'content', 'posts.ts'),
]

/** Strip comments so notes to writers don't trip the copy rules. */
function copyOf(src: string) {
  return src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1')
}

function todayToronto() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Toronto', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date())
}
const days = (a: string, b: string) => (Date.parse(b) - Date.parse(a)) / 86_400_000

// ---- Every Bricks price, gathered from the price modules ----
function collectNumbers(v: unknown, out: Set<number>, depth = 0) {
  if (depth > 6 || v == null) return
  if (typeof v === 'number' && Number.isFinite(v)) { out.add(v); return }
  if (Array.isArray(v)) { v.forEach((x) => collectNumbers(x, out, depth + 1)); return }
  if (typeof v === 'object') Object.values(v as Record<string, unknown>).forEach((x) => collectNumbers(x, out, depth + 1))
}
function bricksPrices(): Set<string> {
  const nums = new Set<number>()
  for (const mod of [pricing, catalog, commercial, marketRates]) collectNumbers(mod, nums)
  // Set trade prices (decided 21 Nov 2026).
  for (const rows of Object.values(tradeSheet.trades)) for (const r of rows as { price?: number }[]) if (typeof r.price === 'number') nums.add(r.price)
  for (const o of Object.values(checkout.ONE_OFFS)) nums.add(o.cents / 100)
  // Package totals: photo + any mix of drone, reel, tour, twilight, per band.
  const P = pricing as unknown as Record<string, number[]>
  const parts = ['DRONE_RATE', 'REEL_RATE', 'TOUR_RATE', 'TWILIGHT_RATE'].map((k) => P[k]).filter(Array.isArray)
  for (let band = 0; band < P.PHOTO_RATE.length; band++) {
    for (let mask = 0; mask < 1 << parts.length; mask++) {
      let sum = P.PHOTO_RATE[band]
      parts.forEach((r, i) => { if (mask & (1 << i)) sum += r[band] })
      nums.add(sum)
    }
  }
  const out = new Set<string>()
  for (const n of nums) {
    out.add(String(n))
    out.add(n.toLocaleString('en-CA'))
    out.add(n.toFixed(2))
  }
  return out
}
const PRICES = bricksPrices()

/** Literal dollar figures written in the source text (not ${expr} templates). */
function dollarFigures(src: string): string[] {
  const found: string[] = []
  for (const m of copyOf(src).matchAll(/\$(\d[\d,]*(?:\.\d+)?)(\s?[MK]\b)?/g)) found.push((m[1] + (m[2] ? m[2].trim() : '')).replace(/,$/, ''))
  return found
}

test('every blog post has a registry entry and passes its slug to the layout', () => {
  const registered = POSTS.map((p) => p.slug).sort()
  assert.deepEqual(registered, postDirs, 'src/lib/content/posts.ts must list exactly the posts in src/app/blog')
  for (const slug of postDirs) {
    const src = read(postFile(slug))
    const passesSlug = src.includes(`slug="${slug}"`) || (src.includes(`const SLUG = '${slug}'`) && src.includes('slug={SLUG}'))
    assert.ok(passesSlug, `${slug}: pass slug to <BlogPostLayout> so the review date and sources show`)
  }
})

test('every post has an owner and is inside its review window', () => {
  const today = todayToronto()
  for (const p of POSTS) {
    assert.ok(p.owner.trim().length > 3, `${p.slug}: needs an owner`)
    for (const d of [p.published, p.reviewedOn, p.nextReview]) assert.match(d, /^\d{4}-\d{2}-\d{2}$/, `${p.slug}: bad date ${d}`)
    assert.ok(p.reviewedOn <= today, `${p.slug}: reviewedOn ${p.reviewedOn} is in the future`)
    assert.ok(p.published <= p.reviewedOn, `${p.slug}: reviewed before it was published`)
    assert.ok(days(p.reviewedOn, p.nextReview) <= 100, `${p.slug}: next review must be within about a quarter of the last one`)
    assert.ok(today <= p.nextReview, `${p.slug}: review overdue (was due ${p.nextReview}). Re-check the facts and sources, then update reviewedOn and nextReview.`)
    assert.ok(!/\(\d{4}\)/.test(p.title), `${p.slug}: keep the title evergreen`)
  }
})

test('posts with outside figures cite a source', () => {
  for (const p of POSTS) {
    if (p.outsideFigures?.length) assert.ok(p.sources.length > 0, `${p.slug}: states outside figures but lists no sources`)
    for (const s of p.sources) {
      assert.ok(s.label.trim(), `${p.slug}: source needs a label`)
      if (s.href) assert.match(s.href, /^https:\/\//, `${p.slug}: source link must be https`)
      for (const name of COMPETITOR_NAMES) assert.ok(!(s.href ?? '').toLowerCase().includes(name.toLowerCase().replace(/\s/g, '')), `${p.slug}: source links to ${name}`)
    }
  }
})

const files = [...postDirs.map(postFile), ...SHARED_FILES]

test('no banned terms in blog copy', () => {
  const problems: string[] = []
  for (const f of files) {
    const src = copyOf(read(f))
    for (const { re, why } of BANNED_TERMS) {
      const m = src.match(re)
      if (m) problems.push(`${f.replace(ROOT + '/', '')}: "${m[0]}" (${why})`)
    }
  }
  assert.deepEqual(problems, [])
})

test('no competitor names in blog copy', () => {
  const problems: string[] = []
  for (const f of files) {
    const src = copyOf(read(f))
    for (const name of COMPETITOR_NAMES) {
      const re = new RegExp(`(^|[^A-Za-z0-9])${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^A-Za-z0-9]|$)`, 'i')
      if (re.test(src)) problems.push(`${f.replace(ROOT + '/', '')}: names ${name}`)
    }
  }
  assert.deepEqual(problems, [])
})

test('posts do not import jargon boilerplate', () => {
  for (const slug of postDirs) {
    const src = read(postFile(slug))
    for (const name of FORBIDDEN_POST_IMPORTS) assert.ok(!new RegExp(`\\b${name}\\b`).test(src), `${slug}: don't use ${name} in posts`)
  }
})

test('every $ figure is a Bricks price, a policy figure, or a sourced outside figure', () => {
  const problems: string[] = []
  const check = (label: string, src: string, outside: readonly string[]) => {
    for (const fig of dollarFigures(src)) {
      if (PRICES.has(fig) || (POLICY_FIGURES as readonly string[]).includes(fig) || outside.includes(fig)) continue
      problems.push(`${label}: $${fig} is not in the price list. Use the price constant, or list it in outsideFigures with a source.`)
    }
  }
  for (const slug of postDirs) check(slug, read(postFile(slug)), postMeta(slug).outsideFigures ?? [])
  for (const f of SHARED_FILES) check(f.replace(ROOT + '/', ''), read(f), [])
  assert.deepEqual(problems, [])
})

test('the price checker catches a made-up price', () => {
  assert.deepEqual(dollarFigures('HDR from $123 or $2M cover, from $${CORE_FROM}'), ['123', '2M'])
  assert.ok(!PRICES.has('123'))
  assert.ok(PRICES.has(String(pricing.PHOTO_RATE[0])))
})
