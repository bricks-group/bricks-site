import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import NewsletterPopup from './NewsletterPopup'
import RevealObserver from '@/components/RevealObserver'
import ProductStage from '@/components/ProductStage'
import OsDeskShot from '@/components/OsDeskShot'
import StepsRail from '@/components/steps-rail/StepsRail'
import MediaShowcase from '@/components/media-showcase/MediaShowcase'
import IntegrationsBand from '@/components/IntegrationsBand'
import AudienceCards from '@/components/AudienceCards'
import './home-v3.css'
import {
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
  COVERAGE_LINE,
  GO_URL,
  STATUS,
  TOUR_NAME,
  VISIT_NAME,
  VISIT_PACKAGING,
} from '@/lib/brand'
import { ORGANIZATION_SCHEMA, WEBSITE_SCHEMA } from '@/lib/schema'

const faqs = [
  {
    id: 'what',
    q: 'What is Bricks?',
    a: 'The system for Canadian real estate: listing media, deals, e-sign and CRM in one place. Agents book shoots in Companion; photographers work in GO.',
  },
  {
    id: 'included',
    q: "What's included in a standard shoot?",
    a: `Essentials, from $${CORE_FROM}, includes HDR photos, licensed drone and a floor plan. We aim to deliver MLS-ready media in 24–48 hours.`,
  },
  {
    id: 'booking',
    q: 'How does booking work?',
    a: 'Enter the address, pick your services and see the full quote, including travel. Paying locks in an exact time. Cancel more than 24 hours before the shoot for a full refund.',
  },
  {
    id: 'coverage',
    q: 'Where do you cover?',
    a: 'Across Canada. Travel is priced from the assigned photographer’s location: the first 25 km are free, then $0.75/km. You see it before you pay.',
  },
  {
    id: 'mls-safe',
    q: 'Are the photos MLS-safe?',
    a: 'Yes. We keep real window views and don’t add fake skies by default. Twilight is shot for real at blue hour.',
  },
  {
    id: 'drone',
    q: 'Do you fly drone / RPAS?',
    a: 'Yes. Our pilots hold Advanced RPAS certification. Drone is included in Essentials and up, or can be added on its own.',
  },
  {
    id: 'tour-visit',
    q: 'Virtual tour or virtual visit?',
    a: 'A virtual tour follows a set path and comes with Showcase and Full suite. A virtual visit is free-roam 3D, booked as an add-on.',
  },
  {
    id: 'plans',
    q: 'What about software plans?',
    a: 'Clay is free. Keystone, Marble and Diamond add more. Media is always booked separately.',
  },
  {
    id: 'photographers',
    q: 'How do photographers work with Bricks?',
    a: 'Photographers are independent contractors paid a fixed amount per job. Jobs arrive in GO.',
  },
  {
    id: 'help',
    q: 'How do I get help?',
    a: 'Email help@brxs.ca or use the contact form. For a shoot, book online or email booking@brxs.ca.',
  },
] as const

function FaqAnswer({ id, a }: { id: (typeof faqs)[number]['id']; a: string }) {
  switch (id) {
    case 'included':
      return <>HDR photos, licensed drone and a floor plan. We aim to deliver in 24–48 hours. <Link href="/pricing">See pricing</Link>.</>
    case 'booking':
      return <>Enter the address, pick your services and choose an exact time. Paying locks it in. <Link href="/book">Book a shoot</Link>.</>
    case 'plans':
      return <>Clay is free. Keystone, Marble and Diamond add more. Media is always booked separately. <Link href="/pricing">See pricing</Link>.</>
    case 'photographers':
      return <>Photographers are independent contractors paid a fixed amount per job. Jobs arrive in GO. <Link href="/photographers">Apply</Link>.</>
    case 'help':
      return <>Email <a href="mailto:help@brxs.ca">help@brxs.ca</a> or use the <Link href="/contact">contact form</Link>. For a shoot, <Link href="/book">book online</Link> or email <a href="mailto:booking@brxs.ca">booking@brxs.ca</a>.</>
    default:
      return <>{a}</>
  }
}



