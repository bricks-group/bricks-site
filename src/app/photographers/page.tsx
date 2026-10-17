import type { Metadata } from 'next'
import Link from 'next/link'
import RevealObserver from '@/components/RevealObserver'
import PhotographerForm from './PhotographerForm'
import { COVERAGE_LINE, GO_URL, STATUS } from '@/lib/brand'
import { ORG_ID } from '@/lib/schema'

const OG =
  'https://rbywjnnctjglhcdemnnj.supabase.co/storage/v1/object/public/Bricks%20Images/74E774C6-1524-4287-B115-25CA213E4BBD.PNG'

export const metadata: Metadata = {
  title: 'Real Estate Photographer Jobs Canada | Shoot Listing Photos for Bricks',
  description:
    'Shoot listings for Bricks across Canada. Jobs come to you in the Bricks app at a fixed rate per job, with automatic payouts. Apply in about four minutes.',
  alternates: { canonical: '/photographers' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Real Estate Photographer Jobs Canada | Bricks',
    description:
      'Shoot listings across Canada at a fixed rate per job. Apply in about four minutes.',
    images: [OG],
    url: 'https://www.brxs.ca/photographers',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Real Estate Photographer Jobs Canada | Bricks',
    description: 'Shoot listings across Canada at a fixed rate per job.',
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
              'Applications are open now — not launching soon. Auto-routed real estate listing photo and video shoots across Canada. Paid via Stripe Connect on a fixed vendor rate card. Apply in about four minutes. The Bricks app for photographers is live on the web.',
            hiringOrganization: {
              '@type': 'Organization',
              '@id': ORG_ID,
              name: 'Bricks',
              sameAs: 'https://www.brxs.ca/',
              logo: 'https://www.brxs.ca/bricks-mark.png',
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
          <h1>Real estate photographer jobs across Canada.</h1>
          <p className="sub">Shoot listings for a fixed rate per job. Jobs come to you in the Bricks app, and you&apos;re paid automatically.</p>
          <div className="cta-row">
            <a className="btn btn-brick" href="#apply">Apply in 4 minutes →</a>
            <a className="btn btn-sec" href={GO_URL} rel="noopener noreferrer">Open the Bricks app</a>
          </div>
        </div>
      </section>

      <div className="wrap">
        <section className="block rvl">
          <div className="sec-head">
            <div>
              <span className="over">How it works</span>
              <h2>Jobs come to you.</h2>
            </div>
          </div>
          <div className="incl">
            <div className="c rvl"><span className="ic">01</span><h4>No bidding</h4><p>Paid bookings are sent to you in the Bricks app based on specialty, tier and distance.</p></div>
            <div className="c rvl"><span className="ic">02</span><h4>You set availability</h4><p>Accept or decline any job. Declining is never a breach of contract.</p></div>
            <div className="c rvl"><span className="ic">03</span><h4>Automatic payouts</h4><p>Paid for every completed job. No invoices, no chasing clients.</p></div>
            <div className="c rvl"><span className="ic">04</span><h4>No-show protection</h4><p>If you can&apos;t get in or the client doesn&apos;t show, report it in the app and get the standard trip fee.</p></div>
          </div>
        </section>

        <section className="block rvl" id="payouts" aria-label="Vendor rate card">
          <div className="sec-head">
            <div>
              <span className="over">Pay</span>
              <h2>Fixed pay per job.</h2>
            </div>
          </div>
          <p className="rate-lead">You earn a set dollar amount per job, not a percentage of what the client pays. Full rates are in the contractor agreement.</p>
          <div className="adds">
            <div className="a rvl"><div className="nm">Tier 1 — Entry</div><p>The starting tier.</p></div>
            <div className="a rvl"><div className="nm">Tier 2 — Core</div><p>For consistent quality and reliability.</p></div>
            <div className="a rvl"><div className="nm">Tier 3 — Elite</div><p>Our highest tier, for top quality, volume and compliance. Needs $2M+ verified drone insurance and unlocks builder site jobs.</p></div>
          </div>
          <p className="note">Tiers are set by Bricks based on quality, reliability, volume and compliance.</p>
        </section>

        <section className="block rvl" aria-label="Commercial site work">
          <div className="sec-head">
            <div>
              <span className="over">Tier 3</span>
              <h2>Builder &amp; developer jobs pay at the top of Tier 3.</h2>
            </div>
          </div>
          <p className="rate-lead">Construction site jobs go only to Tier 3 pilots with Advanced RPAS and verified drone liability insurance of at least $2M ($5M on some sites). Upload your certificate in the Bricks app.</p>
          <div className="adds">
            <div className="a rvl"><div className="nm">Progress visit — $185</div><p>Drone photos and video of the site.</p></div>
            <div className="a rvl"><div className="nm">Mapped capture — $735</div><p>A mapping flight for an orthomosaic and 3D model. Unlocked after a test mission.</p></div>
            <div className="a rvl"><div className="nm">Mapping setup — +$315</div><p>Ground control for the first mapped flight on a site.</p></div>
          </div>
          <p className="note" data-legal-review="true">Draft — needs legal review before publishing. The commercial insurance requirement is set out in a Commercial Work Addendum to the contractor agreement; listing jobs do not require insurance.</p>
        </section>

        <section className="block rvl">
          <div className="sec-head">
            <div>
              <span className="over">Before you apply</span>
              <h2>What to expect.</h2>
            </div>
          </div>
          <div className="faq">
            <div className="qa"><h4>How long does review take?</h4><p>We review every application by hand, mostly on portfolio quality. Expect a reply within 1–3 business days.</p></div>
            <div className="qa"><h4>What equipment do I need?</h4><p>A full-frame camera or equivalent, fast primes, and a DJI or Autel drone for aerial work. List your kit in the form.</p></div>
            <div className="qa"><h4>Do I need drone certification?</h4><p>For aerial jobs, yes. You need Transport Canada Advanced RPAS certification, and we check it before sending you drone work.</p></div>
            <div className="qa"><h4>Do I need insurance?</h4><p>Not for listing jobs. For builder &amp; developer site jobs, and to hold Tier 3, yes: drone liability of at least $2M on a certificate Bricks verifies. <em>(Draft — needs legal review.)</em></p></div>
            <div className="qa"><h4>Am I an employee?</h4><p>No. You&apos;re an independent contractor with Bricks Group under Ontario law, in control of your equipment, methods and availability.</p></div>
          </div>
        </section>

        <section className="block rvl" id="apply">
          <div className="sec-head">
            <div>
              <span className="over">Apply</span>
              <h2>Join the network.</h2>
            </div>
            <p>Takes about four minutes.</p>
          </div>
          <PhotographerForm />
        </section>
      </div>

      <style>{`
        .sec-head{min-width:0;}
        .sec-head > div{min-width:0;max-width:100%;}
        .sec-head h2{white-space:normal;overflow:visible;overflow-wrap:break-word;}
        .rate-lead{font-size:15px;color:var(--inkSoft);line-height:1.6;max-width:640px;margin:0 0 24px;}
        .adds{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--hair);border:1px solid var(--hair);border-radius:2px;}
        .adds .a{background:var(--paper);padding:var(--card-pad);}
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

