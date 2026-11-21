import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { legalPartyName, legalPartyLine, businessNameIsRegistered, BUSINESS_NAME_REGISTERED } from './legal-config'
import { SUPPLIER } from './supplier'
import { LEGAL_NAME } from './schema'
import { buildBookingCopy } from './booking-copy'

const read = (p: string) => readFileSync(new URL(p, import.meta.url), 'utf8')

test('default: owner legal name, trading as Bricks, switch off', () => {
  assert.equal(BUSINESS_NAME_REGISTERED, false)
  assert.equal(legalPartyName(), 'AJANI SHORTERMERCHANT')
  assert.equal(legalPartyLine(), 'AJANI SHORTERMERCHANT, a sole proprietor operating as Bricks')
})

test('flag alone is not enough: needs the registration number too', () => {
  assert.equal(businessNameIsRegistered(true, ''), false)
  assert.equal(legalPartyName(true, ''), 'AJANI SHORTERMERCHANT')
})

test('registered with BIN renders Bricks Group everywhere', () => {
  assert.equal(legalPartyName(true, '123456789'), 'Bricks Group')
  assert.equal(legalPartyLine(true, '123456789'), 'Bricks Group')
})

test('every surface reads the config', () => {
  assert.equal(SUPPLIER.legalName, legalPartyName())
  assert.equal(SUPPLIER.legalPartyLine, legalPartyLine())
  assert.equal(LEGAL_NAME, legalPartyName())
  const copy = buildBookingCopy({ id: 'cs_1', payment_status: 'paid', amount_total: 11300, metadata: { email: 'a@b.ca', tax_cents: '1300', subtotal_cents: '10000' } })!
  assert.ok(copy.text.includes(SUPPLIER.legalPartyLine))
  assert.ok(read('../app/terms/page.tsx').includes('SUPPLIER.legalPartyLine'))
  assert.ok(read('../app/privacy/page.tsx').includes('SUPPLIER.legalPartyLine'))
  assert.ok(read('../app/book/BookingWizard.tsx').includes('SUPPLIER.legalPartyLine'))
  assert.ok(read('../components/Footer.tsx').includes('LEGAL_NAME'))
  assert.ok(read('./schema.ts').includes('legalName: LEGAL_NAME'))
})

test('no surface hardcodes either name', () => {
  for (const f of ['../app/terms/page.tsx', '../app/privacy/page.tsx', '../app/book/BookingWizard.tsx', './booking-copy.ts', './supplier.ts', '../components/Footer.tsx']) {
    const s = read(f)
    assert.ok(!/AJANI SHORTERMERCHANT|Bricks Group/.test(s), `${f} hardcodes a legal name`)
  }
})
