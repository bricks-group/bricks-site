import type { Metadata } from 'next'
import Link from 'next/link'
import RevealObserver from '@/components/RevealObserver'
import SiteRail from '@/components/builders/SiteRail'
import ConstructionForm from '../construction/ConstructionForm'
import SitePic from '@/components/builders/SitePic'
import { PER_VISIT, PLANS, PLAN_NOTE, SITE_PRODUCT, fmt } from '@/lib/commercial'

export const metadata: Metadata = {
  title: 'Drone progress monitoring for builders & developers | Bricks',
  description:
    'Scheduled drone progress visits and mapped captures for builders, developers, GCs and investors in Canada. Vetted, insured, certified pilots: Advanced RPAS and verified drone liability insurance. From $375 per visit or $300 per site per month.',
  alternates: { canonical: '/builders' },
  openGraph: {
    title: 'Site Progress for builders & developers | Bricks',
    description: 'Drone progress visits and mapped captures on a fixed cadence. Billed per visit or monthly per site.',
  },
  twitter: {
    card: 'summary',
    title: 'Site Progress for builders & developers | Bricks',
    description: 'Drone progress visits and mapped captures, billed per visit or monthly per site.',
  },
}

const PROOF = [
  { k: 'Vetted, insured, certified pilots', v: 'Every pilot is vetted by Bricks before they fly a site.' },
  { k: 'Advanced RPAS', v: 'Certified by Transport Canada for controlled airspace and work near people.' },
  { k: 'Verified insurance', v: '$2M drone liability minimum, verified by us and valid on the flight date. $5M when your contract requires it.' },
  { k: 'One site file', v: 'Every visit dated and shared through one link.' },
] as const

const pageCss = `
  .bx-proof{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:var(--hair);border:1px solid var(--hair);border-radius:2px;margin-top:8px;}
  .bx-proof div{background:var(--paper);padding:20px 20px 22px;display:flex;flex-direction:column;gap:8px;}
  .bx-proof b{font-weight:500;font-size:15px;color:var(--ink);letter-spacing:-.02em;}
  .bx-proof span{font-size:13px;color:var(--inkMute);line-height:1.5;}
  .bx-price{display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;margin-top:8px;}
  .bx-card{border:1px solid var(--hair);border-radius:2px;padding:20px;background:var(--paper);display:flex;flex-direction:column;gap:8px;}
  .bx-card .nm{font-weight:500;font-size:16px;color:var(--ink);}
  .bx-card .pr{font-weight:500;font-size:28px;letter-spacing:-.6px;color:var(--ink);}
  .bx-card .un{font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--inkMute);}
  .bx-card p{font-size:13.5px;color:var(--inkSoft);line-height:1.5;margin:0;}
  .bx-plans{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:20px;}
  .bx-plan{border:1px solid var(--hair);border-radius:2px;background:var(--paper);}
  .bx-plan h3{font-weight:500;font-size:16px;margin:0;padding:16px 20px;border-bottom:1px solid var(--hair);color:var(--ink);}
  .bx-plan table{width:100%;border-collapse:collapse;font-size:14px;}
  .bx-plan td{padding:12px 20px;border-bottom:1px solid var(--hair);color:var(--inkSoft);}
  .bx-plan tr:last-child td{border-bottom:none;}
  .bx-plan td.p{text-align:right;color:var(--ink);font-weight:500;white-space:nowrap;}
  .bx-plan td.p small{font-weight:400;color:var(--inkMute);font-size:12px;margin-left:4px;}
  .bx-hero-img{position:relative;margin-top:40px;aspect-ratio:16/9;border-radius:4px;overflow:hidden;background:var(--paperDeep);animation-name:bxImgIn !important;}
  .bx-hero-img picture,.bx-hero-img img{position:absolute;inset:0;width:100%;height:100%;display:block;}
  .bx-hero-img img{object-fit:cover;object-position:50% 0%;}
  @keyframes bxImgIn{from{transform:translate3d(0,18px,0) scale(.985);}to{transform:none;}}
  .bx-plan{overflow:hidden;}
  .bx-plan-img{position:relative;aspect-ratio:16/7;background:var(--paperDeep);border-bottom:1px solid var(--hair);}
  .bx-plan-img picture,.bx-plan-img img{position:absolute;inset:0;width:100%;height:100%;display:block;}
  .bx-plan-img img{object-fit:cover;}
  .cx-grid{display:grid;grid-template-columns:1.1fr 1fr;gap:48px;align-items:start;margin-top:8px;}
  .cx-note{margin-top:18px;font-size:13px;color:var(--inkMute);line-height:1.5;max-width:460px;}
  @media (max-width:900px){
    .bx-proof{grid-template-columns:1fr 1fr;}
    .bx-price,.bx-plans{grid-template-columns:1fr;}
    .cx-grid{grid-template-columns:1fr;gap:36px;}
    .bx-hero-img{margin-top:28px;aspect-ratio:4/3;}
  }
`

