import type { Metadata } from 'next'
import Link from 'next/link'
import RevealObserver from '@/components/RevealObserver'
import SiteRail from '@/components/builders/SiteRail'
import ConstructionForm from '../construction/ConstructionForm'
import SitePic from '@/components/builders/SitePic'
import { PER_VISIT, PLANS, PLAN_NOTE, fmt } from '@/lib/commercial'
import { Head, Rows, Stats } from '@/components/calm/Calm'
import BuilderEdge from '@/components/BuilderEdge'
import AppShot from '@/components/AppShot'
import { BUILDER_EDGE_LEDE, BUILDER_EDGE_TITLE } from '@/lib/builder-edge'

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
  { k: 'One site file', v: 'Every visit dated, compared and shared through one link.' },
] as const

const pageCss = `
  .bx-proof{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:var(--hair);border:1px solid var(--hair);border-radius:2px;}
  .bx-proof div{background:var(--paper);padding:var(--card-pad);display:flex;flex-direction:column;gap:8px;}
  .bx-proof b{font-weight:500;font-size:15px;color:var(--ink);letter-spacing:-.02em;}
  .bx-proof span{font-size:13px;color:var(--inkMute);line-height:1.5;}
  .bx-price{display:grid;grid-template-columns:1fr 1fr 1fr;gap:var(--gap);}
  .bx-card{border:1px solid var(--hair);border-radius:2px;padding:var(--card-pad);background:var(--paper);display:flex;flex-direction:column;gap:8px;}
  .bx-card .nm{font-weight:500;font-size:16px;color:var(--ink);}
  .bx-card .pr{font-weight:500;font-size:28px;letter-spacing:-.6px;color:var(--ink);}
  .bx-card .un{font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--inkMute);}
  .bx-card p{font-size:13.5px;color:var(--inkSoft);line-height:1.5;margin:0;}
  .bx-plans{display:grid;grid-template-columns:1fr 1fr;gap:var(--gap);margin-top:var(--gap);}
  .bx-plan{border:1px solid var(--hair);border-radius:2px;background:var(--paper);}
  .bx-plan h3{font-weight:500;font-size:16px;margin:0;padding:16px var(--card-pad);border-bottom:1px solid var(--hair);color:var(--ink);}
  .bx-plan table{width:100%;border-collapse:collapse;font-size:14px;}
  .bx-plan td{padding:12px var(--card-pad);border-bottom:1px solid var(--hair);color:var(--inkSoft);}
  .bx-plan tr:last-child td{border-bottom:none;}
  .bx-plan td.p{text-align:right;color:var(--ink);font-weight:500;white-space:nowrap;}
  .bx-plan td.p small{font-weight:400;color:var(--inkMute);font-size:12px;margin-left:4px;}
  .bx-hero-img{position:relative;margin-top:48px;aspect-ratio:16/9;border-radius:2px;overflow:hidden;background:var(--paperDeep);animation-name:bxImgIn !important;}
  .bx-hero-img picture,.bx-hero-img img{position:absolute;inset:0;width:100%;height:100%;display:block;}
  .bx-hero-img img{object-fit:cover;object-position:50% 0%;}
  @keyframes bxImgIn{from{transform:translate3d(0,18px,0) scale(.985);}to{transform:none;}}
  .bx-plan{overflow:hidden;}
  .bx-plan-img{position:relative;aspect-ratio:16/7;background:var(--paperDeep);border-bottom:1px solid var(--hair);}
  .bx-plan-img picture,.bx-plan-img img{position:absolute;inset:0;width:100%;height:100%;display:block;}
  .bx-plan-img img{object-fit:cover;}
  .cx-grid{display:grid;grid-template-columns:1.1fr 1fr;gap:48px;align-items:start;}
  .bx-shots{margin-top:28px;}
  .cx-note{margin-top:16px;font-size:13px;color:var(--inkMute);line-height:1.5;max-width:460px;}
  @media (max-width:900px){
    .bx-proof{grid-template-columns:1fr 1fr;}
    .bx-price,.bx-plans{grid-template-columns:1fr;}
    .cx-grid{grid-template-columns:1fr;gap:32px;}
    .bx-hero-img{margin-top:32px;aspect-ratio:4/3;}
  }
`

