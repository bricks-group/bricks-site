import type { Metadata } from 'next'
import { OS_LOGIN } from '@/lib/brand'
import { ORG_REF, SITE_ID } from '@/lib/schema'
import { Head, Rows, Close } from '@/components/calm/Calm'
import { OG_IMAGE } from '@/lib/og'

export const metadata: Metadata = {
  title: 'About Bricks — software for Canadian real estate',
  description: "Meet Bricks, subscription software for Canadian real estate. Manage your work in one place, with listing media and Site Progress services booked inside.",
  alternates: { canonical: '/about' },
  openGraph: { images: [OG_IMAGE],
    type: 'website',
    title: 'About Bricks',
    description: "Meet Bricks, subscription software for Canadian real estate. Manage your work in one place, with listing media and Site Progress services booked inside.",
    url: 'https://www.brxs.ca/about',
  },
  twitter: {
    card: 'summary',
    title: 'About Bricks',
    description: "Meet Bricks, subscription software for Canadian real estate. Manage your work in one place, with listing media and Site Progress services booked inside.",
  },
}

const posts = [
  { href: '/blog/canada-real-estate-photography-cost-2026', title: 'How much does real estate photography cost in Canada? (2026)' },
  { href: '/blog/3d-tour-vs-video-walkthrough', title: 'Virtual tour vs. video walkthrough: which sells faster?' },
  { href: '/blog/drone-photography-rules-ontario', title: 'Drone photography rules for real estate in Ontario' },
]

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'AboutPage',
            url: 'https://www.brxs.ca/about',
            about: ORG_REF,
            isPartOf: { '@id': SITE_ID },
          }),
        }}
      />

      <section className="hero">
        <div className="wrap">
          <h1>About Bricks.</h1>
          <p className="sub">The system that brings it all together for Canadian real estate.</p>
        </div>
      </section>

      <section className="cm-sec ab-story" aria-label="Our story">
        <p>We build software for the companies that make real estate: builders, developers and investors, and the brokerages and realtors who sell what they build.</p>
        <p>Projects, listings and deals live in one place. When a site needs a progress visit or a listing needs media, you book it inside Bricks, and the files land where the work is.</p>
      </section>

      <section className="cm-sec" aria-label="What we do">
        <Head title="What we do." />
        <Rows
          items={[
            { title: 'Software', detail: 'Deals, CRM, e-sign and site files in one system.', href: '/platform' },
            { title: 'Site Progress', detail: 'Maps, models and reports for every site, compared over time.', href: '/builders' },
            { title: 'Listing media', detail: 'Photos, drone, video and 3D, delivered to the listing.', href: '/media' },
          ]}
        />
      </section>

      <section className="cm-sec" aria-label="Guides">
        <Head title="Guides." link={{ href: '/blog', label: 'All guides' }} />
        <Rows items={posts.map((p) => ({ title: p.title, href: p.href }))} />
      </section>

      <Close title="See it for yourself." href={OS_LOGIN} label="Try Bricks free" external />

      <style>{`
        .ab-story{padding-top:24px;}
        .ab-story p{font-size:clamp(18px,1vw + 12px,22px);line-height:1.45;color:var(--vs-fg);max-width:34ch;margin:0 0 16px;letter-spacing:-.01em;}
        .ab-story p + p{color:var(--vs-fg-2);}
        .ab-story{max-width:var(--container);}
        @media (min-width:900px){.ab-story p{max-width:44ch;}}
      `}</style>
    </>
  )
}
