import type { Metadata } from 'next'
import BlogPostLayout from '@/components/BlogPostLayout'
import { REEL_RANGE, TOUR_RANGE, TWILIGHT_RANGE, RUSH_FLAT, VISIT_PRICE_LABEL, FOOTPRINT_BANDS } from '@/lib/pricing'
import { TOUR_BLURB, TOUR_NAME, VISIT_BLURB, VISIT_NAME, VISIT_PACKAGING } from '@/lib/brand'
import { LOGO_SCHEMA, ORG_REF, faqPageSchema } from '@/lib/schema'
import { OG_IMAGE } from '@/lib/og'

// Visible FAQ and FAQPage JSON-LD come from this one array (W2 handoff 3.5).
const FAQS: { q: string; a: string; link?: { href: string; label: string } }[] = [
  { q: 'Is the floor plan really included?', a: 'Yes — every Bricks standard shoot includes a dimensioned floor plan at no extra charge. Photos only drops drone and the floor plan.' },
  { q: 'What if I only want photos, no drone?', a: 'Licensed drone is part of the core set because it’s the highest-impact frame for most homes; if a listing genuinely doesn’t suit aerials, tell us at booking and we’ll tailor the shoot.' },
  { q: 'How many photos do I get?', a: 'It scales with footprint — a condo gets fewer frames than an estate. You’ll see the full set in the delivery gallery; tell us if you need a specific count for a portal.' },
]

export const metadata: Metadata = {
  title: "What a Professional Listing Photo Shoot Includes | Bricks",
  description: "See what a Bricks standard listing shoot includes: HDR photos, licensed drone and a floor plan, plus delivery targets and optional media for your listing.",
  alternates: { canonical: '/blog/whats-included-listing-shoot' },
  robots: { index: true, follow: true },
  openGraph: { images: [OG_IMAGE],
    type: 'article',
    title: "What a Professional Listing Photo Shoot Includes | Bricks",
    description: "See what a Bricks standard listing shoot includes: HDR photos, licensed drone and a floor plan, plus delivery targets and optional media for your listing.",
  },
  twitter: {
    title: "What a Professional Listing Photo Shoot Includes | Bricks",
    description: "See what a Bricks standard listing shoot includes: HDR photos, licensed drone and a floor plan, plus delivery targets and optional media for your listing.",
  },
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
            headline: "What's included in a professional listing photo shoot?",
            description: 'The core set every Bricks standard listing shoot ships: HDR photography, licensed drone, floor plan, photos in 24h and other media on a 24–48h target — plus the add-ons you can stack.',
            author: { '@type': 'Organization', name: 'Bricks', url: 'https://www.brxs.ca' },
            datePublished: '2026-07-22',
            dateModified: '2026-07-22',
            publisher: { ...ORG_REF, logo: LOGO_SCHEMA },
            mainEntityOfPage: 'https://www.brxs.ca/blog/whats-included-listing-shoot',
            keywords: "what's included in real estate photo shoot, listing media package, professional listing photography Canada",
          }),
        }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema(FAQS.map(({ q, a }) => ({ q, a })))) }} />
      <BlogPostLayout
        badge="Resources · The shoot"
        title="What's included in a professional listing photo shoot?"
        sub="Every Bricks standard shoot ships the same core set. Here's exactly what you get — and the add-ons you can stack on top."
      >
        <p className="lead">A listing shoot shouldn&apos;t be a mystery. At Bricks, every standard shoot — regardless of footprint — ships the same core set, then you add what the property needs. Photos only drops drone and the floor plan. No tier guessing, no padded package.</p>

        <h2>The core set (included on every standard shoot)</h2>
        <h3>HDR photography</h3>
        <p>Exposure-bracketed, blended interiors and exteriors — the standard for MLS®-ready listing photos. Shot to show the space accurately, not just brightly. Volume scales with footprint (more rooms = more frames).</p>
        <h3>Licensed drone coverage</h3>
        <p>Aerial exteriors and approach shots, flown under a Transport Canada <strong>Advanced RPAS certificate</strong> with the right airspace clearance. This is the &quot;wow&quot; frame for most homes and is included, not extra.</p>
        <h3>Floor plan</h3>
        <p>A clean, dimensioned floor plan — included on every standard shoot. Buyers reference it constantly; portals surface it prominently.</p>
        <h3>24-hour photo delivery</h3>
        <p>Edited, MLS®-ready files delivered to your inbox within two business days, with a gallery link for download.</p>

        <h2>Add-ons you can stack</h2>
        <ul>
          <li><strong>Cinematic reel</strong> (+{REEL_RANGE}) — a 30–45s motion reel for social and the listing page. Best for reach.</li>
          <li><strong>{TOUR_NAME}</strong> (+{TOUR_RANGE}) — {TOUR_BLURB} MLS®-ready. À la carte add-on; included in Showcase and Full suite.</li>
          <li><strong>{VISIT_NAME}</strong> ({VISIT_PRICE_LABEL}) — {VISIT_BLURB} Same bands as photo, reel, and virtual tour ({FOOTPRINT_BANDS}). {VISIT_PACKAGING}</li>
          <li><strong>Twilight photography</strong> (+{TWILIGHT_RANGE}) — blue-hour exteriors with lit windows. Best for premium listings.</li>
          <li><strong>Rush delivery</strong> (+${RUSH_FLAT}) — faster than the standard window (photos 24h · other media 24–48h).</li>
        </ul>

        <h2>How a shoot actually runs</h2>
        <ol>
          <li><strong>Book:</strong> pick your services and a date; we confirm the slot and quote travel up front.</li>
          <li><strong>Shoot:</strong> on-site typically 60–90 minutes depending on footprint.</li>
          <li><strong>Edit:</strong> HDR blend, drone straighten/colour-match, floor plan drafted.</li>
          <li><strong>Deliver:</strong> gallery + download — photos in 24h, other media on a 24–48h target.</li>
        </ol>

        <h2>What you don&apos;t pay for</h2>
        <p>You don&apos;t pay for a &quot;Premium&quot; or &quot;Luxury&quot; tier you didn&apos;t need. The core set is the core set; the add-ons are optional. {VISIT_NAME} is never bundled into Premium or any other package. Your quote is the sum of what you booked, sized to the property — that&apos;s the whole point of à la carte.</p>

        <blockquote>&quot;One standard, every time: HDR, licensed drone, and a floor plan. The reel and {TOUR_NAME.toLowerCase()} are there when the listing calls for them. {VISIT_NAME} is always extra.&quot;</blockquote>

        <h2>FAQ</h2>
        <div className="faq">
          {FAQS.map((f) => <div className="qa" key={f.q}><h3>{f.q}</h3><p>{f.a}{f.link ? <> <a href={f.link.href}>{f.link.label}</a></> : null}</p></div>)}
        </div>
      </BlogPostLayout>
    </>
  )
}
