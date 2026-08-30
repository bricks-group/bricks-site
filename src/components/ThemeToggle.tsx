'use client'

import { useEffect, useState } from 'react'

type Pref = 'system' | 'light' | 'dark'
const KEY = 'bricks-theme'

export default function ThemeToggle() {
  const [pref, setPref] = useState<Pref>('system')

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY) as 'light' | 'dark' | null
      setPref(saved ?? 'system')
    } catch {}
  }, [])

  function choose(next: Pref) {
    setPref(next)
    try {
      if (next === 'system') {
        localStorage.removeItem(KEY)
        document.documentElement.removeAttribute('data-theme')
      } else {
        localStorage.setItem(KEY, next)
        document.documentElement.setAttribute('data-theme', next)
      }
    } catch {}
  }

  return (
    <div className="theme-seg" role="group" aria-label="Theme">
      <button
        aria-label="Match system"
        aria-pressed={pref === 'system'}
        className={pref === 'system' ? 'active' : ''}
        onClick={() => choose('system')}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="3" y="4" width="18" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
          <line x1="8" y1="20" x2="16" y2="20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="12" y1="16" x2="12" y2="20" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      </button>
      <button
        aria-label="Light"
        aria-pressed={pref === 'light'}
        className={pref === 'light' ? 'active' : ''}
        onClick={() => choose('light')}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
      </button>
      <button
        aria-label="Dark"
        aria-pressed={pref === 'dark'}
        className={pref === 'dark' ? 'active' : ''}
        onClick={() => choose('dark')}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" fill="currentColor" />
        </svg>
      </button>
      <style>{`
        .theme-seg{display:inline-flex;align-items:center;gap:2px;padding:3px;border-radius:999px;
          background:var(--paper-soft);border:1px solid var(--hair-s);}
        .theme-seg button{display:flex;align-items:center;justify-content:center;width:26px;height:26px;
          border-radius:999px;background:none;border:none;color:var(--ink-3);cursor:pointer;
          transition:background .15s ease,color .15s ease;}
        .theme-seg button:hover{color:var(--ink);}
        .theme-seg button.active{background:var(--paper);color:var(--ink);box-shadow:0 1px 2px rgba(20,17,14,.1);}
      `}</style>
    </div>
  )
}
