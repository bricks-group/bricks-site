import type { Metadata } from 'next'
import Link from 'next/link'
import RevealObserver from '@/components/RevealObserver'
import ProductWindow from '@/components/ProductWindow'
import { SOFTWARE_PLANS, SOFTWARE_BLURB, ADDONS_BLURB } from '@/lib/catalog'
import { COMPANION_URL, STATUS } from '@/lib/brand'

export const metadata: Metadata = {
  title: 'bricks for agents and teams — listing file plus Companion',
  description: 'OS holds the pipeline and the listing file. Companion is how you order media — Jobs and Book with an exact clock time. Clay free; Keystone, Marble, Diamond monthly or yearly. OS is live in preview at app.brxs.ca.',
  alternates: { canonical: '/agents' },
}

export default function AgentsPage() {
  return (
    <>
      <RevealObserver />
      <section className="hero">
        <div className="wrap">
          <span className="badge">Agent · Team</span>
          <h1>The listing file. Then Companion.</h1>
          <p className="sub">OS holds the pipeline and the deal. Companion is how you order media — Jobs and Book with an exact clock time. What you see depends on whether you are solo or a team. {STATUS.os}</p>
          <div className="cta-row">
            <Link className="btn btn-brick" href="/book">Book a shoot</Link>
            <Link className="btn btn-sec" href="/pricing">Plans</Link>
          </div>
        </div>
      </section>

      <section className="prod-row rvl" aria-label="Companion">
        <div className="prod-copy">
          <span className="over">Companion</span>
          <h2>Order media from the listing.</h2>
          <p>Drop the address, pick the services, confirm. The photographer is routed — you do not cast the shoot. Jobs and Book lock an exact clock time. <a href={COMPANION_URL} rel="noopener noreferrer">Open Companion</a> or book on this site.</p>
        </div>
        <div className="tray tray-book tray-phone">
          <div className="tray-stage">
            <ProductWindow variant="phone" title="Companion" src="/screens/book.html?lock=1" nw={390} nh={844} lazy />
          </div>
        </div>
      </section>

      <div className="wrap">
        <section className="block rvl" id="team">
          <div className="sec-head">
            <div>
              <span className="over">Two ways in</span>
              <h2>Individual or team.</h2>
            </div>
          </div>
          <div className="incl two">
            <div className="c rvl">
              <span className="ic">Agent</span>
              <h4>Individual</h4>
              <p>Clay is free — booking, the listing file, transactions, and BYO MLS. Keystone, Marble, and Diamond add CRM, checklist e-sign + shareable links, forms, and the AI suite. On-document PDF placement is not available yet. Monthly, or yearly with two months free. Media is always a separate booking.</p>
            </div>
            <div className="c rvl">
              <span className="ic">Team</span>
              <h4>Team</h4>
              <p>Same OS, team-sized. Shared pipeline for the people you run. Team software is yearly, at the same yearly totals. A brokerage seat is a different product — full OS plus trust accounting.</p>
            </div>
          </div>
        </section>

        <section className="block rvl">
          <div className="sec-head">
            <div>
              <span className="over">Software</span>
              <h2>Clay, Keystone, Marble, Diamond.</h2>
            </div>
          </div>
          <div className="incl">
            {SOFTWARE_PLANS.map((p) => (
              <div key={p.id} className="c rvl">
                <span className="ic">{p.price}</span>
                <h4>{p.name}</h4>
                <p>{p.yearly}. {p.points.join('. ')}.</p>
              </div>
            ))}
          </div>
          <p className="note">{SOFTWARE_BLURB} {ADDONS_BLURB} Yearly is pay 10, get 12.</p>
        </section>

        <section className="block rvl" style={{ borderTop: 'none', paddingTop: 8 }}>
          <div className="book">
            <span className="over">Ready</span>
            <h2>Book the shoot. Open the OS.</h2>
            <p className="lead">Order the shoot from Companion or this site. Open the OS when you want the pipeline.</p>
            <div className="cta-row">
              <Link className="btn btn-brick" href="/book">Book a shoot →</Link>
              <Link className="btn btn-sec" href="/brokerage">For brokerages</Link>
            </div>
          </div>
        </section>
      </div>
      <style>{`
        .incl.two{grid-template-columns:1fr 1fr;}
        @media (max-width:680px){.incl.two{grid-template-columns:1fr;}}
      `}</style>
    </>
  )
}
