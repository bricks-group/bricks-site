import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { NextRequest } from 'next/server'
import { SEASONS, SEASON_SLUGS, MARKET_ALIAS, seasonFor, currentSeason, marketRedirect } from './seasonal-market.ts'
import { middleware } from '../middleware.ts'

const read = (p: string) => readFileSync(join(__dirname, '..', '..', p), 'utf8')

// Noon and the two edges of a Toronto calendar day, given as UTC instants.
// Toronto is UTC-5 in winter (EST) and UTC-4 in summer (EDT).
const torontoEST = (ymd: string, hm = '12:00') => new Date(`${ymd}T${hm}:00-05:00`)
const torontoEDT = (ymd: string, hm = '12:00') => new Date(`${ymd}T${hm}:00-04:00`)

describe('seasonFor (America/Toronto)', () => {
  it('Nov 14 is the last day of fall; Nov 15 is winter', () => {
    assert.equal(seasonFor(torontoEST('2026-11-14')), 'fall')
    assert.equal(seasonFor(torontoEST('2026-11-14', '23:59')), 'fall')
    assert.equal(seasonFor(torontoEST('2026-11-15', '00:00')), 'winter')
    assert.equal(seasonFor(torontoEST('2026-11-15')), 'winter')
  })

  it('uses Toronto time, not UTC, at the boundary', () => {
    // 2026-11-15 03:00 UTC is still Nov 14 at 22:00 in Toronto.
    assert.equal(seasonFor(new Date('2026-11-15T03:00:00Z')), 'fall')
    // 2026-11-15 05:00 UTC is Nov 15 00:00 in Toronto.
    assert.equal(seasonFor(new Date('2026-11-15T05:00:00Z')), 'winter')
    // 2027-03-01 03:00 UTC is still Feb 28 in Toronto.
    assert.equal(seasonFor(new Date('2027-03-01T03:00:00Z')), 'winter')
  })

  it('winter runs through the end of February, leap years included', () => {
    assert.equal(seasonFor(torontoEST('2026-12-31')), 'winter')
    assert.equal(seasonFor(torontoEST('2027-01-01')), 'winter')
    assert.equal(seasonFor(torontoEST('2027-02-28', '23:59')), 'winter')
    assert.equal(seasonFor(torontoEST('2028-02-28')), 'winter')
    assert.equal(seasonFor(torontoEST('2028-02-29', '23:59')), 'winter')
  })

  it('Mar 1 is spring; May 31 spring; Jun 1 summer', () => {
    assert.equal(seasonFor(torontoEST('2027-03-01', '00:00')), 'spring')
    assert.equal(seasonFor(torontoEST('2028-03-01', '00:00')), 'spring')
    assert.equal(seasonFor(torontoEDT('2027-05-31', '23:59')), 'spring')
    assert.equal(seasonFor(torontoEDT('2027-06-01', '00:00')), 'summer')
  })

  it('Aug 31 summer; Sep 1 fall', () => {
    assert.equal(seasonFor(torontoEDT('2027-08-31', '23:59')), 'summer')
    assert.equal(seasonFor(torontoEDT('2027-09-01', '00:00')), 'fall')
    assert.equal(seasonFor(torontoEDT('2027-10-31')), 'fall')
  })
})

