import type { Metadata } from 'next'
import Link from 'next/link'
import { legalDocCss } from '@/components/legalDocCss'
import { VIRTUAL_STAGING_ENABLED } from '@/lib/pricing'
import { OG_IMAGE } from '@/lib/og'
import { SUPPLIER } from '@/lib/supplier'

const DESC = 'Bricks listing-media terms of service and cancellation policy, in short sections. Full refund when you cancel 24 hours or more before your shoot.'

export const metadata: Metadata = {
  title: 'Bricks — Terms of Service',
  description: DESC,
  alternates: { canonical: '/terms' },
  openGraph: { images: [OG_IMAGE], title: 'Bricks — Terms of Service', description: DESC },
  twitter: { card: 'summary', title: 'Bricks — Terms of Service', description: DESC },
}

export default function TermsPage() {
  return (
    <>
      <section className="hero">
        <div className="wrap">
          <span className="badge">Legal</span>
          <h1>Terms of Service</h1>
          <p className="sub">Booking terms for listing media through brxs.ca, in short sections you can scan.</p>
          <div className="updated">Last updated · 21 November 2026</div>
        </div>
      </section>

<div className="legal-body"><section className="block" id="summary"><h2>Summary</h2>
<p>These terms cover listing-media bookings on brxs.ca (photography, drone, floor plans, video, virtual tours, twilight, and related add-ons) in the areas Bricks serves, plus Site Progress and software plans where noted. By paying for a booking you agree to these terms, the cancellation rules, and the <Link href="/privacy">privacy policy</Link>.</p>
<p>Photographers and other vendors who work for Bricks are <strong>independent contractors</strong>. They are not your employees and are not a separate party to your booking. Bricks remains responsible to you for delivery of the package, subject to these terms.</p>
</section></div>
<div className="legal-body"><section className="block" id="who"><h2>Who you are contracting with</h2>
<p className="inshort"><strong>In short:</strong> One supplier, easy to reach, with the tax number on every receipt.</p>
<ul>
<li><strong>Supplier:</strong> {SUPPLIER.legalPartyLine} (&quot;Bricks&quot;).</li>
<li><strong>Premises address:</strong> 6330 Montevideo Road, Mississauga, ON L5N 3V2, Canada</li>
<li><strong>Phone:</strong> (289) 312-7425</li>
<li><strong>Email:</strong> <a href="mailto:hello@brxs.ca">hello@brxs.ca</a> (bookings and support: <a href="mailto:help@brxs.ca">help@brxs.ca</a>)</li>
<li><strong>GST/HST registration number:</strong> 798370003 RT0001</li>
<li><strong>Governing law:</strong> Ontario, Canada</li>
</ul></section></div>
<div className="legal-body"><section className="block" id="1-authority-and-access"><h2>1. Authority and access</h2><p className="inshort"><strong>In short:</strong> You must be 18+ and allowed to book the property. You arrange access. No access on the day can mean no refund.</p><details><summary>Read the details</summary>
<ul>
<li>You represent that you are at least 18 and that you have lawful authority to book media of the property (as owner, listing agent, or with the owner&apos;s authorization).</li>
<li>You arrange access for the shoot window: occupants, pets, lockbox, and any condo or site rules.</li>
<li>Tell us about occupied rooms, children, or access limits in the booking notes. You are responsible for occupant consent.</li>
<li>We do not photograph occupants or children as a deliverable.</li>
<li>If you lack authority, or access is refused on the day, we may treat it as a cancellation less than 24 hours before the shoot window under section 5 (no refund). There is no callout fee on top.</li>
</ul>
</details></section></div>
<div className="legal-body"><section className="block" id="2-booking-and-payment"><h2>2. Booking and payment</h2><p className="inshort"><strong>In short:</strong> You pay the full quote (including tax) at checkout through Stripe. That quote is the contract price.</p><details><summary>Read the details</summary>
<ul>
<li>You pay the quoted amount in full, including <strong>applicable GST/HST</strong>, determined under the applicable place-of-supply rules, at checkout via <strong>Stripe</strong> to lock the slot.</li>
<li>Bricks&apos; GST/HST registration number is <strong>798370003 RT0001</strong>. It is shown on every invoice and receipt.</li>
<li>The quote shown at pay is the contract price for the selected package and add-ons. Prices are in CAD.</li>
<li>We do not store full card numbers.</li>
<li>Virtual visit is a paid add-on at the prices shown at checkout. It is not included in any package. {VIRTUAL_STAGING_ENABLED ? ' Virtual staging is $35 per photo, charged in online checkout and not included in any package.' : ''}</li>
</ul>
</details></section></div>
<div className="legal-body"><section className="block" id="3-scheduling"><h2>3. Scheduling</h2><p className="inshort"><strong>In short:</strong> After payment, your date and time are held and sent to the photographer.</p><details><summary>Read the details</summary>
<ul>
<li>After payment, the date and clock time you booked are held on our systems and sent to the photographer (not via a third-party calendar).</li>
<li>If that time cannot be honoured on our side, we will reschedule or refund per section 5.</li>
</ul>
</details></section></div>
<div className="legal-body"><section className="block" id="4-delivery"><h2>4. Delivery</h2><p className="inshort"><strong>In short:</strong> Photos usually within 24 hours; other media 24–48 hours. Targets, not guarantees. Weather or rules may stop part of a package — see section 5.</p><details><summary>Read the details</summary>
<ul>
<li>Photos are typically delivered within 24 hours of the shoot; other media within 24–48 hours. Times are targets, not guarantees.</li>
<li>Weather, airspace, site access, equipment failure, or third-party processing can delay.</li>
<li>Drone or other parts may be skipped if Transport Canada, NAV CANADA, weather, or the site makes them unsafe or unlawful. The rest of the paid package is still delivered, and we refund the part we could not shoot, as section 5 (&quot;Weather and safety&quot;) explains.</li>
<li>Deliverables are licensed as in section 6. Download and keep copies. We are not a long-term archive once your files have been delivered.</li>
</ul>
</details></section></div>
<div className="legal-body"><section className="block" id="site-progress-builders-and-developers"><h2>Site Progress (builders and developers)</h2><p className="inshort"><strong>In short:</strong> Per-visit or monthly plans. Flights need certified pilots and verified liability cover. Weather and airspace can force a reschedule.</p><details><summary>Read the details</summary>
<ul>
<li>One-off progress visits and mapped captures are billed per visit at the price shown when you order.</li>
<li>Monitoring plans are billed monthly in advance per site, month to month, through Stripe. Cancel any time from billing, effective at the end of the paid month.</li>
<li>Mapped plans include a one-time setup charge on the first capture.</li>
<li>Prices are CAD plus <strong>applicable GST/HST</strong>.</li>
<li>Commercial site work is assigned only to vetted pilots holding a Transport Canada Advanced Operations certificate and drone liability insurance verified by Bricks: at least $2,000,000 per occurrence, or the higher minimum you set on the order (for example $5,000,000 under CCDC 41). On request, Bricks provides the certificate of insurance covering the flight before it happens.</li>
<li>Flights depend on weather, airspace (including NAV CANADA authorization), and site access and safety rules. A visit that cannot be flown safely is rescheduled within the same billing month where possible.</li>
</ul>
</details></section></div>
<div className="legal-body"><section className="block" id="5-reschedule-cancellation-refunds"><span id="refunds" /><h2>5. Reschedule, cancellation, refunds</h2><p className="inshort"><strong>In short:</strong> Cancel 24 hours or more before the shoot window → full refund. Less than 24 hours or no-show → no refund. No callout fee. If we cancel → full refund or free reshoot. Weather can refund part of a package.</p><details><summary>Read the details</summary>
<p>Email <a href="mailto:help@brxs.ca">help@brxs.ca</a> as soon as you know. All times are the property&apos;s local time.</p>
<h3>Rescheduling</h3>
<ul>
<li><strong>24 hours or more</strong> before the start of your shoot window: free.</li>
<li><strong>Less than 24 hours</strong> before: we&apos;ll try. If we can&apos;t find a new time, the cancellation rules below apply.</li>
</ul>
<h3>If you cancel</h3>
<ul>
<li><strong>24 hours or more</strong> before the start of your shoot window: full refund to your original payment method.  <br />Example: for a shoot window starting at 10:00 a.m. Wednesday, cancel by 10:00 a.m. Tuesday.</li>
<li><strong>Less than 24 hours</strong> before, or a no-show or no access on your side: no refund.</li>
<li>There is <strong>no callout fee</strong> on any cancellation.</li>
</ul>
<h3>If we cancel or can&apos;t finish</h3>
<p>If we cancel, don&apos;t attend, or can&apos;t complete the shoot for reasons on our side, you choose: a <strong>full refund</strong> or a <strong>free reshoot</strong>.</p>
<h3>Weather and safety</h3>
<ul>
<li>If weather or safety stops the <strong>whole</strong> shoot, the rule above applies: a full refund or a free reshoot, your choice.</li>
<li>If weather or safety stops <strong>part</strong> of your package (for example, the drone in Essentials, or twilight), we deliver the rest and <strong>refund that part</strong>.</li>
<li>The refund is that part&apos;s add-on price for your property&apos;s size on the day you booked (see the pricing page), plus the HST you paid on it.</li>
<li>Bricks decides on the day whether it&apos;s safe and lawful to fly or shoot.</li>
</ul>
<p>Refunds through Stripe usually show in 5–10 business days. Nothing in this section limits rights you have under Ontario&apos;s <em>Consumer Protection Act, 2002</em> that can&apos;t be waived, if that Act applies to you.</p>
</details></section></div>
<div className="legal-body"><section className="block" id="6-intellectual-property"><h2>6. Intellectual property</h2><p className="inshort"><strong>In short:</strong> Bricks owns the copyright. After full payment you get a licence to market that property. Portfolio use unless you opt out before the shoot.</p><details><summary>Read the details</summary>
<ul>
<li>Bricks owns copyright in the deliverables (assigned from the photographer).</li>
<li>When your booking is paid in full, Bricks grants you a perpetual, non-exclusive licence to use those deliverables for real estate marketing of that property: MLS, web, social, print, brokerage materials, and sharing with the seller for that listing.</li>
<li>You may not sell the files as stock, or use them to market a different property.</li>
<li>Bricks may use deliverables in portfolio and Bricks marketing unless you email <a href="mailto:help@brxs.ca">help@brxs.ca</a> before the shoot asking that the property be kept unpublished by us.</li>
<li>You keep ownership of listing copy, branding, and materials you upload. You grant Bricks a limited licence to use the address and listing details to perform the booking.</li>
</ul>
</details></section></div>
<div className="legal-body"><section className="block" id="7-no-property-sale-warranty"><h2>7. No property-sale warranty</h2><p className="inshort"><strong>In short:</strong> Great media helps, but we can&apos;t promise a sale.</p><details><summary>Read the details</summary>
<p>Media is produced to a professional listing standard. We do not warrant that it will result in a listing, showing, or sale, or that every possible defect of the property is depicted.</p>
</details></section></div>
<div className="legal-body"><section className="block" id="8-liability"><h2>8. Liability</h2><p className="inshort"><strong>In short:</strong> Cap = what you paid for that booking, as far as the law allows.</p><details><summary>Read the details</summary>
<ul>
<li>To the maximum extent Ontario and Canadian law allow, Bricks&apos; total liability for a booking is the amount you paid for that booking.</li>
<li>We are not liable for lost commissions, lost sale, or other indirect or consequential loss.</li>
<li>We do not exclude liability for fraud, gross negligence, or bodily injury we cause, or any liability the law does not allow to be limited.</li>
<li>Rights under the <em>Consumer Protection Act, 2002</em> that can&apos;t be waived still apply if that Act applies to you.</li>
</ul>
</details></section></div>
<div className="legal-body"><section className="block" id="9-indemnity"><h2>9. Indemnity</h2><p className="inshort"><strong>In short:</strong> You cover claims that come from not having the right to book or give access.</p><details><summary>Read the details</summary>
<p>You will indemnify Bricks against claims arising from your lack of authority to book or grant access, or from occupant or owner claims that you were responsible for arranging access or consent.</p>
</details></section></div>
<div className="legal-body"><section className="block" id="10-privacy"><h2>10. Privacy</h2><p className="inshort"><strong>In short:</strong> We use your details to run your booking and never sell them. Full policy is on the Privacy page.</p><details><summary>Read the details</summary>
<p>We collect the name, brokerage, email, phone, property address, and shoot details you submit, plus payment metadata from Stripe. We use it to quote, charge, schedule, shoot, deliver, and support the booking, and for records we must keep (including tax). We share what is needed with Stripe, our database host (Supabase), and the assigned photographer. We do not sell your information. Email <a href="mailto:privacy@brxs.ca">privacy@brxs.ca</a> to access, correct, or delete what we hold, subject to records we must keep. Marketing email is only if you opted in, with unsubscribe, under CASL. Full detail: <Link href="/privacy">brxs.ca/privacy</Link>.</p>
</details></section></div>
<div className="legal-body"><section className="block" id="11-changes-and-transfer"><h2>11. Changes and transfer</h2><p className="inshort"><strong>In short:</strong> We may update these terms. The version you paid under applies to your booking.</p><details><summary>Read the details</summary>
<ul>
<li>We may update these terms. The version in effect when you pay applies to that booking. Material changes will be posted on this page.</li>
<li><strong>Transfer to a company.</strong> Bricks may transfer these terms, and any booking or plan under them, to a corporation that takes over the Bricks business. We&apos;ll tell you before it happens. Your rights under these terms don&apos;t change because of the transfer.</li>
</ul>
</details></section></div>
<div className="legal-body"><section className="block" id="12-law"><h2>12. Law</h2><p className="inshort"><strong>In short:</strong> Ontario law applies. Email help@brxs.ca and we&apos;ll try to settle any dispute within 30 days.</p><details><summary>Read the details</summary>
<p>Ontario law and applicable Canadian federal law govern. Ontario courts have exclusive jurisdiction. Email <a href="mailto:help@brxs.ca">help@brxs.ca</a> with disputes; we will try to resolve in 30 days. (General enquiries: <a href="mailto:hello@brxs.ca">hello@brxs.ca</a>.)</p>
</details></section></div>
<div className="legal-body"><section className="block" id="13-software-plans-bricks-subscriptions"><h2>13. Software plans (Bricks subscriptions)</h2><p className="inshort"><strong>In short:</strong> Sections 1–12 cover media and Site Progress. This section covers software subscriptions on <Link href="/pricing">brxs.ca/pricing</Link>.</p><details><summary>Read the details</summary>
<ul>
<li>Solo plans: Clay (free), Keystone ($49/month), Marble ($99/month), Diamond ($149/month).</li>
<li>Office seats: billed per seat per year (from $300 to $708 per seat per year, by office size).</li>
<li>Annual solo plans: billed once a year at ten months&apos; price for twelve months of access.</li>
<li>Prices are CAD and exclude GST/HST, which is added at checkout under the applicable place-of-supply rules.</li>
</ul>
<h3>Billing and renewal</h3>
<p>Paid plans are charged through Stripe at the start of each billing cycle and renew automatically at the then-current price until cancelled. Any price change is posted on the pricing page before it takes effect at your next renewal.</p>
<h3>Cancellation</h3>
<p>Cancel any time through the Stripe billing portal (in the app, under Billing) or by emailing <a href="mailto:help@brxs.ca">help@brxs.ca</a>. Cancellation takes effect at the end of the current billing cycle; you keep access until then and the plan does not renew.</p>
<h3>Refunds</h3>
<p>Subscription fees are not refundable for a billing cycle that has already started, except where the law requires it. If we discontinue a plan, or cancel your subscription without cause partway through a paid cycle, we will refund the unused portion of that cycle. Media bookings are refunded under section 5, not this section.</p>
<h3>Free plan</h3>
<p>Clay is free. We may change or withdraw the free plan on reasonable notice posted on this page.</p>
</details></section></div>
<div className="legal-body"><section className="block" id="questions" style={{ borderTop: '1px solid var(--hair)' }}><h2>Questions?</h2>
<p>Email <a href="mailto:hello@brxs.ca">hello@brxs.ca</a> · (289) 312-7425</p>
<p>Bricks · 6330 Montevideo Road, Mississauga, ON L5N 3V2, Canada</p>
</section></div>

      <style>{legalDocCss}</style>
    </>
  )
}