export default function BuildersPage() {
  return (
    <>
      <RevealObserver />

      <section className="hero">
        <div className="wrap">
          <h1>See every site.<br />On schedule.</h1>
          <p className="sub">
            Dated drone photos and video on every visit, with maps and 3D models on mapped captures. For builders, developers and investors, compared over time in one site file.
          </p>
          <div className="cta-row">
            <Link className="btn btn-night btn-primary" href="/book/site">Book a site visit</Link>
          </div>
          <div className="bx-hero-img">
            <SitePic name="tower-cranes" eager widths={[640, 960, 1280, 1600, 2000]} alt="Drone view of a high-rise under construction, with tower cranes" sizes="(max-width:900px) 100vw, 1100px" />
          </div>
        </div>
      </section>

      <section className="cm-sec rvl" aria-label="Why Bricks for Site Progress">
        <Head title="Flown by people you can put on site." />
        <Rows items={PROOF.map((x) => ({ title: x.k, detail: x.v }))} />
      </section>

      <section className="cm-sec rvl" id="vs-local" aria-label="More than a local vendor">
        <Head title={BUILDER_EDGE_TITLE} lede={BUILDER_EDGE_LEDE} />
        <BuilderEdge />
      </section>

      <section className="cm-sec rvl" id="portal" aria-label="The site portal">
        <Head title="What your team sees." lede="Real screens from the Bricks portal, shown with sample projects." />
        <AppShot name="builder-overview" alt="Bricks builder overview with sample projects: a list of sites, upcoming visits and the latest deliveries" caption="Every site in one place, with upcoming visits and the latest deliveries." />
        <div className="appshot-grid bx-shots">
          <AppShot name="builder-timeline" sizes="(max-width:760px) 100vw, 540px" alt="Site visit timeline for a sample project: dated visits with orthomosaic, 3D model, photos and site report" caption="Each visit is filed by date, with maps, 3D models, photos and a site report." />
          <AppShot name="builder-report" sizes="(max-width:760px) 100vw, 540px" alt="Sample site report showing the visit date, phase, days since the last visit, a progress note and a photo" caption="A site report for each visit, with a progress note. Print it or save it as a PDF." />
          <AppShot name="builder-sharelinks" sizes="(max-width:760px) 100vw, 540px" alt="Stakeholder links panel for a sample project: live links for a lender and a general contractor, and one turned off" caption="Read-only links for your lender or GC. They expire, and you can turn one off anytime." />
          <AppShot name="builder-share" sizes="(max-width:760px) 100vw, 540px" alt="The read-only shared timeline a lender sees for a sample project, with the link's expiry date" caption="What your lender sees: the same dated visits, read-only." />
        </div>
      </section>

      <SiteRail />

      <section className="cm-sec rvl" id="pricing" aria-label="Pricing">
        <Head title="Per visit, or per site each month." lede="Book one visit, or put a site on a monthly plan." />
        <Stats
          label="Site Progress prices"
          items={[
            { fig: fmt(PER_VISIT[0].price), label: 'Progress visit' },
            { fig: fmt(PER_VISIT[1].price), label: 'Mapped capture' },
            { fig: fmt(PLANS[0].rows[0].price), label: 'Monthly plan, per site' },
          ]}
        />
        <details className="cm-more">
          <summary>All visit and plan prices</summary>
          <Rows
            items={[
              ...PER_VISIT.map((x) => ({ title: x.name, detail: x.what, value: `${fmt(x.price)} ${x.unit}` })),
              ...PLANS.flatMap((pl) =>
                pl.rows.map((r) => ({
                  title: `${pl.kind}, ${r.cadence.toLowerCase()}`,
                  detail: `${r.visits} visit${r.visits === 1 ? '' : 's'} a month`,
                  value: `${fmt(r.price)} / site / mo`,
                })),
              ),
            ]}
          />
        </details>
        <p className="cm-note">{PLAN_NOTE}</p>
      </section>

      <section className="cm-sec rvl" id="quote" aria-label="Several sites">
        <div className="cx-grid">
          <div>
            <Head title="Several sites? Tell us about them." lede="For portfolios, survey-grade work or anything custom." />
          </div>
          <div>
            <ConstructionForm />
          </div>
        </div>
      </section>

      <style>{pageCss}</style>
    </>
  )
}
