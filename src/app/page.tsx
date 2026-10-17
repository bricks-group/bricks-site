import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import NewsletterPopup from './NewsletterPopup'
import RevealObserver from '@/components/RevealObserver'
import ProductStage from '@/components/ProductStage'
import OsDeskShot from '@/components/OsDeskShot'
import ServicesGrid from '@/components/services/ServicesGrid'
import IntegrationsBand from '@/components/IntegrationsBand'
import PhoneScreen from '@/components/PhoneScreen'
import './home-v10.css'
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
    a: 'The system for Canadian real estate: listing media, deals, e-sign and CRM in one place. Agents book shoots in Companion; photographers work in the Bricks app.',
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
    a: 'Photographers are independent contractors paid a fixed amount per job. Jobs arrive in the Bricks app.',
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
      return <>Photographers are independent contractors paid a fixed amount per job. Jobs arrive in the Bricks app. <Link href="/photographers">Apply</Link>.</>
    case 'help':
      return <>Email <a href="mailto:help@brxs.ca">help@brxs.ca</a> or use the <Link href="/contact">contact form</Link>. For a shoot, <Link href="/book">book online</Link> or email <a href="mailto:booking@brxs.ca">booking@brxs.ca</a>.</>
    default:
      return <>{a}</>
  }
}




