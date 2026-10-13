import type { Metadata } from 'next'
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
      <div className="home-v2">

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [ORGANIZATION_SCHEMA, WEBSITE_SCHEMA],
          }),
        }}
      />

      <section className="hero hero-home">
        <div className="wrap">
          <h1>The system for Canadian real estate.</h1>
          <p className="sub">Run the deal and book the media — one system for agents, teams, and brokerages.</p>
          <div className="cta-row">
            <Link className="btn btn-night" href="/book">Book a shoot</Link>
            <Link className="btn btn-sec" href="/contact">Talk to us</Link>
          </div>
          <span className="cta-for">Brokerage or team? Talk to us about seats and onboarding.</span>
          <p className="hero-proof"><Link href="/agents">Agents</Link> · <Link href="/agents#team">Teams</Link> · <Link href="/brokerage">Brokerages</Link> · <Link href="/photographers">Photographers</Link></p>
        </div>
      </section>

      <section className="prod-hero" aria-label="bricks desk">
        <div className="tray tray-os">
          <div className="tray-stage">
            <ProductStage />
          </div>
        </div>
      </section>

      <section className="plat-sec rvl" id="platform" aria-label="The platform">
        <div className="wrap">
          <div className="section-head section-head-stack">
            <span className="over">Bricks OS</span>
            <h2>The desk runs the deal.</h2>
            <p className="lede">Deals, media, MLS, and signatures on one screen — so the office stops living in spreadsheets and group chats.</p>
          </div>
          <ul className="plat-grid">
            <li><span className="over">Deals</span><h3>Listing file + transactions</h3><p>Every listing and deal on one file, with BYO MLS. Free on Clay.</p></li>
            <li><span className="over">Signatures</span><h3>Checklist e-sign</h3><p>Checklist e-sign and shareable links from the deal. Keystone and up.</p></li>
            <li><span className="over">Contacts</span><h3>CRM + sync</h3><p>CRM with two-way Follow Up Boss contact sync and kvCORE / BoldTrail sync.</p></li>
            <li><span className="over">Calendar</span><h3>Google + Apple Calendar</h3><p>Calendar sync with Google, plus iCloud and a private ICS feed.</p></li>
            <li><span className="over">Brokerage</span><h3>Roster, pipeline, trust account</h3><p>Brokerage seats get the full OS plus trust accounting. Brokerage-only.</p></li>
            <li><span className="over">Field</span><h3>Companion + GO</h3><p>Agents book in Companion; photographers get jobs in GO; media lands on the listing.</p></li>
          </ul>
          <div className="plat-links">
            <Link className="learn-link" href="/platform">Explore the platform →</Link>
            <Link className="learn-link" href="/brokerage">For brokerages →</Link>
          </div>
        </div>
      </section>

      <IntegrationsBand compact />

      <section className="cap-band flow-band rvl" aria-label="Companion booking">
        <div className="cap-inner">
          <div className="cap-copy">
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
          <div className="work-row home-graded">
            <figure>
              <Image src="/media/work/01.jpg" alt="Detached home exterior" fill sizes="(max-width:900px) 50vw, 25vw" />
              <figcaption>Detached · exterior</figcaption>
            </figure>
            <figure>
              <Image src="/media/work/03.jpg" alt="Interior living space" fill sizes="(max-width:900px) 50vw, 25vw" />
              <figcaption>Interior · living</figcaption>
            </figure>
            <figure>
              <Image src="/media/work/05.jpg" alt="Licensed drone aerial" fill sizes="(max-width:900px) 50vw, 25vw" />
              <figcaption>Licensed drone · aerial</figcaption>
            </figure>
            <figure>
              <Image src="/media/work/07.jpg" alt="Condo interior" fill sizes="(max-width:900px) 50vw, 25vw" />
              <figcaption>Condo · interior</figcaption>
            </figure>
          </div>
          <p className="media-proof">Before Bricks, Raphael shot <b>14,000+</b> properties at CoStar · Canada-wide · 24–48h target</p>
          <div className="work-more"><Link href="/gallery">Real shoots — see more work, before/after edits, and a free-roam Virtual Visit →</Link></div>
        </div>
      </section>

      <section className="data-sec rvl" id="data" aria-label="How we handle your data">
        <div className="wrap data-grid">
          <div>
            <span className="over">For brokerages</span>
            <h2>How we handle your data.</h2>
            <p className="sub">Plain answers for brokerage compliance. Full detail in the <Link href="/privacy">Privacy policy</Link> and <Link href="/dpa">DPA</Link>.</p>
            <div className="data-links">
              <Link className="btn btn-sec" href="/contact">Talk to us</Link>
              <Link href="/dpa">Read the DPA →</Link>
            </div>
          </div>
          <ul className="data-facts">
            <li><b>Canadian-hosted core.</b><p>App database, auth, and file storage on Supabase in Canada (AWS ca-central-1).</p></li>
            <li><b>PIPEDA.</b><p>We handle personal information under PIPEDA and stay accountable for it.</p></li>
            <li><b>A DPA for brokerages.</b><p>For brokerages, teams, and enterprise clients processing third-party data.</p></li>
            <li><b>Named processors.</b><p>US providers (e.g. Stripe, Vercel) are listed in the Privacy policy and DPA.</p></li>
          </ul>
        </div>
      </section>

      <section className="price-teaser rvl" aria-label="Pricing">
        <div className="wrap home-teasers">
          <Link className="lean-strip" href="/platform">
            <div>
              <span className="pkg-name">Software · Clay is free</span>
              <span className="lean-sub">Keystone, Marble, Diamond from $49 / $99 / $149 a month · brokerage seats yearly · media always à la carte</span>
            </div>
            <div className="lean-amt">Plans →</div>
          </Link>
          <Link className="lean-strip" href="/pricing">
            <div>
              <span className="pkg-name">Media · Essentials from {'$'}{CORE_FROM}</span>
              <span className="lean-sub">HDR + licensed drone + floor plan · Photos only from {'$'}{PHOTO_ONLY_FROM} · Full suite from {'$'}{FULL_FROM} · 24–48h target</span>
            </div>
            <div className="lean-amt">Pricing →</div>
          </Link>
        </div>
      </section>

      <section className="closer closer-simple rvl" id="book" aria-label="Book a shoot">
        <div className="closer-simple-inner">
          <h2>Ready when you are.</h2>
          <div className="closer-ctas"><Link className="btn btn-night btn-l" href="/book">Book a shoot →</Link><Link className="btn btn-sec btn-l" href="/contact">Talk to us</Link></div>
          <p className="closer-links"><Link href="/pricing#faq">FAQ</Link> · <Link href="/platform">Platform</Link> · <Link href="/brokerage">Brokerage</Link></p>
        </div>
      </section>

      </div>
      <NewsletterPopup />

      <style>{`
        .trust{text-align:center;padding:36px 0 20px;}
        .proof-cap{font-family:'General Sans',system-ui,sans-serif;font-size:28px;font-weight:500;letter-spacing:-0.7px;line-height:1.05;color:var(--ink);margin:0 auto;text-align:center;}
        .aud-sec{padding:0 0 28px;}
        .aud-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:var(--hair);border:1px solid var(--hair);border-radius:2px;}
        .aud-card{background:var(--paper);padding:20px 18px;text-decoration:none;color:inherit;display:block;}
        .aud-card:hover{background:var(--paperSoft);}
        .aud-card h3{font-weight:500;font-size:17px;letter-spacing:-0.3px;color:var(--ink);margin:8px 0 4px;}
        .aud-card p{font-size:12.5px;color:var(--inkMute);margin:0;line-height:1.35;}
        @media (max-width:800px){.aud-grid{grid-template-columns:1fr 1fr;}}
        @media (max-width:480px){.aud-grid{grid-template-columns:1fr;}}
        .prod-mini{margin-top:12px;font-size:13px;color:var(--inkMute);}
        .prod-mini a{color:var(--brickDeep);text-decoration:none;}
        .prod-mini a:hover{text-decoration:underline;text-underline-offset:2px;}
        .faq .qa p a{color:var(--brickDeep);text-decoration:none;}
        .hero-home{padding:64px 36px 40px;border-bottom:none;}
        .hero-home h1{font-weight:500;font-size:46px;line-height:1.0;letter-spacing:-1.6px;color:var(--ink);max-width:760px;}
        .hero-home p.sub{font-size:17px;color:var(--inkSoft);margin-top:16px;max-width:420px;}
        .hero-home h1,.hero-home p.sub,.hero-home .cta-row,.hero-home .cta-for,.hero-home .hero-proof{opacity:0;transform:translateY(14px);animation:heroIn .7s cubic-bezier(.16,.8,.3,1) forwards;}
        .hero-home h1{animation-delay:.06s;} .hero-home p.sub{animation-delay:.17s;} .hero-home .cta-row{animation-delay:.28s;} .hero-home .cta-for,.hero-home .hero-proof{animation-delay:.36s;}
        @keyframes heroIn{to{opacity:1;transform:translateY(0);}}
        .hero-home{padding:64px var(--gutter) 40px;border-bottom:none;}
        @media (max-width:680px){
          .hero-home{padding:36px var(--gutter) 24px;}
          .hero-home h1{font-size:clamp(28px,7.2vw,36px);letter-spacing:-1.2px;max-width:20ch;}
          .hero-home p.sub{font-size:15px;color:var(--inkMute);margin-top:12px;max-width:28ch;line-height:1.4;}
          .hero-home .cta-row{margin-top:22px;gap:14px;}
        }
        @media (prefers-reduced-motion:reduce){ .hero-home h1,.hero-home p.sub,.hero-home .cta-row,.hero-home .cta-for{opacity:1;transform:none;animation:none;}}
        .cta-for{display:block;font-size:12.5px;color:var(--inkMute);margin-top:12px;}
        .home-graded img{filter:saturate(.94) contrast(1.04) brightness(1.01) sepia(.05);}
        .work-sec{padding:48px 0;}
        .home-teasers{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:20px;}
        .home-teasers .lean-strip{margin-top:0;}
        @media (max-width:680px){.home-teasers{grid-template-columns:1fr;}.work-sec .work-row.home-graded{grid-template-columns:1fr 1fr;gap:8px;}}
        .data-sec{padding:56px 0;border-top:1px solid var(--hair);}
        .data-grid{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:40px;align-items:start;}
        .data-grid h2{margin:6px 0 10px;}
        .data-grid p.sub a,.data-links a{color:var(--brickDeep);text-decoration:none;}
        .data-links{display:flex;gap:18px;align-items:center;margin-top:18px;flex-wrap:wrap;}
        .data-facts{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:1fr 1fr;gap:1px;background:var(--hair);border:1px solid var(--hair);border-radius:2px;}
        .data-facts li{background:var(--paper);padding:18px;}
        .data-facts b{display:block;font-weight:500;font-size:15.5px;color:var(--ink);letter-spacing:-.2px;margin-bottom:4px;}
        .data-facts p{margin:0;font-size:13px;line-height:1.45;color:var(--inkMute);}
        @media (max-width:900px){.data-grid{grid-template-columns:1fr;gap:22px;}}
        @media (max-width:480px){.data-facts{grid-template-columns:1fr;}.data-facts li{padding:14px 16px;}}
        .plat-sec{padding:56px 0 8px;}
        .plat-sec .section-head-stack{margin-bottom:24px;}
        .plat-grid{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1px;background:var(--hair);border:1px solid var(--hair);border-radius:2px;}
        .plat-grid li{background:var(--paper);padding:18px 18px 20px;}
        .plat-grid h3{font-size:16px;letter-spacing:-.25px;color:var(--ink);margin:8px 0 4px;line-height:1.2;}
        .plat-grid p{margin:0;font-size:13px;line-height:1.45;color:var(--inkMute);}
        .plat-links{display:flex;gap:22px;margin-top:16px;flex-wrap:wrap;}
        @media (max-width:900px){.plat-grid{grid-template-columns:1fr 1fr;}}
        @media (max-width:480px){.plat-grid li{padding:14px;}.plat-grid h3{font-size:14.5px;}.plat-grid p{font-size:12.5px;}}
        .price-teaser{padding:8px 0 48px;}
        .price-teaser .home-teasers{margin-top:0;}
        .work-sec{padding:16px 0 48px;}
        .work-more a{color:var(--brickDeep);text-decoration:none;}
        .closer-ctas{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;}
        .closer-simple .btn-sec{color:#fff;border-color:rgba(255,255,255,.45);}
        .hero-home .btn-sec{border-color:var(--ink);color:var(--ink);}
        @media (max-width:680px){
          .hero-home .cta-row{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
          .hero-home .cta-row .btn{text-align:center;justify-content:center;padding:14px 12px;font-size:15px;}
        }
        /* One weight scale for the homepage (mockups inside .tray excluded):
           display/headings/titles/labels/buttons/numbers = 500 · body/support = 400 */
        .home-v2 :is(h1,h2,h3,h4,b,strong,.over,.btn,.learn-link,.pkg-name,.lean-amt,.trust-tile-k,.integ-wordmark,.integ-tag):not(.tray *){font-weight:500;}
        .home-v2 :is(p,li,.sub,.lede,.lean-sub,.cta-for,.hero-proof,.media-proof,.integ-what,.integ-fine,figcaption,.trust-stats span):not(.tray *){font-weight:400;}
        .home-v2 .data-facts b,.home-v2 .trust-stats b{font-weight:500;}
        .hero-proof{margin-top:14px;font-size:13px;color:var(--inkMute);}
        .hero-proof a{color:var(--inkSoft);text-decoration:none;}
        .hero-proof a:hover{color:var(--ink);}
        .media-proof{margin:14px 0 0;font-size:13.5px;color:var(--inkSoft);}
        .media-proof b{color:var(--ink);}
        .closer-simple{padding-top:64px;padding-bottom:64px;}
        @media (max-width:480px){.data-facts{grid-template-columns:1fr 1fr;}.data-facts li{padding:12px;}.data-facts b{font-size:14px;}.data-facts p{font-size:12px;}.data-sec{padding:40px 0;}.closer-simple{padding-top:48px;padding-bottom:48px;}}
        .closer-links{margin-top:14px;font-size:13px;color:var(--inkMute);}
        .closer-links a{color:var(--brickDeep);text-decoration:none;}
      `}</style>

    </>
  )
}


