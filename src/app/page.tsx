import type { Metadata } from 'next'
import Link from 'next/link'
import RevealObserver from '@/components/RevealObserver'
import ProductStage from '@/components/ProductStage'
import OsDeskShot from '@/components/OsDeskShot'
import PhoneFrame from '@/components/phone/PhoneFrame'
import PhoneVideo from '@/components/phone/PhoneVideo'
import { Stats, Rows, Head, Close } from '@/components/calm/Calm'
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
import { OG_IMAGE } from '@/lib/og'

const faqs = HOME_FAQS

export const metadata: Metadata = {
  title: 'Bricks — the system for Canadian real estate',
  description: 'Subscription software for Canadian real estate: builders, developers, investors and realtors, with listing media, Virtual Visit and Site Progress booked inside.',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: 'Bricks',
    url: 'https://www.brxs.ca/',
    locale: 'en_CA',
    title: 'Bricks — the system for Canadian real estate',
    description: 'Subscription software for Canadian real estate: builders, developers, investors and realtors, with listing media, Virtual Visit and Site Progress booked inside.',
    images: [OG_IMAGE],
  },
  twitter: {
    title: 'Bricks — the system for Canadian real estate',
    description: 'Subscription software for Canadian real estate: builders, developers, investors and realtors, with listing media, Virtual Visit and Site Progress booked inside.',
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
          <p className="sub">Software for builders, developers, investors and realtors. Listing media and Site Progress are booked inside it.</p>
          <div className="cta-row">
            <a className="btn btn-night btn-primary" href="https://app.brxs.ca/login">Try Bricks free</a>
            <Link className="cm-link" href="/pricing">See pricing</Link>
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

      <div className="hf" aria-label="Inside Bricks">
        <section className="hf-row rvl" aria-label="Site Progress">
          <div className="hf-copy">
            <h2>Site Progress, reported.</h2>
            <p>Progress reports measured on true maps, with an issues log, weather for each visit and a checksum for every file. As a PDF or a link that expires.</p>
            <Link className="hf-link" href="/builders">See the builder hub</Link>
            <span className="hf-fine">Shown with sample data</span>
          </div>
          <div className="hf-frame hf-photo hf-shot">
            <FeaturePic name="progress-report" alt="The top of a Bricks progress report with sample data: an orthomosaic with a scale bar and photo location pins" sizes="(max-width:900px) 100vw, 780px" />
          </div>
        </section>

        <section className="hf-row hf-flip rvl" aria-label="The software">
          <div className="hf-copy">
            <h2>One desk for every deal.</h2>
            <p>Deals, CRM, e-sign and MLS® prep on one screen.</p>
            <Link className="hf-link" href="/platform">See the software</Link>
          </div>
          <div className="hf-frame tray tray-crm">
            <div className="tray-stage tray-stage-fill">
              <OsDeskShot />
            </div>
          </div>
        </section>

        <section className="hf-row rvl" aria-label="Listing media">
          <div className="hf-copy">
            <h2>Listing media, booked inside.</h2>
            <p>Photos, drone, video and 3D at an exact time. Delivery lands on the listing.</p>
            <Link className="hf-link" href="/book">Book media</Link>
          </div>
          <div className="hf-frame tray tray-book tray-phone">
            <PhoneFrame label="Screen recording of the real Bricks booking flow on brxs.ca/book with sample data: listing details, package, time, review"><PhoneVideo name="book" bar="#EFF1EE" darkBar="#1C1C14" /></PhoneFrame>
          </div>
        </section>


        {AGENT_LAUNCH_LIVE ? (
          <section className="hf-row hf-flip rvl" aria-label="Listing launch and deal room">
            <div className="hf-copy">
              <h2>From listing to closing.</h2>
              <p>A launch kit for every listing. On Marble and brokerage seats, a private deal room for each lawyer, broker and inspector on the deal.</p>
              <Link className="hf-link" href="/agents">For agents</Link>
              <span className="hf-fine">Shown with sample data</span>
            </div>
            <div className="hf-frame hf-photo hf-shot">
              <FeaturePic name="deal-room" alt="A Bricks deal room page for a buyer's lawyer, with sample data: conditions, key dates and documents for one deal" sizes="(max-width:900px) 100vw, 780px" />
            </div>
          </section>
        ) : null}
      </div>

      <section className="cm-sec rvl" aria-label="Who it is for">
        <Head title="Built for the whole project." lede="From the first site visit to the last listing." />
        <Rows
          items={[
            { title: 'Builders and developers', detail: 'Progress reports, 3D compare and site visits for every project.', href: '/builders' },
            { title: 'Investors and lenders', detail: 'Monthly updates with dated, mapped evidence before each draw.', href: '/investors' },
            { title: 'Brokerages', detail: 'Every seat on one system, with trust accounting.', href: '/brokerage' },
            { title: 'Agents and teams', detail: AGENT_LAUNCH_LIVE ? 'Deals, e-sign and a launch kit for every listing. A deal room for every closing on Marble.' : 'Deals, CRM and e-sign, with media on the listing.', href: '/agents' },
          ]}
        />
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

      <section className="cm-sec rvl home-faq" id="faq" aria-label="Frequently asked questions">
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

      <Close title="Start with the software." href="https://app.brxs.ca/login" label="Try Bricks free" external />

      <style>{`
        .hero-home{padding:64px var(--gutter) 40px;border-bottom:none;}
        .hero-home h1{font-weight:500;font-size:46px;line-height:1.0;letter-spacing:-1.6px;color:var(--ink);max-width:760px;}
        .hero-home p.sub{font-size:17px;color:var(--inkSoft);margin-top:16px;max-width:460px;line-height:1.45;}
        .hero-home .cta-row{align-items:center;}
        .hf-shot{background:var(--paperDeep);}
        .hf-fine{display:block;margin-top:12px;font-family:'JetBrains Mono',ui-monospace,monospace;font-size:10.5px;letter-spacing:0;text-transform:none;color:var(--inkMute);}
        .hf-shot picture{position:absolute;inset:24px 24px 0 24px;width:auto;height:auto;}
        .hf-shot img{object-fit:cover;object-position:50% 0;border:1px solid var(--hairStrong);border-bottom:none;}
        @media (max-width:680px){.hf-shot picture{inset:14px 14px 0 14px;}}
        @media (max-width:680px){
          .hero-home{padding:36px var(--gutter) 24px;}
          .hero-home h1{font-size:clamp(28px,7.2vw,36px);letter-spacing:-1.2px;max-width:20ch;}
          .hero-home p.sub{font-size:15px;color:var(--inkMute);margin-top:12px;max-width:32ch;line-height:1.4;}
          .hero-home .cta-row{margin-top:22px;gap:20px;}
        }
      `}</style>
    </>
  )
}