export default function BuildersPage() {
  return (
    <>
      <RevealObserver />
      <section className="hero">
        <div className="wrap">
          <span className="badge">{SITE_PRODUCT}</span>
          <h1>See every site.<br />On schedule.</h1>
          <p className="sub">
            Photos, maps, models and reports on a fixed schedule. Book one visit, or put a site on a monthly plan.
          </p>
          <div className="cta-row">
            <Link className="btn btn-night" href="/book/site">Book a site visit</Link>
            <Link className="learn-link" href="/book/site?plan=visual">Start a monthly plan →</Link>
            <Link className="learn-link" href="#quote">Talk to us</Link>
          </div>
          <div className="bx-hero-img">
            <SitePic name="tower-cranes" eager widths={[640, 960, 1280, 1600, 2000]} alt="Drone view of a high-rise under construction, with tower cranes" sizes="(max-width:900px) 100vw, 1100px" />
          </div>
        </div>
      </section>

      <section className="block rvl" aria-label="Why Bricks for site progress">
        <div className="wrap">
          <div className="bx-proof">
            {PROOF.map((x) => (
              <div key={x.k}><b>{x.k}</b><span>{x.v}</span></div>
            ))}
          </div>
        </div>
      </section>

      <SiteRail />

      <section className="block rvl" id="pricing" aria-label="Pricing">
        <div className="wrap">
          <div className="sec-head">
            <div><span className="over">Pricing</span><h2>Per visit, or per site each month.</h2></div>
          </div>
          <div className="bx-price">
            {PER_VISIT.map((x) => (
              <div key={x.key} className="bx-card">
                <span className="nm">{x.name}</span>
                <span className="pr">{fmt(x.price)}</span>
                <span className="un">{x.unit}</span>
                <p>{x.what}</p>
              </div>
            ))}
          </div>
          <div className="bx-plans">
            {PLANS.map((pl) => (
              <div key={pl.kind} className="bx-plan">
                <div className="bx-plan-img">
                  {pl.kind === 'Visual' ? (
                    <SitePic name="podium-formwork" alt="Drone view of a podium in formwork on an active site" sizes="(max-width:900px) 100vw, 540px" />
                  ) : (
                    <SitePic name="excavation-topdown" alt="Top-down drone view of a site in its foundation stage" sizes="(max-width:900px) 100vw, 540px" />
                  )}
                </div>
                <h3>{pl.kind} monitoring</h3>
                <table>
                  <tbody>
                    {pl.rows.map((r) => (
                      <tr key={r.cadence}>
                        <td>{r.cadence} · {r.visits} visit{r.visits === 1 ? '' : 's'}/mo</td>
                        <td className="p">{fmt(r.price)}<small>/ site / mo</small></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
          <p className="note">{PLAN_NOTE}</p>
          <div className="cta-row" style={{ marginTop: 18 }}>
            <Link className="btn btn-night" href="/book/site">Book one visit</Link>
            <Link className="btn btn-sec" href="/book/site?plan=visual">Start a plan</Link>
            <Link className="learn-link" href="#quote">Multiple sites or survey-grade? Talk to us →</Link>
          </div>
        </div>
      </section>

      <section className="block rvl" id="quote">
        <div className="wrap">
          <div className="cx-grid">
            <div>
              <div className="sec-head">
                <div><span className="over">Talk to us</span><h2>Several sites? Tell us about them.</h2></div>
              </div>
              <p className="cx-note">
                For portfolios, survey-grade work or anything custom. One site? <Link href="/book/site">Book it directly</Link>.
              </p>
            </div>
            <div>
              <ConstructionForm />
            </div>
          </div>
        </div>
      </section>
      <style>{pageCss}</style>
    </>
  )
}
