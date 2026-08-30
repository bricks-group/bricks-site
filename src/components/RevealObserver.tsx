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
 *  - a scroll-driven fallback (not just a one-shot timeout) keeps re-checking
 *    any still-hidden element on every scroll for the life of the page, so a
 *    missed/late IntersectionObserver callback (fast flings, programmatic
 *    scrollIntoView, some automation-driven scrolls) can never leave content
 *    permanently stuck at opacity:0 — it self-corrects on the next scroll.
 */
export default function RevealObserver() {
  useEffect(() => {
    const docEl = document.documentElement
    docEl.classList.add('reveal-ready')

    const targets = Array.from(document.querySelectorAll<HTMLElement>('.rvl, .foot-word'))
    if (!targets.length) return

    const reduced =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const reveal = (el: HTMLElement) => el.classList.add('in')

    if (reduced || !('IntersectionObserver' in window)) {
      targets.forEach(reveal)
      return
    }

    const revealIfInView = (el: HTMLElement) => {
      const r = el.getBoundingClientRect()
      // Already anywhere in (or just above) the viewport → reveal now.
      if (r.top < window.innerHeight * 0.85 && r.bottom > 0) reveal(el)
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

    // Scroll fallback: re-check remaining hidden elements on every scroll,
    // independent of the IntersectionObserver. Self-removes once nothing is
    // left to reveal.
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        ticking = false
        const hidden = document.querySelectorAll<HTMLElement>('.rvl:not(.in), .foot-word:not(.in)')
        if (!hidden.length) {
          window.removeEventListener('scroll', onScroll)
          return
        }
        hidden.forEach(revealIfInView)
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    // Failsafe: catch anything already in view that the checks above missed
    // right after load (e.g. layout not settled yet on first paint).
    const failsafe = window.setTimeout(() => {
      document
        .querySelectorAll<HTMLElement>('.rvl:not(.in), .foot-word:not(.in)')
        .forEach(revealIfInView)
    }, 1500)

    return () => {
      obs.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.clearTimeout(failsafe)
    }
  }, [])

  return null
}
