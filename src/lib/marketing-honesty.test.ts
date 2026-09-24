/**
 * Launch honesty: marketing surfaces must not invent Bricks volume stats.
 * CoStar founder lineage may be named; bare "14,000+" as a Bricks metric is not.
 */
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, it } from 'node:test'
import { TRAVEL_BASE } from './coverage'

const root = join(__dirname, '..')

function readSrc(rel: string): string {
  return readFileSync(join(root, rel), 'utf8')
}

describe('marketing honesty — no invented Bricks volume', () => {
  const pages = [
    'app/page.tsx',
    'app/about/page.tsx',
    'components/BlogPostLayout.tsx',
  ]

  for (const rel of pages) {
    it(`${rel} has no bare 14,000+ Bricks volume claim`, () => {
      const src = readSrc(rel)
      assert.equal(
        /14,?000\+/.test(src),
        false,
        `${rel} still contains 14,000+ — scrub or attribute as CoStar-only founder history outside Bricks metrics`,
      )
    })
  }

  it('about attributes CoStar lineage without inventing Bricks count', () => {
    const src = readSrc('app/about/page.tsx')
    assert.match(src, /CoStar/)
    assert.doesNotMatch(src, /14,?000\+/)
  })
})

describe('travel base matches Companion / quote-engine', () => {
  it('TRAVEL_BASE is 6330 Montevideo Rd Mississauga', () => {
    assert.ok(Math.abs(TRAVEL_BASE.lat - 43.5860724) < 1e-6)
    assert.ok(Math.abs(TRAVEL_BASE.lng - -79.7482435) < 1e-6)
  })
})
