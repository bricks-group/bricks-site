'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import VirtualVisitEmbed from '@/components/VirtualVisitEmbed'
import './media-showcase.css'

/** Homepage listing media — one stage, one switch (Photos / Before-after / Film / 3D). Kam 2026-10-17. */
const TABS = [
  { id: 'photos', label: 'Photos', cap: 'HDR photos, balanced on every shoot.' },
  { id: 'ba', label: 'Before/after', cap: 'Drag to compare.' },
  { id: 'film', label: 'Film', cap: 'A cinematic reel for the listing.' },
  { id: '3d', label: '3D', cap: 'Virtual Visit: free-roam 3D of the home.' },
] as const
type Tab = (typeof TABS)[number]['id']

const FILM_SRC = 'https://rbywjnnctjglhcdemnnj.supabase.co/storage/v1/object/public/Bricks%20Images/Video/bid.mp4'

export default function MediaShowcase() {
  const [tab, setTab] = useState<Tab>('photos')
  const [seen, setSeen] = useState<Record<string, boolean>>({ photos: true })
  const pick = (id: Tab) => {
    setTab(id)
    setSeen((s) => (s[id] ? s : { ...s, [id]: true }))
  }
  useEffect(() => {
    const sync = () => { if (window.location.hash === '#visit') pick('3d') }
    sync()
    window.addEventListener('hashchange', sync)
    return () => window.removeEventListener('hashchange', sync)
  }, [])
  const [pos, setPos] = useState(50)
  const baRef = useRef<HTMLDivElement>(null)
  const drag = useRef(false)
  const fromX = (x: number) => {
    const r = baRef.current?.getBoundingClientRect()
    if (r && r.width) setPos(Math.max(0, Math.min(100, ((x - r.left) / r.width) * 100)))
  }
  const cap = TABS.find((t) => t.id === tab)?.cap

  return (
    <section className="ms-sec rvl" id="media" aria-label="Listing media">
      <span id="visit" className="ms-anchor" aria-hidden="true" />
      <div className="wrap">
        <div className="ms-head">
          <div>
            <h2>Listing media.</h2>
            <p className="sub">HDR photos, licensed drone, film and 3D. Booked online.</p>
          </div>
          <div className="ms-tabs" role="tablist" aria-label="Media type">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                id={`ms-tab-${t.id}`}
                aria-selected={tab === t.id}
                aria-controls={`ms-panel-${t.id}`}
                className={tab === t.id ? 'ms-tab is-on' : 'ms-tab'}
                onClick={() => pick(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="ms-stage">
          <div className={tab === 'photos' ? 'ms-panel is-on' : 'ms-panel'} id="ms-panel-photos" role="tabpanel" aria-labelledby="ms-tab-photos" hidden={tab !== 'photos'}>
            <Image src="/media/work/01.jpg" alt="Detached home exterior" fill sizes="(max-width:900px) 100vw, 1100px" />
          </div>

          <div className={tab === 'ba' ? 'ms-panel is-on' : 'ms-panel'} id="ms-panel-ba" role="tabpanel" aria-labelledby="ms-tab-ba" hidden={tab !== 'ba'}>
            <div
              ref={baRef}
              className="ms-ba"
              role="slider"
              aria-label="HDR before and after"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(pos)}
              tabIndex={0}
              onPointerDown={(e) => { drag.current = true; e.currentTarget.setPointerCapture(e.pointerId); fromX(e.clientX) }}
              onPointerMove={(e) => { if (drag.current) fromX(e.clientX) }}
              onPointerUp={() => { drag.current = false }}
              onPointerCancel={() => { drag.current = false }}
              onKeyDown={(e) => {
                const st = e.shiftKey ? 10 : 3
                if (e.key === 'ArrowLeft') { setPos((p) => Math.max(0, p - st)); e.preventDefault() }
                if (e.key === 'ArrowRight') { setPos((p) => Math.min(100, p + st)); e.preventDefault() }
              }}
            >
              {seen.ba ? (
                <>
                  <Image className="ms-ba-img" src="/media/proof/HDR After.png" alt="HDR — after" fill loading="eager" sizes="(max-width:900px) 100vw, 1100px" />
                  <Image className="ms-ba-img" src="/media/proof/HDR Before.png" alt="HDR — before" fill loading="eager" sizes="(max-width:900px) 100vw, 1100px" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }} />
                </>
              ) : null}
              <span className="ms-lbl l">Before</span>
              <span className="ms-lbl r">After</span>
              <div className="ms-handle" style={{ left: `${pos}%` }} aria-hidden="true"><span className="ms-knob">↔</span></div>
            </div>
          </div>

          <div className={tab === 'film' ? 'ms-panel is-on' : 'ms-panel'} id="ms-panel-film" role="tabpanel" aria-labelledby="ms-tab-film" hidden={tab !== 'film'}>
            {seen.film ? (
              <video className="ms-video" autoPlay muted loop playsInline preload="metadata" poster="/media/reel-poster.jpg">
                <source src={FILM_SRC} type="video/mp4" />
              </video>
            ) : null}
          </div>

          <div className={tab === '3d' ? 'ms-panel is-on' : 'ms-panel'} id="ms-panel-3d" role="tabpanel" aria-labelledby="ms-tab-3d" hidden={tab !== '3d'}>
            {seen['3d'] ? <VirtualVisitEmbed /> : null}
          </div>
        </div>

        <div className="ms-foot">
          <p className="ms-cap" aria-live="polite">{cap}</p>
          <Link className="learn-link" href="/gallery">See more work →</Link>
        </div>
      </div>
    </section>
  )
}
