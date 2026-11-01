import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { ALL_TRADES, TRADES, TRADE_SLUGS, isTradeEnabled, cleanQuoteRequest, quoteConfirmation, quoteInboxMessage } from './services.ts'
import { QUOTE_INBOX, confirmationPayload, resendPayload, sendClientConfirmation } from './contact-mail.ts'
import { articleBySlug } from './help/index.ts'
import { isPublicPath } from '../middleware.ts'

const read = (p: string) => readFileSync(new URL(p, import.meta.url), 'utf8')
const PAGES = ['/services']
const APPLY = ['/work-with-bricks', ...TRADE_SLUGS.map((s) => `/work-with-bricks/${s}`)]

/** "survey" is allowed only as "legal survey", "legal land survey" or "Ontario Land Surveyor". */
function strayingSurvey(text: string): boolean {
  const cleaned = text.replace(/Ontario Land Surveyors?/g, '').replace(/legal (land )?surveys?/gi, '')
  return /survey/i.test(cleaned)
}

describe('home services pages', () => {
  it('lists every page in the sitemap, llms.txt and footer, and the hub in the nav drawer', () => {
    const sitemap = read('../app/sitemap.ts')
    const llms = read('../../public/llms.txt')
    const footer = read('../components/Footer.tsx')
    for (const p of [...PAGES, ...APPLY]) assert.ok(sitemap.includes(`path: '${p}'`), `sitemap misses ${p}`)
    for (const p of [...PAGES, '/work-with-bricks', ...TRADE_SLUGS.map((s) => `/services#${s}`)]) {
      assert.ok(llms.includes(`https://www.brxs.ca${p})`), `llms.txt misses ${p}`)
      assert.ok(footer.includes(`href="${p}"`), `footer misses ${p}`)
    }
    for (const s of TRADE_SLUGS) assert.ok(!sitemap.includes(`path: '/${s}'`), `sitemap still lists /${s}`)
    assert.ok(read('../components/Nav.tsx').includes('href="/services"'))
  })

  it('puts every trade on the one /services page and redirects the old trade pages to their section', () => {
    const hub = read('../app/services/page.tsx')
    assert.match(hub, /TRADES\.map\(\(t\) => <TradeSection/)
    assert.match(hub, /id=\{`quote-\$\{t\.slug\}`\}/)
    assert.match(read('../components/home-services/TradePage.tsx'), /id=\{trade\.slug\}/)
    const cfg = read('../../next.config.ts')
    assert.match(cfg, /\['staging', 'cleaning', 'inspections', 'measurement', 'repairs'\]\.map\(\(t\) => \(\{ source: `\/\$\{t\}`, destination: `\/services#\$\{t\}`, permanent: true \}\)\)/)
    assert.deepEqual(ALL_TRADES.map((t) => t.slug).sort(), ['cleaning', 'inspections', 'measurement', 'repairs', 'staging'])
    assert.deepEqual([...TRADE_SLUGS].sort(), ['cleaning', 'inspections', 'measurement', 'staging'])
    for (const s of TRADE_SLUGS) assert.throws(() => read(`../app/${s}/page.tsx`), `/${s} page should be gone`)
    assert.match(read('../components/home-services/ServiceQuoteForm.tsx'), /hashchange/)
  })

  it('keeps the pages and apply hub public while marketing is gated', () => {
    for (const p of [...PAGES, ...APPLY, '/api/book/service-request']) assert.equal(isPublicPath(p), true, p)
  })

  it('has one orange primary button per page: the form submit', () => {
    const trade = read('../components/home-services/TradePage.tsx')
    const form = read('../components/home-services/ServiceQuoteForm.tsx')
    const hub = read('../app/services/page.tsx')
    const band = read('../components/home-services/HomeServicesBand.tsx')
    const apply = read('../app/work-with-bricks/[trade]/page.tsx') + read('../app/work-with-bricks/TradeApplyForm.tsx')
    const count = (s: string) => (s.match(/btn-primary/g) || []).length
    assert.equal(count(trade), 0)
    assert.equal(count(hub), 0)
    assert.equal(count(band), 0)
    assert.equal(count(read('../app/work-with-bricks/page.tsx')), 0)
    assert.equal(count(form), 1)
    assert.equal(count(apply), 1)
    // Dark labels on orange, scoped to these pages.
    assert.match(read('../components/home-services/home-services.css'), /\.hs \.btn\.btn-primary[^{]*\{color:#14110E!important;\}/)
  })

  it('never calls a measurement a survey, and refers legal surveys out', () => {
    const m = TRADES.find((t) => t.slug === 'measurement')!
    assert.ok(m.rules.some((r) => r.includes('Ontario Land Surveyor')))
    assert.ok(!strayingSurvey(read('./services.ts')))
    for (const slug of ['measurement-and-floor-area', 'how-quote-requests-work']) {
      assert.ok(!strayingSurvey(JSON.stringify(articleBySlug(slug)!.body)), slug)
    }
    assert.ok(!strayingSurvey(read('../app/services/page.tsx')))
  })

  it('states the repairs exclusion and that inspections are Ontario only', () => {
    const r = ALL_TRADES.find((t) => t.slug === 'repairs')!
    assert.ok(r.rules.some((x) => /electrical, plumbing or gas/.test(x)))
    const i = TRADES.find((t) => t.slug === 'inspections')!
    assert.ok(i.rules.some((x) => /Ontario only/.test(x)))
    assert.ok(r.apply.cgl && i.apply.cgl && r.apply.wsibOptional)
    for (const t of TRADES.filter((x) => !['repairs', 'inspections'].includes(x.slug))) assert.equal(t.apply.cgl, false, t.slug)
  })

  it('keeps brand rules in customer copy', () => {
    const all = read('./services.ts') + read('./help/articles/home-services.ts') + read('../app/services/page.tsx')
    assert.ok(!/down the street/i.test(all))
    assert.ok(!/Bricks OS|Vendor OS|\bGO\b/.test(all))
    assert.ok(!/raphael|merchant|\bkam\b/i.test(all))
    assert.ok(!/\$\d[\d,]*(?!M)/.test(read('./services.ts')), 'no public prices on home services')
  })

  it('follows the legal review: no trip fee, no background checks, no IC clause, $2M worded as a vendor requirement', () => {
    const all = read('./services.ts') + read('./help/articles/home-services.ts') + read('../app/services/page.tsx')
      + read('../app/work-with-bricks/page.tsx') + read('../app/work-with-bricks/TradeApplyForm.tsx') + read('../../public/llms.txt')
    assert.ok(!/trip fee|callout fee|\$60/i.test(read('./services.ts') + read('./help/articles/home-services.ts') + read('../app/services/page.tsx')))
    assert.ok(!/background check/i.test(all))
    assert.ok(!/\bIC\b[^.\n]{0,40}(clause|schedule|v2)/i.test(all))
    assert.ok(!/(carries|vendors carry|inspectors carry) at least \$2M/.test(all), 'word $2M as required for repair and inspection vendors')
    for (const f of ['./services.ts', '../app/work-with-bricks/page.tsx', '../app/work-with-bricks/TradeApplyForm.tsx']) {
      assert.match(read(f), /required for repair and inspection vendors/)
    }
  })
})

describe('quote requests', () => {
  const base = { trade: 'cleaning', clientType: 'property_manager', name: 'Pat Lee', email: 'pat@example.com', address: '1 King St W, Toronto' }

  it('validates the trade, client type, contact and address', () => {
    assert.equal(cleanQuoteRequest({ ...base, trade: 'survey' }).ok, false)
    assert.equal(cleanQuoteRequest({ ...base, clientType: 'nope' }).ok, false)
    assert.equal(cleanQuoteRequest({ ...base, email: 'bad' }).ok, false)
    assert.equal(cleanQuoteRequest({ ...base, address: ' ' }).ok, false)
    const ok = cleanQuoteRequest({ ...base, scope: 'not a real scope', details: 'x'.repeat(5000) })
    assert.ok(ok.ok)
    if (ok.ok) {
      assert.equal(ok.q.scope, '')
      assert.equal(ok.q.details.length, 2000)
    }
  })

  it('sends a Bricks-only confirmation that books nothing', () => {
    assert.equal(cleanQuoteRequest({ ...base, trade: 'repairs' }).ok, false, 'repairs is paused')
    const r = cleanQuoteRequest({ ...base, trade: 'inspections' })
    assert.ok(r.ok)
    if (!r.ok) return
    const c = quoteConfirmation(r.q)
    assert.match(c.subject, /inspection/i)
    assert.match(c.text, /Nothing is booked or charged until you approve a quote/)
    assert.ok(!c.text.includes('[inspector]'), 'no internal vendor type in client copy')
    assert.ok(quoteInboxMessage(r.q).includes('[inspector]'))
    const p = confirmationPayload({ to: 'pat@example.com', name: 'Pat', ...c })
    assert.equal(p.from, 'Bricks <hello@brxs.ca>')
    assert.deepEqual(p.reply_to, ['help@brxs.ca'])
  })

  it('skips the confirmation for smoke tests and without a key, and never throws', async () => {
    const c = { to: 'a@b.co', name: 'A', subject: 's', text: 't' }
    assert.deepEqual(await sendClientConfirmation(c, { smoke: true, env: { RESEND_API_KEY: 'k' } }), { sent: false, reason: 'smoke' })
    assert.deepEqual(await sendClientConfirmation(c, { env: {} }), { sent: false, reason: 'no-key' })
    const boom = (async () => { throw new Error('down') }) as unknown as typeof fetch
    assert.deepEqual(await sendClientConfirmation(c, { env: { RESEND_API_KEY: 'k' }, fetchImpl: boom }), { sent: false, reason: 'exception' })
    const ok = (async () => new Response('{}', { status: 200 })) as unknown as typeof fetch
    assert.deepEqual(await sendClientConfirmation(c, { env: { RESEND_API_KEY: 'k' }, fetchImpl: ok }), { sent: true })
  })
})

describe('quote request inbox', () => {
  it('sends quote requests to help@brxs.ca through Resend', () => {
    assert.equal(QUOTE_INBOX, 'help@brxs.ca')
    const p = resendPayload({ name: 'A', email: 'a@example.com', message: 'x' }, 'test', 'Subject', QUOTE_INBOX)
    assert.deepEqual(p.to, ['help@brxs.ca'])
    assert.match(read('../app/api/book/service-request/route.ts'), /inbox: QUOTE_INBOX/)
  })
})

describe('no photographer no-show fee', () => {
  it('has no trip fee in photographer copy or the IC text', () => {
    const all = read('./help/articles/photographers.ts') + read('../app/photographers/page.tsx') + read('../../public/legal/ic-agreement.txt')
    assert.ok(!/trip fee|no-show fee (is|will be) (added|paid)/i.test(all))
    assert.ok(!/\$60 (trip|no-show)/i.test(all))
  })

  it('says a client no-show pays half the job payout, with the report rules', () => {
    const vendorCopy = read('./help/articles/photographers.ts') + read('../app/photographers/page.tsx')
    assert.ok(/If the client doesn.t show, you.re paid half the job.s payout\./.test(vendorCopy))
    assert.ok(/20 minutes on site/.test(vendorCopy))
    assert.ok(/check-in or the booked start, whichever is later/.test(vendorCopy))
    assert.ok(/Location is required to check in/.test(read('./help/articles/photographers.ts')))
    assert.ok(!/optional location/i.test(read('./help/articles/account-security.ts')))
    assert.ok(/2 business days/.test(vendorCopy))
    assert.ok(/help@brxs\.ca/.test(vendorCopy))
    assert.ok(!/down the street/i.test(vendorCopy))
  })
})

describe('paused trades (repairs, 2026-11-01)', () => {
  it('keeps repairs in the registry but off sale everywhere', () => {
    const r = ALL_TRADES.find((t) => t.slug === 'repairs')
    assert.ok(r && r.enabled === false && r.vendorType === 'handyman')
    assert.equal(isTradeEnabled('repairs'), false)
    assert.ok(!TRADES.some((t) => t.slug === 'repairs'))
    const bad = cleanQuoteRequest({ trade: 'repairs', clientType: 'agent', name: 'A', email: 'a@b.co', address: '1 Main' })
    assert.equal(bad.ok, false)
    assert.equal(articleBySlug('handyman-and-repairs'), undefined)
    assert.equal(articleBySlug('repairs-scope-for-vendors'), undefined)
    assert.ok(!read('../../public/llms.txt').includes('services#repairs'))
    assert.ok(!read('../app/sitemap.ts').includes("path: '/work-with-bricks/repairs', changeFrequency") || read('../app/sitemap.ts').includes("isTradeEnabled('repairs')"))
  })
})
