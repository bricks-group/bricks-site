import type { Metadata } from 'next'
import ContactForm from './ContactForm'
import { AREA_SERVED_SCHEMA, COVERAGE_LINE } from '@/lib/brand'
import { ORG_REF } from '@/lib/schema'

export const metadata: Metadata = {
  title: 'Contact Bricks | Canadian real estate media',
  description: 'Contact Bricks for Canadian listing media — HDR photography, licensed drone, floor plans, with optional virtual tour and virtual visit. Email help@brxs.ca or call 343-453-4578. For listing shoots use booking@brxs.ca.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact Bricks | Canadian real estate media',
    description: 'Listing media for Canadian real estate: HDR photos, licensed drone and floor plans.',
  },
  twitter: {
    title: 'Contact Bricks | Canadian real estate media',
    description: 'Listing media for Canadian real estate.',
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
              email: 'help@brxs.ca',
              telephone: '+1-343-453-4578',
              areaServed: AREA_SERVED_SCHEMA,
            },
          }),
        }}
      />

      <section className="hero">
        <div className="wrap">
          <span className="badge">Contact</span>
          <h1>Let&apos;s shoot your next listing.</h1>
          <p className="sub">Tell us about the listing. We&apos;ll confirm coverage and send pricing.</p>
          <p className="sub product-hint">Asking about the software? Say so in your note.</p>
        </div>
      </section>

      <section className="block" style={{paddingBottom: 32}}>
        <div className="wrap">
          <div className="contact-grid">
            <div className="c"><div className="l">General</div><div className="v"><a href="mailto:help@brxs.ca">help@brxs.ca</a></div></div>
            <div className="c"><div className="l">Bookings</div><div className="v"><a href="mailto:booking@brxs.ca">booking@brxs.ca</a></div></div>
            <div className="c"><div className="l">Phone</div><div className="v"><a href="tel:+13434534578">343-453-4578</a></div></div>
            <div className="c"><div className="l">Service area</div><div className="v">Canada-wide</div></div>
          </div>

          <div className="sec-head" style={{ marginTop: 8 }}>
            <div><span className="over">Message</span><h2>Send us a note.</h2></div>
          </div>
          <ContactForm />
        </div>
      </section>

      <style>{`
        .product-hint{margin-top:14px;font-size:14px;color:var(--inkMute);max-width:520px;}
        .contact-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:1px;background:var(--hair);
          border:1px solid var(--hair);border-radius:2px;margin:28px 0 34px;}
        .contact-grid .c{background:var(--paper);padding:22px 24px;}
        .contact-grid .c .l{font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.14em;
          text-transform:uppercase;color:var(--inkMute);}
        .contact-grid .c .v{font-weight:500;font-size:17px;color:var(--ink);margin-top:8px;line-height:1.35;}
        .contact-grid .c .v a{color:var(--brickDeep);text-decoration:none;}
        .contact-grid .c .v a:hover{text-decoration:underline;text-underline-offset:2px;}
        @media (max-width:680px){ .contact-grid{grid-template-columns:1fr;} }
      `}</style>
    </>
  )
}

