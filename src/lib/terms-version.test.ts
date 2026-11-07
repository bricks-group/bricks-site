import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { TERMS_VERSION, termsAcceptanceMeta } from './terms-version'

const read = (p: string) => readFileSync(new URL(p, import.meta.url), 'utf8')

test('acceptance meta carries version and a second-precision UTC time', () => {
  const m = termsAcceptanceMeta(new Date('2026-11-07T16:00:01.456Z'))
  assert.deepEqual(m, { terms_version: TERMS_VERSION, terms_accepted_at: '2026-11-07T16:00:01Z' })
})

test('version matches Bricks-OS known versions format', () => {
  assert.match(TERMS_VERSION, /^\d{4}-\d{2}-\d{2}$/)
})

test('/book/site checkout shows the same terms line as /book and sends the version', () => {
  const site = read('../app/book/site/SiteBookingForm.tsx')
  const wiz = read('../app/book/BookingWizard.tsx')
  for (const src of [site, wiz]) {
    assert.match(src, /By paying you agree to our <Link href="\/terms"/)
    assert.match(src, /terms_version: TERMS_VERSION/)
  }
  assert.match(read('../app/api/book/commercial-checkout/route.ts'), /'terms_version'/)
  assert.match(read('../app/api/create-checkout/route.ts'), /\.\.\.termsAcceptanceMeta\(\)/)
})

test('lead webhook records terms and retries without them if columns are missing', () => {
  const wh = read('../../supabase/functions/stripe-webhook/index.ts')
  assert.match(wh, /terms_version:String\(u\.terms_version\)/)
  assert.match(wh, /delete g\.terms_version,delete g\.terms_accepted_at/)
})
