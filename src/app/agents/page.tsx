import type { Metadata } from 'next'
import Link from 'next/link'
import { Head, Rows, Stats, Close } from '@/components/calm/Calm'
import RevealObserver from '@/components/RevealObserver'
import ProductWindow from '@/components/ProductWindow'
import AppShot from '@/components/AppShot'
import { SOFTWARE_BLURB, ADDONS_BLURB } from '@/lib/catalog'
import { COMPANION_URL, STATUS } from '@/lib/brand'

export const metadata: Metadata = {
  title: 'bricks for agents and teams — listing file plus Companion',
  description: 'Run your listings in Bricks and book shoots from Companion. Software plans start free.',
  alternates: { canonical: '/agents' },
}

export default function AgentsPage() {
  return (
    <>
      <RevealObserver />
      <section className="hero">
        <div className="wrap">
          <h1>Your listings, and the media behind them.</h1>
          <p className="sub">Run your pipeline and deals in Bricks. Book listing media from the listing itself.</p>
          <div className="cta-row">
            <a className="btn btn-night btn-primary" href="https://app.brxs.ca/login" rel="noopener noreferrer">Try Bricks free</a>
          </div>
        </div>
      </section>

      <section className="prod-row rvl" aria-label="Companion">
        <div className="prod-copy">
          <h2>Order media from the listing.</h2>
          <p>Enter the address, pick services and choose an exact time. We assign the photographer.</p>
        </div>
        <div className="tray tray-book tray-phone">
          <div className="tray-stage">
            <ProductWindow variant="phone" title="Companion" src="/screens/book.html?lock=1" nw={390} nh={844} lazy />
          </div>
        </div>
      </section>

      <section className="cm-sec rvl" aria-label="Media and CRM on your phone">
        <Head title="Delivered to the listing. Your contacts beside it." lede="Real Bricks screens on a phone, shown with sample listings and contacts." />
        <div className="appshot-phones">
          <AppShot name="agent-media" alt="A sample listing in Bricks on a phone: delivered photos, download all, and links to copy client media or open the listing site" caption="Media lands on the listing. Download it all, or share the client link." />
          <AppShot name="agent-crm" alt="Bricks contacts on a phone with sample buyers and sellers, their stage and last activity" caption="Contacts, pipeline, tasks and activity in the same app." />
        </div>
      </section>

      <section className="cm-sec rvl" id="team" aria-label="Plans">
        <Head title="Individual or team." lede={`${SOFTWARE_BLURB} ${ADDONS_BLURB}`} link={{ href: '/pricing', label: 'Compare plans' }} />
        <Stats
          label="Software plans"
          items={[
            { fig: 'Free', label: 'Clay, to start' },
            { fig: '$49', label: 'Keystone, per month' },
            { fig: '$99', label: 'Marble, per month' },
          ]}
        />
        <Rows
          items={[
            { title: 'Individual', detail: 'Start free. Paid plans add CRM, e-sign, forms and AI. Media is booked separately.' },
            { title: 'Team', detail: 'The same desk with a shared pipeline. One plan for the team, not charged per agent.' },
            { title: 'Brokerage', detail: 'Seats for the whole shop, with trust accounting.', href: '/brokerage' },
          ]}
        />
      </section>

      <Close title="Book the shoot from the listing." href="/book" label="Book media" primary={false} />
      <style>{`
        .incl.two{grid-template-columns:1fr 1fr;}
        @media (max-width:680px){.incl.two{grid-template-columns:1fr;}}
      `}</style>
    </>
  )
}
