import type { Metadata } from 'next'
import Link from 'next/link'
import { legalDocCss } from '@/components/legalDocCss'
import { VIRTUAL_STAGING_ENABLED } from '@/lib/pricing'
import { OG_IMAGE } from '@/lib/og'

export const metadata: Metadata = {
  title: 'Bricks — Terms of Service',
  description: 'Bricks listing-media terms of service and cancellation policy. Contracting party: Bricks Group. Effective 27 August 2026.',
  alternates: { canonical: '/terms' },
  openGraph: { images: [OG_IMAGE],
    title: 'Bricks — Terms of Service',
    description: 'Bricks listing-media terms of service and cancellation policy. Contracting party: Bricks Group.',
  },
  twitter: {
    card: 'summary',
    title: 'Bricks — Terms of Service',
    description: 'Bricks listing-media terms of service and cancellation policy. Contracting party: Bricks Group.',
  },
}

export default function TermsPage() {
  return (
    <>
      <section className="hero">
        <div className="wrap">
          <span className="badge">Legal</span>
          <h1>Terms of Service</h1>
          <p className="sub">Client / booking terms for listing media through brxs.ca. Contracting party: Bricks Group.</p>
          <div className="updated">Effective · 27 August 2026</div>
        </div>
      </section>

      <div className="legal-body">
        <section className="block" id="terms">
          <h2>BRICKS TERMS OF SERVICE (client / booking)</h2>
          <p>Effective: August 27, 2026<br />Contracting party: Bricks Group (&quot;Bricks&quot;)<br />Governing law: Ontario, Canada</p>
          <p>These terms cover listing-media bookings made through brxs.ca (photography, drone, floor plans, video, virtual tours, twilight, and related add-ons) in the areas Bricks serves. Virtual visit is a paid add-on at $249 / $299 / $349 / $399 by footprint. It is charged in online checkout and is not included in any package.{VIRTUAL_STAGING_ENABLED ? ' Virtual staging is $35 per photo, charged in online checkout and not included in any package.' : ''} By paying for a booking you agree to these terms, the cancellation policy, and the <Link href="/privacy">privacy policy</Link>.</p>
          <p>Bricks Group is the party you are contracting with for the media package you buy. Photographers who shoot for Bricks are independent contractors of Bricks, not your employees and not a separate party to your booking. Bricks remains responsible to you for delivery of the package, subject to these terms.</p>

          <h3>1. Authority and access</h3>
          <p>You represent that you are at least 18 and that you have lawful authority to book media of the property (as owner, listing agent, or with the owner&apos;s authorization). You will arrange access for the shoot window: occupants, pets, lockbox, and any condo or site rules. You will tell us about occupied rooms, children, or access limits in the booking notes. You are responsible for occupant consent. We do not photograph occupants or children as a deliverable.</p>
          <p>If you lack authority, or access is refused on the day, we may treat it as a client cancellation inside 24 hours under section 5 (no refund). There is no callout fee on top.</p>

          <h3>2. Booking and payment</h3>
          <p>You pay the quoted amount in full, including HST, at checkout via Stripe to lock the slot. The quote shown at pay is the contract price for the selected package and add-ons. Prices are CAD. We do not store full card numbers.</p>

          <h3>3. Scheduling</h3>
          <p>After payment, the date and clock time you booked are held on our systems and sent to the photographer (not via a third-party calendar). If that time cannot be honoured on our side, we will reschedule or refund per section 5.</p>

          <h3>4. Delivery</h3>
          <p>Photos are typically delivered within 24 hours of the shoot; other media within 24–48 hours. Times are targets, not guarantees. Weather, airspace, site access, equipment failure, or third-party processing can delay. Drone may be skipped if Transport Canada, NAV CANADA, weather, or the site makes it unsafe or unlawful; the rest of the paid ground package is still delivered, and we will refund the drone add-on if it was separately charged and could not be shot.</p>
          <p>Deliverables are licensed as in section 6. Download and keep copies. We are not a long-term archive once your files have been delivered.</p>
        </section>
      </div>

      <div className="legal-body">
        <section className="block" id="site-progress">
          <h2>Site Progress (builders &amp; developers)</h2>
          <p>One-off progress visits and mapped captures are billed per visit at the price shown when you order. Monitoring plans are billed monthly in advance per site, month to month, through Stripe; cancel any time from billing, effective at the end of the paid month. Mapped plans include a one-time setup charge on the first capture. Prices are CAD plus HST.</p>
          <p>Commercial site work is assigned only to vetted pilots holding a Transport Canada Advanced Operations certificate and drone liability insurance (their own or Bricks&apos; company policy) verified by Bricks: at least $2,000,000 per occurrence, or the higher minimum you set on the order (for example $5,000,000 under CCDC 41). On request, Bricks provides the certificate of insurance covering the flight before it happens.</p>
          <p>Flights depend on weather, airspace (including NAV CANADA authorization), and site access and safety rules. A visit that cannot be flown safely is rescheduled within the same billing month where possible.</p>
        </section>
      </div>

      <div className="legal-body">
        <section className="block" id="refunds">
          <h2>5. Reschedule, cancellation, refunds</h2>
          <p>Contact <a href="mailto:help@brxs.ca">help@brxs.ca</a> as soon as you know.</p>
          <p>Reschedule 24 hours or more before the shoot window: free.</p>
          <p>Reschedule inside 24 hours: we will try; if we cannot, section 5 cancellation rules apply.</p>
          <p>Your cancellation (or no-access / no-show on your side):</p>
          <ul>
            <li>24 hours or more before the shoot window: full refund to the original payment method.</li>
            <li>Inside 24 hours, or no-show / no access: no refund.</li>
            <li>There is no callout fee on any cancellation.</li>
          </ul>
          <p>If we cancel, fail to attend, or cannot complete the shoot for reasons on our side (including weather that makes a safe shoot impossible and no reschedule you accept): full refund or a free reshoot, your choice.</p>
          <p>Refunds via Stripe typically show in 5–10 business days. Nothing in this section limits rights you have that cannot be waived under Ontario&apos;s Consumer Protection Act, 2002, if that Act applies to you.</p>
        </section>
      </div>

      <div className="legal-body">
        <section className="block">
          <h3>6. Intellectual property</h3>
          <p>Bricks owns copyright in the deliverables (assigned from the photographer). When your booking is paid in full, Bricks grants you a perpetual, non-exclusive licence to use those deliverables for real estate marketing of that property: MLS, web, social, print, brokerage materials, and sharing with the seller for that listing. You may not sell the files as stock, or use them to market a different property.</p>
          <p>Bricks and the photographer may use deliverables in portfolio and Bricks marketing unless you email <a href="mailto:help@brxs.ca">help@brxs.ca</a> before the shoot asking that the property be kept unpublished by us.</p>
          <p>You keep ownership of listing copy, branding, and materials you upload. You grant Bricks a limited licence to use the address and listing details to perform the booking.</p>

          <h3>7. No property-sale warranty</h3>
          <p>Media is produced to a professional listing standard. We do not warrant that it will result in a listing, showing, or sale, or that every possible defect of the property is depicted.</p>

          <h3>8. Liability</h3>
          <p>To the maximum extent Ontario and Canadian law allow, Bricks&apos; total liability for a booking is the amount you paid for that booking. We are not liable for lost commissions, lost sale, or other indirect or consequential loss. We do not exclude liability for fraud, gross negligence, or bodily injury we cause, or any liability the law does not allow to be limited.</p>

          <h3>9. Indemnity</h3>
          <p>You will indemnify Bricks against claims arising from your lack of authority to book or grant access, or from occupant or owner claims that you were responsible for arranging access or consent.</p>
        </section>
      </div>

      <div className="legal-body">
        <section className="block" id="privacy">
          <h2>10. Privacy</h2>
          <p>We collect the name, brokerage, email, phone, property address, and shoot details you submit, plus payment metadata from Stripe. We use it to quote, charge, schedule, shoot, deliver, and support the booking, and for records we must keep (including tax). We share what is needed with Stripe, our database host (Supabase), and the assigned photographer. We do not sell your information. Email <a href="mailto:privacy@brxs.ca">privacy@brxs.ca</a> to access, correct, or delete what we hold, subject to records we must keep. Marketing email is only if you opted in, with unsubscribe, under CASL. Full detail is at <Link href="/privacy">brxs.ca/privacy</Link>.</p>
        </section>
      </div>

      <div className="legal-body">
        <section className="block">
          <h3>11. Changes</h3>
          <p>We may update these terms. The version in effect when you pay applies to that booking. Material changes will be posted on this page.</p>

          <h3>12. Law</h3>
          <p>Ontario law and applicable Canadian federal law govern. Ontario courts have exclusive jurisdiction. Email <a href="mailto:hello@brxs.ca">hello@brxs.ca</a> with disputes; we will try to resolve in 30 days.</p>
        </section>
      </div>

      <div className="legal-body">
        <section className="block" id="plans">
          <h2>13. Software plans (Bricks subscriptions)</h2>
          <p>Sections 1 to 12 cover media bookings and Site Progress work. This section covers Bricks software subscriptions sold on <Link href="/pricing">brxs.ca/pricing</Link>: the solo plans Clay (free), Keystone ($49/month), Marble ($99/month), and Diamond ($149/month), and office seats billed per seat per year (from $300 to $708 per seat per year, by office size). Annual solo plans are billed once a year at ten months&apos; price for twelve months of access. Prices are in CAD and exclude HST, which is added at checkout.</p>
          <h3>Billing and renewal</h3>
          <p>Paid plans are charged through Stripe at the start of each billing cycle and renew automatically at the then-current price until cancelled. Any price change is posted on the pricing page before it takes effect at your next renewal.</p>
          <h3>Cancellation</h3>
          <p>You can cancel at any time through the Stripe billing portal (in the app, under Billing) or by emailing <a href="mailto:help@brxs.ca">help@brxs.ca</a>. Cancellation takes effect at the end of the current billing cycle; you keep access until then and the plan does not renew.</p>
          <h3>Refunds</h3>
          <p>Subscription fees are not refundable for a billing cycle that has already started, except where the law requires it. If we discontinue a plan, or cancel your subscription without cause partway through a paid cycle, we will refund the unused portion of that cycle. Media bookings are refunded under section 5, not this section.</p>
          <h3>Free plan</h3>
          <p>Clay is free. We may change or withdraw the free plan on reasonable notice posted on this page.</p>
        </section>
      </div>

      <div className="legal-body">
        <section className="block" style={{ borderTop: '1px solid var(--hair)' }}>
          <h2>Questions?</h2>
          <p>Email <a href="mailto:hello@brxs.ca">hello@brxs.ca</a> · <span className="mono">(289) 312-7425</span></p>
          <p>Bricks Group · Mississauga, Ontario, Canada</p>
        </section>
      </div>

      <style>{legalDocCss}</style>
    </>
  )
}
