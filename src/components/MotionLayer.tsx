'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Site-wide motion pass (one listener, no libraries).
 *
 *  1. Fade-up for page sections not already marked `.rvl` (same reveal as the homepage).
 *  2. Stagger: children of known grids / lists rise one after another as the grid enters.
 *  3. Scroll-linked "story" bits — values written to CSS vars, CSS does the drawing:
 *       rise  — product trays (desk, prod rows, film, Virtual Visit) settle up + in
 *       pkgs  — "Priced by footprint" cards rise in sequence with scroll
 *       par   — Real shoots photos ease from 1.08 → 1 scale through the pass
 *       ba    — before/after handles sweep from "before" to the 50% split
 *     Only elements that start below the fold are scroll-linked, so nothing jumps
 *     after hydration. Transform/opacity only: no layout shift.
 *  Easing everywhere: --ease-out cubic-bezier(.16,1,.3,1) (same as the steps rail).
 *  prefers-reduced-motion: everything shown immediately, nothing scroll-linked.
 */

const STAGGER = [
  '.trust-tiles', '.trust-stats', '.work-row', '.edit-grid', '.incl', '.adds', '.faq',
  '.grid3', '.areas', '.work-grid', '.ba-grid', '.cx-grid', '.cx-list', '.contact-grid',
  '.integ-grid', '.integ-soon-list', '.tbl tbody', '.next-grid',
].join(',')

const RISE = [
  '.cap-stage.tray-crm', '.prod-row .tray', '.film', '.visit-stage',
].join(',')

const SECTIONS = [
  'body > section:not(.hero):not(.prod-hero):not(.slab):not(.rvl)',
  'body > .wrap > section:not(.rvl)',
].join(',')

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const easeOut = (x: number) => 1 - Math.pow(1 - x, 3)

export default function MotionLayer() {
  const pathname = usePathname()

  useEffect(() => {
    const doc = document.documentElement
    const reduced = !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const vh = () => window.innerHeight
    const inView = (el: Element) => {
      const r = el.getBoundingClientRect()
      return r.top < vh() * 0.88 && r.bottom > 0
    }
    const below = (el: Element) => el.getBoundingClientRect().top > vh()
    const skip = (el: Element) => !!el.closest('header, footer, .slab, [data-motion="off"]')

    // ── 1 + 2: reveal on enter ────────────────────────────────────────────────
    const sections = Array.from(document.querySelectorAll<HTMLElement>(SECTIONS)).filter((el) => !skip(el))
    const groups = Array.from(document.querySelectorAll<HTMLElement>(STAGGER)).filter(
      (el) => !skip(el) && !el.classList.contains('stg') && el.children.length > 1
    )

    if (reduced || !('IntersectionObserver' in window)) {
      sections.forEach((el) => el.classList.add('rvl', 'in'))
      doc.classList.add('reveal-ready')
      return
    }

    const timers: number[] = []
    const settle = (g: HTMLElement) => {
      // drop the stagger classes once played so original hover/transform styles own the element again
      timers.push(window.setTimeout(() => g.classList.remove('stg', 'in'), 1600))
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return
          const el = en.target as HTMLElement
          el.classList.add('in')
          if (el.classList.contains('stg')) settle(el)
          io.unobserve(el)
        })
      },
      { threshold: 0, rootMargin: '0px 0px -8% 0px' }
    )

    sections.forEach((el) => {
      if (inView(el)) el.classList.add('rvl', 'in')
      else {
        el.classList.add('rvl')
        io.observe(el)
      }
    })
    // existing .rvl markup (pages with or without their own RevealObserver)
    const watchRvl = (root: ParentNode) => {
      root.querySelectorAll<HTMLElement>('.rvl:not(.in)').forEach((el) => {
        if (skip(el)) return el.classList.add('in')
        if (inView(el)) el.classList.add('in')
        else io.observe(el)
      })
    }
    watchRvl(document)
    // late-rendered .rvl (e.g. /book wizard steps)
    const mo = new MutationObserver((muts) => {
      for (const m of muts) m.addedNodes.forEach((n) => {
        if (!(n instanceof HTMLElement)) return
        if (n.matches('.rvl:not(.in)')) (inView(n) ? n.classList.add('in') : io.observe(n))
        watchRvl(n)
      })
    })
    mo.observe(document.body, { childList: true, subtree: true })
    const failsafe = window.setTimeout(() => watchRvl(document), 1500)
    timers.push(failsafe)

    groups.forEach((g) => {
      Array.from(g.children).forEach((c, i) => {
        const ch = c as HTMLElement
        if (ch.classList.contains('rvl')) ch.style.setProperty('--rd', `${Math.min(i, 8) * 70}ms`)
        else ch.style.setProperty('--si', String(Math.min(i, 8)))
      })
      if (inView(g)) return // already on screen: leave as-is, no flash
      g.classList.add('stg')
      io.observe(g)
    })
    doc.classList.add('reveal-ready')

    // ── 3: scroll-linked story bits ──────────────────────────────────────────
    type Item = { el: HTMLElement; kind: 'rise' | 'pkgs' | 'par' | 'ba'; touched?: boolean }
    const items: Item[] = []
    const add = (el: HTMLElement, kind: Item['kind']) => {
      if (skip(el) || !below(el)) return
      el.setAttribute('data-msp', kind)
      items.push({ el, kind })
    }
    document.querySelectorAll<HTMLElement>(RISE).forEach((el) => add(el, 'rise'))
    document.querySelectorAll<HTMLElement>('.pkgs').forEach((el) => {
      Array.from(el.children).forEach((c, i) => (c as HTMLElement).style.setProperty('--i', String(i)))
      add(el, 'pkgs')
    })
    document.querySelectorAll<HTMLElement>('.work-row').forEach((el) => add(el, 'par'))
    document.querySelectorAll<HTMLElement>('.ba').forEach((el) => {
      add(el, 'ba')
      const it = items.find((x) => x.el === el)
      if (it) el.addEventListener('pointerdown', () => (it.touched = true), { once: true })
      if (it) el.addEventListener('keydown', () => (it.touched = true), { once: true })
    })

    let raf = 0
    const update = () => {
      raf = 0
      const h = vh()
      for (const it of items) {
        const r = it.el.getBoundingClientRect()
        if (r.bottom < -h * 0.2 || r.top > h * 1.2) continue
        const sp = clamp((h - r.top) / (h * 0.7))
        if (it.kind === 'par') {
          it.el.style.setProperty('--sc', clamp((h - r.top) / (h + r.height)).toFixed(4))
        } else if (it.kind === 'ba') {
          if (it.touched) continue
          const before = it.el.querySelector<HTMLElement>('.ba-before')
          const handle = it.el.querySelector<HTMLElement>('.ba-handle')
          if (!before || !handle) continue
          const p = 92 - 42 * easeOut(sp)
          before.style.clipPath = `inset(0 ${(100 - p).toFixed(2)}% 0 0)`
          handle.style.left = `${p.toFixed(2)}%`
        } else {
          it.el.style.setProperty('--sp', sp.toFixed(4))
        }
      }
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    if (items.length) {
      update()
      window.addEventListener('scroll', onScroll, { passive: true })
      window.addEventListener('resize', onScroll)
    }

    return () => {
      io.disconnect()
      mo.disconnect()
      timers.forEach((t) => window.clearTimeout(t))
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [pathname])

  return null
}
