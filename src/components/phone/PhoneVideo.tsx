'use client'

import { useEffect, useRef, useState } from 'react'
import StatusBar from './StatusBar'
import './phone-video.css'

type Theme = 'light' | 'dark'
const siteTheme = (): Theme => (typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light')

/**
 * A real screen recording inside PhoneFrame. Muted, looping, inline.
 * - Nothing downloads until the phone is near the viewport (preload="none", sources set lazily).
 * - Plays only while in view; pauses offscreen.
 * - prefers-reduced-motion, no-JS and full-page captures show the poster frame (a real screen too).
 * - With darkBar set, a dark recording (name-dark.*, name-dark-poster.jpg) follows the site theme,
 *   including live switches from the theme toggle.
 */
export default function PhoneVideo({ name, tone = 'light', bar, darkBar }: { name: string; tone?: Theme; bar: string; darkBar?: string }) {
  const ref = useRef<HTMLVideoElement>(null)
  const [theme, setTheme] = useState<Theme>('light')
  const themed = Boolean(darkBar)
  const active: Theme = themed ? theme : 'light'
  const base = `/media/phones/${active === 'dark' ? `${name}-dark` : name}`

  useEffect(() => {
    if (!themed) return
    setTheme(siteTheme())
    const mo = new MutationObserver(() => setTheme(siteTheme()))
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => mo.disconnect()
  }, [themed])

  useEffect(() => {
    const v = ref.current
    if (!v) return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    if (typeof IntersectionObserver === 'undefined') return
    let loaded = false
    let inView = false
    const load = () => {
      if (loaded) return
      loaded = true
      v.querySelectorAll<HTMLSourceElement>('source[data-src]').forEach((s) => { s.src = s.dataset.src || '' })
      v.load()
      if (inView) v.play().catch(() => {})
    }
    const near = new IntersectionObserver(([e]) => { if (e.isIntersecting) { load(); near.disconnect() } }, { rootMargin: '400px 0px' })
    const vis = new IntersectionObserver(([e]) => {
      inView = e.isIntersecting
      if (e.isIntersecting) { load(); v.play().catch(() => {}) } else v.pause()
    }, { threshold: 0.25 })
    near.observe(v); vis.observe(v)
    return () => { near.disconnect(); vis.disconnect() }
  }, [base])

  const t: Theme = themed ? active : tone
  return (
    <div className={`pfv pfv-${t}`} style={{ ['--pfv-bar' as string]: active === 'dark' && darkBar ? darkBar : bar }}>
      <div className="pfv-bar"><StatusBar /></div>
      <video key={base} ref={ref} className="pfv-video" muted loop playsInline preload="none" poster={`${base}-poster.jpg`} aria-hidden="true" tabIndex={-1} disablePictureInPicture>
        <source data-src={`${base}.mp4`} type="video/mp4" />
        <source data-src={`${base}.webm`} type="video/webm" />
      </video>
    </div>
  )
}
