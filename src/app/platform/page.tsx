import type { Metadata } from 'next'
import Link from 'next/link'
import RevealObserver from '@/components/RevealObserver'
import NewsletterInline from '../NewsletterInline'
import { SOFTWARE_PLANS, OFFICE_PLANS, SOFTWARE_BLURB, ADDONS, ADDONS_BLURB } from '@/lib/catalog'
import { COMPANION_URL, GO_URL, OS_LOGIN, STATUS } from '@/lib/brand'

export const metadata: Metadata = {
  title: 'bricks platform — OS, Companion, GO',
  description: 'The operating system for Canadian real estate. Property to close: listing, Companion, GO, media, MLS, transaction. Media is live to book. OS is live in preview at app.brxs.ca.',
  alternates: { canonical: '/platform' },
}

type Surface = { over: string; title: string; body: string; href?: string; linkLabel?: string }
const surfaces: Surface[] = [
  { over: 'Live in preview', title: 'OS', body: 'Roster, pipeline, listing file for brokerage, team, and agent. What you see depends on the account.' },
  { over: 'Live on the web', title: 'Companion', body: 'The agent app — Jobs and Book with an exact clock time.', href: COMPANION_URL, linkLabel: 'Open Companion' },
  { over: 'Live on the web', title: 'GO', body: 'The photographer field app (Dispatch) — jobs, uploads, pay. Independent contractors on a fixed rate card.', href: GO_URL, linkLabel: 'Open GO' },
]

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
            <Link className="btn btn-sec" href="/pricing">Pricing</Link>
          </div>
        </div>
      </section>

      <div className="wrap">
        <section className="block rvl">
          <div className="sec-head">
            <div>
              <span className="over">Three surfaces</span>
              <h2>The app you get depends on what you do.</h2>
            </div>
          </div>
          <div className="apps">
            {surfaces.map((a) => (
              <div key={a.title} className="c rvl">
                <span className="ic">{a.over}</span>
                <h4>{a.title}</h4>
                <p>{a.body}</p>
                {a.href ? (
                  <p className="surf-link"><a href={a.href} rel="noopener noreferrer">{a.linkLabel}</a></p>
                ) : null}
              </div>
            ))}
          </div>
        </section>

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
        .apps{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--hair);
          border:1px solid var(--hair);border-radius:2px;margin-top:4px;}
        .apps .c{background:var(--paper);padding:22px 22px;}
        .apps .c h4{font-weight:500;font-size:15px;color:var(--ink);margin-bottom:6px;}
        .apps .c p{font-size:12.5px;color:var(--inkMute);line-height:1.45;}
        .apps .c .surf-link{margin:10px 0 0;font-size:12.5px;}
        .apps .c .surf-link a,.book .lead a{color:var(--brickDeep);text-decoration:none;}
        .apps .c .surf-link a:hover,.book .lead a:hover{text-decoration:underline;}
        .apps .c .ic{font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.1em;
          text-transform:uppercase;color:var(--brickDeep);display:block;margin-bottom:8px;}
        .sub-line{font-size:15px;color:var(--inkSoft);line-height:1.5;max-width:640px;margin-top:-12px;}
        .aud-grid{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:var(--hair);border:1px solid var(--hair);border-radius:2px;}
        .aud-card{background:var(--paper);padding:22px 24px;text-decoration:none;color:inherit;display:block;}
        .aud-card:hover{background:var(--paperSoft);}
        .aud-card h3{font-weight:500;font-size:18px;letter-spacing:-0.4px;color:var(--ink);margin:8px 0 6px;}
        .aud-card p{font-size:13.5px;color:var(--inkMute);line-height:1.45;margin:0;}
        .note a{color:var(--brickDeep);text-decoration:none;}
        @media (max-width:680px){
          .apps,.aud-grid{grid-template-columns:1fr;}
        }
      `}</style>
    </>
  )
}
