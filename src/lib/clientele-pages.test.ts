import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { signupUrl } from './brand'
import { hubItems, HUB } from './site-progress-features'

const root = join(__dirname, '..', '..')
const read = (p: string) => readFileSync(join(root, p), 'utf8')
const PAGES = ['src/app/investors/page.tsx', 'src/app/commercial/page.tsx', 'src/app/property-managers/page.tsx']

test('signupUrl opens register with the account type and an optional email', () => {
  assert.equal(signupUrl('builder'), 'https://app.brxs.ca/login?mode=register&type=builder')
  assert.equal(signupUrl('reit_leasing', 'a+b@x.ca'), 'https://app.brxs.ca/login?mode=register&type=reit_leasing&email=a%2Bb%40x.ca')
})

test('hubItems picks by title and fails loudly on a typo', () => {
  assert.equal(hubItems('Investor updates.')[0], HUB.find((x) => x.title === 'Investor updates.'))
  assert.throws(() => hubItems('Investor update'))
})

for (const p of PAGES) {
  test(`${p}: leads with the system, one orange button, real sign-up CTA`, () => {
    const s = read(p)
    assert.match(s, /Bricks is the system that brings it all together/)
    assert.equal((s.match(/btn-primary/g) || []).length, 1, 'exactly one orange button')
    assert.match(s, /primary=\{false\}/, 'closing band stays outlined')
    assert.match(s, /signupUrl\('(builder|reit_leasing|solo)'\)/)
  })
  test(`${p}: no internal names, founder, gradients or made-up features`, () => {
    const s = read(p)
    assert.doesNotMatch(s, /Bricks OS|\bGO\b|Raphael|Merchant|gradient/)
    assert.doesNotMatch(s, /turnover|condition report|move-in|move-out|certif(ied|y) (cost|completion)/i)
    assert.doesNotMatch(s, /text-transform:\s*uppercase/)
  })
}

test('new pages are in the sitemap, llms.txt, footer and drawer', () => {
  const sitemap = read('src/app/sitemap.ts')
  const llms = read('public/llms.txt')
  const footer = read('src/components/Footer.tsx')
  const nav = read('src/components/Nav.tsx')
  for (const path of ['/investors', '/commercial', '/property-managers']) {
    assert.ok(sitemap.includes(`'${path}'`), `sitemap ${path}`)
    assert.ok(llms.includes(`https://www.brxs.ca${path}`), `llms ${path}`)
    assert.ok(footer.includes(`href="${path}"`), `footer ${path}`)
    assert.ok(nav.includes(`href="${path}"`), `drawer ${path}`)
  }
})

test('/book/site success offers the matching builder account', () => {
  const s = read('src/app/book/site/SiteBookingForm.tsx')
  assert.match(s, /signupUrl\('builder', bookedEmail \|\| undefined\)/)
  assert.match(s, /sessionStorage\.setItem\(EMAIL_KEY/)
})

test('/service-areas map labels are 44px tap targets', () => {
  const css = read('src/app/globals.css')
  const rule = css.slice(css.indexOf('.cov-label{'), css.indexOf('}', css.indexOf('.cov-label{')))
  assert.match(rule, /min-height:44px/)
  assert.match(rule, /min-width:44px/)
})
