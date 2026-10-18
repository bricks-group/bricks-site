import { test } from 'node:test'
import assert from 'node:assert/strict'
import { compactMoney, recommendPackage } from './book-recommend'

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

test('vacant turns on staging sized by bedrooms', () => {
  assert.deepEqual(
    (({ staging, stagingImages }) => ({ staging, stagingImages }))(recommendPackage({ details: { typeClass: 'condo', beds: 2, vacant: true } })),
    { staging: true, stagingImages: 4 },
  )
  assert.equal(recommendPackage({ details: { vacant: true, beds: 9 } }).stagingImages, 8)
  assert.equal(recommendPackage({ details: { vacant: true, beds: 0 } }).stagingImages, 3)
  assert.equal(recommendPackage({ focus: 'staging' }).stagingImages, 5)
  assert.equal(recommendPackage({ details: { vacant: false } }).staging, false)
})
