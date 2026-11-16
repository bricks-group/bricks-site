import type { Metadata } from 'next'
import Link from 'next/link'
import RevealObserver from '@/components/RevealObserver'
import ConstructionPic from '@/components/builders/ConstructionPic'
import SitePic from '@/components/builders/SitePic'
import { Head, Rows, Stats, Close } from '@/components/calm/Calm'
import { FeatureList } from '@/components/features/Feature'
import { SystemBand, HeroPlate } from '@/components/clientele/Clientele'
import { hubItems } from '@/lib/site-progress-features'
import { PER_VISIT, PLANS, PLAN_NOTE, fmt } from '@/lib/commercial'
import { signupUrl } from '@/lib/brand'
import { OG_IMAGE } from '@/lib/og'
import PublicFaqs from '@/components/PublicFaqs'
import { SITE_PROGRESS_FAQS } from '@/lib/public-content'
import { siteProgressServiceSchema } from '@/lib/schema'

const DESC = 'Construction visibility for developers: dated site visits, measured mapping, progress reports and investor-ready evidence from every project.'

export const metadata: Metadata = {
  title: 'Construction Progress for Developers | Bricks',
  description: DESC,
  alternates: { canonical: '/developers' },
  openGraph: { images: [OG_IMAGE],
    title: 'Construction Progress for Developers | Bricks',
    description: DESC,
  },
}

const FEATURES = hubItems('Progress reports.', 'Measured evidence.', 'Milestone checks.', '3D compare.')

export default function DevelopersPage() {
  return (
    <>
      <RevealObserver />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteProgressServiceSchema('https://www.brxs.ca/developers')) }} />

      <section className="hero">
        <div className="wrap">
          <h1>See every site. Keep the plan honest.</h1>
          <p className="sub">
            Bricks brings every visit, model, report and milestone into one place so you can track progress, reduce surprises and give lenders and stakeholders the same dated evidence.
          </p>
          <div className="cta-row">
            <Link className="btn btn-night btn-primary" href="/book/site">Book a site visit</Link>
            <a className="btn btn-sec" href={signupUrl('builder')}>Create a developer account</a>
          </div>
          <HeroPlate sheet="D-00" title="High-rise under construction" note="From a dated site visit">
            <SitePic name="tower-cranes" eager alt="Drone view of a high-rise under construction, with tower cranes" sizes="(max-width:900px) 100vw, 1100px" />
          </HeroPlate>
        </div>
      </section>

      <SystemBand
        title="One record for the whole project."
        label="The system"
        lede="Every site visit lands on the same timeline, so your team, lenders and consultants are looking at the same dated evidence."
        tiles={[
          { icon: 'calendar', title: 'Dated site visits', body: 'Every visit is placed on the project timeline with weather, capture details and before/after visuals.' },
          { icon: 'map', title: 'Measured site maps', body: 'Orthomosaics, true maps and tracked site markers make the site legible and shareable.' },
          { icon: 'compare', title: '3D compare', body: 'Compare this week to last month and see change, fill and cut across each phase.' },
          { icon: 'report', title: 'Progress reports', body: 'Draft a report in minutes from your most recent captures, with clear milestone notes.' },
          { icon: 'share', title: 'Investor sharing', body: 'Send lender-ready updates as PDFs or expiring links without duplicating the work.' },
          { icon: 'evidence', title: 'Evidence index', body: 'Every file is attached to the project with a checksummed record and a clear date.' },
        ]}
      />

      <section className="cm-sec" aria-label="Developer features">
        <Head title="The same project file, from field to funding." lede="Bricks keeps the evidence tied to the project, not buried in a folder or email thread." />
        <FeatureList items={FEATURES} label="Developer and project team features" sheet="D" />
      </section>

      <section className="cm-sec rvl" aria-label="Why developers choose Bricks">
        <Head title="Less chasing. More visibility." lede="Your team needs the same answer: what changed, what’s on track and what needs attention next." />
        <Rows
          items={[
            { title: 'A dated record for every phase', detail: 'Each visit becomes part of the project history, so milestones are easy to verify later.' },
            { title: 'Evidence your lenders can check', detail: 'Share the same site views, maps and before/after imagery that your project team is using.' },
            { title: 'Fewer manual updates', detail: 'Capture the site once and let the report, proof and update flow from the same source.' },
          ]}
        />
        <figure className="cl-photo cl-photo-wide">
          <div className="cl-photo-frame">
            <ConstructionPic name="quarry-aerial" alt="Aerial view of excavators and a bulldozer working in an open earthworks pit" sizes="(max-width:900px) 100vw, 1100px" />
          </div>
          <figcaption>Representative image</figcaption>
        </figure>
      </section>

      <section className="cm-sec rvl" aria-label="Pricing">
        <Head title="One vendor. One portal. Dated evidence for every draw." lede="Book one visit, or put a site on a monthly plan." link={{ href: '/builders#pricing', label: 'All prices' }} />
        <Stats
          label="Developer site visibility prices"
          items={[
            { fig: fmt(PER_VISIT[0].price), label: 'Progress visit' },
            { fig: fmt(PER_VISIT[1].price), label: 'Mapped capture' },
            { fig: fmt(PLANS[0].rows[0].price), label: 'Monthly plan, per site' },
          ]}
        />
        <p className="cm-note">{PLAN_NOTE}</p>
      </section>

      <section className="cm-sec rvl" aria-label="Question and answer">
        <PublicFaqs title="Questions about developer site visibility." faqs={SITE_PROGRESS_FAQS} />
      </section>

      <Close title="Need a site captured first?" href="/book/site" label="Book a site visit" primary={false} />
    </>
  )
}

