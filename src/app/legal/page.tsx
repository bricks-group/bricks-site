import type { Metadata } from 'next'
import Link from 'next/link'
import { legalDocCss } from '@/components/legalDocCss'

export const metadata: Metadata = {
  title: 'Bricks — Legal',
  description:
    'Agreements that govern Bricks Group: client Terms, Privacy (PIPEDA), photographer Independent Contractor Agreement, and related policies.',
  alternates: { canonical: '/legal' },
  openGraph: {
    title: 'Bricks — Legal',
    description: 'Client Terms, Privacy Policy, and photographer Independent Contractor Agreement for Bricks Group.',
  },
  twitter: {
    card: 'summary',
    title: 'Bricks — Legal',
    description: 'Client Terms, Privacy Policy, and photographer Independent Contractor Agreement for Bricks Group.',
  },
}

export default function LegalHubPage() {
  return (
    <>
      <section className="hero">
        <div className="wrap">
          <span className="badge">Legal</span>
          <h1>Legal</h1>
          <p className="sub">
            Contracting party for bookings and platform use: <strong>Bricks Group</strong> (Ontario, Canada).
            Documents below are what clients, agents, and photographers agree to today.
          </p>
          <div className="updated">Updated · 6 September 2026</div>
        </div>
      </section>

      <div className="legal-body">
        <section className="block" id="agreements">
          <h2>Agreements in force</h2>
          <ul>
            <li>
              <Link href="/terms">Terms of Service</Link> — client / booking terms for listing media on brxs.ca
              (payment, scheduling, delivery, reschedule/refunds, IP licence, liability, Ontario law). Effective 27 August 2026.
              Accepted when you pay for a shoot.
            </li>
            <li>
              <Link href="/privacy">Privacy Policy</Link> — PIPEDA-oriented notice for www booking, photographer apply,
              and related flows. Effective 27 August 2026. Contact{' '}
              <a href="mailto:booking@brxs.ca">booking@brxs.ca</a>.
            </li>
            <li>
              <a href="https://dispatch-api.brxs.ca/api/onboarding/ic-agreement" rel="noopener noreferrer">
                Independent Contractor Agreement v1.5
              </a>{' '}
              — photographers / vendors on GO &amp; Dispatch. Effective 6 September 2026. Accepted on apply / re-sign in
              onboarding. Plain text:{' '}
              <a href="/legal/ic-agreement.txt">/legal/ic-agreement.txt</a>.
            </li>
            <li>
              <strong>Companion Agent Terms</strong> — in-app Agent Terms of Service and Privacy for Companion (linked
              from Companion settings). Media bookings themselves remain under the www{' '}
              <Link href="/terms">Terms</Link>.
            </li>
          </ul>
        </section>

        <section className="block" id="who-signs-what">
          <h2>Who signs what</h2>
          <ul>
            <li>
              <strong>Agents / brokerages booking media</strong> — www <Link href="/terms">Terms</Link> +{' '}
              <Link href="/privacy">Privacy</Link> at checkout; Stripe processes payment.
            </li>
            <li>
              <strong>Photographers</strong> — IC Agreement v1.5 on apply (insurance, WSIB/clearance, IP assignment to
              Bricks, fixed rate card, non-solicit of Bricks-introduced clients, Ontario law).
            </li>
            <li>
              <strong>Software / OS accounts</strong> — plan gates and billing are in-product; dedicated SaaS MSA / DPA
              for brokerage seats is not a separate public PDF yet (use Terms + Privacy + order form / invoice until
              counsel drafts one).
            </li>
          </ul>
        </section>

        <section className="block" id="what-protects">
          <h2>What these protect (plain English)</h2>
          <ul>
            <li>
              <strong>Client money &amp; delivery</strong> — prepaid checkout, cancellation ladder, Bricks responsible
              for the package even though shooters are ICs.
            </li>
            <li>
              <strong>IP / assets</strong> — photographers assign copyright in Bricks job deliverables to Bricks; clients
              get a perpetual marketing licence for that property; Bricks may use in portfolio unless opted out.
            </li>
            <li>
              <strong>Liability</strong> — booking liability generally capped at amount paid; IC indemnity + required
              insurance / drone compliance for field risk.
            </li>
            <li>
              <strong>Platform relationships</strong> — IC status, right to refuse jobs, no employment benefits; 12-month
              non-solicit of Bricks-introduced clients (no blanket non-compete).
            </li>
            <li>
              <strong>Privacy</strong> — PIPEDA-style collection / sharing / retention / CASL notes for site and apply
              flows.
            </li>
          </ul>
        </section>

        <section className="block" id="counsel">
          <h2>Counsel review (honest status)</h2>
          <p>
            These documents are operational drafts used in production. Ontario counsel review of the IC agreement, agent
            / SaaS terms, photo licensing, and PIPEDA privacy pack is still on the launch checklist and has not been
            completed. Nothing here is a substitute for advice from your lawyer. Corporate records (incorporation,
            shareholdings, founder IP assignment into the company) live with your counsel / corporate minute book — they
            are not published on this site.
          </p>
        </section>

        <section className="block" id="contact">
          <h2>Contact</h2>
          <p>
            Legal / bookings: <a href="mailto:booking@brxs.ca">booking@brxs.ca</a>
            <br />
            Bricks Group · Ontario, Canada
          </p>
        </section>
      </div>
      <style>{legalDocCss}</style>
    </>
  )
}
