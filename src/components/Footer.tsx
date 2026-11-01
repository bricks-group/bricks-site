import Link from 'next/link'
import { isTradeEnabled } from '@/lib/services'
import { COMPANION_URL, GO_URL, OS_LOGIN, STATUS } from '@/lib/brand'
import { LEGAL_NAME, SOCIAL_PROFILES } from '@/lib/schema'
import BrandMark from '@/components/BrandMark'
import ThemeToggle from '@/components/ThemeToggle'

export default function Footer() {
  return (
    <footer>
      <div className="foot-inner">
        <div className="foot-brand">
          <Link href="/" className="brand" aria-label="Bricks — home">
            <BrandMark />
            <span className="wordmark">bricks</span>
          </Link>
          <p className="foot-blurb">
            The system that brings it all together.
          </p>
        </div>
        <div className="foot-col">
          <h4>Product</h4>
          <div className="foot-links">
            <Link href="/platform">Software</Link>
            <Link href="/builders">Site Progress</Link>
            <Link href="/media">Listing media</Link>
            <Link href="/real-estate-photography">Listing photos</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/gallery">Work</Link>
            <Link href="/service-areas">Service areas</Link>
            <a href={COMPANION_URL} rel="noopener noreferrer">Companion</a>
            <a href={GO_URL} rel="noopener noreferrer">Photographer app</a>
            <a href={OS_LOGIN}>Log in</a>
          </div>
        </div>
        <div className="foot-col">
          <h4>Who it&apos;s for</h4>
          <div className="foot-links">
            <Link href="/agents">Agents</Link>
            <Link href="/teams">Teams</Link>
            <Link href="/brokerage">Brokerage</Link>
            <Link href="/builders">Builders</Link>
            <Link href="/investors">Investors</Link>
            <Link href="/reits">REITs</Link>
            <Link href="/commercial">Commercial</Link>
            <Link href="/property-managers">Property managers</Link>
          </div>
        </div>
        <div className="foot-col">
          <h4>Home services</h4>
          <div className="foot-links">
            <Link href="/services">All services</Link>
            <Link href="/services#staging">Staging</Link>
            <Link href="/services#cleaning">Cleaning</Link>
            <Link href="/services#inspections">Inspections</Link>
            <Link href="/services#measurement">Measurement</Link>
            {isTradeEnabled('repairs') && <Link href="/services#repairs">Repairs</Link>}
          </div>
        </div>
        <div className="foot-col">
          <h4>Company</h4>
          <div className="foot-links">
            <Link href="/work-with-bricks">Work with Bricks</Link>
            <Link href="/photographers">Photographers</Link>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/help">Help centre</Link>
            <Link href="/blog">Blog</Link>
          </div>
        </div>
        <div className="foot-col">
          <h4>Legal</h4>
          <div className="foot-links">
            <Link href="/terms">Terms</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/legal">Legal</Link>
          </div>
        </div>
      </div>
      <div className="foot-meta">
        <span>© {LEGAL_NAME} · Canada</span>
        <a href="mailto:hello@brxs.ca">hello@brxs.ca</a>
        <span className="mono">343-453-4578</span>
        <a href="https://share.google/7ttYfc6W7JRwlqA9U" target="_blank" rel="noopener noreferrer">Find us on Google</a>
        {SOCIAL_PROFILES.map((p) => (
          <a key={p.url} href={p.url} target="_blank" rel="me noopener noreferrer">{p.label}</a>
        ))}
        <ThemeToggle />
      </div>
    </footer>
  )
}
