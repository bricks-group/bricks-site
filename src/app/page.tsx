import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import Script from 'next/script'
import NewsletterPopup from './NewsletterPopup'
import RevealObserver from '@/components/RevealObserver'
import OsDeskShot from '@/components/OsDeskShot'
import VirtualVisitEmbed from '@/components/VirtualVisitEmbed'
import IntegrationsBand from '@/components/IntegrationsBand'
import SmoothScroll from '@/components/rev/SmoothScroll'
import CtaLink from '@/components/rev/CtaLink'
import { HOME_COPY } from '@/lib/home-copy'
import './home-rev.css'
import {
  FOOTPRINT_BANDS,
  TOUR_RANGE,
  VISIT_PRICE_LABEL,
  CORE_FROM,
  STORY_FROM,
  SHOWCASE_FROM,
  FULL_FROM,
  PHOTO_ONLY_FROM,
  PHOTO_RANGE,
  DRONE_RANGE,
  REEL_RANGE,
  TWILIGHT_RANGE,
  FLOOR_PLAN_ONLY_LABEL,
  STAGING_PRICE_LABEL,
  VISIT_RANGE,
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
    a: `The system for Canadian real estate — one place for media, dispatch, and the deal. Companion books; GO is the field app. ${STATUS.os}`,
  },
  {
    id: 'included',
    q: "What's included in a standard shoot?",
    a: `Essentials from $${CORE_FROM}: HDR + licensed drone + floor plan — the drone-included listing set (Photos only drops drone and floor plan). MLS-ready on a 24–48h target, not a guarantee. Real windows; no invent sky or dusk by default.`,
  },
  {
    id: 'booking',
    q: 'How does booking work?',
    a: 'Pick services, see assignee and travel on the quote, then pay to lock the exact clock time (not pay-on-delivery). Refund schedule is on the pay step and in Terms.',
  },
  {
    id: 'coverage',
    q: 'Where do you cover?',
    a: `Canada-wide launch. ${COVERAGE_LINE} Travel: GTA assign-first is often $0; otherwise from the assigned photographer’s base — first 25 km free, then $0.75/km — shown before you pay. Not free Canada-wide.`,
  },
  {
    id: 'mls-safe',
    q: 'Are listing stills MLS-safe?',
    a: 'Real window views. We do not invent sky or dusk by default. Twilight is a real blue-hour exterior add-on.',
  },
  {
    id: 'drone',
    q: 'Do you fly drone / RPAS?',
    a: 'Yes — licensed drone means Advanced RPAS-certified aerial. It is included on packages that include drone (Essentials and up), or à la carte. Required for legal commercial aerial work in Canadian airspace.',
  },
  {
    id: 'tour-visit',
    q: `Virtual tour vs ${VISIT_NAME.toLowerCase()}?`,
    a: `${TOUR_NAME} is a path-confined walkthrough — a ${TOUR_RANGE} add-on by footprint; Showcase and Full suite include it. ${VISIT_NAME} is a free-roam Gaussian splat, always a paid add-on, ${VISIT_PRICE_LABEL.toLowerCase()} (${FOOTPRINT_BANDS}), never packaged. Priced by footprint and charged at checkout. ${VISIT_PACKAGING}`,
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
      return <>HDR, licensed drone, floor plan. 24–48h target. See <Link href="/pricing">Pricing</Link>.</>
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
  { before: '/media/proof/Sky Before.png', after: '/media/proof/Sky After.png', label: 'Sky enhance (on request) before and after' },
  { before: '/media/proof/HDR Before.png', after: '/media/proof/HDR After.png', label: 'HDR blending before and after' },
  { before: '/media/proof/Twilight before.png', after: '/media/proof/twilight After.png', label: 'Twilight before and after' },
  { before: '/media/proof/Staging Before.png', after: '/media/proof/Staging After.png', label: 'Virtual staging ($35/photo add-on) before and after' },
] as const
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

const t = HOME_COPY.en

