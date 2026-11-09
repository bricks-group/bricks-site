'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import VirtualVisitEmbed from '@/components/VirtualVisitEmbed'
import './media-showcase.css'

/** Homepage listing media — one stage, one switch (Photos / Before-after / Film / 3D). Kam 2026-10-17. */
const TABS = [
  { id: 'photos', label: 'Photos' },
  { id: 'ba', label: 'Before/after' },
  { id: 'film', label: 'Film' },
  { id: '3d', label: '3D' },
] as const
type Tab = (typeof TABS)[number]['id']

const PAIRS = [
  { k: 'HDR', before: '/media/proof/HDR Before.png', after: '/media/proof/HDR After.png' },
  { k: 'Sky, on request', before: '/media/proof/Sky Before.png', after: '/media/proof/Sky After.png' },
  { k: 'Twilight', before: '/media/proof/Twilight before.png', after: '/media/proof/twilight After.png' },
] as const

const FILM_SRC = 'https://rbywjnnctjglhcdemnnj.supabase.co/storage/v1/object/public/Bricks%20Images/Video/bid.mp4'

export default function MediaShowcase() {
  const [tab, setTab] = useState<Tab>('photos')
  const [pair, setPair] = useState(0)
  const [seen, setSeen] = useState<Record<string, boolean>>({ photos: true })
  const pick = (id: Tab) => {
    setTab(id)
    setSeen((s) => (s[id] ? s : { ...s, [id]: true }))
  }
  useEffect(() => {
    const sync = () => {
      const h = window.location.hash
      if (h === '#visit') pick('3d')
      else if (h === '#film') pick('film')
      else if (h === '#before-after') pick('ba')
    }
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

  return (
    <section className="ms-sec ms-page rvl" id="media" aria-label="Listing media">
      <span id="visit" className="ms-anchor" aria-hidden="true" />
      <span id="film" className="ms-anchor" aria-hidden="true" />
      <span id="before-after" className="ms-anchor" aria-hidden="true" />
      <div className="wrap">
        <div className="ms-head">
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
            <Image src="/media/work/01.jpg" alt="Detached home exterior" fill quality={90} sizes="(max-width:900px) 100vw, 1100px" />
          </div>

          <div className={tab === 'ba' ? 'ms-panel is-on' : 'ms-panel'} id="ms-panel-ba" role="tabpanel" aria-labelledby="ms-tab-ba" hidden={tab !== 'ba'}>
            <div
              ref={baRef}
              className="ms-ba"
              role="slider"
              aria-label={`${PAIRS[pair].k} before and after`}
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
                  <Image className="ms-ba-img" src={PAIRS[pair].after} alt={`${PAIRS[pair].k} — after`} fill quality={90} loading="eager" sizes="(max-width:900px) 100vw, 1100px" />
                  <Image className="ms-ba-img" src={PAIRS[pair].before} alt={`${PAIRS[pair].k} — before`} fill quality={90} loading="eager" sizes="(max-width:900px) 100vw, 1100px" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }} />
                </>
              ) : null}
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
          {tab === 'ba' ? (
            <div className="ms-pairs" role="group" aria-label="Edit type">
              {PAIRS.map((p, i) => (
                <button key={p.k} type="button" className={i === pair ? 'ms-pair is-on' : 'ms-pair'} aria-pressed={i === pair} onClick={() => { setPair(i); setPos(50) }}>{p.k}</button>
              ))}
            </div>
          ) : <span />}
          <Link className="learn-link" href="/gallery">See more work →</Link>
        </div>
      </div>
    </section>
  )
}
