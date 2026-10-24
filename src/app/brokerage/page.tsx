import type { Metadata } from 'next'
import Link from 'next/link'
import { Head, Rows, Close } from '@/components/calm/Calm'
import RevealObserver from '@/components/RevealObserver'
import ProductWindow from '@/components/ProductWindow'
import { OFFICE_PLANS, OFFICE_INCLUDES } from '@/lib/catalog'
import { STATUS } from '@/lib/brand'
import { osSoftwareApplicationSchema } from '@/lib/schema'

export const metadata: Metadata = {
  title: 'bricks for brokerages — the system for the whole shop',
  description: 'The system for the brokerage: roster, pipeline, listings and trust accounting. Priced per seat, yearly or monthly.',
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
          <h1>The system for the whole shop.</h1>
          <p className="sub">Roster, pipeline, listings and trust accounting in one system.</p>
          <div className="cta-row">
            <Link className="btn btn-night btn-primary" href="/contact">Talk to us</Link>
          </div>
        </div>
      </section>

      <section className="prod-row rvl" aria-label="Bricks preview">
        <div className="prod-copy">
          <h2>One system. Brokerage-sized.</h2>
          <p>Agents, deals and media together, inside each listing. Teams and solo agents get a smaller view of the same product.</p>
        </div>
        <div className="tray tray-crm tray-bleed-end">
          <div className="tray-stage">
            <ProductWindow title="bricks" src="/screens/os.html?screen=overview&lock=1" nw={1440} nh={920} lazy />
          </div>
        </div>
      </section>

      <section className="cm-sec rvl" aria-label="Seats">
        <Head title="Per seat, yearly or monthly." lede={OFFICE_INCLUDES} link={{ href: '/pricing', label: 'See pricing' }} />
        <Rows items={OFFICE_PLANS.map((p) => ({ title: p.name, detail: p.seats, value: `$${p.seatPricePerYear} / yr or $${p.seatPricePerMonth} / mo` }))} />
        <p className="cm-note">Per seat. Yearly, or monthly at 25% more with no lock-in.</p>
      </section>

      <section className="cm-sec rvl" aria-label="What's inside">
        <Head title="What’s inside." />
        <Rows
          items={[
            { title: 'Roster', detail: 'Your agents, their seats, and who can book media.' },
            { title: 'Pipeline', detail: 'Every deal and listing in one view.' },
            { title: 'Media on the listing', detail: 'Shoots attach to the listing, booked from Bricks or your phone.' },
            { title: 'Trust accounting', detail: 'For brokerages only. Not in agent or team plans.' },
          ]}
        />
      </section>

      <Close title="Set up seats for your brokerage." href="/contact" label="Talk to us" />
      <style>{`
        .lede-soft{font-size:15px;color:var(--inkSoft);max-width:560px;margin:-8px 0 22px;line-height:1.5;}
      `}</style>
    </>
  )
}
