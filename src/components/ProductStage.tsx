'use client'

import { useEffect, useRef, useState, type Ref } from 'react'
import Link from 'next/link'

function readTheme(): 'dark' | 'light' {
  if (typeof document === 'undefined') return 'light'
  const t = document.documentElement.getAttribute('data-theme')
  if (t === 'dark' || t === 'light') return t
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function ScaledIframe({
  src,
  nw,
  nh,
  title,
  frameRef,
  onReady,
}: {
  src: string
  nw: number
  nh: number
  title: string
  frameRef: Ref<HTMLIFrameElement>
  onReady: (el: HTMLIFrameElement) => void
}) {
  const box = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0)

  useEffect(() => {
    const el = box.current
    if (!el) return
    const apply = () => {
      const w = el.clientWidth
      setScale(w > 0 ? w / nw : 0)
    }
    apply()
    const ro = new ResizeObserver(apply)
    ro.observe(el)
    return () => ro.disconnect()
  }, [nw])

  return (
    <div
      ref={box}
      className="stage-scale"
      style={{
        height: scale ? nh * scale : undefined,
        aspectRatio: `${nw} / ${nh}`,
      }}
    >
      <iframe
        ref={frameRef}
        src={src}
        title={title}
        width={nw}
        height={nh}
        loading="eager"
        onLoad={(e) => onReady(e.currentTarget)}
        style={{
          width: nw,
          height: nh,
          border: 0,
          display: 'block',
          transform: `scale(${scale || 0.0001})`,
          transformOrigin: 'top left',
          pointerEvents: 'auto',
        }}
      />
    </div>
  )
}

export default function ProductStage() {
  const osRef = useRef<HTMLIFrameElement>(null)
  const bookRef = useRef<HTMLIFrameElement>(null)
  const dispRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    const ping = () => {
      const theme = readTheme()
      for (const f of [osRef.current, bookRef.current, dispRef.current]) {
        f?.contentWindow?.postMessage({ bricks_theme: theme }, '*')
      }
    }
    ping()
    const obs = new MutationObserver(ping)
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    mq.addEventListener('change', ping)
    return () => {
      obs.disconnect()
      mq.removeEventListener('change', ping)
    }
  }, [])

  function onReady(el: HTMLIFrameElement) {
    el.contentWindow?.postMessage({ bricks_theme: readTheme() }, '*')
  }

  return (
    <div className="stage">
      <div className="stage-os">
        <div className="stage-titlebar">
          <div className="stage-dots" aria-hidden="true"><i /><i /><i /></div>
          <span>Brokerage OS</span>
        </div>
        <ScaledIframe
          src="/screens/os.html"
          nw={1440}
          nh={920}
          title="Bricks Brokerage OS"
          frameRef={osRef}
          onReady={onReady}
        />
      </div>
      <div className="stage-phones">
        <div className="stage-phone">
          <div className="stage-phone-bar">Booking</div>
          <ScaledIframe
            src="/screens/book.html"
            nw={390}
            nh={844}
            title="Bricks Booking app"
            frameRef={bookRef}
            onReady={onReady}
          />
        </div>
        <div className="stage-phone">
          <div className="stage-phone-bar">Dispatch</div>
          <ScaledIframe
            src="/screens/disp.html"
            nw={390}
            nh={844}
            title="Bricks Dispatch app"
            frameRef={dispRef}
            onReady={onReady}
          />
        </div>
      </div>
      <p className="stage-note">
        OS is the product. Booking and Dispatch sit with it. Media is live; apps in development.{' '}
        <Link href="/book">Book a shoot →</Link>
      </p>
    </div>
  )
}
