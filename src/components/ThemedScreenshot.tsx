'use client'

import { useEffect, useState } from 'react'

function readIsDark(): boolean {
  const t = document.documentElement.getAttribute('data-theme')
  return t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme:dark)').matches)
}

// Screenshots are static captures of the real product, which itself has real light/dark
// modes (see public/screens/*.html -- bricks.js already renders both; these PNGs are
// pre-captured for performance instead of a live iframe, see git history for why that
// swap happened). Without this, every screenshot was a hardcoded light-mode capture that
// stuck out badly against the site's dark theme. Swaps src to match the site's current
// theme using the same data-theme -> prefers-color-scheme detection order as
// public/site.js, and reacts to both the manual toggle (data-theme mutation) and
// OS-level scheme changes the same way the rest of the site does.
export default function ThemedScreenshot({
  srcLight,
  srcDark,
  alt,
  className,
  style,
  loading,
}: {
  srcLight: string
  srcDark: string
  alt: string
  className?: string
  style?: React.CSSProperties
  loading?: 'lazy' | 'eager'
}) {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    setDark(readIsDark())
    const mq = window.matchMedia('(prefers-color-scheme:dark)')
    const update = () => setDark(readIsDark())
    mq.addEventListener('change', update)
    const observer = new MutationObserver(update)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => {
      mq.removeEventListener('change', update)
      observer.disconnect()
    }
  }, [])

  return <img src={dark ? srcDark : srcLight} alt={alt} className={className} style={style} loading={loading} />
}
