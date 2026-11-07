import type { Metadata } from 'next'
import Link from 'next/link'
import { legalDocCss } from '@/components/legalDocCss'
import { OG_IMAGE } from '@/lib/og'

export const metadata: Metadata = {
  title: "Bricks Legal Documents, Agreements & Privacy | Canada",
  description: "Find Bricks legal documents in one place: Terms of Service, Privacy Policy, Data Processing Agreement and the photographer Independent Contractor Agreement.",
  alternates: { canonical: '/legal' },
  openGraph: { images: [OG_IMAGE],
    title: "Bricks Legal Documents, Agreements & Privacy | Canada",
    description: "Find Bricks legal documents in one place: Terms of Service, Privacy Policy, Data Processing Agreement and the photographer Independent Contractor Agreement.",
  },
  twitter: {
    card: 'summary',
    title: "Bricks Legal Documents, Agreements & Privacy | Canada",
    description: "Find Bricks legal documents in one place: Terms of Service, Privacy Policy, Data Processing Agreement and the photographer Independent Contractor Agreement.",
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
          <p>Use this index to find the document relevant to your use of Bricks. Each link opens the full document; the summaries here help you navigate and do not replace its terms.</p>
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
          <p>For a question about a document, include its name and the section you are referring to. Direct privacy questions and personal information requests to <a href="mailto:privacy@brxs.ca">privacy@brxs.ca</a>.</p>
          <p>
            Support: <a href="mailto:help@brxs.ca">help@brxs.ca</a>
            <br />
            General enquiries: <a href="mailto:hello@brxs.ca">hello@brxs.ca</a>
            <br />
            Bricks Group · Ontario, Canada
          </p>
        </section>
      </div>
      <style>{legalDocCss}</style>
    </>
  )
}
