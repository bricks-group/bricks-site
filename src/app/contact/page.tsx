import type { Metadata } from 'next'
import ContactForm from './ContactForm'
import { AREA_SERVED_SCHEMA, COVERAGE_LINE } from '@/lib/brand'
import { ORG_REF } from '@/lib/schema'
import { OG_IMAGE } from '@/lib/og'

export const metadata: Metadata = {
  title: "Contact Bricks for Software, Bookings & Support | Canada",
  description: "Contact Bricks about software, listing media or Site Progress: support, general and privacy emails, or a note about your property or account.",
  alternates: { canonical: '/contact' },
  openGraph: { images: [OG_IMAGE],
    title: "Contact Bricks for Software, Bookings & Support | Canada",
    description: "Contact Bricks about software, listing media or Site Progress: support, general and privacy emails, or a note about your property or account.",
  },
  twitter: {
    title: "Contact Bricks for Software, Bookings & Support | Canada",
    description: "Contact Bricks about software, listing media or Site Progress: support, general and privacy emails, or a note about your property or account.",
  },
}

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ContactPage',
            name: 'Contact Bricks',
            description: 'Contact Bricks for Canadian real estate listing media.',
            url: 'https://www.brxs.ca/contact',
            mainEntity: {
              ...ORG_REF,
              email: 'hello@brxs.ca',
              telephone: '+12893127425',
              areaServed: AREA_SERVED_SCHEMA,
            },
          }),
        }}
      />

      <section className="hero">
        <div className="wrap">
          <span className="badge">Contact</span>
          <h1>Let&apos;s talk about your next step.</h1>
          <p className="sub">Ask about Bricks software, your account or services booked inside it, including listing media, Virtual Visit and Site Progress.</p>
          <p className="sub product-hint">For a property enquiry, include the address and the service you need so we can check coverage and help you plan the visit.</p>
        </div>
      </section>

      <section className="block">
        <div className="wrap">
          <div className="contact-grid">
            <div className="c"><div className="l">Support</div><div className="v"><a href="mailto:help@brxs.ca">help@brxs.ca</a></div><p>For help with your account, a booking or delivered media. Include a booking reference if you have one.</p></div>
            <div className="c"><div className="l">General enquiries</div><div className="v"><a href="mailto:hello@brxs.ca">hello@brxs.ca</a></div><p>For general questions about Bricks software, listing media, Virtual Visit or Site Progress services.</p></div>
            <div className="c"><div className="l">Work with Bricks</div><div className="v"><a href="mailto:careers@brxs.ca">careers@brxs.ca</a></div><p>For vendor and job applications: photographers, pilots, inspectors, stagers, cleaners and other trades.</p></div>
            <div className="c"><div className="l">Privacy</div><div className="v"><a href="mailto:privacy@brxs.ca">privacy@brxs.ca</a></div><p>For questions about personal information or to make a privacy request. Do not include passwords or payment details.</p></div>
            <div className="c"><div className="l">Phone</div><div className="v"><a href="tel:+12893127425">(289) 312-7425</a></div></div>
            <div className="c"><div className="l">Service area</div><div className="v">Canada-wide</div></div>
          </div>

          <div className="sec-head">
            <div><span className="over">Message</span><h2>Send us a note.</h2></div>
          </div>
          <ContactForm />
        </div>
      </section>

      <style>{`
        .product-hint{margin-top:16px;font-size:14px;color:var(--inkMute);max-width:520px;}
        .contact-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:1px;background:var(--hair);
          border:1px solid var(--hair);border-radius:2px;margin:0 0 var(--sec-half);}
        .contact-grid .c{background:var(--paper);padding:var(--card-pad);}
        .contact-grid .c p{font-size:14px;line-height:1.6;color:var(--inkMute);margin-top:12px;}
        .contact-grid .c:last-child:nth-child(odd){grid-column:1 / -1;}
        .contact-grid .c .l{font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:0;
          text-transform:none;color:var(--inkMute);}
        .contact-grid .c .v{font-weight:500;font-size:17px;color:var(--ink);margin-top:8px;line-height:1.35;}
        .contact-grid .c .v a{display:inline-flex;align-items:center;min-height:44px;color:var(--brickDeep);text-decoration:none;}
        .contact-grid .c .v a:hover{text-decoration:underline;text-underline-offset:2px;}
        @media (max-width:680px){ .contact-grid{grid-template-columns:1fr;} }
      `}</style>
    </>
  )
}

