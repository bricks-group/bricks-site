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

export const metadata: Metadata = {
  title: 'Site progress evidence for investors, lenders and REITs | Bricks',
  description:
    'Dated site visits, progress reports, investor updates and 3D compare for the projects you fund or own, plus units and leasing status for REITs. Shared as a PDF or an expiring read-only link.',
  alternates: { canonical: '/investors' },
  openGraph: {
    title: 'Evidence your investors can check | Bricks',
    description: 'Dated site visits, progress reports and investor updates in one system.',
  },
}

const FEATURES = hubItems('Progress reports.', 'Evidence you can check.', 'Investor updates.', '3D compare.')

export default function InvestorsPage() {
  return (
    <>
      <RevealObserver />
      <section className="hero">
        <div className="wrap">
          <h1>Evidence your investors can check.</h1>
          <p className="sub">
            Bricks is the system that brings it all together: dated site visits, progress reports and investor updates for every project you fund or own.
          </p>
          <div className="cta-row">
            <a className="btn btn-night btn-primary" href={signupUrl('builder')}>Create a builder account</a>
            <Link className="btn btn-sec" href="/book/site">Book a site visit</Link>
          </div>
          <HeroPlate sheet="I-00" title="Podium at formwork stage, drone still" note="From our photo library">
            <SitePic name="podium-formwork" eager alt="Drone still of a concrete podium at formwork stage" sizes="(max-width:900px) 100vw, 1100px" />
          </HeroPlate>
        </div>
      </section>

      <SystemBand
        title="One system, every visit."
        label="The system"
        lede="Every visit to a site lands on one dated timeline. Reports and updates are drafted from it, so what you send matches what was captured."
        tiles={[
          { icon: 'calendar', title: 'Dated site visits', body: 'Drone visits on a schedule, each one dated and filed to the project.' },
          { icon: 'map', title: 'Site Progress mapping', body: 'Orthomosaics with scale bars and photo pins on true maps.' },
          { icon: 'compare', title: 'Models and comparisons', body: 'Point clouds and 3D models, compared date to date, with fill, cut and area changed.' },
          { icon: 'report', title: 'Progress reports', body: 'Drafted from your visits for any date range, with a change log on every revision.' },
          { icon: 'share', title: 'Investor updates', body: 'A monthly update that starts from the last one, shared as a PDF or an expiring link.' },
          { icon: 'evidence', title: 'An evidence index', body: 'Every file listed with a SHA-256 checksum, plus capture details and weather for each visit.' },
        ]}
      />

      <section className="cm-sec" aria-label="Investor features">
        <Head title="Over time, not just today." lede="The same project file gives you progress, measurements and what changed since the last report." />
        <FeatureList items={FEATURES} label="Site Progress features for investors" sheet="I" />
      </section>

      <section className="cm-sec rvl" aria-label="Reading a report">
        <Head title="Getting reports from a builder?" lede="You don't need an account to read one." />
        <Rows
          items={[
            { title: 'Read-only links', detail: 'Builders share each report or update as a link that expires, or as a PDF.' },
            { title: 'Their figures, marked', detail: 'Schedule, budget and % complete stay marked as the builder’s own figures.' },
            { title: 'Clear scope', detail: 'Reports are visual documentation of site conditions, not a cost, quantity or completion certification.' },
          ]}
        />
        {/* Licensed stock (public/IMAGE_CREDITS.md): never captioned as Bricks or client work. */}
        <figure className="cl-photo cl-photo-wide">
          <div className="cl-photo-frame">
            <ConstructionPic name="two-workers-rebar" alt="Two workers in hi-vis among reinforcing steel on a concrete deck" sizes="(max-width:900px) 100vw, 1100px" />
          </div>
          <figcaption>Representative image</figcaption>
        </figure>
      </section>

      <section className="cm-sec rvl" id="reit" aria-label="REITs and leasing">
        <Head title="REITs and leasing teams." lede="A leasing account keeps each building’s units next to its site progress." />
        <Rows
          items={[
            { title: 'Units by building', detail: 'Unit number, phase, monthly rent and size for each project.' },
            { title: 'Leasing status', detail: 'Mark each unit available, reserved or leased, and filter by status.' },
            { title: 'Phases and amenities', detail: 'Group units by phase and list the building’s amenities.' },
            { title: 'Site Progress on the same project', detail: 'Visits, reports and investor updates sit beside the units.' },
          ]}
        />
        <p className="cl-note">Your team updates unit status in Bricks. It doesn’t sync with a leasing or property management system yet.</p>
        <div className="cl-actions">
          <a className="btn btn-sec" href={signupUrl('reit_leasing')}>Create a leasing account</a>
        </div>
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

      <Close title="Need a site captured first?" href="/book/site" label="Book a site visit" primary={false} />
    </>
  )
}
