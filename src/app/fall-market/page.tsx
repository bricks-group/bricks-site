import type { Metadata } from 'next'
import Link from 'next/link'
import NewsletterInline from '../NewsletterInline'
import { REEL_RANGE, TOUR_RANGE, TWILIGHT_RANGE, VISIT_PRICE_LABEL, FOOTPRINT_BANDS } from '@/lib/pricing'
import { COVERAGE_LINE, TOUR_NAME, VISIT_NAME, VISIT_PACKAGING } from '@/lib/brand'

export const metadata: Metadata = {
  title: 'Fall Market Listing Photos & Real Estate Photography | Bricks',
  description:
    'Book fall listing photos early. Bricks delivers HDR real estate photography, licensed drone, floor plans, plus optional virtual tour and virtual visit on a 24–48h target — reserve before the rush.',
  alternates: { canonical: '/fall-market' },
  openGraph: {
    title: 'Fall Market Listing Photos | Bricks',
    description: 'Reserve your fall listing photo shoot. HDR, drone, floor plans, 24–48h MLS target.',
    images: ['https://rbywjnnctjglhcdemnnj.supabase.co/storage/v1/object/public/Bricks%20Images/74E774C6-1524-4287-B115-25CA213E4BBD.PNG'],
    url: 'https://www.brxs.ca/fall-market',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fall Market Listing Photos | Bricks',
    description: 'Reserve fall real estate photography before the rush. HDR, drone, floor plans, 24–48h target.',
    images: ['https://rbywjnnctjglhcdemnnj.supabase.co/storage/v1/object/public/Bricks%20Images/74E774C6-1524-4287-B115-25CA213E4BBD.PNG'],
  },
}

const faqs = [
  { q: 'Is "priority booking" a discount?', a: 'No — pricing is the same as always (see the pricing page). Priority booking reserves your shoot date ahead of the fall demand spike so it doesn’t get pushed by later requests.' },
  { q: 'How far out should I book?', a: 'As soon as you have a listing date in mind. September and early October fill fastest.' },
  { q: "What's included?", a: `HDR photo, licensed drone, and a floor plan on every standard shoot. Cinematic reel and ${TOUR_NAME.toLowerCase()} are optional add-ons. ${VISIT_NAME} is always a paid add-on, ${VISIT_PRICE_LABEL.toLowerCase()} (${FOOTPRINT_BANDS}) and never packaged. Build your shoot à la carte on the pricing page.` },
  { q: 'Where do you shoot?', a: `Canada — ${COVERAGE_LINE} Ask and we'll tell you if it's covered.` },
  { q: 'When do I get my media?', a: 'Edited MLS-ready media targets 24–48 hours, fall included — targets, not guarantees.' },
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
          <p className="sub">Reserve a September slot before the rush. HDR, licensed drone, floor plan — 24–48h target.</p>
          <div className="cta-row">
            <Link className="btn btn-brick" href="/book">Reserve a fall slot</Link>
            <Link className="btn btn-sec" href="/pricing">View pricing</Link>
          </div>
        </div>
      </section>

      <div className="wrap">
        <section className="block rvl">
          <div className="sec-head">
            <div><span className="over">Why this season is different</span><h2>Everyone lists in the same six weeks.</h2></div>
          </div>
          <div className="reasons">
            <div className="r"><span className="ic">01</span><h4>Compressed timing</h4><p>Fall listings cluster right after Labour Day through late October — most agents are booking media in the same narrow window.</p></div>
            <div className="r"><span className="ic">02</span><h4>Weekend open houses</h4><p>Miss your shoot slot by a few days and you miss the weekend window your listing needed to launch into.</p></div>
            <div className="r"><span className="ic">03</span><h4>Finite capacity</h4><p>One shooter, one standard, booked slots — capacity doesn&apos;t expand just because demand spikes. Earlier bookings hold their date.</p></div>
          </div>
        </section>
      </div>

      <div className="wrap">
        <section className="block rvl">
          <div className="sec-head">
            <div><span className="over">Every shoot, every season</span><h2>Same standard, no rush pricing to book early.</h2></div>
          </div>
          <div className="incl">
            <div className="c"><span className="ic">01</span><h4>HDR photography</h4><p>Architectural interiors &amp; exteriors, bracketed and edited for MLS.</p></div>
            <div className="c"><span className="ic">02</span><h4>Licensed drone</h4><p>Advanced RPAS-certified aerial of the lot, surroundings, and roofline.</p></div>
            <div className="c"><span className="ic">03</span><h4>Floor plan</h4><p>Branded 2D layout with room dimensions — included on every shoot.</p></div>
            <div className="c"><span className="ic">04</span><h4>24–48h target</h4><p>Edited media in one hosted portal, branded and MLS-ready.</p></div>
          </div>
          <p className="note">Twilight exteriors (+{TWILIGHT_RANGE}) and cinematic reels (+{REEL_RANGE}) are popular fall add-ons for listings competing on curb appeal in shorter daylight. {TOUR_NAME} runs +{TOUR_RANGE}. {VISIT_NAME} is {VISIT_PRICE_LABEL.toLowerCase()} ({FOOTPRINT_BANDS}) — {VISIT_PACKAGING} See <Link href="/pricing" style={{ color: 'var(--brickDeep)' }}>full à la carte pricing</Link>.</p>
        </section>
      </div>

      <div className="wrap">
        <section className="block rvl" id="priority">
          <div className="book">
            <div>
              <span className="over">Priority fall booking</span>
              <h2 style={{ color: 'var(--moon)', marginTop: 8 }}>Lock your date before the rush books the calendar solid.</h2>
              <p className="lead" style={{ color: 'var(--moonSoft)' }}>This isn&apos;t a discount — it&apos;s a reserved slot. Book before Labour Day and your listing&apos;s shoot date is held ahead of the September wave, at the same pricing as always. First 25 km from the assigned photographer’s base is free either way.</p>
              <p className="deadline">Priority window closes Monday, September 7</p>
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
            <div>
              <span className="over">While you&apos;re booking media</span>
              <h2>Stay on the list.</h2>
              <p>Product notes for OS, Companion, and GO — no spam. Media is live to book now.</p>
            </div>
          </div>
          <NewsletterInline />
        </section>
      </div>

      <div className="wrap">
        <section className="block rvl">
          <div className="sec-head">
            <div><span className="over">Questions</span><h2>Before you book.</h2></div>
          </div>
          <div className="faq">
            {faqs.map((f) => (
              <div key={f.q} className="qa"><h4>{f.q}</h4><p>{f.a}</p></div>
            ))}
          </div>
        </section>
      </div>

      <style>{`
        .reasons{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--hair);
          border:1px solid var(--hair);border-radius:2px;}
        .reasons .r{background:var(--paper);padding:24px;}
        .reasons .r .ic{font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.1em;
          text-transform:uppercase;color:var(--brickDeep);display:block;margin-bottom:8px;}
        .reasons .r h4{font-weight:500;font-size:16px;color:var(--ink);margin-bottom:6px;}
        .reasons .r p{font-size:13px;color:var(--inkMute);line-height:1.5;}
        .deadline{font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--brickSoft);
          letter-spacing:.06em;text-transform:uppercase;margin-top:16px;}
        @media (max-width:680px){.reasons{grid-template-columns:1fr;}}
      `}</style>
    </>
  )
}
