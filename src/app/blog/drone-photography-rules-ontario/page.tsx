import Link from 'next/link'
import type { Metadata } from 'next'
import BlogPostLayout from '@/components/BlogPostLayout'
import { LOGO_SCHEMA, ORG_REF, faqPageSchema } from '@/lib/schema'
import { OG_IMAGE } from '@/lib/og'
import { DRONE_PILOT_LINE } from '@/lib/content/facts'
import { postMeta } from '@/lib/content/posts'

const SLUG = 'drone-photography-rules-ontario'
const META = postMeta(SLUG)
const TITLE = 'Drone photography rules for real estate in Ontario'
const DESC = 'The Transport Canada rules behind a real estate drone shot in Ontario: the 250 g line, Basic and Advanced certificates, controlled airspace, height limits and the 2025 changes.'

// Visible FAQ and FAQPage JSON-LD come from this one array.
const FAQS: { q: string; a: string; link?: { href: string; label: string } }[] = [
  { q: 'Do I need a drone pilot certificate to shoot a listing?', a: 'If the drone weighs 250 g or more, yes, and the drone must be registered and marked. The rules are the same whether the flight is for work or for fun. Drones under 250 g need no certificate but must follow the microdrone rules.' },
  { q: 'Is a Basic certificate enough for real estate?', a: 'Only if the whole flight stays in uncontrolled airspace and more than 30 m from anyone not involved. Most homes have neighbours, a street or an airport nearby, so most listing flights need an Advanced certificate.' },
  { q: 'What if the home is near an airport?', a: 'It is probably in controlled airspace. The pilot needs an Advanced certificate and a flight authorization from NAV CANADA, requested through NAV Drone, before flying.' },
  { q: 'Who flies Bricks drone shoots?', a: `${DRONE_PILOT_LINE} If the rules, the airspace or the weather make a flight unsafe or unlawful on the day, the pilot skips the aerials and the rest of the shoot is still delivered.` },
]

export const metadata: Metadata = {
  title: `${TITLE} | Bricks`,
  description: DESC,
  alternates: { canonical: `/blog/${SLUG}` },
  robots: { index: true, follow: true },
  openGraph: { images: [OG_IMAGE], type: 'article', title: TITLE, description: DESC },
  twitter: { title: TITLE, description: DESC },
}

export default function Post() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: TITLE,
            description: DESC,
            author: { '@type': 'Organization', name: 'Bricks', url: 'https://www.brxs.ca' },
            datePublished: META.published,
            dateModified: META.reviewedOn,
            publisher: { ...ORG_REF, logo: LOGO_SCHEMA },
            mainEntityOfPage: `https://www.brxs.ca/blog/${SLUG}`,
            keywords: 'drone photography rules Ontario, real estate drone Toronto, Transport Canada drone certificate, NAV CANADA drone authorization',
          }),
        }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema(FAQS.map(({ q, a }) => ({ q, a })))) }} />
      <BlogPostLayout
        slug={SLUG}
        badge="Resources · Drone"
        title={TITLE}
        sub="What Transport Canada requires for a listing aerial, in plain words, with links to the rules."
      >
        <p className="lead">Drone rules in Canada are set by Transport Canada and apply the same way whether you fly for work or for fun. Here is what matters for a real estate shoot in Ontario.</p>

        <h2>The 250 g line</h2>
        <p>If a drone weighs 250 g or more, the pilot needs a Transport Canada drone pilot certificate, and the drone must be registered and marked with its registration number. Under 250 g, no certificate or registration is needed, but the microdrone rules still apply.</p>

        <h2>Basic or Advanced</h2>
        <p>A <strong>Basic</strong> certificate covers flights in uncontrolled airspace, more than 30 m (measured horizontally) from anyone not involved in the flight. An <strong>Advanced</strong> certificate adds flying in controlled airspace with permission and flying closer to people. Both also need a drone whose maker has declared it meets Transport Canada’s safety requirements for that kind of flight.</p>
        <p>A listing usually has neighbours, a street and sometimes an airport nearby, so most real estate flights fall outside Basic limits. For the exams and how to apply, see our <Link href="/blog/drone-licence-canada">drone licence guide</Link>.</p>

        <h2>Controlled airspace</h2>
        <p>Much of the GTA sits in controlled airspace around Pearson, Billy Bishop and other airports and heliports. To fly there, an Advanced pilot requests an RPAS flight authorization from NAV CANADA, through the NAV Drone app or website, and flies only once it is granted. A careful pilot checks every address before the shoot.</p>

        <h2>Height and sight</h2>
        <p>Drones must stay at or below 122 m (400 ft) above ground. Within 61 m of a building, the limit is 30 m above that building. The pilot or a visual observer must keep the drone in sight, unless the flight is one of the specific operations the rules allow.</p>

        <h2>What changed in November 2025</h2>
        <p>New rules took effect on 4 November 2025. Advanced pilots can now fly <strong>sheltered operations</strong>: close to a building, no more than 30 m above it and within 61 m of it, still at least 30 m from people not involved. The same update added a Level 1 Complex certificate for some flights beyond visual line of sight. Listing shoots don’t need it.</p>

        <h2>Other laws still apply</h2>
        <p>Transport Canada reminds pilots to respect privacy and trespassing laws. Condo buildings and some sites also have their own rules about flying, so ask before you book.</p>

        <h2>How Bricks handles it</h2>
        <p>{DRONE_PILOT_LINE} The pilot checks the airspace for the address, requests NAV CANADA authorization when it is needed, and decides on the day whether the flight is safe. Booking aerials for a listing? See <Link href="/drone-photography">real estate drone photography</Link>.</p>
        <p style={{ fontSize: 14, color: 'var(--inkMute)' }}>This guide is a plain summary, not legal advice. The links below are the rules themselves.</p>

        <h2>FAQ</h2>
        <div className="faq">
          {FAQS.map((f) => <div className="qa" key={f.q}><h3>{f.q}</h3><p>{f.a}{f.link ? <> <a href={f.link.href}>{f.link.label}</a></> : null}</p></div>)}
        </div>
      </BlogPostLayout>
    </>
  )
}
