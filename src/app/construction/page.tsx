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
  { t: 'Progress photos', d: 'Ground and aerial photos, weekly or monthly, to the same standard as our listing work.' },
  { t: 'Share links', d: 'One link for GCs, lenders and asset managers.' },
  { t: 'Free-roam 3D', d: 'Add a virtual visit, quoted by site size.' },
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
          <span className="badge">Construction and development</span>
          <h1>Progress you can see.</h1>
          <p className="sub">
            Regular photo and drone updates for job sites, builds and portfolios, from the same network behind our listing media.
          </p>
        </div>
      </section>

      <section className="block">
        <div className="wrap">
          <div className="cx-grid">
            <div>
              <div className="sec-head">
                <div><span className="over">What we capture</span><h2>Same network, new job site.</h2></div>
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
                Quoted per project. Booking a listing shoot? <Link href="/book">Book here</Link>.
              </p>
            </div>
            <div>
              <div className="sec-head">
                <div><span className="over">Quote</span><h2>Request a quote.</h2></div>
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
