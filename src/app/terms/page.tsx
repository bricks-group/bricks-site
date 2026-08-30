import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Bricks — Terms, Refunds & Privacy',
  description: 'Bricks listing-media terms of service, cancellation and refund policy, and privacy policy.',
  alternates: { canonical: '/terms' },
  openGraph: {
    title: 'Bricks — Terms, Refunds & Privacy',
    description: 'Bricks listing-media terms of service, cancellation and refund policy, and privacy policy.',
  },
  twitter: {
    card: 'summary',
    title: 'Bricks — Terms, Refunds & Privacy',
    description: 'Bricks listing-media terms of service, cancellation and refund policy, and privacy policy.',
  },
}

export default function TermsPage() {
  return (
    <>
      <div className="wrap">
        <section className="hero">
          <span className="badge">Legal</span>
          <h1>Terms, refunds &amp; privacy.</h1>
          <p className="sub">Plain-language terms for booking listing media through Bricks during pre-launch.</p>
          <div className="updated">Last updated · 2026-07-20</div>
          <div className="draft-note"><b>Note:</b> this is a first draft written to cover what the booking flow actually does today (full payment at booking, data collected in the form, Stripe as payment processor). It has not been reviewed by a lawyer. Treat it as a starting point, not a finished legal document, until it&apos;s been reviewed.</div>
        </section>
      </div>

      <div className="wrap">
        <section className="block" id="terms">
          <h2>Terms of Service</h2>
          <p>These terms cover bookings made through the Bricks pre-launch site (this direct-booking flow) for listing media — photography, drone, floor plans, video, and 3D tours — in the Greater Toronto Area.</p>
          <h3>Booking &amp; payment</h3>
          <p>Booking a shoot requires full payment, including HST, at the time of booking to lock your slot. Pricing is quoted live from the property address and selected package; the quote shown at checkout is the amount charged.</p>
          <h3>Scheduling</h3>
          <p>After payment, you&apos;ll pick a shoot time via our calendar or confirm a preferred date directly with us. We aim to confirm every booking within one business day.</p>
          <h3>Delivery</h3>
          <p>Edited media is delivered within 24–48 hours of the shoot. If a shoot can&apos;t be completed as scheduled (weather, site access, etc.), we&apos;ll contact you to reschedule at no extra charge.</p>
          <h3>Changes to these terms</h3>
          <p>Bricks is in active pre-launch development. These terms may be updated as the platform and its policies are finalized; the version in effect at the time of your booking applies to that booking.</p>
        </section>
      </div>

      <div className="wrap">
        <section className="block" id="refunds">
          <h2>Cancellation &amp; Refund Policy</h2>
          <p>We know plans change. If you need to reschedule or cancel:</p>
          <ul>
            <li>Contact <a href="mailto:booking@brxs.ca">booking@brxs.ca</a> as soon as you know — the earlier you tell us, the more options we have.</li>
            <li>Rescheduling to a new date/time is free with reasonable notice.</li>
            <li>Cancellations are handled case by case. If we haven&apos;t yet dispatched a photographer or incurred costs for your shoot, we&apos;ll issue a full refund. If a cancellation comes with little notice after a photographer has already been scheduled or has traveled to the property, a partial refund may apply to cover that cost.</li>
            <li>If we&apos;re unable to complete your shoot for reasons on our end (weather, scheduling error, equipment issue), you&apos;ll receive a full refund or a free rescheduled shoot — your choice.</li>
          </ul>
          <p>Refunds are issued back to your original payment method via Stripe and typically appear within 5-10 business days.</p>
        </section>
      </div>

      <div className="wrap">
        <section className="block" id="privacy">
          <h2>Privacy Policy</h2>
          <h3>What we collect</h3>
          <p>When you book a shoot, we collect your name, brokerage, email, phone number, the property address, and shoot preferences (package, add-ons, preferred date). Payment is processed by Stripe — we do not see or store your card details. If you sign up for launch updates, we collect your email address.</p>
          <h3>How we use it</h3>
          <ul>
            <li>To confirm, schedule, and deliver your booked shoot</li>
            <li>To contact you about that booking (confirmations, delivery, rescheduling)</li>
            <li>To send you Bricks launch updates and listing-media news, only if you opted in — you can unsubscribe at any time</li>
            <li>To generate an anonymized quote (address, property type, and size are used to estimate pricing; this lookup uses OpenStreetMap&apos;s public geocoding service)</li>
          </ul>
          <h3>Who we share it with</h3>
          <p>Stripe (payment processing), Cal.com (scheduling), and Supabase (our database host) process data on our behalf to run the booking flow. We don&apos;t sell your information to anyone.</p>
          <h3>Your choices</h3>
          <p>Email <a href="mailto:booking@brxs.ca">booking@brxs.ca</a> to access, correct, or delete the information we hold about you, or to unsubscribe from emails. Marketing emails include an unsubscribe link and are sent in line with Canada&apos;s Anti-Spam Legislation (CASL).</p>
        </section>
      </div>

      <div className="wrap">
        <section className="block" style={{ borderTop: '1px solid var(--hair)' }}>
          <h2>Questions?</h2>
          <p>Email <a href="mailto:booking@brxs.ca">booking@brxs.ca</a> or call <span className="mono">343-453-4578</span>.</p>
        </section>
      </div>

      <style>{`
        .wrap{max-width:760px;margin:0 auto;padding:0 36px;}
        .hero{padding:44px 0 20px;}
        .hero h1{font-weight:500;font-size:34px;letter-spacing:-1px;color:var(--ink);}
        .hero p.sub{font-size:15px;color:var(--ink-2);margin-top:12px;max-width:560px;}
        .updated{font-family:'Ioskeley Mono',monospace;font-size:11px;color:var(--ink-4);margin-top:10px;}
        .draft-note{background:var(--brick-tint);border:1px solid var(--brick-soft);border-radius:2px;
          padding:16px 18px;margin:22px 0 0;font-size:13px;color:var(--ink-2);line-height:1.55;}
        .draft-note b{color:var(--brick-deep);}
        section.block{padding:36px 0;border-top:1px solid var(--hair);}
        section.block h2{font-weight:500;font-size:22px;letter-spacing:-0.4px;color:var(--ink);margin-bottom:14px;}
        section.block h3{font-weight:500;font-size:16px;color:var(--ink);margin:20px 0 8px;}
        section.block p{margin-bottom:12px;color:var(--ink-2);}
        section.block ul{margin:0 0 12px 20px;color:var(--ink-2);}
        section.block li{margin-bottom:6px;}
        section.block a{color:var(--brick-deep);}
      `}</style>
    </>
  )
}
