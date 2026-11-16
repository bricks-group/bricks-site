import type { Metadata } from 'next'
import Link from 'next/link'
import RevealObserver from '@/components/RevealObserver'
import ConstructionPic from '@/components/builders/ConstructionPic'
import { Head, Rows, Stats, Close } from '@/components/calm/Calm'
import { FeatureList } from '@/components/features/Feature'
import SitePic from '@/components/builders/SitePic'
import { SystemBand, HeroPlate } from '@/components/clientele/Clientele'
import { hubItems } from '@/lib/site-progress-features'
import { PER_VISIT, PLANS, PLAN_NOTE, fmt } from '@/lib/commercial'
import { signupUrl } from '@/lib/brand'
import { OG_IMAGE } from '@/lib/og'
import PublicFaqs from '@/components/PublicFaqs'
import { INVESTORS_FAQS } from '@/lib/public-content'

export const metadata: Metadata = {
  title: 'Portfolio reporting for investors & lenders | Bricks',
  description: 'Track every project in your portfolio with dated site visits, progress reports and lender-ready evidence for investors and lenders.',
  alternates: { canonical: '/investors' },
  openGraph: { images: [OG_IMAGE],
    title: 'Portfolio reporting for investors & lenders | Bricks',
    description: 'Track every project in your portfolio with dated site visits, progress reports and lender-ready evidence for investors and lenders.',
  },
}

const FEATURES = hubItems('Portfolio view.', 'Dated evidence.', 'Milestone updates.', 'Change analysis.')

export default function InvestorsPage() {
  return (
    <>
      <RevealObserver />
      <section className="hero">
        <div className="wrap">
          <h1>One view of every project in your portfolio.</h1>
          <p className="sub">
            Bricks turns site activity into dated, shareable evidence so investors and lenders can see what changed, what is on schedule and what still needs attention.
          </p>
          <div className="cta-row">
            <a className="btn btn-night btn-primary" href={signupUrl('investor')}>Create an investor account</a>
            <Link className="btn btn-sec" href="/book/site">Book a portfolio review</Link>
          </div>
          <HeroPlate sheet="I-00" title="Current site conditions" note="Dated by visit">
            <SitePic name="podium-formwork" eager alt="Drone still of a concrete podium at formwork stage" sizes="(max-width:900px) 100vw, 1100px" />
          </HeroPlate>
        </div>
      </section>

      <SystemBand
        title="Visibility without the handoff."
        label="The system"
        lede="Every site visit is dated, measured and attached to the project so you can review the real evidence, not just a summary."
        tiles={[
          { icon: 'calendar', title: 'Portfolio timeline', body: 'Every project has a dated history that shows when work happened and what changed.' },
          { icon: 'map', title: 'Measured site views', body: 'True maps, orthomosaics and photo pins make site conditions easy to compare over time.' },
          { icon: 'compare', title: 'Change analysis', body: 'See what progressed, what was delayed and what still needs attention from one project file.' },
          { icon: 'report', title: 'Progress reports', body: 'Draft investor-ready updates from the same visit history without re-collecting information.' },
          { icon: 'share', title: 'Shareable evidence', body: 'Send a PDF or expiring read-only link so lenders and partners can check the proof without an account.' },
          { icon: 'evidence', title: 'Project audit trail', body: 'Sworn reporting, files and site context stay tied to the project with a clear date record.' },
        ]}
      />

      <section className="cm-sec" aria-label="Investor features">
        <Head title="The same project file for the whole capital stack." lede="The value is not just the photo — it is the ability to review the project as it moves from field to financing." />
        <FeatureList items={FEATURES} label="Investor visibility features" sheet="I" />
      </section>

      <section className="cm-sec rvl" aria-label="Reading a report">
        <Head title="A clearer view of project health." lede="Investors need evidence they can trust, not just a project update that is hard to verify." />
        <Rows
          items={[
            { title: 'Dated site evidence', detail: 'Every visit is tied to the project and includes weather, capture details and clear visual proof.' },
            { title: 'What changed, not just what was said', detail: 'Before-and-after views, milestones and change tracking show the actual progress on site.' },
            { title: 'Easy to share', detail: 'Send the evidence as a PDF or expiring link to lenders, partners or investment committees.' },
          ]}
        />
        <figure className="cl-photo cl-photo-wide">
          <div className="cl-photo-frame">
            <ConstructionPic name="two-workers-rebar" alt="Two workers in hi-vis among reinforcing steel on a concrete deck" sizes="(max-width:900px) 100vw, 1100px" />
          </div>
          <figcaption>Representative image</figcaption>
        </figure>
      </section>

      <section className="cm-sec rvl" aria-label="Pricing">
        <Head title="One vendor. One portal. Dated evidence for every draw." lede="Per visit, or per site each month." link={{ href: '/builders#pricing', label: 'All prices' }} />
        <Stats
          label="Site Progress prices"
          items={[
            { fig: fmt(PER_VISIT[0].price), label: 'Progress visit' },
            { fig: fmt(PER_VISIT[1].price), label: 'Mapped capture' },
            { fig: fmt(PLANS[0].rows[0].price), label: 'Monthly plans from, per site' },
          ]}
        />
        <p className="cm-note">{PLAN_NOTE}</p>
      </section>

      <PublicFaqs title="Questions from investors and lenders." faqs={INVESTORS_FAQS} />

      <Close title="Need a site captured first?" href="/book/site" label="Book a site visit" primary={false} />
    </>
  )
}

