import type { Metadata } from 'next'
import Link from 'next/link'
import BlogPostLayout from '@/components/BlogPostLayout'
import { blogPostingSchema, faqPageSchema } from '@/lib/schema'
import { OG_IMAGE, OG_IMAGE_URL } from '@/lib/og'
import { OS_LOGIN } from '@/lib/brand'

const PATH = '/blog/what-is-a-real-estate-operating-system'
const TITLE = 'What Is a Real Estate Operating System? | Bricks'
const DESC = 'A real estate operating system puts builders, agents, property managers and vendors on one record, with services booked inside. How Bricks does it.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: PATH },
  robots: { index: true, follow: true },
  openGraph: { type: 'article', title: TITLE, description: DESC, images: [OG_IMAGE], url: `https://www.brxs.ca${PATH}` },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESC, images: [OG_IMAGE] },
}

// Generated from Markez's seo-content-w1/_src/faqs.py (2026-11-14). Edit there, not here.
const FAQS = [
  { q: "What is a real estate operating system?", a: "A real estate operating system is one piece of software where everyone around a property works from the same record: builders and developers, agents and brokerages, property managers, and the vendors they hire. Deals, listings, sites, units and documents live together, and services like photography or drone mapping are booked and delivered inside it." },
  { q: "Who uses a real estate operating system?", a: "Builders and developers, agents and brokerages, property managers, and the vendors who do the work on site. Each sees the part that is theirs, on the same record." },
  { q: "How is it different from a CRM or a booking site?", a: "A CRM holds contacts and deals. A booking site sells one service. An operating system keeps the deal, the property and the work done on it in one place, so a shoot or a site visit lands where the work already is." },
  { q: "Can I book services inside Bricks?", a: "Yes. Listing media, Virtual Visit free-roam 3D, Site Progress visits, condition reports and turnovers are booked and paid inside Bricks, with the full price shown before you pay. Staging, cleaning, inspections and measurement are quoted in writing by a person at Bricks." },
  { q: "Do I need a paid plan to use Bricks?", a: "No. Clay is free, and anyone can book listing media at brxs.ca/book without an account. Paid plans add CRM, e-sign, forms and AI." },
  { q: "How are Bricks services priced?", a: "Every price is public, in CAD before tax. The With and without Bricks page sets them beside published GTA and Ontario rates, so you can check the difference yourself." },
  { q: "Does Bricks replace my MLS®?", a: "No. Bricks can pull your MLS® feed on your own credentials and builds an MLS® package for each listing, but it never posts or submits to your MLS®. You submit it yourself." },
  { q: "Where does Bricks work?", a: "Across Canada. Availability and any travel charges are confirmed for the property at booking. Inspections are available in Ontario only." },
] as const

export default function Post() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema({ path: PATH, headline: 'What is a real estate operating system?', description: DESC, datePublished: '2026-11-14', keywords: 'real estate operating system, real estate operating system canada, real estate software canada, real estate platform, builder software, brokerage software, property manager software', image: OG_IMAGE_URL })) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema(FAQS)) }} />
      <BlogPostLayout
        badge="Guides · Software"
        title="What is a real estate operating system?"
        sub="One record for everyone around a property, with the work booked inside it."
        cta={{ href: OS_LOGIN, label: 'Try Bricks free' }}
        related={[
          { href: '/platform', label: 'Bricks software' },
          { href: '/why-bricks', label: 'With and without Bricks' },
          { href: '/builders', label: 'Site Progress for builders' },
          { href: '/agents', label: 'Bricks for agents' },
          { href: '/property-managers', label: 'Bricks for property managers' },
          { href: '/work-with-bricks', label: 'Work with Bricks' },
        ]}
      >
        <p className="lead">
          A real estate operating system is one piece of software where everyone around a property works from the same record: builders and developers, agents and brokerages, property managers, and the vendors they hire. Deals, listings, sites, units and documents live together, and services like photography or drone mapping are booked and delivered inside it.
        </p>
        <p>Bricks is that system for Canadian real estate. It is the part between the pieces: the record each person reads from, so work passes from one hand to the next without being retyped, re-sent or lost.</p>

        <h2>Who it’s for</h2>
        <p><strong><Link href="/builders">Builders and developers.</Link></strong> Every site as a dated record: progress visits, drone maps, models and reports, compared over time and shared with one link.</p>
        <p><strong><Link href="/agents">Agents</Link> and <Link href="/brokerage">brokerages</Link>.</strong> Listings, deals and e-sign in one desk. Book the shoot from the listing, and the files arrive on it.</p>
        <p><strong><Link href="/property-managers">Property managers.</Link></strong> Every building’s units and their status, with condition reports and turnover media booked by address and compared with the last visit.</p>
        <p><strong><Link href="/work-with-bricks">Vendors.</Link></strong> Photographers, pilots, stagers, cleaners, inspectors and measurers get the job, the scope and the schedule in one place. A person at Bricks reviews every application.</p>

        <h2>What it replaces</h2>
        <ul>
          <li>Calling around to find who’s free.</li>
          <li>A separate booking, invoice and delivery link for each vendor.</li>
          <li>Sending lockbox codes and access notes again and again.</li>
          <li>Typing the same listing details into several tools.</li>
          <li>Progress photos and reports scattered across email and drives.</li>
          <li>Agreeing travel charges after the shoot.</li>
        </ul>

        <h2>How booking works inside it</h2>
        <ol>
          <li><strong>Pick the work.</strong> Enter the address, then choose the services and an exact time. For listing media, the times shown come live from photographers’ calendars.</li>
          <li><strong>See the final price.</strong> For listing media, Bricks assigns the photographer before you pay, so travel is on the quote. You pay in full at checkout by card, Apple Pay or Google Pay.</li>
          <li><strong>The visit.</strong> The photographer gets the address, your notes and a checklist for your package in their app.</li>
          <li><strong>Delivered where the work is.</strong> Files land on the listing, the site or the unit. Photos usually arrive within 24 hours and other media within 24 to 48 hours. These are targets, not guarantees.</li>
        </ol>
        <p>Cancel 24 hours or more before the shoot window for a full refund. Inside 24 hours, or on a no-show, there is no refund. Staging, cleaning, inspections and measurement are requested in the same place and <Link href="/services">quoted in writing</Link> by a person at Bricks.</p>

        <h2>Start</h2>
        <p>Clay is free, with no card. Paid plans add CRM, e-sign, forms and AI. Services are priced separately, and <Link href="/pricing">every price is public</Link>.</p>

        <h2>FAQ</h2>
        <div className="faq">
          {FAQS.map((f) => <div className="qa" key={f.q}><h3>{f.q}</h3><p>{f.a}</p></div>)}
        </div>
      </BlogPostLayout>
    </>
  )
}