const GUIDES = [
  { href: '/blog/canada-real-estate-photography-cost-2026', title: 'How much does real estate photography cost in Canada? (2026)', read: '8 min', date: '2026-09-12' },
  { href: '/blog/3d-tour-vs-video-walkthrough', title: 'Virtual tour vs. video walkthrough: which sells faster?', read: '6 min', date: '2026-07-22' },
  { href: '/blog/drone-photography-rules-ontario', title: 'Drone photography rules for real estate in Ontario', read: '8 min', date: '2026-07-22' },
  { href: '/blog/whats-included-listing-shoot', title: "What's included in a professional listing photo shoot?", read: '5 min', date: '2026-07-22' },
]
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const fmtDate = (d: string) => { const [y, m, day] = d.split('-'); return `${MONTHS[+m - 1]} ${+day}, ${y}` }

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
          <h1>The system that brings it all together.</h1>
          <p className="sub">Software, media, 3D and site progress for Canadian real estate, working as one.</p>
          <div className="cta-row">
            <Link className="btn btn-night" href="/book">Book a shoot</Link>
            <a className="btn btn-ghost" href="https://app.brxs.ca/login">Try Bricks free</a>
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

      <IntegrationsBand compact />

      <div className="hf" aria-label="Inside Bricks">
        <section className="hf-row rvl" aria-label="The desk">
          <div className="hf-copy">
            <h2>The desk runs the deal.</h2>
            <p>Deals, CRM, e-sign and MLS® submission on one screen.</p>
            <Link className="hf-link" href="/platform">Explore the desk →</Link>
          </div>
          <div className="hf-frame tray tray-crm">
            <div className="tray-stage tray-stage-fill">
              <OsDeskShot />
            </div>
          </div>
        </section>

        <section className="hf-row hf-flip rvl" aria-label="Media">
          <div className="hf-copy">
            <h2>Media, inside Bricks.</h2>
            <p>Book photos, drone, video and 3D at an exact time. Delivery lands on the listing.</p>
            <Link className="hf-link" href="/media">See the media →</Link>
          </div>
          <div className="hf-frame tray tray-book tray-phone">
            <div className="phone-stage">
              <PhoneScreen name="book" alt="Bricks booking app: next shoot, Book a shoot button and your listings" />
            </div>
          </div>
        </section>

        <section className="hf-row rvl" aria-label="Site Progress for builders">
          <div className="hf-copy">
            <h2>Site Progress, inside Bricks.</h2>
            <p>Photos, maps, models and reports on a fixed schedule, in one site file.</p>
            <Link className="hf-link" href="/builders">See Site Progress →</Link>
          </div>
          <div className="hf-frame hf-photo">
            <picture>
              <source type="image/avif" srcSet="/media/site-progress/tower-cranes-960.avif 960w, /media/site-progress/tower-cranes-1280.avif 1280w, /media/site-progress/tower-cranes-1600.avif 1600w" sizes="(max-width:900px) 100vw, 780px" />
              <source type="image/webp" srcSet="/media/site-progress/tower-cranes-960.webp 960w, /media/site-progress/tower-cranes-1280.webp 1280w, /media/site-progress/tower-cranes-1600.webp 1600w" sizes="(max-width:900px) 100vw, 780px" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/media/site-progress/tower-cranes-960.webp" width={960} height={640} alt="Drone view of a high-rise under construction, with tower cranes" loading="lazy" decoding="async" />
            </picture>
          </div>
        </section>

        <section className="hf-row hf-flip rvl" aria-label="Photographers">
          <div className="hf-copy">
            <h2>Photographers, dispatched through Bricks.</h2>
            <p>Independent pros take the job, shoot and upload in the Bricks app.</p>
            <Link className="hf-link" href="/photographers">For photographers →</Link>
          </div>
          <div className="hf-frame tray tray-disp tray-phone">
            <div className="phone-stage">
              <PhoneScreen name="disp" alt="Bricks photographer app: next job, navigate and pre-shoot checklist" />
            </div>
          </div>
        </section>
      </div>

      <ServicesGrid />

      <section className="hp-proof rvl" aria-label="Proof">
        <div className="wrap">
          <blockquote>
            <p>“Three spreadsheets and a group text — now one screen.”</p>
            <footer><span className="nm">Jordan Malcolm</span><span className="rl">Principal, 47-agent office</span></footer>
          </blockquote>
        </div>
      </section>

      <section className="hp-price rvl" id="home-pricing" aria-label="Listing media pricing">
        <div className="wrap">
          <div className="hp-sec-head">
            <h2>Listing media packages.</h2>
            <Link className="hf-link" href="/pricing">Full pricing →</Link>
          </div>
          <ul className="hp-pk">
            {[
              { n: 'Essentials', f: CORE_FROM, d: 'HDR photos, licensed drone, floor plan' },
              { n: 'Story', f: STORY_FROM, d: 'Essentials plus a cinematic reel' },
              { n: 'Showcase', f: SHOWCASE_FROM, d: `Story plus ${TOUR_NAME}`, feat: true },
              { n: 'Full suite', f: FULL_FROM, d: 'Showcase plus a twilight exterior' },
            ].map((k) => (
              <li key={k.n} className={k.feat ? 'is-feat' : undefined}>
                <Link href="/book">
                  <span className="hp-pk-n">{k.n}{k.feat ? <span className="hp-pk-b">Most booked</span> : null}</span>
                  <span className="hp-pk-f">from <span className="hp-num">${k.f}</span></span>
                  <span className="hp-pk-d">{k.d}</span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="hp-note">Photos only from <span className="hp-num">${PHOTO_ONLY_FROM}</span>. Prices are for smaller homes and scale with size.</p>
        </div>
      </section>

      <section className="hp-guides rvl" aria-label="Guides">
        <div className="wrap">
          <div className="hp-sec-head">
            <h2>Guides.</h2>
            <Link className="hf-link" href="/blog">All guides →</Link>
          </div>
          <ul className="hp-gd">
            {GUIDES.map((g) => (
              <li key={g.href}>
                <Link href={g.href}>
                  <span className="hp-gd-m"><time dateTime={g.date}>{fmtDate(g.date)}</time> · {g.read}</span>
                  <span className="hp-gd-t">{g.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="wrap hp-wrap">
        <section className="block rvl" id="faq" aria-label="Frequently asked questions">
          <div className="hp-sec-head">
            <h2>Common questions.</h2>
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

      <section className="hp-end rvl" id="book" aria-label="Book a shoot">
        <h2>Ready when you are.</h2>
        <Link className="btn btn-night btn-l" href="/book">Book a shoot</Link>
        <div className="hp-end-alt">
          <a href="https://app.brxs.ca/login">Try Bricks free →</a>
          <Link href="/book/site">Book a site visit →</Link>
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
        .hero-home{padding:64px var(--gutter) 40px;border-bottom:none;}
        @media (max-width:680px){
          .hero-home{padding:36px var(--gutter) 24px;}
          .hero-home h1{font-size:clamp(28px,7.2vw,36px);letter-spacing:-1.2px;max-width:20ch;}
          .hero-home p.sub{font-size:15px;color:var(--inkMute);margin-top:12px;max-width:28ch;line-height:1.4;}
          .hero-home .cta-row{margin-top:22px;gap:14px;}
        }
      `}</style>

    </>
  )
}


