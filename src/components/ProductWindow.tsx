'use client'

import { useEffect, useRef, useState, type Ref } from 'react'

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
  lazy = false,
  fit = 'width',
  zoomAt,
}: {
  src: string
  nw: number
  nh: number
  title: string
  frameRef: Ref<HTMLIFrameElement>
  onReady: (el: HTMLIFrameElement) => void
  lazy?: boolean
  fit?: 'width' | 'contain'
  /** Cursor-style readable crop: scale as if the design width is zoomAt (smaller = larger text). */
  zoomAt?: number
}) {
  const box = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0)

  useEffect(() => {
    const el = box.current
    if (!el) return
    const apply = () => {
      const w = el.clientWidth
      const h = el.clientHeight
      const designW = zoomAt && zoomAt > 0 ? zoomAt : nw
      if (fit === 'contain') {
        const sx = w > 0 ? w / designW : 0
        const sy = h > 0 ? h / nh : 0
        // When zooming, prefer width-based readable scale and crop height
        if (zoomAt && zoomAt > 0) {
          setScale(sx > 0 ? sx : 0)
        } else {
          setScale(sx > 0 && sy > 0 ? Math.min(sx, sy) : 0)
        }
      } else {
        setScale(w > 0 ? w / designW : 0)
      }
    }
    apply()
    const ro = new ResizeObserver(apply)
    ro.observe(el)
    return () => ro.disconnect()
  }, [nw, nh, fit, zoomAt])

  const iframe = (
    <iframe
      ref={frameRef}
      src={src}
      title={title}
      width={nw}
      height={nh}
      loading={lazy ? 'lazy' : 'eager'}
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
  )

  if (fit === 'contain' && !zoomAt) {
    return (
      <div
        ref={box}
        className="pwin-scale"
        style={{
          width: '100%',
          height: '100%',
          minHeight: 0,
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: scale ? nw * scale : undefined,
            height: scale ? nh * scale : undefined,
            position: 'relative',
            overflow: 'hidden',
            flex: 'none',
          }}
        >
          {iframe}
        </div>
      </div>
    )
  }

  return (
    <div
      ref={box}
      className="pwin-scale"
      style={{
        width: '100%',
        height: '100%',
        minHeight: 0,
        flex: 1,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {iframe}
    </div>
  )
}

export default function ProductWindow({
  title,
  src,
  nw,
  nh,
  variant = 'os',
  lazy = false,
  fit = 'width',
  onChromeActivate,
  chromeMode = 'titled',
  zoomAt,
  hideChrome = false,
}: {
  title: string
  src: string
  nw: number
  nh: number
  variant?: 'os' | 'phone'
  lazy?: boolean
  fit?: 'width' | 'contain'
  onChromeActivate?: () => void
  chromeMode?: 'titled' | 'lights'
  zoomAt?: number
  hideChrome?: boolean
}) {
  const frameRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    const ping = () => {
      frameRef.current?.contentWindow?.postMessage({ bricks_theme: readTheme() }, '*')
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
  }, [src])

  function onReady(el: HTMLIFrameElement) {
    el.contentWindow?.postMessage({ bricks_theme: readTheme() }, '*')
  }

  return (
    <div className={`pwin${variant === 'phone' ? ' pwin-phone' : ''}${hideChrome ? ' pwin-bare' : ''}`}>
      {/* No traffic lights — screenshots are bare or title-only (Kam). Raise via parent handlers. */}
      {!hideChrome && chromeMode === 'titled' ? (
        <div
          className={`pwin-bar${onChromeActivate ? ' pwin-bar-raise' : ''}`}
          onMouseDown={onChromeActivate}
          onTouchStart={onChromeActivate}
          role={onChromeActivate ? 'button' : undefined}
          tabIndex={onChromeActivate ? 0 : undefined}
          onKeyDown={
            onChromeActivate
              ? (e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    onChromeActivate()
                  }
                }
              : undefined
          }
          aria-label={onChromeActivate ? `Bring ${title} to front` : undefined}
        >
          <span>{title}</span>
        </div>
      ) : null}
      <ScaledIframe
        src={src}
        nw={nw}
        nh={nh}
        title={title}
        frameRef={frameRef}
        onReady={onReady}
        lazy={lazy}
        fit={fit}
        zoomAt={zoomAt}
      />
    </div>
  )
}
