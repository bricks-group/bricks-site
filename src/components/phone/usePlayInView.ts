'use client'

import { useEffect, useRef } from 'react'

/** Drives data-play on the animated phone screen from an IntersectionObserver. */
export function usePlayInView<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      el?.setAttribute('data-play', '1')
      return
    }
    // "0" = never seen: CSS shows the static final state (also SSR, no-JS, full-page captures).
    // "1" = in view: loop plays. "p" = left the viewport after playing: paused in place.
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) el.setAttribute('data-play', '1')
      else if (el.getAttribute('data-play') === '1') el.setAttribute('data-play', 'p')
    }, { threshold: 0.15 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return ref
}
