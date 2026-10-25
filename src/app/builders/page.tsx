import type { Metadata } from 'next'
import Link from 'next/link'
import RevealObserver from '@/components/RevealObserver'
import SiteRail from '@/components/builders/SiteRail'
import ConstructionForm from '../construction/ConstructionForm'
import SitePic from '@/components/builders/SitePic'
import ConstructionPic from '@/components/builders/ConstructionPic'
import { PER_VISIT, PLANS, PLAN_NOTE, fmt } from '@/lib/commercial'
import { Head, Rows, Stats } from '@/components/calm/Calm'
import { FeatureList, type FeatureItem } from '@/components/features/Feature'

export const metadata: Metadata = {
  title: 'Site progress software and drone visits for builders & developers | Bricks',
  description:
    'Progress reports, investor updates, 3D compare and your own capture imports for builders, developers, GCs and investors in Canada, with scheduled drone visits by vetted, insured, certified pilots. From $375 per visit or $300 per site per month.',
  alternates: { canonical: '/builders' },
  openGraph: {
    title: 'Site Progress for builders & developers | Bricks',
    description: 'Progress reports, investor updates and 3D compare from every dated site visit, ours or your own.',
  },
  twitter: {
    card: 'summary',
    title: 'Site Progress for builders & developers | Bricks',
    description: 'Progress reports, investor updates and 3D compare from every dated site visit.',
  },
}

