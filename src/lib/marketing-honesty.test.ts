/**
 * Launch honesty: marketing may cite founder (Raphael Merchant) career experience
 * including 14,000+ properties shot. Ban only claims that treat 14k as *Bricks
 * platform bookings / Bricks volume this quarter* (invented product metrics).
 * CoStar lineage naming remains fine alongside founder experience.
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

/** Lies: 14k framed as Bricks product volume / bookings / this-quarter metric. */
const BRICKS_VOLUME_LIE =
  /14,?000\+[^.\n]{0,80}\b(Bricks\s+(platform\s+)?(bookings?|volume)|bookings?\s+this\s+quarter|platform\s+volume\s+this\s+quarter)\b/i

describe('marketing honesty — founder 14k allowed; Bricks-volume lies banned', () => {
  const pages = [
    'app/page.tsx',
    'app/about/page.tsx',
    'components/BlogPostLayout.tsx',
  ]

  for (const rel of pages) {
    it(`${rel} does not claim 14k is Bricks platform bookings/volume this quarter`, () => {
      const src = readSrc(rel)
      assert.equal(
        BRICKS_VOLUME_LIE.test(src),
        false,
        `${rel} frames 14,000+ as Bricks platform volume — keep as founder experience only`,
      )
    })
  }

  it('home trust + closer restore founder 14k', () => {
    const src = readSrc('app/page.tsx')
    assert.match(src, /14,?000\+/)
    assert.match(src, /founder experience/i)
    assert.match(src, /14,?000\+\s+properties shot/i)
  })

  it('about restores 14k credentials + CoStar lineage', () => {
    const src = readSrc('app/about/page.tsx')
    assert.match(src, /14,?000\+/)
    assert.match(src, /CoStar/)
    assert.match(src, /founder career experience|regional creative lead/i)
  })

  it('blog layout allows founder-experience 14k', () => {
    const src = readSrc('components/BlogPostLayout.tsx')
    assert.match(src, /14,?000\+/)
    assert.match(src, /founder experience/i)
  })
})

describe('coverage TRAVEL_BASE is market hub (not founder-home fee base)', () => {
  it('TRAVEL_BASE stays Mississauga market hub coords for coverage map', () => {
    assert.ok(Math.abs(TRAVEL_BASE.lat - 43.5860724) < 1e-6)
    assert.ok(Math.abs(TRAVEL_BASE.lng - -79.7482435) < 1e-6)
  })
})

describe('marketing honesty — legacy static + outreach (founder 14k OK)', () => {
  const rootFiles = [
    '../../about.html',
    '../../outreach/social-campaign/first-post.md',
    '../../outreach/social-campaign/social-posts.md',
    '../../outreach/social-campaign/build_posters.py',
    '../../outreach/social-campaign/build_posters_photo.py',
  ]

  for (const rel of rootFiles) {
    it(`${rel} has no Bricks-platform 14k volume lie`, () => {
      const src = readFileSync(join(__dirname, rel), 'utf8')
      assert.equal(
        BRICKS_VOLUME_LIE.test(src),
        false,
        `${rel} frames 14,000+ as Bricks platform volume — founder experience only`,
      )
    })
  }

  it('about.html restores founder 14k credentials', () => {
    const src = readFileSync(join(__dirname, '../../about.html'), 'utf8')
    assert.match(src, /14,?000\+/)
    assert.match(src, /CoStar/)
  })
})



/** Ban framing Mississauga / Montevideo as the travel *fee* base (map hub OK). */
const TRAVEL_FEE_BASE_LIE =
  /(?:Base is Mississauga|25\s*km of Mississauga|from Mississauga is free|25\s*km from Mississauga|Mississauga and charges|Mississauga free,\s*then)/i

describe('marketing honesty — travel from assigned photographer base', () => {
  const staticSurfaces = [
    '../../pricing.html',
    '../../service-areas.html',
    '../../bricks-media-onepager.html',
    '../../bricks-media-email.html',
    '../../bricks-media-email.txt',
    '../../blog/gta-real-estate-media-cost-2026.html',
    '../../outreach/social-campaign/social-posts.md',
    '../../outreach/social-campaign/emails/02-standard-team.html',
  ]

  for (const rel of staticSurfaces) {
    it(`${rel} does not price travel from Mississauga fee base`, () => {
      const src = readFileSync(join(__dirname, rel), 'utf8')
      assert.equal(
        TRAVEL_FEE_BASE_LIE.test(src),
        false,
        `${rel} still frames Mississauga as travel fee base — use assigned photographer base / travel_pending`,
      )
    })
  }

  const nextSurfaces = [
    'app/pricing/page.tsx',
    'app/book/BookingWizard.tsx',
    'lib/quote-engine.ts',
    'app/api/create-checkout/route.ts',
  ]

  for (const rel of nextSurfaces) {
    it(`${rel} does not price travel from Mississauga fee base`, () => {
      const src = readSrc(rel)
      assert.equal(
        TRAVEL_FEE_BASE_LIE.test(src),
        false,
        `${rel} still frames Mississauga as travel fee base — use assigned photographer base / travel_pending`,
      )
    })
  }

  it('quote-engine pre-assign is travel_pending $0', () => {
    const src = readSrc('lib/quote-engine.ts')
    assert.match(src, /travel_pending\s*=\s*true/)
    assert.match(src, /const travel = 0/)
    assert.match(src, /do NOT use founder home \/ Montevideo/)
  })

  it('www create-checkout stamps travel_pending into Stripe metadata', () => {
    const src = readSrc('app/api/create-checkout/route.ts')
    assert.match(src, /travel_pending:\s*String\(!!q\.travel_pending\)/)
    assert.match(src, /Travel \$0 pending photographer assignment/)
  })

  it('edge create-checkout forces travel_pending even if quote is stale', () => {
    const src = readFileSync(
      join(__dirname, '../../supabase/functions/create-checkout/index.ts'),
      'utf8',
    )
    assert.match(src, /Force \$0 travel_pending/)
    assert.match(src, /q\.travel_pending = true/)
    assert.match(src, /stale edge quote still billed Mississauga\/Montevideo/)
  })
})
