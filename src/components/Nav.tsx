'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import BrandMark from '@/components/BrandMark'
import CtaLink from '@/components/rev/CtaLink'
import { OS_LOGIN, COMPANION_URL } from '@/lib/brand'
import { CORE_FROM, PHOTO_ONLY_FROM } from '@/lib/pricing'
import './rev/nav-rev.css'

type Item = { href: string; label: string; note: string; meta?: string }

const SERVICES: { group: string; items: Item[] }[] = [
  {
    group: 'Listing media',
    items: [
      { href: '/real-estate-photography', label: 'Listing photos', note: 'HDR, licensed drone, floor plan', meta: `from $${CORE_FROM}` },
      { href: '/pricing', label: 'Photos only', note: 'HDR only, no drone', meta: `from $${PHOTO_ONLY_FROM}` },
      { href: '/gallery', label: 'Work', note: 'Real shoots' },
    ],
  },
  {
    group: 'Booking & coverage',
    items: [
      { href: '/book', label: 'Book a shoot', note: 'Exact clock time, pay to lock' },
      { href: '/service-areas', label: 'Service areas', note: 'Canada-wide launch' },
      { href: COMPANION_URL, label: 'Companion', note: 'The agent app' },
    ],
  },
  {
    group: 'Platform',
    items: [
      { href: '/platform', label: 'Platform', note: 'The desk runs the deal' },
      { href: '/agents', label: 'Agents & teams', note: 'One file per listing' },
    ],
  },
]

const FLAT: Item[] = [
  { href: '/pricing', label: 'Pricing', note: '' },
  { href: '/brokerage', label: 'For Brokerages', note: '' },
  { href: '/#virtual-visit', label: 'Virtual Visit', note: '' },
  { href: '/photographers', label: 'Photographers', note: '' },
]

export default function Nav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false) // mobile sheet
  const [menu, setMenu] = useState(false) // desktop dropdown
  const closeT = useRef<ReturnType<typeof setTimeout> | null>(null)
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => { setOpen(false); setMenu(false) }, [pathname])

  useEffect(() => {
    document.documentElement.classList.toggle('rv-lock', open)
    return () => document.documentElement.classList.remove('rv-lock')
  }, [open])

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') { setOpen(false); setMenu(false) } }
    function onDown(e: PointerEvent) { if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setMenu(false) }
    window.addEventListener('keydown', onKey)
    window.addEventListener('pointerdown', onDown)
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener('pointerdown', onDown) }
  }, [])

  const enter = () => { if (closeT.current) clearTimeout(closeT.current); setMenu(true) }
  const leave = () => { closeT.current = setTimeout(() => setMenu(false), 140) }
  const isExt = (h: string) => /^https?:/.test(h)

  return (
    <>
      <header className="rv-header" data-menu={menu || undefined}>
        <div className="rv-nav">
          <Link href="/" className="brand rv-brand" aria-label="Bricks — home">
            <BrandMark />
            <span className="wordmark">bricks</span>
          </Link>

          <nav className="rv-links" aria-label="Primary">
            <div className="rv-dd" ref={wrapRef} onPointerEnter={enter} onPointerLeave={leave}>
              <button
                className="rv-link rv-dd-trigger"
                aria-expanded={menu}
                aria-controls="rv-services"
                onClick={() => setMenu((v) => !v)}
              >
                Services <span className="rv-caret" aria-hidden="true" />
              </button>
              <div id="rv-services" className="rv-panel" data-open={menu || undefined} role="region" aria-label="Services">
                <div className="rv-panel-grid">
                  {SERVICES.map((g) => (
                    <div key={g.group} className="rv-panel-col">
                      <span className="rv-mono rv-panel-k">{g.group}</span>
                      {g.items.map((it) =>
                        isExt(it.href) ? (
                          <a key={it.label} href={it.href} className="rv-panel-item" tabIndex={menu ? 0 : -1}>
                            <span className="rv-panel-t">{it.label}</span>
                            <span className="rv-panel-n">{it.note}</span>
                          </a>
                        ) : (
                          <Link key={it.label} href={it.href} className="rv-panel-item" tabIndex={menu ? 0 : -1}>
                            <span className="rv-panel-t">{it.label}{it.meta ? <em className="rv-mono">{it.meta}</em> : null}</span>
                            <span className="rv-panel-n">{it.note}</span>
                          </Link>
                        ),
                      )}
                    </div>
                  ))}
                  <Link href="/gallery" className="rv-panel-feature" tabIndex={menu ? 0 : -1}>
                    <span className="rv-panel-img"><img src="/media/work/02.jpg" alt="" /></span>
                    <span className="rv-mono rv-panel-k">Detached · Exterior</span>
                    <span className="rv-panel-t">See real shoots <span aria-hidden>→</span></span>
                  </Link>
                </div>
              </div>
            </div>
            {FLAT.map((l) => (
              <Link key={l.href} href={l.href} className={`rv-link${pathname === l.href ? ' active' : ''}`}>{l.label}</Link>
            ))}
          </nav>

          <div className="rv-actions">
            <a href={OS_LOGIN} className="rv-link rv-login">Log in</a>
            <CtaLink href="/book" className="rv-btn-brick rv-btn-sm rv-nav-cta">Book a shoot</CtaLink>
            <button
              className="rv-burger"
              data-open={open || undefined}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="rv-sheet"
              onClick={() => setOpen((v) => !v)}
            >
              <span /><span />
            </button>
          </div>
        </div>
      </header>

      <div id="rv-sheet" className="rv-sheet" data-open={open || undefined} role="dialog" aria-modal="true" aria-label="Site menu" aria-hidden={!open}>
        <div className="rv-sheet-body">
          <span className="rv-mono rv-sheet-k" style={{ ['--i' as string]: 0 }}>Services</span>
          {[
            { href: '/real-estate-photography', label: 'Listing photos', meta: `from $${CORE_FROM}` },
            { href: '/gallery', label: 'Work' },
            { href: '/service-areas', label: 'Service areas' },
            { href: '/platform', label: 'Platform' },
          ].map((l, i) => (
            <Link key={l.href} href={l.href} className="rv-sheet-sm" style={{ ['--i' as string]: i + 1 }} tabIndex={open ? 0 : -1}>
              {l.label}{l.meta ? <span className="rv-mono">{l.meta}</span> : null}
            </Link>
          ))}
          <hr className="rv-sheet-rule" style={{ ['--i' as string]: 5 }} />
          {FLAT.map((l, i) => (
            <Link key={l.href} href={l.href} className="rv-sheet-lg" style={{ ['--i' as string]: i + 6 }} tabIndex={open ? 0 : -1}>
              {l.label}
            </Link>
          ))}
          <a href={OS_LOGIN} className="rv-sheet-lg rv-sheet-muted" style={{ ['--i' as string]: 10 }} tabIndex={open ? 0 : -1}>Log in</a>
        </div>
        <div className="rv-sheet-foot" style={{ ['--i' as string]: 11 }}>
          <CtaLink href="/book" className="rv-btn-brick rv-btn-block">Book a shoot</CtaLink>
          <CtaLink href="/contact" className="rv-btn-ghost rv-btn-block" loaderColor="#D2542B">Talk to us — brokerages</CtaLink>
          <span className="rv-mono rv-sheet-meta">help@brxs.ca · 343-453-4578 · <span>EN</span> / <span title="Français — bientôt">FR</span></span>
        </div>
      </div>
    </>
  )
}