/** Builder hub: live on app.brxs.ca. Reports are visual documentation; never call them certified or lender-certified. */
const HUB: readonly FeatureItem[] = [
  {
    title: 'Progress reports.',
    body: 'Pick a date range and Bricks drafts the report from your dated visits: true maps, before and after, milestones and what changed since the last report. Each edit is saved as a new revision, with a change log.',
    points: [
      'Download it as a PDF, or share a read-only link that expires',
      'Scale bars and photo location pins on every true map',
      'A scope line on every report: visual documentation of site conditions, not a cost, quantity or completion certification',
    ],
    shot: 'progress-report',
    alt: 'The top of a Bricks progress report with sample data: project, date range and an orthomosaic with a scale bar and two photo location pins',
  },
  {
    title: 'Measured, with the method shown.',
    body: 'Cut, fill, net volume and area changed between two point clouds, plus the areas and distances you save on the maps.',
    points: [
      'Every measurement names its method and where its scale comes from',
      'Volumes are an estimate for tracking progress, not a survey',
    ],
    shot: 'report-measure',
    alt: 'The measurements section of a Bricks progress report with sample data: fill, cut, net and area changed, the method and scale, and two measurements saved on the maps',
  },
  {
    title: 'Progress by line, and an issues log.',
    body: 'Each line item carries your % complete and the evidence that shows it, marked as your own figures. Issues are logged with a location and a photo, and stay open until you close them.',
    points: [
      'Line items weighted by value and marked as your figures',
      'Opened and closed dates on every issue',
    ],
    shot: 'report-issues',
    alt: 'The issues log of a Bricks progress report with sample data: two open issues and one closed, each with a location, a photo and dates',
  },
  {
    title: 'Evidence you can check.',
    body: 'Lenders and quantity surveyors get dated, measured evidence they can check. Every file in the evidence index carries a SHA-256 checksum.',
    points: [
      'Weather for each visit from NASA POWER, modelled for the site',
      'Capture details for each visit: aircraft, height, ground sample distance, and pilot certificate and ground control where recorded',
    ],
    shot: 'report-evidence',
    alt: 'The evidence index of a Bricks progress report with sample data: dated orthomosaics, point clouds and stills, each with a SHA-256 checksum, file name and size',
  },
  {
    title: 'Investor updates.',
    body: 'A monthly update on the same engine. Each one starts from the last, so what changed is already written. Add your schedule, budget, next steps and risks.',
    points: ['Schedule and budget figures stay marked as yours', 'Same PDF and expiring link as a progress report'],
    shot: 'investor-update',
    alt: 'The schedule and budget section of a Bricks investor update with sample data: change since the last update, target and forecast dates, budget, next steps and risks',
  },
  {
    title: 'Your own captures.',
    body: 'Upload or link maps, point clouds and models from another flight. Each import becomes a dated visit on the project timeline.',
    points: ['GeoTIFF, LAS, LAZ, E57, PLY, OBJ, GLB, photos, video or PDF, up to 5 GB a file', 'Marked as imported, so reports never say Bricks captured it'],
    shot: 'capture-import',
    alt: 'The Bricks form for adding your own captures with sample files: an orthomosaic GeoTIFF, a LAS point cloud and an OBJ model, plus a field to paste links',
  },
  {
    title: '3D compare.',
    body: 'Put two dates side by side, or show only what changed. Bricks measures fill, cut and the area changed between two point clouds.',
    points: ['Measured on a 0.5 m grid, coarser on very large sites; changes under 10 cm are left out', 'An estimate for tracking progress, not a survey'],
    shot: 'compare-3d',
    alt: 'Bricks comparing two point clouds of a sample site a month apart, with raised areas in orange and fill, cut and area changed measured below',
  },
]

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
  .bx-card .un{font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:0;text-transform:none;color:var(--inkMute);}
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
  .bx-photo{position:relative;margin-top:var(--gap,32px);border-radius:2px;overflow:hidden;background:var(--paperDeep);}
  .bx-photo picture,.bx-photo img{display:block;width:100%;height:100%;}
  .bx-photo img{object-fit:cover;}
  .bx-photo-wide{aspect-ratio:16/9;}
  .bx-photo-tall{aspect-ratio:4/5;max-width:440px;}
  .cx-note{margin-top:16px;font-size:13px;color:var(--inkMute);line-height:1.5;max-width:460px;}
  @media (max-width:900px){
    .bx-proof{grid-template-columns:1fr 1fr;}
    .bx-price,.bx-plans{grid-template-columns:1fr;}
    .cx-grid{grid-template-columns:1fr;gap:32px;}
    .bx-hero-img{margin-top:32px;aspect-ratio:4/3;}
    .bx-photo-wide{aspect-ratio:4/3;}
    .bx-photo-tall{display:none;}
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
            Progress reports, investor updates and 3D compare for builders, developers and investors. Built from every dated site visit, ours or your own.
          </p>
          <div className="cta-row">
            <Link className="btn btn-night btn-primary" href="/book/site">Book a site visit</Link>
            <a className="btn btn-sec" href="#hub">See the builder hub</a>
          </div>
          <div className="bx-hero-img">
            <SitePic name="tower-cranes" eager widths={[640, 960, 1280, 1600, 2000]} alt="Drone view of a high-rise under construction, with tower cranes" sizes="(max-width:900px) 100vw, 1100px" />
          </div>
        </div>
      </section>

      <section className="cm-sec" id="hub" aria-label="The builder hub">
        <Head title="The builder hub." lede="Dated, measured evidence from every visit, for your team, your lenders and your quantity surveyor." />
        <FeatureList items={HUB} label="Builder hub features" sheet="B" />
      </section>

      <section className="cm-sec rvl" aria-label="Why Bricks for Site Progress">
        <Head title="Flown by people you can put on site." />
        <Rows items={PROOF.map((x) => ({ title: x.k, detail: x.v }))} />
        <div className="bx-photo bx-photo-wide">
          <ConstructionPic name="quarry-aerial" alt="Aerial view of excavators and a bulldozer working in an open earthworks pit" sizes="(max-width:900px) 100vw, 1100px" />
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
            <div className="bx-photo bx-photo-tall">
              <ConstructionPic name="frame-building" alt="A concrete-frame apartment building under construction against a blue sky" sizes="(max-width:900px) 100vw, 560px" />
            </div>
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
