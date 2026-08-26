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
  const [theme, setTheme] = useState<'dark' | 'light' | null>(null)
  const [systemDark, setSystemDark] = useState(
    typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
  )

  useEffect(() => {
    try {
      const saved = localStorage.getItem('bricks-theme') as 'dark' | 'light' | null
      if (saved) {
        setTheme(saved)
        document.documentElement.setAttribute('data-theme', saved)
      } else {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        setTheme(isDark ? 'dark' : 'light')
        setSystemDark(isDark)
      }
    } catch {}
  }, [])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => {
      const isDark = mq.matches
      setSystemDark(isDark)
      try {
        const saved = localStorage.getItem('bricks-theme')
        if (!saved) setTheme(isDark ? 'dark' : 'light')
      } catch {}
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.setAttribute('data-theme', next)
    try { localStorage.setItem('bricks-theme', next) } catch {}
  }

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
          <button
            className="theme-toggle"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            onClick={toggleTheme}
          >
            {theme === 'dark' ? (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="4.2" fill="currentColor" />
                <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                  <line x1="12" y1="2.5" x2="12" y2="5" />
                  <line x1="12" y1="19" x2="12" y2="21.5" />
                  <line x1="2.5" y1="12" x2="5" y2="12" />
                  <line x1="19" y1="12" x2="21.5" y2="12" />
                  <line x1="4.9" y1="4.9" x2="6.7" y2="6.7" />
                  <line x1="17.3" y1="17.3" x2="19.1" y2="19.1" />
                  <line x1="4.9" y1="19.1" x2="6.7" y2="17.3" />
                  <line x1="17.3" y1="6.7" x2="19.1" y2="4.9" />
                </g>
              </svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" fill="currentColor" />
              </svg>
            )}
          </button>
          <Link href="/book" className={`nav-cta${pathname === '/book' ? ' active' : ''}`} onClick={() => setOpen(false)}>
            Book a shoot
          </Link>
        </nav>
      </div>
      <style>{`
        .theme-toggle{
          display:inline-flex;align-items:center;justify-content:center;
          width:28px;height:28px;border:1px solid var(--hairStrong);border-radius:999px;
          background:none;color:var(--ink);font-size:13px;cursor:pointer;
          transition:background .15s ease,color .15s ease,border-color .15s ease;
        }
        .theme-toggle:hover{background:var(--paperDeep);color:var(--brickDeep);border-color:var(--brickDeep);}
        .nav-links{display:flex;gap:22px;align-items:center;}
        .nav-links a{font-size:13px;color:var(--inkSoft);text-decoration:none;}
        .nav-links a:hover{color:var(--brickDeep);}
        .nav-links a.active{color:var(--brickDeep);}
        @media (max-width:680px){
          .nav-links.open .theme-toggle{margin:0 24px 16px;align-self:flex-start;}
        }
      `}</style>
    </header>
  )
}
