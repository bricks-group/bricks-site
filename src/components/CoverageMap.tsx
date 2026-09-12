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
  /** Mississauga travel origin */
  base?: boolean
  /** Coverage confirmed at booking, not always staffed */
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

function pinEl(hub: CoverageHub) {
  const el = document.createElement('button')
  el.type = 'button'
  el.className = `cov-pin${hub.base ? ' is-base' : ''}${hub.onConfirm ? ' is-soft' : ''}`
  el.setAttribute('aria-label', hub.name)
  el.innerHTML = `<span class="cov-pin-dot"></span><span class="cov-pin-label">${hub.name}</span>`
  return el
}

export default function CoverageMap({
  token,
  hubs = COVERAGE_HUBS,
}: {
  token: string
  hubs?: CoverageHub[]
}) {
  const hostRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const [active, setActive] = useState<string | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!token || !hostRef.current) return
    let cancelled = false
    let themeObs: MutationObserver | undefined
    let resizeObs: ResizeObserver | undefined

    ;(async () => {
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
        pitch: 0,
        bearing: 0,
        attributionControl: false,
        logoPosition: 'bottom-left',
        cooperativeGestures: true,
      })
      map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right')
      map.addControl(new mapboxgl.AttributionControl({ compact: true }), 'bottom-right')
      mapRef.current = map

      const placeMarkers = () => {
        markersRef.current.forEach((m) => {
          try { m.remove() } catch { /* */ }
        })
        markersRef.current = []
        hubs.forEach((hub) => {
          const el = pinEl(hub)
          el.addEventListener('click', (e) => {
            e.stopPropagation()
            setActive(hub.id)
            map.flyTo({ center: [hub.lng, hub.lat], zoom: hub.base ? 9.2 : 8.4, essential: true })
          })
          const marker = new mapboxgl.Marker({ element: el, anchor: 'bottom' })
            .setLngLat([hub.lng, hub.lat])
            .addTo(map)
          markersRef.current.push(marker)
        })
      }

      map.on('load', () => {
        if (cancelled) return
        // Soft Canada tint overlay via fill layer from worldview — skip if unavailable;
        // pins + Bricks chrome carry the brand.
        placeMarkers()
        setReady(true)
      })

      resizeObs = new ResizeObserver(() => {
        try { map.resize() } catch { /* */ }
      })
      resizeObs.observe(hostRef.current)

      let lastDark = readThemeDark()
      themeObs = new MutationObserver(() => {
        const dark = readThemeDark()
        if (dark === lastDark) return
        lastDark = dark
        map.setStyle(dark ? STYLE_DARK : STYLE_LIGHT)
        map.once('style.load', placeMarkers)
      })
      themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    })()

    return () => {
      cancelled = true
      themeObs?.disconnect()
      resizeObs?.disconnect()
      markersRef.current.forEach((m) => {
        try { m.remove() } catch { /* */ }
      })
      markersRef.current = []
      try { mapRef.current?.remove() } catch { /* */ }
      mapRef.current = null
    }
  }, [token, hubs])

  function focusHub(hub: CoverageHub) {
    setActive(hub.id)
    const map = mapRef.current
    if (!map) return
    map.flyTo({ center: [hub.lng, hub.lat], zoom: hub.base ? 9.2 : 8.4, essential: true })
  }

  function resetCanada() {
    setActive(null)
    mapRef.current?.flyTo({ center: [-96.5, 56.1], zoom: 3.15, essential: true })
  }

  const activeHub = hubs.find((h) => h.id === active) || null

  return (
    <div className="cov-map">
      <div className="cov-map-chrome" aria-hidden="true">
        <div className="cov-map-dots"><i /><i /><i /></div>
        <span className="cov-map-title">bricks · coverage</span>
        <button type="button" className="cov-map-reset" onClick={resetCanada}>
          Canada
        </button>
      </div>
      <div className="cov-map-stage">
        <div ref={hostRef} className="cov-map-gl" role="img" aria-label="Map of Bricks coverage across Canada" />
        {!ready ? <div className="cov-map-loading">Loading map…</div> : null}
        <div className="cov-map-legend">
          <span><i className="cov-leg-base" /> Travel base</span>
          <span><i className="cov-leg-hub" /> Active hubs</span>
          <span><i className="cov-leg-soft" /> On confirm</span>
        </div>
      </div>
      <div className="cov-map-rail" role="list">
        {hubs.map((hub) => (
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
