import type { Metadata } from 'next'
import Link from 'next/link'
import { Head, Rows, Close } from '@/components/calm/Calm'
import RevealObserver from '@/components/RevealObserver'
import { FeatureList } from '@/components/features/Feature'
import { ESIGN, LAUNCH } from '@/lib/agent-features'
import { AGENT_LAUNCH_LIVE } from '@/lib/launch'
import { signupUrl } from '@/lib/brand'

export const metadata: Metadata = {
  title: 'Bricks for real estate teams | Up to 6 agents on one plan',
  description:
    'One plan for a team of up to 6 agents: a shared pipeline, listing files, e-sign and listing media booked from the listing. Billed yearly, CAD.',
  alternates: { canonical: '/teams' },
  openGraph: {
    title: 'One desk for the whole team | Bricks',
    description: 'Up to 6 agents on one plan, with a shared pipeline.',
  },
}

export default function TeamsPage() {
  return (
    <>
      <RevealObserver />
      <section className="hero">
        <div className="wrap">
          <h1>One desk for the whole team.</h1>
          <p className="sub">
            Up to 6 agents on one plan. Everyone works from the same pipeline, and the lead sees every deal and listing.
          </p>
          <div className="cta-row">
            <a className="btn btn-night btn-primary" href={signupUrl('team')}>Start a team</a>
            <Link className="btn btn-sec" href="/pricing">See plans</Link>
          </div>
        </div>
      </section>

      <section className="cm-sec" aria-label="What each agent gets">
        <Head title="Every agent gets the whole desk." lede="Deals, listing files and e-sign for each agent, with media booked from the listing." />
        <FeatureList items={AGENT_LAUNCH_LIVE ? [...LAUNCH, ESIGN] : [ESIGN]} label="What every agent gets" sheet="T" />
      </section>

      <section className="cm-sec rvl" aria-label="How team plans work">
        <Head title="How team plans work." link={{ href: '/pricing', label: 'See pricing' }} />
        <Rows
          items={[
            { title: 'Up to 6 agents', detail: 'The lead and up to five agents share one plan, billed yearly.' },
            { title: 'Shared pipeline', detail: 'Every deal and listing in one view, with who owns each one.' },
            { title: 'Invite by email', detail: 'Agents join from an invite and keep their own logins.' },
            { title: 'More than 6 agents', detail: 'Add a seat for $79 per agent a month, or $790 a year, CAD plus tax. From about 17 agents, brokerage seats can cost less.', href: '/brokerage' },
          ]}
        />
      </section>

      <section className="cm-sec rvl" aria-label="Which plan">
        <Head title="Which plan fits." />
        <Rows
          items={[
            { title: 'On your own', detail: 'Start free as an individual agent.', href: signupUrl('solo'), external: true },
            { title: 'A team of up to 6', detail: 'One team plan for everyone.', href: signupUrl('team'), external: true },
            { title: 'A brokerage', detail: 'Per-seat pricing from 5 seats, with trust accounting.', href: '/brokerage' },
          ]}
        />
      </section>

      <Close title="Book the shoot from the listing." href="/book" label="Book media" primary={false} />
    </>
  )
}