const WORK = [
  { src: '/media/work/02.jpg', k: 'Detached', v: 'Exterior · front' , cls: 'w-a' },
  { src: '/media/work/04.jpg', k: 'Condo', v: 'Living · window light', cls: 'w-b' },
  { src: '/media/work/05.jpg', k: 'Licensed drone', v: 'Aerial · towers', cls: 'w-c' },
  { src: '/media/work/09.jpg', k: 'Interior', v: 'Open plan', cls: 'w-d' },
  { src: '/media/work/01.jpg', k: 'Street', v: 'Exterior · row', cls: 'w-e' },
  { src: '/media/work/12.jpg', k: 'Commercial', v: 'Exterior · industrial', cls: 'w-f' },
] as const

const SERVICES = [
  { n: '01', name: 'HDR photos', note: 'Real windows. MLS-ready on a 24–48h target.', price: PHOTO_RANGE },
  { n: '02', name: 'Licensed drone', note: 'Advanced RPAS-certified aerial.', price: DRONE_RANGE },
  { n: '03', name: 'Floor plan', note: 'Included from Essentials · standalone capture available.', price: FLOOR_PLAN_ONLY_LABEL },
  { n: '04', name: 'Cinematic reel', note: 'Included from Story.', price: REEL_RANGE },
  { n: '05', name: TOUR_NAME, note: 'Path-confined walkthrough. Included from Showcase.', price: TOUR_RANGE },
  { n: '06', name: VISIT_NAME, note: 'Free-roam Gaussian splat. Always a paid add-on, never packaged.', price: VISIT_RANGE },
  { n: '07', name: 'Twilight', note: 'A real blue-hour exterior — not invented dusk.', price: TWILIGHT_RANGE },
  { n: '08', name: 'Virtual staging', note: 'Per photo add-on, never packaged.', price: STAGING_PRICE_LABEL },
] as const

