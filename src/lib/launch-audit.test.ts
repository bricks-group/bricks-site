import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import nextConfig from '../../next.config.ts'

const read = (p: string) => readFileSync(new URL(`../../${p}`, import.meta.url), 'utf8')

describe('old sign-in paths', () => {
  it('send /login, /sign-in and /register to app.brxs.ca', async () => {
    const list = await nextConfig.redirects!()
    const to = (src: string) => list.find((r) => r.source === src)?.destination
    assert.equal(to('/login'), 'https://app.brxs.ca/login')
    assert.equal(to('/sign-in'), 'https://app.brxs.ca/login')
    assert.equal(to('/register'), 'https://app.brxs.ca/login?mode=register')
  })
})

describe('cancellation copy', () => {
  it('says 24h full refund, none inside 24h or no-show, and no callout fee', () => {
    const terms = read('src/app/terms/page.tsx')
    assert.match(terms, /no callout fee/i)
    assert.match(terms, /24 hours/)
    const wizard = read('src/app/book/BookingWizard.tsx')
    assert.match(wizard, /No callout fee/)
    assert.doesNotMatch(wizard + terms, /48 ?h(ours)?[^.]*refund/i)
  })
})

describe('calm UI standard', () => {
  it('has no uppercase labels in shared styles', () => {
    for (const f of ['src/app/globals.css', 'src/components/calm/calm.css', 'src/components/features/features.css']) {
      assert.doesNotMatch(read(f), /text-transform:\s*uppercase/, f)
    }
  })
  it('gives header controls a 44px target', () => {
    const css = read('src/app/globals.css')
    assert.match(css, /\.brand\{[^}]*min-height:44px/)
    assert.match(css, /\.nav-login\{[^}]*min-height:44px/)
    assert.match(css, /\.nav-burger\{[^}]*width:44px;height:44px/)
  })
})
