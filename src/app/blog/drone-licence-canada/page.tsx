import type { Metadata } from 'next'
import Link from 'next/link'
import BlogPostLayout from '@/components/BlogPostLayout'
import { blogPostingSchema, faqPageSchema } from '@/lib/schema'
import { OG_IMAGE, OG_IMAGE_URL } from '@/lib/og'
import { postMeta } from '@/lib/content/posts'

const SLUG = 'drone-licence-canada'
const META = postMeta(SLUG)
const PATH = `/blog/${SLUG}`
const HEADLINE = 'Drone licence in Canada: Basic vs Advanced'
const TITLE = `${HEADLINE} | Bricks`
const DESC = 'How to get a drone licence in Canada: Basic, Advanced and Level 1 Complex certificates, exams, flight reviews and what real estate work needs.'
const TC = 'https://tc.canada.ca/en/aviation/drone-safety'

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: PATH },
  robots: { index: true, follow: true },
  openGraph: { type: 'article', title: TITLE, description: DESC, images: [OG_IMAGE], url: `https://www.brxs.ca${PATH}` },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESC, images: [OG_IMAGE] },
}

const FAQS = [
  { q: 'Do I need a licence to fly a drone in Canada?', a: 'Yes, for any drone of 250 g or more. You need a Transport Canada drone pilot certificate and a registered, marked drone. Drones under 250 g need neither, but microdrone rules still apply.' },
  { q: 'What is the difference between a Basic and an Advanced drone certificate?', a: 'Basic lets you fly small drones in uncontrolled airspace, more than 30 m horizontally from people. Advanced adds flying closer to or over people, in controlled airspace with air traffic control permission, and medium drones, if the drone meets the safety requirements for that operation.' },
  { q: 'How old do you have to be to get a drone licence?', a: '14 for Basic, 16 for Advanced and 18 for Level 1 Complex.' },
  { q: 'Does a drone pilot certificate expire?', a: 'No. Transport Canada certificates do not expire, but pilots must keep their skills up to date.' },
  { q: 'Which certificate does real estate drone work need?', a: 'Usually Advanced. Homes sit near streets, neighbours and often controlled airspace, which puts most listing flights outside Basic limits. Every Bricks drone pilot holds an Advanced certificate.' },
]

