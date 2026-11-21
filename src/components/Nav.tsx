'use client'

import { useEffect, useRef, useState } from 'react'
import Link from '@/components/SiteLink'
import { usePathname } from 'next/navigation'
import { OS_LOGIN, OS_URL } from '@/lib/brand'
import { clearHintCookies, osLogoutUrl } from '@/lib/site-session'
import { HELP_URL, audienceLinks, softwareGroups, type NavItem } from '@/lib/nav'
import NavIcon from './NavIcon'
import './nav-builders.css'

const AUDIENCE_PATHS = ['/builders', '/construction', '/agents', '/teams', '/brokerage', '/office', '/property-managers', '/photographers']

const links = [
  { href: '/media', label: 'Media' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/gallery', label: 'Our work' },
]

const DRAWER_ICON = { '/media': 'media', '/pricing': 'card', '/gallery': 'gallery' } as const

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
  const [menu, setMenu] = useState<'sw' | 'who' | null>(null)
  const [drawerMenu, setDrawerMenu] = useState<'sw' | 'who' | null>(null)
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    setOpen(false)
    setMenu(null)
  }, [pathname])

  useEffect(() => {
    if (!menu) return
    const current = menu
    function onDown(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setMenu(null)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setMenu(null)
        navRef.current?.querySelector<HTMLButtonElement>(`[aria-controls="nav-${current}-menu"]`)?.focus()
      }
    }
    document.addEventListener('mousedown', onDown)
    window.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      window.removeEventListener('keydown', onKey)
    }
  }, [menu])

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
              <span className="wordmark">bricks</span>
            </Link>
          </div>
          <nav className="nav-links" aria-label="Primary" ref={navRef}>
            <div
              className={`nav-dd${menu === 'sw' ? ' open' : ''}`}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node) && menu === 'sw') setMenu(null)
              }}
            >
              <button
                type="button"
                className={`nav-dd-btn${pathname === '/platform' || pathname.startsWith('/software') ? ' active' : ''}`}
                aria-expanded={menu === 'sw'}
                aria-controls="nav-sw-menu"
                onClick={() => setMenu((v) => (v === 'sw' ? null : 'sw'))}
              >
                Software<span className="nav-dd-caret" aria-hidden="true" />
              </button>
              <div id="nav-sw-menu" className="nav-dd-panel nav-dd-groups" hidden={menu !== 'sw'}>
                <Link href="/platform" className="nav-dd-all" onClick={() => setMenu(null)}>
                  <strong>All software</strong>
                  <span>One system, from site to sale</span>
                </Link>
                <div className="nav-dd-cols">
                  {softwareGroups.map((g) => (
                    <div key={g.label} className="nav-dd-group">
                      <p className="nav-dd-label">{g.label}</p>
                      <ul>
                        {g.items.map((m) => (
                          <DdItem key={m.label} item={m} onPick={() => setMenu(null)} />
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div
              className={`nav-dd${menu === 'who' ? ' open' : ''}`}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node) && menu === 'who') setMenu(null)
              }}
            >
              <button
                type="button"
                className={`nav-dd-btn nav-nowrap${AUDIENCE_PATHS.includes(pathname) ? ' active' : ''}`}
                aria-expanded={menu === 'who'}
                aria-controls="nav-who-menu"
                onClick={() => setMenu((v) => (v === 'who' ? null : 'who'))}
              >
                Who it&rsquo;s for<span className="nav-dd-caret" aria-hidden="true" />
              </button>
              <div id="nav-who-menu" className="nav-dd-panel nav-dd-who" hidden={menu !== 'who'}>
                <ul>
                  {audienceLinks.map((m) => (
                    <DdItem key={m.href} item={m} onPick={() => setMenu(null)} />
                  ))}
                </ul>
              </div>
            </div>
            {links.map((l) => (
              <Link key={l.href} href={l.href} className={pathname === l.href ? 'active' : ''}>
                {l.label}
              </Link>
            ))}
            <a href={HELP_URL} className="nav-help-link">Help</a>
          </nav>
          <div className="nav-actions">
            {/* Signed-in state comes from <html data-bx-auth>, set before paint (see site-session.ts). */}
            <a href={OS_LOGIN} className="nav-login nav-auth-out">
              <NavIcon name="person" size={16} />
              Log in
            </a>
            <a href={OS_URL} className="nav-login nav-auth-in nav-open">
              Open Bricks
            </a>
            <button type="button" className="nav-login nav-auth-in nav-logout" onClick={logOut}>
              Log out
            </button>
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
              <NavIcon name={open ? 'close' : 'menu'} size={24} />
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
        <div className="drawer-sheet">
        <div className="drawer-head">
          <Link href="/" className="brand" aria-label="Bricks — home" onClick={() => setOpen(false)}>
            <span className="wordmark">bricks</span>
          </Link>
          <button className="drawer-close" aria-label="Close menu" onClick={() => setOpen(false)}>
            <NavIcon name="close" size={24} />
          </button>
        </div>
        <nav className="drawer-links" aria-label="Site menu">
          <button
            type="button"
            className="drawer-dd-btn"
            aria-expanded={drawerMenu === 'sw'}
            aria-controls="drawer-software"
            onClick={() => setDrawerMenu((v) => (v === 'sw' ? null : 'sw'))}
          >
            <NavIcon name="integrations" />
            <span className="drawer-txt">Software</span>
            <NavIcon name={drawerMenu === 'sw' ? 'chevronUp' : 'chevronDown'} size={16} />
          </button>
          <div id="drawer-software" className="drawer-sub" hidden={drawerMenu !== 'sw'}>
            <Link href="/platform" onClick={() => setOpen(false)}>All software</Link>
            {softwareGroups.map((g) => (
              <div key={g.label} className="drawer-group">
                <p className="drawer-label">{g.label}</p>
                {g.items.map((m) => (
                  <Link key={m.label} href={m.href} onClick={() => setOpen(false)}>{m.label}</Link>
                ))}
              </div>
            ))}
          </div>
          <button
            type="button"
            className="drawer-dd-btn"
            aria-expanded={drawerMenu === 'who'}
            aria-controls="drawer-who"
            onClick={() => setDrawerMenu((v) => (v === 'who' ? null : 'who'))}
          >
            <NavIcon name="team" />
            <span className="drawer-txt">Who it&rsquo;s for</span>
            <NavIcon name={drawerMenu === 'who' ? 'chevronUp' : 'chevronDown'} size={16} />
          </button>
          <div id="drawer-who" className="drawer-sub" hidden={drawerMenu !== 'who'}>
            <Link href="/builders" onClick={() => setOpen(false)}>Builders &amp; developers</Link>
            <Link href="/agents" onClick={() => setOpen(false)}>Agents &amp; brokerages</Link>
            <Link href="/teams" onClick={() => setOpen(false)}>Teams</Link>
            <Link href="/property-managers" onClick={() => setOpen(false)}>Property managers</Link>
            <Link href="/photographers" onClick={() => setOpen(false)}>Vendors</Link>
            <div className="drawer-group">
              <p className="drawer-label">Also</p>
              <Link href="/investors" onClick={() => setOpen(false)}>Investors</Link>
              <Link href="/reits" onClick={() => setOpen(false)}>REITs</Link>
              <Link href="/commercial" onClick={() => setOpen(false)}>Commercial</Link>
              <Link href="/services" onClick={() => setOpen(false)}>Home services</Link>
            </div>
          </div>
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={`drawer-row${pathname === l.href ? ' active' : ''}`} onClick={() => setOpen(false)}>
              <NavIcon name={DRAWER_ICON[l.href as keyof typeof DRAWER_ICON]} />
              <span className="drawer-txt">{l.label}</span>
            </Link>
          ))}
          <a href={HELP_URL} className="drawer-row" onClick={() => setOpen(false)}>
            <NavIcon name="help" />
            <span className="drawer-txt">Help centre</span>
            <NavIcon name="external" size={16} />
          </a>
          <Link
            href="/contact"
            className={`drawer-row${pathname === '/contact' ? ' active' : ''}`}
            onClick={() => setOpen(false)}
          >
            <NavIcon name="mail" />
            <span className="drawer-txt">Contact</span>
          </Link>
          <a href={OS_URL} className="drawer-row nav-auth-in" onClick={() => setOpen(false)}>
            <NavIcon name="person" />
            <span className="drawer-txt">Open Bricks</span>
          </a>
          <button type="button" className="drawer-row nav-auth-in drawer-logout" onClick={logOut}>
            <NavIcon name="logout" />
            <span className="drawer-txt">Log out</span>
          </button>
        </nav>
        <div className="drawer-bar nav-auth-out">
          <a href={OS_LOGIN} className="drawer-btn drawer-btn-line" onClick={() => setOpen(false)}>Log in</a>
          <a href={OS_LOGIN} className="drawer-btn drawer-btn-brick" onClick={() => setOpen(false)}>Try Bricks free</a>
        </div>
        </div>
      </div>
    </>
  )
}

function DdItem({ item, onPick }: { item: NavItem; onPick: () => void }) {
  return (
    <li>
      <Link href={item.href} onClick={onPick}>
        <strong>{item.label}</strong>
        <span>{item.detail}</span>
      </Link>
    </li>
  )
}
