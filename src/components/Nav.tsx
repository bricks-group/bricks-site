'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import BrandMark from '@/components/BrandMark'
import { OS_LOGIN, OS_URL } from '@/lib/brand'
import { clearHintCookies, osLogoutUrl } from '@/lib/site-session'
import './nav-builders.css'

const links = [
  { href: '/platform', label: 'Software' },
  { href: '/builders', label: 'Builders & developers' },
  { href: '/media', label: 'Media' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/gallery', label: 'Work' },
]

/**
 * Log out of Bricks from www: drop the .brxs.ca signed-in hint here, then let
 * app.brxs.ca sign out of Supabase (the session lives in its storage) and send
 * the browser back to the www homepage.
 */
function logOut() {
  try {
    const secure = location.protocol === 'https:'
    for (const c of clearHintCookies(location.hostname, secure)) document.cookie = c
  } catch {
    /* cookies blocked: app.brxs.ca/logout still clears it */
  }
  location.assign(osLogoutUrl(`${location.origin}/`))
}

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
                className={`${pathname === l.href || (l.href === '/builders' && pathname === '/construction') ? 'active' : ''}${l.href === '/builders' ? ' nav-nowrap' : ''}`}
                aria-label={l.href === '/builders' ? l.label : undefined}
              >
                {l.href === '/builders' ? (
                  <><span className="nav-full">{l.label}</span><span className="nav-short">Builders</span></>
                ) : l.label}
              </Link>
            ))}
          </nav>
          <div className="nav-actions">
            {/* Signed-in state comes from <html data-bx-auth>, set before paint (see site-session.ts). */}
            <a href={OS_LOGIN} className="nav-login nav-auth-out">
              Log in
            </a>
            <a href={OS_URL} className="nav-login nav-auth-in nav-open">
              Open Bricks
            </a>
            <button type="button" className="nav-login nav-auth-in nav-logout" onClick={logOut}>
              Log out
            </button>
            <Link
              href="/contact"
              className={`nav-sec${pathname === '/contact' ? ' active' : ''}`}
            >
              Contact
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
              className={pathname === l.href || (l.href === '/brokerage' && pathname === '/office') || (l.href === '/builders' && pathname === '/construction') ? 'active' : ''}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <Link href="/agents" className={pathname === '/agents' ? 'active' : ''} onClick={() => setOpen(false)}>Agents</Link>
          <Link href="/investors" className={pathname === '/investors' ? 'active' : ''} onClick={() => setOpen(false)}>Investors and REITs</Link>
          <Link href="/commercial" className={pathname === '/commercial' ? 'active' : ''} onClick={() => setOpen(false)}>Commercial</Link>
          <Link href="/property-managers" className={pathname === '/property-managers' ? 'active' : ''} onClick={() => setOpen(false)}>Property managers</Link>
          <Link
            href="/contact"
            className={pathname === '/contact' ? 'active' : ''}
            onClick={() => setOpen(false)}
          >
            Contact
          </Link>
          <a href={OS_LOGIN} className="nav-auth-out" onClick={() => setOpen(false)}>
            Log in
          </a>
          <a href={OS_URL} className="nav-auth-in" onClick={() => setOpen(false)}>
            Open Bricks
          </a>
          <button type="button" className="nav-auth-in drawer-logout" onClick={logOut}>
            Log out
          </button>
        </nav>
      </div>
    </>
  )
}
