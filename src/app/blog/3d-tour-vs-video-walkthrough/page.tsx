import type { Metadata } from 'next'
import BlogPostLayout from '@/components/BlogPostLayout'
import { REEL_RANGE, TOUR_RANGE, VISIT_PRICE_LABEL, FOOTPRINT_BANDS } from '@/lib/pricing'
import { TOUR_BLURB, TOUR_NAME, VISIT_BLURB, VISIT_NAME, VISIT_PACKAGING } from '@/lib/brand'
import { LOGO_SCHEMA, ORG_REF } from '@/lib/schema'

export const metadata: Metadata = {
  title: 'Virtual tour vs. video walkthrough: which sells listings faster? | Bricks',
  description: 'When a path-confined virtual tour beats a cinematic video walkthrough — and when the reverse is true. Virtual visit (Gaussian splat) is a separate product.',
  alternates: { canonical: '/blog/3d-tour-vs-video-walkthrough' },
  robots: { index: true, follow: true },
  openGraph: {
    type: 'article',
    title: 'Virtual tour vs. video walkthrough: which sells listings faster?',
    description: 'When a virtual tour beats a cinematic reel — and when the reverse is true. Virtual visit is a separate product.',
  },
  twitter: {
    title: 'Virtual tour vs. video walkthrough',
    description: 'When to use a virtual tour vs a video walkthrough. Virtual visit is a separate free-roam splat.',
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
            headline: 'Virtual tour vs. video walkthrough: which sells listings faster?',
            description: 'When a path-confined virtual tour beats a cinematic video walkthrough — and when the reverse is true. Virtual visit is a separate product.',
            author: { '@type': 'Person', name: 'Raphael Merchant' },
            datePublished: '2026-07-22',
            dateModified: '2026-07-22',
            publisher: { ...ORG_REF, logo: LOGO_SCHEMA },
            mainEntityOfPage: 'https://www.brxs.ca/blog/3d-tour-vs-video-walkthrough',
            keywords: 'virtual tour vs video walkthrough, real estate video, Matterport-style walkthrough, Gaussian splat virtual visit',
          }),
        }}
      />
      <BlogPostLayout
        badge="Resources · Strategy"
        title="Virtual tour vs. video walkthrough: which sells faster?"
        sub="They're not the same product. Here's when to spend on a path-confined virtual tour, when a cinematic reel does the job, and why a virtual visit is something else entirely."
      >
        <p className="lead">Agents often treat &quot;{TOUR_NAME.toLowerCase()}&quot;, &quot;{VISIT_NAME.toLowerCase()}&quot;, and &quot;video walkthrough&quot; as interchangeable. They&apos;re not. A {TOUR_NAME.toLowerCase()} is path-confined. A {VISIT_NAME.toLowerCase()} is a free-roam Gaussian splat — never a tour. A reel sells the feeling in 30–45 seconds.</p>

        <h2>What each one actually is</h2>
        <h3>{TOUR_NAME}</h3>
        <p>{TOUR_BLURB} Click to move room to room along the captured path. Delivered as an interactive embed on the listing and often MLS-ready. Best for letting serious buyers pre-screen a property before a showing. À la carte add-on; included in Showcase and Full suite.</p>
        <h3>{VISIT_NAME}</h3>
        <p>{VISIT_BLURB} {VISIT_PACKAGING} {VISIT_PRICE_LABEL} on the same bands as photo, reel, and virtual tour ({FOOTPRINT_BANDS}). Published at $249 / $299 / $349 / $399 by footprint — never bundled into a package, and charged at checkout when selected.</p>
        <h3>Video walkthrough / cinematic reel</h3>
        <p>A produced, set to music, paced edit — usually 30–90 seconds. It&apos;s an emotional asset: it makes the home feel desirable and is built for social, portals, and the top of a listing page. It sells the <em>lifestyle</em>, not the measurements.</p>

        <h2>Use a {TOUR_NAME.toLowerCase()} when…</h2>
        <ul>
          <li><strong>The home is large or unusual in layout</strong> — estates, multiplexes, custom builds. Buyers want to understand the flow before driving out.</li>
          <li><strong>You&apos;re pre-qualifying showings</strong> — a {TOUR_NAME.toLowerCase()} filters out the merely-curious and brings serious, informed buyers to open houses.</li>
          <li><strong>The buyer pool is remote or relocating</strong> — out-of-town and overseas buyers lean on a walkthrough they can run themselves.</li>
          <li><strong>The listing will sit a while</strong> — a {TOUR_NAME.toLowerCase()} keeps working 24/7 as a self-serve open house.</li>
        </ul>

        <h2>Use a cinematic reel when…</h2>
        <ul>
          <li><strong>You need attention fast</strong> — a reel is built for the scroll: social, portals, email blasts. It earns the click.</li>
          <li><strong>The home photographs on feeling</strong> — light, views, design. Video shows that better than any still or scan.</li>
          <li><strong>The listing is straightforward</strong> — a tidy semi or condo doesn&apos;t need a navigable model; a strong reel plus HDR does the work.</li>
          <li><strong>You&apos;re on a budget</strong> — a reel is usually cheaper than a full spatial capture and punches above its weight on reach.</li>
        </ul>

        <h2>The honest answer: most listings want both, in order</h2>
        <p>For a typical Canadian detached, the highest-converting combo is <strong>HDR photos + a cinematic reel for reach</strong>, then <strong>a {TOUR_NAME.toLowerCase()} if the home is large, high-value, or has a remote buyer pool</strong>. Add a {VISIT_NAME.toLowerCase()} when free-roam matters — it is never packaged. You don&apos;t have to decide blindly — at Bricks the reel and {TOUR_NAME.toLowerCase()} are separate à la carte add-ons.</p>

        <blockquote>&quot;A reel gets them to the listing. A {TOUR_NAME.toLowerCase()} gets them to the front door. A {VISIT_NAME.toLowerCase()} lets them walk the space without a path. Most homes only need the first; the rest earn their keep on the bigger ones.&quot;</blockquote>

        <h2>Cost reality (2026)</h2>
        <ul>
          <li>Cinematic reel: {REEL_RANGE} add-on, by footprint.</li>
          <li>{TOUR_NAME}: {TOUR_RANGE}, path-confined, MLS-ready.</li>
          <li>{VISIT_NAME}: {VISIT_PRICE_LABEL} ({FOOTPRINT_BANDS}). {VISIT_PACKAGING}</li>
        </ul>
        <p>Both are modest next to the cost of a price reduction from a stale listing. The mistake isn&apos;t spending — it&apos;s spending on the wrong one for the property.</p>

        <h2>FAQ</h2>
        <div className="faq">
          <div className="qa"><h4>Is a {TOUR_NAME.toLowerCase()} the same as a floor plan?</h4><p>No. A floor plan is a flat dimensioned drawing (included on every Bricks standard shoot). A {TOUR_NAME.toLowerCase()} is path-confined and spatial but isn&apos;t a substitute for a measured plan. A {VISIT_NAME.toLowerCase()} is a free-roam splat — never a tour.</p></div>
          <div className="qa"><h4>Which helps SEO / portals more?</h4><p>Listings with both rich media types get more saves and views on major portals; the reel drives initial engagement, the {TOUR_NAME.toLowerCase()} extends time-on-listing.</p></div>
          <div className="qa"><h4>Can I use the reel on social?</h4><p>Yes — the cinematic reel is formatted for Instagram, TikTok, and Realtor.ca embeds. That&apos;s its main job.</p></div>
        </div>
      </BlogPostLayout>
    </>
  )
}
