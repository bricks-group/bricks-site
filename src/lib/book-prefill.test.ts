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
