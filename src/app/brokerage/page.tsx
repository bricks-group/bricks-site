import type { Metadata } from 'next'
import Link from 'next/link'
import RevealObserver from '@/components/RevealObserver'
import ProductWindow from '@/components/ProductWindow'
import { OFFICE_PLANS, OFFICE_INCLUDES } from '@/lib/catalog'
import { STATUS } from '@/lib/brand'
import { osSoftwareApplicationSchema } from '@/lib/schema'

export const metadata: Metadata = {
  title: 'bricks for brokerages — the system for the whole shop',
  description: 'The system for the brokerage: roster, pipeline, listings and trust accounting. Priced per seat, billed yearly.',
  alternates: { canonical: '/brokerage' },
}

export default function BrokeragePage() {
  return (
    <>
      <RevealObserver />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(osSoftwareApplicationSchema('https://www.brxs.ca/brokerage')) }}
      />
      <section className="hero">
        <div className="wrap">
          <span className="badge">Brokerage</span>
          <h1>The system for the whole shop.</h1>
          <p className="sub">Roster, pipeline, listings and trust accounting in one system.</p>
          <div className="cta-row">
            <Link className="btn btn-brick" href="/contact">Talk to us</Link>
            <Link className="btn btn-sec" href="/pricing">Pricing</Link>
          </div>
        </div>
      </section>

      <section className="prod-row rvl" aria-label="Bricks preview">
        <div className="prod-copy">
          <span className="over">What you see</span>
          <h2>One system. Brokerage-sized.</h2>
          <p>Agents, deals and media together, inside each listing. Teams and solo agents get a smaller view of the same product.</p>
        </div>
        <div className="tray tray-crm tray-bleed-end">
          <div className="tray-stage">
            <ProductWindow title="bricks" src="/screens/os.html?screen=overview&lock=1" nw={1440} nh={920} lazy />
          </div>
        </div>
      </section>

      <div className="wrap">
        <section className="block rvl">
          <div className="sec-head">
            <div>
              <span className="over">Seats</span>
              <h2>Per seat, billed yearly.</h2>
            </div>
          </div>
          <p className="lede-soft">{OFFICE_INCLUDES}</p>
          <div className="incl">
            {OFFICE_PLANS.map((p) => (
              <div key={p.id} className="c rvl">
                <span className="ic">{p.seats}</span>
                <h4>{p.name}</h4>
                <p>{p.price}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="block rvl">
          <div className="sec-head">
            <div>
              <span className="over">In Bricks</span>
              <h2>What’s inside.</h2>
            </div>
          </div>
          <div className="faq">
            <div className="qa"><h4>Roster</h4><p>Your agents, their seats, and who can book media.</p></div>
            <div className="qa"><h4>Pipeline</h4><p>Every deal and listing in one view.</p></div>
            <div className="qa"><h4>Media on the listing</h4><p>Shoots attach to the listing. Book from Bricks or Companion.</p></div>
            <div className="qa"><h4>Trust accounting</h4><p>For brokerages only. Not included in agent or team plans.</p></div>
          </div>
        </section>

        <section className="block rvl" style={{ borderTop: 'none', paddingTop: 8 }}>
          <div className="book">
            <span className="over">Brokerage</span>
            <h2>See the whole shop in Bricks.</h2>
            <p className="lead">Book a shoot today, or talk to us about seats.</p>
            <div className="cta-row">
              <Link className="btn btn-brick" href="/book">Book a shoot →</Link>
              <Link className="btn btn-sec" href="/contact">Contact</Link>
            </div>
          </div>
        </section>
      </div>
      <style>{`
        .lede-soft{font-size:15px;color:var(--inkSoft);max-width:560px;margin:-8px 0 22px;line-height:1.5;}
      `}</style>
    </>
  )
}
