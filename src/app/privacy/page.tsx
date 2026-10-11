import type { Metadata } from 'next'
import { legalDocCss } from '@/components/legalDocCss'

export const metadata: Metadata = {
  title: 'Bricks — Privacy Policy',
  description: 'How Bricks Group collects, uses, and discloses personal information for brxs.ca and the Bricks GO and Bricks OS apps, under PIPEDA. Privacy contact: help@brxs.ca.',
  alternates: { canonical: '/privacy' },
  openGraph: {
    title: 'Bricks — Privacy Policy',
    description: 'How Bricks Group collects, uses, and discloses personal information for brxs.ca. Privacy contact: help@brxs.ca.',
  },
  twitter: {
    card: 'summary',
    title: 'Bricks — Privacy Policy',
    description: 'How Bricks Group collects, uses, and discloses personal information for brxs.ca.',
  },
}

export default function PrivacyPage() {
  return (
    <>
      <section className="hero">
        <div className="wrap">
          <span className="badge">Legal</span>
          <h1>Privacy Policy</h1>
          <p className="sub">How Bricks Group collects, uses, and discloses personal information for brxs.ca, the Bricks GO and Bricks OS apps, and related booking and photographer-apply flows.</p>
          <div className="updated">Effective · 27 August 2026 · Last updated · 11 October 2026</div>
        </div>
      </section>

      <div className="legal-body">
        <section className="block">
          <h2>BRICKS PRIVACY POLICY</h2>
          <p>Effective: August 27, 2026<br />Last updated: October 11, 2026<br />Organization: Bricks Group<br />Privacy contact: <a href="mailto:help@brxs.ca">help@brxs.ca</a></p>
          <p>This policy explains how Bricks Group collects, uses, and discloses personal information for brxs.ca, the Bricks GO and Bricks OS apps, and related booking and photographer-apply flows, under PIPEDA and applicable Ontario privacy rules.</p>

          <h3>1. What we collect</h3>
          <ul>
            <li>Booking: name, brokerage, email, phone, property address, property type/size, package and add-on choices, booked date and clock time, access notes.</li>
            <li>Payment: processed by Stripe. We do not store full card numbers. We may store Stripe customer id, last four, brand, and payment status.</li>
            <li>Launch / marketing email: email, if you opted in.</li>
            <li>Photographer applicants: name, phone, email, city, travel radius, specialties, equipment, portfolio URLs, resume file, HST number if provided, and IC-acceptance record.</li>
            <li>Technical: IP address, device/browser, pages, and similar logs needed to run and secure the site.</li>
          </ul>

          <h3 id="apps">1A. Bricks GO and Bricks OS mobile apps</h3>
          <p>If you use our mobile apps, we also collect:</p>
          <ul>
            <li>Account and profile: name, email, phone, and (for photographers) photo, skills, service area, availability, and drone certificate details you enter.</li>
            <li>Photos, scans, and files you choose to upload: listing photos, 360° and floor plan captures, documents you scan or attach to a listing file, and portfolio samples.</li>
            <li>Location (Bricks GO only, optional): while the app is open, to show how far you are from a job, to read the compass during 360° capture, and to record your position if you report that an agent did not show up. We do not track your location in the background.</li>
            <li>Device push token: if you allow notifications, a token from Apple or Google that lets us send job and listing updates. Turning notifications off in your phone&rsquo;s settings stops them.</li>
            <li>Saved data on your phone: your job list or listing files are stored on the device so you can read them without signal. Signing out removes them.</li>
          </ul>
          <p>The apps do not include advertising or analytics SDKs, and we do not track you across other companies&rsquo; apps or websites.</p>
          <p>Service providers for the apps: Supabase (sign-in, database, file storage; Canada), Expo (push notification delivery; United States), Apple and Google (push delivery, and sign-in if you choose it), Stripe (photographer payouts), and Mapbox (map tiles in a Bricks OS listing file; receives your IP address and the map area you view).</p>
          <p>Deleting your account: in Bricks GO go to Me &gt; Delete account; in Bricks OS go to Account &gt; Delete account. You can also email <a href="mailto:help@brxs.ca">help@brxs.ca</a>. What we delete and keep is listed at <a href="/account-deletion">brxs.ca/account-deletion</a>.</p>

          <h3>2. Why</h3>
          <ul>
            <li>Provide quotes, take payment, schedule, dispatch, shoot, deliver, support, and refund.</li>
            <li>Review photographer applications and keep a record of the IC agreement version accepted.</li>
            <li>Tax, accounting, and legal records.</li>
            <li>Improve the site (aggregated or de-identified where practical).</li>
            <li>Marketing email only with CASL-compliant consent.</li>
          </ul>

          <h3>3. Who we share with</h3>
          <p>We do not sell personal information. We share what is needed with: Stripe; Supabase; OpenStreetMap/geocoding; Expo, Apple and Google push services, and Mapbox (for the apps); the assigned photographer (address, time, access notes, contact name as needed); counsel, accountants, or authorities when required by law. Photographers are independent contractors and must keep booking details confidential under the IC agreement.</p>

          <h3>4. Where</h3>
          <p>Primary app database, authentication, and storage run on Supabase in Canada. Other processors include Stripe and Vercel (United States), Expo push delivery and Mapbox for the apps (United States), and similar providers listed in section 3. By using the site you consent to those transfers where needed. We remain accountable under PIPEDA for personal information we collect.</p>

          <h3>5. Retention</h3>
          <p>Booking and payment records: generally 7 years. Delivered media: until delivered plus a limited operational window. Photographer applications: while we evaluate or engage you, then as required for records. Marketing consent records: as required by CASL. App push tokens: until you delete the account or the token stops working. On-device saved data: until you sign out. Deletion on request unless we must keep a record.</p>

          <h3>6. Your rights</h3>
          <p>Email <a href="mailto:help@brxs.ca">help@brxs.ca</a> to access, correct, or withdraw consent (subject to legal and booking obligations). You can also delete your account in the Bricks GO or Bricks OS app (see 1A and <a href="/account-deletion">brxs.ca/account-deletion</a>). Aim to respond within 30 days. Complaint: Office of the Privacy Commissioner of Canada (<a href="https://www.priv.gc.ca" rel="noopener noreferrer">priv.gc.ca</a>).</p>

          <h3>7. CASL</h3>
          <p>Commercial electronic messages only with CASL consent. Unsubscribe on marketing. Transactional booking/application messages as needed to perform the service.</p>

          <h3>8. Children</h3>
          <p>Adults 18+. We do not knowingly collect information from children. Listing media is of property, not of children.</p>

          <h3>9. Security</h3>
          <p>TLS in transit, access-limited systems. Notify of a PIPEDA-significant breach as required.</p>

          <h3>10. Changes</h3>
          <p>Posted on this page and dated.</p>
        </section>
      </div>

      <div className="legal-body">
        <section className="block" style={{ borderTop: '1px solid var(--hair)' }}>
          <h2>Contact</h2>
          <p><a href="mailto:help@brxs.ca">help@brxs.ca</a> · <span className="mono">343-453-4578</span></p>
          <p>Bricks Group · Ontario, Canada</p>
        </section>
      </div>

      <style>{legalDocCss}</style>
    </>
  )
}
