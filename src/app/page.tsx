import type { Metadata } from 'next'
import type { CSSProperties } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import NewsletterPopup from './NewsletterPopup'
import SmoothScroll from '@/components/SmoothScroll'
import RevealObserver from '@/components/RevealObserver'
import ProductStage from '@/components/ProductStage'
import IntegrationsBand from '@/components/IntegrationsBand'
import FlowStage from '@/components/FlowStage'
import { CORE_FROM, FULL_FROM, PHOTO_ONLY_FROM } from '@/lib/pricing'
import { ORGANIZATION_SCHEMA, WEBSITE_SCHEMA } from '@/lib/schema'

// Homepage is brand-only: drop the founder node from the Organization schema here.
const { founder: _founder, ...HOME_ORG_SCHEMA } = ORGANIZATION_SCHEMA as typeof ORGANIZATION_SCHEMA & { founder?: unknown }
void _founder

export const metadata: Metadata = {
  title: 'Bricks — the system for Canadian real estate',
  description: 'The system for Canadian real estate. Book professional media today. OS is live in preview at app.brxs.ca.',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: 'Bricks',
    url: 'https://www.brxs.ca/',
    locale: 'en_CA',
    title: 'Bricks — the system for Canadian real estate',
    description: 'The system for Canadian real estate. Book professional media today. OS is live in preview at app.brxs.ca.',
    images: ['https://rbywjnnctjglhcdemnnj.supabase.co/storage/v1/object/public/Bricks%20Images/74E774C6-1524-4287-B115-25CA213E4BBD.PNG'],
  },
  twitter: {
    title: 'Bricks — the system for Canadian real estate',
    description: 'The system for Canadian real estate. Book professional media today.',
    images: ['https://rbywjnnctjglhcdemnnj.supabase.co/storage/v1/object/public/Bricks%20Images/74E774C6-1524-4287-B115-25CA213E4BBD.PNG'],
  },
}

