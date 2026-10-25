import type { Metadata } from 'next'
import Link from 'next/link'
import PlanCards from '@/components/PlanCards'
import RevealObserver from '@/components/RevealObserver'
import { PHOTO_RATE, DRONE_RATE, REEL_RATE, TOUR_RATE, TWILIGHT_RATE, VISIT_RATE, RUSH_FLAT, FLOOR_PLAN_ONLY_RATE, STAGING_PRICE_LABEL, STAGING_PER_IMAGE, bandCells, TOUR_RANGE, VISIT_PRICE_LABEL, FOOTPRINT_BANDS, CORE_FROM, STORY_FROM, SHOWCASE_FROM, FULL_FROM, PHOTO_ONLY_FROM } from '@/lib/pricing'
import { OFFICE_PLANS, OFFICE_INCLUDES, SOFTWARE_BLURB, SOFTWARE_PLANS, ADDONS, ADDONS_BLURB } from '@/lib/catalog'
import { PER_VISIT, PLANS, fmt } from '@/lib/commercial'
import { Head, Rows, Stats, Close } from '@/components/calm/Calm'
import {
  COVERAGE_LINE,
  STATUS,
  TOUR_NAME,
  TOUR_SHORT,
  VISIT_NAME,
  VISIT_SHORT,
} from '@/lib/brand'
import { mediaServiceSchema, osSoftwareApplicationSchema, type MediaOfferId } from '@/lib/schema'

export const metadata: Metadata = {
  title: 'Real Estate Photography Pricing & Software Plans Canada | Bricks',
  description:
    'Listing media from $248 for HDR photos, licensed drone and a floor plan, priced by home size. Software plans from free, plus brokerage seats. CAD.',
  alternates: { canonical: '/pricing' },
  openGraph: {
    title: 'Real Estate Photography Pricing & Plans | Bricks',
    description: 'Listing media from $248 for HDR photos, licensed drone and a floor plan. Software plans from free.',
    url: 'https://www.brxs.ca/pricing',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Real Estate Photography Pricing | Bricks',
    description: 'À la carte listing photo rates and software plans for Canadian real estate.',
  },
}

const BANDS = ['Small', 'Mid', 'Large', 'XL'] as const

/** Offers whose prices this page renders (packages + priced rows of the à la carte table). */
const PRICING_PAGE_OFFERS: readonly MediaOfferId[] = [
  'photos_only', 'essentials', 'story', 'showcase', 'suite', 'floor_plan_only',
  'drone', 'reel', 'tour', 'visit', 'twilight', 'staging', 'rush',
]

const rows = [
  { name: 'HDR photography', inc: 'Interiors and exteriors', vals: bandCells(PHOTO_RATE) },
  { name: 'Licensed drone', inc: 'Advanced RPAS certified', vals: bandCells(DRONE_RATE) },
  { name: 'Floor plan', inc: 'Branded 2D', flat: 'Included on every standard shoot' },
  { name: 'Floor plan only', inc: 'No photos or drone', flat: `$${FLOOR_PLAN_ONLY_RATE} flat` },
  { name: 'Cinematic reel', inc: '30–45 seconds', vals: bandCells(REEL_RATE) },
  { name: TOUR_NAME, inc: 'Path walkthrough', vals: bandCells(TOUR_RATE) },
  { name: VISIT_NAME, inc: 'Free-roam 3D', vals: bandCells(VISIT_RATE) },
  { name: 'Twilight exterior', inc: 'Shot at blue hour', vals: bandCells(TWILIGHT_RATE) },
  { name: 'Virtual staging', inc: 'Per photo', flat: STAGING_PRICE_LABEL },
  { name: 'Rush delivery', inc: 'Faster than standard delivery (photos 24h · other media 24–48h)', flat: `+$${RUSH_FLAT} flat`, row: 'flat' },
]

const PLAN_LINE: Record<string, string> = {
  clay: 'Listing file, transactions and your MLS. No card.',
  keystone: 'Adds CRM and e-sign.',
  marble: 'Adds forms.',
  diamond: 'Adds the AI suite.',
}

