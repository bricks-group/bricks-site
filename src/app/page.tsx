import type { Metadata } from 'next'
import Link from 'next/link'
import NewsletterPopup from './NewsletterPopup'
import RevealObserver from '@/components/RevealObserver'
import ProductStage from '@/components/ProductStage'
import ProductWindow from '@/components/ProductWindow'
import { PHOTO_RATE, DRONE_RATE, FOOTPRINT_BANDS, TOUR_RANGE, VISIT_PRICE_LABEL } from '@/lib/pricing'
import {
  AREA_SERVED_SCHEMA,
  COMPANION_URL,
  COVERAGE_LINE,
  FOUNDER_PERSON,
  GO_URL,
  KNOWS_ABOUT,
  STATUS,
  TOUR_NAME,
  VISIT_NAME,
  VISIT_PACKAGING,
} from '@/lib/brand'

const CORE_FROM = PHOTO_RATE[0] + DRONE_RATE[0] // HDR + drone starting point (~$248)

const faqs = [
  {
    id: 'what',
    q: 'What is Bricks?',
    a: `Bricks is the operating system for Canadian real estate — for brokerage, team, agent, and photographer. Media is the beachhead. Companion is how agents book media. GO is the photographer field app. ${STATUS.os}`,
  },
  {
    id: 'included',
    q: "What's included in a standard shoot?",
    a: 'HDR photography, licensed drone, and a floor plan on every standard shoot. Edited and MLS-ready in 24–48 hours. Photos only drops drone and floor plan; Showcase and Full suite add more. See Pricing for the full à la carte table.',
  },
  {
    id: 'booking',
    q: 'How does booking work?',
    a: 'On this site you pick services, then an exact date and clock time gated by live availability — not morning, afternoon, or evening windows. That clock time locks when you pay and goes to the photographer on GO.',
  },
  {
    id: 'coverage',
    q: 'Where do you cover?',
    a: `Canada-wide launch. ${COVERAGE_LINE} Travel is quoted from Mississauga — first 25 km free; $0.75/km after, quoted before you confirm.`,
  },
  {
    id: 'drone',
    q: 'Do you fly drone / RPAS?',
    a: 'Yes — licensed drone means Advanced RPAS-certified aerial. It is included on packages that include drone (Essentials and up), or à la carte. Required for legal commercial aerial work in Canadian airspace.',
  },
  {
    id: 'tour-visit',
    q: `Virtual tour vs ${VISIT_NAME.toLowerCase()}?`,
    a: `${TOUR_NAME} is a path-confined walkthrough — a ${TOUR_RANGE} add-on by footprint; Showcase and Full suite include it. ${VISIT_NAME} is a free-roam Gaussian splat, always a paid add-on, ${VISIT_PRICE_LABEL.toLowerCase()} (${FOOTPRINT_BANDS}), never packaged, and not charged at checkout. ${VISIT_PACKAGING}`,
  },
  {
    id: 'plans',
    q: 'What about software plans?',
    a: 'Clay is free through Diamond on OS. Media is always à la carte — software does not bundle shoots. See Platform for plans and Pricing for media rates.',
  },
  {
    id: 'photographers',
    q: 'How do photographers work with Bricks?',
    a: 'Photographers are independent contractors on a fixed dollar rate card, not a percent of the client fee. Apply at Photographers; jobs route in GO.',
  },
  {
    id: 'help',
    q: 'How do I get help?',
    a: 'Use the Contact form, or email help@brxs.ca. For a listing shoot, Book a shoot or booking@brxs.ca is fastest.',
  },
] as const

