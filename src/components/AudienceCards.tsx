import Link from 'next/link'
import './audience-cards.css'

/** Two audiences under the homepage hero: listing side (agents/brokerages) and site side (builders/developers). */
export default function AudienceCards() {
  return (
    <section className="aud rvl" aria-label="Who Bricks is for">
      <div className="wrap">
        <div className="aud-grid">
          <Link href="/agents" className="aud-card">
            <span className="over">For agents &amp; brokerages</span>
            <b>Listing media and the desk.</b>
            <span className="aud-v">Book a shoot at an exact time, then run deals, media and MLS on OS.</span>
            <span className="aud-go">Agents &amp; brokerages →</span>
          </Link>
          <Link href="/builders" className="aud-card">
            <span className="over">For builders &amp; developers</span>
            <b>Site progress, on schedule.</b>
            <span className="aud-v">Drone progress visits and mapped captures by insured Tier A pilots. From $375 per visit.</span>
            <span className="aud-go">Site Progress →</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
