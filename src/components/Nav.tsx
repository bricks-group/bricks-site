'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import BrandMark from '@/components/BrandMark'

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
