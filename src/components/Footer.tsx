import Link from 'next/link'
import { GO_URL, OS_LOGIN, STATUS } from '@/lib/brand'
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
            {STATUS.chrome} {STATUS.stores}
          </p>
        </div>
        <div className="foot-col">
          <h4>Product</h4>
          <div className="foot-links">
            <Link href="/platform">Platform</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/real-estate-photography">Listing photos</Link>
            <Link href="/gallery">Work</Link>
            <Link href="/book">Book a shoot</Link>
            <Link href="/service-areas">Service areas</Link>
            <a href={GO_URL} rel="noopener noreferrer">GO</a>
            <a href={OS_LOGIN}>Log in</a>
          </div>
        </div>
        <div className="foot-col">
          <h4>Company</h4>
          <div className="foot-links">
            <Link href="/brokerage">Brokerage</Link>
            <Link href="/agents">Agents</Link>
            <Link href="/photographers">Photographers</Link>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/blog">Blog</Link>
          </div>
        </div>
        <div className="foot-col">
          <h4>Legal</h4>
          <div className="foot-links">
            <Link href="/terms">Terms</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/legal">Legal index</Link>
          </div>
        </div>
      </div>
      <div className="foot-meta">
        <span>© {LEGAL_NAME} · Canada</span>
        <a href="mailto:help@brxs.ca">help@brxs.ca</a>
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
