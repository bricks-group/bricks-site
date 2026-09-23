import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import Script from 'next/script'
import NewsletterPopup from './NewsletterPopup'
import RevealObserver from '@/components/RevealObserver'
import ProductStage from '@/components/ProductStage'
import OsDeskShot from '@/components/OsDeskShot'
import FlowStage from '@/components/FlowStage'
import VirtualVisitEmbed from '@/components/VirtualVisitEmbed'
import {
  PHOTO_RATE,
  FOOTPRINT_BANDS,
  TOUR_RANGE,
  VISIT_PRICE_LABEL,
  CORE_FROM,
  STORY_FROM,
  SHOWCASE_FROM,
  FULL_FROM,
  PHOTO_ONLY_FROM,
} from '@/lib/pricing'
import {
  AREA_SERVED_SCHEMA,
  COVERAGE_LINE,
  FOUNDER_PERSON,
  GO_URL,
  KNOWS_ABOUT,
  STATUS,
  TOUR_NAME,
  VISIT_NAME,
  VISIT_PACKAGING,
} from '@/lib/brand'

const faqs = [
  {
    id: 'what',
    q: 'What is Bricks?',
    a: `The system for Canadian real estate — one place for media, dispatch, and the deal. Companion books; GO is the field app. ${STATUS.os}`,
  },
  {
    id: 'included',
    q: "What's included in a standard shoot?",
    a: 'HDR, licensed drone, and a floor plan on every standard shoot. MLS-ready on a 24–48h target (not a guarantee — see Terms).',
  },
  {
    id: 'booking',
    q: 'How does booking work?',
    a: 'Pick services, then an exact clock time. That time locks when you pay.',
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
      return <>HDR, licensed drone, floor plan. 24–48h. See <Link href="/pricing">Pricing</Link>.</>
    case 'booking':
      return <>Exact clock time — not a window. <Link href="/book">Book</Link>.</>
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


const beforeAfter = [
  { before: '/media/proof/Sky Before.png', after: '/media/proof/Sky After.png', label: 'Sky replacement before and after' },
  { before: '/media/proof/HDR Before.png', after: '/media/proof/HDR After.png', label: 'HDR blending before and after' },
  { before: '/media/proof/Twilight before.png', after: '/media/proof/twilight After.png', label: 'Twilight before and after' },
  { before: '/media/proof/Staging Before.png', after: '/media/proof/Staging After.png', label: 'Virtual staging before and after' },
] as const
export const metadata: Metadata = {
  title: 'bricks — the system for Canadian real estate',
  description: 'The system for Canadian real estate. Book professional media today. OS is live in preview at app.brxs.ca.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'bricks — the system for Canadian real estate',
    description: 'The system for Canadian real estate. Book professional media today. OS is live in preview at app.brxs.ca.',
    images: ['https://rbywjnnctjglhcdemnnj.supabase.co/storage/v1/object/public/Bricks%20Images/74E774C6-1524-4287-B115-25CA213E4BBD.PNG'],
  },
  twitter: {
    title: 'bricks — the system for Canadian real estate',
    description: 'The system for Canadian real estate. Book professional media today.',
    images: ['https://rbywjnnctjglhcdemnnj.supabase.co/storage/v1/object/public/Bricks%20Images/74E774C6-1524-4287-B115-25CA213E4BBD.PNG'],
  },
}

export default function Home() {
  return (
    <>
      <RevealObserver />
      <Script src="/assets/ba.js" strategy="afterInteractive" />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            name: 'Bricks',
            legalName: 'Bricks Group',
            description: 'Bricks is the system for Canadian real estate — simplifying the broken business. Media is live to book. The desk is live in preview at app.brxs.ca. Companion and GO are live on the web.',
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
          <h1>The system for Canadian real estate.</h1>
          <p className="sub">Replace the patchwork.</p>
          <div className="cta-row">
            <Link className="btn btn-night" href="/book">Book a shoot</Link>
            <Link className="learn-link" href="/demo">Request a walkthrough →</Link>
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
            <div><b>14,000+</b><span>shot</span></div>
            <div><b>Canada</b><span>coverage</span></div>
            <div><b>24–48h</b><span>target</span></div>
            <div><b>Auto-assign</b><span>routing</span></div>
          </div>
        </div>
      </section>

      <section className="cap-band rvl" aria-label="The desk">
        <div className="cap-inner">
          <div className="cap-copy">
            <h2>The desk runs the deal.</h2>
            <p className="cap-lede">Deals, media, MLS, and signatures on one screen — so the office stops living in spreadsheets and group chats.</p>
            <Link className="learn-link" href="/platform">Explore the desk →</Link>
          </div>
          <div className="cap-stage tray tray-crm">
            <div className="tray-stage tray-stage-fill">
              <OsDeskShot />
            </div>
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
          <div className="work-row">
            <figure>
              <Image src="/media/work/01.jpg" alt="Detached home exterior" fill sizes="(max-width:900px) 50vw, 25vw" />
              <figcaption>Detached · exterior</figcaption>
            </figure>
            <figure>
              <Image src="/media/work/03.jpg" alt="Interior living space" fill sizes="(max-width:900px) 50vw, 25vw" />
              <figcaption>Interior · living</figcaption>
            </figure>
            <figure>
              <Image src="/media/work/05.jpg" alt="Condo interior" fill sizes="(max-width:900px) 50vw, 25vw" />
              <figcaption>Condo · interior</figcaption>
            </figure>
            <figure>
              <Image src="/media/work/07.jpg" alt="Licensed drone aerial" fill sizes="(max-width:900px) 50vw, 25vw" />
              <figcaption>Licensed drone · aerial</figcaption>
            </figure>
          </div>
          <div className="work-more">
            <Link href="/gallery">See more work →</Link>
          </div>
          <div className="film">
            <span className="tag">Film</span>
            <video className="film-video" autoPlay muted loop playsInline preload="metadata" poster="/media/reel-poster.jpg">
              <source src="https://rbywjnnctjglhcdemnnj.supabase.co/storage/v1/object/public/Bricks%20Images/Video/bid.mp4" type="video/mp4" />
            </video>
            <div className="film-in">
              <div>
                <div className="vt">One system for the whole business.</div>
                <div className="vs">Desk, field, and media — finally one place.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="edit-sec rvl" aria-label="The edit">
        <div className="wrap">
          <div className="section-head section-head-stack">
            <span className="over">Edit</span>
            <h2>After the shoot.</h2>
          </div>
          <div className="edit-grid">
            <div>
              <div className="ba" data-ba role="slider" aria-valuemin={0} aria-valuemax={100} aria-valuenow={50} tabIndex={0}>
                <Image className="ba-after" src={beforeAfter[0].after} alt="Sky — after" fill sizes="(max-width:900px) 100vw, 50vw" />
                <Image className="ba-before" src={beforeAfter[0].before} alt="Sky — before" fill sizes="(max-width:900px) 100vw, 50vw" />
                <span className="lbl l">Before</span>
                <span className="lbl r">After</span>
                <div className="ba-handle" aria-hidden="true"><span className="ba-knob">↔</span></div>
              </div>
              <div className="edit-cap"><div className="t">Sky · HDR</div></div>
            </div>
            <div>
              <div className="ba" data-ba role="slider" aria-valuemin={0} aria-valuemax={100} aria-valuenow={50} tabIndex={0}>
                <Image className="ba-after" src={beforeAfter[1].after} alt="HDR — after" fill sizes="(max-width:900px) 100vw, 50vw" />
                <Image className="ba-before" src={beforeAfter[1].before} alt="HDR — before" fill sizes="(max-width:900px) 100vw, 50vw" />
                <span className="lbl l">Before</span>
                <span className="lbl r">After</span>
                <div className="ba-handle" aria-hidden="true"><span className="ba-knob">↔</span></div>
              </div>
              <div className="edit-cap"><div className="t">Windows · balance</div></div>
            </div>
          </div>
        </div>
      </section>

      <section className="visit-sec rvl" aria-label="Virtual Visit">
        <div className="wrap">
          <div className="section-head section-head-stack">
            <span className="over">Virtual Visit</span>
            <h2>Free-roam.</h2>
          </div>
          <div className="visit-stage">
            <VirtualVisitEmbed />
          </div>
        </div>
      </section>

      <section className="proof-chapter rvl" aria-label="Proof">
        <div className="wrap">
          <blockquote className="proof-card proof-card-solo">
            <p>“Three spreadsheets and a group text — now one screen.”</p>
            <footer>
              <span className="nm">Jordan Malcolm</span>
              <span className="rl">Principal · 47-agent office</span>
            </footer>
          </blockquote>
          <Link className="learn-link proof-chapter-link" href="/platform">Platform →</Link>
        </div>
      </section>

      <section className="home-price-sec rvl" id="home-pricing" aria-label="Listing media pricing">
        <div className="wrap">
          <div className="section-head section-head-stack">
            <span className="over">Media</span>
            <h2>Priced by footprint.</h2>
          </div>
          <div className="pkgs">
            <div className="pkg">
              <div className="pkg-head"><span className="pkg-name">Essentials</span></div>
              <div className="pkg-amt">from {'$'}{CORE_FROM}<small> / shoot</small></div>
              <ul>
                <li>HDR — interior + exterior</li>
                <li>Licensed drone</li>
                <li>2D floor plan</li>
                <li>24–48h target</li>
              </ul>
              <div className="pkg-foot">Small footprint · scales to XL</div>
              <Link className="btn btn-ghost" href="/book">Book Essentials</Link>
            </div>
            <div className="pkg">
              <div className="pkg-head"><span className="pkg-name">Story</span></div>
              <div className="pkg-amt">from {'$'}{STORY_FROM}<small> / shoot</small></div>
              <ul>
                <li>Everything in Essentials</li>
                <li>Cinematic reel</li>
                <li>24–48h target</li>
              </ul>
              <div className="pkg-foot">Small footprint · scales to XL</div>
              <Link className="btn btn-ghost" href="/book">Book Story</Link>
            </div>
            <div className="pkg feat">
              <div className="pkg-head"><span className="pkg-name">Showcase</span><span className="pkg-badge">Most booked</span></div>
              <div className="pkg-amt">from {'$'}{SHOWCASE_FROM}<small> / shoot</small></div>
              <ul>
                <li>Everything in Story</li>
                <li>{TOUR_NAME}</li>
                <li>24–48h target</li>
              </ul>
              <div className="pkg-foot">Small footprint · scales to XL</div>
              <Link className="btn btn-brick" href="/book">Book Showcase</Link>
            </div>
            <div className="pkg">
              <div className="pkg-head"><span className="pkg-name">Full suite</span></div>
              <div className="pkg-amt">from {'$'}{FULL_FROM}<small> / shoot</small></div>
              <ul>
                <li>Everything in Showcase</li>
                <li>Twilight exterior</li>
                <li>Staging on request</li>
                <li>24–48h target</li>
              </ul>
              <div className="pkg-foot">Small footprint · scales to XL</div>
              <Link className="btn btn-ghost" href="/book">Book Full suite</Link>
            </div>
          </div>
          <Link className="lean-strip" href="/book">
            <div>
              <span className="pkg-name">Photos only</span>
              <span className="lean-sub">HDR only · no drone · no floor plan</span>
            </div>
            <div className="lean-amt">from {'$'}{PHOTO_ONLY_FROM} →</div>
          </Link>
          <p className="rate-note"><Link href="/pricing" style={{ color: 'var(--brickDeep)', fontWeight: 500 }}>Full pricing →</Link></p>
        </div>
      </section>

      <section className="integ-band rvl" id="integrations" aria-label="Integrations">
        <div className="wrap">
          <div className="section-head section-head-stack">
            <span className="over">Integrations</span>
            <h2>Connect what you already use.</h2>
          </div>
          <p className="integ-lede">One system only works if it plugs into the rest of the office. Honest Connect — never a fake Connected state.</p>
          <div className="integ-grid">
            <div className="integ-card">
              <span className="integ-k">Calendar</span>
              <p>Google, Apple, and ICS. FreeBusy gates auto-assign for every vendor.</p>
              <span className="integ-status">Launch</span>
            </div>
            <div className="integ-card">
              <span className="integ-k">MLS</span>
              <p>BYO board credentials. Listing file sync via RESO / Bridge — no scraping.</p>
              <span className="integ-status">Launch</span>
            </div>
            <div className="integ-card">
              <span className="integ-k">E-sign</span>
              <p>Native forms on the desk. Optional DocuSign when the office already lives there.</p>
              <span className="integ-status">Launch</span>
            </div>
            <div className="integ-card">
              <span className="integ-k">CRM</span>
              <p>Follow Up Boss first. Contacts and deals stay in sync with the listing file.</p>
              <span className="integ-status">Launch</span>
            </div>
            <div className="integ-card integ-soon">
              <span className="integ-k">Showings</span>
              <p>ShowingTime+ on the listing timeline.</p>
              <span className="integ-status">Next</span>
            </div>
            <div className="integ-card integ-soon">
              <span className="integ-k">Deal file</span>
              <p>dotloop / SkySlope import so nothing gets stranded.</p>
              <span className="integ-status">Next</span>
            </div>
          </div>
          <Link className="learn-link integ-link" href="https://app.brxs.ca/login">Open Connected tools →</Link>
        </div>
      </section>

      <section className="closer closer-simple rvl" id="book" aria-label="Book a shoot">
        <div className="closer-simple-inner">
          <h2>Ready when you are.</h2>
          <Link className="btn btn-night btn-l" href="/book">Book a shoot →</Link>
          <p className="closer-proof">14,000+ properties shot · Canada-wide · 24–48h target</p>
        </div>
      </section>

      <div className="wrap">
        <section className="block rvl" id="faq" aria-label="Frequently asked questions">
          <div className="sec-head">
            <div><span className="over">FAQ</span><h2>FAQ.</h2></div>
          </div>
          <div className="faq faq-home">
            {faqs.slice(0, 4).map((f) => (
              <details key={f.id} className="qa">
                <summary>{f.q}</summary>
                <p><FaqAnswer id={f.id} a={f.a} /></p>
              </details>
            ))}
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
        .hero-home h1,.hero-home p.sub,.hero-home .cta-row{opacity:0;transform:translateY(14px);animation:heroIn .7s cubic-bezier(.16,.8,.3,1) forwards;}
        .hero-home h1{animation-delay:.06s;} .hero-home p.sub{animation-delay:.17s;} .hero-home .cta-row{animation-delay:.28s;}
        @keyframes heroIn{to{opacity:1;transform:translateY(0);}}
        .hero-home{padding:64px var(--gutter) 40px;border-bottom:none;}
        @media (max-width:680px){
          .hero-home{padding:36px var(--gutter) 24px;}
          .hero-home h1{font-size:clamp(28px,7.2vw,36px);letter-spacing:-1.2px;max-width:20ch;}
          .hero-home p.sub{font-size:15px;color:var(--inkMute);margin-top:12px;max-width:28ch;line-height:1.4;}
          .hero-home .cta-row{margin-top:22px;gap:14px;}
        }
        @media (prefers-reduced-motion:reduce){ .hero-home h1,.hero-home p.sub,.hero-home .cta-row{opacity:1;transform:none;animation:none;}}
      `}</style>

    </>
  )
}
