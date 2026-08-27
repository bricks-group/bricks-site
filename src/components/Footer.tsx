import Link from 'next/link'
import { COVERAGE_LINE } from '@/lib/brand'
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
            Listing media for Canadian real estate. HDR, licensed drone, and a floor plan on every standard shoot — booked direct, delivered in 24–48 hours.
          </p>
        </div>
        <div className="foot-col">
          <h4>Product</h4>
          <Link href="/pricing">Pricing</Link>
          <Link href="/gallery">Work</Link>
          <Link href="/book">Book a shoot</Link>
          <Link href="/photographers">Photographers</Link>
        </div>
        <div className="foot-col">
          <h4>Company</h4>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/service-areas">Service areas</Link>
          <Link href="/blog">Resources</Link>
        </div>
        <div className="foot-col">
          <h4>Legal</h4>
          <Link href="/terms">Terms</Link>
          <Link href="/privacy">Privacy</Link>
        </div>
      </div>
      <div className="foot-meta">
        <span>© Bricks Group · Canada</span>
        <a href="mailto:booking@brxs.ca">booking@brxs.ca</a>
        <span className="mono">343-453-4578</span>
        <a href="https://share.google/7ttYfc6W7JRwlqA9U" target="_blank" rel="noopener noreferrer">Find us on Google</a>
        <span className="foot-cover">{COVERAGE_LINE}</span>
        <ThemeToggle />
      </div>
    </footer>
  )
}
