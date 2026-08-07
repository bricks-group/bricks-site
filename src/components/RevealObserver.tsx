'use client'

import { useEffect } from 'react'

/**
 * Ports the .rvl reveal-on-scroll behavior from the static site's inline script.
 * Mount once per page; observes every .rvl element already in the DOM.
 *
 * Hardened so content is NEVER permanently invisible:
 *  - marks <html>.reveal-ready so the "hidden" state is JS-gated (no-JS = visible)
 *  - reveals anything already in/near the viewport on mount
 *  - IntersectionObserver reveals the rest as they scroll in
 *  - a failsafe timeout reveals everything still hidden, so a missed IO callback
 *    degrades to "no animation" instead of "blank section"
 */
export default function RevealObserver() {
  useEffect(() => {
    const docEl = document.documentElement
    docEl.classList.add('reveal-ready')

    const reduced =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const revealAll = () => {
      document.querySelectorAll<HTMLElement>('.rvl').forEach((el) => el.classList.add('in'))
    }

    if (reduced || !('IntersectionObserver' in window)) {
      revealAll()
      return
    }

    const targets = Array.from(document.querySelectorAll<HTMLElement>('.rvl'))

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return
          en.target.classList.add('in')
          obs.unobserve(en.target)
        })
      },
      { threshold: 0, rootMargin: '0px 0px -8% 0px' }
    )

    targets.forEach((el) => {
      const r = el.getBoundingClientRect()
      // Reveal immediately if already anywhere in (or just above) the viewport.
      if (r.top < window.innerHeight * 0.92 && r.bottom > 0) {
        el.classList.add('in')
      } else {
        obs.observe(el)
      }
    })

    // Failsafe: if any .rvl is still hidden after 1200ms, reveal it.
    // Guarantees content is never stuck at opacity:0 due to a missed callback.
    const failsafe = window.setTimeout(() => {
      document.querySelectorAll<HTMLElement>('.rvl:not(.in)').forEach((el) => el.classList.add('in'))
    }, 1200)

    return () => {
      obs.disconnect()
      window.clearTimeout(failsafe)
    }
  }, [])

  return null
}
