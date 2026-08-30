import type { Metadata } from 'next'
import PhotographerForm from './PhotographerForm'

export const metadata: Metadata = {
  title: 'Shoot for Bricks | Photographer & videographer network — GTA',
  description: 'Join the Bricks photographer network — launching soon. Auto-routed listing shoots, paid via Stripe Connect, no invoicing. Planned tier payouts: Tier C starts at 35% of job revenue, Tier A earns 55%. Apply in about 4 minutes.',
  alternates: { canonical: '/photographers' },
  openGraph: {
    title: 'Shoot for Bricks | Photographer & videographer network',
    description: 'Auto-routed listing shoots, paid via Stripe Connect. Planned tier payouts: Tier C starts at 35% of job revenue, Tier A earns 55%.',
  },
  twitter: {
    title: 'Shoot for Bricks | Photographer & videographer network',
    description: 'Auto-routed listing shoots, paid via Stripe Connect. Apply in about 4 minutes.',
  },
}

export default function PhotographersPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'JobPosting',
            datePosted: '2026-08-13',
            title: 'Real Estate Photographer / Videographer — Independent Contractor',
            description: 'Auto-routed real estate listing shoots across the GTA. Paid via Stripe Connect, planned tier-based payout 35-55% of job revenue. Network launching soon.',
            hiringOrganization: { '@type': 'Organization', name: 'Bricks', sameAs: 'https://www.brxs.ca/' },
            employmentType: 'CONTRACTOR',
            jobLocationType: 'HYBRID',
            applicantLocationRequirements: { '@type': 'Country', name: 'Canada' },
            baseSalary: {
              '@type': 'MonetaryAmount',
              currency: 'CAD',
              value: {
                '@type': 'QuantitativeValue',
                minValue: 35,
                maxValue: 55,
                unitText: 'PERCENT',
              },
            },
            validThrough: '2027-08-13',
          }),
        }}
      />

      <div className="wrap">
        <section className="hero">
          <span className="badge">Photographers</span>
          <h1>Shoot listings.<br />Get paid fast.</h1>
          <p className="sub">When the network launches, jobs will be auto-routed to your phone. You shoot, upload, and get paid via Stripe Connect — no invoicing, no chasing. Planned tier payouts: Tier C starts at 35% of job revenue; Tier A specialists earn 55%.</p>
          <div className="cta-row">
            <a className="btn btn-brick" href="#apply">Apply in 4 minutes →</a>
            <a className="btn btn-sec" href="#payouts">See tier payouts</a>
          </div>
        </section>
      </div>

      <div className="wrap">
        <section className="block">
          <div className="sec-head">
            <div>
              <span className="over">How it works</span>
              <h2>You shoot. We handle the rest.</h2>
              <p className="sub" style={{ marginTop: 10 }}>The Dispatch network is launching soon — apply now to be in the first cohort.</p>
            </div>
          </div>
          <div className="incl">
            <div className="c rvl"><span className="ic">01</span><h4>Auto-routed jobs</h4><p>When live, jobs will land on your phone based on specialty, tier, and proximity — no bidding.</p></div>
            <div className="c rvl"><span className="ic">02</span><h4>You set availability</h4><p>Accept or decline any job. Declining never affects your account standing.</p></div>
            <div className="c rvl"><span className="ic">03</span><h4>Stripe Connect payouts</h4><p>No invoicing, no chasing clients — paid automatically per completed job.</p></div>
            <div className="c rvl"><span className="ic">04</span><h4>No-show protection</h4><p>Inaccessible property or client? Report it in-app for a $60 trip fee — you&apos;re not penalised.</p></div>
          </div>
        </section>
      </div>

      <div className="wrap">
        <section className="block" id="payouts">
          <div className="sec-head">
            <div>
              <span className="over">Tier payouts</span>
              <h2>Better work, better rate.</h2>
            </div>
            <p>Tier advances are based on quality score, on-time rate, and job count.</p>
          </div>
          <div className="adds">
            <div className="a rvl"><div className="nm">Tier C — Entry</div><div className="pr">35%</div><p>Standard routing. Where every photographer starts.</p></div>
            <div className="a rvl"><div className="nm">Tier B — Core</div><div className="pr">45%</div><p>Standard + Premium routing once quality and reliability are proven.</p></div>
            <div className="a rvl"><div className="nm">Tier A — Elite</div><div className="pr">55%</div><p>Full routing across Standard, Premium, Luxury, and Estate. At launch, a Standard shoot is planned to pay $164–$302.</p></div>
          </div>
          <p className="note" style={{ marginTop: 26 }}>Coverage area: GTA · Hamilton · Durham · York · Niagara. Payout is always computed on rack price — never a discounted customer rate.</p>
        </section>
      </div>

      <div className="wrap">
        <section className="block">
          <div className="sec-head">
            <div>
              <span className="over">Before you apply</span>
              <h2>What to expect.</h2>
            </div>
          </div>
          <div className="faq">
            <div className="qa"><h4>How long does review take?</h4><p>We review every application manually. Portfolio quality is the primary gate — sharp composition, accurate colour, consistent exposure across a full property set. Expect a response within 1–3 business days.</p></div>
            <div className="qa"><h4>What equipment do I need?</h4><p>Full-frame or equivalent, fast primes, and ideally a DJI/Autel drone if you&apos;re applying for aerial work. List your kit in the application.</p></div>
            <div className="qa"><h4>Do I need drone certification?</h4><p>For aerial jobs, yes — GTA controlled airspace (Pearson / Billy Bishop) requires Transport Canada Advanced RPAS certification. We verify before routing any drone job.</p></div>
            <div className="qa"><h4>Am I an employee?</h4><p>No — you&apos;re an independent contractor under Ontario law. You control your equipment, shooting style, and schedule; you&apos;re responsible for your own taxes and insurance.</p></div>
          </div>
        </section>
      </div>

      <div className="wrap">
        <section className="block" id="apply">
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
        .incl{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:var(--hair);border:1px solid var(--hair);border-radius:2px;margin-top:4px;}
        .incl .c{background:var(--paper);padding:22px 22px;}
        .incl .c h4{font-weight:500;font-size:15px;color:var(--ink);margin-bottom:6px;}
        .incl .c p{font-size:12.5px;color:var(--ink-3);line-height:1.45;}
        .incl .c .ic{font-family:'Ioskeley Mono',monospace;font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--brick-deep);display:block;margin-bottom:8px;}
        .adds{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--hair);border:1px solid var(--hair);border-radius:2px;margin-top:4px;}
        .adds .a{background:var(--paper);padding:22px 22px;}
        .adds .a .nm{font-weight:500;font-size:16px;color:var(--ink);}
        .adds .a .pr{font-family:'Ioskeley Mono',monospace;font-size:20px;color:var(--brick-deep);margin:8px 0 6px;}
        .adds .a p{font-size:12.5px;color:var(--ink-3);line-height:1.45;}
        @media (max-width:680px){.incl,.adds{grid-template-columns:1fr;}}
      `}</style>
    </>
  )
}
