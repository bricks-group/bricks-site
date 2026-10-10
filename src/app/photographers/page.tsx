import type { Metadata } from 'next'
import Link from 'next/link'
import RevealObserver from '@/components/RevealObserver'
import PhotographerForm from './PhotographerForm'
import { COVERAGE_LINE, GO_URL, STATUS } from '@/lib/brand'

const OG =
  'https://rbywjnnctjglhcdemnnj.supabase.co/storage/v1/object/public/Bricks%20Images/74E774C6-1524-4287-B115-25CA213E4BBD.PNG'

export const metadata: Metadata = {
  title: 'Real Estate Photographer Jobs Canada | Shoot Listing Photos for Bricks',
  description:
    'Applications open now: join the Bricks Canada-wide real estate photographer network. Auto-routed listing photo jobs, fixed vendor rate card, Stripe Connect payouts. Apply in about 4 minutes. GO is live.',
  alternates: { canonical: '/photographers' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Real Estate Photographer Jobs Canada | Bricks',
    description:
      'Applications open now. Auto-routed listing shoots, fixed rate card, Stripe Connect. Apply in about 4 minutes.',
    images: [OG],
    url: 'https://www.brxs.ca/photographers',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Real Estate Photographer Jobs Canada | Bricks',
    description: 'Applications open now — shoot listing photos Canada-wide. Fixed rate card, Stripe Connect.',
    images: [OG],
  },
}

