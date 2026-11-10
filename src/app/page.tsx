import type { Metadata } from 'next'
import Link from 'next/link'
import RevealObserver from '@/components/RevealObserver'
import ProductStage from '@/components/ProductStage'
import { Stats, Head, Close } from '@/components/calm/Calm'
import './home-v10.css'
import './home-v3.css'
import { CORE_FROM } from '@/lib/pricing'
import { PER_VISIT, fmt } from '@/lib/commercial'
import { fromPriceFor } from '@/lib/propertyCheckout'
import { HOME_FAQS } from '@/lib/public-content'
import WhoFor from '@/components/software/WhoFor'
import '@/components/software/software.css'
import { OG_IMAGE } from '@/lib/og'

const faqs = HOME_FAQS

export const metadata: Metadata = {
  title: 'Bricks: connect every part of real estate',
  description: 'Bricks connects builders and developers, agents and brokerages, property managers and vendors in one system, and makes each of them stronger: projects, listings, bookings, deals and payments on one record.',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: 'Bricks',
    url: 'https://www.brxs.ca/',
    locale: 'en_CA',
    title: 'Bricks: connect every part of real estate',
    description: 'Bricks connects builders and developers, agents and brokerages, property managers and vendors in one system, and makes each of them stronger: projects, listings, bookings, deals and payments on one record.',
    images: [OG_IMAGE],
  },
  twitter: {
    title: 'Bricks: connect every part of real estate',
    description: 'Bricks connects builders and developers, agents and brokerages, property managers and vendors in one system, and makes each of them stronger: projects, listings, bookings, deals and payments on one record.',
    images: [OG_IMAGE],
  },
}

export default function Home() {
  return (
    <>
      <RevealObserver />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map((f) => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          }),
        }}
      />

      <section className="hero hero-home hero-calm" aria-label="Bricks">
        <div className="wrap">
          <div className="brick-motif" aria-hidden="true">
            <span /><span /><span />
          </div>
          <h1>Every piece, in its place.</h1>
          <p className="sub">The people and the work behind each property, fitted together.</p>
          <div className="cta-row">
            <a className="btn btn-night btn-primary" href="https://app.brxs.ca/login">Try Bricks free</a>
            <Link className="hero-quiet" href="/platform">See how it works</Link>
          </div>
        </div>
      </section>

      <section className="cm-sec rvl problem-line" aria-label="The problem">
        <Head
          title="Real estate work is scattered."
          lede="Tools, messages and vendors live in different places. Bricks keeps them on one record."
        />
      </section>

      <WhoFor />

      <section className="cm-sec rvl proof-one" aria-label="Inside Bricks">
        <Head
          title="One desk for the whole job."
          lede="Deals, listings and bookings share the same file — with Site Progress (dated visits and reports for builders) and listing media booked inside it."
          link={{ href: '/platform', label: 'See the software' }}
        />
      </section>

      <section className="prod-hero" aria-label="Bricks desk">
        <div className="tray tray-os">
          <div className="tray-stage">
            <ProductStage />
          </div>
        </div>
      </section>

      <section className="cm-sec rvl" aria-label="Pricing">
        <Head title="Start free. Book when you need to." link={{ href: '/pricing', label: 'See pricing' }} />
        <Stats
          label="Starting prices"
          items={[
            { fig: 'Free', label: 'Software, to start' },
            { fig: `$${CORE_FROM}`, label: 'Listing media, from' },
            { fig: fmt(PER_VISIT[0].price), label: 'Site visit, from' },
          ]}
        />
        <p className="cm-note">
          Property accounts: <Link href="/property-managers">property managers</Link> from {fromPriceFor('property_manager')},{' '}
          <Link href="/commercial">commercial</Link> from {fromPriceFor('commercial')},{' '}
          <Link href="/investors">investors</Link> from {fromPriceFor('investor')}, and <Link href="/reits">REITs</Link> save 10% to 15%.
          Prices in CAD, before tax. Home services such as staging and cleaning are requested on{' '}
          <Link href="/services">home services</Link>.
        </p>
      </section>

      <section className="cm-sec rvl faq-split" id="faq" aria-label="Frequently asked questions">
        <Head title="Common questions." />
        <div className="faq faq-home">
          {faqs.map((f) => (
            <details key={f.id} className="qa">
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <Close title="Every piece, in its place." href="https://app.brxs.ca/login" label="Try Bricks free" external />

      <style>{`
        .hero-calm{position:relative;padding:72px var(--gutter) 48px;border-bottom:none;}
        .hero-calm h1{font-weight:500;font-size:46px;line-height:1.05;letter-spacing:-1.6px;color:var(--ink);max-width:16ch;}
        .hero-calm p.sub{font-size:17px;color:var(--inkSoft);margin-top:16px;max-width:34ch;line-height:1.45;}
        .hero-calm .cta-row{margin-top:28px;display:flex;flex-wrap:wrap;gap:20px;align-items:center;}
        .hero-quiet{font-size:15px;color:var(--inkSoft);text-decoration:none;border-bottom:1px solid transparent;padding:4px 0;}
        .hero-quiet:hover{color:var(--ink);border-bottom-color:var(--ink);}
        .brick-motif{display:flex;flex-direction:column;align-items:flex-start;gap:3px;margin-bottom:28px;opacity:0.28;}
        .brick-motif span{display:block;height:8px;background:var(--ink);border-radius:0;}
        .brick-motif span:nth-child(1){width:36px;}
        .brick-motif span:nth-child(2){width:28px;margin-left:4px;}
        .brick-motif span:nth-child(3){width:20px;margin-left:8px;}
        .problem-line{padding-top:48px;padding-bottom:8px;}
        .problem-line .cm-head{margin-bottom:0;}
        .proof-one{padding-bottom:8px;}
        @media (max-width:680px){
          .hero-calm{padding:40px var(--gutter) 28px;}
          .hero-calm h1{font-size:34px;max-width:12ch;}
          .hero-calm p.sub{margin-top:12px;max-width:28ch;}
          .brick-motif{margin-bottom:20px;}
        }
      `}</style>
    </>
  )
}
