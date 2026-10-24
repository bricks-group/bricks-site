import type { Metadata } from 'next'
import Link from 'next/link'
import RevealObserver from '@/components/RevealObserver'
import PlanGrid from './PlanGrid'
import { CORE_FROM, STORY_FROM, SHOWCASE_FROM, FULL_FROM, PHOTO_ONLY_FROM } from '@/lib/pricing'
import { OFFICE_PLANS, OFFICE_INCLUDES, ADDONS, SOFTWARE_PRICES, OFFICE_SEAT_PRICE_PER_YEAR } from '@/lib/catalog'
import { PER_VISIT, PLANS, fmt } from '@/lib/commercial'
import { Head, Rows, Close } from '@/components/calm/Calm'
import { mediaServiceSchema, osSoftwareApplicationSchema, type MediaOfferId } from '@/lib/schema'

const SIGNUP = 'https://app.brxs.ca/login'
const PLAN_FROM = SOFTWARE_PRICES.keystone.monthly
const SEAT_FROM = OFFICE_SEAT_PRICE_PER_YEAR.franchise

export const metadata: Metadata = {
  title: 'Pricing: Software Plans, Brokerage Seats and Listing Media | Bricks',
  description:
    `Bricks is free to start. Paid plans from $${PLAN_FROM} a month, or yearly with two months free. Brokerage seats from $${SEAT_FROM} a year. Listing media from $${CORE_FROM} and site visits from ${fmt(PER_VISIT[0].price)}, booked inside. CAD.`,
  alternates: { canonical: '/pricing' },
  openGraph: {
    title: 'Pricing | Bricks',
    description: `Free to start. Paid plans from $${PLAN_FROM} a month. Brokerage seats, listing media and site visits, priced plainly.`,
    url: 'https://www.brxs.ca/pricing',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pricing | Bricks',
    description: `Free to start. Paid plans from $${PLAN_FROM} a month. Media and site visits booked inside.`,
  },
}

/** Media offers whose "from" prices this page renders. */
const PRICING_PAGE_OFFERS: readonly MediaOfferId[] = ['photos_only', 'essentials', 'story', 'showcase', 'suite']

const ADDON_LINE = ADDONS.map((a) => `${a.name.replace(/^AI /, '').replace('Document Drafter', 'document drafter').replace('Listing Copy', 'listing copy')} ${a.price.replace(' / mo', '')}`).join(', ')

const FAQ = [
  {
    q: 'Do plans include media?',
    a: 'No. Listing media and site visits are priced per job on every plan, including Clay. You see the full price before you pay.',
  },
  {
    q: 'Can I change or cancel my plan?',
    a: 'Yes, from Billing in the app. Cancelling stops the next charge, and you keep access until the end of the period you paid for.',
  },
  {
    q: 'What if I cancel a shoot?',
    a: 'More than 24 hours before the shoot window, you get a full refund. Inside 24 hours, or on a no-show, there is no refund. There are no other fees.',
  },
  {
    q: 'Where do you work?',
    a: 'Our base is Ontario’s Golden Horseshoe. Elsewhere in Canada, enter the address and we confirm coverage and travel before you pay.',
  },
] as const

