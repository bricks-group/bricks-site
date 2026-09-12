'use client'

import { useEffect, useRef, useState } from 'react'

const BRICK = '#D2542B'
const STYLE_LIGHT = 'mapbox://styles/mapbox/light-v11'
const STYLE_DARK = 'mapbox://styles/mapbox/dark-v11'

export type CoverageHub = {
  id: string
  name: string
  region: string
  lng: number
  lat: number
  base?: boolean
  onConfirm?: boolean
}

export const COVERAGE_HUBS: CoverageHub[] = [
  { id: 'mississauga', name: 'Mississauga', region: 'Ontario · base', lng: -79.6441, lat: 43.589, base: true },
  { id: 'toronto', name: 'Toronto', region: 'Ontario', lng: -79.3832, lat: 43.6532 },
  { id: 'brampton', name: 'Brampton', region: 'Ontario', lng: -79.7624, lat: 43.7315 },
  { id: 'oakville', name: 'Oakville', region: 'Ontario', lng: -79.6877, lat: 43.4675 },
  { id: 'hamilton', name: 'Hamilton', region: 'Ontario', lng: -79.8661, lat: 43.2557 },
  { id: 'durham', name: 'Durham', region: 'Ontario', lng: -78.8658, lat: 43.8971 },
  { id: 'york', name: 'York', region: 'Ontario', lng: -79.5088, lat: 43.8361 },
  { id: 'niagara', name: 'Niagara', region: 'Ontario', lng: -79.2469, lat: 43.1594 },
  { id: 'ottawa', name: 'Ottawa', region: 'National Capital', lng: -75.6972, lat: 45.4215, onConfirm: true },
  { id: 'calgary', name: 'Calgary', region: 'Alberta', lng: -114.0719, lat: 51.0447, onConfirm: true },
  { id: 'edmonton', name: 'Edmonton', region: 'Alberta', lng: -113.4909, lat: 53.5461, onConfirm: true },
  { id: 'vancouver', name: 'Vancouver', region: 'British Columbia', lng: -123.1207, lat: 49.2827, onConfirm: true },
]

function readThemeDark(): boolean {
  if (typeof document === 'undefined') return false
  return document.documentElement.getAttribute('data-theme') === 'dark'
}

function staticUrl(token: string, dark: boolean) {
  const style = dark ? 'dark-v11' : 'light-v11'
  // Canada overview — high-res static always paints even if GL fails
  return (
    `https://api.mapbox.com/styles/v1/mapbox/${style}/static/` +
    `-96.5,56.1,3.15,0/1280x720@2x?access_token=${encodeURIComponent(token)}`
  )
}

function pinEl(hub: CoverageHub) {
  const el = document.createElement('button')
  el.type = 'button'
  el.className = `cov-pin${hub.base ? ' is-base' : ''}${hub.onConfirm ? ' is-soft' : ''}`
  el.setAttribute('aria-label', hub.name)
  el.innerHTML = `<span class="cov-pin-dot"></span><span class="cov-pin-label">${hub.name}</span>`
  return el
}

