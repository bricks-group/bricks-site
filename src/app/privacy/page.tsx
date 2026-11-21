import type { Metadata } from 'next'
import { legalDocCss } from '@/components/legalDocCss'
import { OG_IMAGE } from '@/lib/og'

export const metadata: Metadata = {
  title: 'Bricks — Privacy Policy',
  description: 'How Bricks Group collects, uses, and discloses personal information for brxs.ca and the Bricks apps, under PIPEDA. Privacy contact: privacy@brxs.ca.',
  alternates: { canonical: '/privacy' },
  openGraph: { images: [OG_IMAGE],
    title: 'Bricks — Privacy Policy',
    description: 'How Bricks Group collects, uses, and discloses personal information for brxs.ca. Privacy contact: privacy@brxs.ca.',
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
          <p className="sub">How Bricks Group collects, uses, and discloses personal information for brxs.ca, the Bricks apps, and related booking and photographer-apply flows.</p>
          <div className="updated">Effective · 27 August 2026 · Last updated · 30 October 2026</div>
        </div>
      </section>

      <div className="legal-body">
        <section className="block">
          <h2>BRICKS PRIVACY POLICY</h2>
          <p>Effective: August 27, 2026<br />Last updated: October 30, 2026<br />Organization: Bricks Group<br />Privacy contact: <a href="mailto:privacy@brxs.ca">privacy@brxs.ca</a></p>
          <p>This policy explains how Bricks Group collects, uses, and discloses personal information for brxs.ca, the Bricks apps, and related booking and photographer-apply flows, under PIPEDA and applicable Ontario privacy rules.</p>

          <h3>1. What we collect</h3>
          <ul>
            <li>Booking: name, brokerage, email, phone, property address, property type/size, package and add-on choices, booked date and clock time, access notes.</li>
            <li>Payment: processed by Stripe. We do not store full card numbers. We may store Stripe customer id, last four, brand, and payment status.</li>
            <li>Newsletter: email, optional name, and the time you consent (and confirm), if you sign up. We use double opt-in — you confirm by email before we subscribe you.</li>
            <li>Photographer applicants: name, phone, email, city, travel radius, specialties, equipment, portfolio URLs, resume file, HST number if provided, and IC-acceptance record.</li>
            <li>Technical: IP address, device/browser, pages, and similar logs needed to run and secure the site.</li>
          </ul>

          <h3 id="apps">1A. Bricks mobile apps</h3>
          <p>If you use our mobile apps, we also collect:</p>
          <ul>
            <li>Account and profile: name, email, phone, and (for photographers) photo, skills, service area, availability, and drone certificate details you enter.</li>
            <li>Photos, scans, and files you choose to upload: listing photos, 360° and floor plan captures, documents you scan or attach to a listing file, and portfolio samples.</li>
            <li>Location (photographer accounts only): required to check in to a job, and used only to confirm you’re at the property. We store your position, its accuracy and your distance from the property when you check in, and use them if you report that the client did not show up. While the app is open, we also read the compass during 360° capture. We do not track your location in the background.</li>
            <li>Device push token: if you allow notifications, a token from Apple or Google that lets us send job and listing updates. Turning notifications off in your phone&rsquo;s settings stops them.</li>
            <li>Saved data on your phone: your job list or listing files are stored on the device so you can read them without signal. Signing out removes them.</li>
          </ul>
          <p>The apps do not include advertising or analytics SDKs, and we do not track you across other companies&rsquo; apps or websites.</p>
          <p>Service providers for the apps: Supabase (sign-in, database, file storage; Canada), Expo (push notification delivery; United States), Apple and Google (push delivery, and sign-in if you choose it), Stripe (photographer payouts), and Mapbox (map tiles in a Bricks listing file; receives your IP address and the map area you view).</p>
          <p>Deleting your account: in the Bricks app, photographers go to Me &gt; Delete account; real estate offices go to Account &gt; Delete account. You can also email <a href="mailto:privacy@brxs.ca">privacy@brxs.ca</a>. What we delete and keep is listed at <a href="/account-deletion">brxs.ca/account-deletion</a>.</p>

          <h3>2. Why</h3>
          <ul>
            <li>Provide quotes, take payment, schedule, dispatch, shoot, deliver, support, and refund.</li>
            <li>Review photographer applications and keep a record of the IC agreement version accepted.</li>
            <li>Tax, accounting, and legal records.</li>
            <li>Improve the site (aggregated or de-identified where practical).</li>
            <li>Marketing email only with CASL-compliant consent.</li>
          </ul>

          <h3>3. Who we share with</h3>
          <p>We do not sell personal information. We share what is needed with: Stripe; Supabase; OpenStreetMap/geocoding; Expo, Apple and Google push services, and Mapbox (for the apps); OpenAI (ChatGPT ads measurement only as described in section 10 — hashed email and phone for ad conversion measurement, not raw contact details); Resend (newsletter subscriber records and email delivery — email, optional name, and consent timing); the assigned photographer (address, time, access notes, contact name as needed); counsel, accountants, or authorities when required by law. Photographers are independent contractors and must keep booking details confidential under the IC agreement.</p>

          <h3>4. Where</h3>
          <p>Primary app database, authentication, and storage run on Supabase in Canada. Other processors include Stripe and Vercel (United States), Expo push delivery and Mapbox for the apps (United States), OpenAI for ChatGPT ads measurement when section 10 applies (United States), Resend for newsletter email when you subscribe (United States), and similar providers listed in section 3. By using the site you consent to those transfers where needed. We remain accountable under PIPEDA for personal information we collect.</p>

          <h3>5. Retention</h3>
          <p>Booking and payment records: generally 7 years. Delivered media: until delivered plus a limited operational window. Photographer applications: while we evaluate or engage you, then as required for records. Newsletter: while you stay subscribed; consent and unsubscribe records as required by CASL. Marketing consent records: as required by CASL. App push tokens: until you delete the account or the token stops working. On-device saved data: until you sign out. Deletion on request unless we must keep a record.</p>

          <h3>6. Your rights</h3>
          <p>Email <a href="mailto:privacy@brxs.ca">privacy@brxs.ca</a> to access, correct, or withdraw consent (subject to legal and booking obligations). You can also delete your account in the Bricks app (see 1A and <a href="/account-deletion">brxs.ca/account-deletion</a>). Aim to respond within 30 days. Complaint: Office of the Privacy Commissioner of Canada (<a href="https://www.priv.gc.ca" rel="noopener noreferrer">priv.gc.ca</a>).</p>

          <h3 id="newsletter">Newsletter</h3>
          <p>
            If you sign up for our newsletter, we collect your email, your name if you give it, and when you consent.
            We use a double opt-in: you confirm by email before we add you. We use this only to send Bricks news and
            updates you asked for. Subscriber records and sends go through Resend (United States). You can unsubscribe
            with the link in every newsletter, or email <a href="mailto:privacy@brxs.ca">privacy@brxs.ca</a>. We keep
            your subscription while you stay subscribed, and keep consent and unsubscribe records as Canada&rsquo;s
            anti-spam law (CASL) requires.
          </p>

          <h3>7. CASL</h3>
          <p>Commercial electronic messages only with your express consent under Canada&rsquo;s anti-spam law (CASL). Our newsletter uses double opt-in: you confirm by email before we send marketing. Every newsletter has a one-click unsubscribe link; you can also email <a href="mailto:privacy@brxs.ca">privacy@brxs.ca</a>. Transactional booking and application messages are sent as needed to perform the service.</p>

          <h3>8. Children</h3>
          <p>Adults 18+. We do not knowingly collect information from children. Listing media is of property, not of children.</p>

          <h3>9. Security</h3>
          <p>TLS in transit, access-limited systems. Notify of a PIPEDA-significant breach as required.</p>

          <h3 id="cookies">10. Cookies and analytics</h3>
          <p>This site uses Vercel Analytics to measure aggregate usage. Vercel Analytics is cookieless: it does not set cookies, does not build a profile of you, and does not track you across other sites.</p>
          <p>Cloudflare helps protect and deliver the site. It may set first-party security cookies such as <code>__cf_ob</code> and <code>cf_clearance</code> for bot protection. Cloudflare Web Analytics may also measure aggregate traffic. These are for security and operations, not advertising.</p>
          <p><strong>Booking source (first-party).</strong> When you book, we may record whether the visit was organic or paid using a first-party, cookieless source tag on the booking. That tag is not a third-party advertising cookie.</p>
          <p><strong>ChatGPT ads measurement.</strong> We use OpenAI&rsquo;s measurement pixel to measure visits and bookings that follow a ChatGPT ad. It loads only in these cases:</p>
          <ul>
            <li>you arrive from a ChatGPT ad (the link includes <code>?oppref=</code>), or</li>
            <li>you reach the booking confirmation page and your browser already has our <code>__oppref</code> ad cookie from an earlier ChatGPT ad visit.</li>
          </ul>
          <p>When it runs, it can set two first-party cookies on brxs.ca:</p>
          <ul>
            <li><code>__oppref</code>: about 30 days; stores the ad click ID from the landing URL.</li>
            <li><code>__obref</code>: about 365 days; a random browser ID for this site.</li>
          </ul>
          <p>The pixel may send page-view and order events to OpenAI (<code>bzr.openai.com</code> and <code>bzrcdn.openai.com</code>). OpenAI may also set its own cookies (for example Cloudflare <code>__cf_bm</code> and <code>_cfuvid</code>) on OpenAI&rsquo;s domains.</p>
          <p><strong>Advanced matching.</strong> On the booking confirmation page only (and only when the pixel runs), our code sends OpenAI only SHA-256 hashes of your email and phone. We hash them in your browser first. Raw email and phone are not sent to OpenAI for this. Purpose: measure whether a ChatGPT ad led to your booking.</p>
          <p><strong>Checkout and your browser.</strong> Your browser may keep information in session storage for the browsing session. That can include booking or sign-up form progress so you don&rsquo;t lose your place at checkout, and — when ChatGPT ads measurement applies — your email and phone so we can make the hashes on the confirmation page. Raw email and phone are not sent to OpenAI for matching. Session storage clears when your browsing session ends.</p>
          <p>Measurement data may be processed in the United States. We remain accountable under PIPEDA for personal information we collect.</p>
          <p><strong>Quebec and unknown location.</strong> If you are in Quebec, or we can&rsquo;t tell where you are, we ask for your consent before this measurement pixel loads. You can Accept or Refuse. If you Refuse, the pixel stays off and we remember your choice in your browser so we don&rsquo;t ask again. The short notice shown before it would run uses the same words.</p>
          <p><strong>Your choices.</strong> Clear site cookies in your browser, use private browsing, or block cookies for brxs.ca. Email <a href="mailto:privacy@brxs.ca">privacy@brxs.ca</a> to ask us to stop using measurement cookies where we can. Where we ask, refuse on the notice, or email us.</p>

          <h3>11. Changes</h3>
          <p>Posted on this page and dated.</p>
        </section>
      </div>

      <div className="legal-body">
        <section className="block" style={{ borderTop: '1px solid var(--hair)' }}>
          <h2>Contact</h2>
          <p><a href="mailto:hello@brxs.ca">hello@brxs.ca</a> · <span className="mono">(289) 312-7425</span></p>
          <p>Bricks Group · 6330 Montevideo Road, Mississauga, ON L5N 3V2, Canada</p>
        </section>
      </div>

      <style>{legalDocCss}</style>
    </>
  )
}
