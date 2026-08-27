'use client'

import { useEffect, useState } from 'react'

const KEY = 'bricks-theme'
type Pref = 'system' | 'light' | 'dark'

function resolve(pref: Pref): 'light' | 'dark' {
  if (pref === 'dark' || pref === 'light') return pref
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function readPref(): Pref {
  try {
    const stored = localStorage.getItem(KEY)
    if (stored === 'dark' || stored === 'light' || stored === 'system') return stored
  } catch {
    /* private mode / blocked storage */
  }
  return 'system'
}

function apply(pref: Pref) {
  const resolved = resolve(pref)
  const root = document.documentElement
  root.setAttribute('data-theme', resolved)
  root.style.colorScheme = resolved
}

const OPTIONS: { id: Pref; label: string }[] = [
  { id: 'system', label: 'System' },
  { id: 'light', label: 'Light' },
  { id: 'dark', label: 'Dark' },
]

export default function ThemeToggle() {
  const [pref, setPref] = useState<Pref>('system')

  useEffect(() => {
    const current = readPref()
    setPref(current)
    apply(current)

    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => {
      if (readPref() === 'system') apply('system')
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  function select(next: Pref) {
    try {
      localStorage.setItem(KEY, next)
    } catch {
      /* private mode / blocked storage */
    }
    setPref(next)
    apply(next)
  }

  return (
    <div className="theme-switch" role="group" aria-label="Theme">
      {OPTIONS.map((o) => (
        <button
          key={o.id}
          type="button"
          aria-pressed={pref === o.id}
          onClick={() => select(o.id)}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}
