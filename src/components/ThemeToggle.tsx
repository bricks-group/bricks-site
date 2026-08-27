'use client'

import { useEffect, useState } from 'react'

const KEY = 'bricks-theme'

function isDark() {
  if (typeof document === 'undefined') return false
  const t = document.documentElement.getAttribute('data-theme')
  return t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)
}

export default function ThemeToggle() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const sync = () => setDark(isDark())
    sync()
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  function toggle() {
    const next = isDark() ? 'light' : 'dark'
    document.documentElement.setAttribute('data-theme', next)
    try {
      localStorage.setItem(KEY, next)
    } catch {
      /* private mode / blocked storage */
    }
    setDark(next === 'dark')
  }

  return (
    <button
      type="button"
      className="theme-toggle"
      aria-label={dark ? 'Switch to light' : 'Switch to dark'}
      onClick={toggle}
    >
      {dark ? '○' : '◑'}
    </button>
  )
}
