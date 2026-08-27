import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { PHOTO_RATE, DRONE_RATE, REEL_RATE, TOUR_RATE, TWILIGHT_RATE, RUSH_FLAT, STAGING_PER_IMAGE, bandCells, TOUR_RANGE, VISIT_PRICE_LABEL } from '@/lib/pricing'
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
  description: 'Bricks listing-media pricing for Canadian real estate: per-shoot rates by footprint, floor plans included, virtual tour add-on, virtual visit quoted separately.',
  alternates: { canonical: '/pricing' },
  openGraph: {
    title: 'Bricks — Pricing (Canadian listing media)',
    description: 'Bricks listing-media pricing: per-shoot rates by footprint, floor plans included, virtual tour add-on, virtual visit quoted separately.',
  },
  twitter: {
    title: 'Bricks — Pricing (Canadian listing media)',
    description: 'Bricks listing-media pricing: per-shoot rates by footprint, floor plans included, virtual tour add-on, virtual visit quoted separately.',
  },
}

const rows = [
  { name: 'HDR photography', inc: 'interiors + exteriors', vals: bandCells(PHOTO_RATE) },
  { name: 'Licensed drone', inc: 'Advanced RPAS-certified aerial', vals: bandCells(DRONE_RATE) },
  { name: 'Floor plan', inc: 'branded 2D — every standard shoot', flat: 'Included on every standard shoot' },
  { name: 'Cinematic reel', inc: '30–45s', vals: bandCells(REEL_RATE) },
  { name: TOUR_NAME, inc: 'path-confined walkthrough', vals: bandCells(TOUR_RATE) },
  { name: VISIT_NAME, inc: 'free-roam Gaussian splat — never packaged', flat: `${VISIT_PRICE_LABEL} — always an add-on` },
  { name: 'Twilight exterior', inc: 'golden hour', vals: bandCells(TWILIGHT_RATE) },
  { name: 'Virtual staging', inc: 'per image', flat: `$${STAGING_PER_IMAGE} / image` },
  { name: 'Rush delivery', inc: 'same / next day', flat: `+$${RUSH_FLAT} flat`, row: 'flat' },
]

