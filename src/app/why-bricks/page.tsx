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
import { OG_IMAGE } from '@/lib/og'
import '@/components/software/software.css'

const title = 'With and without Bricks: tools, handoffs and savings | Bricks'
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
  { q: 'Where do the calculator’s numbers come from?', a: 'Bricks prices come from the same price list the checkout uses. The starting “today” prices for builders are the middle of published GTA and Ontario rates. Everything else is an example for you to replace.' },
  { q: 'Why not use averages for my time?', a: 'Every business coordinates differently, so hours and the share Bricks takes off your plate are yours to set. Your own numbers are a better guide than anyone else’s.' },
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
        <details className="sw-how">
          <summary>How we work this out</summary>
          <ul>
            <li>Bricks prices come from our <Link href="/pricing">price list</Link>, CAD before tax.</li>
            <li>The starting “today” prices are the middle of published GTA and Ontario rates.</li>
            <li>Every other number is an example. Change it to yours.</li>
          </ul>
        </details>
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
