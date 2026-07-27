'use client'

import { useEffect } from 'react'

/**
 * Ports the .rvl reveal-on-scroll behavior from the static site's inline script.
 * Mount once per page; observes every .rvl element already in the DOM.
 */
export default function RevealObserver() {
  useEffect(() => {
    const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const targets = Array.from(document.querySelectorAll<HTMLElement>('.rvl'))
    if (reduced || !('IntersectionObserver' in window) || !targets.length) {
      targets.forEach((el) => el.classList.add('in'))
      return
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return
          en.target.classList.add('in')
          obs.unobserve(en.target)
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    )
    targets.forEach((el) => {
      const r = el.getBoundingClientRect()
      if (r.top < window.innerHeight * 0.9) el.classList.add('in')
      else obs.observe(el)
    })
    return () => obs.disconnect()
  }, [])

  return null
}
