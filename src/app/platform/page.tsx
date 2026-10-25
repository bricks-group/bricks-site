import type { Metadata } from 'next'
import RevealObserver from '@/components/RevealObserver'
import PhoneFrame from '@/components/phone/PhoneFrame'
import PhoneVideo from '@/components/phone/PhoneVideo'
import ProductStage from '@/components/ProductStage'
import { OFFICE_SEAT_PRICE_PER_YEAR, SOFTWARE_BLURB } from '@/lib/catalog'
import { IntegrationsList } from '@/components/calm/Integrations'
import { Head, Rows, Stats, Close } from '@/components/calm/Calm'
import { COMPANION_URL, OS_LOGIN } from '@/lib/brand'
import { osSoftwareApplicationSchema } from '@/lib/schema'

export const metadata: Metadata = {
  title: 'Bricks software — web and mobile',
  description: 'The system that brings it all together: deals, CRM, e-sign, MLS prep and site files on the web and on your phone, with media and Site Progress booked inside.',
  alternates: { canonical: '/platform' },
}

export default function PlatformPage() {
  return (
    <>
      <RevealObserver />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(osSoftwareApplicationSchema('https://www.brxs.ca/platform')) }}
      />

      <section className="hero hero-tight">
        <div className="wrap">
          <h1>One system, from site to sale.</h1>
          <p className="sub">Deals, CRM, e-sign, MLS® prep and site files, on the web and on your phone. Media and Site Progress are booked inside.</p>
          <div className="cta-row">
            <a className="btn btn-night btn-primary" href={OS_LOGIN}>Try Bricks free</a>
          </div>
        </div>
      </section>

      <section className="prod-hero platform-os-stage" aria-label="Bricks on the web">
        <div className="wrap platform-surf-head">
          <h2>On the web.</h2>
          <p>The desk for your projects, listings and deals.</p>
        </div>
        <div className="tray tray-os">
          <div className="tray-stage">
            <ProductStage />
          </div>
        </div>
      </section>

      <section className="prod-row rvl" aria-label="Companion on your phone">
        <div className="prod-copy">
          <h2>On your phone.</h2>
          <p>Book media and follow every listing from Companion.</p>
          <p className="surf-link"><a href={COMPANION_URL} rel="noopener noreferrer">Open Companion</a></p>
        </div>
        <div className="tray tray-book tray-phone">
          <PhoneFrame label="Screen recording of the real Bricks booking flow on brxs.ca/book with sample data: listing details, package, time, review"><PhoneVideo name="book" bar="#EFF1EE" /></PhoneFrame>
        </div>
      </section>

      <section className="cm-sec rvl" aria-label="Who it is for">
        <Head title="Who it’s for." />
        <Rows
          items={[
            { title: 'Builders and developers', detail: 'Progress reports, investor updates and 3D compare for every project.', href: '/builders' },
            { title: 'Brokerages', detail: 'The whole office, priced per seat.', href: '/brokerage' },
            { title: 'Teams', detail: 'One shared pipeline.', href: '/agents#team' },
            { title: 'Agents', detail: 'Your listings, with media booked from your phone.', href: '/agents' },
            { title: 'Photographers', detail: 'Jobs come to you in the photographer app, at a fixed rate.', href: '/photographers' },
          ]}
        />
      </section>

      <IntegrationsList />

      <section className="cm-sec rvl" aria-label="Plans">
        <Head title="Start free. Upgrade when it pays." link={{ href: '/pricing', label: 'See pricing' }} />
        <Stats
          label="Software prices"
          items={[
            { fig: 'Free', label: 'Clay, to start' },
            { fig: '$49 / mo', label: 'Paid plans, from' },
            { fig: `$${OFFICE_SEAT_PRICE_PER_YEAR.franchise} / yr`, label: 'Brokerage seat, from' },
          ]}
        />
        <p className="cm-note">{SOFTWARE_BLURB}</p>
      </section>

      <Close title="Start with the software." href={OS_LOGIN} label="Try Bricks free" external />

      <style>{`
        /* One column for the whole page: hero, desk stage, phone rows and blocks share the 1200 container
           (they were 980 / full-bleed / 20px-flush, so every band started at a different left edge). */
        .wrap{max-width:var(--container);padding-left:var(--gutter);padding-right:var(--gutter);}
        .platform-os-stage{margin:0;}
        .platform-surf-head{padding:var(--sec-half) var(--gutter) var(--head-gap);}
        .platform-surf-head h2{font-weight:500;font-size:28px;letter-spacing:-0.7px;line-height:1.05;color:var(--ink);margin-top:8px;}
        .platform-surf-head p{font-size:15px;color:var(--inkSoft);margin-top:8px;line-height:1.45;max-width:640px;}
        .platform-surf-cta{padding:var(--gap) var(--gutter) 0;}
        .platform-os-stage .tray{width:min(calc(100% - var(--gutter) * 2), calc(var(--container) - var(--gutter) * 2));margin:0 auto;}
        .prod-row-flip{margin-bottom:var(--sec-half);}
        .prod-copy .surf-link{margin:16px 0 0;font-size:13.5px;}
        .prod-copy .surf-link a,.book .lead a{color:var(--brickDeep);text-decoration:none;}
        .prod-copy .surf-link a:hover,.book .lead a:hover{text-decoration:underline;}
        .sub-line{font-size:15px;color:var(--inkSoft);line-height:1.5;max-width:640px;margin-top:calc(var(--head-gap) * -1 + 16px);}
        .aud-grid{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:var(--hair);border:1px solid var(--hair);border-radius:2px;}
        .aud-card{background:var(--paper);padding:var(--card-pad);text-decoration:none;color:inherit;display:block;}
        .aud-card:hover{background:var(--paperSoft);}
        .aud-card h3{font-weight:500;font-size:18px;letter-spacing:-0.4px;color:var(--ink);margin:8px 0 6px;}
        .aud-card p{font-size:13.5px;color:var(--inkMute);line-height:1.45;margin:0;}
        .note a{color:var(--brickDeep);text-decoration:none;}
        @media (max-width:680px){
          .aud-grid{grid-template-columns:1fr;}
        }
      `}</style>
    </>
  )
}
