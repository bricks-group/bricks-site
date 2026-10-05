/* Shared drop-in. Copy to:
 *   bricks-site: src/components/MapCutout.tsx
 *   Bricks-OS:        frontend/src/components/MapCutout.jsx  (strip types)
 *
 * Standard 3D GL cutout: HD lanes + 3D objects, and one rain or snow pass.
 * Streets-v12 static <img> stays as the error fallback.
 * Does not touch autocomplete, quote, checkout, or listing-file walk state.
 */
'use client'

import { useEffect, useRef } from 'react'
import { CUTOUT_HD_BASEMAP, applyCutoutWeather } from '@/lib/cutout-weather'

const BRICK = '#D2542B'
const HEIGHT = 200 // 160 was too short for 3D buildings; still a cutout
const STYLE = 'mapbox://styles/mapbox/standard'

export type MapCutoutProps = {
  lng: number
  lat: number
  label?: string
  /** If omitted, watches <html data-theme>. OS should pass next-themes resolvedTheme === 'dark'. */
  dark?: boolean
  token: string
  className?: string
}

function readThemeDark(): boolean {
  if (typeof document === 'undefined') return false
  const el = document.documentElement
  return el.getAttribute('data-theme') === 'dark' || el.classList.contains('dark')
}

export default function MapCutout({ lng, lat, label, dark, token, className }: MapCutoutProps) {
  const hostRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const markerRef = useRef<any>(null)
  const fallbackRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (!token || !Number.isFinite(lng) || !Number.isFinite(lat)) return
    const host = hostRef.current
    if (!host) return
    let cancelled = false
    let resizeObs: ResizeObserver | undefined
    let themeObs: MutationObserver | undefined

    ;(async () => {
      const mapboxgl = (await import('mapbox-gl')).default
      await import('mapbox-gl/dist/mapbox-gl.css')
      if (cancelled || !hostRef.current) return

      mapboxgl.accessToken = token
      const night = dark ?? readThemeDark()
      const map = new mapboxgl.Map({
        container: hostRef.current,
        style: STYLE,
        center: [lng, lat],
        zoom: 16.2,
        pitch: 52,
        bearing: -18,
        interactive: false, // cutout, not a playground — keeps the listing-file / book walk locked
        attributionControl: false,
        logoPosition: 'bottom-left',
        fadeDuration: 0,
        antialias: true,
        config: {
          basemap: {
            ...CUTOUT_HD_BASEMAP,
            lightPreset: night ? 'night' : 'day',
          },
        },
      })
      map.addControl(new mapboxgl.AttributionControl({ compact: true }), 'bottom-right')
      mapRef.current = map

      const applyLight = (isDark: boolean) => {
        try {
          map.setConfigProperty('basemap', 'lightPreset', isDark ? 'night' : 'day')
        } catch {
          /* style not ready */
        }
      }

      const applyHd = () => {
        for (const [key, value] of Object.entries(CUTOUT_HD_BASEMAP)) {
          try {
            map.setConfigProperty('basemap', key, value)
          } catch {
            /* import config not ready */
          }
        }
      }

      map.on('style.load', () => {
        applyLight(dark ?? readThemeDark())
        applyHd()
        try {
          applyCutoutWeather(map)
        } catch {
          /* precipitation is optional; the basemap still renders */
        }
      })

      const marker = new mapboxgl.Marker({ color: BRICK, scale: 0.85 })
        .setLngLat([lng, lat])
        .addTo(map)
      markerRef.current = marker

      resizeObs = new ResizeObserver(() => {
        try { map.resize() } catch { /* unmounted */ }
      })
      resizeObs.observe(hostRef.current)

      if (dark === undefined) {
        themeObs = new MutationObserver(() => applyLight(readThemeDark()))
        themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'class'] })
      }

      map.on('error', () => {
        if (fallbackRef.current) fallbackRef.current.hidden = false
      })
    })()

    return () => {
      cancelled = true
      resizeObs?.disconnect()
      themeObs?.disconnect()
      try { markerRef.current?.remove() } catch { /* */ }
      try { mapRef.current?.remove() } catch { /* */ }
      markerRef.current = null
      mapRef.current = null
    }
  }, [lng, lat, token])

  useEffect(() => {
    const map = mapRef.current
    if (!map || dark === undefined) return
    try { map.setConfigProperty('basemap', 'lightPreset', dark ? 'night' : 'day') } catch { /* */ }
  }, [dark])

  const staticFallback =
    `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/pin-s+D2542B(${lng},${lat})/${lng},${lat},16,0/640x160@2x?access_token=${encodeURIComponent(token)}`

  return (
    <div
      className={className ? `map-cutout map-cutout-gl ${className}` : 'map-cutout map-cutout-gl'}
      style={{
        position: 'relative',
        width: '100%',
        height: HEIGHT,
        marginTop: 8,
        borderRadius: 2,
        border: '1px solid var(--hair, rgba(20,17,14,.08))',
        overflow: 'hidden',
        filter: 'none',
      }}
    >
      <div ref={hostRef} aria-hidden="true" style={{ position: 'absolute', inset: 0 }} />
      <img
        ref={fallbackRef}
        hidden
        className="map-cutout-fallback"
        src={staticFallback}
        alt={label ? `Map of ${label}` : ''}
        width={640}
        height={160}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
      />
    </div>
  )
}
