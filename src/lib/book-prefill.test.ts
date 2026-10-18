import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readBookPrefill } from './book-prefill'

test('listing link fills address and the agent details', () => {
  const qs = new URLSearchParams({
    address: '12 Main St, Toronto, ON', name: 'Jane Agent', email: 'jane@realty.ca',
    phone: '416-555-0100', brokerage: 'Royal Realty',
  }).toString()
  assert.deepEqual(readBookPrefill('?' + qs), {
    address: '12 Main St, Toronto, ON', name: 'Jane Agent', email: 'jane@realty.ca',
    phone: '416-555-0100', brokerage: 'Royal Realty',
  })
})

test('no params, or the paid return, fills nothing', () => {
  assert.deepEqual(readBookPrefill(''), {})
  assert.deepEqual(readBookPrefill('?paid=1&session_id=cs_1&email=a@b.ca'), {})
})

test('bad values are dropped, others kept', () => {
  assert.deepEqual(readBookPrefill('?email=not-an-email&phone=call%20me&address=ab&name=%20%20Jane%20%20%20Agent%20'), { name: 'Jane Agent' })
})

test('markup and control characters are stripped; length capped', () => {
  const p = readBookPrefill('?name=' + encodeURIComponent('<script>x</script>\u0007Jane') + '&address=' + 'a'.repeat(400))
  assert.equal(p.name, 'script x /script Jane')
  assert.equal(p.address?.length, 160)
})

test('unknown params are ignored', () => {
  assert.deepEqual(readBookPrefill('?package=suite&id=123&email=jane@realty.ca'), { email: 'jane@realty.ca' })
})

import { readHandoff, canSkipToPackages, bookTypeOption } from './book-prefill'

test('listing details, focus and gaps ride as plain non-personal params', () => {
  const p = readBookPrefill('?type=Detached&sqft=3200&beds=4&baths=3.5&price=2640000&lot=0.4&vacant=1&focus=visit&gaps=photos,visit,bogus&step=packages')
  assert.deepEqual(p, {
    details: { propertyType: 'Detached', typeClass: 'house', sqft: 3200, beds: 4, baths: 3.5, price: 2640000, lotAcres: 0.4, vacant: true },
    focus: 'visit', gaps: ['photos', 'visit'], packages: true,
  })
})

test('out-of-range details are dropped', () => {
  assert.deepEqual(readBookPrefill('?sqft=12&price=5&beds=99&focus=nope'), {})
})

test('signed token shape is kept; junk is not', () => {
  const t = 'eyJ1IjoidTEiLCJrIjoic2hvb3QifQ.' + 'a'.repeat(32)
  assert.equal(readBookPrefill('?h=' + t).token, t)
  assert.equal(readBookPrefill('?h=<script>').token, undefined)
})

test('handoff response maps to a prefill that can skip to packages', () => {
  const p = readHandoff({
    address: '12 Main St, Toronto, ON', name: 'Jane Agent', email: 'jane@realty.ca', phone: '416-555-0100', brokerage: 'Royal Realty',
    details: { property_type: 'Condo Apt', type_class: 'condo', sqft: 850, bedrooms: 2, bathrooms: 1, list_price: 579000, lot_acres: null, vacant: null },
    gaps: ['visit', 'video'], focus: 'visit',
  })
  assert.equal(canSkipToPackages(p), true)
  assert.deepEqual(p.details, { propertyType: 'Condo Apt', typeClass: 'condo', sqft: 850, beds: 2, baths: 1, price: 579000 })
  assert.equal(bookTypeOption(p.details), 'Condo')
  assert.equal(canSkipToPackages({ ...p, phone: undefined }), false)
  assert.deepEqual(readHandoff(null), {})
})

test('type option mapping never picks Estate', () => {
  assert.equal(bookTypeOption({ typeClass: 'house', propertyType: 'Semi-Detached' }), 'Semi / Town')
  assert.equal(bookTypeOption({ typeClass: 'house', propertyType: 'Detached' }), 'Detached')
  assert.equal(bookTypeOption({ typeClass: 'house', propertyType: 'Triplex' }), 'Multiplex')
  assert.equal(bookTypeOption({ typeClass: 'land' }), '')
  assert.equal(bookTypeOption(undefined), '')
})
