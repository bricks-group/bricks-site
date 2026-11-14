import type { Metadata } from 'next'
import Link from 'next/link'
import PlanCards from '@/components/PlanCards'
import PlanChoice from '@/components/PlanChoice'
import RevealObserver from '@/components/RevealObserver'
import { PHOTO_RATE, DRONE_RATE, REEL_RATE, TOUR_RATE, TWILIGHT_RATE, VISIT_RATE, RUSH_FLAT, FLOOR_PLAN_ONLY_RATE, STAGING_PRICE_LABEL, STAGING_PER_IMAGE, VIRTUAL_STAGING_ENABLED, bandCells, TOUR_RANGE, VISIT_PRICE_LABEL, FOOTPRINT_BANDS, CORE_FROM, STORY_FROM, SHOWCASE_FROM, FULL_FROM, PHOTO_ONLY_FROM } from '@/lib/pricing'
import { OFFICE_PLANS, OFFICE_INCLUDES, OFFICE_MONTHLY_NOTE, OFFICE_SEAT_PRICE_PER_YEAR, ADDONS } from '@/lib/catalog'
import { PER_VISIT, PLANS, PLAN_NOTE, SITE_PROGRESS_LINE, fmt } from '@/lib/commercial'
import { fromPriceFor } from '@/lib/propertyCheckout'
import { Head, Rows, Stats, Close } from '@/components/calm/Calm'
import {
  COVERAGE_LINE,
  STATUS,
  TOUR_NAME,
  TOUR_SHORT,
  VISIT_NAME,
  VISIT_SHORT,
} from '@/lib/brand'
import { mediaServiceSchema, virtualVisitServiceSchema, osSoftwareApplicationSchema, type MediaOfferId } from '@/lib/schema'
import { OG_IMAGE } from '@/lib/og'

export const metadata: Metadata = {
  title: "Pricing: Software Plans and Listing Media | Bricks",
  description:
    'Clay is free; Keystone $49, Marble $99, Diamond $149 a month. Listing media from $248, priced by home size. Brokerage seats from $300 a year. CAD.',
  alternates: { canonical: '/pricing' },
  openGraph: { images: [OG_IMAGE],
    title: "Pricing: Software Plans and Listing Media | Bricks",
    description: 'Listing media from $248 for HDR photos, licensed drone and a floor plan. Software plans from free.',
    url: 'https://www.brxs.ca/pricing',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Pricing: Software Plans and Listing Media | Bricks",
    description: 'À la carte listing photo rates and software plans for Canadian real estate.',
  },
}

const BANDS = ['Small', 'Mid', 'Large', 'XL'] as const

const fromFor = fromPriceFor

/** Offers whose prices this page renders (packages + priced rows of the à la carte table). */
const PRICING_PAGE_OFFERS: readonly MediaOfferId[] = [
  'photos_only', 'essentials', 'story', 'showcase', 'suite', 'floor_plan_only',
  'drone', 'reel', 'tour', 'visit', 'twilight', ...(VIRTUAL_STAGING_ENABLED ? (['staging'] as const) : []), 'rush',
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
  ...(VIRTUAL_STAGING_ENABLED ? [{ name: 'Virtual staging', inc: 'Per photo', flat: STAGING_PRICE_LABEL }] : []),
  { name: 'Rush delivery', inc: 'Faster than standard delivery (photos 24h · other media 24–48h)', flat: `+$${RUSH_FLAT} flat`, row: 'flat' },
]

