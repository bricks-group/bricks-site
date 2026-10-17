'use client'

import { useEffect } from 'react'

/**
 * Ports the .rvl reveal-on-scroll behavior from the static site's inline script.
 * Mount once per page; observes every .rvl element already in the DOM.
 *
 * Intended behavior: sections start hidden (opacity:0, gated by html.reveal-ready
 * so no-JS = visible) and fade/slide in AS they scroll into view. Only elements
 * already within the viewport on load are revealed immediately — below-the-fold
 * sections stay hidden until the user scrolls to them (that IS the animation).
 *
 * Hardened so content is never permanently invisible if the observer fails:
 *  - reduced-motion or no IntersectionObserver ⇒ reveal everything.
 *  - a failsafe reveals anything still hidden once it is actually in/near the
 *    viewport (not a blanket reveal of all off-screen content, which would kill
 *    the scroll effect).
 */
export default function RevealObserver() {
  useEffect(() => {
    const docEl = document.documentElement
    docEl.classList.add('reveal-ready')

    // Long-form containers (blog bodies, legal copy) never take part in reveal.
    const targets = Array.from(
      document.querySelectorAll<HTMLElement>('.rvl:not(.prose):not(article)')
    )
    // reveal-ready lives on <html> and survives client-side navigation, so it
    // must be removed on unmount or the next page's .rvl content stays hidden.
    const cleanup = () => docEl.classList.remove('reveal-ready')
    if (!targets.length) return cleanup

    const reduced =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const reveal = (el: HTMLElement) => el.classList.add('in')

    if (reduced || !('IntersectionObserver' in window)) {
      targets.forEach(reveal)
      return cleanup
    }

    const revealIfInView = (el: HTMLElement) => {
      const r = el.getBoundingClientRect()
      // Never hide content taller than the viewport; otherwise reveal anything
      // already in (or just above) the viewport.
      if (r.height > window.innerHeight * 0.9) reveal(el)
      else if (r.top < window.innerHeight * 0.85 && r.bottom > 0) reveal(el)
    }

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return
          reveal(en.target as HTMLElement)
          obs.unobserve(en.target)
        })
      },
      { threshold: 0, rootMargin: '0px 0px -8% 0px' }
    )

    targets.forEach((el) => {
      revealIfInView(el) // immediate reveal for above-the-fold content only
      if (!el.classList.contains('in')) obs.observe(el)
    })

    // Failsafe: in-view stragglers at 1.5s; everything at 4s, so a missed or
    // broken IO callback (seen in WebKit) can never leave content invisible.
    const nudge = window.setTimeout(() => {
      document.querySelectorAll<HTMLElement>('.rvl:not(.in)').forEach(revealIfInView)
    }, 1500)
    const failsafe = window.setTimeout(() => {
      document.querySelectorAll<HTMLElement>('.rvl:not(.in)').forEach(reveal)
      obs.disconnect()
    }, 4000)

    return () => {
      obs.disconnect()
      window.clearTimeout(nudge)
      window.clearTimeout(failsafe)
      cleanup()
    }
  }, [])

  return null
}