export default function Home() {
  return (
    <div className="rv-home">
      <RevealObserver />
      <SmoothScroll />
      <Script src="/assets/ba.js" strategy="afterInteractive" />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': [ORGANIZATION_SCHEMA, WEBSITE_SCHEMA] }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
          }),
        }}
      />

      {/* 1 · Hero — split: copy + framed photo card */}
      <section className="rv-hero" aria-label="Bricks">
        <div className="rv-wrap rv-hero-grid">
          <div className="rv-hero-copy">
            <span className="rv-mono rv-eyebrow rv-up" style={{ ['--d' as string]: 0 }}><i className="rv-dot" aria-hidden /> {t.heroKicker}</span>
            <h1 className="rv-up" style={{ ['--d' as string]: 1 }}>
              {t.heroTitleA} <span className="rv-serif">{t.heroTitleSerif}</span> {t.heroTitleB}
            </h1>
            <p className="rv-lede rv-up" style={{ ['--d' as string]: 2 }}>{t.heroSub}</p>
            <div className="rv-cta-row rv-up" style={{ ['--d' as string]: 3 }}>
              <CtaLink href="/book" className="rv-btn-brick">{t.ctaPrimary}</CtaLink>
              <CtaLink href="/contact" className="rv-btn-ghost" loaderColor="#D2542B">{t.ctaSecondary}</CtaLink>
            </div>
            <p className="rv-mono rv-trust rv-up" style={{ ['--d' as string]: 4 }}>{t.heroTrust}</p>
          </div>
          <figure className="rv-frame rv-hero-card rv-up" style={{ ['--d' as string]: 2 }}>
            <div className="rv-frame-img">
              <Image src="/media/work/02.jpg" alt="Detached home exterior shot by Bricks" fill priority sizes="(max-width:900px) 100vw, 46vw" />
            </div>
            <figcaption className="rv-frame-cap">
              <span className="rv-mono">Detached · Exterior</span>
              <span className="rv-mono rv-muted">HDR · Real windows</span>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* 2 · Single big proof stat, ruled band */}
      <section className="rv-band rv-proof rvl" aria-label="Proof">
        <div className="rv-wrap rv-proof-grid">
          <span className="rv-mono rv-k">{t.proofLabel}</span>
          <div className="rv-proof-main">
            <b className="rv-stat">{t.proofStat}</b>
            <p><span className="rv-serif">{t.proofLine}</span><br /><span className="rv-mono rv-muted">{t.proofSource}</span></p>
          </div>
          <dl className="rv-proof-side">
            <div><dt className="rv-mono">Coverage</dt><dd>Canada</dd></div>
            <div><dt className="rv-mono">Delivery</dt><dd>24–48h target</dd></div>
            <div><dt className="rv-mono">Routing</dt><dd>Auto-assign</dd></div>
          </dl>
        </div>
      </section>

      {/* 3 · Two paths */}
      <section className="rv-band rv-paths rvl" aria-label={t.pathsLabel}>
        <div className="rv-wrap">
          <div className="rv-head"><span className="rv-mono rv-k">{t.pathsLabel}</span></div>
          <div className="rv-paths-grid">
            <Link href="/book" className="rv-path">
              <span className="rv-mono rv-muted">01 · Agents & teams</span>
              <h2>Book a shoot in <span className="rv-serif">three steps.</span></h2>
              <p>Property, package, exact clock time — pay locks it, the photographer gets GO, media lands back on the listing file.</p>
              <span className="rv-path-go">Start a booking <span aria-hidden>→</span></span>
            </Link>
            <Link href="/brokerage" className="rv-path">
              <span className="rv-mono rv-muted">02 · Brokerages</span>
              <h2>The desk <span className="rv-serif">runs the deal.</span></h2>
              <p>Deals, media, MLS, and signatures on one screen — so the office stops living in spreadsheets and group chats.</p>
              <span className="rv-path-go">For brokerages <span aria-hidden>→</span></span>
            </Link>
          </div>
        </div>
      </section>

      {/* 4 · Work — framed cards, one grade, mono labels */}
      <section className="rv-band rv-work rvl" aria-label="Selected work">
        <div className="rv-wrap">
          <div className="rv-head rv-head-split">
            <div><span className="rv-mono rv-k">Work</span><h2>Real shoots. <span className="rv-serif">Real windows.</span></h2></div>
            <Link className="rv-textlink" href="/gallery">See more work →</Link>
          </div>
          <div className="rv-work-grid">
            {WORK.map((w) => (
              <figure key={w.src} className={`rv-frame ${w.cls}`}>
                <div className="rv-frame-img">
                  <Image src={w.src} alt={`${w.k} — ${w.v}`} fill sizes="(max-width:900px) 100vw, 33vw" />
                </div>
                <figcaption className="rv-frame-cap">
                  <span className="rv-mono">{w.k}</span>
                  <span className="rv-mono rv-muted">{w.v}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* 5 · Services index — editorial table, mono price data */}
      <section className="rv-band rv-services rvl" id="services" aria-label="Services">
        <div className="rv-wrap rv-split">
          <div className="rv-split-l">
            <span className="rv-mono rv-k">Services</span>
            <h2>À la carte, <span className="rv-serif">priced by footprint.</span></h2>
            <p className="rv-muted-p">{FOOTPRINT_BANDS} sq ft. CAD, pre-tax. Exact total on the quote before you pay.</p>
          </div>
          <ol className="rv-index">
            {SERVICES.map((s) => (
              <li key={s.n}>
                <span className="rv-mono rv-muted">{s.n}</span>
                <div><b>{s.name}</b><small>{s.note}</small></div>
                <span className="rv-mono rv-price">{s.price}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 6 · Packages */}
      <section className="rv-band home-price-sec rvl" id="home-pricing" aria-label="Listing media pricing">
        <div className="rv-wrap">
          <div className="rv-head rv-head-split">
            <div><span className="rv-mono rv-k">Packages</span><h2>Media, <span className="rv-serif">bundled honestly.</span></h2></div>
            <Link className="rv-textlink" href="/pricing">Full pricing →</Link>
          </div>
          <div className="rv-pkgs">
            {[
              { name: 'Essentials', badge: 'Listing set', from: CORE_FROM, items: ['HDR + licensed drone + floor plan', 'Not a photo-only peer stack', '24–48h target'], foot: 'Drone-included listing set · Small→XL' },
              { name: 'Story', from: STORY_FROM, items: ['Everything in Essentials', 'Cinematic reel', '24–48h target'], foot: 'Small footprint · scales to XL' },
              { name: 'Showcase', badge: 'Most booked', from: SHOWCASE_FROM, items: ['Everything in Story', TOUR_NAME, '24–48h target'], foot: 'Small footprint · scales to XL', feat: true },
              { name: 'Full suite', from: FULL_FROM, items: ['Everything in Showcase', 'Twilight exterior', 'Virtual staging is $35 / photo — not included', '24–48h target'], foot: 'Small footprint · scales to XL' },
            ].map((p) => (
              <div key={p.name} className={`rv-pkg${p.feat ? ' feat' : ''}`}>
                <div className="rv-pkg-head"><span>{p.name}</span>{p.badge ? <span className="rv-mono rv-badge">{p.badge}</span> : null}</div>
                <div className="rv-pkg-amt"><span className="rv-mono rv-muted">from</span> ${p.from}<small className="rv-mono"> / shoot</small></div>
                <ul>{p.items.map((i) => <li key={i}>{i}</li>)}</ul>
                <div className="rv-mono rv-pkg-foot">{p.foot}</div>
                <CtaLink href="/book" className={p.feat ? 'rv-btn-brick rv-btn-block' : 'rv-btn-ghost rv-btn-block'} loaderColor={p.feat ? '#fff' : '#D2542B'}>{`Book ${p.name}`}</CtaLink>
              </div>
            ))}
          </div>
          <Link className="rv-lean" href="/book">
            <span><b>Photos only</b> <span className="rv-mono rv-muted">HDR only · no drone · no floor plan</span></span>
            <span className="rv-mono">from ${PHOTO_ONLY_FROM} →</span>
          </Link>
          <p className="rv-note">Real windows — no invent sky or dusk by default. GTA travel often $0 at assign-first.</p>
        </div>
      </section>

      {/* 7 · After the shoot */}
      <section className="rv-band edit-sec rvl" aria-label="After the shoot">
        <div className="rv-wrap rv-split">
          <div className="rv-split-l">
            <span className="rv-mono rv-k">Delivery</span>
            <h2>After <span className="rv-serif">the shoot.</span></h2>
            <p className="rv-muted-p">HDR balance for MLS is the standard path. Sky enhance is on request — we do not invent sky or dusk by default. Virtual staging is $35/photo, never packaged.</p>
          </div>
          <div className="rv-ba-grid">
            {[{ b: beforeAfter[1], cap: 'HDR · windows' }, { b: beforeAfter[0], cap: 'Sky · on request' }].map(({ b, cap }) => (
              <figure key={cap} className="rv-frame">
                <div className="ba" data-ba role="slider" aria-label={b.label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={50} tabIndex={0}>
                  <Image className="ba-after" src={b.after} alt={`${cap} — after`} fill sizes="(max-width:900px) 100vw, 33vw" />
                  <Image className="ba-before" src={b.before} alt={`${cap} — before`} fill sizes="(max-width:900px) 100vw, 33vw" />
                  <span className="lbl l">Before</span>
                  <span className="lbl r">After</span>
                  <div className="ba-handle" aria-hidden="true"><span className="ba-knob">↔</span></div>
                </div>
                <figcaption className="rv-frame-cap"><span className="rv-mono">{cap}</span><span className="rv-mono rv-muted">Drag</span></figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* 8 · Virtual Visit */}
      <section className="rv-band visit-sec rvl" id="virtual-visit" aria-label="Virtual Visit">
        <div className="rv-wrap">
          <div className="rv-head rv-head-split">
            <div><span className="rv-mono rv-k">{VISIT_NAME}</span><h2>Free-roam. <span className="rv-serif">Walk it yourself.</span></h2></div>
            <span className="rv-mono rv-muted">{VISIT_PRICE_LABEL} · paid add-on</span>
          </div>
          <div className="rv-frame rv-visit"><div className="visit-stage"><VirtualVisitEmbed /></div></div>
        </div>
      </section>

      {/* 9 · The desk + quote */}
      <section className="rv-band rv-desk rvl" aria-label="The desk">
        <div className="rv-wrap rv-split">
          <div className="rv-split-l">
            <span className="rv-mono rv-k">Platform</span>
            <h2>One system for <span className="rv-serif">the whole business.</span></h2>
            <p className="rv-muted-p">Desk, field, and media — finally one place. {STATUS.os}</p>
            <blockquote className="rv-quote">
              <p className="rv-serif">“Three spreadsheets and a group text — now one screen.”</p>
              <footer className="rv-mono">Jordan Malcolm · Principal, 47-agent office</footer>
            </blockquote>
            <Link className="rv-textlink" href="/platform">Explore the desk →</Link>
          </div>
          <div className="rv-frame rv-desk-shot"><div className="tray tray-crm"><div className="tray-stage tray-stage-fill"><OsDeskShot /></div></div></div>
        </div>
      </section>

      {/* 10 · Data handling for brokerages */}
      <section className="rv-band rv-data rvl" id="data" aria-label={t.dataTitle}>
        <div className="rv-wrap rv-split">
          <div className="rv-split-l">
            <span className="rv-mono rv-k">{t.dataLabel}</span>
            <h2>How we handle <span className="rv-serif">your data.</span></h2>
            <p className="rv-muted-p">Plain answers for brokerage compliance. Full detail in the <Link href="/privacy">Privacy policy</Link> and <Link href="/dpa">DPA</Link>.</p>
            <div className="rv-cta-row">
              <CtaLink href="/contact" className="rv-btn-ghost" loaderColor="#D2542B">Talk to us</CtaLink>
              <Link className="rv-textlink" href="/dpa">Read the DPA →</Link>
            </div>
          </div>
          <ul className="rv-facts">
            <li><span className="rv-mono rv-k">01 · Residency</span><b>Canadian-hosted core.</b><p>Primary app database, authentication, and file storage run on Supabase in Canada (AWS ca-central-1).</p></li>
            <li><span className="rv-mono rv-k">02 · Law</span><b>PIPEDA-aligned.</b><p>Bricks Group stays accountable under PIPEDA and applicable Ontario privacy rules for what we collect.</p></li>
            <li><span className="rv-mono rv-k">03 · Contract</span><b>A DPA for brokerages.</b><p>A Data Processing Agreement for brokerages, teams, and enterprise clients that process third-party personal data.</p></li>
            <li><span className="rv-mono rv-k">04 · Disclosure</span><b>Named processors.</b><p>Some providers are in the US — e.g. Stripe and Vercel. They are listed in the Privacy policy, not hidden.</p></li>
          </ul>
        </div>
      </section>

      <IntegrationsBand />

      {/* 11 · FAQ */}
      <section className="rv-band rvl" id="faq" aria-label="Frequently asked questions">
        <div className="rv-wrap rv-split">
          <div className="rv-split-l"><span className="rv-mono rv-k">FAQ</span><h2>Questions.</h2></div>
          <div className="rv-faq">
            {faqs.slice(0, 4).map((f) => (
              <details key={f.id}>
                <summary>{f.q}<span aria-hidden className="rv-plus" /></summary>
                <p><FaqAnswer id={f.id} a={f.a} /></p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 12 · Closer */}
      <section className="rv-band rv-closer rvl" id="book" aria-label="Book a shoot">
        <div className="rv-wrap">
          <h2>Ready <span className="rv-serif">when you are.</span></h2>
          <div className="rv-cta-row rv-center">
            <CtaLink href="/book" className="rv-btn-brick">{t.ctaPrimary}</CtaLink>
            <CtaLink href="/contact" className="rv-btn-ghost" loaderColor="#D2542B">{t.ctaSecondary}</CtaLink>
          </div>
          <p className="rv-mono rv-trust rv-center-t">Before Bricks, Raphael shot 14,000+ properties at CoStar · Canada-wide · 24–48h target</p>
        </div>
      </section>

      <NewsletterPopup />
    </div>
  )
}