export default function PricingPage() {
  return (
    <>
      <RevealObserver />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(virtualVisitServiceSchema('https://www.brxs.ca/media#virtual-visit')) }} />
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
              { '@type': 'Question', name: 'Are the photos MLS®-safe?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. We keep real window views and don’t add fake skies by default. Twilight is shot for real at blue hour.' } },
              { '@type': 'Question', name: 'How does travel work?', acceptedAnswer: { '@type': 'Answer', text: 'Travel is $0 for properties inside the no-travel-fee area shown on our coverage map. Outside that area, travel is priced from the assigned photographer’s location: the first 25 km are free, then $0.75 per additional km. Your assigned photographer and final travel fee are confirmed before payment.' } },
              { '@type': 'Question', name: 'How is home size measured?', acceptedAnswer: { '@type': 'Answer', text: 'By finished area and complexity. Not sure? Choose "advise me" when you book and we\'ll size it from the address.' } },
              { '@type': 'Question', name: 'Virtual tour or virtual visit?', acceptedAnswer: { '@type': 'Answer', text: `A virtual tour follows a set path (${TOUR_RANGE}) and comes with Showcase and Full suite. A virtual visit is free-roam 3D, booked as an add-on (${VISIT_PRICE_LABEL.toLowerCase()}).` } },
              ...(VIRTUAL_STAGING_ENABLED ? [{ '@type': 'Question', name: 'What is virtual staging?', acceptedAnswer: { '@type': 'Answer', text: `Furniture added to photos of vacant rooms, marked as virtually staged. $${STAGING_PER_IMAGE} per photo, before tax, and not part of any package.` } }] : []),
              { '@type': 'Question', name: 'Where do you shoot?', acceptedAnswer: { '@type': 'Answer', text: 'Across Canada. Ask and we’ll confirm your area and quote any travel.' } },
              { '@type': 'Question', name: 'Can I add Brixton AI without changing plan?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Brixton AI is one switch on a paid plan. Diamond includes it.' } },
            ],
          }),
        }}
      />

      <section className="hero">
        <div className="wrap">
          <h1>Pricing.</h1>
          <p className="sub">Start free. Book media and site visits when you need them.</p>
          <div className="cta-row">
            <Link className="btn btn-night btn-primary" href="/book">Book</Link>
          </div>
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
        <Head title="Software plans." lede="Start free. The $99 plan is the one we recommend. Pay yearly and get two months free." />
        <PlanChoice />
        <details className="cm-more">
          <summary>Compare every feature</summary>
          <PlanCards />
        </details>
        <p className="cm-note">Plans and office seats are billed under the <Link href="/terms#plans">software plan terms</Link>: billing cycle, renewal, cancellation and refunds.</p>
      </section>

      <section className="cm-sec rvl" aria-label="Brixton AI">
        <Head title="Brixton AI." lede="One switch on a paid plan. Diamond includes it." />
        <details className="cm-more">
          <summary>What you can add, and what it costs</summary>
          <Rows items={ADDONS.map((a) => ({ title: a.name, value: a.price }))} />
        </details>
      </section>

      <section className="cm-sec rvl" aria-label="Brokerage seats">
        <Head title="Brokerages, per seat." lede={`${OFFICE_INCLUDES} Seats from $${OFFICE_SEAT_PRICE_PER_YEAR.franchise.toLocaleString('en-CA')} a year.`} link={{ href: '/brokerage', label: 'For brokerages' }} />
        <Rows items={OFFICE_PLANS.map((p) => ({ title: p.name, detail: p.seats, value: p.price }))} />
        <details className="cm-more">
          <summary>Month to month, and teams</summary>
          <p className="cm-note">{OFFICE_MONTHLY_NOTE} Up to 6 agents fit on one <Link href="/teams">team plan</Link>.</p>
        </details>
      </section>

      <section className="cm-sec rvl" aria-label="Site Progress">
        <Head title="Site Progress." lede={SITE_PROGRESS_LINE} link={{ href: '/builders', label: 'For builders' }} />
        <details className="cm-more">
          <summary>Every visit and plan</summary>
          <Rows
            items={[
              { title: PER_VISIT[0].name, detail: PER_VISIT[0].what, value: `${fmt(PER_VISIT[0].price)} ${PER_VISIT[0].unit}` },
              { title: PER_VISIT[1].name, detail: PER_VISIT[1].what, value: `${fmt(PER_VISIT[1].price)} ${PER_VISIT[1].unit}` },
              { title: PER_VISIT[2].name, detail: PER_VISIT[2].what, value: `${fmt(PER_VISIT[2].price)} ${PER_VISIT[2].unit}` },
              ...PLANS.flatMap((plan) => plan.rows.map((row) => ({
                title: `${plan.kind}, ${row.cadence.toLowerCase()}`,
                detail: `${row.visits} visit${row.visits === 1 ? '' : 's'} a month, per site.`,
                value: `${fmt(row.price)} / site / mo`,
              }))),
            ]}
          />
          <p className="cm-note">{PLAN_NOTE}</p>
        </details>
      </section>

      <section className="cm-sec rvl" aria-label="Property accounts">
        <Head title="Property accounts." lede="Visits priced per unit, space or property, booked and paid online. CAD, plus tax based on the property's province." />
        <Rows
          items={[
            { title: 'Property managers', detail: 'Listing sets, condition reports and turnovers, per unit.', value: `from ${fromFor('property_manager')}`, href: '/property-managers' },
            { title: 'Commercial', detail: 'Leasing sets priced by space size, and aerial sets.', value: `from ${fromFor('commercial')}`, href: '/commercial' },
            { title: 'Investors', detail: 'Acquisition captures, with or without a mapped site.', value: `from ${fromFor('investor')}`, href: '/investors' },
            { title: 'REITs', detail: 'Every visit above, 10% off at 10 or more properties and 15% off at 25.', href: '/reits' },
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
          <p className="cm-note">Small: up to 1,200 sq ft. Mid: 1,200–2,500. Large: 2,500–4,000. XL: 4,000+. Travel is $0 inside the no-travel-fee area on our coverage map; outside it, the first 25 km from the assigned photographer are free, then $0.75 per additional km, confirmed before payment. Prices in CAD, plus tax based on the property's province.</p>
        </details>
      </section>

        <section className="cm-sec rvl" aria-label="Questions">
          <Head title="Before you book." />
          <div className="faq">
            <div className="qa"><h3>What&apos;s in Essentials?</h3><p>HDR photos, licensed drone and a floor plan in one shoot.</p></div>
            <div className="qa"><h3>Are the photos MLS®-safe?</h3><p>Yes. We keep real window views and don&apos;t add fake skies by default. Twilight is shot for real at blue hour.</p></div>
            <div className="qa"><h3>How does travel work?</h3><p>Travel is $0 for properties inside the no-travel-fee area shown on our coverage map. Outside that area, travel is priced from the assigned photographer&apos;s location: the first 25 km are free, then $0.75 per additional km. Your assigned photographer and final travel fee are confirmed before payment.</p></div>
            <div className="qa"><h3>How is home size measured?</h3><p>By finished area and complexity. Not sure? Choose &quot;advise me&quot; when you book and we&apos;ll size it from the address.</p></div>
            <div className="qa"><h3>Virtual tour or virtual visit?</h3><p>A virtual tour follows a set path and comes with Showcase and Full suite. A virtual visit is free-roam 3D, booked as an add-on.</p></div>
            {VIRTUAL_STAGING_ENABLED && <div className="qa"><h3>What is virtual staging?</h3><p>Furniture added to photos of vacant rooms, marked as virtually staged. Priced per photo and not part of any package.</p></div>}
            <div className="qa"><h3>Where do you shoot?</h3><p>Across Canada. Ask and we&apos;ll confirm your area and quote any travel.</p></div>
            <div className="qa"><h3>Can I add Brixton AI without changing plan?</h3><p>Yes. Brixton AI is one switch on a paid plan. Diamond includes it.</p></div>
            <div className="qa"><h3>Brokerage or individual plan?</h3><p>Agents start free, or pick a paid plan. Offices buy seats, from ${OFFICE_SEAT_PRICE_PER_YEAR.franchise.toLocaleString('en-CA')} a year. Every seat gets all of Bricks plus trust accounting.</p></div>
          </div>
        </section>


      <Close title="See the price before you pay." href="/book" label="Book" />

      <style>{`
        .hero .cta-row{margin-top:28px;}
        .pr-choice{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:0;border-top:var(--vs-hair);border-bottom:var(--vs-hair);}
        .pr-choice li{padding:28px 28px 28px 0;min-width:0;}
        .pr-choice li + li{padding-left:28px;border-left:var(--vs-hair);}
        .pr-choice .pr-choice-price{margin:0;font-family:var(--vs-mono);font-size:22px;letter-spacing:-.02em;color:var(--vs-fg);font-variant-numeric:tabular-nums;display:flex;flex-wrap:wrap;align-items:baseline;gap:8px 12px;}
        .pr-choice .pr-choice-rec{font-family:var(--vs-sans);font-size:13px;font-weight:500;letter-spacing:0;color:var(--vs-fg);}
        .pr-choice h3{margin:14px 0 0;font-size:17px;font-weight:500;letter-spacing:-.02em;color:var(--vs-fg);}
        .pr-choice .pr-choice-line{margin:8px 0 0;font-size:15px;line-height:1.45;color:var(--vs-fg-2);max-width:28ch;}
        .pr-choice .pr-choice-yr{margin:16px 0 0;font-size:13px;color:var(--vs-fg-3);line-height:1.4;}
        .pr-choice li.is-rec{box-shadow:inset 2px 0 0 var(--vs-fg);}
        @media (max-width:900px){
          .pr-choice{grid-template-columns:1fr 1fr;}
          .pr-choice li{padding:22px 20px 22px 0;}
          .pr-choice li + li{padding-left:20px;}
          .pr-choice li:nth-child(odd){border-left:none;padding-left:0;}
          .pr-choice li:nth-child(n+3){border-top:var(--vs-hair);}
        }
        @media (max-width:560px){
          .pr-choice{grid-template-columns:1fr;}
          .pr-choice li,.pr-choice li + li{padding:18px 0;border-left:none;}
          .pr-choice li + li{border-top:var(--vs-hair);}
          .pr-choice li.is-rec{box-shadow:inset 2px 0 0 var(--vs-fg);padding-left:16px;}
        }
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

