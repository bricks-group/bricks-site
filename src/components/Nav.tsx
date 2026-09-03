'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import BrandMark from '@/components/BrandMark'

const links = [
  { href: '/gallery', label: 'Work' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/photographers', label: 'Photographers' },
  { href: '/platform', label: 'Platform' },
]

const OS_LOGIN = 'https://app.brxs.ca/login'

export default function Nav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    document.documentElement.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <header>
        <div className="nav">
          <div className="brand-cluster">
            <Link href="/" className="brand" aria-label="Bricks — home">
              <BrandMark />
              <span className="wordmark">bricks</span>
            </Link>
            <span className="nav-flag">Canada</span>
          </div>
          <nav className="nav-links" aria-label="Primary">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={pathname === l.href ? 'active' : ''}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="nav-actions">
            <a href={OS_LOGIN} className="nav-login">
              Log in
            </a>
            <Link
              href="/contact"
              className={`nav-sec${pathname === '/contact' ? ' active' : ''}`}
            >
              Contact
            </Link>
            <Link
              href="/book"
              className={`nav-cta${pathname === '/book' ? ' active' : ''}`}
            >
              Book a shoot
            </Link>
            <button
              className={`nav-burger${open ? ' open' : ''}`}
              aria-label="Menu"
              aria-expanded={open}
              aria-controls="site-drawer"
              onClick={() => setOpen((v) => !v)}
            >
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>
      </header>

      <div
        id="site-drawer"
        className={`drawer${open ? ' open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        aria-hidden={!open}
      >
        <div className="drawer-head">
          <Link href="/" className="brand" aria-label="Bricks — home" onClick={() => setOpen(false)}>
            <BrandMark />
            <span className="wordmark">bricks</span>
          </Link>
          <button className="drawer-close" aria-label="Close menu" onClick={() => setOpen(false)}>
            <span aria-hidden="true">×</span>
          </button>
        </div>
        <nav className="drawer-links">
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
          <Link href="/brokerage" className={pathname === '/brokerage' || pathname === '/office' ? 'active' : ''} onClick={() => setOpen(false)}>Brokerage</Link>
          <Link href="/agents" className={pathname === '/agents' ? 'active' : ''} onClick={() => setOpen(false)}>Agents</Link>
          <Link
            href="/contact"
            className={pathname === '/contact' ? 'active' : ''}
            onClick={() => setOpen(false)}
          >
            Contact
          </Link>
          <a href={OS_LOGIN} onClick={() => setOpen(false)}>
            Log in
          </a>
          <Link
            href="/book"
            className={`drawer-cta${pathname === '/book' ? ' active' : ''}`}
            onClick={() => setOpen(false)}
          >
            Book a shoot
          </Link>
        </nav>
      </div>
    </>
  )
}
