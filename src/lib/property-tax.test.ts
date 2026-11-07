import { test } from 'node:test'
import assert from 'node:assert/strict'
import { isProvinceBlock, propertyTax, provinceFromAddress } from './property-tax'

test('property province from address', () => {
  assert.equal(provinceFromAddress('1 Spring Garden Rd, Halifax, NS B3J 3R4'), 'NS')
  assert.equal(provinceFromAddress('800 Robson St, Vancouver, British Columbia'), 'BC')
  assert.equal(provinceFromAddress('275 Rue Notre-Dame Est, Montréal, QC'), 'QC')
  assert.equal(provinceFromAddress('100 King St W, Toronto, ON M5X 1A9'), 'ON')
  assert.equal(provinceFromAddress('123 Main St, Toronto'), null)
})

test('rates and labels', () => {
  assert.deepEqual([propertyTax('ON').label, propertyTax('NS').label, propertyTax('BC').label, propertyTax('QC').label],
    ['HST (13%)', 'HST (14%)', 'GST (5%)', 'GST (5%)'])
  assert.equal(propertyTax(null).province, 'ON')
})

test('OS province blocks are recognised', () => {
  assert.ok(isProvinceBlock({ detail: "Bricks can't book work in Saskatchewan yet." }))
  assert.ok(!isProvinceBlock({ detail: 'Could not geocode address' }))
})
