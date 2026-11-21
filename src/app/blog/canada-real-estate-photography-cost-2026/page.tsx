import type { Metadata } from 'next'
import Link from 'next/link'
import BlogPostLayout from '@/components/BlogPostLayout'
import {
  PHOTO_RATE, DRONE_RATE, REEL_RANGE, TOUR_RANGE, TWILIGHT_RANGE, RUSH_FLAT, bandCells, FOOTPRINT_BANDS,
  PHOTO_RANGE, REEL_RATE, TOUR_RATE, TWILIGHT_RATE, VISIT_RATE, BAND_LABELS, FLOOR_PLAN_ONLY_RATE, CORE_FROM,
} from '@/lib/pricing'
import { sumRates } from '@/lib/landing'
import { CITY_PAGES } from '@/lib/city-pages'
import { TOUR_NAME, VISIT_NAME } from '@/lib/brand'
import { LOGO_SCHEMA, ORG_REF, faqPageSchema } from '@/lib/schema'
import { OG_IMAGE, OG_IMAGE_URL } from '@/lib/og'
import { DELIVERY_LINE, DRONE_PILOT_LINE, TAX_LINE, TRAVEL_LINE, VISIT_PLAIN, BOOKING_LINE } from '@/lib/content/facts'
import { postMeta } from '@/lib/content/posts'

const SLUG = 'canada-real-estate-photography-cost-2026'
const META = postMeta(SLUG)
const TITLE = 'What real estate photography costs in Canada'
const DESC = 'What moves the price of listing photos, drone, floor plans and tours in Canada, and the full Bricks price table by home size.'

const cad = (n: number) => `$${n.toLocaleString('en-CA')}`
const ESSENTIALS = sumRates(PHOTO_RATE, DRONE_RATE)
const STORY = sumRates(PHOTO_RATE, DRONE_RATE, REEL_RATE)
const SHOWCASE = sumRates(PHOTO_RATE, DRONE_RATE, REEL_RATE, TOUR_RATE)
const SUITE = sumRates(PHOTO_RATE, DRONE_RATE, REEL_RATE, TOUR_RATE, TWILIGHT_RATE)
const RATE_ROWS: { name: string; cells: string[] }[] = [
  { name: 'HDR photos', cells: bandCells(PHOTO_RATE) },
  { name: 'Licensed drone (add-on)', cells: bandCells(DRONE_RATE) },
  { name: 'Cinematic reel (add-on)', cells: bandCells(REEL_RATE) },
  { name: `${TOUR_NAME} (add-on)`, cells: bandCells(TOUR_RATE) },
  { name: 'Twilight (add-on)', cells: bandCells(TWILIGHT_RATE) },
  { name: `${VISIT_NAME} (booked on its own)`, cells: bandCells(VISIT_RATE) },
  { name: 'Essentials: photos + drone + floor plan', cells: ESSENTIALS.map(cad) },
  { name: 'Story: Essentials + reel', cells: STORY.map(cad) },
  { name: `Showcase: Story + ${TOUR_NAME.toLowerCase()}`, cells: SHOWCASE.map(cad) },
  { name: 'Full suite: Showcase + twilight', cells: SUITE.map(cad) },
]

const FAQS: { q: string; a: string }[] = [
  { q: 'How much do listing photos cost with Bricks?', a: `HDR listing photos are ${PHOTO_RANGE} by home size. Essentials, with photos, drone and a floor plan, starts at $${CORE_FROM}. ${TAX_LINE}` },
  { q: 'Does Bricks charge travel?', a: TRAVEL_LINE },
  { q: 'Does a floor plan come with listing photos?', a: `A floor plan is included from Essentials up, or $${FLOOR_PLAN_ONLY_RATE} on its own. Photos only doesn’t include one.` },
  { q: 'Is tax included?', a: `No. ${TAX_LINE}` },
  { q: 'Can photographers join from outside the GTA?', a: 'Yes. Applications are open across Canada.' },
]

