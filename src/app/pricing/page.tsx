import type { Metadata } from 'next'
import Link from 'next/link'
import RevealObserver from '@/components/RevealObserver'
import { PHOTO_RATE, DRONE_RATE, REEL_RATE, TOUR_RATE, TWILIGHT_RATE, VISIT_RATE, RUSH_FLAT, FLOOR_PLAN_ONLY_RATE, STAGING_PRICE_LABEL, STAGING_PER_IMAGE, bandCells, TOUR_RANGE, VISIT_PRICE_LABEL, FOOTPRINT_BANDS, CORE_FROM, STORY_FROM, SHOWCASE_FROM, FULL_FROM, PHOTO_ONLY_FROM } from '@/lib/pricing'
import { SOFTWARE_PLANS, OFFICE_PLANS, OFFICE_INCLUDES, SOFTWARE_BLURB, ADDONS, ADDONS_BLURB } from '@/lib/catalog'
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
    'Essentials from $248 — HDR + licensed drone + floor plan. À la carte by footprint plus Clay–Diamond software and brokerage seats. CAD. 24–48h target. Virtual visit $249–$399 by footprint, never packaged.',
  alternates: { canonical: '/pricing' },
  openGraph: {
    title: 'Real Estate Photography Pricing & Plans | Bricks',
    description: 'Essentials from $248 (HDR + licensed drone + floor plan). Listing media by footprint — virtual visit never packaged.',
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
  { name: 'HDR photography', inc: 'interiors + exteriors', vals: bandCells(PHOTO_RATE) },
  { name: 'Licensed drone', inc: 'Advanced RPAS-certified aerial', vals: bandCells(DRONE_RATE) },
  { name: 'Floor plan', inc: 'branded 2D — every standard shoot', flat: 'Included on every standard shoot' },
  { name: 'Floor plan only', inc: 'standalone 2D capture — no HDR / no drone', flat: `$${FLOOR_PLAN_ONLY_RATE} flat` },
  { name: 'Cinematic reel', inc: '30–45s', vals: bandCells(REEL_RATE) },
  { name: TOUR_NAME, inc: TOUR_SHORT, vals: bandCells(TOUR_RATE) },
  { name: VISIT_NAME, inc: `${VISIT_SHORT} — add-on, never packaged`, vals: bandCells(VISIT_RATE) },
  { name: 'Twilight exterior', inc: 'golden hour', vals: bandCells(TWILIGHT_RATE) },
  { name: 'Virtual staging', inc: 'per photo — not included in any package', flat: STAGING_PRICE_LABEL },
  { name: 'Rush delivery', inc: 'faster than the standard 24–48h target', flat: `+$${RUSH_FLAT} flat`, row: 'flat' },
]

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
              { '@type': 'Question', name: `Why Essentials from $${CORE_FROM}?`, acceptedAnswer: { '@type': 'Answer', text: `Essentials is HDR + licensed drone + floor plan — the drone-included listing set from $${CORE_FROM}. Compare that stack to photo-only peers that upsell drone later.` } },
              { '@type': 'Question', name: 'Are the stills MLS-safe?', acceptedAnswer: { '@type': 'Answer', text: 'Real window views. Bricks does not invent sky or dusk by default. Twilight is a real blue-hour exterior add-on.' } },
              { '@type': 'Question', name: 'How does travel work?', acceptedAnswer: { '@type': 'Answer', text: 'GTA assign-first is often $0. Outside that: first 25 km from the assigned photographer base free, then $0.75/km — shown before you pay. Not free Canada-wide.' } },
              { '@type': 'Question', name: 'How is footprint defined?', acceptedAnswer: { '@type': 'Answer', text: 'Small / Mid / Large / XL map to the property\'s finished area and complexity. Not sure which tier? Pick "advise me" in booking and we\'ll size it from the address.' } },
              { '@type': 'Question', name: `Virtual tour vs virtual visit?`, acceptedAnswer: { '@type': 'Answer', text: `${TOUR_NAME} (${TOUR_SHORT}) is a ${TOUR_RANGE} add-on by footprint. Showcase and Full suite include it. ${VISIT_NAME} (${VISIT_SHORT}) is always a paid add-on, ${VISIT_PRICE_LABEL.toLowerCase()}, never packaged.` } },
              { '@type': 'Question', name: 'What is virtual staging?', acceptedAnswer: { '@type': 'Answer', text: `Furniture and décor added to empty or dated interior photos in post. Furniture and décor added in post. $${STAGING_PER_IMAGE} per photo, before tax, charged at checkout. Not included in any package.` } },
              { '@type': 'Question', name: 'Where do you shoot?', acceptedAnswer: { '@type': 'Answer', text: `Canada — ${COVERAGE_LINE} Ask and we'll tell you if it's covered and quote travel if needed.` } },
              { '@type': 'Question', name: 'Can I add AI without upgrading?', acceptedAnswer: { '@type': 'Answer', text: ADDONS_BLURB } },
            ],
          }),
        }}
      />

      <section className="hero">
        <div className="wrap">
          <span className="badge">Pricing</span>
          <h1>Software, seats, and listing photo pricing.</h1>
          <p className="sub">Clay is free. Paid plans add CRM, checklist e-sign + shareable links, forms, and AI. On-document PDF placement is not available yet. Brokerage seats yearly. Listing media leads with <strong>Essentials from ${CORE_FROM}</strong> — HDR + licensed drone + floor plan (not a photo-only peer stack). Virtual visit ({VISIT_SHORT}) is {VISIT_PRICE_LABEL} by footprint — never packaged. {STATUS.os}</p>
        </div>
      </section>

      <div className="wrap">
        <section className="block rvl" aria-label="Software plans">
          <div className="sec-head">
            <div>
              <span className="over">Individuals</span>
              <h2>Clay, Keystone, Marble, Diamond.</h2>
            </div>
          </div>
          <p className="tbl-cap">{SOFTWARE_BLURB} Monthly, or yearly — pay 10, get 12.</p>
          <div className="incl">
            {SOFTWARE_PLANS.map((p) => (
              <div key={p.id} className="c rvl">
                <span className="ic">{p.price}</span>
                <h4>{p.name}</h4>
                <p>{p.yearly}. {p.points.join('. ')}.</p>
              </div>
            ))}
          </div>
        </section>

        <section className="block rvl" aria-label="AI add-ons">
          <div className="sec-head">
            <div>
              <span className="over">Add-ons</span>
              <h2>AI without jumping plans.</h2>
            </div>
          </div>
          <p className="tbl-cap">{ADDONS_BLURB} CAD / month.</p>
          <div className="incl three">
            {ADDONS.map((a) => (
              <div key={a.id} className="c rvl">
                <span className="ic">{a.price}</span>
                <h4>{a.name}</h4>
                <p>CAD / month. Included in Diamond.</p>
              </div>
            ))}
          </div>
        </section>

        <section className="block rvl" aria-label="Brokerage seats">
          <div className="sec-head">
            <div>
              <span className="over">Brokerages</span>
              <h2>Per seat, billed yearly.</h2>
            </div>
          </div>
          <p className="tbl-cap">{OFFICE_INCLUDES}</p>
          <div className="incl">
            {OFFICE_PLANS.map((p) => (
              <div key={p.id} className="c rvl">
                <span className="ic">{p.seats}</span>
                <h4>{p.name}</h4>
                <p>{p.price}</p>
              </div>
            ))}
          </div>
        </section>


        <section className="block rvl" aria-label="Media packages">
          <div className="sec-head">
            <div>
              <span className="over">Packages</span>
              <h2>Essentials through Full suite.</h2>
            </div>
          </div>
          <p className="tbl-cap">Same ladder as /book. Small footprint “from” prices, CAD pre-tax — scales to XL. Essentials is the drone-included listing set vs photo-only peers. Floor plan on every standard shoot. Virtual staging is {STAGING_PRICE_LABEL} and is not included.</p>
          <div className="incl">
            <div className="c rvl">
              <span className="ic">{`from $${CORE_FROM}`}</span>
              <h4>Essentials</h4>
              <p>HDR + licensed drone + floor plan — the listing set. 24–48h target (not a guarantee).</p>
            </div>
            <div className="c rvl">
              <span className="ic">{`from $${STORY_FROM}`}</span>
              <h4>Story</h4>
              <p>Everything in Essentials plus cinematic reel. 24–48h target.</p>
            </div>
            <div className="c rvl">
              <span className="ic">{`from $${SHOWCASE_FROM}`}</span>
              <h4>Showcase</h4>
              <p>Everything in Story plus {TOUR_NAME}. Most booked. 24–48h target.</p>
            </div>
            <div className="c rvl">
              <span className="ic">{`from $${FULL_FROM}`}</span>
              <h4>Full suite</h4>
              <p>Everything in Showcase plus twilight exterior. Virtual staging is {STAGING_PRICE_LABEL}, not included. 24–48h target.</p>
            </div>
          </div>
          <p className="tbl-cap" style={{ marginTop: 18 }}>Photos only — HDR only, no drone, no floor plan — {`from $${PHOTO_ONLY_FROM}`}. <Link href="/book" style={{ color: 'var(--brickDeep)' }}>Book a shoot →</Link></p>
        </section>

        <section className="block rvl rates" aria-label="À la carte rates">
          <div className="sec-head">
            <div>
              <span className="over">Listing media</span>
              <h2>Priced by footprint.</h2>
            </div>
          </div>
          <p className="tbl-cap">Starting points — your quote is tailored per booking</p>
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
        </section>

        <p className="note price-foot">Small ≈ ≤1,200 sq ft · Mid ≈ 1,200–2,500 · Large ≈ 2,500–4,000 · XL ≈ 4,000+. Travel: GTA assign-first is often $0; otherwise from the assigned photographer’s base — first 25 km free, then $0.75/km — shown before you pay. Not free Canada-wide. CAD, exclude HST (13%).</p>

        <section className="block rvl">
          <div className="sec-head"><div><span className="over">Pricing questions</span><h2>Before you book.</h2></div></div>
          <div className="faq">
            <div className="qa"><h4>Why Essentials from ${CORE_FROM}?</h4><p>Essentials is HDR + licensed drone + floor plan — the drone-included listing set. Photo-only peers often start lower and upsell drone later; compare that stack to Essentials, not to Photos only.</p></div>
            <div className="qa"><h4>Are the stills MLS-safe?</h4><p>Real window views. We do not invent sky or dusk by default. Twilight is a real blue-hour exterior add-on; enhance options are on request — not a guaranteed blue-sky default.</p></div>
            <div className="qa"><h4>How does travel work?</h4><p>GTA assign-first is often $0. Outside that: first 25 km from the assigned photographer&apos;s base free, then $0.75/km — shown on the quote before you pay. Not free Canada-wide.</p></div>
            <div className="qa"><h4>How is footprint defined?</h4><p>Small / Mid / Large / XL map to the property&apos;s finished area and complexity. Not sure which tier? Pick &quot;advise me&quot; in booking and we&apos;ll size it from the address.</p></div>
            <div className="qa"><h4>Virtual tour vs virtual visit?</h4><p>{TOUR_NAME} ({TOUR_SHORT}) is a {TOUR_RANGE} add-on by footprint. Showcase and Full suite include it. {VISIT_NAME} ({VISIT_SHORT}) is always a paid add-on, {VISIT_PRICE_LABEL.toLowerCase()}, never packaged.</p></div>
            <div className="qa"><h4>What is virtual staging?</h4><p>Furniture and décor added to empty or dated interior photos in post — no physical staging. ${STAGING_PER_IMAGE} per photo, before tax, in checkout. Not included in Photos, Essentials, Story, Showcase, or Full suite.</p></div>
            <div className="qa"><h4>Where do you shoot?</h4><p>Canada — {COVERAGE_LINE} Ask and we&apos;ll tell you if it&apos;s covered and quote travel if needed.</p></div>
            <div className="qa"><h4>Is software live?</h4><p>Yes. Stripe tiers are live on OS. Media is live to book. Companion and GO are live on the web.</p></div>
            <div className="qa"><h4>Can I add AI without upgrading?</h4><p>{ADDONS_BLURB}</p></div>
            <div className="qa"><h4>Brokerage vs individual plans?</h4><p>Individuals pick Clay through Diamond. Brokerages buy seats yearly — Boutique, Growth, Enterprise, Franchise. Every brokerage seat is the full OS plus trust accounting, not a bundle of the individual plans.</p></div>
          </div>
        </section>

        <section className="block rvl" style={{ borderTop: 'none', paddingTop: 8 }}>
          <div className="book">
            <span className="over">Book a shoot</span>
            <h2>Ready when the listing is.</h2>
            <p className="lead">Start the booking flow — pick the services you want and a date.</p>
            <div className="cta-row">
              <Link className="btn btn-brick" href="/book">Book a shoot →</Link>
            </div>
          </div>
        </section>
      </div>

      <style>{`
        .trust{text-align:center;padding:8px 0 28px;}
        .rates{overflow-x:clip;}
        .tbl{width:100%;max-width:100%;border-collapse:collapse;}
        .tbl-cap{text-align:left;font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--inkMute);padding:0 0 16px;}
        .tbl th,.tbl td{padding:16px 22px;text-align:right;border-bottom:1px solid var(--hair);}
        .tbl th{font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:0.12em;
          text-transform:uppercase;color:var(--inkMute);font-weight:500;background:var(--paperSoft);}
        .tbl td.pkg{text-align:left;font-weight:500;color:var(--ink);font-size:15px;}
        .tbl td.pkg .inc{display:block;font-family:'JetBrains Mono',monospace;font-size:9.5px;
          letter-spacing:0.08em;text-transform:uppercase;color:var(--brickDeep);font-weight:500;margin-top:3px;}
        .tbl td.num{font-family:'JetBrains Mono',monospace;font-size:15px;color:var(--inkSoft);}
        .tbl td.num.flat-val{text-align:center;}
        .tbl tr.flat td{background:var(--paperDeep);}
        .tbl tr:last-child td{border-bottom:none;}
        .price-foot{max-width:680px;margin:28px auto 0;text-align:center;}
        @media (max-width:720px){
          .tbl thead{display:none;}
          .tbl, .tbl tbody, .tbl tr, .tbl th, .tbl td{display:block;width:100%;max-width:100%;box-sizing:border-box;text-align:left;}
          .tbl tr{border:1px solid var(--hair);border-radius:12px;overflow:hidden;background:var(--paper);margin:0 0 14px;}
          .tbl th, .tbl td{padding:12px 16px;border-bottom:1px solid var(--hair);}
          .tbl td.pkg{border-bottom:1px solid var(--hair);font-size:15px;}
          .tbl td.num{display:flex;justify-content:space-between;align-items:center;text-align:right;font-size:15px;}
          .tbl td.num::before{content:attr(data-band);font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--inkMute);}
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
