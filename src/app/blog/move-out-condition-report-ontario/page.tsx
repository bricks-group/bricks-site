import type { Metadata } from 'next'
import Link from 'next/link'
import BlogPostLayout from '@/components/BlogPostLayout'
import { blogPostingSchema, faqPageSchema } from '@/lib/schema'
import { OG_IMAGE, OG_IMAGE_URL } from '@/lib/og'
import { ONE_OFFS, money } from '@/lib/propertyCheckout'
import { MOVE_OUT_CONDITION_REPORT_ONTARIO_FAQS as FAQS } from '@/lib/guide-faqs'

const PATH = '/blog/move-out-condition-report-ontario'
const TITLE = 'Move-Out Condition Reports in Ontario: A Guide | Bricks'
const DESC = 'How to document a rental unit at move-in and move-out in Ontario: what to photograph, when to book it, and how a dated condition report helps in a dispute.'
const LTB_SOURCE = 'https://tribunalsontario.ca/documents/ltb/Brochures/Collecting%20Money%20a%20Former%20Tenant%20Owes%20%28EN%29.html'

const REPORT = money(ONE_OFFS.pm_condition_report.cents)
const TURNOVER = money(ONE_OFFS.pm_turnover.cents)

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: PATH },
  robots: { index: true, follow: true },
  openGraph: { type: 'article', title: TITLE, description: DESC, images: [OG_IMAGE], url: `https://www.brxs.ca${PATH}` },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESC, images: [OG_IMAGE] },
}

export default function Post() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema({ path: PATH, headline: 'Move-in and move-out condition reports in Ontario', description: DESC, datePublished: '2026-11-14', keywords: 'move out condition report ontario, move in inspection report, rental condition report photos, turnover photos, property manager toronto, landlord and tenant board evidence', image: OG_IMAGE_URL })) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema(FAQS)) }} />
      <BlogPostLayout
        badge="Guides · Property managers"
        title="Move-in and move-out condition reports in Ontario"
        sub="What to photograph, when to do it, and how to keep a record you can compare from one tenant to the next."
        cta={{ href: '/book/property?for=property_manager&service=pm_condition_report', label: 'Book a condition report' }}
        related={[
          { href: '/property-managers', label: 'Bricks for property managers' },
          { href: '/book/property', label: 'Book a property visit' },
          { href: '/move-out-cleaning', label: 'Move-out and turnover cleaning' },
          { href: '/blog/move-out-cleaning-checklist', label: 'Move-out cleaning checklist' },
          { href: '/reits', label: 'Bricks for REITs' },
          { href: '/pricing', label: 'Pricing' },
        ]}
      >
        {/* Counsel-cleared wording, 2026-11-14. Price from ONE_OFFS.pm_condition_report. */}
        <p className="lead">
          A condition report is a dated, room-by-room photo record of a rental unit, made when a tenant moves in and again when they move out. It gives you a clear record if there’s ever a damage claim. In Ontario, a landlord can ask the Landlord and Tenant Board for repair costs from a former tenant within one year after they move out, for damage caused wilfully or negligently, but not for normal wear and tear. Bricks books one from {REPORT}.
        </p>

        <h2>When to do it</h2>
        <ul>
          <li><strong>Move-in:</strong> after cleaning and repairs, before keys are handed over.</li>
          <li><strong>Move-out:</strong> after the tenant has left and before any cleaning or repairs, so the report shows the unit as it was returned.</li>
          <li><strong>Between tenants:</strong> a turnover visit can do the move-out report, new listing photos and a floor plan in one trip.</li>
        </ul>

        <h2>What to photograph, room by room</h2>
        <ul>
          <li>Every wall, the floor and the ceiling, from the same corners each time.</li>
          <li>Close-ups of anything worn, marked or damaged, with something for scale.</li>
          <li>Appliances inside and out, fixtures, windows, blinds and doors.</li>
          <li>Bathrooms: tub or shower, grout, caulking, vanity, toilet base.</li>
          <li>Meters, smoke and CO alarms, keys and fobs handed over.</li>
        </ul>
        <p>Consistency is what makes the report useful. When the move-out photos match the move-in angles, a change is easy to see and hard to argue with.</p>

        <h2>What makes it hold up</h2>
        <p>Date and time on every photo, the unit and address on the report, and a copy shared with the tenant. Keep the move-in and move-out reports together so they can be compared. This guide isn’t legal advice; for a dispute, follow the Landlord and Tenant Board’s current rules on evidence. Give the tenant proper written notice before entering an occupied unit. Source: <a href={LTB_SOURCE} rel="noopener noreferrer">Landlord and Tenant Board, Collecting money a former tenant owes</a>.</p>

        <h2>How Bricks does it</h2>
        <p>Book a dated move-in or move-out condition report for {REPORT}, or a turnover media bundle for {TURNOVER}: a move-out condition report, new listing photos and a measured floor plan in one visit. Both are <Link href="/book/property?for=property_manager">booked online by address</Link>, CAD plus tax. Media only: cleaning and repairs are not included, and are <Link href="/move-out-cleaning">quoted separately</Link>.</p>
        <p>In a <Link href="/property-managers">property manager account</Link>, each condition report is compared room by room with the last one, every unit shows its turnover and next step, and you can print an owner report for any period. Managing many units? Rentals plans cover 5, 12 or 25 turnover bundles a month for $1,325, $2,990 or $5,875.</p>

        <h2>FAQ</h2>
        <div className="faq">
          {FAQS.map((f) => <div className="qa" key={f.q}><h3>{f.q}</h3><p>{f.a}</p></div>)}
        </div>
      </BlogPostLayout>
    </>
  )
}
