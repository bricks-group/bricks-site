import type { Metadata } from 'next'
import Link from 'next/link'
import PlanCards from '@/components/PlanCards'
import RevealObserver from '@/components/RevealObserver'
import ProductWindow from '@/components/ProductWindow'
import PhoneFrame from '@/components/phone/PhoneFrame'
import PhoneVideo from '@/components/phone/PhoneVideo'
import ProductStage from '@/components/ProductStage'
import NewsletterInline from '../NewsletterInline'
import { OFFICE_PLANS, SOFTWARE_BLURB, ADDONS, ADDONS_BLURB } from '@/lib/catalog'
import { COMPANION_URL, GO_URL, OS_LOGIN, STATUS } from '@/lib/brand'
import { osSoftwareApplicationSchema } from '@/lib/schema'

export const metadata: Metadata = {
  title: 'bricks platform — web and mobile',
  description: 'The system for Canadian real estate, from listing to close: Bricks on the web, Companion and the photographer app on mobile, plus media, MLS and transactions.',
  alternates: { canonical: '/platform' },
}

const roles = [
  { href: '/brokerage', over: 'Bricks', title: 'Brokerage', body: 'The whole office, priced per seat.' },
  { href: '/agents#team', over: 'Bricks', title: 'Team', body: 'One shared pipeline.' },
  { href: '/agents', over: 'Bricks + Companion', title: 'Agent', body: 'Your listings, and shoots booked from your phone.' },
  { href: '/photographers', over: 'Bricks', title: 'Photographer', body: 'Jobs come to you, at a fixed rate.' },
]

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
          <span className="badge">Platform</span>
          <h1>Property to close.</h1>
          <p className="sub">Deals, media, MLS and e-sign in one system, on the web and on your phone.</p>
          <div className="cta-row">
            <Link className="btn btn-brick" href="/book">Book a shoot</Link>
            <Link className="btn btn-sec" href="/demo">Request a walkthrough</Link>
          </div>
        </div>
      </section>

      {/* Cursor-style: each surface gets its own live demo — desk (web) + phones (mobile). */}
      <section className="prod-hero platform-os-stage" aria-label="Bricks — web desk">
        <div className="wrap platform-surf-head">
          <span className="over">Web</span>
          <h2>Bricks.</h2>
          <p>The desk for your listings and deals.</p>
        </div>
        <div className="tray tray-os">
          <div className="tray-stage">
            <ProductStage />
          </div>
        </div>
        <div className="wrap platform-surf-cta">
          <a className="btn btn-sec" href={OS_LOGIN}>Open Bricks</a>
        </div>
      </section>

      <section className="prod-row rvl" aria-label="Companion — mobile">
        <div className="prod-copy">
          <span className="over">Mobile</span>
          <h2>Companion.</h2>
          <p>Book shoots from your phone.</p>
          <p className="surf-link"><a href={COMPANION_URL} rel="noopener noreferrer">Open Companion</a></p>
        </div>
        <div className="tray tray-book tray-phone">
          <PhoneFrame label="Screen recording of the real Bricks booking flow on brxs.ca/book with sample data: listing details, package, time, review"><PhoneVideo name="book" bar="#EFF1EE" /></PhoneFrame>
        </div>
      </section>

      <section className="prod-row prod-row-flip rvl" aria-label="Photographer app — mobile">
        <div className="tray tray-disp tray-phone">
          <PhoneFrame label="Screen recording of the real Bricks GO photographer app with sample data: today's shoots, job detail, week, payouts"><PhoneVideo name="go" tone="dark" bar="#0F0F0F" /></PhoneFrame>
        </div>
        <div className="prod-copy">
          <span className="over">Mobile</span>
          <h2>Bricks, for photographers.</h2>
          <p>The field app for photographers.</p>
          <p className="surf-link"><a href={GO_URL} rel="noopener noreferrer">Open the photographer app</a></p>
        </div>
      </section>

      <div className="wrap">
        <section className="block rvl">
          <div className="sec-head">
            <div>
              <span className="over">Audiences</span>
              <h2>Who it’s for.</h2>
            </div>
          </div>
          <div className="aud-grid">
            {roles.map((r) => (
              <Link key={r.title} href={r.href} className="aud-card rvl">
                <span className="over">{r.over}</span>
                <h3>{r.title}</h3>
                <p>{r.body}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="block rvl">
          <div className="sec-head">
            <div>
              <span className="over">Software</span>
              <h2>Plans for agents and brokerages.</h2>
            </div>
          </div>
          <p className="sub-line">{SOFTWARE_BLURB} Brokerages buy seats yearly.</p>
          <PlanCards style={{ marginTop: 22 }} />
          <div className="incl" style={{ marginTop: 1, borderTop: 'none' }}>
            {OFFICE_PLANS.map((p) => (
              <div key={p.id} className="c rvl">
                <span className="ic">{p.seats}</span>
                <h4>{p.name}</h4>
                <p>{p.price}</p>
              </div>
            ))}
          </div>
          <p className="note">{ADDONS_BLURB} <Link href="/pricing">Full pricing →</Link></p>
        </section>

        <section className="block rvl">
          <div className="sec-head">
            <div>
              <span className="over">Updates</span>
              <h2>Join the list.</h2>
            </div>
          </div>
          <NewsletterInline />
        </section>

        <section className="block rvl" style={{ borderTop: 'none', paddingTop: 8 }}>
          <div className="book">
            <span className="over">Ready when you are</span>
            <h2>Book a shoot. Open Bricks.</h2>
            <p className="lead">Book here or in <a href={COMPANION_URL} rel="noopener noreferrer">Companion</a>. Sign in to <a href={OS_LOGIN}>Bricks</a> or the <a href={GO_URL} rel="noopener noreferrer">photographer app</a>.</p>
            <div className="cta-row">
              <Link className="btn btn-brick" href="/book">Book a shoot →</Link>
              <Link className="btn btn-sec" href="/contact">Contact</Link>
            </div>
          </div>
        </section>
      </div>

      <style>{`
        .platform-os-stage{margin:0 0 16px;}
        .platform-os-stage .prod-hero{margin-top:0;}
        /* Title + CTA share the same side gutter as the stage — never flush to the viewport */
        .platform-os-stage > .wrap{
          max-width:none;width:100%;box-sizing:border-box;
          padding-left:20px;padding-right:20px;
        }
        .platform-surf-head{padding:16px 0 52px;max-width:640px;}
        .platform-surf-head h2{font-weight:500;font-size:28px;letter-spacing:-0.7px;line-height:1.05;color:var(--ink);margin-top:6px;}
        .platform-surf-head p{font-size:15px;color:var(--inkSoft);margin-top:8px;line-height:1.45;}
        .platform-surf-cta{padding:10px 0 4px;}
        .platform-os-stage .tray{margin-left:20px;margin-right:20px;}
        .prod-copy .surf-link{margin:14px 0 0;font-size:13.5px;}
        .prod-copy .surf-link a,.book .lead a{color:var(--brickDeep);text-decoration:none;}
        .prod-copy .surf-link a:hover,.book .lead a:hover{text-decoration:underline;}
        .sub-line{font-size:15px;color:var(--inkSoft);line-height:1.5;max-width:640px;margin-top:-12px;}
        .aud-grid{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:var(--hair);border:1px solid var(--hair);border-radius:2px;}
        .aud-card{background:var(--paper);padding:22px 24px;text-decoration:none;color:inherit;display:block;}
        .aud-card:hover{background:var(--paperSoft);}
        .aud-card h3{font-weight:500;font-size:18px;letter-spacing:-0.4px;color:var(--ink);margin:8px 0 6px;}
        .aud-card p{font-size:13.5px;color:var(--inkMute);line-height:1.45;margin:0;}
        .note a{color:var(--brickDeep);text-decoration:none;}
        @media (max-width:680px){
          .aud-grid{grid-template-columns:1fr;}
          .platform-os-stage > .wrap{padding-left:20px;padding-right:20px;}
          .platform-os-stage .tray{margin-left:20px;margin-right:20px;}
          .platform-surf-head{padding:12px 0 40px;}
        }
      `}</style>
    </>
  )
}
