import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import Script from 'next/script'
import NewsletterPopup from './NewsletterPopup'
import RevealObserver from '@/components/RevealObserver'
import ProductStage from '@/components/ProductStage'
import ProductWindow from '@/components/ProductWindow'
import VirtualVisitEmbed from '@/components/VirtualVisitEmbed'
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


const beforeAfter = [
  { before: '/media/proof/Sky Before.png', after: '/media/proof/Sky After.png', label: 'Sky replacement before and after' },
  { before: '/media/proof/HDR Before.png', after: '/media/proof/HDR After.png', label: 'HDR blending before and after' },
  { before: '/media/proof/Twilight before.png', after: '/media/proof/twilight After.png', label: 'Twilight before and after' },
  { before: '/media/proof/Staging Before.png', after: '/media/proof/Staging After.png', label: 'Virtual staging before and after' },
] as const
export const metadata: Metadata = {
  title: 'bricks — the operating system for Canadian real estate',
  description: 'The operating system for Canadian real estate. Book professional media today. OS is live in preview at app.brxs.ca.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'bricks — the operating system for Canadian real estate',
    description: 'The operating system for Canadian real estate. Book professional media today. OS is live in preview at app.brxs.ca.',
    images: ['https://ctqwxwrcxwruaqojohpf.supabase.co/storage/v1/object/public/BRX%20Images/74E774C6-1524-4287-B115-25CA213E4BBD.PNG'],
  },
  twitter: {
    title: 'bricks — the operating system for Canadian real estate',
    description: 'The operating system for Canadian real estate. Book professional media today.',
    images: ['https://ctqwxwrcxwruaqojohpf.supabase.co/storage/v1/object/public/BRX%20Images/74E774C6-1524-4287-B115-25CA213E4BBD.PNG'],
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
          <h1>The OS for Canadian real estate.</h1>
          <p className="sub">Media is the beachhead. The desk runs the deal.</p>
          <div className="cta-row">
            <Link className="btn btn-brick" href="/book">Book a shoot</Link>
            <Link className="btn btn-sec" href="/platform">Platform</Link>
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
          <div className="aud-grid">
            <Link href="/brokerage" className="aud-card">
              <span className="over">OS</span>
              <h3>Brokerage</h3>
            </Link>
            <Link href="/agents#team" className="aud-card">
              <span className="over">OS</span>
              <h3>Team</h3>
            </Link>
            <Link href="/agents" className="aud-card">
              <span className="over">OS · Companion</span>
              <h3>Agent</h3>
            </Link>
            <Link href="/photographers" className="aud-card">
              <span className="over">GO</span>
              <h3>Photographer</h3>
            </Link>
          </div>
        </section>
      </div>

      <section className="prod-row rvl" aria-label="Companion">
        <div className="prod-copy">
          <span className="over">Companion</span>
          <h2>Book in one clock.</h2>
        </div>
        <div className="tray tray-book tray-phone">
          <div className="tray-stage">
            <ProductWindow
              variant="phone"
              title="Companion"
              src="/screens/book.html"
              nw={390}
              nh={844}
              fit="contain"
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
              src="/screens/disp.html"
              nw={390}
              nh={844}
              fit="contain"
              lazy
            />
          </div>
        </div>
        <div className="prod-copy">
          <span className="over">GO</span>
          <h2>Shoot on site.</h2>
        </div>
      </section>

      <section className="work-sec rvl" aria-label="Selected work">
        <div className="wrap">
          <div className="section-head section-head-stack">
            <span className="over">Selected work</span>
            <h2>Real shoots,<br /><em>not stock.</em></h2>
            <p className="lede">Every listing shot by a vetted Bricks photographer. Detached, condo, commercial — one standard.</p>
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
              <source src="https://ctqwxwrcxwruaqojohpf.supabase.co/storage/v1/object/public/BRX%20Images/Video/bid.mp4" type="video/mp4" />
            </video>
            <div className="film-in">
              <div>
                <div className="vt">How Bricks runs a listing — from first call to close.</div>
                <div className="vs">Book a shoot, the photographer is routed, media lands in 24–48 hours — then the deal runs in the same system.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="edit-sec rvl" aria-label="The edit">
        <div className="wrap">
          <div className="section-head section-head-stack">
            <span className="over">The edit</span>
            <h2>Half the work<br />happens <em>after.</em></h2>
            <p className="lede">Sky replacement, HDR blending, twilight conversion. Hybrid AI and human retouching on every frame. Drag to compare.</p>
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
              <div className="edit-cap">
                <div className="t">Sky replacement &amp; HDR blend</div>
                <div className="d">Flat overcast capture graded to a clean, listing-ready exterior.</div>
              </div>
            </div>
            <div>
              <div className="ba" data-ba role="slider" aria-valuemin={0} aria-valuemax={100} aria-valuenow={50} tabIndex={0}>
                <Image className="ba-after" src={beforeAfter[1].after} alt="HDR — after" fill sizes="(max-width:900px) 100vw, 50vw" />
                <Image className="ba-before" src={beforeAfter[1].before} alt="HDR — before" fill sizes="(max-width:900px) 100vw, 50vw" />
                <span className="lbl l">Before</span>
                <span className="lbl r">After</span>
                <div className="ba-handle" aria-hidden="true"><span className="ba-knob">↔</span></div>
              </div>
              <div className="edit-cap">
                <div className="t">Window pull &amp; interior balance</div>
                <div className="d">Blown windows recovered, colour balanced across mixed light sources.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="visit-sec rvl" aria-label="Virtual Visit">
        <div className="wrap">
          <div className="section-head section-head-stack">
            <span className="over">Virtual Visit · Gaussian splat · quoted by sqft</span>
            <h2>Free-roam.<br /><em>Never a tour.</em></h2>
            <p className="lede">Buyers walk the property on their own path — not a scripted walkthrough. Always a paid add-on, never packaged.</p>
          </div>
          <div className="visit-stage">
            <VirtualVisitEmbed />
          </div>
        </div>
      </section>

      <div className="wrap">
        <section className="block rvl" id="book">
          <div className="book">
            <div>
              <span className="over">Book</span>
              <h2 style={{ color: 'var(--moon)', marginTop: 8 }}>Ready when the listing is.</h2>
              <Link className="btn btn-brick" href="/book" style={{ marginTop: 18, display: 'inline-flex' }}>Book a shoot →</Link>
            </div>
          </div>
        </section>
      </div>

      <div className="wrap">
        <section className="block rvl" id="faq" aria-label="Frequently asked questions">
          <div className="sec-head">
            <div><span className="over">FAQ</span><h2>Quick answers.</h2></div>
          </div>
          <div className="faq">
            {faqs.slice(0, 4).map((f) => (
              <div key={f.id} className="qa">
                <h4>{f.q}</h4>
                <p><FaqAnswer id={f.id} a={f.a} /></p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <NewsletterPopup />

      <style>{`
        .trust{text-align:center;padding:72px 0 28px;}
        .proof-cap{font-family:'General Sans',system-ui,sans-serif;font-size:28px;font-weight:500;letter-spacing:-0.7px;line-height:1.05;color:var(--ink);margin:0 auto;text-align:center;}
        .aud-sec{padding:0 0 48px;}
        .aud-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:var(--hair);border:1px solid var(--hair);border-radius:2px;}
        .aud-card{background:var(--paper);padding:20px 18px;text-decoration:none;color:inherit;display:block;}
        .aud-card:hover{background:var(--paperSoft);}
        .aud-card h3{font-weight:500;font-size:17px;letter-spacing:-0.3px;color:var(--ink);margin:8px 0 0;}
        @media (max-width:800px){.aud-grid{grid-template-columns:1fr 1fr;}}
        @media (max-width:480px){.aud-grid{grid-template-columns:1fr;}}
        .prod-mini{margin-top:12px;font-size:13px;color:var(--inkMute);}
        .prod-mini a{color:var(--brickDeep);text-decoration:none;}
        .prod-mini a:hover{text-decoration:underline;text-underline-offset:2px;}
        .faq .qa p a{color:var(--brickDeep);text-decoration:none;}
        .hero-home{padding:88px 36px 56px;border-bottom:none;}
        .hero-home h1{font-weight:500;font-size:46px;line-height:1.0;letter-spacing:-1.6px;color:var(--ink);max-width:760px;}
        .hero-home p.sub{font-size:17px;color:var(--inkSoft);margin-top:16px;max-width:420px;}
        .hero-home h1,.hero-home p.sub,.hero-home .cta-row{opacity:0;transform:translateY(14px);animation:heroIn .7s cubic-bezier(.16,.8,.3,1) forwards;}
        .hero-home h1{animation-delay:.06s;} .hero-home p.sub{animation-delay:.17s;} .hero-home .cta-row{animation-delay:.28s;}
        @keyframes heroIn{to{opacity:1;transform:translateY(0);}}
        @media (max-width:680px){
          .hero-home{padding:52px 20px 36px;}
          .hero-home h1{font-size:34px;}
        }
        @media (prefers-reduced-motion:reduce){ .hero-home h1,.hero-home p.sub,.hero-home .cta-row{opacity:1;transform:none;animation:none;}}
      `}</style>

    </>
  )
}
