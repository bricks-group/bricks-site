import type { ReactNode } from 'react'
import Link from '@/components/SiteLink'
import { COMPANION_URL, GO_URL, OS_LOGIN, STATUS } from '@/lib/brand'
import { SOCIAL_PROFILES } from '@/lib/schema'
import ThemeToggle from '@/components/ThemeToggle'

export default function Footer({ children }: { children?: ReactNode }) {
  return (
    <footer>
      {children}
      <div className="foot-inner">
        <div className="foot-brand">
          <Link href="/" className="brand" aria-label="Bricks — home">
            <span className="wordmark">bricks</span>
          </Link>
          <p className="foot-blurb">
            The system that brings it all together.
          </p>
          <Link href="/newsletter" className="foot-news">Get the Bricks newsletter</Link>
        </div>
        <div className="foot-col">
          <p className="foot-heading">Software</p>
          <div className="foot-links">
            <Link href="/platform">Platform</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/why-bricks">Why Bricks</Link>
            <a href={COMPANION_URL} rel="noopener noreferrer">Companion app</a>
            <a href={OS_LOGIN}>Log in</a>
          </div>
        </div>
        <div className="foot-col">
          <p className="foot-heading">Services</p>
          <div className="foot-links">
            <Link href="/media">Listing media</Link>
            <Link href="/builders">Site Progress</Link>
            <Link href="/services">Home services</Link>
            <Link href="/gallery">Our work</Link>
            <Link href="/service-areas">Service areas</Link>
          </div>
        </div>
        <div className="foot-col">
          <p className="foot-heading">Who it&apos;s for</p>
          <div className="foot-links">
            <Link href="/agents">Agents</Link>
            <Link href="/teams">Teams</Link>
            <Link href="/brokerage">Brokerages</Link>
            <Link href="/property-managers">Property managers</Link>
            <Link href="/investors">Investors</Link>
          </div>
        </div>
        <div className="foot-col">
          <p className="foot-heading">Company</p>
          <div className="foot-links">
            <Link href="/about">About</Link>
            <Link href="/work-with-bricks">Work with Bricks</Link>
            <Link href="/blog">Blog</Link>
            <a href="https://help.brxs.ca">Help centre</a>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
      </div>
      <div className="foot-meta">
        <span>© Bricks · 6330 Montevideo Road, Mississauga, ON</span>
        <span className="foot-legal">
          <Link href="/terms">Terms</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/legal">Legal</Link>
        </span>
        <span className="foot-contact">
          <a href="mailto:hello@brxs.ca">hello@brxs.ca</a>
          <span className="mono">(289) 312-7425</span>
          <a href="https://share.google/7ttYfc6W7JRwlqA9U" target="_blank" rel="noopener noreferrer">Google</a>
          {SOCIAL_PROFILES.map((p) => (
            <a key={p.url} href={p.url} target="_blank" rel="me noopener noreferrer">{p.label}</a>
          ))}
        </span>
        <ThemeToggle />
      </div>
    </footer>
  )
}
