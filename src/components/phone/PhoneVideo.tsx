'use client'

import { useEffect, useRef } from 'react'
import StatusBar from './StatusBar'
import './phone-video.css'

/**
 * A real screen recording inside PhoneFrame. Muted, looping, inline.
 * - Nothing downloads until the phone is near the viewport (preload="none", sources set lazily).
 * - Plays only while in view; pauses offscreen.
 * - prefers-reduced-motion, no-JS and full-page captures show the poster frame (a real screen too).
 */
export default function PhoneVideo({ name, tone = 'light', bar }: { name: string; tone?: 'light' | 'dark'; bar: string }) {
  const ref = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    const v = ref.current
    if (!v) return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    if (typeof IntersectionObserver === 'undefined') return
    let loaded = false
    const load = () => {
      if (loaded) return
      loaded = true
      v.querySelectorAll<HTMLSourceElement>('source[data-src]').forEach((s) => { s.src = s.dataset.src || '' })
      v.load()
    }
    const near = new IntersectionObserver(([e]) => { if (e.isIntersecting) { load(); near.disconnect() } }, { rootMargin: '400px 0px' })
    const vis = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { load(); v.play().catch(() => {}) } else v.pause()
    }, { threshold: 0.25 })
    near.observe(v); vis.observe(v)
    return () => { near.disconnect(); vis.disconnect() }
  }, [])
  const base = `/media/phones/${name}`
  return (
    <div className={`pfv pfv-${tone}`} style={{ ['--pfv-bar' as string]: bar }}>
      <div className="pfv-bar"><StatusBar /></div>
      <video ref={ref} className="pfv-video" muted loop playsInline preload="none" poster={`${base}-poster.jpg`} aria-hidden="true" tabIndex={-1} disablePictureInPicture>
        <source data-src={`${base}.mp4`} type="video/mp4" />
        <source data-src={`${base}.webm`} type="video/webm" />
      </video>
    </div>
  )
}