export default function CoverageMap({ token }: { token: string }) {
  const hostRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const [active, setActive] = useState<string | null>(null)
  const [glOk, setGlOk] = useState(false)
  const [dark, setDark] = useState(false)

  useEffect(() => {
    setDark(readThemeDark())
    const obs = new MutationObserver(() => setDark(readThemeDark()))
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (!token || !hostRef.current) return
    let cancelled = false
    let resizeObs: ResizeObserver | undefined

    ;(async () => {
      try {
        const mapboxgl = (await import('mapbox-gl')).default
        await import('mapbox-gl/dist/mapbox-gl.css')
        if (cancelled || !hostRef.current) return

        mapboxgl.accessToken = token
        const night = readThemeDark()
        const map = new mapboxgl.Map({
          container: hostRef.current,
          style: night ? STYLE_DARK : STYLE_LIGHT,
          center: [-96.5, 56.1],
          zoom: 3.15,
          attributionControl: false,
          logoPosition: 'bottom-left',
          failIfMajorPerformanceCaveat: false,
        })
        map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right')
        map.addControl(new mapboxgl.AttributionControl({ compact: true }), 'bottom-right')
        mapRef.current = map

        const clearMarkers = () => {
          markersRef.current.forEach((m) => {
            try { m.remove() } catch { /* */ }
          })
          markersRef.current = []
        }

        const placeMarkers = () => {
          clearMarkers()
          COVERAGE_HUBS.forEach((hub) => {
            const el = pinEl(hub)
            el.addEventListener('click', (e) => {
              e.stopPropagation()
              setActive(hub.id)
              map.flyTo({ center: [hub.lng, hub.lat], zoom: hub.base ? 9.2 : 8.4, essential: true })
            })
            markersRef.current.push(
              new mapboxgl.Marker({ element: el, anchor: 'bottom' }).setLngLat([hub.lng, hub.lat]).addTo(map),
            )
          })
        }

        const kick = () => {
          try { map.resize() } catch { /* */ }
          placeMarkers()
          setGlOk(true)
        }

        map.on('load', kick)
        map.on('style.load', () => {
          try { map.resize() } catch { /* */ }
          placeMarkers()
        })
        map.on('error', () => {
          /* keep static underneath */
        })

        // GL often needs a second resize after layout
        requestAnimationFrame(() => {
          try { map.resize() } catch { /* */ }
        })
        setTimeout(() => {
          try { map.resize() } catch { /* */ }
        }, 250)

        resizeObs = new ResizeObserver(() => {
          try { map.resize() } catch { /* */ }
        })
        resizeObs.observe(hostRef.current)
      } catch {
        if (!cancelled) setGlOk(false)
      }
    })()

    return () => {
      cancelled = true
      resizeObs?.disconnect()
      markersRef.current.forEach((m) => {
        try { m.remove() } catch { /* */ }
      })
      markersRef.current = []
      try { mapRef.current?.remove() } catch { /* */ }
      mapRef.current = null
    }
  }, [token])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !glOk) return
    const next = dark ? STYLE_DARK : STYLE_LIGHT
    map.setStyle(next)
    map.once('style.load', () => {
      try { map.resize() } catch { /* */ }
    })
  }, [dark, glOk])

  function focusHub(hub: CoverageHub) {
    setActive(hub.id)
    mapRef.current?.flyTo({
      center: [hub.lng, hub.lat],
      zoom: hub.base ? 9.2 : 8.4,
      essential: true,
    })
  }

  function resetCanada() {
    setActive(null)
    mapRef.current?.flyTo({ center: [-96.5, 56.1], zoom: 3.15, essential: true })
  }

  const activeHub = COVERAGE_HUBS.find((h) => h.id === active) || null

  return (
    <div className="cov-map">
      <div className="cov-map-chrome">
        <span className="cov-map-title">bricks · coverage</span>
        <button type="button" className="cov-map-reset" onClick={resetCanada}>
          Canada
        </button>
      </div>
      <div className="cov-map-stage">
        {/* Always-on static so the page is never a blank tray */}
        <img
          className="cov-map-static"
          src={staticUrl(token, dark)}
          alt="Map of Canada — Bricks coverage"
          width={1280}
          height={720}
          decoding="async"
          style={{ opacity: glOk ? 0 : 1 }}
        />
        <div ref={hostRef} className="cov-map-gl" style={{ opacity: glOk ? 1 : 0 }} />
        <div className="cov-map-legend" aria-hidden="true">
          <span><i className="cov-leg-base" /> Travel base</span>
          <span><i className="cov-leg-hub" /> Active hubs</span>
          <span><i className="cov-leg-soft" /> On confirm</span>
        </div>
      </div>
      <div className="cov-map-rail" role="list">
        {COVERAGE_HUBS.map((hub) => (
          <button
            key={hub.id}
            type="button"
            role="listitem"
            className={`cov-chip${active === hub.id ? ' is-on' : ''}${hub.base ? ' is-base' : ''}`}
            onClick={() => focusHub(hub)}
          >
            <span className="cov-chip-name">{hub.name}</span>
            <span className="cov-chip-meta">{hub.base ? 'Base' : hub.onConfirm ? 'Confirm' : hub.region}</span>
          </button>
        ))}
      </div>
      {activeHub ? (
        <p className="cov-map-note">
          <b>{activeHub.name}</b>
          {activeHub.base
            ? ' — travel quotes originate here. First 25 km free, then billed per km before you pay.'
            : activeHub.onConfirm
              ? ' — photographer coverage expands with booked demand. Confirm before you lock the slot.'
              : ' — same standard shoot: HDR, licensed drone when booked, floor plan on every standard package.'}
        </p>
      ) : (
        <p className="cov-map-note">
          Canada-wide network. Tap a hub to zoom. Address on <a href="/book">/book</a> confirms coverage and travel before checkout.
        </p>
      )}
    </div>
  )
}