export default function PricingPage() {
  return (
    <>
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
                { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Cinematic reel' }, priceSpecification: { '@type': 'PriceSpecification', minPrice: 199, maxPrice: 349, priceCurrency: 'CAD' } },
                { '@type': 'Offer', itemOffered: { '@type': 'Service', name: TOUR_NAME, description: TOUR_BLURB }, priceSpecification: { '@type': 'PriceSpecification', minPrice: 149, maxPrice: 299, priceCurrency: 'CAD' } },
                { '@type': 'Offer', itemOffered: { '@type': 'Service', name: VISIT_NAME, description: `${VISIT_BLURB} ${VISIT_PACKAGING}` } },
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
              { '@type': 'Question', name: `Is the ${TOUR_NAME.toLowerCase()} included?`, acceptedAnswer: { '@type': 'Answer', text: `À la carte, no -- it's a ${TOUR_RANGE} add-on, priced by footprint. Showcase and Full suite include it. The floor plan is included on every standard shoot. ${VISIT_NAME} is never included in any package.` } },
              { '@type': 'Question', name: `Is the ${VISIT_NAME.toLowerCase()} included?`, acceptedAnswer: { '@type': 'Answer', text: `Never. ${VISIT_NAME} is always a paid add-on, quoted separately, and is not part of Showcase, Full suite, Premium, or any other package.` } },
              { '@type': 'Question', name: 'What is virtual staging?', acceptedAnswer: { '@type': 'Answer', text: 'Furniture and décor added to empty or dated interior photos in post — no physical staging. Priced at $35 per image staged; tell us which rooms and we confirm the count before delivery.' } },
              { '@type': 'Question', name: 'Are these the final platform rates?', acceptedAnswer: { '@type': 'Answer', text: 'These are the pre-launch direct-booking rates. The platform\'s own rate card may differ when Booking goes live.' } },
              { '@type': 'Question', name: 'Where do you shoot?', acceptedAnswer: { '@type': 'Answer', text: `Canada — ${COVERAGE_LINE} Ask and we'll tell you if it's covered and quote travel if needed.` } },
            ],
          }),
        }}
      />

      <div className="wrap">
        <section className="hero">
          <h1>Priced by footprint.</h1>
          <p className="sub">Per-shoot rates for Canadian real estate. One standard — photography, drone, and floor plan on every standard shoot. {TOUR_NAME} is a {TOUR_RANGE} add-on (included in Showcase and Full suite). {VISIT_NAME} is always quoted separately and never packaged.</p>
        </section>
      </div>

      <div className="wrap">
        <section className="trust">
          <p className="trust-cap">Agents &amp; sales reps from Canada&apos;s leading brokerages &amp; REITs</p>
          <div className="marquee" aria-label="Logos of leading Canadian brokerages and REITs where Bricks serves agents and sales reps">
            <div className="marquee-track">
              {[...BROKERAGE_LOGOS, ...BROKERAGE_LOGOS].map((l, i) => (
                <div key={l.alt + i} className="logo"><Image src={l.src} alt={l.alt} width={100} height={32} /></div>
              ))}
              <div className="logo logo-txt">CBRE</div>
              <div className="logo logo-txt">CBRE</div>
            </div>
          </div>
        </section>
      </div>

      <div className="wrap">
        <section className="block">
          <div className="sec-head">
            <div><span className="over">À la carte</span><h2>Priced by the job, not a flat rate.</h2></div>
            <p>Every listing is different, so every quote is built to fit — footprint, what you need shot, and where. The grid below is a <b>starting-point menu</b>, not a fixed price sheet: your actual quote is tailored per booking and confirmed before you commit.</p>
          </div>

          <div className="tbl-scroll">
            <table className="tbl">
              <caption style={{ captionSide: 'top', textAlign: 'left', fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--inkMute)', paddingBottom: 10 }}>Starting points — your quote is tailored per booking</caption>
              <thead>
                <tr><th style={{ textAlign: 'left' }}>Service</th><th>Small</th><th>Mid</th><th>Large</th><th>XL</th></tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.name} className={r.row}>
                    <td className="pkg">{r.name}<span className="inc">{r.inc}</span></td>
                    {r.flat ? (
                      <td className="num" colSpan={4} style={{ textAlign: 'center' }}>{r.flat}</td>
                    ) : (
                      r.vals!.map((v, i) => <td key={i} className="num">{v}</td>)
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="quote-note">
            <h3>How your quote is built</h3>
            <p>Your price is assembled from these factors — we only charge for what your listing actually needs:</p>
            <ul>
              <li><b>Footprint</b> — finished area &amp; complexity (Small / Mid / Large / XL) sets the photography &amp; drone base.</li>
              <li><b>What you include</b> — add only the services you want (reel, {TOUR_NAME.toLowerCase()}, twilight, virtual staging, rush). {VISIT_NAME} is always extra. Nothing you don&apos;t.</li>
              <li><b>Travel</b> — see below. Shooting inside 25 km of Mississauga is free.</li>
              <li><b>Volume</b> — agents and teams booking regularly get per-shoot rates tuned to their pipeline. Ask.</li>
            </ul>
            <p className="note" style={{ marginTop: 14 }}><b>Footprint tiers:</b> Small ≈ ≤1,200 sq ft · Mid ≈ 1,200–2,500 · Large ≈ 2,500–4,000 · XL ≈ 4,000+. Not sure which you are? Pick &quot;advise me&quot; in booking and we size it from the address — no guesswork, no overcharge.</p>
          </div>

          <div className="travel">
            <h3>Travel</h3>
            <p>Base is Mississauga. <b>The first 25 km is free.</b> Beyond that, travel is <b>$0.75 / km</b>, rounded to the nearest km and quoted up front before you confirm. Example: a shoot 40 km out = 15 km billable × $0.75 = <b>$11.25</b>. {COVERAGE_LINE} Ask and we&apos;ll tell you if it&apos;s covered and quote travel before you book.</p>
          </div>

          <p className="note"><b>Taxes:</b> all prices are in CAD, exclude HST (13%), which is added at checkout. <b>Estimates, not ceilings:</b> the grid above is the à la carte menu — your final quote is the sum of what you actually book. Photos only drops drone and the floor plan.</p>
        </section>
      </div>

      <div className="wrap">
        <section className="block">
          <div className="sec-head"><div><span className="over">Pricing questions</span><h2>Before you book.</h2></div></div>
          <div className="faq">
            <div className="qa"><h4>How is footprint defined?</h4><p>Small / Mid / Large / XL map to the property&apos;s finished area and complexity. Not sure which tier? Pick &quot;advise me&quot; in booking and we&apos;ll size it from the address.</p></div>
            <div className="qa"><h4>Is the {TOUR_NAME.toLowerCase()} included?</h4><p>À la carte, no — it&apos;s a {TOUR_RANGE} add-on, priced by footprint. Showcase and Full suite include it. The floor plan is included on every standard shoot.</p></div>
            <div className="qa"><h4>Is the {VISIT_NAME.toLowerCase()} included?</h4><p>Never. {VISIT_BLURB} {VISIT_PACKAGING} Price is {VISIT_PRICE_LABEL.toLowerCase()} separately — we do not publish a rate.</p></div>
            <div className="qa"><h4>What is virtual staging?</h4><p>Furniture and décor added to your empty or dated interior photos in post — no physical staging, no movers. Priced per image staged at <b>$35 / image</b>; tell us which rooms and we&apos;ll confirm the count before delivery.</p></div>
            <div className="qa"><h4>Are these the final platform rates?</h4><p>These are the pre-launch direct-booking rates. The platform&apos;s own rate card may differ when Booking goes live.</p></div>
            <div className="qa"><h4>Where do you shoot?</h4><p>Canada — {COVERAGE_LINE} Ask and we&apos;ll tell you if it&apos;s covered and quote travel if needed.</p></div>
          </div>
        </section>
      </div>

      <div className="wrap">
        <section className="block" style={{ borderTop: 'none', paddingTop: 0 }}>
          <div className="cta">
            <div>
              <h3>Ready to book?</h3>
              <p>Start the booking flow — pick your shoot, the services you want, and a date.</p>
            </div>
            <Link href="/book">Start booking →</Link>
          </div>
        </section>
      </div>

      <style>{`
        .wrap{max-width:920px;margin:0 auto;padding:0 36px;}
        .hero{padding:56px 0 36px;}
        .hero h1{font-weight:500;font-size:40px;line-height:1.02;letter-spacing:-1.2px;color:var(--ink);}
        .hero p.sub{font-size:16px;color:var(--inkSoft);margin-top:16px;max-width:600px;}
        .tbl-scroll{width:100%;overflow-x:auto;-webkit-overflow-scrolling:touch;}
        .tbl{width:100%;min-width:520px;border-collapse:collapse;border:1px solid var(--hair);border-radius:2px;overflow:hidden;}
        .tbl th,.tbl td{padding:14px 16px;text-align:right;border-bottom:1px solid var(--hair);}
        .tbl th{font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:0.12em;
          text-transform:uppercase;color:var(--inkMute);font-weight:500;background:var(--paperDeep);}
        .tbl td.pkg{text-align:left;font-weight:500;color:var(--ink);}
        .tbl td.pkg .inc{display:block;font-family:'JetBrains Mono',monospace;font-size:9.5px;
          letter-spacing:0.08em;text-transform:uppercase;color:var(--brickDeep);font-weight:500;margin-top:3px;}
        .tbl td.num{font-family:'JetBrains Mono',monospace;font-size:15px;color:var(--inkSoft);}
        .tbl tr.flat td{background:var(--paperDeep);}
        .tbl tr:last-child td{border-bottom:none;}
        .cta{background:var(--night);color:var(--moon);border-radius:2px;padding:30px;
          display:flex;align-items:center;justify-content:space-between;gap:18px;flex-wrap:wrap;}
        .cta h3{font-weight:500;font-size:22px;letter-spacing:-0.4px;color:var(--moon);}
        .cta p{font-size:13px;color:var(--moonSoft);margin-top:6px;}
        .cta a{background:var(--brick);color:#fff;font-weight:500;font-size:14px;
          padding:12px 22px;border-radius:2px;text-decoration:none;white-space:nowrap;}
        .trust{text-align:center;padding:8px 0 4px;}
        .trust-cap{font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--inkMute);margin:0 0 18px;}
        .marquee{overflow:hidden;mask-image:linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent);-webkit-mask-image:linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent);}
        .marquee-track{display:flex;align-items:center;gap:64px;width:max-content;animation:scrollx 22s linear infinite;padding:6px 0;}
        .marquee:hover .marquee-track{animation-play-state:paused;}
        .logo{display:flex;align-items:center;justify-content:center;height:32px;flex:none;}
        .logo img{height:32px;width:auto;display:block;opacity:.78;filter:grayscale(1);transition:opacity .2s ease,filter .2s ease;}
        .logo:hover img{opacity:1;filter:grayscale(0);}
        .logo-txt{font-family:'JetBrains Mono',monospace;font-weight:600;font-size:18px;letter-spacing:.06em;color:var(--inkMute);opacity:.78;}
        @keyframes scrollx{from{transform:translateX(0);}to{transform:translateX(-50%);}}
        @media (prefers-reduced-motion:reduce){.marquee-track{animation:none;}}
        @media (max-width:680px){.wrap{padding:0 20px;} .pkgs,.adds{grid-template-columns:1fr;} .hero h1{font-size:32px;} .tbl th,.tbl td{padding:12px 12px;}}
      `}</style>
    </>
  )
}
