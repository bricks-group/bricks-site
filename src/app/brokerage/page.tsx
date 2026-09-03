import type { Metadata } from 'next'
import Link from 'next/link'
import RevealObserver from '@/components/RevealObserver'
import ProductWindow from '@/components/ProductWindow'
import { OFFICE_PLANS, OFFICE_INCLUDES } from '@/lib/catalog'

export const metadata: Metadata = {
  title: 'bricks for brokerages — the desk for the whole shop',
  description: 'OS for the brokerage: roster, pipeline, listing file, and trust accounting. Per-seat yearly. Media is live; the OS is in development.',
  alternates: { canonical: '/brokerage' },
}

export default function BrokeragePage() {
  return (
    <>
      <RevealObserver />
      <section className="hero">
        <div className="wrap">
          <span className="badge">Brokerage</span>
          <h1>The desk for the whole shop.</h1>
          <p className="sub">Roster, pipeline, and the listing file for the whole shop. Every seat gets the full OS — CRM, transactions, e-sign, forms, MLS — plus trust accounting. Media is live now. OS is in development.</p>
          <div className="cta-row">
            <Link className="btn btn-brick" href="/contact">Talk to us</Link>
            <Link className="btn btn-sec" href="/pricing">Pricing</Link>
          </div>
        </div>
      </section>

      <section className="prod-row rvl" aria-label="Brokerage desk preview">
        <div className="prod-copy">
          <span className="over">What you see</span>
          <h2>One OS. Brokerage-sized.</h2>
          <p>Sign in as the brokerage and you get the desk: agents, deals, media as a loop inside the listing file. A team or a solo agent sees fewer rooms. Same product, different account.</p>
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
          <p className="lede-soft">{OFFICE_INCLUDES} Not a bundle of Clay / Keystone / Marble / Diamond.</p>
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
              <span className="over">On the desk</span>
              <h2>The loop lives here.</h2>
            </div>
          </div>
          <div className="faq">
            <div className="qa"><h4>Roster</h4><p>Agents under the brokerage, seats, and who can book media.</p></div>
            <div className="qa"><h4>Pipeline</h4><p>Deals and the listing file — not a jobs queue pretending to be the product.</p></div>
            <div className="qa"><h4>Media inside the file</h4><p>Shoots attach to the listing. Book from the desk or the agent companion. Photographers shoot in GO.</p></div>
            <div className="qa"><h4>Trust accounting</h4><p>Brokerage-only. Solo and team plans do not unlock it.</p></div>
          </div>
        </section>

        <section className="block rvl" style={{ borderTop: 'none', paddingTop: 8 }}>
          <div className="book">
            <span className="over">Brokerage</span>
            <h2>Media is live. OS is coming.</h2>
            <p className="lead">Book listing media today. The OS for the brokerage is in development — not in any store.</p>
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
