import type { Metadata } from 'next'
import RevealObserver from '@/components/RevealObserver'
import PhotographerForm from './PhotographerForm'
import { COVERAGE_LINE } from '@/lib/brand'

export const metadata: Metadata = {
  title: 'Shoot for Bricks | Photographer & videographer network — Canada',
  description: 'Apply to join the Bricks photographer network. Auto-routed listing shoots, paid via Stripe Connect on a fixed vendor rate card. Apply in about 4 minutes. GO field app is not in any store yet.',
  alternates: { canonical: '/photographers' },
  openGraph: {
    title: 'Shoot for Bricks | Photographer & videographer network',
    description: 'Auto-routed listing shoots, paid via Stripe Connect on a fixed vendor rate card. Apply in about 4 minutes.',
  },
  twitter: {
    title: 'Shoot for Bricks | Photographer & videographer network',
    description: 'Auto-routed listing shoots, paid via Stripe Connect. Apply in about 4 minutes.',
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
            title: 'Real Estate Photographer / Videographer — Independent Contractor',
            description: 'Auto-routed real estate listing shoots in Canada. Paid via Stripe Connect on a fixed vendor rate card. Applications open now.',
            hiringOrganization: { '@type': 'Organization', name: 'Bricks', legalName: 'Bricks Group', sameAs: 'https://www.brxs.ca/' },
            employmentType: 'CONTRACTOR',
            jobLocationType: 'HYBRID',
            applicantLocationRequirements: { '@type': 'Country', name: 'Canada' },
            baseSalary: {
              '@type': 'MonetaryAmount',
              currency: 'CAD',
              value: {
                '@type': 'QuantitativeValue',
                minValue: 104.65,
                maxValue: 1374.45,
                unitText: 'PACKAGE PAYOUT',
              },
            },
            validThrough: '2027-08-13',
          }),
        }}
      />

      <section className="hero">
        <div className="wrap">
          <span className="badge">Photographers</span>
          <h1>GO. Shoot listings.<br />Get paid fast.</h1>
          <p className="sub">Independent contractors on a fixed dollar rate card. Auto-routed jobs in GO. Stripe Connect payouts. Apply in about four minutes.</p>
          <div className="cta-row">
            <a className="btn btn-brick" href="#apply">Apply in 4 minutes →</a>
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
            <div className="c rvl"><span className="ic">01</span><h4>Auto-routed jobs</h4><p>When live, jobs will land on your phone based on specialty, tier, and proximity — no bidding.</p></div>
            <div className="c rvl"><span className="ic">02</span><h4>You set availability</h4><p>Accept or decline any job. Declining is not a breach. Routing may still consider your availability and history.</p></div>
            <div className="c rvl"><span className="ic">03</span><h4>Stripe Connect payouts</h4><p>No invoicing, no chasing clients — paid automatically per completed job.</p></div>
            <div className="c rvl"><span className="ic">04</span><h4>No-show protection</h4><p>Inaccessible property or a client no-show reported in-app may qualify for the published trip fee then in effect.</p></div>
          </div>
        </section>

        <section className="block rvl" id="payouts" aria-label="Vendor rate card">
          <div className="sec-head">
            <div>
              <span className="over">Vendor rate card</span>
              <h2>Fixed package payouts.</h2>
            </div>
          </div>
          <p className="rate-lead">Photographers are independent contractors, paid a published dollar rate card — not a percent of what the client paid. Tiers C / B / A are assigned by Bricks on quality, reliability, volume, and compliance; the full card lives in the contractor agreement after you apply. Virtual visit is a client add-on quoted by sqft — never packaged.</p>
          <div className="adds">
            <div className="a rvl"><div className="nm">Tier C — Entry</div><p>Starting tier. Assigned by Bricks based on quality, reliability, volume, and compliance.</p></div>
            <div className="a rvl"><div className="nm">Tier B — Core</div><p>Assigned for consistent quality and reliability on the network.</p></div>
            <div className="a rvl"><div className="nm">Tier A — Elite</div><p>Highest assigned tier for quality, volume, and compliance.</p></div>
          </div>
          <p className="note">{COVERAGE_LINE} Payout is the published rate-card amount. Virtual visit is a client add-on, quoted by sqft — never packaged.</p>
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
            <div className="qa"><h4>Am I an employee?</h4><p>No — you&apos;re an independent contractor under Ontario law, contracting with Bricks Group. You control equipment, methods, and availability. Insurance and WSIB proof are required before a first dispatched job — see the IC agreement.</p></div>
          </div>
        </section>

        <section className="block rvl" id="apply">
          <div className="sec-head">
            <div>
              <span className="over">Join the network</span>
              <h2>Application.</h2>
            </div>
            <p>Takes about 4 minutes. We review every application manually.</p>
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
