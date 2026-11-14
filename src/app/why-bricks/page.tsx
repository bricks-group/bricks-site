import type { Metadata } from 'next'
import Link from 'next/link'
import RevealObserver from '@/components/RevealObserver'
import { Head, Close } from '@/components/calm/Calm'
import EaseCompare from '@/components/software/EaseCompare'
import SavingsCalculator from '@/components/software/SavingsCalculator'
import ModuleGrid from '@/components/software/ModuleGrid'
import { SOFTWARE_PLANS } from '@/lib/catalog'
import { PER_VISIT, PLANS as SITE_PLANS } from '@/lib/commercial'
import { OS_LOGIN } from '@/lib/brand'
import { HELP_URL } from '@/lib/nav'
import { TODAY_PER_VISIT } from '@/lib/market-rates'
import { OG_IMAGE } from '@/lib/og'
import '@/components/software/software.css'

const title = 'With and Without Bricks: Tools, Handoffs, Savings | Bricks'
const description = 'See the same work side by side, job by job, with and without Bricks, then work out your own time and money saved with a calculator that uses your numbers and Bricks’ real prices.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/why-bricks' },
  openGraph: { type: 'website', siteName: 'Bricks', url: 'https://www.brxs.ca/why-bricks', locale: 'en_CA', title, description, images: [OG_IMAGE] },
  twitter: { title, description, images: [OG_IMAGE] },
}

/** Monthly software prices straight from the locked catalog ("$49 / mo" -> 49). */
const PLAN_PRICES = SOFTWARE_PLANS.map((p) => ({ id: p.id, name: p.name, monthly: p.price === 'Free' ? 0 : Number(p.price.replace(/[^0-9.]/g, '')) }))

const SITE = {
  setup: PER_VISIT[2].price,
  visualPerVisit: PER_VISIT[0].price,
  mappedPerVisit: PER_VISIT[1].price,
  visualPlans: SITE_PLANS[0].rows.map((r) => ({ visits: r.visits, price: r.price })),
  mappedPlans: SITE_PLANS[1].rows.map((r) => ({ visits: r.visits, price: r.price })),
}

const FAQS = [
  { q: 'Where do the calculator’s numbers come from?', a: 'From you. Every input is your own figure, and the starting values are examples you should replace. The only fixed numbers are Bricks’ own prices, taken from the same price list the checkout uses.' },
  { q: 'Why no industry averages?', a: 'Every business coordinates differently, so we don’t quote an average. Your own numbers are a better guide than anyone else’s.' },
  { q: 'Does it include the cost of media?', a: 'No. Listing media is priced separately and isn’t counted. For builders, the calculator compares what you pay per visit today with Bricks’ visit and plan prices.' },
  { q: 'What if the result is negative?', a: 'Then Bricks may cost you more than what you do today, and the calculator shows that. It still keeps everything in one place with dated records, which may or may not matter to you.' },
]

export default function WhyBricksPage() {
  return (
    <>
      <RevealObserver />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQS.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }) }}
      />

      <section className="hero hero-tight sw-hero">
        <div className="wrap">
          <h1>Half the work. At market prices.</h1>
          <p className="sub">The same job with and without Bricks, priced against published rates. Then try your own numbers.</p>
          <div className="cta-row">
            <a className="btn btn-night btn-primary" href={OS_LOGIN}>Try Bricks free</a>
            <a className="btn btn-sec" href="#calculator">Work out your savings</a>
          </div>
        </div>
      </section>

      <section className="cm-sec sw-first" aria-label="With and without Bricks">
        <Head title="Bricks halves the work." lede="Counted job by job, at market prices." />
        <EaseCompare />
      </section>

      <section className="cm-sec rvl" id="calculator" aria-label="Savings calculator">
        <Head title="Your monthly saving with Bricks." lede="What you spend today, against the Bricks price. Change any number to yours." />
        <SavingsCalculator plans={PLAN_PRICES} site={SITE} />
      </section>

      <section className="cm-sec rvl" aria-label="Assumptions and sources">
        <Head title="Assumptions and sources." />
        <ul className="sw-sources">
          <li><strong>Bricks software prices:</strong> Clay free, Keystone $49, Marble $99 and Diamond $149 a month, CAD before tax, from the Bricks price list on <Link href="/pricing">pricing</Link>.</li>
          <li><strong>Site Progress prices:</strong> a progress visit ${PER_VISIT[0].price}, a mapped capture ${PER_VISIT[1].price.toLocaleString('en-CA')} and a one-time ${PER_VISIT[2].price} mapping setup, or monthly plans per site, from <a href={`${HELP_URL}/builders/site-progress-pricing`}>Site Progress pricing</a>.</li>
          <li><strong>What you pay today:</strong> the builder example starts at ${TODAY_PER_VISIT.visual} a progress visit and ${TODAY_PER_VISIT.mapped.toLocaleString('en-CA')} a mapped capture, the middle of published GTA and Ontario one-off prices checked in October and November 2026. Replace them with your own quotes.</li>
          <li><strong>Time saved:</strong> your hours multiplied by the share you set. Bricks doesn’t supply a percentage. Set it to what you believe, including zero.</li>
          <li><strong>Value of time:</strong> your own hourly figure.</li>
          <li><strong>Tools replaced:</strong> only what you would actually cancel. Bricks includes a CRM from Keystone, e-sign from Keystone, forms from Marble, and a listing site and launch kit on every plan.</li>
          <li><strong>Workflow counts:</strong> tallied from the example steps on this page, not measured from customers.</li>
          <li><strong>External benchmarks:</strong> none used.</li>
        </ul>
      </section>

      <section className="cm-sec rvl" aria-label="The parts of Bricks">
        <Head title="What’s doing the work." link={{ href: '/platform', label: 'All of the software' }} />
        <ModuleGrid />
      </section>

      <section className="cm-sec rvl faq-split" aria-label="Frequently asked questions">
        <Head title="Common questions." />
        <div className="faq faq-home">
          {FAQS.map((f) => (
            <details key={f.q} className="qa"><summary>{f.q}</summary><p>{f.a}</p></details>
          ))}
        </div>
      </section>

      <Close title="Bring it all together." href={OS_LOGIN} label="Try Bricks free" external />
      <style>{`
        .sw-hero .wrap{max-width:var(--container);padding-left:var(--gutter);padding-right:var(--gutter);}
        .sw-first{padding-top:24px;}
      `}</style>
    </>
  )
}
