import type { Metadata } from 'next'
import Link from 'next/link'
import RevealObserver from '@/components/RevealObserver'
import ProductWindow from '@/components/ProductWindow'
import { SOFTWARE_PLANS } from '@/lib/catalog'

export const metadata: Metadata = {
  title: 'bricks for agents and teams — desk plus booker',
  description: 'OS as your desk. Booking companion to order media. Clay free; Keystone, Marble, Diamond monthly or yearly. Media is live; apps are in development.',
  alternates: { canonical: '/agents' },
}

export default function AgentsPage() {
  return (
    <>
      <RevealObserver />
      <section className="hero">
        <div className="wrap">
          <span className="badge">Agent · Team</span>
          <h1>Your desk. Then the booker.</h1>
          <p className="sub">OS is the desk — pipeline and the listing file. The booking companion is how you order media without leaving the phone. What you see depends on whether you are solo or a team. Media is live on the site today. The apps are in development.</p>
          <div className="cta-row">
            <Link className="btn btn-brick" href="/book">Book a shoot</Link>
            <Link className="btn btn-sec" href="/pricing">Plans</Link>
          </div>
        </div>
      </section>

      <section className="prod-row rvl" aria-label="Booking companion">
        <div className="prod-copy">
          <span className="over">Booking</span>
          <h2>Order media from the listing.</h2>
          <p>Drop the address, pick the services, confirm. The photographer is routed — you do not cast the shoot. You can book on the site now. The companion app is not in the App Store or Google Play.</p>
        </div>
        <div className="tray tray-book tray-phone">
          <div className="tray-stage">
            <ProductWindow variant="phone" title="Booking" src="/screens/book.html?lock=1" nw={390} nh={844} lazy />
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
              <p>Clay is free. Keystone, Marble, and Diamond unlock CRM, then transactions, then MLS. Monthly, or yearly with two months free. Media is always a separate booking.</p>
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
          <p className="note">Software is in development. Do not buy a plan yet — book media on the site. Yearly is pay 10, get 12.</p>
        </section>

        <section className="block rvl" style={{ borderTop: 'none', paddingTop: 8 }}>
          <div className="book">
            <span className="over">Live today</span>
            <h2>Book the shoot. The desk is coming.</h2>
            <p className="lead">Listing media is live in Canada. OS and the booking companion are not in any store yet.</p>
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
