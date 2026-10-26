import type { Metadata } from 'next'
import Link from 'next/link'
import { legalDocCss } from '@/components/legalDocCss'

export const metadata: Metadata = {
  title: 'Data Processing Agreement — Bricks',
  description:
    'Bricks Group Data Processing Agreement for brokerages, teams, and enterprise clients that process third-party personal data on the Bricks platform. PIPEDA-aligned.',
  alternates: { canonical: '/dpa' },
  openGraph: {
    title: 'Data Processing Agreement — Bricks',
    description: 'Bricks Group DPA for enterprise brokerage clients. PIPEDA-aligned.',
  },
  twitter: {
    card: 'summary',
    title: 'Data Processing Agreement — Bricks',
    description: 'Bricks Group DPA for enterprise brokerage clients. PIPEDA-aligned.',
  },
}

export default function DpaPage() {
  return (
    <>
      <section className="hero">
        <div className="wrap">
          <span className="badge">Legal</span>
          <h1>Data Processing Agreement</h1>
          <p className="sub">
            Supplements the Terms of Service where a brokerage, team, or enterprise client processes personal data of third parties through Bricks.
          </p>
          <div className="updated">Effective · 27 August 2026</div>
        </div>
      </section>

      <div className="legal-body">
        <div className="legal-notice">
          <p>
            This Data Processing Agreement (&quot;<strong>DPA</strong>&quot;) supplements the Bricks{' '}
            <Link href="/terms">Terms of Service</Link> and applies where the Client is a brokerage, team, or
            enterprise organization that processes personal data of third parties (e.g., property owners, agents)
            through the Bricks platform. For standard solo agent accounts, the{' '}
            <Link href="/privacy">Privacy Policy</Link> alone governs data processing.
          </p>
        </div>

        <section className="block">
          <h2>1. Definitions</h2>
          <p>&quot;<strong>Controller</strong>&quot; means the Client who determines the purposes and means of processing personal data of their agents, staff, and property owners.</p>
          <p>&quot;<strong>Processor</strong>&quot; means Bricks Group, which processes personal data on behalf of the Controller in connection with the Bricks platform.</p>
          <p>&quot;<strong>Sub-Processor</strong>&quot; means a third party engaged by Bricks to assist in processing personal data.</p>
          <p>&quot;<strong>Personal Data</strong>&quot; means any information relating to an identified or identifiable natural person processed through the Bricks platform in connection with the Controller&apos;s use of the service.</p>
          <p>&quot;<strong>Applicable Law</strong>&quot; means PIPEDA and any applicable provincial privacy legislation including Ontario&apos;s privacy framework.</p>
        </section>

        <section className="block">
          <h2>2. Subject Matter and Nature of Processing</h2>
          <p>
            Bricks processes Personal Data on behalf of the Controller solely for the purpose of providing the
            platform services described in the Terms of Service, including: managing agent accounts, processing
            property bookings, dispatching photographers, delivering media, managing software and brokerage seat
            billing, and generating billing records.
          </p>
          <p>
            Bricks will not process Personal Data for any purpose other than those specified in the Terms of
            Service and this DPA without the Controller&apos;s prior written instruction, except where required by
            applicable law.
          </p>
        </section>

        <section className="block">
          <h2>3. Categories of Data Subjects and Personal Data</h2>
          <table>
            <thead>
              <tr>
                <th>Data Subjects</th>
                <th>Categories of Personal Data</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Client&apos;s agents and staff</td>
                <td>Name, email, phone, booking history, plan usage, schedule, login credentials (hashed), device identifiers</td>
              </tr>
              <tr>
                <td>Property sellers / owners</td>
                <td>Property address, shoot date and time (indirectly, through booking records)</td>
              </tr>
              <tr>
                <td>Brokerage administrators</td>
                <td>Name, email, administrative activity logs</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section className="block">
          <h2>4. Bricks&apos;s Obligations as Processor</h2>
          <p>Bricks will:</p>
          <ul>
            <li>Process Personal Data only on documented instructions from the Controller (as set out in this DPA and the Terms of Service) or as required by applicable law.</li>
            <li>Ensure that Bricks personnel authorized to process Personal Data are subject to confidentiality obligations.</li>
            <li>Implement appropriate technical and organizational security measures as described in Section 6.</li>
            <li>Not engage a new Sub-Processor without providing the Controller advance notice and the opportunity to object.</li>
            <li>Assist the Controller in responding to requests from data subjects exercising their rights under Applicable Law, to the extent technically feasible.</li>
            <li>Notify the Controller of any Personal Data breach affecting the Controller&apos;s data without undue delay and in any event within 72 hours of becoming aware.</li>
            <li>Upon termination of the service, delete or return all Personal Data as instructed by the Controller within 90 days, except where retention is required by applicable law.</li>
          </ul>
        </section>

        <section className="block">
          <h2>5. Controller&apos;s Obligations</h2>
          <p>
            The Controller warrants that it has a lawful basis for processing Personal Data entered into the Bricks
            platform and that it has obtained all necessary consents from its agents, staff, and relevant third
            parties for the processing described in this DPA.
          </p>
        </section>

        <section className="block">
          <h2>6. Security Measures</h2>
          <p>Bricks implements the following security measures to protect Personal Data:</p>
          <ul>
            <li>Encryption in transit (TLS 1.2 or higher) for all data transmission.</li>
            <li>Encrypted at-rest storage via Supabase and Cloudflare R2.</li>
            <li>Role-based access control limiting data access to personnel with a legitimate business need.</li>
            <li>Authentication controls including bcrypt-hashed passwords and JWT-based session management.</li>
            <li>Periodic security reviews and vulnerability assessments.</li>
            <li>Audit logging for all administrative actions affecting account data.</li>
          </ul>
        </section>

        <section className="block">
          <h2>7. Sub-Processors</h2>
          <p>
            The Controller hereby provides general authorization for Bricks to engage the following Sub-Processors.
            Bricks will maintain this list current and notify the Controller of any changes:
          </p>
          <table>
            <thead>
              <tr>
                <th>Sub-Processor</th>
                <th>Role</th>
                <th>Data Location</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Supabase Inc.</td><td>Database, authentication, real-time infrastructure</td><td>Canada (AWS ca-central-1)</td></tr>
              <tr><td>Cloudflare Inc.</td><td>CDN, R2 file storage, DDoS protection</td><td>Distributed (global CDN)</td></tr>
              <tr><td>Vercel Inc.</td><td>Hosting and edge for brxs.ca apps</td><td>United States</td></tr>
              <tr><td>Stripe Inc.</td><td>Payment processing, billing</td><td>United States</td></tr>
              <tr><td>Google LLC</td><td>Maps API (geocoding), Google Sign-In, Gemini AI dispatch routing</td><td>United States</td></tr>
              <tr><td>Mapbox Inc.</td><td>Address suggest / map imagery</td><td>United States</td></tr>
              <tr><td>Resend Inc.</td><td>Transactional email delivery</td><td>United States</td></tr>
              <tr><td>Twilio Inc.</td><td>SMS notifications</td><td>United States</td></tr>
              <tr><td>Fotello</td><td>AI photo enhancement (property images only, no personal data)</td><td>United States</td></tr>
              <tr><td>Autoenhance.ai</td><td>AI photo enhancement fallback (property images only)</td><td>United Kingdom</td></tr>
              <tr><td>Bricks (owned)</td><td>Virtual staging — owned pipeline, $35 per photo at checkout; no third-party furniture vendor</td><td>Canada</td></tr>
            </tbody>
          </table>
        </section>

        <section className="block">
          <h2>8. International Data Transfers</h2>
          <p>
            Some Sub-Processors are located outside Canada. International transfers of Personal Data are made
            pursuant to contractual data processing agreements consistent with PIPEDA&apos;s accountability principle,
            including, where applicable, standard contractual clauses or equivalent safeguards.
          </p>
        </section>

        <section className="block">
          <h2>9. Data Breach Notification</h2>
          <p>
            In the event Bricks becomes aware of a confirmed breach of security safeguards involving Personal Data
            that creates a real risk of significant harm to affected individuals, Bricks will:
          </p>
          <ul>
            <li>Notify the Controller without unreasonable delay (target: within 72 hours of confirmation).</li>
            <li>Provide the Controller with sufficient information to meet its own notification obligations under PIPEDA&apos;s mandatory breach reporting rules.</li>
            <li>Cooperate with the Controller&apos;s investigation and remediation efforts.</li>
          </ul>
        </section>

        <section className="block">
          <h2>10. Audit Rights</h2>
          <p>
            The Controller may, upon reasonable written notice (minimum 30 days) and no more than once per calendar
            year, request a summary audit report of Bricks&apos;s data processing practices relevant to this DPA. Bricks
            may satisfy this obligation by providing third-party audit reports, certifications, or equivalent
            documentation in lieu of direct on-site audits.
          </p>
        </section>

        <section className="block">
          <h2>11. Governing Law</h2>
          <p>
            This DPA is governed by the laws of the Province of Ontario and the federal laws of Canada, consistent
            with the Terms of Service governing law provision.
          </p>
        </section>

        <section className="block">
          <h2>12. Contact</h2>
          <p>
            For DPA inquiries or to exercise Controller rights under this agreement:{' '}
            <a href="mailto:help@brxs.ca">help@brxs.ca</a>
            <br />
            Phone: <span className="mono">343-453-4578</span>
            <br />
            Bricks Group · Ontario, Canada
          </p>
          <p>
            Also see <Link href="/legal">/legal</Link>, <Link href="/privacy">/privacy</Link>, and{' '}
            <Link href="/terms">/terms</Link>.
          </p>
        </section>
      </div>
      <style>{legalDocCss}</style>
    </>
  )
}