const NEXT = [
  { t: 'Bricks OS', d: 'Deals, CRM, e-sign and MLS® submission, synced to your calendar.', href: '/platform' },
  { t: 'Virtual Visit', d: 'Free-roam 3D of the home.', href: '#visit' },
  { t: 'Floor plans', d: 'Included from Essentials up, or on their own.', href: '/pricing' },
  { t: 'Reels and video', d: 'A cinematic reel for the listing.', href: '/pricing' },
  { t: 'Drone', d: 'Licensed aerials of the property.', href: '/pricing' },
  { t: 'Site Progress', d: 'Progress visits and mapped capture for builders.', href: '/builders' },
] as const

export const metadata: Metadata = {
  title: 'Bricks — the system for Canadian real estate',
  description: 'The system for Canadian real estate. Listing media, deals, e-sign and CRM in one place.',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: 'Bricks',
    url: 'https://www.brxs.ca/',
    locale: 'en_CA',
    title: 'Bricks — the system for Canadian real estate',
    description: 'The system for Canadian real estate. Listing media, deals, e-sign and CRM in one place.',
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

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [ORGANIZATION_SCHEMA, WEBSITE_SCHEMA],
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
          <p className="sub">Software for the deal. Media for the listing. Site progress for the build.</p>
          <div className="cta-row">
            <Link className="btn btn-night" href="/book">Book a shoot</Link>
            <a className="btn btn-ghost" href="https://app.brxs.ca/login">Try Bricks OS free</a>
            <Link className="learn-link" href="/demo">Request a walkthrough →</Link>
          </div>
          <nav className="hp-pillars" aria-label="What Bricks does">
            <Link href="/platform" className="hp-pillar"><span className="hp-pt">Bricks OS</span><span className="hp-pd">Deals, CRM and e-sign.</span></Link>
            <Link href="/pricing" className="hp-pillar"><span className="hp-pt">Listing media</span><span className="hp-pd">Photos, drone, video and 3D.</span></Link>
            <Link href="/builders" className="hp-pillar"><span className="hp-pt">Site Progress</span><span className="hp-pd">Drone visits for builders.</span></Link>
          </nav>
        </div>
      </section>

      <section className="prod-hero" aria-label="bricks desk">
        <div className="tray tray-os">
          <div className="tray-stage">
            <ProductStage />
          </div>
        </div>
      </section>

      <AudienceCards />

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

      <MediaShowcase />

      <StepsRail />

      <section className="next-sec rvl" aria-label="What happens next">
        <div className="wrap">
          <div className="next-head">
            <h2>Then the rest of Bricks.</h2>
            <p className="sub">Photos are the start. Here&apos;s what picks up from there.</p>
          </div>
          <ul className="next-grid">
            {NEXT.map((n) => (
              <li key={n.t}>
                <Link className="next-card" href={n.href}>
                  <span className="next-t">{n.t}</span>
                  <span className="next-d">{n.d}</span>
                  <span className="next-go" aria-hidden="true">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bld-band rvl" aria-label="Site Progress for builders">
        <div className="wrap bld-inner">
          <div className="bld-copy">
            <h2>Site Progress for builders.</h2>
            <p className="sub">Drone progress visits and mapped captures on a fixed schedule.</p>
            <ul className="bld-list">
              <li><b>Progress visits</b><span>Drone photos and video, dated by visit.</span></li>
              <li><b>Mapped capture</b><span>Orthomosaic, 3D model and site map.</span></li>
              <li><b>One site file</b><span>Every visit shared through one link.</span></li>
            </ul>
            <div className="cta-row">
              <Link className="btn btn-night" href="/book/site">Book a site visit</Link>
              <Link className="learn-link" href="/builders">See Site Progress →</Link>
            </div>
          </div>
          <div className="bld-visual">
            <picture>
              <source type="image/avif" srcSet="/media/site-progress/tower-cranes-640.avif 640w, /media/site-progress/tower-cranes-960.avif 960w, /media/site-progress/tower-cranes-1280.avif 1280w, /media/site-progress/tower-cranes-1600.avif 1600w" sizes="(max-width:900px) 100vw, 560px" />
              <source type="image/webp" srcSet="/media/site-progress/tower-cranes-640.webp 640w, /media/site-progress/tower-cranes-960.webp 960w, /media/site-progress/tower-cranes-1280.webp 1280w, /media/site-progress/tower-cranes-1600.webp 1600w" sizes="(max-width:900px) 100vw, 560px" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/media/site-progress/tower-cranes-960.webp" width={960} height={640} alt="Drone view of a high-rise under construction, with tower cranes" loading="lazy" decoding="async" />
            </picture>
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
            <h2>Listing media packages.</h2>
          </div>
          <div className="pkgs">
            <div className="pkg">
              <div className="pkg-head"><span className="pkg-name">Essentials</span></div>
              <div className="pkg-amt">from {'$'}{CORE_FROM}<small> / shoot</small></div>
              <ul>
                <li>HDR photos</li>
                <li>Licensed drone</li>
                <li>Floor plan</li>
              </ul>
              <Link className="btn btn-ghost" href="/book">Book Essentials</Link>
            </div>
            <div className="pkg">
              <div className="pkg-head"><span className="pkg-name">Story</span></div>
              <div className="pkg-amt">from {'$'}{STORY_FROM}<small> / shoot</small></div>
              <ul>
                <li>Everything in Essentials</li>
                <li>Cinematic reel</li>
              </ul>
              <Link className="btn btn-ghost" href="/book">Book Story</Link>
            </div>
            <div className="pkg feat">
              <div className="pkg-head"><span className="pkg-name">Showcase</span><span className="pkg-badge">Most booked</span></div>
              <div className="pkg-amt">from {'$'}{SHOWCASE_FROM}<small> / shoot</small></div>
              <ul>
                <li>Everything in Story</li>
                <li>{TOUR_NAME}</li>
              </ul>
              <Link className="btn btn-brick" href="/book">Book Showcase</Link>
            </div>
            <div className="pkg">
              <div className="pkg-head"><span className="pkg-name">Full suite</span></div>
              <div className="pkg-amt">from {'$'}{FULL_FROM}<small> / shoot</small></div>
              <ul>
                <li>Everything in Showcase</li>
                <li>Twilight exterior</li>
              </ul>
              <Link className="btn btn-ghost" href="/book">Book Full suite</Link>
            </div>
          </div>
          <Link className="lean-strip" href="/book">
            <div>
              <span className="pkg-name">Photos only</span>
              <span className="lean-sub">HDR photos only</span>
            </div>
            <div className="lean-amt">from {'$'}{PHOTO_ONLY_FROM} →</div>
          </Link>
          <p className="rate-note">Prices are for smaller homes and scale with size. <Link href="/pricing" style={{ color: 'var(--brickDeep)', fontWeight: 500 }}>Full pricing →</Link></p>
        </div>
      </section>

      <IntegrationsBand />

      <section className="closer closer-simple rvl" id="book" aria-label="Book a shoot">
        <div className="closer-simple-inner">
          <h2>Ready when you are.</h2>
          <Link className="btn btn-night btn-l" href="/book">Book a shoot →</Link>
          <div className="closer-alt">
            <a href="https://app.brxs.ca/login">Try Bricks OS free →</a>
            <Link href="/book/site">Book a site visit →</Link>
          </div>
        </div>
      </section>

      <div className="wrap">
        <section className="block rvl" id="faq" aria-label="Frequently asked questions">
          <div className="sec-head">
            <div><span className="over">FAQ</span><h2>Common questions.</h2></div>
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


