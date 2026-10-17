'use client'

import { useEffect, useRef, useState } from 'react'

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))
/** Smoothstep — gives each step a dwell plateau so motion settles instead of drifting. */
const settle = (f: number) => {
  const x = clamp((f - 0.22) / 0.56)
  return x * x * (3 - 2 * x)
}

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Keeps --hdr on <html> equal to the sticky site header so pinned stages sit under it. */
export function useHeaderVar() {
  useEffect(() => {
    const set = () => {
      const h = document.querySelector('header') as HTMLElement | null
      document.documentElement.style.setProperty('--hdr', `${h?.offsetHeight || 0}px`)
    }
    set()
    window.addEventListener('resize', set)
    return () => window.removeEventListener('resize', set)
  }, [])
}

/**
 * Scroll-driven step state for a pinned section (tall outer, sticky inner).
 *   --p  raw progress 0→1 through the pinned distance
 *   --pd "dwell" progress: same range, but eased between stops so each step rests
 * `active` = nearest step stop. No click/swipe needed — scrolling is the input.
 */
export function useStepScroll<T extends HTMLElement>(n: number) {
  const ref = useRef<T>(null)
  const [active, setActive] = useState(0)
  useHeaderVar()

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (prefersReducedMotion()) {
      el.style.setProperty('--p', '1')
      el.style.setProperty('--pd', '1')
      return
    }
    let raf = 0
    let last = -1
    const update = () => {
      raf = 0
      const r = el.getBoundingClientRect()
      const hdr = (document.querySelector('header') as HTMLElement | null)?.offsetHeight || 0
      const total = r.height - (window.innerHeight - hdr)
      const p = total > 0 ? clamp((hdr - r.top) / total) : 0
      const x = p * (n - 1)
      const i = Math.min(n - 2, Math.floor(x))
      const pd = n > 1 ? (i + settle(x - i)) / (n - 1) : 1
      el.style.setProperty('--p', p.toFixed(4))
      el.style.setProperty('--pd', pd.toFixed(4))
      const a = Math.round(pd * (n - 1))
      if (a !== last) {
        last = a
        setActive(a)
      }
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [n])

  return { ref, active }
}

/**
 * Stacked sticky cards: sets --k (0→1) on each card as the NEXT card slides over
 * it, and returns the index of the card currently on top.
 */
export function useCardStack<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [active, setActive] = useState(0)
  useHeaderVar()

  useEffect(() => {
    const root = ref.current
    if (!root) return
    const cards = Array.from(root.querySelectorAll<HTMLElement>('[data-card]'))
    if (prefersReducedMotion()) {
      cards.forEach((c) => c.style.setProperty('--k', '0'))
      return
    }
    let raf = 0
    let last = -1
    const update = () => {
      raf = 0
      let a = 0
      cards.forEach((c, i) => {
        const next = cards[i + 1]
        const cr = c.getBoundingClientRect()
        if (next) {
          const nr = next.getBoundingClientRect()
          const k = clamp(1 - (nr.top - cr.top) / Math.max(1, cr.height))
          c.style.setProperty('--k', k.toFixed(4))
          if (k > 0.18) a = i + 1
        } else {
          c.style.setProperty('--k', '0')
        }
      })
      if (a !== last) {
        last = a
        setActive(a)
      }
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return { ref, active }
}
