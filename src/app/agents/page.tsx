import type { Metadata } from 'next'
import Link from 'next/link'
import { Head, Rows, Stats, Close } from '@/components/calm/Calm'
import RevealObserver from '@/components/RevealObserver'
import ProductWindow from '@/components/ProductWindow'
import { SOFTWARE_BLURB, ADDONS_BLURB } from '@/lib/catalog'
import { COMPANION_URL, STATUS, signupUrl } from '@/lib/brand'
import { FeatureList } from '@/components/features/Feature'
import { ESIGN, LAUNCH } from '@/lib/agent-features'
import { AGENT_LAUNCH_LIVE } from '@/lib/launch'

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
          <p className="sub">{AGENT_LAUNCH_LIVE
            ? 'Run your pipeline and deals in Bricks, launch every listing from one page and keep everyone on the deal up to date. Book listing media from the listing itself.'
            : 'Run your pipeline and deals in Bricks. Book listing media from the listing itself.'}</p>
          <div className="cta-row">
            <a className="btn btn-night btn-primary" href={signupUrl('solo')} rel="noopener noreferrer">Try Bricks free</a>
          </div>
        </div>
      </section>

      <section className="cm-sec" aria-label="Inside the desk">
        <Head title={AGENT_LAUNCH_LIVE ? 'From listing to closing.' : 'Signed, and on the record.'} lede={AGENT_LAUNCH_LIVE ? 'Launch kit on every plan, e-sign on Keystone, deal room on Marble.' : 'E-sign that keeps proof of every step, on Keystone and up.'} />
        <FeatureList items={AGENT_LAUNCH_LIVE ? [...LAUNCH, ESIGN] : [ESIGN]} label="Agent features" sheet="A" />
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
            { title: 'Individual', detail: 'Start free. Paid plans add CRM, e-sign, forms and AI. Media is booked separately.', href: signupUrl('solo'), external: true },
            { title: 'Team', detail: 'Up to 6 agents on one plan, with a shared pipeline. Billed yearly.', href: '/teams' },
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
