import { test } from 'node:test'
import assert from 'node:assert/strict'
import { compactMoney, recommendPackage } from './book-recommend'
import { VIRTUAL_STAGING_ENABLED, stripVirtualStaging } from './pricing'

test('compact money', () => {
  assert.equal(compactMoney(2_640_000), '$2.64M')
  assert.equal(compactMoney(1_200_000), '$1.2M')
  assert.equal(compactMoney(2_000_000), '$2M')
  assert.equal(compactMoney(849_900), '$850K')
})

test('3,200 sq ft detached home -> Showcase', () => {
  const r = recommendPackage({ details: { typeClass: 'house', propertyType: 'Detached', sqft: 3200 } })
  assert.equal(r.pkg, 'showcase')
  assert.equal(r.reason, 'Recommended for a 3,200 sq ft detached home')
  assert.equal(r.visit, false)
})

test('luxury by price -> Full suite with Virtual Visit', () => {
  const r = recommendPackage({ details: { typeClass: 'house', propertyType: 'Detached', sqft: 3000, price: 2_640_000 } })
  assert.deepEqual([r.pkg, r.visit, r.reason], ['suite', true, 'Recommended for a $2.64M listing'])
})

test('luxury by size', () => {
  const r = recommendPackage({ details: { typeClass: 'condo', sqft: 4800, beds: 3 } })
  assert.deepEqual([r.pkg, r.reason], ['suite', 'Recommended for a 4,800 sq ft 3-bed condo'])
})

test('condo under the bands -> Essentials', () => {
  const r = recommendPackage({ details: { typeClass: 'condo', beds: 2, sqft: 850, price: 579_000 } })
  assert.deepEqual([r.pkg, r.reason], ['essentials', 'Recommended for an 850 sq ft 2-bed condo'])
})

test('price band alone -> Showcase', () => {
  const r = recommendPackage({ details: { typeClass: 'house', propertyType: 'Semi-Detached', price: 1_450_000 } })
  assert.deepEqual([r.pkg, r.reason], ['showcase', 'Recommended for a $1.45M listing'])
})

test('commercial -> Showcase', () => {
  assert.equal(recommendPackage({ details: { typeClass: 'commercial' } }).pkg, 'showcase')
})

test('acreage house -> Story (drone + reel)', () => {
  const r = recommendPackage({ details: { typeClass: 'house', propertyType: 'Detached', sqft: 1800, lotAcres: 2.5 } })
  assert.deepEqual([r.pkg, r.reason], ['story', 'Recommended for a 2.5-acre property'])
})

test('land -> Essentials', () => {
  assert.equal(recommendPackage({ details: { typeClass: 'land' } }).pkg, 'essentials')
})

test('nothing known -> Essentials with a plain reason', () => {
  const r = recommendPackage({})
  assert.deepEqual([r.pkg, r.visit, r.staging, r.reason], ['essentials', false, false, 'Recommended: photos, drone and a floor plan'])
})

test('tapped Virtual Visit gap turns the add-on on, package stays', () => {
  const r = recommendPackage({ details: { typeClass: 'condo', sqft: 900 }, focus: 'visit' })
  assert.deepEqual([r.pkg, r.visit], ['essentials', true])
})

test('tapped video gap raises to Story', () => {
  const r = recommendPackage({ details: { typeClass: 'condo', sqft: 900 }, focus: 'video' })
  assert.deepEqual([r.pkg, r.reason], ['story', 'Recommended: adds the reel this listing is missing'])
  // Already above Story: stays put.
  assert.equal(recommendPackage({ details: { sqft: 3000, typeClass: 'house' }, focus: 'video' }).pkg, 'showcase')
})

test('tapped floor plan with photos covered -> Floor plan only; with a photo gap -> Essentials', () => {
  assert.equal(recommendPackage({ details: { typeClass: 'condo' }, focus: 'floorplan', gaps: ['floorplan'] }).pkg, 'floorPlanOnly')
  assert.equal(recommendPackage({ details: { typeClass: 'condo' }, focus: 'floorplan', gaps: ['photos', 'floorplan'] }).pkg, 'essentials')
})

test('virtual staging off sale: never preselected, and quote/checkout bodies drop it', () => {
  if (VIRTUAL_STAGING_ENABLED) return
  assert.equal(recommendPackage({ details: { typeClass: 'condo', beds: 2, vacant: true } }).staging, false)
  assert.equal(recommendPackage({ focus: 'staging' }).staging, false)
  assert.deepEqual(stripVirtualStaging({ staging_addon: true, staging_images: 4, reel_addon: true }), { staging_addon: false, staging_images: 0, reel_addon: true })
})

test('vacant turns on staging sized by bedrooms', { skip: !VIRTUAL_STAGING_ENABLED && 'virtual staging off sale' }, () => {
  assert.deepEqual(
    (({ staging, stagingImages }) => ({ staging, stagingImages }))(recommendPackage({ details: { typeClass: 'condo', beds: 2, vacant: true } })),
    { staging: true, stagingImages: 4 },
  )
  assert.equal(recommendPackage({ details: { vacant: true, beds: 9 } }).stagingImages, 8)
  assert.equal(recommendPackage({ details: { vacant: true, beds: 0 } }).stagingImages, 3)
  assert.equal(recommendPackage({ focus: 'staging' }).stagingImages, 5)
  assert.equal(recommendPackage({ details: { vacant: false } }).staging, false)
})

test('weak photos: at least Essentials and the reason names the photo problem', () => {
  const condo = { typeClass: 'condo' as const, propertyType: 'Condo Apt', sqft: 850, beds: 2 }
  const r = recommendPackage({ details: condo, gaps: ['photos'], photoReason: 'phone' })
  assert.equal(r.pkg, 'essentials')
  assert.equal(r.reason, 'Recommended for an 850 sq ft 2-bed condo · Most photos on file are from a phone')
  const unknown = recommendPackage({ gaps: ['photos', 'visit'], photoReason: 'defects' })
  assert.equal(unknown.pkg, 'essentials')
  assert.equal(unknown.reason, 'Recommended: several photos on file are blurry or dark')
  const lux = recommendPackage({ details: { typeClass: 'house', price: 3_100_000 }, gaps: ['photos'], photoReason: 'low_res' })
  assert.equal(lux.pkg, 'suite')
  assert.equal(lux.reason, 'Recommended for a $3.1M listing · Most photos on file are low resolution')
})

test('photo reason is ignored without a photos gap', () => {
  const r = recommendPackage({ details: { typeClass: 'condo', sqft: 850 }, gaps: ['visit'], photoReason: 'phone' })
  assert.ok(!/phone/.test(r.reason))
})
