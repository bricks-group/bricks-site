import Link from 'next/link'
import './audience-cards.css'

/** Two audiences under the homepage hero: listing side (agents/brokerages) and site side (builders/developers). */
export default function AudienceCards() {
  return (
    <section className="hxa rvl" aria-label="Who Bricks is for">
      <div className="wrap">
        <div className="hxa-grid">
          <Link href="/agents" className="hxa-card">
            <span className="over">For agents &amp; brokerages</span>
            <b>Listing media and the desk.</b>
            <span className="hxa-v">Book a shoot, then run deals, media and MLS in OS.</span>
            <span className="hxa-go">Learn more →</span>
          </Link>
          <Link href="/builders" className="hxa-card">
            <span className="over">For builders &amp; developers</span>
            <b>Site progress, on schedule.</b>
            <span className="hxa-v">Drone progress visits and mapped captures by vetted, insured, certified pilots. From $375 per visit.</span>
            <span className="hxa-go">Learn more →</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
