import type { Metadata } from 'next'
import Link from 'next/link'
import RevealObserver from '@/components/RevealObserver'
import ProductStage from '@/components/ProductStage'
import OsDeskShot from '@/components/OsDeskShot'
import PhoneFrame from '@/components/phone/PhoneFrame'
import PhoneVideo from '@/components/phone/PhoneVideo'
import { Stats, Rows, Head, Close } from '@/components/calm/Calm'
import './home-v10.css'
import './home-v3.css'
import { CORE_FROM } from '@/lib/pricing'
import { PER_VISIT, fmt } from '@/lib/commercial'
import { ORGANIZATION_SCHEMA, WEBSITE_SCHEMA } from '@/lib/schema'

const faqs = [
  {
    id: 'what',
    q: 'What is Bricks?',
    a: 'Software for Canadian real estate. Deals, CRM, e-sign and site files in one place, with listing media and Site Progress booked inside it.',
  },
  {
    id: 'who',
    q: 'Who is it for?',
    a: 'Builders, developers and investors running projects, and the brokerages, teams and agents selling them.',
  },
  {
    id: 'booking',
    q: 'How do I book media or a site visit?',
    a: 'From inside Bricks, or online. Enter the address, pick what you need and see the full price before you pay.',
  },
  {
    id: 'coverage',
    q: 'Where do you work?',
    a: 'Across Canada. Travel is priced from the assigned crew’s location and shown before you pay.',
  },
] as const

export const metadata: Metadata = {
  title: 'Bricks — the system for Canadian real estate',
  description: 'The system for Canadian real estate. Listing media, deals, e-sign and CRM in one place.',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: 'Bricks',
    url: 'https://www.brxs.ca/',
    locale: 'en_CA',
    title: 'Bricks — the system for Canadian real estate',
    description: 'The system for Canadian real estate. Listing media, deals, e-sign and CRM in one place.',
    images: ['https://rbywjnnctjglhcdemnnj.supabase.co/storage/v1/object/public/Bricks%20Images/74E774C6-1524-4287-B115-25CA213E4BBD.PNG'],
  },
  twitter: {
    title: 'Bricks — the system for Canadian real estate',
    description: 'The system for Canadian real estate. Book professional media today.',
    images: ['https://rbywjnnctjglhcdemnnj.supabase.co/storage/v1/object/public/Bricks%20Images/74E774C6-1524-4287-B115-25CA213E4BBD.PNG'],
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
            '@graph': [ORGANIZATION_SCHEMA, WEBSITE_SCHEMA],
          }),
        }}
      />

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
            <a className="btn btn-night" href="https://app.brxs.ca/login">Try Bricks free</a>
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
        <section className="hf-row rvl" aria-label="The software">
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

        <section className="hf-row hf-flip rvl" aria-label="Listing media">
          <div className="hf-copy">
            <h2>Listing media, booked inside.</h2>
            <p>Photos, drone, video and 3D at an exact time. Delivery lands on the listing.</p>
            <Link className="hf-link" href="/book">Book media</Link>
          </div>
          <div className="hf-frame tray tray-book tray-phone">
            <PhoneFrame label="Screen recording of the real Bricks booking flow on brxs.ca/book with sample data: listing details, package, time, review"><PhoneVideo name="book" bar="#EFF1EE" /></PhoneFrame>
          </div>
        </section>

        <section className="hf-row rvl" aria-label="Site Progress">
          <div className="hf-copy">
            <h2>Site Progress, on schedule.</h2>
            <p>Maps, 3D models, documents and reports for every visit, compared over time in one site file.</p>
            <Link className="hf-link" href="/book/site">Book a site visit</Link>
          </div>
          <div className="hf-frame hf-photo">
            <picture>
              <source type="image/avif" srcSet="/media/site-progress/tower-cranes-960.avif 960w, /media/site-progress/tower-cranes-1280.avif 1280w, /media/site-progress/tower-cranes-1600.avif 1600w" sizes="(max-width:900px) 100vw, 780px" />
              <source type="image/webp" srcSet="/media/site-progress/tower-cranes-960.webp 960w, /media/site-progress/tower-cranes-1280.webp 1280w, /media/site-progress/tower-cranes-1600.webp 1600w" sizes="(max-width:900px) 100vw, 780px" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/media/site-progress/tower-cranes-960.webp" width={960} height={640} alt="Drone view of a high-rise under construction, with tower cranes" loading="lazy" decoding="async" />
            </picture>
          </div>
        </section>
      </div>

      <section className="cm-sec rvl" aria-label="Who it is for">
        <Head title="Built for the whole project." lede="From the first site visit to the last listing." />
        <Rows
          items={[
            { title: 'Builders and developers', detail: 'Site files, progress visits and reports for every project.', href: '/builders' },
            { title: 'Investors and lenders', detail: 'Dated, mapped evidence of progress before each draw.', href: '/builders' },
            { title: 'Brokerages', detail: 'Every seat on one system, with trust accounting.', href: '/brokerage' },
            { title: 'Agents and teams', detail: 'Deals, CRM and e-sign, with media on the listing.', href: '/agents' },
          ]}
        />
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
        <p className="cm-note">Works with Follow Up Boss, kvCORE, PropTx, Stripe, Docusign and your calendar. Prices in CAD, before tax.</p>
      </section>

      <section className="cm-sec rvl" id="faq" aria-label="Frequently asked questions">
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
