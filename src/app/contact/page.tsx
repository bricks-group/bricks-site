import type { Metadata } from 'next'
import ContactForm from './ContactForm'

export const metadata: Metadata = {
  title: 'Contact Bricks | GTA real estate media',
  description: 'Contact Bricks for GTA listing media — HDR photography, licensed drone, floor plans, 3D tours. Email booking@brxs.ca or call 343-453-4578. Booked direct, delivered in 24–48 hours.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact Bricks | GTA real estate media',
    description: 'GTA listing media — HDR photo, licensed drone, floor plans, 3D tours. Booked direct, delivered in 24–48 hours.',
  },
  twitter: {
    title: 'Contact Bricks | GTA real estate media',
    description: 'GTA listing media — booked direct, delivered in 24–48 hours.',
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
            description: 'Contact Bricks for GTA real estate listing media.',
            url: 'https://www.brxs.ca/contact',
            mainEntity: {
              '@type': 'Organization',
              name: 'Bricks',
              email: 'booking@brxs.ca',
              telephone: '+1-343-453-4578',
              areaServed: 'Greater Toronto Area',
            },
          }),
        }}
      />

      <section className="hero">
        <div className="wrap">
          <span className="badge">Contact</span>
          <h1>Let&apos;s shoot your next listing.</h1>
          <p className="sub">Direct booking, one standard, MLS-ready media in 24–48 hours across the GTA. Reach out and we&apos;ll confirm the slot and send pricing by footprint.</p>
        </div>
      </section>

      <section className="block">
        <div className="wrap">
          <div className="contact-grid">
            <div className="c"><div className="l">Email</div><div className="v"><a href="mailto:booking@brxs.ca">booking@brxs.ca</a></div></div>
            <div className="c"><div className="l">Phone</div><div className="v"><a href="tel:+13434534578">343-453-4578</a></div></div>
            <div className="c"><div className="l">Service area</div><div className="v">Greater Toronto Area</div></div>
            <div className="c"><div className="l">Turnaround</div><div className="v">Edited &amp; delivered in 24–48h</div></div>
          </div>

          <div className="sec-head" style={{ marginTop: 8 }}>
            <div><span className="over">Send a note</span><h2>Quick message.</h2></div>
          </div>
          <ContactForm />
        </div>
      </section>

      <style>{`
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
