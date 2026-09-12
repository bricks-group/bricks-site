import type { Metadata } from 'next'
import Link from 'next/link'
import ConstructionForm from './ConstructionForm'

export const metadata: Metadata = {
  title: 'Construction & Development Media — Progress Capture | Bricks',
  description:
    'Recurring drone and ground photography plus optional free-roam 3D (virtual visit) for construction sites, REIT portfolios, and developer builds across Canada. Pilots quoted directly.',
  alternates: { canonical: '/construction' },
  openGraph: {
    title: 'Construction & Development Media | Bricks',
    description: 'Scheduled site progress capture — drone, ground, optional free-roam 3D. Canada-wide pilots.',
  },
  twitter: {
    card: 'summary',
    title: 'Construction & Development Media | Bricks',
    description: 'Scheduled site progress capture for developers and REITs across Canada.',
  },
}

const USES = [
  { t: 'Progress documentation', d: 'Weekly or monthly ground + aerial stills on a fixed cadence — same standards as listing media.' },
  { t: 'Stakeholder share links', d: 'Deliver into a listing-file style share for GCs, lenders, and asset managers — not a ZIP in email.' },
  { t: 'Optional free-roam 3D', d: 'Virtual visit (Gaussian splat) quoted by footprint. Always a paid add-on — never packaged as a tour.' },
]

const pageCss = `
  .product-hint{margin-top:14px;font-size:14px;color:var(--inkMute);max-width:560px;}
  .cx-grid{display:grid;grid-template-columns:1.1fr 1fr;gap:48px;align-items:start;margin-top:8px;}
  .cx-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:18px;}
  .cx-list li{display:flex;flex-direction:column;gap:6px;}
  .cx-list strong{font-weight:500;font-size:16px;color:var(--ink);}
  .cx-list span{font-size:14px;color:var(--inkSoft);line-height:1.55;}
  .cx-note{margin-top:22px;font-size:13px;color:var(--inkMute);line-height:1.5;max-width:420px;}
  @media (max-width:900px){ .cx-grid{grid-template-columns:1fr;gap:36px;} }
`

export default function ConstructionPage() {
  return (
    <>
      <section className="hero">
        <div className="wrap">
          <span className="badge">Construction · REITs · Developers</span>
          <h1>Progress you can see.<br />Not just a status report.</h1>
          <p className="sub">
            The same Canada-wide dispatch network behind Bricks listing media — pointed at job sites, builds, and
            portfolios. Recurring visual documentation without you managing a photographer roster.
          </p>
          <p className="sub product-hint">
            Pilots quoted directly. Listing media for agents stays on <Link href="/book">/book</Link>.
          </p>
        </div>
      </section>

      <section className="block">
        <div className="wrap">
          <div className="cx-grid">
            <div>
              <div className="sec-head">
                <div><span className="over">What we run</span><h2>Same network. Different job site.</h2></div>
              </div>
              <ul className="cx-list">
                {USES.map((u) => (
                  <li key={u.t}>
                    <strong>{u.t}</strong>
                    <span>{u.d}</span>
                  </li>
                ))}
              </ul>
              <p className="cx-note">
                Lead-capture today — no self-serve Stripe SKU yet. Agent listing media: <Link href="/pricing">/pricing</Link>.
              </p>
            </div>
            <div>
              <div className="sec-head">
                <div><span className="over">Pilot</span><h2>Request a quote.</h2></div>
              </div>
              <ConstructionForm />
            </div>
          </div>
        </div>
      </section>
      <style>{pageCss}</style>
    </>
  )
}
