import type { Metadata } from 'next'
import Link from 'next/link'
import NewsletterInline from '../NewsletterInline'
import { REEL_RANGE, TOUR_RANGE, TWILIGHT_RANGE, VISIT_PRICE_LABEL, FOOTPRINT_BANDS } from '@/lib/pricing'
import { COVERAGE_LINE, TOUR_NAME, VISIT_NAME, VISIT_PACKAGING } from '@/lib/brand'
import { OG_IMAGE } from '@/lib/og'

export const metadata: Metadata = {
  title: "Fall Listing Photos & Real Estate Photography | Bricks",
  description: "Plan your fall listing media with Bricks. Book HDR photography, licensed drone and floor plans, with optional tours and Virtual Visit for your next listing.",
  alternates: { canonical: '/fall-market' },
  openGraph: {
    title: "Fall Listing Photos & Real Estate Photography | Bricks",
    description: "Plan your fall listing media with Bricks. Book HDR photography, licensed drone and floor plans, with optional tours and Virtual Visit for your next listing.",
    images: [OG_IMAGE],
    url: 'https://www.brxs.ca/fall-market',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Fall Listing Photos & Real Estate Photography | Bricks",
    description: "Plan your fall listing media with Bricks. Book HDR photography, licensed drone and floor plans, with optional tours and Virtual Visit for your next listing.",
    images: [OG_IMAGE],
  },
}

const faqs = [
  { q: 'Is booking early a discount?', a: 'No. Prices stay the same. Booking early holds your shoot date before the fall rush.' },
  { q: 'How far out should I book?', a: 'As soon as you have a listing date in mind. September and early October fill fastest.' },
  { q: "What's included?", a: 'HDR photos, licensed drone and a floor plan on every standard shoot. Reels, virtual tours and virtual visits are add-ons.' },
  { q: 'Where do you shoot?', a: 'Across Canada. Ask and we’ll confirm your area.' },
  { q: 'When do I get my media?', a: 'We aim to deliver edited, MLS®-ready photos in 24 hours, other media in 24–48 hours, fall included.' },
]

export default function FallMarket() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
          }),
        }}
      />

      <section className="hero">
        <div className="wrap">
          <span className="badge">Fall listing season</span>
          <h1>The fall market moves fast.</h1>
          <p className="sub">Book early and hold your shoot date.</p>
          <div className="cta-row">
            <Link className="btn btn-brick" href="/book">Reserve a fall slot</Link>
            <Link className="btn btn-sec" href="/pricing">View pricing</Link>
          </div>
        </div>
      </section>

      <div className="wrap">
        <section className="block rvl">
          <div className="sec-head">
            <div><span className="over">Why book early</span><h2>Everyone lists at once.</h2></div>
          </div>
          <div className="reasons">
            <div className="r"><span className="ic">01</span><h3>Compressed timing</h3><p>Fall listings cluster between Labour Day and late October.</p></div>
            <div className="r"><span className="ic">02</span><h3>Weekend open houses</h3><p>Miss your shoot by a few days and you can miss the weekend your listing needed.</p></div>
            <div className="r"><span className="ic">03</span><h3>Finite capacity</h3><p>Capacity doesn&apos;t grow when demand does. Earlier bookings keep their date.</p></div>
          </div>
        </section>
      </div>

      <div className="wrap">
        <section className="block rvl">
          <div className="sec-head">
            <div><span className="over">Every shoot</span><h2>Same standard, same prices.</h2></div>
          </div>
          <div className="incl">
            <div className="c"><span className="ic">01</span><h3>HDR photography</h3><p>Interiors and exteriors, edited for MLS®.</p></div>
            <div className="c"><span className="ic">02</span><h3>Licensed drone</h3><p>Aerial photos of the lot, roofline and surroundings.</p></div>
            <div className="c"><span className="ic">03</span><h3>Floor plan</h3><p>Branded 2D layout with room dimensions — included on every shoot.</p></div>
            <div className="c"><span className="ic">04</span><h3>Fast delivery</h3><p>We aim to deliver photos in 24 hours, in one branded portal.</p></div>
          </div>
          <p className="note">Twilight exteriors and cinematic reels help in shorter fall daylight. <Link href="/pricing" style={{ color: 'var(--brickDeep)' }}>See pricing →</Link></p>
        </section>
      </div>

      <div className="wrap">
        <section className="block rvl" id="priority">
          <div className="book">
            <div>
              <span className="over">Book early</span>
              <h2 style={{ color: 'var(--moon)', marginTop: 8 }}>Lock your date before the calendar fills.</h2>
              <p className="lead" style={{ color: 'var(--moonSoft)' }}>Same prices as always. Your shoot date is held once you book.</p>
              <div className="cta-row">
                <Link className="btn btn-brick" href="/book">Reserve a fall slot</Link>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="wrap">
        <section className="block rvl">
          <div className="sec-head">
            <div><span className="over">FAQ</span><h2>Before you book.</h2></div>
          </div>
          <div className="faq">
            {faqs.map((f) => (
              <div key={f.q} className="qa"><h3>{f.q}</h3><p>{f.a}</p></div>
            ))}
          </div>
        </section>
      </div>

      <style>{`
        .reasons{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--hair);
          border:1px solid var(--hair);border-radius:2px;}
        .reasons .r{background:var(--paper);padding:24px;}
        .reasons .r .ic{font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:0;
          text-transform:none;color:var(--brickDeep);display:block;margin-bottom:8px;}
        .reasons .r h3{font-weight:500;font-size:16px;color:var(--ink);margin-bottom:6px;}
        .reasons .r p{font-size:13px;color:var(--inkMute);line-height:1.5;}
        .deadline{font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--brickSoft);
          letter-spacing:0;text-transform:none;margin-top:16px;}
        @media (max-width:680px){.reasons{grid-template-columns:1fr;}}
      `}</style>
    </>
  )
}
