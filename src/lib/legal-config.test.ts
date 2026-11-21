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
  assert.equal(legalPartyName(), 'Ajani Shorter Merchant')
  assert.equal(legalPartyLine(), 'Ajani Shorter Merchant, a sole proprietor operating as Bricks')
})

test('flag alone is not enough: needs the registration number too', () => {
  assert.equal(businessNameIsRegistered(true, ''), false)
  assert.equal(legalPartyName(true, ''), 'Ajani Shorter Merchant')
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
  for (const f of ['../app/about/page.tsx', './public-content.ts', '../components/Footer.tsx', '../app/newsletter/page.tsx', './help/jsonld.ts'])
    assert.ok(!read(f).includes('legalPartyName'), `${f} is marketing: say Bricks`)
  for (const f of ['../app/dpa/page.tsx', '../app/account-deletion/page.tsx']) assert.ok(read(f).includes('Read the details') && read(f).includes('legalPartyName'))
  assert.ok(read('./schema.ts').includes('legalName: LEGAL_NAME'))
})

test('no surface hardcodes either name', () => {
  for (const f of ['../app/terms/page.tsx', '../app/privacy/page.tsx', '../app/book/BookingWizard.tsx', './booking-copy.ts', './supplier.ts', '../components/Footer.tsx',
    '../app/about/page.tsx', '../app/dpa/page.tsx', '../app/account-deletion/page.tsx', '../app/newsletter/page.tsx',
    '../app/photographers/PhotographerForm.tsx', '../app/photographers/page.tsx', '../app/work-with-bricks/TradeApplyForm.tsx',
    './public-content.ts', './contact-mail.ts', './help/jsonld.ts', 
    './newsletter/config.ts', './newsletter/email.ts']) {
    const s = read(f)
    assert.ok(!/Ajani Shorter Merchant|bricks group/i.test(s.split('\n').filter((l) => !l.includes('postal.trim().replace')).join('\n')), `${f} hardcodes a legal name`)
  }
})

test('newsletter CASL line uses the current name even if the configured postal line has an old one', async () => {
  const { footerText } = await import('./newsletter/email')
  const t = footerText('https://www.brxs.ca', 'tok', 'Bricks Group · 6330 Montevideo Road, Mississauga, ON L5N 3V2, Canada')
  assert.ok(t.includes(legalPartyName() + ' · 6330 Montevideo Road'))
  assert.ok(!t.includes('Bricks Group'))
})

test('no blanket insurance claims on public copy', () => {
  const { execSync } = require('node:child_process') as typeof import('node:child_process')
  const out = execSync(`grep -rniE "insured (pilot|inspector|vendor|repair)|vetted, insured|pilots also carry" src --include=*.ts --include=*.tsx -l || true`, { cwd: new URL('../..', import.meta.url).pathname }).toString().split('\n').filter((f) => f && !f.endsWith('.test.ts'))
  assert.deepEqual(out, [])
})

test('terms and privacy keep a short summary per section with detail collapsed, and the old anchors', () => {
  const t = read('../app/terms/page.tsx')
  const p = read('../app/privacy/page.tsx')
  assert.ok(t.includes('<details>') && p.includes('<details>'))
  assert.ok(t.includes('id="refunds"') && p.includes('id="cookies"'))
  for (const s of ['5-reschedule', '12-law', '7-no-property']) assert.ok(t.includes(s))
})
