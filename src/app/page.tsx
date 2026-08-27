import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import NewsletterPopup from './NewsletterPopup'
import RevealObserver from '@/components/RevealObserver'
import ProductStage from '@/components/ProductStage'
import ProductWindow from '@/components/ProductWindow'
import { REEL_RANGE, TOUR_RANGE, TWILIGHT_RANGE, PHOTO_RATE, DRONE_RATE, VISIT_PRICE_LABEL, FOOTPRINT_BANDS } from '@/lib/pricing'
import {
  AREA_SERVED_SCHEMA,
  BROKERAGE_LOGOS,
  KNOWS_ABOUT,
  TOUR_BLURB,
  TOUR_NAME,
  VISIT_NAME,
  VISIT_PACKAGING,
} from '@/lib/brand'

const CORE_FROM = PHOTO_RATE[0] + DRONE_RATE[0] // HDR + drone starting point (~$248)

export const metadata: Metadata = {
  title: 'Canadian Real Estate Photography & Media | Bricks',
  description: "Listing media for Canadian real estate — HDR photography, licensed drone, floor plans, with optional virtual tour and virtual visit. Book a shoot in 24–48h.",
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Canadian Real Estate Photography & Media | Bricks',
    description: "Listing media for Canadian real estate — HDR photography, licensed drone, floor plans, with optional virtual tour and virtual visit. Book a shoot in 24–48h.",
    images: ['https://ctqwxwrcxwruaqojohpf.supabase.co/storage/v1/object/public/BRX%20Images/74E774C6-1524-4287-B115-25CA213E4BBD.PNG'],
  },
  twitter: {
    title: 'Canadian Real Estate Photography & Media | Bricks',
    description: 'Listing media for Canadian real estate — HDR photography, licensed drone, floor plans, with optional virtual tour and virtual visit. Book a shoot in 24–48h.',
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
            description: 'Bricks is listing media for Canadian real estate — From Capture to Close. HDR photography, licensed drone, floor plans, twilight, optional virtual tour (path-confined) and virtual visit (free-roam Gaussian splat). Media service live now in Canada. The self-serve booking app is in development.',
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
          <span className="badge-lit"><span className="dot" />Live in Canada</span>
          <h1>From Capture to Close.</h1>
          <p className="sub">Listing media for Canadian real estate — HDR, licensed drone, and a floor plan, back in 24–48 hours. Optional virtual tour and virtual visit, booked direct.</p>
          <div className="cta-row">
            <Link className="btn btn-brick" href="/book">Book a shoot</Link>
            <Link className="btn btn-sec" href="/pricing">Pricing</Link>
          </div>
        </div>
      </section>

      <section className="prod-hero" aria-label="Brokerage OS">
        <div className="tray tray-os">
          <div className="tray-stage">
            <ProductStage />
          </div>
        </div>
      </section>

      <div className="wrap">
        <section className="trust rvl">
          <p className="proof-cap">14,000+ properties shot.</p>
          <div className="logo-row" aria-label="Logos of leading Canadian brokerages and REITs where Bricks serves agents and sales reps">
            {BROKERAGE_LOGOS.map((l) => (
              <div key={l.alt} className="logo"><Image src={l.src} alt={l.alt} width={100} height={28} /></div>
            ))}
            <div className="logo logo-txt">CBRE</div>
          </div>
        </section>
      </div>

      <section className="prod-row rvl" aria-label="Control surface">
        <div className="prod-copy">
          <span className="over">Control surface</span>
          <h2>The brokerage dashboard.</h2>
          <p>OS is the desk: roster, jobs, and media in one place — not a second product.</p>
        </div>
        <div className="tray tray-crm tray-bleed-end">
          <div className="tray-stage">
            <ProductWindow
              title="Brokerage OS"
              src="/screens/os.html?screen=crm"
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
              title="Brokerage OS"
              src="/screens/os.html?screen=transactions"
              nw={1440}
              nh={920}
              lazy
            />
          </div>
        </div>
        <div className="prod-copy">
          <span className="over">The rest unlocks</span>
          <h2>Same OS. Deeper rooms.</h2>
          <p>CRM, transactions, MLS, forms, and accounting live in the same OS — not a second product.</p>
        </div>
      </section>

      <section className="prod-row rvl" aria-label="Booking">
        <div className="prod-copy">
          <span className="over">Booking</span>
          <h2>The agent&apos;s booker.</h2>
          <p>Companion app for the listing agent — schedule a shoot without leaving the phone. Secondary to OS, in development.</p>
        </div>
        <div className="tray tray-book tray-phone">
          <div className="tray-stage">
            <ProductWindow
              variant="phone"
              title="Booking"
              src="/screens/book.html"
              nw={390}
              nh={844}
              lazy
            />
          </div>
        </div>
      </section>

      <section className="prod-row prod-row-flip rvl" aria-label="Dispatch">
        <div className="tray tray-disp tray-phone">
          <div className="tray-stage">
            <ProductWindow
              variant="phone"
              title="Dispatch"
              src="/screens/disp.html"
              nw={390}
              nh={844}
              lazy
            />
          </div>
        </div>
        <div className="prod-copy">
          <span className="over">Dispatch</span>
          <h2>The field app.</h2>
          <p>Companion for the photographer on site — jobs, uploads, pay. Last of the apps, in development.</p>
        </div>
      </section>

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
          <p className="quiet-adds">
            Add-ons: cinematic reel {REEL_RANGE}; {TOUR_NAME.toLowerCase()} {TOUR_RANGE} — {TOUR_BLURB} Included in Showcase and Full suite. {VISIT_NAME} is {VISIT_PRICE_LABEL.toLowerCase()} ({FOOTPRINT_BANDS}). {VISIT_PACKAGING} Twilight exterior {TWILIGHT_RANGE}.
          </p>
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
        .proof-cap{font-family:'General Sans',system-ui,sans-serif;font-size:30px;font-weight:500;letter-spacing:-0.7px;line-height:1.05;color:var(--ink);max-width:680px;margin:0 auto 22px;text-align:center;}
        .hero-home{padding:92px 36px 72px;border-bottom:none;}
        .hero-home .badge-lit{display:inline-flex;align-items:center;gap:7px;font-family:'JetBrains Mono',monospace;font-size:10.5px;letter-spacing:.12em;text-transform:uppercase;color:var(--brickDeep);background:var(--brickTint);border-radius:2px;padding:6px 10px;width:fit-content;margin-bottom:20px;}
        .hero-home .badge-lit .dot{width:6px;height:6px;border-radius:50%;background:var(--brick);animation:pulse 2s ease-in-out infinite;}
        @keyframes pulse{0%,100%{opacity:1;box-shadow:0 0 0 0 rgba(210,84,43,.5)}50%{opacity:.6;box-shadow:0 0 0 5px rgba(210,84,43,0)}}
        .hero-home h1{font-weight:500;font-size:46px;line-height:1.0;letter-spacing:-1.6px;color:var(--ink);max-width:760px;}
        .hero-home p.sub{font-size:17px;color:var(--inkSoft);margin-top:18px;max-width:520px;}
        .hero-home .badge-lit,.hero-home h1,.hero-home p.sub,.hero-home .cta-row{opacity:0;transform:translateY(14px);animation:heroIn .7s cubic-bezier(.16,.8,.3,1) forwards;}
        .hero-home h1{animation-delay:.06s;} .hero-home p.sub{animation-delay:.17s;} .hero-home .cta-row{animation-delay:.28s;}
        @keyframes heroIn{to{opacity:1;transform:translateY(0);}}
        @media (max-width:900px){
          .hero-home{padding:56px 20px 40px;}
          .hero-home h1{font-size:34px;}
        }
        .logo-row{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:22px 36px;padding:4px 0 8px;}
        .logo-row .logo{display:flex;align-items:center;justify-content:center;height:28px;flex:none;}
        .logo-row .logo img{height:28px;max-height:28px;max-width:110px;width:auto;object-fit:contain;display:block;opacity:.72;filter:grayscale(1);}
        .logo-txt{font-family:'JetBrains Mono',monospace;font-weight:600;font-size:16px;letter-spacing:.06em;color:var(--inkMute);opacity:.72;}
        @media (prefers-reduced-motion:reduce){.hero-home .badge-lit,.hero-home h1,.hero-home p.sub,.hero-home .cta-row{opacity:1;transform:none;animation:none;}}
        .incl{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:var(--hair);border:1px solid var(--hair);border-radius:2px;margin-top:4px;}
        .incl .c{background:var(--paper);padding:22px 22px;}
        .incl .c h4{font-weight:500;font-size:15px;color:var(--ink);margin-bottom:6px;}
        .incl .c p{font-size:12.5px;color:var(--inkMute);line-height:1.45;}
        .incl .c .ic{font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--brickDeep);display:block;margin-bottom:8px;}
        .quiet-adds{font-size:13px;color:var(--inkMute);line-height:1.55;margin-top:18px;max-width:720px;}
        @media (max-width:680px){ .incl{grid-template-columns:1fr;} }
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
