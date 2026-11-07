import type { Metadata } from 'next'
import Link from 'next/link'
import RevealObserver from '@/components/RevealObserver'
import ProductStage from '@/components/ProductStage'
import OsDeskShot from '@/components/OsDeskShot'
import PhoneFrame from '@/components/phone/PhoneFrame'
import PhoneVideo from '@/components/phone/PhoneVideo'
import { Stats, Head, Close } from '@/components/calm/Calm'
import { IntegrationsRow } from '@/components/calm/Integrations'
import './home-v10.css'
import './home-v3.css'
import { CORE_FROM } from '@/lib/pricing'
import { PER_VISIT, fmt } from '@/lib/commercial'
import { fromPriceFor } from '@/lib/propertyCheckout'
import { HOME_FAQS } from '@/lib/public-content'
import { FeaturePic } from '@/components/features/FeatureShot'
import { AGENT_LAUNCH_LIVE } from '@/lib/launch'
import HomeServicesBand from '@/components/home-services/HomeServicesBand'
import ModuleGrid from '@/components/software/ModuleGrid'
import WhoFor from '@/components/software/WhoFor'
import EaseCompare from '@/components/software/EaseCompare'
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

      <section className="hero hero-home">
        <div className="wrap">
          <h1>The system that brings it all together.</h1>
          <p className="sub">Bring deals, listings, bookings and updates into one place. Your software, your team and the people who get each property ready.</p>
          <div className="cta-row">
            <a className="btn btn-night btn-primary" href="https://app.brxs.ca/login">Try Bricks free</a>
            <Link className="btn btn-sec hero-calc" href="/why-bricks#calculator">Work out your savings</Link>
          </div>
        </div>
      </section>

      <section className="prod-hero" aria-label="Bricks desk">
        <div className="tray tray-os">
          <div className="tray-stage">
            <ProductStage />
          </div>
        </div>
      </section>

      <section className="cm-sec rvl" aria-label="The problem">
        <Head title="Real estate work is scattered." lede="Most of the work is keeping everyone in step." />
        <ul className="sw-trio">
          <li>
            <h3>Too many tools.</h3>
            <p>Contacts, signatures, deals and files, each in its own app.</p>
          </li>
          <li>
            <h3>Too many messages.</h3>
            <p>The same dates and documents, sent to everyone by hand.</p>
          </li>
          <li>
            <h3>Too many vendors.</h3>
            <p>A booking, an invoice and a download link from each.</p>
          </li>
        </ul>
      </section>

      <section className="cm-sec rvl" aria-label="One system">
        <Head title="One system for the whole job." lede="Every part shares the same record." link={{ href: '/platform', label: 'See the software' }} />
        <ModuleGrid />
      </section>

      <WhoFor />

      <div className="hf" aria-label="Inside Bricks">
        <section className="hf-row rvl" aria-label="The software">
          <div className="hf-copy">
            <h2>One desk for every deal.</h2>
            <p>Price, conditions, dates, documents and signatures on one file.</p>
            <Link className="hf-link" href="/software/deals">Deals and transactions</Link>
          </div>
          <div className="hf-frame tray tray-crm">
            <div className="tray-stage tray-stage-fill">
              <OsDeskShot />
            </div>
          </div>
        </section>

        {AGENT_LAUNCH_LIVE ? (
          <section className="hf-row hf-flip rvl" aria-label="Listing launch and deal room">
            <div className="hf-copy">
              <h2>Keep everyone in the loop.</h2>
              <p>Bookings and deliveries send their own updates. Deal rooms give lawyers, brokers and inspectors the same file (Marble and brokerage seats).</p>
              <Link className="hf-link" href="/software/updates">Updates and deal rooms</Link>
              <span className="hf-fine">Shown with sample data</span>
            </div>
            <div className="hf-frame tray tray-tx hf-shot-tray">
              <div className="tray-stage hf-shot-stage">
              <FeaturePic name="deal-room" alt="A Bricks deal room page for a buyer's lawyer, with sample data: conditions, key dates and documents for one deal" sizes="(max-width:900px) 92vw, 720px" />
              </div>
            </div>
          </section>
        ) : null}

        <section className="hf-row rvl" aria-label="Listing media">
          <div className="hf-copy">
            <h2>Vendors, booked inside it.</h2>
            <p>Book photos, drone, video and floor plans at an exact time. Bricks assigns, edits and pays. The work lands on the listing.</p>
            <Link className="hf-link" href="/software/booking-and-dispatch">Booking and vendor dispatch</Link>
          </div>
          <div className="hf-frame tray tray-book tray-phone">
            <PhoneFrame label="Screen recording of the real Bricks booking flow on brxs.ca/book with sample data: listing details, package, time, review"><PhoneVideo name="book" bar="#EFF1EE" darkBar="#1C1C14" /></PhoneFrame>
          </div>
        </section>

        <section className="hf-row hf-flip rvl" aria-label="Site Progress">
          <div className="hf-copy">
            <h2>From the first site visit.</h2>
            <p>Visits, maps, issues and reports stay with the project. Share a dated update from one place.</p>
            <Link className="hf-link" href="/software/site-progress">Site Progress for builders</Link>
            <span className="hf-fine">Shown with sample data</span>
          </div>
          <div className="hf-frame tray tray-disp hf-shot-tray">
            <div className="tray-stage hf-shot-stage">
            <FeaturePic name="progress-report" alt="The top of a Bricks progress report with sample data: an orthomosaic with a scale bar and photo location pins" sizes="(max-width:900px) 92vw, 720px" />
            </div>
          </div>
        </section>
      </div>

      <section className="cm-sec rvl" aria-label="With and without Bricks">
        <Head title="Half the work." lede="At market prices." link={{ href: '/why-bricks#calculator', label: 'Work out your savings' }} />
        <EaseCompare />
      </section>

      <IntegrationsRow />

      <HomeServicesBand />

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
          Prices in CAD, before tax.
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

      <Close title="Bring it all together." href="https://app.brxs.ca/login" label="Try Bricks free" external />

      <style>{`
        .hero-home{padding:64px var(--gutter) 40px;border-bottom:none;}
        .hero-home h1{font-weight:500;font-size:46px;line-height:1.0;letter-spacing:-1.6px;color:var(--ink);max-width:820px;}
        .hero-home p.sub{font-size:17px;color:var(--inkSoft);margin-top:16px;max-width:600px;line-height:1.45;}
        .hero-home .hero-calc{border-radius:0;border:1px solid var(--ink);color:var(--ink);background:transparent;padding:12px 22px;min-height:48px;box-sizing:border-box;display:inline-flex;align-items:center;text-decoration:none;}
        .hero-home .hero-calc:hover{background:var(--ink);color:var(--paper);}
        .hero-home .cta-row{align-items:center;}
        .hf-shot{background:var(--paperDeep);}
        .hf-fine{display:block;margin-top:12px;font-family:'JetBrains Mono',ui-monospace,monospace;font-size:10.5px;letter-spacing:0;text-transform:none;color:var(--inkMute);}
        .hf-shot picture{position:absolute;inset:24px 24px 0 24px;width:auto;height:auto;}
        .hf-shot img{object-fit:cover;object-position:50% 0;border:1px solid var(--hairStrong);border-bottom:none;}
        @media (max-width:680px){.hf-shot picture{inset:14px 14px 0 14px;}}
        @media (max-width:680px){
          .hero-home{padding:36px var(--gutter) 24px;}
          .hero-home h1{font-size:34px;max-width:22ch;}
          .hero-home p.sub{margin-top:12px;max-width:40ch;}
          .hero-home .cta-row{margin-top:22px;gap:20px;}
        }
      `}</style>
    </>
  )
}
