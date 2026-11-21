import type { Metadata } from 'next'
import Link from 'next/link'
import { legalDocCss } from '@/components/legalDocCss'
import { OG_IMAGE } from '@/lib/og'

export const metadata: Metadata = {
  title: 'Bricks — Privacy Policy',
  description: 'How Bricks collects, uses, and discloses personal information for brxs.ca and the Bricks apps, under PIPEDA. Privacy contact: privacy@brxs.ca.',
  alternates: { canonical: '/privacy' },
  openGraph: { images: [OG_IMAGE],
    title: 'Bricks — Privacy Policy',
    description: 'How Bricks collects, uses, and discloses personal information for brxs.ca. Privacy contact: privacy@brxs.ca.',
  },
  twitter: {
    card: 'summary',
    title: 'Bricks — Privacy Policy',
    description: 'How Bricks collects, uses, and discloses personal information for brxs.ca.',
  },
}

export default function PrivacyPage() {
  return (
    <>
      <section className="hero">
        <div className="wrap">
          <span className="badge">Legal</span>
          <h1>Privacy Policy</h1>
          <p className="sub">How Bricks collects, uses, and discloses personal information for brxs.ca, the Bricks apps, and related booking and photographer-apply flows.</p>
          <div className="updated">Last updated · 21 November 2026</div>
        </div>
      </section>

<div className="legal-body"><section className="block" id="summary"><h2>Summary</h2>
<p>This policy explains how Bricks collects, uses, and discloses personal information for brxs.ca, the Bricks apps, booking flows, photographer apply flows, and the newsletter, under PIPEDA and applicable Ontario privacy rules. We do not sell personal information.</p>
<p><strong>Questions or requests:</strong> privacy@brxs.ca</p>
</section></div>
<div className="legal-body"><section className="block" id="who"><h2>Who is responsible</h2>
<p className="inshort"><strong>In short:</strong> Bricks is accountable for your information. Ask us anything at privacy@brxs.ca.</p>
<ul>
<li><strong>Organization:</strong> AJANI SHORTERMERCHANT, a sole proprietor operating as Bricks.</li>
<li><strong>Privacy contact:</strong> <a href="mailto:privacy@brxs.ca">privacy@brxs.ca</a></li>
<li><strong>Address:</strong> 6330 Montevideo Road, Mississauga, ON L5N 3V2, Canada</li>
</ul></section></div>
<div className="legal-body"><section className="block" id="1-what-we-collect"><h2>1. What we collect</h2>
<p className="inshort"><strong>In short:</strong> Booking and payment details, optional newsletter signup, applicant info, and technical logs needed to run the site.</p>
<ul>
<li><strong>Booking:</strong> name, brokerage, email, phone, property address, property type/size, package and add-on choices, booked date and clock time, access notes.</li>
<li><strong>Payment:</strong> processed by Stripe. We do not store full card numbers. We may store Stripe customer id, last four, brand, and payment status.</li>
<li><strong>Newsletter:</strong> email, optional name, and the time you consent (and confirm), if you sign up. We use <strong>double opt-in</strong> — you confirm by email before we subscribe you.</li>
<li><strong>Photographer applicants:</strong> name, phone, email, city, travel radius, specialties, equipment, portfolio URLs, resume file, HST number if provided, and IC-acceptance record.</li>
<li><strong>Technical:</strong> IP address, device/browser, pages, and similar logs needed to run and secure the site.</li>
</ul>
<h3>1A. Bricks mobile apps</h3>
<p>If you use our mobile apps, we also collect:</p>
<ul>
<li><strong>Account and profile:</strong> name, email, phone, and (for photographers) photo, skills, service area, availability, and drone certificate details you enter.</li>
<li><strong>Photos, scans, and files</strong> you choose to upload: listing photos, 360° and floor plan captures, documents you scan or attach to a listing file, and portfolio samples.</li>
<li><strong>Location (photographer accounts only):</strong> required to check in to a job, and used only to confirm you&apos;re at the property. We store your position, its accuracy, and your distance from the property when you check in, and use them if you report that the client did not show up. While the app is open, we also read the compass during 360° capture. We do not track your location in the background.</li>
<li><strong>Device push token:</strong> if you allow notifications, a token from Apple or Google that lets us send job and listing updates. Turning notifications off in your phone&apos;s settings stops them.</li>
<li><strong>Saved data on your phone:</strong> your job list or listing files are stored on the device so you can read them without signal. Signing out removes them.</li>
</ul>
<p>The apps do not include advertising or analytics SDKs, and we do not track you across other companies&apos; apps or websites.</p>
<p><strong>App service providers:</strong> Supabase (sign-in, database, file storage; Canada), Expo (push notification delivery; United States), Apple and Google (push delivery, and sign-in if you choose it), Stripe (photographer payouts), and Mapbox (map tiles in a Bricks listing file; receives your IP address and the map area you view).</p>
<p><strong>Deleting your account:</strong> in the Bricks app, photographers go to Me &gt; Delete account; real estate offices go to Account &gt; Delete account. You can also email privacy@brxs.ca. What we delete and keep is listed at <Link href="/account-deletion">brxs.ca/account-deletion</Link>.</p>
</section></div>
<div className="legal-body"><section className="block" id="2-why-we-use-it"><h2>2. Why we use it</h2>
<ul>
<li>Provide quotes, take payment, schedule, dispatch, shoot, deliver, support, and refund.</li>
<li>Send the newsletter you asked for (after double opt-in).</li>
<li>Review photographer applications and keep a record of the IC agreement version accepted.</li>
<li>Tax, accounting, and legal records.</li>
<li>Improve the site (aggregated or de-identified where practical).</li>
<li>Marketing email only with CASL-compliant consent.</li>
</ul>
</section></div>
<div className="legal-body"><section className="block" id="3-who-we-share-with"><h2>3. Who we share with</h2>
<p className="inshort"><strong>In short:</strong> Only what is needed to run the service. We do not sell personal information.</p>
<p>We share what is needed with:</p>
<ul>
<li>Stripe (payments and, for photographers, payouts)</li>
<li>Supabase</li>
<li>OpenStreetMap / geocoding</li>
<li>Expo, Apple and Google push services, and Mapbox (for the apps)</li>
<li><strong>OpenAI</strong> (ChatGPT ads measurement only as described in section 10 — hashed email and phone for ad conversion measurement, not raw contact details)</li>
<li><strong>Resend</strong> (newsletter subscriber records and email delivery — email, optional name, and consent timing)</li>
<li>The assigned photographer (address, time, access notes, contact name as needed)</li>
<li>Counsel, accountants, or authorities when required by law</li>
</ul>
<p>Photographers are independent contractors and must keep booking details confidential under the IC agreement.</p>
</section></div>
<div className="legal-body"><section className="block" id="4-where"><h2>4. Where</h2>
<p className="inshort"><strong>In short:</strong> Main app data in Canada; some processors in the United States.</p>
<ul>
<li>Primary app database, authentication, and storage run on Supabase in <strong>Canada</strong>.</li>
<li>Other processors include Stripe and Vercel (<strong>United States</strong>), Expo push delivery and Mapbox for the apps (<strong>United States</strong>), OpenAI for ChatGPT ads measurement when section 10 applies (<strong>United States</strong>), Resend for newsletter email when you subscribe (<strong>United States</strong>), and similar providers listed in section 3.</li>
<li>By using the site you consent to those transfers where needed. We remain accountable under PIPEDA for personal information we collect.</li>
</ul>
</section></div>
<div className="legal-body"><section className="block" id="5-retention"><h2>5. Retention</h2>
<ul>
<li><strong>Booking and payment records:</strong> generally 7 years.</li>
<li><strong>Delivered media:</strong> until delivered plus a limited operational window.</li>
<li><strong>Photographer applications:</strong> while we evaluate or engage you, then as required for records.</li>
<li><strong>Newsletter:</strong> while you stay subscribed; consent and unsubscribe records as required by CASL.</li>
<li><strong>Marketing consent records:</strong> as required by CASL.</li>
<li><strong>App push tokens:</strong> until you delete the account or the token stops working.</li>
<li><strong>On-device saved data:</strong> until you sign out.</li>
<li>Deletion on request unless we must keep a record.</li>
</ul>
</section></div>
<div className="legal-body"><section className="block" id="6-your-rights"><h2>6. Your rights</h2>
<p>Email <a href="mailto:privacy@brxs.ca">privacy@brxs.ca</a> to access, correct, or withdraw consent (subject to legal and booking obligations). You can also delete your account in the Bricks app (see 1A and <Link href="/account-deletion">brxs.ca/account-deletion</Link>). We aim to respond within 30 days. Complaint: Office of the Privacy Commissioner of Canada (<a href="https://www.priv.gc.ca">priv.gc.ca</a>).</p>
</section></div>
<div className="legal-body"><section className="block" id="7-casl-anti-spam"><h2>7. CASL (anti-spam)</h2>
<p className="inshort"><strong>In short:</strong> Marketing only with your express consent. Newsletter uses double opt-in. Easy unsubscribe.</p>
<ul>
<li>Commercial electronic messages only with your express consent under Canada&apos;s anti-spam law (CASL).</li>
<li>Our newsletter uses <strong>double opt-in</strong>: you confirm by email before we send marketing.</li>
<li>Every newsletter has a <strong>one-click unsubscribe</strong> link; you can also email <a href="mailto:privacy@brxs.ca">privacy@brxs.ca</a>.</li>
<li>Transactional booking and application messages are sent as needed to perform the service.</li>
</ul>
</section></div>
<div className="legal-body"><section className="block" id="8-children"><h2>8. Children</h2>
<p>Adults 18+. We do not knowingly collect information from children. Listing media is of property, not of children.</p>
</section></div>
<div className="legal-body"><section className="block" id="9-security"><h2>9. Security</h2>
<p>TLS in transit, access-limited systems. We notify of a PIPEDA-significant breach as required.</p>
</section></div>
<div className="legal-body"><section className="block" id="10-cookies-and-analytics"><h2>10. Cookies and analytics</h2>
<p className="inshort"><strong>In short:</strong> Cookieless Vercel Analytics; Cloudflare for security; optional ChatGPT ads measurement only for ad arrivals (and confirmation if the ad cookie is already set). Quebec (and unknown region) visitors are asked first.</p>
<h3>Vercel Analytics</h3>
<p>This site uses Vercel Analytics to measure aggregate usage. It is cookieless: it does not set cookies, does not build a profile of you, and does not track you across other sites.</p>
<h3>Cloudflare</h3>
<p>Cloudflare helps protect and deliver the site. It may set first-party security cookies such as __cf_ob and cf_clearance for bot protection. Cloudflare Web Analytics may also measure aggregate traffic. These are for security and operations, not advertising.</p>
<h3>Booking source (first-party)</h3>
<p>When you book, we may record whether the visit was organic or paid using a first-party, cookieless source tag on the booking. That tag is not a third-party advertising cookie.</p>
<h3>ChatGPT ads measurement</h3>
<p>We use OpenAI&apos;s measurement pixel to measure visits and bookings that follow a ChatGPT ad. It loads only in these cases:</p>
<ul>
<li>you arrive from a ChatGPT ad (the link includes ?oppref=), or</li>
<li>you reach the booking confirmation page <strong>and</strong> your browser already has our __oppref ad cookie from an earlier ChatGPT ad visit.</li>
</ul>
<p>When it runs, it can set two first-party cookies on brxs.ca:</p>
<ul>
<li>__oppref — about 30 days — stores the ad click ID from the landing URL</li>
<li>__obref — about 365 days — a random browser ID for this site</li>
</ul>
<p>The pixel may send page-view and order events to OpenAI (bzr.openai.com and bzrcdn.openai.com). OpenAI may also set its own cookies (for example Cloudflare __cf_bm and _cfuvid) on OpenAI&apos;s domains.</p>
<h3>Advanced matching</h3>
<p>On the booking confirmation page only (and only when the pixel runs), our code sends OpenAI <strong>only SHA-256 hashes of your email and phone</strong>. We hash them in your browser first. Raw email and phone are not sent to OpenAI for this. Purpose: measure whether a ChatGPT ad led to your booking.</p>
<h3>Checkout and your browser</h3>
<p>Your browser may keep information in session storage for the browsing session. That can include booking or sign-up form progress so you don&apos;t lose your place at checkout, and — when ChatGPT ads measurement applies — your email and phone so we can make the hashes on the confirmation page. Raw email and phone are not sent to OpenAI for matching. Session storage clears when your browsing session ends.</p>
<p>Measurement data may be processed in the <strong>United States</strong>. We remain accountable under PIPEDA for personal information we collect.</p>
<h3>Quebec and unknown location</h3>
<p>If you are in Quebec, or we can&apos;t tell where you are, we ask for your consent before this measurement pixel loads. You can Accept or Refuse. If you Refuse, the pixel stays off and we remember your choice in your browser so we don&apos;t ask again. The short notice shown before it would run uses the same words (English and French prompts in the pixel pack).</p>
<h3>Your choices</h3>
<p>Clear site cookies in your browser, use private browsing, or block cookies for brxs.ca. Email <a href="mailto:privacy@brxs.ca">privacy@brxs.ca</a> to ask us to stop using measurement cookies where we can. Where we ask, refuse on the notice, or email us.</p>
</section></div>
<div className="legal-body"><section className="block" id="11-newsletter-resend"><h2>11. Newsletter (Resend)</h2>
<p className="inshort"><strong>In short:</strong> Double opt-in. Stored and sent through Resend in the United States. Unsubscribe any time.</p>
<p>If you sign up for our newsletter, we collect your email, your name if you give it, and when you consent. We use a double opt-in: you confirm by email before we add you. We use this only to send Bricks news and updates you asked for. Subscriber records and sends go through <strong>Resend</strong> (United States). You can unsubscribe with the link in every newsletter, or email <a href="mailto:privacy@brxs.ca">privacy@brxs.ca</a>. We keep your subscription while you stay subscribed, and keep consent and unsubscribe records as Canada&apos;s anti-spam law (CASL) requires.</p>
</section></div>
<div className="legal-body"><section className="block" id="12-changes"><h2>12. Changes</h2>
<p>Posted on this page and dated.</p>
</section></div>
<div className="legal-body"><section className="block" id="contact" style={{ borderTop: '1px solid var(--hair)' }}><h2>Contact</h2>
<p><a href="mailto:privacy@brxs.ca">privacy@brxs.ca</a> · <a href="mailto:hello@brxs.ca">hello@brxs.ca</a> · (289) 312-7425</p>
<p>Bricks · 6330 Montevideo Road, Mississauga, ON L5N 3V2, Canada</p>
</section></div>

      <style>{legalDocCss}</style>
    </>
  )
}