export default function PhotographersPage() {
  return (
    <>
      <RevealObserver />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'JobPosting',
            datePosted: '2026-08-13',
            title: 'Real Estate Photographer / Videographer — Independent Contractor (Canada)',
            description:
              'Applications are open now — not launching soon. Auto-routed real estate listing photo and video shoots across Canada. Paid via Stripe Connect on a fixed vendor rate card. Apply in about four minutes. GO field app is live on the web.',
            hiringOrganization: {
              '@type': 'Organization',
              name: 'Bricks',
              legalName: 'Bricks Group',
              sameAs: 'https://www.brxs.ca/',
              url: 'https://www.brxs.ca/photographers',
            },
            employmentType: 'CONTRACTOR',
            jobLocationType: 'TELECOMMUTE',
            applicantLocationRequirements: { '@type': 'Country', name: 'Canada' },
            jobLocation: { '@type': 'Place', address: { '@type': 'PostalAddress', addressCountry: 'CA' } },
            directApply: true,
            industry: 'Real estate photography',
            occupationalCategory: 'Real Estate Photographer',
            baseSalary: {
              '@type': 'MonetaryAmount',
              currency: 'CAD',
              value: {
                '@type': 'QuantitativeValue',
                minValue: 55.15,
                maxValue: 578.90,
                unitText: 'PACKAGE PAYOUT',
              },
            },
            validThrough: '2027-09-12',
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'Are photographer applications open?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Yes. Applications are open now Canada-wide. There is no launching-soon waitlist — submit the form on this page and expect a manual review in 1–3 business days.',
                },
              },
              {
                '@type': 'Question',
                name: 'How are real estate photographers paid?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Independent contractors are paid a published fixed dollar rate card via Stripe Connect — not a percent of the client fee.',
                },
              },
              {
                '@type': 'Question',
                name: 'Do I need drone certification?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'For aerial listing jobs, yes — Transport Canada Advanced RPAS certification is required before we route commercial drone work.',
                },
              },
            ],
          }),
        }}
      />

      <section className="hero">
        <div className="wrap">
          <span className="badge">Photographers</span>
          <h1>Real estate photographer jobs — Canada.<br />Applications open now.</h1>
          <p className="sub">Shoot listing photos on a fixed dollar rate card. Auto-routed jobs in GO. Stripe Connect payouts. Apply in about four minutes — not a waitlist. {STATUS.go} {COVERAGE_LINE}</p>
          <div className="cta-row">
            <a className="btn btn-brick" href="#apply">Apply in 4 minutes →</a>
            <a className="btn btn-sec" href={GO_URL} rel="noopener noreferrer">Open GO</a>
            <Link className="btn btn-sec" href="/real-estate-photography">Listing photos product</Link>
          </div>
        </div>
      </section>

      <div className="wrap">
        <section className="block rvl">
          <div className="sec-head">
            <div>
              <span className="over">How it works</span>
              <h2>GO, the field app.</h2>
            </div>
          </div>
          <div className="incl">
            <div className="c rvl"><span className="ic">01</span><h4>Auto-routed jobs</h4><p>Paid bookings auto-route into GO by specialty, tier, and proximity — no bidding.</p></div>
            <div className="c rvl"><span className="ic">02</span><h4>You set availability</h4><p>Accept or decline any job. Declining is not a breach. Routing may still consider your availability and history.</p></div>
            <div className="c rvl"><span className="ic">03</span><h4>Stripe Connect payouts</h4><p>No invoicing, no chasing clients — paid automatically per completed job.</p></div>
            <div className="c rvl"><span className="ic">04</span><h4>No-show protection</h4><p>Inaccessible property or a client no-show reported in-app qualifies for the standard trip fee.</p></div>
          </div>
        </section>

        <section className="block rvl" id="payouts" aria-label="Vendor rate card">
          <div className="sec-head">
            <div>
              <span className="over">Vendor rate card</span>
              <h2>Fixed package payouts.</h2>
            </div>
          </div>
          <p className="rate-lead">Photographers are independent contractors, paid a published dollar rate card — not a percent of what the client paid. Tiers C / B / A are assigned by Bricks on quality, reliability, volume, and compliance; the full card lives in the contractor agreement after you apply. Virtual visit is a client add-on at $249 / $299 / $349 / $399 — never packaged.</p>
          <div className="adds">
            <div className="a rvl"><div className="nm">Tier 1 — Entry</div><p>Starting tier. Assigned by Bricks based on quality, reliability, volume, and compliance.</p></div>
            <div className="a rvl"><div className="nm">Tier 2 — Core</div><p>Assigned for consistent quality and reliability on the network.</p></div>
            <div className="a rvl"><div className="nm">Tier 3 — Elite</div><p>Highest assigned tier for quality, volume, and compliance.</p></div>
          </div>
          <p className="note">Canada-wide recruiting. Payout is the published rate-card amount. Virtual visit is a client add-on at $249 / $299 / $349 / $399 — never packaged.</p>
        </section>

        <section className="block rvl">
          <div className="sec-head">
            <div>
              <span className="over">Before you apply</span>
              <h2>What to expect.</h2>
            </div>
          </div>
          <div className="faq">
            <div className="qa"><h4>How long does review take?</h4><p>We review every application manually. Portfolio quality is the primary gate — sharp composition, accurate colour, consistent exposure across a full property set. Expect a response within 1–3 business days.</p></div>
            <div className="qa"><h4>What equipment do I need?</h4><p>Full-frame or equivalent, fast primes, and ideally a DJI/Autel drone if you&apos;re applying for aerial work. List your kit in the application.</p></div>
            <div className="qa"><h4>Do I need drone certification?</h4><p>For aerial jobs, yes — controlled airspace near Pearson / Billy Bishop requires Transport Canada Advanced RPAS certification. We verify before routing any drone job.</p></div>
            <div className="qa"><h4>Am I an employee?</h4><p>No — you&apos;re an independent contractor under Ontario law, contracting with Bricks Group. You control equipment, methods, and availability.</p></div>
          </div>
        </section>

        <section className="block rvl">
          <div className="prose rvl">
            <p>
              Agents book listing photos on <Link href="/book">/book</Link>. Product overview:{' '}
              <Link href="/real-estate-photography">real estate photography</Link>. Cost guides:{' '}
              <Link href="/blog/canada-real-estate-photography-cost-2026">Canada</Link> ·{' '}
              <Link href="/blog/gta-real-estate-media-cost-2026">GTA</Link>.
            </p>
          </div>
        </section>

        <section className="block rvl" id="apply">
          <div className="sec-head">
            <div>
              <span className="over">Join the network</span>
              <h2>Application — open now.</h2>
            </div>
            <p>Takes about 4 minutes. We review every application manually. Not a waitlist.</p>
          </div>
          <PhotographerForm />
        </section>
      </div>

      <style>{`
        .sec-head{min-width:0;}
        .sec-head > div{min-width:0;max-width:100%;}
        .sec-head h2{white-space:normal;overflow:visible;overflow-wrap:break-word;}
        .rate-lead{font-size:15px;color:var(--inkSoft);line-height:1.6;max-width:640px;margin:0 0 22px;}
        .adds{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--hair);border:1px solid var(--hair);border-radius:2px;}
        .adds .a{background:var(--paper);padding:26px 24px;}
        .adds .a .nm{font-weight:500;font-size:16px;color:var(--ink);margin-bottom:8px;}
        .adds .a p{font-size:12.5px;color:var(--inkMute);line-height:1.45;}
        @media (max-width:720px){
          .sec-head{flex-direction:column;align-items:flex-start;}
          .adds{grid-template-columns:1fr;}
        }
      `}</style>
    </>
  )
}

