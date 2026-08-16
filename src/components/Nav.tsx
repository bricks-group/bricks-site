'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/pricing', label: 'Pricing' },
  { href: '/gallery', label: 'Work' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
  { href: '/photographers', label: 'Photographers' },
]

export default function Nav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header>
      <div className="nav">
        <Link href="/" className="brand" aria-label="Bricks — home" onClick={() => setOpen(false)}>
          <svg className="brand-mark" viewBox="0 0 24 24" fill="none" aria-label="Bricks mark">
            <rect x="3" y="4" width="11" height="6.4" rx="0.8" fill="#D2542B" opacity="0.82" />
            <rect x="3" y="11.6" width="6" height="8.4" rx="0.8" fill="#D2542B" />
            <rect x="10.2" y="11.6" width="10.8" height="8.4" rx="0.8" fill="#D2542B" />
          </svg>
          <span className="wordmark">bricks</span>
        </Link>
        <button
          className={`nav-toggle${open ? ' open' : ''}`}
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <span></span><span></span><span></span>
        </button>
        <nav className={`nav-links${open ? ' open' : ''}`}>
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={pathname === l.href ? 'active' : ''}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <Link href="/book" className={`nav-cta${pathname === '/book' ? ' active' : ''}`} onClick={() => setOpen(false)}>
            Book a shoot
          </Link>
        </nav>
      </div>
    </header>
  )
}