export default function PricingPage() {
  return (
    <>
      <RevealObserver />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(mediaServiceSchema({ url: 'https://www.brxs.ca/pricing', offers: PRICING_PAGE_OFFERS })) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(osSoftwareApplicationSchema('https://www.brxs.ca/pricing')) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
          }),
        }}
      />

      <section className="hero">
        <div className="wrap">
          <h1>Pricing.</h1>
          <p className="sub">Start free on Bricks. Upgrade when it pays. Media and site visits are booked inside, priced per job.</p>
          <div className="pr-cta">
            <a className="btn btn-night btn-primary" href={SIGNUP}>Try Bricks free</a>
          </div>
        </div>
      </section>

      <section className="cm-sec pr-first" aria-label="Software plans">
        <Head title="Software plans." lede="Clay is free, with no card: your listing file, transactions and MLS." />
        <PlanGrid signup={SIGNUP} />
        <p className="cm-note">
          On Keystone or Marble, add AI by the month: {ADDON_LINE}. Teams share one plan and aren’t charged per agent. Prices in CAD, plus HST. Billing, renewal and refunds follow the <Link href="/terms#plans">software plan terms</Link>.
        </p>
      </section>

      <section className="cm-sec rvl" aria-label="Brokerage seats">
        <Head title="Brokerages, per seat." lede={OFFICE_INCLUDES} link={{ href: '/brokerage', label: 'For brokerages' }} />
        <Rows items={OFFICE_PLANS.map((p) => ({ title: p.name, detail: p.seats, value: `$${p.seatPricePerYear} / yr or $${p.seatPricePerMonth} / mo` }))} />
        <p className="cm-note">Per seat. Yearly, or monthly at 25% more with no lock-in.</p>
      </section>

      <section className="cm-sec rvl" aria-label="Listing media">
        <Head title="Listing media." lede="Booked inside Bricks. Prices start with smaller homes and scale with size." link={{ href: '/book', label: 'Book media' }} />
        <Rows
          items={[
            { title: 'Photos only', detail: 'HDR photos.', value: `from $${PHOTO_ONLY_FROM}`, href: '/book' },
            { title: 'Essentials', detail: 'HDR photos, licensed drone and a floor plan.', value: `from $${CORE_FROM}`, href: '/book' },
            { title: 'Story', detail: 'Essentials, plus a cinematic reel.', value: `from $${STORY_FROM}`, href: '/book' },
            { title: 'Showcase', detail: 'Story, plus a virtual tour.', value: `from $${SHOWCASE_FROM}`, href: '/book' },
            { title: 'Full suite', detail: 'Showcase, plus a twilight exterior.', value: `from $${FULL_FROM}`, href: '/book' },
          ]}
        />
        <p className="cm-note">Travel: the first 25 km from the photographer are free, then $0.75/km, shown before you pay.</p>
      </section>

      <section className="cm-sec rvl" aria-label="Site Progress">
        <Head title="Site Progress." lede="Scheduled drone visits for builders, per visit or per site each month." link={{ href: '/book/site', label: 'Book a site visit' }} />
        <Rows
          items={[
            { title: PER_VISIT[0].name, detail: 'Dated drone photos and video.', value: fmt(PER_VISIT[0].price), href: '/book/site' },
            { title: PER_VISIT[1].name, detail: 'Orthomosaic and 3D model.', value: fmt(PER_VISIT[1].price), href: '/book/site' },
            { title: 'Monthly plans', detail: 'Visual or mapped, monthly to weekly.', value: `from ${fmt(PLANS[0].rows[0].price)} / site / mo`, href: '/builders' },
          ]}
        />
      </section>

      <section className="cm-sec rvl" aria-label="Questions">
        <Head title="Questions." />
        <div className="faq">
          {FAQ.map((f) => (
            <div className="qa" key={f.q}><h4>{f.q}</h4><p>{f.a}</p></div>
          ))}
        </div>
      </section>

      <Close title="Start free. Upgrade when it pays." href={SIGNUP} label="Try Bricks free" external primary={false} />

      <style>{`
        .pr-cta{margin-top:28px;}
        .pr-first{padding-top:24px;}
        .pg-switch{display:inline-flex;border:1px solid var(--vs-rule-strong,#d6d3cd);border-radius:999px;padding:3px;margin:0 0 24px;}
        .pg-switch button{border:0;background:transparent;font:inherit;font-size:var(--vs-fs-small,14px);color:var(--vs-fg);padding:8px 16px;border-radius:999px;cursor:pointer;white-space:nowrap;}
        .pg-switch button.on{background:var(--vs-fg);color:var(--vs-bg,#fff);}
        .pg-cards{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;}
        .pg-card{border:var(--vs-hair,1px solid #e5e2dc);padding:24px;display:flex;flex-direction:column;min-width:0;}
        .pg-card h3{font-size:var(--vs-fs-body,17px);font-weight:500;margin:0 0 12px;color:var(--vs-fg);}
        .pg-price{margin:0;display:flex;align-items:baseline;gap:6px;}
        .pg-fig{font-family:var(--vs-mono);font-size:clamp(28px,2vw + 16px,38px);letter-spacing:-.02em;color:var(--vs-fg);font-variant-numeric:tabular-nums;}
        .pg-per{font-size:var(--vs-fs-small,14px);color:var(--vs-fg-3);}
        .pg-alt{font-size:var(--vs-fs-small,14px);color:var(--vs-fg-3);margin:6px 0 20px;}
        .pg-base{font-size:var(--vs-fs-small,14px);color:var(--vs-fg-2);margin:0 0 8px;}
        .pg-adds{list-style:none;margin:0 0 24px;padding:0;flex:1;}
        .pg-adds li{font-size:var(--vs-fs-small,14px);color:var(--vs-fg);padding:6px 0;border-top:var(--vs-hair,1px solid #e5e2dc);}
        .pg-cta{align-self:flex-start;background:transparent!important;color:var(--vs-fg)!important;border:1px solid var(--vs-fg)!important;}
        @media (max-width:860px){.pg-cards{grid-template-columns:1fr;}}
      `}</style>
    </>
  )
}