function FaqAnswer({ id, a }: { id: (typeof faqs)[number]['id']; a: string }) {
  switch (id) {
    case 'included':
      return <>HDR photography, licensed drone, and a floor plan on every standard shoot. Edited and MLS-ready in 24–48 hours. Photos only drops drone and floor plan; Showcase and Full suite add more. See <Link href="/pricing">Pricing</Link> for the full à la carte table.</>
    case 'booking':
      return <>On this site you pick services, then an exact date and clock time gated by live availability — not morning, afternoon, or evening windows. That clock time locks when you pay and goes to the photographer on GO. <Link href="/book">Book a shoot</Link>.</>
    case 'plans':
      return <>Clay is free through Diamond on OS. Media is always à la carte — software does not bundle shoots. See <Link href="/platform">Platform</Link> for plans and <Link href="/pricing">Pricing</Link> for media rates.</>
    case 'photographers':
      return <>Photographers are independent contractors on a fixed dollar rate card, not a percent of the client fee. Apply at <Link href="/photographers">Photographers</Link>; jobs route in GO.</>
    case 'help':
      return <>Use the <Link href="/contact">Contact</Link> form, or email <a href="mailto:help@brxs.ca">help@brxs.ca</a>. For a listing shoot, <Link href="/book">Book a shoot</Link> or <a href="mailto:booking@brxs.ca">booking@brxs.ca</a>.</>
    default:
      return <>{a}</>
  }
}

export const metadata: Metadata = {
  title: 'bricks — the operating system for Canadian real estate',
  description: 'The operating system for Canadian real estate, from listing photo to close. Book professional media today. OS is live in preview at app.brxs.ca.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'bricks — the operating system for Canadian real estate',
    description: 'The operating system for Canadian real estate, from listing photo to close. Book professional media today. OS is live in preview at app.brxs.ca.',
    images: ['https://ctqwxwrcxwruaqojohpf.supabase.co/storage/v1/object/public/BRX%20Images/74E774C6-1524-4287-B115-25CA213E4BBD.PNG'],
  },
  twitter: {
    title: 'bricks — the operating system for Canadian real estate',
    description: 'The operating system for Canadian real estate, from listing photo to close. Book professional media today.',
    images: ['https://ctqwxwrcxwruaqojohpf.supabase.co/storage/v1/object/public/BRX%20Images/74E774C6-1524-4287-B115-25CA213E4BBD.PNG'],
  },
}

