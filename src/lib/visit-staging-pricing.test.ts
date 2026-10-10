import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import {
  CORE_FROM,
  REEL_RATE,
  REEL_RANGE,
  RUSH_FLAT,
  STAGING_PER_IMAGE,
  STAGING_PRICE_LABEL,
  STORY_FROM,
  VISIT_PRICE_LABEL,
  VISIT_RATE,
  finalFootprintBand,
} from './pricing'
import { mediaAddonLines } from './quote-engine'

test('rush stays 75 and visit/staging racks are the approved dollars', () => {
  assert.equal(RUSH_FLAT, 75)
  assert.deepEqual([...VISIT_RATE], [249, 299, 349, 399])
  assert.equal(STAGING_PER_IMAGE, 35)
  assert.equal(STAGING_PRICE_LABEL, '$35 / photo')
  assert.equal(VISIT_PRICE_LABEL, '$249 / $299 / $349 / $399')
})

test('footprint band is the higher of sqft and property-type floor', () => {
  assert.equal(finalFootprintBand(900, 'Condo'), 0)
  assert.equal(finalFootprintBand(900, 'Estate'), 3)
  assert.equal(finalFootprintBand(5000, 'Condo'), 3)
  assert.equal(finalFootprintBand(1000, 'Semi / Town'), 1)
  assert.equal(finalFootprintBand(800, ''), 1)
  assert.equal(finalFootprintBand(2000, 'Detached'), 1)
})

test('visit and staging are add-on lines, not bundled, rush stays flat', () => {
  const lines = mediaAddonLines({
    finalBand: 0,
    reel: false,
    tour: false,
    twilight: false,
    rush: true,
    visit: true,
    stagingImages: 2,
  })
  assert.deepEqual(
    lines.map((l) => [l.label, l.amount]),
    [
      ['Rush delivery', 75],
      ['Virtual visit', 249],
      ['Virtual staging (2 images)', 70],
    ],
  )
  const packaged = mediaAddonLines({
    finalBand: 3,
    reel: true,
    tour: true,
    twilight: true,
    rush: false,
    visit: false,
    stagingImages: 0,
  })
  assert.equal(packaged.some((l) => l.label.startsWith('Virtual visit')), false)
  assert.equal(packaged.find((l) => l.label === 'Cinematic reel')?.amount, 349)
  assert.equal(packaged.find((l) => l.label === 'Virtual tour')?.amount, 299)
})

test('edge quote publishes the same visit rate and does not force staging off', () => {
  const edge = readFileSync(new URL('../../supabase/functions/quote/index.ts', import.meta.url), 'utf8')
  assert.match(edge, /const VISIT_RATE = \[249, 299, 349, 399\]/)
  assert.match(edge, /const REEL_RATE = \[199, 249, 299, 349\]/)
  assert.match(edge, /const RUSH_FLAT = 75/)
  assert.match(edge, /const STAGING_PER_IMAGE = 35/)
  assert.doesNotMatch(edge, /const staging = false/)
})

test('cinematic reel catalog matches OS/Companion charge rack (not package-embedded 149–249)', () => {
  assert.deepEqual([...REEL_RATE], [199, 249, 299, 349])
  assert.equal(REEL_RANGE, '$199–349')
  // Small Story “from” recomposes Essentials + new reel (Companion SQFT_PRICING stays locked separately)
  assert.equal(CORE_FROM, 248)
  assert.equal(STORY_FROM, 447)
  const mid = mediaAddonLines({
    finalBand: 1,
    reel: true,
    tour: false,
    twilight: false,
    rush: false,
    visit: false,
    stagingImages: 0,
  })
  assert.equal(mid.find((l) => l.label === 'Cinematic reel')?.amount, 249)
})
