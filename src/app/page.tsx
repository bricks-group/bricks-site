import type { Metadata } from 'next'
import Link from 'next/link'
import NewsletterPopup from './NewsletterPopup'
import RevealObserver from '@/components/RevealObserver'
import ProductStage from '@/components/ProductStage'
import ProductWindow from '@/components/ProductWindow'
import { PHOTO_RATE, DRONE_RATE } from '@/lib/pricing'
import {
  AREA_SERVED_SCHEMA,
  KNOWS_ABOUT,
} from '@/lib/brand'

const CORE_FROM = PHOTO_RATE[0] + DRONE_RATE[0] // HDR + drone starting point (~$248)

export const metadata: Metadata = {
  title: 'bricks — the desk for Canadian real estate',
  description: "The operating system for Canadian real estate, from listing photo to closing the deal. Book professional media today — CRM, transactions, and MLS are next.",
  alternates: { canonical: '/' },
  openGraph: {
    title: 'bricks — the desk for Canadian real estate',
    description: "The operating system for Canadian real estate, from listing photo to closing the deal. Book professional media today — CRM, transactions, and MLS are next.",
    images: ['https://ctqwxwrcxwruaqojohpf.supabase.co/storage/v1/object/public/BRX%20Images/74E774C6-1524-4287-B115-25CA213E4BBD.PNG'],
  },
  twitter: {
    title: 'bricks — the desk for Canadian real estate',
    description: 'The operating system for Canadian real estate. Book media today — CRM, transactions, and MLS are next.',
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
            description: 'bricks is the operating system for Canadian real estate — property, listing, booking, GO, media, MLS, transaction. Listing media and the website booking form are live. OS, Booking, and GO are in development and are not in the App Store or Google Play.',
            url: 'https://www.brxs.ca/',
            telephone: '+1-343-453-4578',
            email: 'booking@brxs.ca',
            priceRange: `$$ (à la carte from $${PHOTO_RATE[0]}; HDR + drone + floor plan from ~$${CORE_FROM})`,
            areaServed: AREA_SERVED_SCHEMA,
            knowsAbout: KNOWS_ABOUT,
            founder: { '@type': 'Person', name: 'Raphael Merchant', url: 'https://www.brxs.ca/about' },
            sameAs: ['https://share.google/7ttYfc6W7JRwlqA9U'],
          }),
        }}
      />

      <section className="hero hero-home">
        <div className="wrap">
          <h1>The desk for the deal.</h1>
          <p className="sub">The operating system for Canadian real estate — from listing photo to closing the deal. Book professional media today. CRM, transactions, and MLS are next.</p>
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
          <p className="aud-lede">Three surfaces. OS is the desk for office, team, and agent — what you see depends on the account. Booking is how an agent orders media. GO is the photographer field app.</p>
          <div className="aud-grid">
            <Link href="/office" className="aud-card">
              <span className="over">OS</span>
              <h3>Office</h3>
              <p>Roster, pipeline, listing file. The office desk for the whole shop.</p>
            </Link>
            <Link href="/agents#team" className="aud-card">
              <span className="over">OS</span>
              <h3>Team</h3>
              <p>Same OS, team-sized. Shared pipeline for the people you run.</p>
            </Link>
            <Link href="/agents" className="aud-card">
              <span className="over">OS · Booking</span>
              <h3>Agent</h3>
              <p>Your desk in OS, plus the booking companion to order media from the phone.</p>
            </Link>
            <Link href="/photographers" className="aud-card">
              <span className="over">GO</span>
              <h3>Photographer</h3>
              <p>The field app. Jobs, uploads, pay — on site. Independent contractors, fixed rate card.</p>
            </Link>
          </div>
        </section>
      </div>

      <section className="prod-row rvl" aria-label="Office desk">
        <div className="prod-copy">
          <span className="over">Control surface</span>
          <h2>The office desk.</h2>
          <p>Roster, pipeline, and the listing file in one OS. Sign in as office, team, or agent — the rooms you see follow the account. In development — preview.</p>
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
          <p>CRM, transactions, MLS, forms, and accounting live in the same OS — not a second product. In development — preview.</p>
        </div>
      </section>

      <section className="prod-row rvl" aria-label="Booking">
        <div className="prod-copy">
          <span className="over">Booking</span>
          <h2>The agent&apos;s booker.</h2>
          <p>The Booking app is in development and is not in the App Store or Google Play. You can book a shoot now on the site.</p>
          <p className="prod-mini"><Link href="/book">Book a shoot</Link> · <Link href="/platform">Platform</Link></p>
        </div>
        <div className="tray tray-book tray-phone">
          <div className="tray-stage">
            <ProductWindow
              variant="phone"
              title="Booking"
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
          <p>GO is the photographer field app — jobs, uploads, pay, on site. In development and not in the App Store or Google Play.</p>
        </div>
      </section>

      <div className="wrap">
        <section className="plat-hint rvl">
          <p>The full platform — bricks OS, Booking, GO, and Clay / Keystone / Marble / Diamond — is in development. <Link href="/platform">Details on the platform page</Link>.</p>
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
