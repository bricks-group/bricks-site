import type { Metadata } from 'next'
import Link from 'next/link'
import { Head, Rows, Close } from '@/components/calm/Calm'
import RevealObserver from '@/components/RevealObserver'
import ProductWindow from '@/components/ProductWindow'
import { OFFICE_PLANS, OFFICE_INCLUDES } from '@/lib/catalog'
import { STATUS } from '@/lib/brand'
import { osSoftwareApplicationSchema } from '@/lib/schema'
import { FeatureList } from '@/components/features/Feature'
import { ESIGN, LAUNCH } from '@/lib/agent-features'
import { AGENT_LAUNCH_LIVE } from '@/lib/launch'

export const metadata: Metadata = {
  title: 'bricks for brokerages — software agents join for, and stay for',
  description: 'Recruit and keep agents with one desk for deals, e-sign and listing media, plus roster, pipeline and trust accounting for the office. Priced per seat, billed yearly.',
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
          <h1>Software agents join for, and stay for.</h1>
          <p className="sub">{AGENT_LAUNCH_LIVE
            ? 'Every seat gets deals, e-sign, a launch kit for each listing and a deal room for each closing. The office gets roster, pipeline and trust accounting.'
            : 'Every seat gets deals, e-sign and listing media in one desk. The office gets roster, pipeline and trust accounting.'}</p>
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

      <section className="cm-sec" aria-label="What agents get">
        <Head title="A desk worth staying for." lede="Every seat gets the whole desk, so agents spend their time on clients, not paperwork." />
        <FeatureList items={AGENT_LAUNCH_LIVE ? [...LAUNCH, ESIGN] : [ESIGN]} label="What every seat gets" sheet="R" />
      </section>

      <section className="cm-sec rvl" aria-label="Seats">
        <Head title="Per seat, billed yearly." lede={OFFICE_INCLUDES} link={{ href: '/pricing', label: 'See pricing' }} />
        <Rows items={OFFICE_PLANS.map((p) => ({ title: p.name, detail: p.seats, value: p.price }))} />
      </section>

      <section className="cm-sec rvl" aria-label="What's inside">
        <Head title="What’s inside." />
        <Rows
          items={[
            { title: 'Roster', detail: 'Your agents, their seats, and who can book media.' },
            { title: 'Pipeline', detail: 'Every deal and listing in one view.' },
            { title: 'Media on the listing', detail: 'Shoots attach to the listing, booked from Bricks or your phone.' },
            { title: 'E-sign with an audit trail', detail: 'Fingerprinted signed PDFs, with who did what and when.' },
            ...(AGENT_LAUNCH_LIVE
              ? [
                  { title: 'Listing launch kit', detail: 'Feature sheet, social pack and MLS® package for every listing.' },
                  { title: 'Deal room', detail: 'Private links for lawyers, brokers and inspectors on each deal.' },
                ]
              : []),
            { title: 'Trust accounting', detail: 'For brokerages only. Not in agent or team plans.' },
          ]}
        />
      </section>

      <Close title="Give your agents a reason to stay." href="/contact" label="Talk to us" />
      <style>{`
        .lede-soft{font-size:15px;color:var(--inkSoft);max-width:560px;margin:-8px 0 22px;line-height:1.5;}
      `}</style>
    </>
  )
}
