import type { Metadata } from 'next'
import BlogPostLayout from '@/components/BlogPostLayout'
import { PHOTO_RATE, DRONE_RATE, REEL_RANGE, TOUR_RANGE, TWILIGHT_RANGE, RUSH_FLAT, bandCells, VISIT_PRICE_LABEL, FOOTPRINT_BANDS } from '@/lib/pricing'
import { TOUR_NAME, VISIT_NAME, VISIT_PACKAGING } from '@/lib/brand'
import { LOGO_SCHEMA, ORG_REF } from '@/lib/schema'
import { OG_IMAGE } from '@/lib/og'

export const metadata: Metadata = {
  title: "GTA Real Estate Photography & Media Costs, 2026 | Bricks",
  description: "Compare 2026 GTA real estate photography and media costs, including HDR photos, drone, floor plans, tours and video, and learn what affects your quote.",
  alternates: { canonical: '/blog/gta-real-estate-media-cost-2026' },
  robots: { index: true, follow: true },
  openGraph: { images: [OG_IMAGE],
    type: 'article',
    title: "GTA Real Estate Photography & Media Costs, 2026 | Bricks",
    description: "Compare 2026 GTA real estate photography and media costs, including HDR photos, drone, floor plans, tours and video, and learn what affects your quote.",
  },
  twitter: {
    title: "GTA Real Estate Photography & Media Costs, 2026 | Bricks",
    description: "Compare 2026 GTA real estate photography and media costs, including HDR photos, drone, floor plans, tours and video, and learn what affects your quote.",
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
            headline: 'How much does real estate photography cost in the GTA? (2026 pricing guide)',
            description: 'What GTA agents pay for HDR photography, drone, floor plans, virtual tours and video, with real market ranges.',
            author: { '@type': 'Organization', name: 'Bricks', url: 'https://www.brxs.ca' },
            datePublished: '2026-07-22',
            dateModified: '2026-07-22',
            publisher: { ...ORG_REF, logo: LOGO_SCHEMA },
            mainEntityOfPage: 'https://www.brxs.ca/blog/gta-real-estate-media-cost-2026',
            keywords: 'real estate photography cost GTA, GTA listing media pricing, Toronto real estate photographer price',
          }),
        }}
      />
      <BlogPostLayout
        badge="Resources · Pricing"
        title="How much does real estate photography cost in the GTA? (2026)"
        sub="A straight look at what listing agents actually pay for HDR photos, drone, floor plans, virtual tours and video — and what moves the number. Regional GTA market ranges below; Bricks is a Canadian listing-media company."
      >
        <p>Looking for the national frame first? Read the Canada-wide companion: <a href="/blog/canada-real-estate-photography-cost-2026">How much does real estate photography cost in Canada? (2026)</a>. Product page: <a href="/real-estate-photography">Real estate photography &amp; listing photos</a>.</p>

        <p className="lead">Most GTA agents don&apos;t buy a single &quot;photo package&quot; — they buy a combination of services, and the price follows the property&apos;s footprint, the services booked, and how far the shoot is from base. Here&apos;s the 2026 market, then how Bricks prices it à la carte.</p>

        <h2>The GTA market at a glance (2026)</h2>
        <p>Across Greater Toronto Area providers, à la carte rates land in these ranges (CAD, before HST):</p>
        <ul>
          <li><strong>HDR photography:</strong> $149 (budget à la carte) up to ~$329 for premium full-service shoots. Typical mid-market is $200–$289.</li>
          <li><strong>Drone photos:</strong> $39 for a few frames, $100–$149 for a proper set. Drone <em>video</em> runs $90–$250.</li>
          <li><strong>Floor plans:</strong> almost always $99–$149, and frequently included.</li>
          <li><strong>Virtual tour (path-confined):</strong> $149 entry (phone-scanned) up to $300+ for a Matterport-style capture. This is not a virtual visit.</li>
          <li><strong>Cinematic / walkthrough video:</strong> $169 budget, $289–$400 typical, $525+ for high-end.</li>
          <li><strong>Social reel:</strong> $149–$200.</li>
          <li><strong>Twilight:</strong> $175–$225 for a real blue-hour shoot; some providers offer a digital twilight for ~$25 per image.</li>
        </ul>
        <p>The takeaway: a competent <strong>photo + drone + floor plan</strong> shoot for a typical detached home in this market runs roughly <strong>$250–$550</strong> before tax, and a full media set with video and a virtual tour lands $500–$900.</p>

        <h2>What actually drives the price</h2>
        <h3>1. Footprint</h3>
        <p>Bigger homes take longer to shoot and edit. Most providers tier by finished area: small (condo / town), mid (typical detached), large, and XL (estate / multiplex). This is the single biggest lever on photo and drone cost.</p>
        <h3>2. Services booked</h3>
        <p>Every add-on is optional. A floor plan is often included; a virtual tour, twilight, and rush delivery are usually extra. A virtual visit is always extra and never packaged. The more you stack, the higher the total — but you only pay for what the listing needs.</p>
        <h3>3. Travel</h3>
        <p>Many GTA providers include a free radius (25–50 km from base) and charge per kilometre beyond. Bricks includes the first 25 km from the assigned photographer’s base and charges $0.75/km after — confirmed at assignment, never a surprise.</p>
        <h3>4. Turnaround</h3>
        <p>Standard photo delivery is 24 hours. Other media targets 24–48 hours. Rush is a flat add-on aimed at faster than that window — not a same-day guarantee.</p>

        <h2>How Bricks prices it</h2>
        <p>Instead of fixed tiers, Bricks quotes à la carte and tailors each booking:</p>
        <ul>
          <li>HDR photography: <strong>{bandCells(PHOTO_RATE).join(' / ')}</strong> by footprint (small → XL)</li>
          <li>Licensed drone: <strong>{bandCells(DRONE_RATE).join(' / ')}</strong> by footprint</li>
          <li>Floor plan: <strong>included</strong> on every standard shoot</li>
          <li>Cinematic reel: <strong>+{REEL_RANGE}</strong></li>
          <li>{TOUR_NAME}: <strong>+{TOUR_RANGE}</strong></li>
          <li>{VISIT_NAME}: <strong>{VISIT_PRICE_LABEL}</strong> ({FOOTPRINT_BANDS}) — {VISIT_PACKAGING}</li>
          <li>Twilight: <strong>+{TWILIGHT_RANGE}</strong></li>
          <li>Rush: <strong>+${RUSH_FLAT}</strong></li>
          <li>Travel: first 25 km free, <strong>$0.75/km</strong> after · HST 13% added at checkout</li>
        </ul>
        <p>Your final quote is the sum of what you actually book, sized to the property — so you never pay for a tier you didn&apos;t need. <a href="/pricing">See the full menu →</a></p>

        <h2>Don&apos;t over-pay for the package</h2>
        <p>If a listing is a tidy semi with great light, you don&apos;t need the estate tier. If it&apos;s a 5,000 sq ft home with a pool, the budget tier will under-serve it. The right move is to match services to the property — which is exactly what a tailored à la carte quote does.</p>

        <blockquote>&quot;You already spend $200–$600 per listing on media, stitched together from whoever&apos;s available. One shoot, one standard, booked direct.&quot;</blockquote>

        <h2>FAQ</h2>
        <div className="faq">
          <div className="qa"><h3>Is HST included?</h3><p>No — media pricing is almost always quoted pre-tax. Bricks adds 13% HST at checkout.</p></div>
          <div className="qa"><h3>Why is drone sometimes cheap and sometimes $250?</h3><p>A few static drone photos is a quick add; a licensed operator shooting aerial <em>video</em> with a Transport Canada Advanced RPAS certificate is a different skill and liability — that&apos;s the premium end.</p></div>
          <div className="qa"><h3>Do I save by booking regularly?</h3><p>Yes. Agents and teams with a steady pipeline get per-shoot rates tuned to their volume. Ask when you book.</p></div>
        </div>
      </BlogPostLayout>
    </>
  )
}
