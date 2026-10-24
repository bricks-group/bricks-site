import type { Metadata } from 'next'
import Link from 'next/link'
import { Head, Rows, Close } from '@/components/calm/Calm'
import RevealObserver from '@/components/RevealObserver'
import AppShot from '@/components/AppShot'
import { OFFICE_PLANS, OFFICE_INCLUDES } from '@/lib/catalog'
import { BROKERAGE_PITCH, BROKERAGE_PILLARS } from '@/lib/brokerage-pitch'
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

      <section className="cm-sec rvl" aria-label="Bricks preview">
        <Head title="One system. Brokerage-sized." lede="Agents, deals and media together, inside each listing. Teams and solo agents get a smaller view of the same product." />
        <AppShot name="brokerage-overview" alt="Bricks brokerage overview for a sample brokerage: pipeline by stage, today's shoots, top performers and trust reconciliation" caption="The office at a glance: pipeline, today's shoots, top performers and trust reconciliation. Sample brokerage." />
      </section>

      <section className="cm-sec rvl" aria-label="Why brokerages choose Bricks">
        <Head title={BROKERAGE_PITCH.title} lede={BROKERAGE_PITCH.lede} />
        <Rows items={BROKERAGE_PILLARS} />
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
        <div className="br-shot">
          <AppShot name="brokerage-transactions" alt="Transactions list for a sample brokerage: open deals with price, closing date and status" caption="Every deal, deadline and closing in one list. Sample data." />
        </div>
      </section>

      <Close title="Set up seats for your brokerage." href="/contact" label="Talk to us" />
      <style>{`
        .br-shot{margin-top:28px;}
        .lede-soft{font-size:15px;color:var(--inkSoft);max-width:560px;margin:-8px 0 22px;line-height:1.5;}
      `}</style>
    </>
  )
}
