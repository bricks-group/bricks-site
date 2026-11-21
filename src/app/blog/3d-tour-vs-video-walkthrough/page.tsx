import type { Metadata } from 'next'
import Link from 'next/link'
import BlogPostLayout from '@/components/BlogPostLayout'
import { REEL_RANGE, TOUR_RANGE, VISIT_PRICE_LABEL } from '@/lib/pricing'
import { TOUR_NAME, VISIT_NAME } from '@/lib/brand'
import { LOGO_SCHEMA, ORG_REF, faqPageSchema } from '@/lib/schema'
import { OG_IMAGE } from '@/lib/og'
import { VISIT_PLAIN } from '@/lib/content/facts'
import { postMeta } from '@/lib/content/posts'

const SLUG = '3d-tour-vs-video-walkthrough'
const META = postMeta(SLUG)
const TITLE = 'Virtual tour or video walkthrough: which fits the listing?'
const DESC = 'What a virtual tour, a video walkthrough and a Virtual Visit each do, and how to choose for the home you are listing.'
const tour = TOUR_NAME.toLowerCase()

const FAQS: { q: string; a: string }[] = [
  { q: `Is a ${tour} the same as a floor plan?`, a: `No. A floor plan is a flat drawing with room sizes. A ${tour} lets buyers click from room to room, but it doesn’t replace a measured plan.` },
  { q: `What is the difference between a ${tour} and a ${VISIT_NAME}?`, a: `A ${tour} moves along a set path. A ${VISIT_NAME} is free-roam 3D: buyers move anywhere in the home. ${VISIT_PLAIN}` },
  { q: 'Can I use the reel on social media?', a: 'Yes. The reel is a short film made for social posts and the top of a listing page.' },
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
            keywords: 'virtual tour vs video walkthrough, real estate video, virtual tour for listings, free-roam 3D',
          }),
        }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema(FAQS)) }} />
      <BlogPostLayout
        slug={SLUG}
        badge="Resources · Listing media"
        title={TITLE}
        sub="Three different things that often get the same name. What each does, and when to use it."
      >
        <p className="lead">A {tour}, a {VISIT_NAME} and a video walkthrough are often mixed up. They do different jobs. Here is what each one is and how to pick.</p>

        <h2>What each one is</h2>
        <h3>{TOUR_NAME}</h3>
        <p>Buyers click from room to room along a set path. It sits on the listing page so people can look around before a showing. It comes with Showcase and Full suite, or as an add-on at {TOUR_RANGE}.</p>
        <h3>{VISIT_NAME}</h3>
        <p>Free-roam 3D: buyers move anywhere in the home, not only along a path. {VISIT_PLAIN} {VISIT_PRICE_LABEL} by home size.</p>
        <h3>Video walkthrough or reel</h3>
        <p>A short edited film, 30 to 45 seconds, set to music. It shows light, flow and feel, and works well on social media and at the top of a listing. Add it for {REEL_RANGE}.</p>

        <h2>When a {tour} fits</h2>
        <ul>
          <li>The layout is large or unusual, like a multiplex or a custom build.</li>
          <li>Buyers are out of town and want to look around on their own.</li>
          <li>You want people to know the home before they book a showing.</li>
        </ul>

        <h2>When a reel fits</h2>
        <ul>
          <li>You want something to post on social media this week.</li>
          <li>The home’s light, views or design are its strongest points.</li>
          <li>The layout is simple, like a condo or a semi, so photos already explain it.</li>
        </ul>

        <h2>When a {VISIT_NAME} fits</h2>
        <ul>
          <li>Buyers will want to stand in each room and look around freely.</li>
          <li>The home is high-value or hard to visit in person.</li>
        </ul>

        <h2>Many listings use more than one</h2>
        <p>Photos are always the base. Many agents add a reel for reach and a {tour} for larger homes. It depends on the home and the buyers, so pick for the listing in front of you. <Link href="/pricing">See every price →</Link></p>

        <h2>FAQ</h2>
        <div className="faq">
          {FAQS.map((f) => <div className="qa" key={f.q}><h3>{f.q}</h3><p>{f.a}</p></div>)}
        </div>
      </BlogPostLayout>
    </>
  )
}