describe('marketRedirect', () => {
  const winter = torontoEST('2026-11-20')
  const fall = torontoEST('2026-11-14')

  it('renders the current season and 307-targets it from the others', () => {
    assert.equal(marketRedirect('/winter-market', winter), null)
    assert.equal(marketRedirect('/fall-market', winter), '/winter-market')
    assert.equal(marketRedirect('/spring-market', winter), '/winter-market')
    assert.equal(marketRedirect('/summer-market', winter), '/winter-market')
    assert.equal(marketRedirect('/fall-market', fall), null)
    assert.equal(marketRedirect('/winter-market', fall), '/fall-market')
    assert.equal(marketRedirect('/summer-market', torontoEDT('2027-07-01')), null)
    assert.equal(marketRedirect('/winter-market', torontoEDT('2027-07-01')), '/summer-market')
  })

  it('/market always points at the current season', () => {
    assert.equal(marketRedirect(MARKET_ALIAS, winter), '/winter-market')
    assert.equal(marketRedirect(MARKET_ALIAS, fall), '/fall-market')
    assert.equal(marketRedirect('/market/', torontoEDT('2027-04-10')), '/spring-market')
  })

  it('leaves every other path alone', () => {
    for (const p of ['/', '/pricing', '/book', '/winter-market/x', '/marketing', '/real-estate-photography']) {
      assert.equal(marketRedirect(p, winter), null, p)
    }
  })

  it('middleware answers out-of-season URLs with a 307 to the current season', () => {
    const target = currentSeason().slug
    for (const slug of [...SEASON_SLUGS, MARKET_ALIAS]) {
      const res = middleware(new NextRequest(`https://www.brxs.ca${slug}?utm_source=x`, { headers: { host: 'www.brxs.ca' } }))
      if (slug === target) {
        assert.notEqual(res.status, 307, slug)
        assert.notEqual(res.status, 308, slug)
      } else {
        assert.equal(res.status, 307, slug)
        const loc = new URL(res.headers.get('location') || '')
        assert.equal(loc.pathname, target, slug)
        assert.equal(loc.searchParams.get('utm_source'), 'x')
      }
    }
  })
})

describe('seasonal copy', () => {
  const COMPETITORS = ['REPhotos', 'Dee Visuals', 'Dreamhouse', 'Green Day', 'Rise Real Estate', 'Estate Photography', 'SnapScene', 'HDR E Photo', 'Virtuance', 'BoxBrownie', 'PhotoUp', 'Aryeo', 'HDPhotoHub', 'VHT']
  const all = Object.values(SEASONS).map((s) => JSON.stringify(s)).join('\n') + read('src/components/SeasonalMarketPage.tsx')

  it('has no Canada/Ontario coverage claims', () => {
    assert.doesNotMatch(all, /across canada/i)
    assert.doesNotMatch(all, /across ontario/i)
  })

  it('names no competitors', () => {
    // "Estate Photography" is a competitor; our own "Real Estate Photography" is not.
    const text = all.replace(/real estate photography/gi, '')
    for (const c of COMPETITORS) assert.ok(!text.toLowerCase().includes(c.toLowerCase()), c)
  })

  it('FAQs carry no dollar figures or discounts', () => {
    for (const s of Object.values(SEASONS)) for (const f of s.faqs) {
      assert.doesNotMatch(`${f.q} ${f.a}`, /\$\s?\d/, f.q)
      assert.doesNotMatch(`${f.q} ${f.a}`, /\d+\s?%|\bsave\b|\bsale\b|\bdeal\b/i, f.q)
    }
  })

  it('uses the site delivery line, and no snow guarantee', () => {
    for (const s of Object.values(SEASONS)) {
      assert.ok(s.faqs.some((f) => f.a.includes('We aim to deliver edited, MLS®-ready photos in 24 hours, other media in 24–48 hours')), s.key)
      assert.doesNotMatch(JSON.stringify(s), /guarantee/i)
    }
  })

  it('every season has three reasons, a slug, and FAQs', () => {
    for (const s of Object.values(SEASONS)) {
      assert.equal(s.reasons.length, 3)
      assert.match(s.slug, new RegExp(`^/${s.key}-market$`))
      assert.ok(s.faqs.length >= 4)
    }
  })

  it('no permanent /fall-market redirect remains, and each slug has a page', () => {
    assert.doesNotMatch(read('next.config.ts'), /fall-market/)
    for (const s of Object.values(SEASONS)) read(`src/app${s.slug}/page.tsx`)
  })
})