export default function PricingPage() {
  return (
    <>
      <RevealObserver />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(mediaServiceSchema({ url: 'https://www.brxs.ca/pricing', offers: PRICING_PAGE_OFFERS })) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(osSoftwareApplicationSchema('https://www.brxs.ca/pricing')) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              { '@type': 'Question', name: "What's in Essentials?", acceptedAnswer: { '@type': 'Answer', text: `HDR photos, licensed drone and a floor plan in one shoot, from $${CORE_FROM}.` } },
              { '@type': 'Question', name: 'Are the photos MLS-safe?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. We keep real window views and don’t add fake skies by default. Twilight is shot for real at blue hour.' } },
              { '@type': 'Question', name: 'How does travel work?', acceptedAnswer: { '@type': 'Answer', text: 'Travel is priced from the assigned photographer’s location: the first 25 km are free, then $0.75/km. It’s often free in the GTA, and you see it before you pay.' } },
              { '@type': 'Question', name: 'How is home size measured?', acceptedAnswer: { '@type': 'Answer', text: 'By finished area and complexity. Not sure? Choose "advise me" when you book and we\'ll size it from the address.' } },
              { '@type': 'Question', name: 'Virtual tour or virtual visit?', acceptedAnswer: { '@type': 'Answer', text: `A virtual tour follows a set path (${TOUR_RANGE}) and comes with Showcase and Full suite. A virtual visit is free-roam 3D, booked as an add-on (${VISIT_PRICE_LABEL.toLowerCase()}).` } },
              { '@type': 'Question', name: 'What is virtual staging?', acceptedAnswer: { '@type': 'Answer', text: `Furniture and décor added to photos of empty or dated rooms. $${STAGING_PER_IMAGE} per photo, before tax, and not part of any package.` } },
              { '@type': 'Question', name: 'Where do you shoot?', acceptedAnswer: { '@type': 'Answer', text: 'Across Canada. Ask and we’ll confirm your area and quote any travel.' } },
              { '@type': 'Question', name: 'Can I add AI without upgrading?', acceptedAnswer: { '@type': 'Answer', text: ADDONS_BLURB } },
            ],
          }),
        }}
      />

      <section className="hero">
        <div className="wrap">
          <h1>Pricing.</h1>
          <p className="sub">Start free on the software. Book media and site visits inside it when you need them.</p>
        </div>
      </section>

      <section className="cm-sec pr-first" aria-label="Starting prices">
        <Stats
          label="Starting prices"
          items={[
            { fig: 'Free', label: 'Software, to start' },
            { fig: `$${CORE_FROM}`, label: 'Listing media, from' },
            { fig: fmt(PER_VISIT[0].price), label: 'Site visit, from' },
          ]}
        />
      </section>

      <section className="cm-sec rvl" aria-label="Software plans">
        <Head title="Software plans." lede={SOFTWARE_BLURB} />
        <Rows items={SOFTWARE_PLANS.map((p) => ({ title: p.name, detail: PLAN_LINE[p.id], value: p.price }))} />
        <details className="cm-more">
          <summary>Compare every feature</summary>
          <PlanCards />
        </details>
        <p className="cm-note">Plans and office seats are billed under the <Link href="/terms#plans">software plan terms</Link>: billing cycle, renewal, cancellation and refunds.</p>
      </section>

      <section className="cm-sec rvl" aria-label="AI add-ons">
        <Head title="AI, without upgrading." lede={ADDONS_BLURB} />
        <Rows items={ADDONS.map((a) => ({ title: a.name, value: a.price }))} />
      </section>

      <section className="cm-sec rvl" aria-label="Brokerage seats">
        <Head title="Brokerages, per seat." lede={OFFICE_INCLUDES} link={{ href: '/brokerage', label: 'For brokerages' }} />
        <Rows items={OFFICE_PLANS.map((p) => ({ title: p.name, detail: p.seats, value: p.price }))} />
      </section>

      <section className="cm-sec rvl" aria-label="Site Progress">
        <Head title="Site Progress." lede="Per visit, or per site each month." link={{ href: '/builders', label: 'For builders' }} />
        <Rows
          items={[
            { title: PER_VISIT[0].name, detail: PER_VISIT[0].what, value: `${fmt(PER_VISIT[0].price)} ${PER_VISIT[0].unit}` },
            { title: PER_VISIT[1].name, detail: PER_VISIT[1].what, value: `${fmt(PER_VISIT[1].price)} ${PER_VISIT[1].unit}` },
            { title: 'Monthly plans', detail: 'Visual or mapped, monthly to weekly.', value: `from ${fmt(PLANS[0].rows[0].price)} / site / mo` },
          ]}
        />
      </section>

      <section className="cm-sec rvl" aria-label="Listing media">
        <Head title="Listing media." lede="Prices are for smaller homes and scale with size." />
        <Rows
          items={[
            { title: 'Essentials', detail: 'HDR photos, licensed drone and a floor plan.', value: `from $${CORE_FROM}` },
            { title: 'Story', detail: 'Essentials, plus a cinematic reel.', value: `from $${STORY_FROM}` },
            { title: 'Showcase', detail: 'Story, plus a virtual tour.', value: `from $${SHOWCASE_FROM}` },
            { title: 'Full suite', detail: 'Showcase, plus a twilight exterior.', value: `from $${FULL_FROM}` },
          ]}
        />
        <p className="cm-note">Just need photos? HDR only, from ${PHOTO_ONLY_FROM}.</p>

        <details className="cm-more rates">
          <summary>Every rate, by home size</summary>
          <table className="tbl">
            <thead>
              <tr><th style={{ textAlign: 'left' }}>Service</th><th>Small</th><th>Mid</th><th>Large</th><th>XL</th></tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.name} className={r.row}>
                  <td className="pkg">{r.name}<span className="inc">{r.inc}</span></td>
                  {r.flat ? (
                    <td className="num flat-val" colSpan={4} data-flat="1">{r.flat}</td>
                  ) : (
                    r.vals!.map((v, i) => <td key={i} className="num" data-band={BANDS[i]}>{v}</td>)
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="cm-note">Small: up to 1,200 sq ft. Mid: 1,200–2,500. Large: 2,500–4,000. XL: 4,000+. Travel is priced from the assigned photographer’s location: first 25 km free, then $0.75/km. Prices in CAD, before HST.</p>
        </details>
      </section>

        <section className="cm-sec rvl" aria-label="Questions">
          <Head title="Before you book." />
          <div className="faq">
            <div className="qa"><h4>What&apos;s in Essentials?</h4><p>HDR photos, licensed drone and a floor plan in one shoot.</p></div>
            <div className="qa"><h4>Are the photos MLS-safe?</h4><p>Yes. We keep real window views and don&apos;t add fake skies by default. Twilight is shot for real at blue hour.</p></div>
            <div className="qa"><h4>How does travel work?</h4><p>Travel is priced from the assigned photographer&apos;s location: the first 25 km are free, then $0.75/km. It&apos;s often free in the GTA, and you see it before you pay.</p></div>
            <div className="qa"><h4>How is home size measured?</h4><p>By finished area and complexity. Not sure? Choose &quot;advise me&quot; when you book and we&apos;ll size it from the address.</p></div>
            <div className="qa"><h4>Virtual tour or virtual visit?</h4><p>A virtual tour follows a set path and comes with Showcase and Full suite. A virtual visit is free-roam 3D, booked as an add-on.</p></div>
            <div className="qa"><h4>What is virtual staging?</h4><p>Furniture and décor added to photos of empty or dated rooms. Priced per photo and not part of any package.</p></div>
            <div className="qa"><h4>Where do you shoot?</h4><p>Across Canada. Ask and we&apos;ll confirm your area and quote any travel.</p></div>
            <div className="qa"><h4>Can I add AI without upgrading?</h4><p>{ADDONS_BLURB}</p></div>
            <div className="qa"><h4>Brokerage or individual plan?</h4><p>Agents choose a plan from Clay to Diamond. Brokerages buy seats yearly, and every seat gets all of Bricks plus trust accounting.</p></div>
          </div>
        </section>


      <Close title="Start free. Book when you need to." href="https://app.brxs.ca/login" label="Try Bricks free" external />

      <style>{`
        .trust{text-align:center;padding:8px 0 28px;}
        .rates{overflow-x:clip;}
        .tbl{width:100%;max-width:100%;border-collapse:collapse;}
        /* calm */ .pr-first{padding-top:8px;} .rates .tbl{margin-top:8px;} .tbl td.num{font-size:13px!important;} .tbl tr.flat td{background:none!important;}
        .tbl-cap{text-align:left;font-size:15px;line-height:1.5;color:var(--inkSoft);max-width:560px;padding:0 0 24px;margin-top:calc(var(--head-gap) * -1 + 16px);}
        .tbl th,.tbl td{padding:16px var(--card-pad);text-align:right;border-bottom:1px solid var(--hair);}
        .tbl th{font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:0;
          text-transform:none;color:var(--inkMute);font-weight:500;background:var(--paperSoft);}
        .tbl td.pkg{text-align:left;font-weight:500;color:var(--ink);font-size:15px;}
        .tbl td.pkg .inc{display:block;font-size:13px;color:var(--inkMute);font-weight:400;margin-top:3px;}
        .tbl td.num{font-family:'JetBrains Mono',monospace;font-size:15px;color:var(--inkSoft);}
        .tbl td.num.flat-val{text-align:center;}
        .tbl tr.flat td{background:var(--paperDeep);}
        .tbl tr:last-child td{border-bottom:none;}
        .price-foot{max-width:680px;margin:32px auto 0;text-align:center;}
        @media (max-width:720px){
          .tbl thead{display:none;}
          .tbl, .tbl tbody, .tbl tr, .tbl th, .tbl td{display:block;width:100%;max-width:100%;box-sizing:border-box;text-align:left;}
          .tbl tr{border:1px solid var(--hair);border-radius:2px;overflow:hidden;background:var(--paper);margin:0 0 var(--gap);}
          .tbl th, .tbl td{padding:12px var(--card-pad);border-bottom:1px solid var(--hair);}
          .tbl td.pkg{border-bottom:1px solid var(--hair);font-size:15px;}
          .tbl td.num{display:flex;justify-content:space-between;align-items:center;text-align:right;font-size:15px;}
          .tbl td.num::before{content:attr(data-band);font-family:var(--vs-sans);font-size:13px;color:var(--inkMute);}
          .tbl td.num[colspan]::before,
          .tbl td.num.flat-val::before{content:none;}
          .tbl td.num[colspan],
          .tbl td.num.flat-val{display:block;text-align:left;}
          .tbl tr:last-child td, .tbl td:last-child{border-bottom:none;}
        }
      `}</style>
    </>
  )
}

