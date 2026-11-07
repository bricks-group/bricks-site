import type { Metadata } from 'next'
import BlogPostLayout from '@/components/BlogPostLayout'
import { LOGO_SCHEMA, ORG_REF } from '@/lib/schema'
import { OG_IMAGE } from '@/lib/og'

export const metadata: Metadata = {
  title: 'Drone photography rules for real estate in Ontario | Bricks',
  description: "Understand Ontario real estate drone photography rules, including Transport Canada certification, controlled airspace, altitude and planning a legal shoot.",
  alternates: { canonical: '/blog/drone-photography-rules-ontario' },
  robots: { index: true, follow: true },
  openGraph: { images: [OG_IMAGE],
    type: 'article',
    title: 'Drone photography rules for real estate in Ontario',
    description: "Understand Ontario real estate drone photography rules, including Transport Canada certification, controlled airspace, altitude and planning a legal shoot.",
  },
  twitter: {
    title: 'Drone photography rules for real estate in Ontario',
    description: "Understand Ontario real estate drone photography rules, including Transport Canada certification, controlled airspace, altitude and planning a legal shoot.",
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
            headline: 'Drone photography rules for real estate listings in Ontario',
            description: 'Transport Canada Advanced RPAS rules for real estate drone photography in Ontario: certification, no-fly zones, altitude, and what a compliant aerial shoot looks like.',
            author: { '@type': 'Organization', name: 'Bricks', url: 'https://www.brxs.ca' },
            datePublished: '2026-07-22',
            dateModified: '2026-07-22',
            publisher: { ...ORG_REF, logo: LOGO_SCHEMA },
            mainEntityOfPage: 'https://www.brxs.ca/blog/drone-photography-rules-ontario',
            keywords: 'drone photography rules Ontario, real estate drone Toronto, Transport Canada Advanced RPAS, aerial photography GTA',
          }),
        }}
      />
      <BlogPostLayout
        badge="Resources · Rules & safety"
        title="Drone photography rules for real estate in Ontario"
        sub="Aerial shots sell homes — but only when they're legal. Here's what Transport Canada actually requires, and how a compliant GTA shoot works."
      >
        <p className="lead">A licensed drone shot is one of the highest-impact frames in a listing — and one of the easiest ways to get it wrong. If the operator isn&apos;t certified and following the rules, the footage isn&apos;t just risky, it can get pulled and the agent exposed. Here&apos;s the real framework for Ontario.</p>

        <h2>You need an Advanced RPAS certificate</h2>
        <p>In Canada, flying a drone for <strong>commercial work — including real estate photography</strong> — requires a <strong>Transport Canada pilot certificate</strong>. For the kind of flying real estate needs (near people, near buildings, often in controlled airspace around the GTA), that means the <strong>Advanced Operations</strong> certificate: a written exam, an in-person flight review, and registration of the aircraft.</p>
        <p>Bricks&apos; drone work is flown under an <strong>Advanced RPAS (Remotely Piloted Aircraft Systems) certificate</strong>. That&apos;s the difference between &quot;someone with a DJI&quot; and a compliant operator who can legally fly in the complex airspace around Toronto, Mississauga, and the airports.</p>

        <h2>The rules that actually affect your shoot</h2>
        <h3>Controlled airspace &amp; no-fly zones</h3>
        <p>The GTA sits under some of the busiest airspace in the country — Pearson, Billy Bishop, and several helipads. Many listings fall inside <strong>controlled airspace</strong> or near an airport, which requires <strong>advance clearance from NAV CANADA</strong> (a flight plan / airspace authorization) before flying. A compliant operator checks this per address, every time.</p>
        <h3>Altitude &amp; distance</h3>
        <p>Recreational and most commercial flights are capped at <strong>122 metres (400 feet) above ground level</strong> and must stay within visual line of sight. For real estate that&apos;s plenty — a listing aerial at 60–100 m reads beautifully without leaving the legal envelope.</p>
        <h3>People &amp; property</h3>
        <p>Advanced certification is what permits flying <strong>over people and near buildings</strong> safely — but it still demands a risk assessment, not a free-for-all. That&apos;s exactly why the certificate matters for residential shoots.</p>

        <h2>What a compliant GTA aerial shoot looks like</h2>
        <ul>
          <li><strong>Pre-flight check:</strong> verify the address against NAV CANADA airspace and any local restrictions.</li>
          <li><strong>Clearance:</strong> file the required authorization when the location is in controlled airspace.</li>
          <li><strong>On-site assessment:</strong> wind, obstacles, neighbours, and a safe launch point.</li>
          <li><strong>Capture:</strong> a tight set of exterior and approach angles — usually enough in 10–15 minutes of flight.</li>
          <li><strong>Edit:</strong> straightened, colour-matched HDR stills and a short aerial clip, delivered with the rest of the shoot.</li>
        </ul>

        <h2>Why it matters to the agent</h2>
        <p>An unlicensed operator isn&apos;t just breaking rules — if something goes wrong, the <strong>agent and brokerage are on the hook too</strong>. Booking a certified Advanced RPAS operator protects the listing, the client, and your license. It&apos;s also a quiet trust signal: buyers and sellers notice when the media is clearly professional.</p>

        <blockquote>&quot;In the GTA, the airspace is the hard part — not the flying. Certification is what lets us shoot legally next to Pearson&apos;s approach path.&quot;</blockquote>

        <h2>FAQ</h2>
        <div className="faq">
          <div className="qa"><h3>Can any drone photo be used in a listing?</h3><p>Only if flown legally by a certified pilot with the right airspace clearance. Bricks flies under an Advanced RPAS certificate.</p></div>
          <div className="qa"><h3>What if the home is near the airport?</h3><p>Then it&apos;s almost certainly controlled airspace — we file the NAV CANADA authorization before the shoot. That&apos;s standard for much of Mississauga and Etobicoke.</p></div>
          <div className="qa"><h3>Is drone included or extra?</h3><p>Licensed drone coverage is part of the core Bricks shoot; aerial video can be added as a reel. <a href="/pricing">See pricing →</a></p></div>
        </div>
      </BlogPostLayout>
    </>
  )
}
