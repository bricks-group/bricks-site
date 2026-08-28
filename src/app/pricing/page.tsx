import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import RevealObserver from '@/components/RevealObserver'
import { PHOTO_RATE, DRONE_RATE, REEL_RATE, TOUR_RATE, TWILIGHT_RATE, RUSH_FLAT, STAGING_PER_IMAGE, bandCells, TOUR_RANGE, VISIT_PRICE_LABEL, FOOTPRINT_BANDS } from '@/lib/pricing'
import {
  AREA_SERVED_SCHEMA,
  BROKERAGE_LOGOS,
  COVERAGE_LINE,
  TOUR_BLURB,
  TOUR_NAME,
  VISIT_BLURB,
  VISIT_NAME,
  VISIT_PACKAGING,
} from '@/lib/brand'

export const metadata: Metadata = {
  title: 'Bricks — Pricing (Canadian listing media)',
  description: 'Bricks listing-media pricing for Canadian real estate: per-shoot rates by footprint, floor plans included, virtual tour add-on, virtual visit quoted by sqft.',
  alternates: { canonical: '/pricing' },
  openGraph: {
    title: 'Bricks — Pricing (Canadian listing media)',
    description: 'Bricks listing-media pricing: per-shoot rates by footprint, floor plans included, virtual tour add-on, virtual visit quoted by sqft.',
  },
  twitter: {
    title: 'Bricks — Pricing (Canadian listing media)',
    description: 'Bricks listing-media pricing: per-shoot rates by footprint, floor plans included, virtual tour add-on, virtual visit quoted by sqft.',
  },
}

const BANDS = ['Small', 'Mid', 'Large', 'XL'] as const

const rows = [
  { name: 'HDR photography', inc: 'interiors + exteriors', vals: bandCells(PHOTO_RATE) },
  { name: 'Licensed drone', inc: 'Advanced RPAS-certified aerial', vals: bandCells(DRONE_RATE) },
  { name: 'Floor plan', inc: 'branded 2D — every standard shoot', flat: 'Included on every standard shoot' },
  { name: 'Cinematic reel', inc: '30–45s', vals: bandCells(REEL_RATE) },
  { name: TOUR_NAME, inc: 'path-confined walkthrough', vals: bandCells(TOUR_RATE) },
  { name: VISIT_NAME, inc: `free-roam Gaussian splat — ${FOOTPRINT_BANDS}`, flat: `${VISIT_PRICE_LABEL} — always an add-on, never packaged` },
  { name: 'Twilight exterior', inc: 'golden hour', vals: bandCells(TWILIGHT_RATE) },
  { name: 'Virtual staging', inc: 'per image', flat: `$${STAGING_PER_IMAGE} / image` },
  { name: 'Rush delivery', inc: 'same / next day', flat: `+$${RUSH_FLAT} flat`, row: 'flat' },
]

