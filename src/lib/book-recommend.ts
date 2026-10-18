/**
 * Recommended package on /book when it opens from a Bricks listing.
 *
 * Rule-based, from the listing's own details and media gaps. Packages and
 * prices are the real /book catalog (pricing.ts: Photos only, Essentials,
 * Story, Showcase, Full suite, Floor plan only; Virtual Visit and virtual
 * staging are add-ons). Nothing here changes a price; it only preselects.
 *
 * Rules, first match sets the base:
 *  1. Floor plan tapped and photos aren't a gap  -> Floor plan only.
 *  2. Luxury: price >= $2M or >= 4,000 sq ft      -> Full suite + Virtual Visit.
 *  3. Commercial                                  -> Showcase.
 *  4. Price >= $1.2M or >= 2,500 sq ft            -> Showcase.
 *  5. House or land on 1+ acre                    -> Story (drone + reel for the land).
 *  6. Land                                        -> Essentials (drone covers the lot).
 *  7. Condo, house, or unknown                    -> Essentials.
 * Then the tapped gap raises it to at least what covers that gap:
 *  video -> Story, drone/photos -> Essentials, visit -> Virtual Visit on,
 *  staging -> virtual staging on.
 * Vacant (a real signal from the listing) turns on virtual staging:
 * beds + 2 rooms (living, dining), 3 to 8, or 5 when beds are unknown.
 */
import type { Focus, ListingDetails } from './book-prefill'

export type PkgKey = 'floorPlanOnly' | 'photosOnly' | 'essentials' | 'story' | 'showcase' | 'suite'

export type Recommendation = {
  pkg: PkgKey
  visit: boolean
  staging: boolean
  stagingImages: number
  reason: string
}

const LADDER: PkgKey[] = ['photosOnly', 'essentials', 'story', 'showcase', 'suite']
const atLeast = (a: PkgKey, b: PkgKey): PkgKey =>
  a === 'floorPlanOnly' ? a : (LADDER.indexOf(a) >= LADDER.indexOf(b) ? a : b)

/** $2.64M, $850K, $1.2M. */
export function compactMoney(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2).replace(/\.?0+$/, '')}M`
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`
  return `$${Math.round(n)}`
}

function homeNoun(d: ListingDetails): string {
  const t = (d.propertyType || '').toLowerCase()
  if (d.typeClass === 'condo') return d.beds ? `${d.beds}-bed condo` : 'condo'
  if (d.typeClass === 'commercial') return 'commercial space'
  if (d.typeClass === 'land') return 'lot'
  if (/semi/.test(t)) return 'semi-detached home'
  if (/town|row/.test(t)) return 'townhouse'
  if (/detach/.test(t)) return 'detached home'
  return 'home'
}

function acres(n: number): string {
  const v = n >= 10 ? Math.round(n) : Math.round(n * 10) / 10
  return `${v}-acre`
}

function sizePhrase(d: ListingDetails): string {
  const noun = homeNoun(d)
  if (d.sqft && d.typeClass !== 'land') {
    const n = d.sqft.toLocaleString('en-US')
    return `${/^(8|11(,|$)|18(,|$))/.test(n) ? 'an' : 'a'} ${n} sq ft ${noun}`
  }
  return /^[aeiou]/.test(noun) ? `an ${noun}` : `a ${noun}`
}

export function recommendPackage(input: { details?: ListingDetails; focus?: Focus; gaps?: Focus[] }): Recommendation {
  const d = input.details || {}
  const focus = input.focus
  const gaps = input.gaps || []
  const price = d.price || 0
  const sqft = d.sqft || 0
  const bigLot = (d.lotAcres || 0) >= 1
  const luxury = price >= 2_000_000 || sqft >= 4000

  let pkg: PkgKey
  let reason: string
  let visit = false

  if (focus === 'floorplan' && !gaps.includes('photos')) {
    pkg = 'floorPlanOnly'
    reason = 'Recommended: your photos are covered, the floor plan isn’t'
  } else if (luxury) {
    pkg = 'suite'
    visit = true
    reason = price >= 2_000_000 ? `Recommended for a ${compactMoney(price)} listing` : `Recommended for ${sizePhrase(d)}`
  } else if (d.typeClass === 'commercial') {
    pkg = 'showcase'
    reason = sqft ? `Recommended for ${sizePhrase(d)}` : 'Recommended for a commercial listing'
  } else if (price >= 1_200_000 || sqft >= 2500) {
    pkg = 'showcase'
    reason = sqft >= 2500 || !price ? `Recommended for ${sizePhrase(d)}` : `Recommended for a ${compactMoney(price)} listing`
  } else if (bigLot && (d.typeClass === 'house' || d.typeClass === 'land')) {
    pkg = 'story'
    reason = `Recommended for a ${acres(d.lotAcres!)} property`
  } else if (d.typeClass === 'land') {
    pkg = 'essentials'
    reason = 'Recommended for land: drone covers the whole lot'
  } else if (d.typeClass) {
    pkg = 'essentials'
    reason = `Recommended for ${sizePhrase(d)}`
  } else {
    pkg = 'essentials'
    reason = 'Recommended: photos, drone and a floor plan'
  }

  if (pkg !== 'floorPlanOnly') {
    if (focus === 'video' && atLeast(pkg, 'story') !== pkg) {
      pkg = 'story'
      reason = 'Recommended: adds the reel this listing is missing'
    }
    if (focus === 'drone' || focus === 'photos') pkg = atLeast(pkg, 'essentials')
  }
  if (focus === 'visit') visit = true

  const staging = focus === 'staging' || d.vacant === true
  const rooms = d.beds !== undefined ? Math.min(8, Math.max(3, Math.round(d.beds) + 2)) : 5

  return { pkg, visit, staging, stagingImages: staging ? rooms : 1, reason }
}
