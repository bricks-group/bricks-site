'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import BrandMark from '@/components/BrandMark'
import { OS_LOGIN, OS_URL } from '@/lib/brand'
import { clearHintCookies, osLogoutUrl } from '@/lib/site-session'
import { HELP_URL, softwareParts } from '@/lib/nav'
import './nav-builders.css'

const links = [
  { href: '/builders', label: 'Builders & developers' },
  { href: '/media', label: 'Media' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/gallery', label: 'Our work' },
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
  const [sw, setSw] = useState(false)
  const [swDrawer, setSwDrawer] = useState(false)
  const swRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setOpen(false)
    setSw(false)
  }, [pathname])

  useEffect(() => {
    if (!sw) return
    function onDown(e: MouseEvent) {
      if (swRef.current && !swRef.current.contains(e.target as Node)) setSw(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setSw(false)
        swRef.current?.querySelector<HTMLButtonElement>('button')?.focus()
      }
    }
    document.addEventListener('mousedown', onDown)
    window.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      window.removeEventListener('keydown', onKey)
    }
  }, [sw])

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
            <div
              className={`nav-dd${sw ? ' open' : ''}`}
              ref={swRef}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node)) setSw(false)
              }}
            >
              <button
                type="button"
                className={`nav-dd-btn${pathname === '/platform' || pathname.startsWith('/software') ? ' active' : ''}`}
                aria-expanded={sw}
                aria-controls="nav-software-menu"
                onClick={() => setSw((v) => !v)}
              >
                Software<span className="nav-dd-caret" aria-hidden="true" />
              </button>
              <div id="nav-software-menu" className="nav-dd-panel" hidden={!sw}>
                <Link href="/platform" className="nav-dd-all" onClick={() => setSw(false)}>
                  <strong>All software</strong>
                  <span>One system, from site to sale</span>
                </Link>
                <ul>
                  {softwareParts.map((m) => (
                    <li key={m.href}>
                      <Link href={m.href} onClick={() => setSw(false)}>
                        <strong>{m.label}</strong>
                        <span>{m.detail}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
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
            <a href={HELP_URL} className="nav-login nav-help">
              Help
            </a>
            <a href={OS_LOGIN} className="nav-cta nav-auth-out">
              Try Bricks free
            </a>
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
        <nav className="drawer-links" aria-label="Site menu">
          <button
            type="button"
            className="drawer-dd-btn"
            aria-expanded={swDrawer}
            aria-controls="drawer-software"
            onClick={() => setSwDrawer((v) => !v)}
          >
            Software<span aria-hidden="true">{swDrawer ? '−' : '+'}</span>
          </button>
          <div id="drawer-software" className="drawer-sub" hidden={!swDrawer}>
            <Link href="/platform" onClick={() => setOpen(false)}>All software</Link>
            {softwareParts.map((m) => (
              <Link key={m.href} href={m.href} onClick={() => setOpen(false)}>{m.label}</Link>
            ))}
          </div>
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
          <Link href="/teams" className={pathname === '/teams' ? 'active' : ''} onClick={() => setOpen(false)}>Teams</Link>
          <Link href="/brokerage" className={pathname === '/brokerage' ? 'active' : ''} onClick={() => setOpen(false)}>Brokerages</Link>
          <Link href="/investors" className={pathname === '/investors' ? 'active' : ''} onClick={() => setOpen(false)}>Investors</Link>
          <Link href="/reits" className={pathname === '/reits' ? 'active' : ''} onClick={() => setOpen(false)}>REITs</Link>
          <Link href="/commercial" className={pathname === '/commercial' ? 'active' : ''} onClick={() => setOpen(false)}>Commercial</Link>
          <Link href="/property-managers" className={pathname === '/property-managers' ? 'active' : ''} onClick={() => setOpen(false)}>Property managers</Link>
          <Link href="/services" className={pathname === '/services' ? 'active' : ''} onClick={() => setOpen(false)}>Home services</Link>
          <a href={HELP_URL} onClick={() => setOpen(false)}>Help</a>
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
          <a href={OS_LOGIN} className="drawer-cta nav-auth-out" onClick={() => setOpen(false)}>
            Try Bricks free
          </a>
        </nav>
      </div>
    </>
  )
}
