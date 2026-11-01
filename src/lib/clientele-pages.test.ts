import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { signupUrl } from './brand'
import { hubItems, HUB } from './site-progress-features'
import { fromPriceFor, ONE_OFFS, ONE_OFFS_FOR } from './propertyCheckout'

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
    assert.match(s, /signupUrl\('(investor|commercial|property_manager|builder|reit_leasing|solo)'\)/)
  })
  test(`${p}: no internal names, founder, gradients or made-up features`, () => {
    const s = read(p)
    assert.doesNotMatch(s, /Bricks OS|\bGO\b|Raphael|Merchant|gradient/)
    assert.doesNotMatch(s, /certif(ied|y) (cost|completion)/i)
    // Condition reports and turnovers are booked through /book/property.
    if (/turnover|condition report/i.test(s)) assert.match(s, /\/book\/property\?for=/)
    assert.doesNotMatch(s, /text-transform:\s*uppercase/)
  })
}

test('new pages are in the sitemap, llms.txt, footer and drawer', () => {
  const sitemap = read('src/app/sitemap.ts')
  const llms = read('public/llms.txt')
  const footer = read('src/components/Footer.tsx')
  const nav = read('src/components/Nav.tsx')
  for (const path of ['/investors', '/commercial', '/property-managers', '/teams', '/reits']) {
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

test('image captions match provenance: only own photos say "our", stock says "Representative image"', () => {
  const gallery = read('src/app/gallery/page.tsx')
  for (const p of PAGES) {
    const s = read(p)
    // "From our gallery" only on images that really are in Bricks' own /gallery.
    for (const m of s.matchAll(/src="([^"]+)"[^>]*note="From our gallery"/g)) assert.ok(gallery.includes(m[1]), `${p}: ${m[1]} is not in /gallery`)
    for (const m of s.matchAll(/note="From our gallery">\s*<PlateImg src="([^"]+)"/g)) assert.ok(gallery.includes(m[1]), `${p}: ${m[1]} is not in /gallery`)
    // Licensed stock (IMAGE_CREDITS.md) is always labelled as representative.
    const stock = (s.match(/<ConstructionPic /g) || []).length
    assert.equal((s.match(/Representative image/g) || []).length >= stock, true, `${p}: stock photo without "Representative image"`)
  }
})

test('/builders layers story has no CSS gradients', () => {
  const css = read('src/components/builders/site-rail.css').replace(/\/\*[\s\S]*?\*\//g, '')
  assert.doesNotMatch(css, /gradient\(/)
})

test('each property page signs up as its own account type', () => {
  assert.match(read('src/app/investors/page.tsx'), /signupUrl\('investor'\)/)
  assert.match(read('src/app/commercial/page.tsx'), /signupUrl\('commercial'\)/)
  assert.match(read('src/app/property-managers/page.tsx'), /signupUrl\('property_manager'\)/)
  assert.match(read('src/app/reits/page.tsx'), /signupUrl\('reit_leasing'\)/)
})

test('agents, teams and brokerage pages sign up, not just log in', () => {
  for (const p of ['src/app/agents/page.tsx', 'src/app/pricing/page.tsx']) {
    assert.doesNotMatch(read(p), /href="https:\/\/app\.brxs\.ca\/login"/, `${p} links to plain login`)
  }
  assert.match(read('src/app/teams/page.tsx'), /signupUrl\('team'\)/)
  assert.match(read('src/app/teams/page.tsx'), /Up to 6 agents/)
  assert.match(read('src/app/brokerage/page.tsx'), /signupUrl\('brokerage'\)/)
  for (const p of ['src/app/teams/page.tsx', 'src/app/reits/page.tsx', 'src/app/brokerage/page.tsx', 'src/app/agents/page.tsx']) {
    const s = read(p)
    assert.equal((s.match(/btn-primary/g) || []).length, 1, `${p}: exactly one orange button`)
    assert.doesNotMatch(s, /Bricks OS|\bGO\b|Raphael|Merchant|gradient|down the street/)
  }
})

test('brokerage monthly seat rate is the yearly rate plus 25%', async () => {
  const { OFFICE_SEAT_PRICE_PER_MONTH, OFFICE_SEAT_PRICE_PER_YEAR } = await import('./catalog')
  for (const k of Object.keys(OFFICE_SEAT_PRICE_PER_YEAR) as (keyof typeof OFFICE_SEAT_PRICE_PER_YEAR)[]) {
    const yearlyPerMonth = OFFICE_SEAT_PRICE_PER_YEAR[k] / 12
    assert.ok(Math.abs(OFFICE_SEAT_PRICE_PER_MONTH[k] - yearlyPerMonth * 1.25) <= 0.5, k)
  }
})

test('property request form posts to the public request route, shows no prices, covers every client type', async () => {
  const { SERVICES_FOR, isPropertyClient } = await import('./clientServices')
  for (const k of ['property_manager', 'commercial', 'investor', 'reit_leasing']) {
    assert.ok(isPropertyClient(k))
    assert.ok(SERVICES_FOR[k as keyof typeof SERVICES_FOR].length > 0)
  }
  assert.ok(!isPropertyClient('builder'))
  const s = read('src/app/book/property/PropertyRequestForm.tsx') + read('src/lib/clientServices.ts')
  assert.match(s, /fetch\('\/api\/book\/property-request'/)
  assert.doesNotMatch(s, /\$\d/)
  assert.ok(SERVICES_FOR.commercial.some((x) => x.key === 'site_progress' && /mapping|maps/.test(x.detail) && /models/.test(x.detail) && /reports/.test(x.detail) && /comparisons/.test(x.detail)))
})

test('approved client prices (2026-10-25) match the app; one-off visits are booked and paid online', () => {
  const pm = read('src/app/property-managers/page.tsx')
  assert.match(pm, /\$1,325, \$2,990 or \$5,875 a month/)
  assert.match(pm, /Condition reports and turnovers, booked online/)
  assert.match(pm, /\$145.*\$295/)
  assert.match(read('src/app/commercial/page.tsx'), /\$595 up to 2,500 sq ft, \$895 up to 7,500 sq ft, \$1,450 up to 20,000 sq ft\. Aerial sets \$349/)
  assert.match(read('src/app/investors/page.tsx'), /\$1,250, or \$2,250 mapped/)
  assert.match(read('src/app/reits/page.tsx'), /10% off, and 15% off at 25/)
  for (const p of ['property-managers', 'commercial', 'investors', 'reits']) {
    assert.doesNotMatch(read(`src/app/${p}/page.tsx`), /by request|confirm the price/, p)
  }
  assert.match(read('src/app/commercial/page.tsx'), /\$1,590 a month/)
  assert.match(read('src/app/investors/page.tsx'), /\$195 a month per property, billed \$585 a quarter, or \$450 a month per property/)
  assert.match(read('src/app/teams/page.tsx'), /\$79 per agent a month, or \$790 a year/)
  const llms = read('public/llms.txt')
  assert.match(llms, /booked and paid online at \/book\/property/)
  assert.match(llms, /\$79 per agent a month or \$790 a year/)
  assert.doesNotMatch(llms, /request-only|priced per property on request/)
})

test('blog posts and the blog layout carry no founder name or founder stats', () => {
  const { readdirSync } = require('node:fs') as typeof import('node:fs')
  const posts = readdirSync(join(root, 'src/app/blog'), { withFileTypes: true })
    .filter((d) => d.isDirectory()).map((d) => `src/app/blog/${d.name}/page.tsx`)
  for (const p of ['src/components/BlogPostLayout.tsx', 'src/app/blog/page.tsx', ...posts]) {
    assert.doesNotMatch(read(p), /Raphael|Merchant|CoStar|14,000|founder|down the street/i, p)
  }
})

test('plan copy: rentals are turnovers, watch is per property, site plans never auto-book and cancel at period end', () => {
  const svc = read('src/lib/clientServices.ts')
  assert.match(svc, /5, 12 or 25 turnovers a month/)
  assert.doesNotMatch(svc, /25 units/)
  const site = read('src/app/book/site/SiteBookingForm.tsx')
  assert.match(site, /confirm in one tap/)
  assert.match(site, /end of the month you&apos;ve paid for/)
  const pay = read('src/lib/help/articles/photographers.ts')
  assert.match(pay, /\$685 \/ \$635 \/ \$475/)
  assert.match(pay, /not paid again on top/)
  assert.doesNotMatch(pay + svc + site, /down the street/i)
})

test('property pages book through the property checkout, not the agent listing flow', () => {
  const pm = read('src/app/property-managers/page.tsx')
  assert.doesNotMatch(pm, /href="\/book"/)
  assert.match(pm, /href="\/book\/property\?for=property_manager/)
  for (const p of ['src/app/commercial/page.tsx', 'src/app/investors/page.tsx', 'src/app/reits/page.tsx']) {
    assert.doesNotMatch(read(p), /href="\/book"/, `${p} sends clients to the agent /book flow`)
  }
})

test('pricing lists property-account visit prices from the checkout table, and builders can create an account', () => {
  const pricing = read('src/app/pricing/page.tsx')
  assert.match(pricing, /aria-label="Property accounts"/)
  for (const href of ['/property-managers', '/commercial', '/investors', '/reits']) {
    assert.ok(pricing.includes(`href: '${href}'`), `pricing links ${href}`)
  }
  assert.match(pricing, /fromPriceFor/, 'from-prices come from the /book/property table, not typed figures')
  assert.match(read('src/app/builders/page.tsx'), /signupUrl\('builder'\)/)
})

test('teams page prices the team as the lead plan, monthly or yearly; reits page lists visit prices from the checkout table', () => {
  const teams = read('src/app/teams/page.tsx')
  assert.doesNotMatch(teams, /billed yearly\.'/, 'teams page must not say team plans are yearly only')
  assert.match(teams, /SOFTWARE_PLANS\.filter/, 'team prices come from the plan catalog, not typed figures')
  assert.match(teams, /aria-label="Team plan prices"/)
  const reits = read('src/app/reits/page.tsx')
  assert.match(reits, /ONE_OFFS_FOR\.reit_leasing/, 'REIT prices come from the /book/property table')
  assert.match(reits, /aria-label="Visit prices"/)
})

test('home page shows property-account starting prices from the checkout table', () => {
  const home = read('src/app/page.tsx')
  for (const kind of ['property_manager', 'commercial', 'investor'] as const) {
    assert.ok(home.includes(`fromPriceFor('${kind}')`), `home shows ${kind} from-price`)
    const min = Math.min(...ONE_OFFS_FOR[kind].map((k) => ONE_OFFS[k].cents))
    assert.equal(fromPriceFor(kind).replace(/[$,]/g, ''), String(min / 100))
  }
  for (const href of ['/property-managers', '/commercial', '/investors', '/reits']) {
    assert.ok(home.includes(`href="${href}"`), `home links ${href}`)
  }
})

test('/book/site plans are self-serve to manage or cancel', () => {
  const s = read('src/app/book/site/SiteBookingForm.tsx')
  assert.match(s, /Manage or cancel plan/)
  assert.match(s, /\/api\/book\/site-manage/)
  assert.match(s, /setItem\(PLAN_KEY, mode === 'plan' \? '1' : '0'\)/)
  assert.doesNotMatch(s, /To change or cancel, email help@brxs\.ca/)
  const r = read('src/app/api/book/site-manage/route.ts')
  assert.match(r, /https:\/\/api\.brxs\.ca\/api\/book\/site-manage/)
  assert.match(r, /X-Internal-Api-Key/)
  assert.match(r, /startsWith\('https:\/\/billing\.stripe\.com\/'\)/)
})
