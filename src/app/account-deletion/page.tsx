import type { Metadata } from 'next'
import Link from 'next/link'
import { legalDocCss } from '@/components/legalDocCss'

export const metadata: Metadata = {
  title: 'Bricks — Delete your account',
  description:
    'How to delete a Bricks account, in the app or by email, and what Bricks Group deletes and keeps.',
  alternates: { canonical: '/account-deletion' },
  openGraph: {
    title: 'Bricks — Delete your account',
    description: 'How to delete a Bricks account, and what we delete and keep.',
  },
  twitter: {
    card: 'summary',
    title: 'Bricks — Delete your account',
    description: 'How to delete a Bricks account, and what we delete and keep.',
  },
}

export default function AccountDeletionPage() {
  return (
    <>
      <section className="hero">
        <div className="wrap">
          <span className="badge">Legal</span>
          <h1>Delete your account</h1>
          <p className="sub">
            For accounts in the Bricks apps (photographers and vendors, or real estate offices), made by
            Bricks Group, Ontario, Canada.
          </p>
          <div className="updated">Updated · 11 October 2026</div>
        </div>
      </section>

      <div className="legal-body">
        <section className="block" id="in-app">
          <h2>Delete it in the app</h2>
          <ul>
            <li>
              <strong>Photographer and vendor accounts:</strong> open the <strong>Me</strong> tab, tap <strong>Delete account</strong>, then
              confirm.
            </li>
            <li>
              <strong>Real estate office accounts:</strong> open <strong>Account</strong>, tap <strong>Delete account</strong>, then
              confirm.
            </li>
          </ul>
          <p>
            The app sends us your deletion request and signs you out. We complete the deletion within 30 days and email
            you when it is done.
          </p>
        </section>

        <section className="block" id="by-email">
          <h2>Delete it without the app</h2>
          <p>
            Email <a href="mailto:help@brxs.ca?subject=Delete%20my%20Bricks%20account">help@brxs.ca</a> from the email
            address on your account, with the subject <strong>&ldquo;Delete my Bricks account&rdquo;</strong>. We may
            ask you to confirm that you own the account before we delete anything.
          </p>
        </section>

        <section className="block" id="deleted">
          <h2>What we delete (within 30 days)</h2>
          <ul>
            <li>Your login (email and password, or the Apple or Google sign-in link)</li>
            <li>Your profile: name, phone, photo, bio, skills, service area, and availability</li>
            <li>Push notification tokens for your devices</li>
            <li>Photographer applications that were not accepted, and portfolio files you uploaded</li>
            <li>Documents and pictures you added that are not part of an office&rsquo;s listing file or a client&rsquo;s delivery</li>
          </ul>
          <p>Job lists and listing files saved on your phone for offline use are removed when you sign out.</p>
        </section>

        <section className="block" id="kept">
          <h2>What we keep, and for how long</h2>
          <ul>
            <li>
              <strong>Payment, payout, and tax records</strong> (for example, completed-job payouts and invoices): kept
              for 7 years, as Canadian tax law requires. They are no longer tied to an active account.
            </li>
            <li>
              <strong>Media already delivered to a client, and documents filed to an office&rsquo;s listing file:</strong>{' '}
              these belong to the client or office that ordered them, and stay with them.
            </li>
            <li>
              <strong>Records we must keep for a legal claim or dispute,</strong> until it is resolved.
            </li>
          </ul>
        </section>
      </div>

      <div className="legal-body">
        <section className="block" style={{ borderTop: '1px solid var(--hair)' }}>
          <h2>Questions</h2>
          <p>
            <a href="mailto:help@brxs.ca">help@brxs.ca</a> · <span className="mono">343-453-4578</span> ·{' '}
            <Link href="/privacy">Privacy Policy</Link>
          </p>
          <p>Bricks Group · Ontario, Canada</p>
        </section>
      </div>

      <style>{legalDocCss}</style>
    </>
  )
}