export const metadata: Metadata = {
  title: `${TITLE} | Bricks`,
  description: DESC,
  alternates: { canonical: `/blog/${SLUG}` },
  robots: { index: true, follow: true },
  openGraph: { type: 'article', title: TITLE, description: DESC, images: [OG_IMAGE], url: `https://www.brxs.ca/blog/${SLUG}` },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESC, images: [OG_IMAGE] },
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
            keywords: 'real estate photography cost Canada, listing photos price, MLS® photos Canada, drone real estate photos cost',
            image: OG_IMAGE_URL,
          }),
        }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema(FAQS)) }} />
      <BlogPostLayout
        slug={SLUG}
        badge="Resources · Listing media"
        title={TITLE}
        sub="What moves the price of listing media anywhere in Canada, and the full Bricks price table by home size."
      >
        <p className="lead">
          Listing media is priced the same way across Canada: by the size of the home, the services you add, and how far the photographer travels. Here is what moves the number, and what Bricks charges.
        </p>

        <h2>What moves the price</h2>
        <h3>Size of the home</h3>
        <p>More rooms means more photos and more editing. Bricks prices by four size bands: {FOOTPRINT_BANDS} sq ft. Some property types start at a higher band.</p>
        <h3>What you add</h3>
        <p>Photos are the base. Drone, a floor plan, a reel, a {TOUR_NAME.toLowerCase()} and twilight are added as the listing needs them. {VISIT_PLAIN}</p>
        <h3>Travel</h3>
        <p>{TRAVEL_LINE} {BOOKING_LINE}</p>
        <h3>Delivery</h3>
        <p>{DELIVERY_LINE} Rush delivery is +${RUSH_FLAT}.</p>
        <h3>Drone rules</h3>
        <p>
          Any drone of 250 g or more needs a Transport Canada pilot certificate. Near people or in controlled airspace, which covers most listings in big cities, the pilot needs an Advanced certificate. {DRONE_PILOT_LINE} More in <Link href="/blog/drone-photography-rules-ontario">drone rules for real estate</Link>.
        </p>

        <h2>The Bricks menu</h2>
        <ul>
          <li>HDR photography: <strong>{bandCells(PHOTO_RATE).join(' / ')}</strong></li>
          <li>Licensed drone: <strong>{bandCells(DRONE_RATE).join(' / ')}</strong></li>
          <li>Floor plan: <strong>included</strong> from Essentials up, or <strong>${FLOOR_PLAN_ONLY_RATE}</strong> on its own</li>
          <li>Cinematic reel: <strong>+{REEL_RANGE}</strong></li>
          <li>{TOUR_NAME}: <strong>+{TOUR_RANGE}</strong></li>
          <li>{VISIT_NAME}: <strong>{bandCells(VISIT_RATE).join(' / ')}</strong>, booked on its own</li>
          <li>Twilight: <strong>+{TWILIGHT_RANGE}</strong></li>
          <li>Rush: <strong>+${RUSH_FLAT}</strong></li>
        </ul>

        <h2>Bricks price table by home size</h2>
        <p>Every line comes from the same rates checkout uses. CAD, before travel and tax.</p>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Service</th>{BAND_LABELS.map((b) => <th key={b} className="num">{b}</th>)}</tr></thead>
            <tbody>
              {RATE_ROWS.map((r) => <tr key={r.name}><td>{r.name}</td>{r.cells.map((c, i) => <td key={i} className="num">{c}</td>)}</tr>)}
            </tbody>
          </table>
        </div>

        <h2>Worked examples</h2>
        <ul>
          <li><strong>A small condo, photos only:</strong> {bandCells(PHOTO_RATE)[0]} before tax.</li>
          <li><strong>A mid-size detached home with Essentials</strong> (photos, drone, floor plan): {cad(ESSENTIALS[1])} before tax.</li>
          <li><strong>A large home with Showcase</strong> (Essentials, reel and {TOUR_NAME.toLowerCase()}): {cad(SHOWCASE[2])} before tax.</li>
          <li><strong>Add {VISIT_NAME}</strong> to the same large home: +{bandCells(VISIT_RATE)[2]}.</li>
        </ul>
        <p>
          Get an exact quote on <Link href="/book">Book a shoot</Link>. Prices vary from city to city; for published rates we checked in one market, see <Link href="/blog/gta-real-estate-media-cost-2026">what listing media costs in the GTA</Link>.
        </p>

        <h2>Where Bricks shoots</h2>
        <p>
          Across Canada. Enter the address when you book and we confirm coverage and travel before you pay. City guides:{' '}
          {CITY_PAGES.map((c, i) => (
            <span key={c.slug}>{i ? ', ' : ''}<Link href={`/real-estate-photography/${c.slug}`}>{c.city}</Link></span>
          ))}.
        </p>

        <h2>FAQ</h2>
        <div className="faq">
          {FAQS.map((f) => <div className="qa" key={f.q}><h3>{f.q}</h3><p>{f.a}</p></div>)}
        </div>
      </BlogPostLayout>
    </>
  )
}