export default function Home() {
  return (
    <>
      <RevealObserver />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            name: 'Bricks',
            legalName: 'Bricks Group',
            description: 'Bricks is the operating system for Canadian real estate, from listing photo to close. Media is live to book. OS is live in preview at app.brxs.ca. Companion and GO are live on the web.',
            url: 'https://www.brxs.ca/',
            telephone: '+1-343-453-4578',
            email: 'help@brxs.ca',
            priceRange: `$$ (à la carte from $${PHOTO_RATE[0]}; HDR + drone + floor plan from ~$${CORE_FROM})`,
            areaServed: AREA_SERVED_SCHEMA,
            knowsAbout: KNOWS_ABOUT,
            founder: FOUNDER_PERSON,
            sameAs: ['https://share.google/7ttYfc6W7JRwlqA9U'],
          }),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map((f) => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          }),
        }}
      />

      <section className="hero hero-home">
        <div className="wrap">
          <h1>From listing photo to close.</h1>
          <p className="sub">The operating system for Canadian real estate. Book professional media today. {STATUS.os}</p>
          <div className="cta-row">
            <Link className="btn btn-brick" href="/book">Book a shoot</Link>
            <Link className="btn btn-sec" href="/platform">See the platform</Link>
          </div>
        </div>
      </section>

      <section className="prod-hero" aria-label="bricks OS">
        <div className="tray tray-os">
          <div className="tray-stage">
            <ProductStage />
          </div>
        </div>
      </section>

      <div className="wrap">
        <section className="trust rvl">
          <p className="proof-cap">14,000+ properties shot.</p>
        </section>
      </div>

      <div className="wrap">
        <section className="aud-sec rvl" aria-label="Who bricks is for">
          <div className="sec-head">
            <div>
              <span className="over">Built for everyone on the deal</span>
              <h2>The app you get depends on what you do.</h2>
            </div>
          </div>
          <p className="aud-lede">Three surfaces. OS for brokerage, team, and agent — what you see depends on the account. Companion is how an agent orders media. GO is the photographer field app (Dispatch).</p>
          <div className="aud-grid">
            <Link href="/brokerage" className="aud-card">
              <span className="over">OS</span>
              <h3>Brokerage</h3>
              <p>Roster, pipeline, listing file — the whole shop in one OS.</p>
            </Link>
            <Link href="/agents#team" className="aud-card">
              <span className="over">OS</span>
              <h3>Team</h3>
              <p>Same OS, team-sized. Shared pipeline for the people you run.</p>
            </Link>
            <Link href="/agents" className="aud-card">
              <span className="over">OS · Companion</span>
              <h3>Agent</h3>
              <p>The listing file in OS, plus Companion to order media — Jobs and Book with an exact clock time.</p>
            </Link>
            <Link href="/photographers" className="aud-card">
              <span className="over">GO</span>
              <h3>Photographer</h3>
              <p>The field app. Jobs, uploads, pay — on site. Independent contractors, fixed rate card.</p>
            </Link>
          </div>
        </section>
      </div>

      <section className="prod-row rvl" aria-label="OS control surface">
        <div className="prod-copy">
          <span className="over">Control surface</span>
          <h2>Roster, pipeline, listing file.</h2>
          <p>Sign in as brokerage, team, or agent — the rooms you see follow the account.</p>
        </div>
        <div className="tray tray-crm tray-bleed-end">
          <div className="tray-stage">
            <ProductWindow
              title="bricks"
              src="/screens/os.html?screen=crm&lock=1"
              nw={1440}
              nh={920}
              lazy
            />
          </div>
        </div>
      </section>

      <section className="prod-row prod-row-flip rvl" aria-label="The rest unlocks">
        <div className="tray tray-tx tray-bleed-start">
          <div className="tray-stage">
            <ProductWindow
              title="bricks"
              src="/screens/os.html?screen=transactions&lock=1"
              nw={1440}
              nh={920}
              lazy
            />
          </div>
        </div>
        <div className="prod-copy">
          <span className="over">The rest unlocks</span>
          <h2>Same OS. Deeper rooms.</h2>
          <p>CRM, transactions, MLS, forms, and accounting live in the same product — not a second login.</p>
        </div>
      </section>

      <section className="prod-row rvl" aria-label="Companion">
        <div className="prod-copy">
          <span className="over">Companion</span>
          <h2>The agent app.</h2>
          <p>Jobs and Book with an exact clock time. Drop the address, pick the services, confirm. The photographer is routed — you do not cast the shoot.</p>
          <p className="prod-mini"><a href={COMPANION_URL} rel="noopener noreferrer">Open Companion</a> · <Link href="/book">Book a shoot</Link> · <Link href="/platform">Platform</Link></p>
        </div>
        <div className="tray tray-book tray-phone">
          <div className="tray-stage">
            <ProductWindow
              variant="phone"
              title="Companion"
              src="/screens/book.html?lock=1"
              nw={390}
              nh={844}
              lazy
            />
          </div>
        </div>
      </section>

      <section className="prod-row prod-row-flip rvl" aria-label="GO">
        <div className="tray tray-disp tray-phone">
          <div className="tray-stage">
            <ProductWindow
              variant="phone"
              title="GO"
              src="/screens/disp.html?lock=1"
              nw={390}
              nh={844}
              lazy
            />
          </div>
        </div>
        <div className="prod-copy">
          <span className="over">GO</span>
          <h2>The field app.</h2>
          <p>Jobs, uploads, pay — on site. Independent contractors, fixed rate card.</p>
          <p className="prod-mini"><a href={GO_URL} rel="noopener noreferrer">Open GO</a> · <Link href="/photographers">Photographers</Link> · <Link href="/platform">Platform</Link></p>
        </div>
      </section>

      <div className="wrap">
        <section className="plat-hint rvl">
          <p>See the full platform — OS, Companion, GO, and the catalog. <Link href="/platform">Platform →</Link></p>
        </section>
      </div>

      <div className="wrap">
        <section className="block rvl">
          <div className="sec-head">
            <div><span className="over">Selected work</span><h2>Real shoots, not stock.</h2></div>
            <Link href="/gallery" className="btn btn-sec" style={{ whiteSpace: 'nowrap' }}>See more work →</Link>
          </div>
          <div className="reel-wrap">
            <video className="reel-video" autoPlay muted loop playsInline preload="metadata" poster="/media/reel-poster.jpg">
              <source src="https://ctqwxwrcxwruaqojohpf.supabase.co/storage/v1/object/public/BRX%20Images/Video/bid.mp4" type="video/mp4" />
            </video>
          </div>
        </section>
      </div>

      <div className="wrap">
        <section className="block rvl">
          <div className="sec-head">
            <div><span className="over">What&apos;s included</span><h2>Every standard shoot ships the core set.</h2></div>
          </div>
          <div className="incl">
            <div className="c rvl"><span className="ic">01</span><h4>HDR photography</h4><p>Architectural interiors &amp; exteriors, bracketed and edited for MLS.</p></div>
            <div className="c rvl"><span className="ic">02</span><h4>Licensed drone</h4><p>Advanced RPAS-certified aerial of the lot, surroundings, and roofline.</p></div>
            <div className="c rvl"><span className="ic">03</span><h4>Floor plan</h4><p>Branded 2D layout with room dimensions — included on every standard shoot.</p></div>
            <div className="c rvl"><span className="ic">04</span><h4>24–48h delivery</h4><p>Edited media in one hosted portal, branded and MLS-ready.</p></div>
          </div>
        </section>
      </div>

      <div className="wrap">
        <section className="block rvl" id="faq" aria-label="Frequently asked questions">
          <div className="sec-head">
            <div><span className="over">FAQ</span><h2>Before you book.</h2></div>
          </div>
          <div className="faq">
            {faqs.map((f) => (
              <div key={f.id} className="qa">
                <h4>{f.q}</h4>
                <p><FaqAnswer id={f.id} a={f.a} /></p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="wrap">
        <section className="block rvl" id="book">
          <div className="book">
            <div>
              <span className="over">Book a shoot</span>
              <h2 style={{ color: 'var(--moon)', marginTop: 8 }}>Ready when the listing is.</h2>
              <p style={{ color: 'var(--moonSoft)', fontSize: 14, marginTop: 10, maxWidth: 480 }}>Confirm a slot. We send pricing by footprint — edited and MLS-ready in 24–48 hours.</p>
              <Link className="btn btn-brick" href="/book" style={{ marginTop: 18, display: 'inline-flex' }}>Book a shoot →</Link>
            </div>
          </div>
        </section>
      </div>

      <NewsletterPopup />

      <style>{`
        .reel-wrap{margin-top:26px;border:1px solid var(--hair);border-radius:2px;overflow:hidden;background:var(--paperDeep);}
        .reel-video{display:block;width:100%;height:auto;aspect-ratio:16/9;object-fit:cover;outline:none;}
        .trust{text-align:center;padding:110px 0 40px;}
        .aud-sec{padding:8px 0 24px;}
        .aud-lede{font-size:15px;color:var(--inkSoft);max-width:560px;margin:-12px 0 22px;line-height:1.5;}
        .aud-grid{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:var(--hair);border:1px solid var(--hair);border-radius:2px;}
        .aud-card{background:var(--paper);padding:22px 24px;text-decoration:none;color:inherit;display:block;}
        .aud-card:hover{background:var(--paperSoft);}
        .aud-card h3{font-weight:500;font-size:18px;letter-spacing:-0.4px;color:var(--ink);margin:8px 0 6px;}
        .aud-card p{font-size:13.5px;color:var(--inkMute);line-height:1.45;margin:0;}
        @media (max-width:680px){.aud-grid{grid-template-columns:1fr;}}
        .proof-cap{font-family:'General Sans',system-ui,sans-serif;font-size:30px;font-weight:500;letter-spacing:-0.7px;line-height:1.05;color:var(--ink);max-width:680px;margin:0 auto;text-align:center;}
        .prod-mini{margin-top:14px;font-size:13px;color:var(--inkMute);}
        .prod-mini a{color:var(--brickDeep);text-decoration:none;}
        .prod-mini a:hover{text-decoration:underline;text-underline-offset:2px;}
        .plat-hint{padding:8px 0 0;}
        .plat-hint p{font-size:14px;color:var(--inkMute);max-width:640px;line-height:1.5;}
        .plat-hint a{color:var(--brickDeep);text-decoration:none;}
        .plat-hint a:hover{text-decoration:underline;text-underline-offset:2px;}
        .faq .qa p a{color:var(--brickDeep);text-decoration:none;}
        .faq .qa p a:hover{text-decoration:underline;text-underline-offset:2px;}
        .hero-home{padding:92px 36px 72px;border-bottom:none;}
        .hero-home h1{font-weight:500;font-size:46px;line-height:1.0;letter-spacing:-1.6px;color:var(--ink);max-width:760px;}
        .hero-home p.sub{font-size:17px;color:var(--inkSoft);margin-top:18px;max-width:520px;}
         .hero-home h1,.hero-home p.sub,.hero-home .cta-row{opacity:0;transform:translateY(14px);animation:heroIn .7s cubic-bezier(.16,.8,.3,1) forwards;}
        .hero-home h1{animation-delay:.06s;} .hero-home p.sub{animation-delay:.17s;} .hero-home .cta-row{animation-delay:.28s;}
        @keyframes heroIn{to{opacity:1;transform:translateY(0);}}
        @media (max-width:900px){
          .hero-home{padding:56px 20px 40px;}
          .hero-home h1{font-size:34px;}
        }
        @media (prefers-reduced-motion:reduce){ .hero-home h1,.hero-home p.sub,.hero-home .cta-row{opacity:1;transform:none;animation:none;}}
        .nl-pop{position:fixed;right:20px;bottom:20px;width:330px;max-width:calc(100vw - 40px);
          background:var(--paper);border:1px solid var(--hairStrong);border-radius:2px;
          box-shadow:0 0 0 1px var(--hair);padding:22px 22px 20px;z-index:60;
          transform:translateY(140%);opacity:0;transition:transform .45s ease,opacity .45s ease;
          font-family:'General Sans',sans-serif;}
        .nl-pop.show{transform:translateY(0);opacity:1;}
        .nl-pop .x{position:absolute;top:10px;right:12px;background:none;border:none;cursor:pointer;
          font-family:'JetBrains Mono',monospace;font-size:16px;color:var(--inkMute);line-height:1;}
        .nl-pop .x:hover{color:var(--brickDeep);}
        .nl-pop h4{font-weight:500;font-size:18px;letter-spacing:-0.4px;color:var(--ink);margin:0 0 6px;}
        .nl-pop p{font-size:13px;color:var(--inkSoft);line-height:1.5;margin:0 0 14px;}
        .nl-pop form{display:flex;flex-direction:column;gap:10px;}
        .nl-pop input{font-family:'General Sans',sans-serif;font-size:14px;background:var(--paper);
          color:var(--ink);border:1px solid var(--hairStrong);border-radius:2px;padding:12px 14px;outline:none;}
        .nl-pop input:focus{border-color:var(--brick);}
        .nl-pop .consent{font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--inkFaint);
          line-height:1.5;margin:2px 0 0;}
        .nl-pop .btn-brick{justify-content:center;}
        .nl-pop .nlmsg{font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--brickDeep);min-height:14px;}
        .nl-pill{position:fixed;right:20px;bottom:20px;z-index:55;display:flex;align-items:center;gap:7px;
          background:var(--ink);color:var(--paper);border:none;border-radius:2px;cursor:pointer;
          font-family:'General Sans',sans-serif;font-weight:500;font-size:13px;padding:11px 16px;
          box-shadow:0 0 0 1px var(--hair);}
        .nl-pill:hover{background:var(--brick);}
        .nl-pill::before{content:'';width:7px;height:7px;border-radius:50%;background:var(--brick);}
        .nl-pill:hover::before{background:var(--paper);}
        @media (prefers-reduced-motion: reduce){.nl-pop{transition:none;}}
      `}</style>
    </>
  )
}
