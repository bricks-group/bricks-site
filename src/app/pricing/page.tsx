import type { Metadata } from 'next'
import Link from 'next/link'
import PlanCards from '@/components/PlanCards'
import RevealObserver from '@/components/RevealObserver'
import { PHOTO_RATE, DRONE_RATE, REEL_RATE, TOUR_RATE, TWILIGHT_RATE, VISIT_RATE, RUSH_FLAT, FLOOR_PLAN_ONLY_RATE, STAGING_PRICE_LABEL, VIRTUAL_STAGING_ENABLED, bandCells, FOOTPRINT_BANDS, CORE_FROM, STORY_FROM, SHOWCASE_FROM, FULL_FROM, PHOTO_ONLY_FROM } from '@/lib/pricing'
import { OFFICE_PLANS, OFFICE_INCLUDES, OFFICE_MONTHLY_NOTE, SOFTWARE_BLURB, SOFTWARE_PLANS, ADDONS, ADDONS_BLURB } from '@/lib/catalog'
import { PER_VISIT, PLANS, fmt } from '@/lib/commercial'
import { fromPriceFor } from '@/lib/propertyCheckout'
import { Head, Rows, Stats, Close } from '@/components/calm/Calm'
import {
  COVERAGE_LINE,
  STATUS,
  TOUR_NAME,
  TOUR_SHORT,
  VISIT_NAME,
  VISIT_SHORT,
  signupUrl,
} from '@/lib/brand'
import { mediaServiceSchema, virtualVisitServiceSchema, osSoftwareApplicationSchema, faqPageSchema, type MediaOfferId } from '@/lib/schema'
import { PRICING_FAQS } from '@/lib/faq-content'
import RichFaqList from '@/components/RichFaqList'
import { OG_IMAGE } from '@/lib/og'

const PRICING_DESC = `Bricks pricing in CAD: software plans from free, brokerage seats, listing media from $${CORE_FROM} by home size and Site Progress visits from ${fmt(PER_VISIT[0].price)}.`

export const metadata: Metadata = {
  title: "Pricing: Software Plans and Listing Media | Bricks",
  description: PRICING_DESC,
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

const PLAN_LINE: Record<string, string> = {
  clay: 'Listing file, transactions and your MLS®. No card.',
  keystone: 'Adds CRM and e-sign.',
  marble: 'Adds forms.',
  diamond: 'Adds the AI suite.',
}

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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema(PRICING_FAQS)) }} />

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
        <p className="cm-note">{OFFICE_MONTHLY_NOTE} Up to 6 agents fit on one <Link href="/teams">team plan</Link>.</p>
      </section>

      <section className="cm-sec rvl" aria-label="Site Progress">
        <Head title="Site Progress." lede="One vendor, one portal, dated evidence for every draw. Per visit, or per site each month." link={{ href: '/builders', label: 'For builders' }} />
        <Rows
          items={[
            { title: PER_VISIT[0].name, detail: PER_VISIT[0].what, value: `${fmt(PER_VISIT[0].price)} ${PER_VISIT[0].unit}` },
            { title: PER_VISIT[1].name, detail: PER_VISIT[1].what, value: `${fmt(PER_VISIT[1].price)} ${PER_VISIT[1].unit}` },
            { title: 'Monthly plans', detail: 'Visual or mapped, monthly to weekly.', value: `from ${fmt(PLANS[0].rows[0].price)} / site / mo` },
          ]}
        />
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
          <RichFaqList faqs={PRICING_FAQS} />
        </section>


      <Close title="Start free. Book when you need to." href={signupUrl('solo')} label="Try Bricks free" external />

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

