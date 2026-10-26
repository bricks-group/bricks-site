import type { Metadata } from 'next'
import Link from 'next/link'
import { legalDocCss } from '@/components/legalDocCss'

export const metadata: Metadata = {
  title: 'Bricks — Legal',
  description: 'Terms of Service, Privacy Policy, Data Processing Agreement, and photographer Independent Contractor Agreement for Bricks Group.',
  alternates: { canonical: '/legal' },
  openGraph: {
    title: 'Bricks — Legal',
    description: 'Terms, Privacy, DPA, and photographer Independent Contractor Agreement for Bricks Group.',
  },
  twitter: {
    card: 'summary',
    title: 'Bricks — Legal',
    description: 'Terms, Privacy, DPA, and photographer Independent Contractor Agreement for Bricks Group.',
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
            Agreements for Bricks Group (Ontario, Canada).
          </p>
          <div className="updated">Updated · 3 October 2026</div>
        </div>
      </section>

      <div className="legal-body">
        <section className="block" id="agreements">
          <h2>Documents</h2>
          <ul>
            <li>
              <Link href="/terms">Terms of Service</Link> — media booking terms on brxs.ca. Effective 27 August 2026.
            </li>
            <li>
              <Link href="/privacy">Privacy Policy</Link> — how we handle personal information. Effective 27 August 2026.
            </li>
            <li>
              <a href="/legal/ic-agreement.txt">Independent Contractor Agreement v1.9</a>
              {' '}— photographers working through the Bricks app. Effective 3 October 2026.
            </li>
            <li>
              <Link href="/dpa">Data Processing Agreement</Link> — enterprise / brokerage controller–processor terms. Effective 27 August 2026.
            </li>
          </ul>
        </section>

        <section className="block" id="contact">
          <h2>Contact</h2>
          <p>
            Email: <a href="mailto:help@brxs.ca">help@brxs.ca</a>
            <br />
            Bricks Group · Ontario, Canada
          </p>
        </section>
      </div>
      <style>{legalDocCss}</style>
    </>
  )
}
