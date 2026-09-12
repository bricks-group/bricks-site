import type { Metadata } from 'next'
import Link from 'next/link'
import RevealObserver from '@/components/RevealObserver'
import ProductWindow from '@/components/ProductWindow'
import PhoneDevice from '@/components/PhoneDevice'
import ProductStage from '@/components/ProductStage'
import NewsletterInline from '../NewsletterInline'
import { SOFTWARE_PLANS, OFFICE_PLANS, SOFTWARE_BLURB, ADDONS, ADDONS_BLURB } from '@/lib/catalog'
import { COMPANION_URL, GO_URL, OS_LOGIN, STATUS } from '@/lib/brand'

export const metadata: Metadata = {
  title: 'bricks platform — OS, Companion, GO',
  description: 'The operating system for Canadian real estate. Property to close: listing, Companion, GO, media, MLS, transaction. Media is live to book. OS is live in preview at app.brxs.ca.',
  alternates: { canonical: '/platform' },
}

const roles = [
  { href: '/brokerage', over: 'OS', title: 'Brokerage', body: 'The whole shop. Full OS plus trust accounting, billed per seat yearly.' },
  { href: '/agents#team', over: 'OS', title: 'Team', body: 'Same OS, team-sized. Shared pipeline for the people you run.' },
  { href: '/agents', over: 'OS · Companion', title: 'Agent', body: 'Listing file plus Companion. Clay free; paid plans add CRM, checklist e-sign + shareable links, forms, and AI (on-document PDF placement not available yet).' },
  { href: '/photographers', over: 'GO', title: 'Photographer', body: 'Independent contractor. Auto-routed jobs, fixed dollar rate card, apply here.' },
]

export default function PlatformPage() {
  return (
    <>
      <RevealObserver />
      <section className="hero">
        <div className="wrap">
          <span className="badge">Platform</span>
          <h1>Property to close.</h1>
          <p className="sub">Listing, Companion, GO, media, MLS, transaction. {STATUS.os}</p>
          <div className="cta-row">
            <Link className="btn btn-brick" href="/book">Book a shoot</Link>
            <Link className="btn btn-sec" href="/demo">Try the demo</Link>
          </div>
        </div>
      </section>

      {/* Cursor-style: each surface gets its own live demo — desk (web) + phones (mobile). */}
      <section className="prod-hero platform-os-stage" aria-label="OS — web desk">
        <div className="wrap platform-surf-head">
          <span className="over">OS · Web</span>
          <h2>The desk runs the deal.</h2>
          <p>Brokerage, team, and agent see the same OS at different depth. Scroll the windows — sidebar stays fixed to the story.</p>
        </div>
        <div className="tray tray-os">
          <div className="tray-stage">
            <ProductStage />
          </div>
        </div>
        <div className="wrap platform-surf-cta">
          <a className="btn btn-sec" href={OS_LOGIN}>Open OS</a>
        </div>
      </section>

      <section className="prod-row rvl" aria-label="Companion — mobile">
        <div className="prod-copy">
          <span className="over">Companion · Mobile</span>
          <h2>Book in one clock.</h2>
          <p>The agent app — Jobs and Book with an exact clock time. Same loop as the desk, in your pocket.</p>
          <p className="surf-link"><a href={COMPANION_URL} rel="noopener noreferrer">Open Companion</a></p>
        </div>
        <div className="tray tray-book tray-phone">
          <div className="phone-stage">
            <PhoneDevice label="Companion">
              <ProductWindow
                variant="phone"
                title="Companion"
                src="/screens/book.html?lock=1"
                nw={390}
                nh={844}
                fit="contain"
                hideChrome
                zoomAt={390}
                lazy
              />
            </PhoneDevice>
          </div>
        </div>
      </section>

      <section className="prod-row prod-row-flip rvl" aria-label="GO — mobile">
        <div className="tray tray-disp tray-phone">
          <div className="phone-stage">
            <PhoneDevice label="GO">
              <ProductWindow
                variant="phone"
                title="GO"
                src="/screens/disp.html?lock=1"
                nw={390}
                nh={844}
                fit="contain"
                hideChrome
                zoomAt={390}
                lazy
              />
            </PhoneDevice>
          </div>
        </div>
        <div className="prod-copy">
          <span className="over">GO · Mobile</span>
          <h2>Shoot on site.</h2>
          <p>The photographer field app — jobs, uploads, pay. Independent contractors on a fixed rate card.</p>
          <p className="surf-link"><a href={GO_URL} rel="noopener noreferrer">Open GO</a></p>
        </div>
      </section>

      <div className="wrap">
        <section className="block rvl">
          <div className="sec-head">
            <div>
              <span className="over">Built for everyone on the deal</span>
              <h2>Four audiences.</h2>
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
              <h2>Clay, Keystone, Marble, Diamond.</h2>
            </div>
          </div>
          <p className="sub-line">{SOFTWARE_BLURB} Individuals: Clay free, then $49 / $99 / $149 a month, or yearly with two months free. Brokerages buy seats yearly — full OS on every seat. Virtual visit is always quoted by sqft, never packaged.</p>
          <div className="incl" style={{ marginTop: 22 }}>
            {SOFTWARE_PLANS.map((p) => (
              <div key={p.id} className="c rvl">
                <span className="ic">{p.price}</span>
                <h4>{p.name}</h4>
                <p>{p.yearly}. {p.points.join('. ')}.</p>
              </div>
            ))}
          </div>
          <div className="incl" style={{ marginTop: 1, borderTop: 'none' }}>
            {OFFICE_PLANS.map((p) => (
              <div key={p.id} className="c rvl">
                <span className="ic">{p.seats}</span>
                <h4>{p.name}</h4>
                <p>{p.price}</p>
              </div>
            ))}
          </div>
          <p className="note">{ADDONS_BLURB} {ADDONS.map((a) => `${a.name} ${a.price}`).join(' · ')}. <Link href="/pricing">Full pricing →</Link></p>
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
            <span className="over">Media is the beachhead</span>
            <h2>Book a shoot. Open the OS.</h2>
            <p className="lead">Order media on this site or in <a href={COMPANION_URL} rel="noopener noreferrer">Companion</a>. Sign in to the <a href={OS_LOGIN}>OS</a> or <a href={GO_URL} rel="noopener noreferrer">GO</a>.</p>
            <div className="cta-row">
              <Link className="btn btn-brick" href="/book">Book a shoot →</Link>
              <Link className="btn btn-sec" href="/contact">Contact</Link>
            </div>
          </div>
        </section>
      </div>

      <style>{`
        .platform-surf-head{padding:48px 0 20px;max-width:640px;}
        .platform-surf-head h2{font-weight:500;font-size:30px;letter-spacing:-0.7px;line-height:1.05;color:var(--ink);margin-top:10px;}
        .platform-surf-head p{font-size:15px;color:var(--inkSoft);margin-top:12px;line-height:1.5;}
        .platform-surf-cta{padding:16px 0 8px;}
        .platform-os-stage{margin-bottom:24px;}
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
          .platform-surf-head{padding:32px 0 12px;}
        }
      `}</style>
    </>
  )
}
