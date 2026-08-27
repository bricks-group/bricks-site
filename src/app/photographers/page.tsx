import type { Metadata } from 'next'
import PhotographerForm from './PhotographerForm'

export const metadata: Metadata = {
  title: 'Shoot for Bricks | Photographer & videographer network — Canada',
  description: 'Join the Bricks photographer network — launching soon. Auto-routed listing shoots, paid via Stripe Connect on a fixed vendor rate card. Apply in about 4 minutes.',
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'JobPosting',
            datePosted: '2026-08-13',
            title: 'Real Estate Photographer / Videographer — Independent Contractor',
            description: 'Auto-routed real estate listing shoots in Canada. Paid via Stripe Connect on a fixed vendor rate card. Network launching soon.',
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

      <div className="wrap">
        <section className="hero">
          <span className="badge">Photographers</span>
          <h1>Shoot listings.<br />Get paid fast.</h1>
          <p className="sub">When the network launches, jobs will be auto-routed to your phone. You shoot, upload, and get paid via Stripe Connect — no invoicing, no chasing. Package payouts are a fixed vendor rate card by package, size band, and tier. Add-ons pay at 35% / 45% / 55% of add-on rack for Tier C / B / A.</p>
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
            <div className="c rvl"><span className="ic">02</span><h4>You set availability</h4><p>Accept or decline any job. Declining is not a breach. Routing may still consider your availability and history.</p></div>
            <div className="c rvl"><span className="ic">03</span><h4>Stripe Connect payouts</h4><p>No invoicing, no chasing clients — paid automatically per completed job.</p></div>
            <div className="c rvl"><span className="ic">04</span><h4>No-show protection</h4><p>Inaccessible property or a client no-show reported in-app may qualify for the published trip fee then in effect.</p></div>
          </div>
        </section>
      </div>

      <div className="wrap">
        <section className="block" id="payouts">
          <div className="sec-head">
            <div>
              <span className="over">Vendor rate card</span>
              <h2>Fixed package payouts.</h2>
            </div>
            <p>CAD, exclusive of HST, shown as Tier C / Tier B / Tier A. Package payouts do not change based on what the client was charged. Add-ons use your tier percentage of add-on rack: C 35% · B 45% · A 55%.</p>
          </div>
          <div className="rate-wrap">
            <table className="rate-table">
              <thead>
                <tr><th>Package</th><th>Tier C</th><th>Tier B</th><th>Tier A</th></tr>
              </thead>
              <tbody>
                <tr><td>Standard · under 2,000 sqft</td><td>$104.65</td><td>$134.55</td><td>$164.45</td></tr>
                <tr><td>Standard · 2,000–3,499</td><td>$132.65</td><td>$170.55</td><td>$208.45</td></tr>
                <tr><td>Standard · 3,500–4,999</td><td>$164.15</td><td>$211.05</td><td>$257.95</td></tr>
                <tr><td>Standard · 5,000+</td><td>$174.65</td><td>$224.55</td><td>$274.45</td></tr>
                <tr><td>Premium · under 2,000</td><td>$209.65</td><td>$269.55</td><td>$329.45</td></tr>
                <tr><td>Premium · 2,000–3,499</td><td>$262.15</td><td>$337.05</td><td>$411.95</td></tr>
                <tr><td>Premium · 3,500–4,999</td><td>$314.64</td><td>$404.55</td><td>$494.45</td></tr>
                <tr><td>Premium · 5,000+</td><td>$367.15</td><td>$472.05</td><td>$576.95</td></tr>
                <tr><td>Luxury · under 2,000</td><td>$402.15</td><td>$517.05</td><td>$631.95</td></tr>
                <tr><td>Luxury · 2,000–3,499</td><td>$419.65</td><td>$539.55</td><td>$659.45</td></tr>
                <tr><td>Luxury · 3,500–4,999</td><td>$524.65</td><td>$674.55</td><td>$824.45</td></tr>
                <tr><td>Luxury · 5,000+</td><td>$664.65</td><td>$854.55</td><td>$1,044.45</td></tr>
                <tr><td>Estate · flat</td><td>$874.65</td><td>$1,124.55</td><td>$1,374.45</td></tr>
              </tbody>
            </table>
          </div>
          <div className="adds">
            <div className="a rvl"><div className="nm">Tier C — Entry</div><div className="pr">Add-ons 35%</div><p>Starting tier. Assigned by Bricks based on quality, reliability, volume, and compliance.</p></div>
            <div className="a rvl"><div className="nm">Tier B — Core</div><div className="pr">Add-ons 45%</div><p>Package payouts from the rate card above. Add-on rack share is 45%.</p></div>
            <div className="a rvl"><div className="nm">Tier A — Elite</div><div className="pr">Add-ons 55%</div><p>Package payouts from the rate card above. Add-on rack share is 55%.</p></div>
          </div>
          <p className="note" style={{ marginTop: 26 }}>Coverage area: Toronto · Mississauga · Hamilton · Durham · York · Niagara. Payout is the fixed rate-card amount — never a discounted customer rate. Bricks may change the rate card prospectively on 14 days&apos; notice; changes do not apply to jobs already accepted. Virtual visit (Gaussian splat) is always a client add-on, quoted by sqft on the same footprint bands as photo, reel, and virtual tour — never bundled into Standard, Premium, Luxury, or Estate packages.</p>
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
            <div className="qa"><h4>Do I need drone certification?</h4><p>For aerial jobs, yes — controlled airspace near Pearson / Billy Bishop requires Transport Canada Advanced RPAS certification. We verify before routing any drone job.</p></div>
            <div className="qa"><h4>Am I an employee?</h4><p>No — you&apos;re an independent contractor under Ontario law, contracting with Bricks Group. You control equipment, methods, and availability. Insurance and WSIB proof are required before a first dispatched job — see the IC agreement.</p></div>
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
        .incl .c p{font-size:12.5px;color:var(--inkMute);line-height:1.45;}
        .incl .c .ic{font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--brickDeep);display:block;margin-bottom:8px;}
        .adds{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--hair);border:1px solid var(--hair);border-radius:2px;margin-top:4px;}
        .adds .a{background:var(--paper);padding:22px 22px;}
        .adds .a .nm{font-weight:500;font-size:16px;color:var(--ink);}
        .adds .a .pr{font-family:'JetBrains Mono',monospace;font-size:20px;color:var(--brickDeep);margin:8px 0 6px;}
        .adds .a p{font-size:12.5px;color:var(--inkMute);line-height:1.45;}
        .rate-wrap{overflow-x:auto;border:1px solid var(--hair);border-radius:2px;margin:0 0 18px;}
        .rate-table{width:100%;border-collapse:collapse;font-size:13px;color:var(--inkSoft);}
        .rate-table th,.rate-table td{padding:10px 12px;border-bottom:1px solid var(--hair);text-align:right;white-space:nowrap;}
        .rate-table th:first-child,.rate-table td:first-child{text-align:left;color:var(--ink);}
        .rate-table th{font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--inkMute);background:var(--paperDeep);}
        .rate-table tr:last-child td{border-bottom:none;}
        @media (max-width:680px){.incl,.adds{grid-template-columns:1fr;}}
      `}</style>
    </>
  )
}
