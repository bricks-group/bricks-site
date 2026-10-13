import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import NewsletterPopup from './NewsletterPopup'
import SmoothScroll from '@/components/SmoothScroll'
import RevealObserver from '@/components/RevealObserver'
import ProductStage from '@/components/ProductStage'
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
          <p className="sub">Replace the patchwork.</p>
          <div className="cta-row">
            <Link className="btn btn-night" href="/book">Book a shoot</Link>
            <Link className="btn btn-sec" href="/contact">Talk to us</Link>
          </div>
          <span className="cta-for">Brokerage or team? Talk to us about seats and onboarding.</span>
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
          <div className="trust-tiles">
            <Link href="/brokerage" className="trust-tile">
              <span className="trust-tile-k">Brokerage</span>
            </Link>
            <Link href="/agents#team" className="trust-tile">
              <span className="trust-tile-k">Team</span>
            </Link>
            <Link href="/agents" className="trust-tile">
              <span className="trust-tile-k">Agent</span>
            </Link>
            <Link href="/photographers" className="trust-tile">
              <span className="trust-tile-k">Vendors</span>
            </Link>
          </div>
          <div className="trust-stats">
            <div><b>14,000+</b><span>properties shot before Bricks</span></div>
            <div><b>Canada</b><span>coverage</span></div>
            <div><b>24–48h</b><span>target</span></div>
            <div><b>Auto-assign</b><span>routing</span></div>
          </div>
        </div>
      </section>

      <section className="cap-band flow-band rvl" aria-label="Companion booking">
        <div className="cap-inner">
          <div className="cap-copy">
            <h2>Book a shoot in three steps.</h2>
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
          <div className="section-head section-head-stack">
            <span className="over">Work</span>
            <h2>Real shoots.</h2>
          </div>
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
          <div className="home-teasers">
            <Link className="lean-strip" href="/pricing">
              <div>
                <span className="pkg-name">Essentials from {'$'}{CORE_FROM}</span>
                <span className="lean-sub">HDR + licensed drone + floor plan · Photos only from {'$'}{PHOTO_ONLY_FROM} · up to Full suite from {'$'}{FULL_FROM} · 24–48h target</span>
              </div>
              <div className="lean-amt">Pricing →</div>
            </Link>
            <Link className="lean-strip" href="/gallery">
              <div>
                <span className="pkg-name">More work</span>
                <span className="lean-sub">Residential, multifamily, commercial, and a free-roam Virtual Visit</span>
              </div>
              <div className="lean-amt">Gallery →</div>
            </Link>
          </div>
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
            <li><b>Canadian-hosted core.</b><p>Primary app database, authentication, and file storage run on Supabase in Canada (AWS ca-central-1).</p></li>
            <li><b>PIPEDA.</b><p>Bricks Group collects, uses, and discloses personal information under PIPEDA and remains accountable for it.</p></li>
            <li><b>A DPA for brokerages.</b><p>A Data Processing Agreement for brokerages, teams, and enterprise clients that process third-party personal data.</p></li>
            <li><b>Named processors.</b><p>Some providers are in the US — e.g. Stripe and Vercel. They are listed in the Privacy policy and DPA.</p></li>
          </ul>
        </div>
      </section>

      <section className="closer closer-simple rvl" id="book" aria-label="Book a shoot">
        <div className="closer-simple-inner">
          <h2>Ready when you are.</h2>
          <Link className="btn btn-night btn-l" href="/book">Book a shoot →</Link>
          <p className="closer-links"><Link href="/pricing#faq">FAQ</Link> · <Link href="/platform#integrations">Integrations</Link> · <Link href="/platform">Platform</Link></p>
        </div>
      </section>

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
        .hero-home h1,.hero-home p.sub,.hero-home .cta-row,.hero-home .cta-for{opacity:0;transform:translateY(14px);animation:heroIn .7s cubic-bezier(.16,.8,.3,1) forwards;}
        .hero-home h1{animation-delay:.06s;} .hero-home p.sub{animation-delay:.17s;} .hero-home .cta-row{animation-delay:.28s;} .hero-home .cta-for{animation-delay:.36s;}
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
        @media (max-width:680px){.home-teasers{grid-template-columns:1fr;}}
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
        .closer-links{margin-top:14px;font-size:13px;color:var(--inkMute);}
        .closer-links a{color:var(--brickDeep);text-decoration:none;}
      `}</style>

    </>
  )
}


