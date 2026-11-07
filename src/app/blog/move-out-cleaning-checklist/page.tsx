import type { Metadata } from 'next'
import Link from 'next/link'
import BlogPostLayout from '@/components/BlogPostLayout'
import { blogPostingSchema, faqPageSchema } from '@/lib/schema'
import { OG_IMAGE, OG_IMAGE_URL } from '@/lib/og'

const PATH = '/blog/move-out-cleaning-checklist'
const TITLE = 'Move-Out Cleaning Checklist, Room by Room | Bricks'
const DESC = 'A room-by-room move-out cleaning checklist for tenants, landlords and property managers, plus how to document the clean with photos for the next tenant.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: PATH },
  robots: { index: true, follow: true },
  openGraph: { type: 'article', title: TITLE, description: DESC, images: [OG_IMAGE], url: `https://www.brxs.ca${PATH}` },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESC, images: [OG_IMAGE] },
}

const ROOMS: { room: string; items: string[] }[] = [
  { room: 'Kitchen', items: ['Inside and outside the fridge and freezer, including seals and drawers', 'Inside the oven, racks and the stovetop', 'Range hood and filter', 'Inside and outside cabinets and drawers', 'Countertops, backsplash and sink', 'Dishwasher filter and door edges', 'Microwave inside and out'] },
  { room: 'Bathrooms', items: ['Toilet, including the base and behind it', 'Tub, shower, tiles and grout', 'Sink, faucet and vanity, inside and out', 'Mirror and medicine cabinet', 'Exhaust fan cover', 'Floor, including corners'] },
  { room: 'Every room', items: ['Baseboards and trim', 'Light switches, outlets and door handles', 'Doors and door frames', 'Spot-clean walls', 'Windows, sills and tracks', 'Blinds', 'Light fixtures and ceiling fans', 'Closets, shelves and rods', 'Vents and return grilles', 'Floors: vacuum, then wash hard floors'] },
  { room: 'Outside the unit', items: ['Balcony or patio swept', 'Garage or storage locker emptied and swept', 'Garbage and recycling removed'] },
]

const FAQS = [
  { q: 'What should a move-out clean include?', a: 'Inside appliances and cabinets, bathrooms top to bottom, baseboards, switches, doors, windows and tracks, closets, light fixtures and floors, plus any balcony, garage or locker. The checklist on this page covers it room by room.' },
  { q: 'How long does a move-out clean take?', a: 'It depends on the size of the unit and its condition. An empty unit is much faster to clean than one with furniture still in it, so schedule the clean after the move.' },
  { q: 'How do landlords document a move-out clean?', a: 'Photograph each room after the clean, date the photos and keep them with the move-out condition report for the unit, so the next move-in report has something to compare against.' },
  { q: 'Can Bricks arrange the clean?', a: 'Yes. Request a quote for a move-out, turnover or pre-listing clean. It’s quoted in writing, and you get room-by-room photos and the completed checklist when it’s done.' },
]

export default function Post() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema({ path: PATH, headline: 'Move-out cleaning checklist, room by room', description: DESC, datePublished: '2026-11-07', keywords: 'move out cleaning checklist, move-out cleaning, end of tenancy cleaning, rental turnover cleaning, move out clean', image: OG_IMAGE_URL })) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema(FAQS)) }} />
      <BlogPostLayout
        badge="Guides · Home services"
        title="Move-out cleaning checklist, room by room"
        sub="Everything to clean before you hand back the keys or turn a unit over, and how to prove it was done."
        cta={{ href: '/move-out-cleaning', label: 'Request a cleaning quote' }}
        related={[
          { href: '/move-out-cleaning', label: 'Move-out and turnover cleaning' },
          { href: '/property-managers', label: 'Bricks for property managers' },
          { href: '/help/property-managers/condition-report-timing', label: 'When to book condition reports' },
          { href: '/home-staging', label: 'Home staging' },
        ]}
      >
        <p className="lead">
          A move-out clean is a deep clean of an <strong>empty</strong> unit: the places furniture hid, the inside of every appliance and cabinet, and the details a weekly clean skips. Use this checklist whether you’re a tenant leaving, a landlord between tenants or an agent getting a vacant home ready for photos.
        </p>

        <h2>Before you start</h2>
        <ul>
          <li>Wait until everything is moved out. Cleaning around boxes means doing it twice.</li>
          <li>Work top to bottom, so dust lands on floors you haven’t cleaned yet.</li>
          <li>Check your lease or turnover checklist for anything specific, such as carpets or appliances.</li>
        </ul>

        {ROOMS.map((r) => (
          <div key={r.room}>
            <h2>{r.room}</h2>
            <ul>{r.items.map((i) => <li key={i}>{i}</li>)}</ul>
          </div>
        ))}

        <h2>Document it</h2>
        <p>Photos protect everyone. After the clean, photograph each room from the doorway and close up on appliances, bathrooms and floors. Date the photos and keep them with the unit’s move-out condition report.</p>
        <p>Bricks property managers book move-out condition reports within two weeks after the move-out date, and move-in reports within two weeks before the move-in date, while the unit is empty. Each report is dated room by room and compared with the last report for that unit.</p>

        <h2>Getting it done for you</h2>
        <p>
          Bricks arranges <Link href="/move-out-cleaning">move-out, turnover and pre-listing cleans</Link>, quoted in writing with the scope, checklist and crew size. When it’s done you get room-by-room photos and the completed checklist, kept with the property in your Bricks account. Rental turnovers are cleaned on a checklist you approve.
        </p>

        <h2>FAQ</h2>
        <div className="faq">
          {FAQS.map((f) => <div className="qa" key={f.q}><h3>{f.q}</h3><p>{f.a}</p></div>)}
        </div>
      </BlogPostLayout>
    </>
  )
}