export default function Home() {
  return (
    <>
      <RevealObserver />
      <SmoothScroll />
      <div className="home-v3">
      <section className="hero hero-home">
        <div className="wrap">
          <h1>The system for Canadian real estate.</h1>
          <p className="sub">Run the deal and book the media — one system for agents, teams, and brokerages.</p>
          <div className="cta-row">
            <Link className="btn btn-night" href="/book">Book a shoot</Link>
            <Link className="btn btn-tint" href="/contact">Talk to us</Link>
          </div>
        </div>
      </section>

      <section className="prod-hero" aria-label="bricks desk">
        <div className="tray tray-os">
          <div className="tray-stage">
            <ProductStage />
          </div>
        </div>
      </section>

      <section className="trust-wall rvl" aria-label="Who bricks is for">
        <div className="wrap">
          <div className="trust-tiles stagger">
            <Link href="/brokerage" className="trust-tile lift" style={{ '--i': 0 } as CSSProperties}><span className="trust-tile-k">Brokerage</span></Link>
            <Link href="/agents#team" className="trust-tile lift" style={{ '--i': 1 } as CSSProperties}><span className="trust-tile-k">Team</span></Link>
            <Link href="/agents" className="trust-tile lift" style={{ '--i': 2 } as CSSProperties}><span className="trust-tile-k">Agent</span></Link>
            <Link href="/photographers" className="trust-tile lift" style={{ '--i': 3 } as CSSProperties}><span className="trust-tile-k">Vendors</span></Link>
          </div>
        </div>
      </section>

      <section className="hsec hsec-band rvl" id="platform" aria-label="The platform">
        <div className="wrap">
          <div className="section-head section-head-stack">
            <span className="over">Bricks OS</span>
            <h2>The desk runs the deal.</h2>
            <p className="lede">Deals, media, MLS, and signatures on one screen — so the office stops living in spreadsheets and group chats.</p>
          </div>
          <ul className="hcards hcards-3 stagger">
            <li className="hcard lift" style={{ '--i': 0 } as CSSProperties}><span className="over">Deals</span><h3>Listing file + transactions</h3><p>Every listing and deal on one file, with BYO MLS. Free on Clay.</p></li>
            <li className="hcard lift" style={{ '--i': 1 } as CSSProperties}><span className="over">Signatures</span><h3>Checklist e-sign</h3><p>Checklist e-sign and shareable links from the deal. Keystone and up.</p></li>
            <li className="hcard lift" style={{ '--i': 2 } as CSSProperties}><span className="over">Contacts</span><h3>CRM + sync</h3><p>CRM with two-way Follow Up Boss contact sync and kvCORE / BoldTrail sync.</p></li>
            <li className="hcard lift" style={{ '--i': 3 } as CSSProperties}><span className="over">Calendar</span><h3>Google + Apple Calendar</h3><p>Calendar sync with Google, plus iCloud and a private ICS feed.</p></li>
            <li className="hcard lift" style={{ '--i': 4 } as CSSProperties}><span className="over">Brokerage</span><h3>Roster, pipeline, trust account</h3><p>Brokerage seats get the full OS plus trust accounting. Brokerage-only.</p></li>
            <li className="hcard lift" style={{ '--i': 5 } as CSSProperties}><span className="over">Field</span><h3>Companion + GO</h3><p>Agents book in Companion, photographers get jobs in GO, media lands on the listing.</p></li>
          </ul>
          <div className="hsec-cta">
            <Link className="btn btn-tint" href="/platform">Explore the platform</Link>
            <Link className="learn-link" href="/brokerage">For brokerages →</Link>
          </div>
        </div>
      </section>

      <IntegrationsBand />

      <section className="cap-band flow-band rvl" id="media" aria-label="Listing media">
        <div className="cap-inner">
          <div className="cap-copy section-head-stack">
            <span className="over">Listing media</span>
            <h2>Media, booked in three steps.</h2>
            <p className="cap-lede">Companion is the agent app. Property, package, exact clock time — pay locks it, the photographer gets GO, media lands back on the listing file.</p>
            <Link className="learn-link" href="/book">Start a booking →</Link>
          </div>
          <div className="cap-stage tray tray-book flow-stage">
            <FlowStage />
          </div>
        </div>
      </section>

      <section className="work-sec rvl" aria-label="Selected work">
        <div className="wrap">
          <div className="work-row home-graded stagger">
            <figure style={{ '--i': 0 } as CSSProperties}>
              <Image src="/media/work/01.jpg" alt="Detached home exterior" fill sizes="(max-width:900px) 50vw, 25vw" />
              <figcaption>Detached · exterior</figcaption>
            </figure>
            <figure style={{ '--i': 1 } as CSSProperties}>
              <Image src="/media/work/03.jpg" alt="Interior living space" fill sizes="(max-width:900px) 50vw, 25vw" />
              <figcaption>Interior · living</figcaption>
            </figure>
            <figure style={{ '--i': 2 } as CSSProperties}>
              <Image src="/media/work/05.jpg" alt="Licensed drone aerial" fill sizes="(max-width:900px) 50vw, 25vw" />
              <figcaption>Licensed drone · aerial</figcaption>
            </figure>
            <figure style={{ '--i': 3 } as CSSProperties}>
              <Image src="/media/work/07.jpg" alt="Condo interior" fill sizes="(max-width:900px) 50vw, 25vw" />
              <figcaption>Condo · interior</figcaption>
            </figure>
          </div>
          <div className="work-foot">
            <span className="work-line">Real shoots · Canada-wide · 24–48h delivery target</span>
            <Link className="learn-link" href="/gallery">See more work →</Link>
          </div>
        </div>
      </section>

      <section className="hsec hsec-band rvl" id="data" aria-label="How we handle your data">
        <div className="wrap data-grid">
          <div className="section-head section-head-stack">
            <span className="over">For brokerages</span>
            <h2>How we handle your data.</h2>
            <p className="lede">Plain answers for brokerage compliance. Full detail in the <Link href="/privacy">Privacy policy</Link> and <Link href="/dpa">DPA</Link>.</p>
            <div className="hsec-cta">
              <Link className="btn btn-tint" href="/contact">Talk to us</Link>
              <Link className="learn-link" href="/dpa">Read the DPA →</Link>
            </div>
          </div>
          <ul className="hcards hcards-2 stagger">
            <li className="hcard lift" style={{ '--i': 0 } as CSSProperties}><span className="over">Residency</span><h3>Canadian-hosted core.</h3><p>App database, auth, and file storage on Supabase in Canada (AWS ca-central-1).</p></li>
            <li className="hcard lift" style={{ '--i': 1 } as CSSProperties}><span className="over">Law</span><h3>PIPEDA.</h3><p>We handle personal information under PIPEDA and stay accountable for it.</p></li>
            <li className="hcard lift" style={{ '--i': 2 } as CSSProperties}><span className="over">Contract</span><h3>A DPA for brokerages.</h3><p>For brokerages, teams, and enterprise clients processing third-party data.</p></li>
            <li className="hcard lift" style={{ '--i': 3 } as CSSProperties}><span className="over">Disclosure</span><h3>Named processors.</h3><p>US providers (e.g. Stripe, Vercel) are listed in the Privacy policy and DPA.</p></li>
          </ul>
        </div>
      </section>

      <section className="hsec rvl" id="pricing" aria-label="Pricing">
        <div className="wrap">
          <div className="section-head section-head-stack">
            <span className="over">Pricing</span>
            <h2>Priced in the open.</h2>
          </div>
          <div className="pkgs pkgs-2 stagger">
            <div className="pkg" style={{ '--i': 0 } as CSSProperties}>
              <div className="pkg-head"><span className="pkg-name">Software</span><span className="pkg-badge">Clay is free</span></div>
              <div className="pkg-amt">Free<small> to start</small></div>
              <ul>
                <li>Keystone, Marble, Diamond from $49 / $99 / $149 a month</li>
                <li>Brokerage seats yearly — full OS on every seat</li>
              </ul>
              <Link className="btn btn-tint" href="/platform">See plans</Link>
            </div>
            <div className="pkg" style={{ '--i': 1 } as CSSProperties}>
              <div className="pkg-head"><span className="pkg-name">Listing media</span></div>
              <div className="pkg-amt">from {'$'}{CORE_FROM}<small> / shoot</small></div>
              <ul>
                <li>Essentials: HDR + licensed drone + floor plan</li>
                <li>Photos only from {'$'}{PHOTO_ONLY_FROM} · Full suite from {'$'}{FULL_FROM} · 24–48h target</li>
              </ul>
              <Link className="btn btn-brick" href="/pricing">See pricing</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="closer closer-simple rvl" id="book" aria-label="Book a shoot">
        <div className="closer-simple-inner">
          <h2>Ready when you are.</h2>
          <div className="closer-ctas">
            <Link className="btn btn-night btn-l closer-primary" href="/book">Book a shoot →</Link>
            <Link className="btn btn-tint btn-l" href="/contact">Talk to us</Link>
          </div>
          <p className="closer-links"><Link href="/pricing#faq">FAQ</Link> · <Link href="/platform">Platform</Link> · <Link href="/brokerage">Brokerage</Link></p>
        </div>
      </section>
      </div>

      <NewsletterPopup />

      <style>{`
        .hero-home{padding:72px var(--gutter) 48px;border-bottom:none;}
        .hero-home h1{font-weight:500;font-size:46px;line-height:1.0;letter-spacing:-1.6px;color:var(--ink);max-width:760px;}
        .hero-home p.sub{font-size:17px;color:var(--inkSoft);margin-top:16px;max-width:460px;line-height:1.45;}
        .hero-home h1,.hero-home p.sub,.hero-home .cta-row{opacity:0;transform:translateY(14px);animation:heroIn .7s cubic-bezier(.16,1,.3,1) forwards;}
        .hero-home h1{animation-delay:.06s;} .hero-home p.sub{animation-delay:.14s;} .hero-home .cta-row{animation-delay:.22s;}
        @keyframes heroIn{to{opacity:1;transform:translateY(0);}}
        .hero-home .cta-row{gap:12px;}
        @media (max-width:680px){
          .hero-home{padding:40px var(--gutter) 28px;}
          .hero-home h1{font-size:clamp(30px,7.6vw,36px);letter-spacing:-1.2px;max-width:20ch;}
          .hero-home p.sub{font-size:15.5px;margin-top:12px;max-width:30ch;}
          .hero-home .cta-row{margin-top:24px;display:grid;grid-template-columns:1fr 1fr;gap:10px;}
          .hero-home .cta-row .btn{width:100%;justify-content:center;padding:14px 12px;font-size:15px;}
        }

        /* Secondary button — brand-tinted, same family as the live nav Contact/Book pair */
        .btn-tint{background:var(--brickTint);color:var(--brickDeep);box-shadow:inset 0 0 0 1px var(--brickSoft);
          padding:12px 22px;font-size:15px;justify-content:center;
          transition:background-color .18s var(--ease-out),box-shadow .18s var(--ease-out),transform .12s var(--ease-out);}
        .btn-tint:hover{background:var(--brickSoft);box-shadow:inset 0 0 0 1px var(--brick);color:var(--brickDeep);}
        .btn-tint:focus-visible{outline:2px solid var(--brick);outline-offset:2px;}
        .home-v3 .btn:active{transform:scale(.97);}
        .home-v3 .btn-night,.home-v3 .btn-brick{transition:filter .18s var(--ease-out),background-color .18s var(--ease-out),transform .12s var(--ease-out);}
        .home-v3 .btn-brick:hover{background:var(--brickDeep);}
        .closer .btn-tint{background:rgba(210,84,43,.16);color:#F4D9CC;box-shadow:inset 0 0 0 1px rgba(210,84,43,.55);}
        .closer .btn-tint:hover{background:rgba(210,84,43,.28);box-shadow:inset 0 0 0 1px #D2542B;color:#fff;}
        .closer .btn-night.closer-primary{background:var(--brick);color:#fff;}
        .closer .btn-night.closer-primary:hover{filter:none;background:var(--brickDeep);}

        /* Section rhythm — one scale, alternating bands, hairline breaks (live grammar) */
        .hsec{padding:80px 0;}
        .hsec-band{background:var(--paperSoft);border-top:1px solid var(--hair);border-bottom:1px solid var(--hair);}
        .hsec .section-head-stack{margin-bottom:40px;}
        .hsec-cta{display:flex;align-items:center;gap:20px;flex-wrap:wrap;margin-top:32px;}
        .home-v3 .integ-band{padding:80px 0 64px;border-top:none;}
        .home-v3 .flow-band{padding:80px 0 24px;border-top:1px solid var(--hair);}
        .home-v3 .flow-band .cap-copy{margin-bottom:40px;}
        .home-v3 .work-sec{padding:32px 0 80px;}
        .home-v3 .trust-wall{padding:40px 0 64px;}
        .work-foot{display:flex;justify-content:space-between;align-items:center;gap:16px;margin-top:18px;flex-wrap:wrap;}
        .work-line{font-family:'JetBrains Mono',monospace;font-size:10.5px;letter-spacing:.12em;text-transform:uppercase;color:var(--inkMute);}
        .home-graded img{filter:saturate(.94) contrast(1.04) brightness(1.01) sepia(.05);transition:transform .6s var(--ease-out);}
        @media (hover:hover){.work-row figure:hover img{transform:scale(1.03);}}
        @media (max-width:680px){.work-sec .work-row.home-graded{grid-template-columns:1fr 1fr;gap:8px;}}

        /* Cards — live paper card: hairline, 2px radius, generous padding */
        .hcards{list-style:none;margin:0;padding:0;display:grid;gap:16px;}
        .hcards-3{grid-template-columns:repeat(3,minmax(0,1fr));}
        .hcards-2{grid-template-columns:repeat(2,minmax(0,1fr));}
        .hcard{background:var(--paper);border:1px solid var(--hair);border-radius:2px;padding:26px 24px 28px;}
        .hcard h3{font-size:19px;letter-spacing:-.4px;line-height:1.2;color:var(--ink);margin:14px 0 8px;}
        .hcard p{margin:0;font-size:14px;line-height:1.5;color:var(--inkSoft);}
        .lift{transition:transform .2s var(--ease-out),border-color .2s var(--ease-out),box-shadow .2s var(--ease-out);}
        @media (hover:hover) and (pointer:fine){
          .lift:hover{transform:translateY(-2px);border-color:var(--hairStrong);box-shadow:0 10px 24px -14px rgba(20,17,14,.22);}
        }
        .data-grid{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:56px;align-items:start;}
        .data-grid .section-head-stack{margin-bottom:0;}
        .data-grid .lede a{color:var(--brickDeep);text-decoration:none;}
        .data-grid .lede a:hover{text-decoration:underline;text-underline-offset:3px;}
        .pkgs-2{grid-template-columns:repeat(2,minmax(0,1fr));}
        .pkgs-2 .btn{margin-top:8px;}

        /* Staggered entrance inside revealed sections (transform + opacity only) */
        html.reveal-ready .stagger > *{opacity:0;transform:translateY(12px);
          transition:opacity .5s var(--ease-out),transform .5s var(--ease-out),border-color .2s var(--ease-out),box-shadow .2s var(--ease-out);
          transition-delay:calc(var(--i,0) * 60ms + 80ms);}
        html.reveal-ready .rvl.in .stagger > *{opacity:1;transform:none;}
        html.reveal-ready .rvl.in .stagger > .lift:hover{transition-delay:0ms;}
        @media (hover:hover) and (pointer:fine){html.reveal-ready .rvl.in .stagger > .lift:hover{transform:translateY(-2px);}}

        .closer-ctas{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;}
        .closer-links{margin-top:18px;font-size:13px;color:var(--moonMute,#a39a8e);}
        .closer-links a{color:inherit;text-decoration:none;}
        .closer-links a:hover{color:var(--moon,#f4f1eb);}

        @media (max-width:900px){
          .hcards-3{grid-template-columns:1fr 1fr;}
          .data-grid{grid-template-columns:1fr;gap:32px;}
        }
        @media (max-width:680px){
          .hsec{padding:56px 0;}
          .hsec .section-head-stack{margin-bottom:28px;}
          .home-v3 .integ-band{padding:56px 0 48px;}
          .home-v3 .flow-band{padding:56px 0 16px;}
          .home-v3 .work-sec{padding:24px 0 56px;}
          .home-v3 .trust-wall{padding:32px 0 48px;}
          .hcards{gap:10px;}
          .hcard{padding:18px 16px 20px;}
          .hcard h3{font-size:16px;margin:10px 0 6px;}
          .hcard p{font-size:13px;}
          .pkgs-2{grid-template-columns:1fr;}
          .hsec-cta{margin-top:24px;}
        }
        @media (max-width:680px){.closer-ctas{display:grid;grid-template-columns:1fr 1fr;gap:10px;max-width:360px;margin:0 auto;}.closer-ctas .btn{width:100%;justify-content:center;padding:14px 10px;}.hcards-2 .hcard p{font-size:12.5px;}}

        /* One weight scale (product mockups inside .tray excluded):
           500 = display, headings, card titles, eyebrows, buttons, links, prices
           400 = body, ledes, captions, list items */
        .home-v3 :is(h1,h2,h3,h4,b,strong,.over,.btn,.learn-link,.pkg-name,.pkg-amt,.pkg-badge,.trust-tile-k,.integ-wordmark,.integ-tag,.work-line):not(.tray *){font-weight:500;}
        .home-v3 :is(p,li,.sub,.lede,.integ-what,.integ-fine,figcaption,.pkg-amt small):not(.tray *){font-weight:400;}

        @media (prefers-reduced-motion:reduce){
          .hero-home h1,.hero-home p.sub,.hero-home .cta-row{opacity:1;transform:none;animation:none;}
          html.reveal-ready .stagger > *{opacity:1;transform:none;transition:none;}
          .lift,.lift:hover,.home-graded img,.work-row figure:hover img,.home-v3 .btn:active{transform:none !important;transition:none;}
        }
      `}</style>

    </>
  )
}