export default function Post() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema({ path: PATH, headline: HEADLINE, description: DESC, datePublished: META.published, dateModified: META.reviewedOn, keywords: 'drone licence Canada, drone license Canada, drone pilot certificate, Advanced RPAS, Basic drone certificate, drone rules Canada', image: OG_IMAGE_URL })) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema(FAQS)) }} />
      <BlogPostLayout
        slug={SLUG}
        badge="Resources · Drone"
        title={HEADLINE}
        sub="What Transport Canada’s three drone pilot certificates allow, how to get each one, and which one you need to fly real estate."
        cta={{ href: '/photographers', label: 'Fly for Bricks' }}
        related={[
          { href: '/blog/drone-photography-rules-ontario', label: 'Drone photography rules for real estate in Ontario' },
          { href: '/drone-photography', label: 'Real estate drone photography' },
          { href: '/drone-mapping', label: 'Drone mapping for construction' },
          { href: '/photographers', label: 'Photographer and pilot jobs' },
        ]}
      >
        <p className="lead">
          In Canada, the “drone licence” is a <strong>drone pilot certificate</strong> issued by Transport Canada. If your drone weighs 250 g or more, you need one, and the drone itself must be registered and marked. Which certificate you need depends on what you fly, how close to people, and in what airspace.
        </p>

        <h2>The three drone pilot certificates</h2>
        <div className="table-wrap">
          <table>
            <thead><tr><th></th><th>Basic</th><th>Advanced</th><th>Level 1 Complex</th></tr></thead>
            <tbody>
              <tr><td>Minimum age</td><td className="num">14</td><td className="num">16</td><td className="num">18</td></tr>
              <tr><td>Visual line of sight</td><td>Yes</td><td>Yes</td><td>Yes</td></tr>
              <tr><td>Closer to or over people</td><td>No</td><td>Yes*</td><td>Yes*</td></tr>
              <tr><td>Controlled airspace (with ATC permission)</td><td>No</td><td>Yes*</td><td>Yes*</td></tr>
              <tr><td>Medium drones (25–150 kg)</td><td>No</td><td>Yes*</td><td>Yes*</td></tr>
              <tr><td>Beyond visual line of sight</td><td>No</td><td>No</td><td>Yes*</td></tr>
            </tbody>
          </table>
        </div>
        <p>* Only with a drone that meets Transport Canada’s safety requirements for that specific operation. Source: <a href={`${TC}/learn-rules-you-fly-your-drone/drone-operation-categories-pilot-certificates`} rel="noopener">Transport Canada, drone operation categories</a>.</p>

        <h2>How to get a Basic certificate</h2>
        <p>Pass the online Small Basic exam through Transport Canada’s Drone Management Portal. The certificate is issued as soon as you pass, and you can download and print it.</p>
        <p>Basic operations mean all of the following: a drone of 25 kg or less, always in sight, more than 30 m horizontally from any person, in uncontrolled airspace, more than 5.6 km from the centre of a certified airport and more than 1.9 km from the centre of a heliport. Break any one of those and the flight is no longer Basic.</p>

        <h2>How to get an Advanced certificate</h2>
        <ol>
          <li>Pass the online exam for advanced operations.</li>
          <li>Pass a flight review for advanced operations with a flight reviewer.</li>
          <li>Apply for the Pilot Certificate – Advanced Operations and pay the fee.</li>
        </ol>
        <p>An Advanced certificate covers basic operations too. Before flying in controlled airspace, you also need permission from air traffic control, which in Canada means requesting an RPAS flight authorization from NAV CANADA.</p>

        <h2>Level 1 Complex</h2>
        <p>Level 1 Complex adds flights beyond visual line of sight, with a drone that meets the requirements. It takes the advanced exam, at least 20 hours of ground school at a flight school, the Level 1 Complex exam and a flight review. Complex flights must also be flown under an RPAS Operator Certificate (RPOC). Real estate and most construction mapping don’t need it.</p>

        <h2>Registering and marking your drone</h2>
        <p>Every drone of 250 g or more, including kit-built and custom drones, must be registered in the Drone Management Portal and marked with its registration number using a permanent marker, label or engraving. Carry your certificate and proof of registration every time you fly. Current fees are listed on Transport Canada’s site.</p>
        <p>Drones under 250 g don’t need registration or a certificate, unless something attached pushes them to 250 g or more. They still have to follow the microdrone rules.</p>

        <h2>What happens if you fly without one</h2>
        <p>Transport Canada lists fines for individuals of up to $1,000 for flying without a pilot certificate, up to $3,000 for flying where you are not allowed or putting aircraft and people at risk, and up to $5,000 for an unregistered or unmarked drone. Fines for corporations are higher.</p>

        <h2>Which licence real estate needs</h2>
        <p>
          A listing flight usually means houses, a street and neighbours within 30 m, and in most big Canadian cities, controlled airspace near an airport. That’s Advanced territory. Insurance isn’t required by Transport Canada for standard operations, but clients often ask for it. For the rules on the day of a shoot, read <Link href="/blog/drone-photography-rules-ontario">drone photography rules for real estate in Ontario</Link>.
        </p>
        <p>
          Bricks requires a Transport Canada Advanced certificate before sending drone jobs to a pilot, and builder site work also needs at least $2M in verified drone liability insurance. If you hold Advanced and shoot real estate, <Link href="/photographers">apply to fly for Bricks</Link>.
        </p>

        <h2>FAQ</h2>
        <div className="faq">
          {FAQS.map((f) => <div className="qa" key={f.q}><h3>{f.q}</h3><p>{f.a}</p></div>)}
        </div>
      </BlogPostLayout>
    </>
  )
}
