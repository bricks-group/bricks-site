import type { Metadata } from 'next'
import Link from 'next/link'
import PlanCards from '@/components/PlanCards'
import RevealObserver from '@/components/RevealObserver'
import ProductWindow from '@/components/ProductWindow'
import { SOFTWARE_BLURB, ADDONS_BLURB } from '@/lib/catalog'
import { COMPANION_URL, STATUS } from '@/lib/brand'

export const metadata: Metadata = {
  title: 'bricks for agents and teams — listing file plus Companion',
  description: 'Run your listings in OS and book shoots from Companion. Software plans start free.',
  alternates: { canonical: '/agents' },
}

export default function AgentsPage() {
  return (
    <>
      <RevealObserver />
      <section className="hero">
        <div className="wrap">
          <span className="badge">Agents and teams</span>
          <h1>Your listings, and the shoots behind them.</h1>
          <p className="sub">OS keeps your pipeline and deals. Companion books the media.</p>
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
          <p>Enter the address, pick services and choose an exact time. We assign the photographer. <a href={COMPANION_URL} rel="noopener noreferrer">Open Companion</a></p>
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
              <p>Start free on Clay. Paid plans add CRM, e-sign, forms and AI. Media is booked separately.</p>
            </div>
            <div className="c rvl">
              <span className="ic">Team</span>
              <h4>Team</h4>
              <p>The same OS with a shared pipeline for your team. Billed yearly.</p>
            </div>
          </div>
        </section>

        <section className="block rvl">
          <div className="sec-head">
            <div>
              <span className="over">Software</span>
              <h2>Software plans.</h2>
            </div>
          </div>
          <PlanCards />
          <p className="note">{SOFTWARE_BLURB} {ADDONS_BLURB}</p>
        </section>

        <section className="block rvl" style={{ borderTop: 'none', paddingTop: 8 }}>
          <div className="book">
            <span className="over">Ready</span>
            <h2>Book the shoot. Open the OS.</h2>
            <p className="lead">Book from Companion or right here.</p>
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
