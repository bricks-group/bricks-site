import type { Metadata } from 'next'
import Link from 'next/link'
import NewsletterInline from '../NewsletterInline'
import { REEL_RANGE, TOUR_RANGE, TWILIGHT_RANGE } from '@/lib/pricing'

export const metadata: Metadata = {
  title: 'Fall Market Listing Media | Bricks',
  description: 'Book your fall listing media early. Bricks delivers HDR photography, licensed drone, floor plans, and 3D tours across the GTA in 24–48 hours — reserve your September slot before the rush.',
  alternates: { canonical: '/fall-market' },
  openGraph: {
    title: 'Fall Market Listing Media | Bricks',
    description: 'Reserve your September shoot slot before the fall listing rush. HDR, drone, floor plans, 24–48h delivery.',
    images: ['https://ctqwxwrcxwruaqojohpf.supabase.co/storage/v1/object/public/BRX%20Images/74E774C6-1524-4287-B115-25CA213E4BBD.PNG'],
  },
  twitter: {
    title: 'Fall Market Listing Media | Bricks',
    description: 'Reserve your September shoot slot before the fall listing rush. HDR, drone, floor plans, 24–48h delivery.',
    images: ['https://ctqwxwrcxwruaqojohpf.supabase.co/storage/v1/object/public/BRX%20Images/74E774C6-1524-4287-B115-25CA213E4BBD.PNG'],
  },
}

const faqs = [
  { q: 'Is "priority booking" a discount?', a: 'No — pricing is the same as always (see the pricing page). Priority booking reserves your shoot date ahead of the fall demand spike so it doesn’t get pushed by later requests.' },
  { q: 'How far out should I book?', a: 'As soon as you have a listing date in mind. September and early October fill fastest across the GTA.' },
  { q: "What's included?", a: `HDR photo, licensed drone, and a floor plan every shoot. Cinematic reel and 3D virtual tour are optional add-ons. Build your shoot à la carte on the pricing page.` },
  { q: 'Where do you shoot?', a: "The Greater Toronto Area. Outside GTA, ask — we'll tell you if it's covered." },
  { q: 'When do I get my media?', a: 'Edited and MLS-ready in 24–48 hours, fall included.' },
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

      <div className="wrap">
        <section className="hero">
          <span className="badge">Fall listing season · GTA</span>
          <h1>The fall market moves fast. Your media shouldn&apos;t be what slows a listing down.</h1>
          <p className="sub">Ontario&apos;s second listing season starts right after Labour Day, and shoot capacity across the GTA gets tight fast. Bricks runs HDR photo, licensed drone, and a floor plan on every shoot — edited and MLS-ready in 24–48 hours — so a booked slot is a delivered listing, not a bottleneck.</p>
          <div className="cta-row">
            <Link className="btn btn-brick" href="/book">Reserve a fall slot</Link>
            <Link className="btn btn-sec" href="/pricing">View pricing</Link>
          </div>
        </section>
      </div>

      <div className="wrap">
        <section className="block rvl">
          <div className="sec-head">
            <div><span className="over">Why this season is different</span><h2>Everyone lists in the same six weeks.</h2></div>
          </div>
          <div className="reasons">
            <div className="r"><span className="ic">01</span><h4>Compressed timing</h4><p>Fall listings cluster right after Labour Day through late October — most agents in the GTA are booking media in the same narrow window.</p></div>
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
            <div className="c"><span className="ic">04</span><h4>24–48h delivery</h4><p>Edited media in one hosted portal, branded and MLS-ready.</p></div>
          </div>
          <p className="note">Twilight exteriors (+{TWILIGHT_RANGE}) and cinematic reels (+{REEL_RANGE}) are popular fall add-ons for listings competing on curb appeal in shorter daylight. 3D tours run +{TOUR_RANGE}. See <Link href="/pricing" style={{ color: 'var(--brick-deep)' }}>full à la carte pricing</Link>.</p>
        </section>
      </div>

      <div className="wrap">
        <section className="block rvl" id="priority">
          <div className="book">
            <div>
              <span className="over">Priority fall booking</span>
              <h2 style={{ color: 'var(--moon)', marginTop: 8 }}>Lock your date before the rush books the calendar solid.</h2>
              <p className="lead" style={{ color: 'var(--moon-soft)' }}>This isn&apos;t a discount — it&apos;s a reserved slot. Book before Labour Day and your listing&apos;s shoot date is held ahead of the September wave, at the same pricing as always. First 25 km from Mississauga is free either way.</p>
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
              <h2>Get founder pricing on the platform.</h2>
              <p>The Booking app, Dispatch network, and Brokerage operating system are in development. Join the list for launch updates and a discounted founder rate before it opens.</p>
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
        .reasons .r .ic{font-family:'Ioskeley Mono',monospace;font-size:10px;letter-spacing:.1em;
          text-transform:uppercase;color:var(--brick-deep);display:block;margin-bottom:8px;}
        .reasons .r h4{font-weight:500;font-size:16px;color:var(--ink);margin-bottom:6px;}
        .reasons .r p{font-size:13px;color:var(--ink-3);line-height:1.5;}
        .deadline{font-family:'Ioskeley Mono',monospace;font-size:12px;color:var(--brick-soft);
          letter-spacing:.06em;text-transform:uppercase;margin-top:16px;}
        @media (max-width:680px){.reasons{grid-template-columns:1fr;}}
      `}</style>
    </>
  )
}