export default function PricingPage() {
  return (
    <>
      <RevealObserver />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Service',
            serviceType: 'Real estate listing media',
            provider: { '@type': 'LocalBusiness', name: 'Bricks', legalName: 'Bricks Group', url: 'https://www.brxs.ca/' },
            areaServed: AREA_SERVED_SCHEMA,
            hasOfferCatalog: {
              type: 'OfferCatalog',
              name: 'Bricks listing media — à la carte',
              itemListElement: [
                { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'HDR photography' }, priceSpecification: { '@type': 'PriceSpecification', minPrice: 149, maxPrice: 299, priceCurrency: 'CAD' } },
                { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Licensed aerial drone' }, priceSpecification: { '@type': 'PriceSpecification', minPrice: 99, maxPrice: 159, priceCurrency: 'CAD' } },
                { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Cinematic reel' }, priceSpecification: { '@type': 'PriceSpecification', minPrice: REEL_RATE[0], maxPrice: REEL_RATE[REEL_RATE.length - 1], priceCurrency: 'CAD' } },
                { '@type': 'Offer', itemOffered: { '@type': 'Service', name: TOUR_NAME, description: TOUR_BLURB }, priceSpecification: { '@type': 'PriceSpecification', minPrice: 149, maxPrice: 299, priceCurrency: 'CAD' } },
                { '@type': 'Offer', itemOffered: { '@type': 'Service', name: VISIT_NAME, description: `${VISIT_BLURB} ${VISIT_PACKAGING} ${VISIT_PRICE_LABEL} (${FOOTPRINT_BANDS}). No published dollar table.` } },
                { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Twilight exterior' }, priceSpecification: { '@type': 'PriceSpecification', minPrice: 150, maxPrice: 200, priceCurrency: 'CAD' } },
                { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Virtual staging' }, priceSpecification: { '@type': 'PriceSpecification', minPrice: 35, maxPrice: 35, priceCurrency: 'CAD' } },
              ],
            },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              { '@type': 'Question', name: 'How is footprint defined?', acceptedAnswer: { '@type': 'Answer', text: 'Small / Mid / Large / XL map to the property\'s finished area and complexity. Not sure which tier? Pick "advise me" in booking and we\'ll size it from the address.' } },
              { '@type': 'Question', name: `Virtual tour vs virtual visit?`, acceptedAnswer: { '@type': 'Answer', text: `${TOUR_NAME} is a path-confined walkthrough — a ${TOUR_RANGE} add-on by footprint. Showcase and Full suite include it. ${VISIT_NAME} is a free-roam Gaussian splat, always a paid add-on, ${VISIT_PRICE_LABEL.toLowerCase()} (${FOOTPRINT_BANDS}), never packaged, and not charged at checkout. The floor plan is included on every standard shoot.` } },
              { '@type': 'Question', name: 'What is virtual staging?', acceptedAnswer: { '@type': 'Answer', text: 'Furniture and décor added to empty or dated interior photos in post — no physical staging. Priced at $35 per image staged; tell us which rooms and we confirm the count before delivery.' } },
              { '@type': 'Question', name: 'Where do you shoot?', acceptedAnswer: { '@type': 'Answer', text: `Canada — ${COVERAGE_LINE} Ask and we'll tell you if it's covered and quote travel if needed.` } },
            ],
          }),
        }}
      />

      <section className="hero">
        <div className="wrap">
          <span className="badge">Pricing</span>
          <h1>Priced by footprint.</h1>
          <p className="sub">À la carte for Canadian real estate. Floor plan included on every standard shoot. Virtual visit quoted by sqft.</p>
        </div>
      </section>

      <div className="wrap">
        <section className="trust">
          <p className="trust-cap">Agents &amp; sales reps from Canada&apos;s leading brokerages &amp; REITs</p>
          <div className="logo-row" aria-label="Logos of leading Canadian brokerages and REITs where Bricks serves agents and sales reps">
            {BROKERAGE_LOGOS.map((l) => (
              <div key={l.alt} className="logo"><Image src={l.src} alt={l.alt} width={100} height={28} /></div>
            ))}
            <div className="logo logo-txt">CBRE</div>
          </div>
        </section>

        <section className="block rvl rates" aria-label="À la carte rates">
          <div className="sec-head">
            <div>
              <span className="over">À la carte</span>
              <h2>Starting points.</h2>
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

        <p className="note price-foot">Small ≈ ≤1,200 sq ft · Mid ≈ 1,200–2,500 · Large ≈ 2,500–4,000 · XL ≈ 4,000+. First 25 km from Mississauga is free; $0.75/km after, quoted before you confirm. CAD, exclude HST (13%).</p>

        <section className="block rvl">
          <div className="sec-head"><div><span className="over">Pricing questions</span><h2>Before you book.</h2></div></div>
          <div className="faq">
            <div className="qa"><h4>How is footprint defined?</h4><p>Small / Mid / Large / XL map to the property&apos;s finished area and complexity. Not sure which tier? Pick &quot;advise me&quot; in booking and we&apos;ll size it from the address.</p></div>
            <div className="qa"><h4>Virtual tour vs virtual visit?</h4><p>{TOUR_NAME} is a path-confined walkthrough — a {TOUR_RANGE} add-on by footprint. Showcase and Full suite include it. {VISIT_NAME} is a free-roam Gaussian splat, always a paid add-on, {VISIT_PRICE_LABEL.toLowerCase()} ({FOOTPRINT_BANDS}), never packaged, and not charged at checkout. The floor plan is included on every standard shoot.</p></div>
            <div className="qa"><h4>What is virtual staging?</h4><p>Furniture and décor added to empty or dated interior photos in post — no physical staging. Priced at <b>$35 / image</b>; tell us which rooms and we confirm the count before delivery.</p></div>
            <div className="qa"><h4>Where do you shoot?</h4><p>Canada — {COVERAGE_LINE} Ask and we&apos;ll tell you if it&apos;s covered and quote travel if needed.</p></div>
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
