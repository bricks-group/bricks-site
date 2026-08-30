'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

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

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const close = () => setOpen(false)

  const brandMark = (
    <svg className="brand-mark" width="26" height="26" viewBox="0 0 24 24" fill="none" aria-label="Bricks mark">
      <rect x="3" y="4" width="11" height="6.4" rx="0.8" fill="#D2542B" opacity="0.82" />
      <rect x="3" y="11.6" width="6" height="8.4" rx="0.8" fill="#D2542B" />
      <rect x="10.2" y="11.6" width="10.8" height="8.4" rx="0.8" fill="#D2542B" />
    </svg>
  )

  return (
    <header>
      <div className="nav">
        <div className="nav-inner">
          <Link href="/" className="brand" aria-label="Bricks — home" onClick={close}>
            {brandMark}
            <span className="wordmark">bricks</span>
          </Link>

          <div className="nav-links">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className={pathname === l.href ? 'active' : ''}>
                {l.label}
              </Link>
            ))}
          </div>

          <div className="nav-cta">
            <Link
              href="/book"
              className={`nav-book desktop-only${pathname === '/book' ? ' active' : ''}`}
            >
              Book a shoot
            </Link>
            <button
              className="nav-burger"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
            >
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>
      </div>

      <div className={`drawer${open ? ' open' : ''}`} aria-hidden={!open} inert={!open ? true : undefined}>
        <div className="drawer-top">
          <Link href="/" className="brand" onClick={close}>
            {brandMark}
            <span className="wordmark">bricks</span>
          </Link>
          <button className="nav-burger" aria-label="Close menu" onClick={close}>
            <span style={{ transform: 'translateY(6.5px) rotate(45deg)' }}></span>
            <span style={{ opacity: 0 }}></span>
            <span style={{ transform: 'translateY(-6.5px) rotate(-45deg)' }}></span>
          </button>
        </div>
        <nav className="drawer-links">
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={close}>
              {l.label}
            </Link>
          ))}
          <Link href="/book" onClick={close} style={{ color: 'var(--brick)' }}>
            Book a shoot →
          </Link>
        </nav>
      </div>
    </header>
  )
}
