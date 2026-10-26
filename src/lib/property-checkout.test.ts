import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { ONE_OFFS, ONE_OFFS_FOR, checkCheckout, checkoutBody, money, tierForSqft, type CheckoutFields } from './propertyCheckout'

const base: CheckoutFields = {
  service_key: 'pm_listing_set', street: '88 Queen St E', unit: '4B', city: 'Toronto', sqft: '', move_kind: 'move_out', move_date: '',
  preferred_date: '2026-10-28', contact_name: 'Elena', contact_email: 'e@x.ca', contact_phone: '', site_contact_phone: '416 555 0100', access_notes: '',
}
const T = '2026-10-25'

test('approved prices, before HST', () => {
  const cents = Object.fromEntries(Object.values(ONE_OFFS).map((s) => [s.key, s.cents]))
  assert.deepEqual(cents, {
    pm_turnover: 29500, pm_condition_report: 14500, pm_listing_set: 19500, pm_listing_video: 25500, pm_building_set: 65000,
    cre_leasing_s: 59500, cre_leasing_m: 89500, cre_leasing_l: 145000, cre_aerial: 34900, inv_acquisition: 125000, inv_acquisition_mapped: 225000,
  })
  assert.equal(money(31410), '$314.10')
  assert.equal(money(145000), '$1,450')
  assert.equal(ONE_OFFS_FOR.reit_leasing.length, 11)
})

test('same rules as the server', () => {
  assert.equal(checkCheckout(base, T), '')
  assert.equal(checkCheckout({ ...base, preferred_date: '2026-10-25' }, T), 'Pick a date at least 1 day out.')
  assert.equal(checkCheckout({ ...base, service_key: 'cre_aerial', preferred_date: '2026-10-26' }, T), 'Pick a date at least 2 days out.')
  assert.equal(checkCheckout({ ...base, service_key: 'pm_turnover', move_date: '2026-10-01' }, T), 'A move-out report is shot within two weeks after the move-out date.')
  assert.equal(checkCheckout({ ...base, service_key: 'pm_condition_report', move_kind: 'move_in', move_date: '2026-11-01' }, T), '')
  assert.equal(checkCheckout({ ...base, service_key: 'cre_leasing_s', sqft: '6400' }, T), 'A 6,400 sq ft space takes the leasing set, up to 7,500 sq ft.')
  assert.match(checkCheckout({ ...base, service_key: 'cre_leasing_l', sqft: '25000' }, T), /quoted/)
  assert.match(checkCheckout({ ...base, site_contact_phone: '' }, T), /who lets us in/)
  assert.equal(tierForSqft('2,500'), 'cre_leasing_s')
})

test('body carries only the fields the service uses, all on the proxy allowlist', () => {
  const b = checkoutBody('investor', { ...base, service_key: 'inv_acquisition', sqft: '900', move_date: '2026-10-20' })
  assert.equal(b.unit, undefined)
  assert.equal(b.sqft, undefined)
  assert.equal(b.move_kind, undefined)
  const route = readFileSync(join(__dirname, '..', 'app', 'api', 'book', 'property-checkout', 'route.ts'), 'utf8')
  const allow = route.slice(route.indexOf('const FIELDS'), route.indexOf('] as const'))
  const all = checkoutBody('commercial', { ...base, service_key: 'cre_leasing_m', sqft: '6400', company: 'Bayview' })
  for (const k of [...Object.keys(all), 'move_kind', 'move_date']) assert.ok(allow.includes(`'${k}'`), k)
})
