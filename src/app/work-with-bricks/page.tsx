import type { Metadata } from 'next'
import Link from 'next/link'
import RevealObserver from '@/components/RevealObserver'
import { Head, Arrow } from '@/components/calm/Calm'
import { TRADES } from '@/lib/services'
import ServiceIcon from '@/components/home-services/ServiceIcon'
import '@/components/home-services/home-services.css'
import { OG_IMAGE } from '@/lib/og'
import { CAREERS_EMAIL } from '@/lib/careers'

const title = 'Real Estate Vendor Jobs: Photo, Staging, Cleaning | Bricks'
const description = 'Apply as an independent vendor: photographers and pilots, stagers, cleaning crews, inspectors, measurers and repair vendors.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/work-with-bricks' },
  openGraph: { images: [OG_IMAGE], title, description },
}

function CameraIcon() {
  return (
    <svg className="hs-ico" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 8h3l1.5-2h7L17 8h3v11H4z" />
      <circle cx="12" cy="13" r="3.5" />
    </svg>
  )
}

export default function WorkWithBricksPage() {
  return (
    <div className="hs">
      <RevealObserver />
      <section className="hero">
        <div className="wrap">
          <h1>Work with Bricks.</h1>
          <p className="sub">Independent vendors do the work on site. Bricks brings the jobs, the scope and the schedule, and a person reviews every application.</p>
          <div className="cta-row">
            <a className="btn btn-sec" href="#trades">Pick your trade</a>
            <Link className="btn btn-sec" href="/help/photographers/apply-as-a-home-services-vendor">How applying works</Link>
          </div>
        </div>
      </section>

      <section className="cm-sec rvl" id="trades" aria-label="Trades">
        <Head title="Pick your trade." />
        <ul className="hs-grid">
          <li>
            <Link className="hs-card" href="/photographers">
              <CameraIcon />
              <h3>Photographers and pilots</h3>
              <p>Listing photos, video and licensed drone. Apply with sample photos.</p>
              <span className="hs-more">Apply <Arrow /></span>
            </Link>
          </li>
          {TRADES.map((t) => (
            <li key={t.slug}>
              <Link className="hs-card" href={`/work-with-bricks/${t.slug}`}>
                <ServiceIcon name={t.icon} />
                <h3>{t.apply.role}</h3>
                <p>{t.apply.lede}</p>
                <span className="hs-more">Apply <Arrow /></span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="hs-note">$2M commercial general liability insurance is required for repair and inspection vendors. Stagers, cleaning crews and measurers don&apos;t need a certificate to apply.</p>
        <p className="hs-note">Questions before you apply? Email <a href={`mailto:${CAREERS_EMAIL}`}>{CAREERS_EMAIL}</a>.</p>
      </section>
    </div>
  )
}
