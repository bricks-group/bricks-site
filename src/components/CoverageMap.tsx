'use client'

import { useEffect, useRef, useState } from 'react'

const BRICK = '#D2542B'
const INK = '#14110e'
const SOFT = '#8a837a'
const STYLE_LIGHT = 'mapbox://styles/mapbox/light-v11'
const STYLE_DARK = 'mapbox://styles/mapbox/dark-v11'
const SRC = 'bricks-coverage-areas'
const FILL_BASE = 'bricks-cov-fill-base'
const FILL_HUB = 'bricks-cov-fill-hub'
const FILL_SOFT = 'bricks-cov-fill-soft'
const LINE_BASE = 'bricks-cov-line-base'
const LINE_HUB = 'bricks-cov-line-hub'
const LINE_SOFT = 'bricks-cov-line-soft'

export type CoverageHub = {
  id: string
  name: string
  region: string
  lng: number
  lat: number
  radiusKm: number
  base?: boolean
  onConfirm?: boolean
}

export const COVERAGE_HUBS: CoverageHub[] = [
  { id: 'mississauga', name: 'Mississauga', region: 'Ontario · base', lng: -79.6441, lat: 43.589, radiusKm: 32, base: true },
  { id: 'toronto', name: 'Toronto', region: 'Ontario', lng: -79.3832, lat: 43.6532, radiusKm: 24 },
  { id: 'brampton', name: 'Brampton', region: 'Ontario', lng: -79.7624, lat: 43.7315, radiusKm: 20 },
  { id: 'oakville', name: 'Oakville', region: 'Ontario', lng: -79.6877, lat: 43.4675, radiusKm: 16 },
  { id: 'hamilton', name: 'Hamilton', region: 'Ontario', lng: -79.8661, lat: 43.2557, radiusKm: 22 },
  { id: 'durham', name: 'Durham', region: 'Ontario', lng: -78.8658, lat: 43.8971, radiusKm: 28 },
  { id: 'york', name: 'York', region: 'Ontario', lng: -79.5088, lat: 43.8361, radiusKm: 24 },
  { id: 'niagara', name: 'Niagara', region: 'Ontario', lng: -79.2469, lat: 43.1594, radiusKm: 30 },
  { id: 'ottawa', name: 'Ottawa', region: 'National Capital', lng: -75.6972, lat: 45.4215, radiusKm: 28, onConfirm: true },
  { id: 'calgary', name: 'Calgary', region: 'Alberta', lng: -114.0719, lat: 51.0447, radiusKm: 28, onConfirm: true },
  { id: 'edmonton', name: 'Edmonton', region: 'Alberta', lng: -113.4909, lat: 53.5461, radiusKm: 28, onConfirm: true },
  { id: 'vancouver', name: 'Vancouver', region: 'British Columbia', lng: -123.1207, lat: 49.2827, radiusKm: 26, onConfirm: true },
]

function readThemeDark(): boolean {
  if (typeof document === 'undefined') return false
  return document.documentElement.getAttribute('data-theme') === 'dark'
}

function staticUrl(token: string, dark: boolean) {
  const style = dark ? 'dark-v11' : 'light-v11'
  return (
    `https://api.mapbox.com/styles/v1/mapbox/${style}/static/` +
    `-96.5,56.1,3.15,0/1280x720@2x?access_token=${encodeURIComponent(token)}`
  )
}

function circleRing(lng: number, lat: number, km: number, steps = 64): [number, number][] {
  const R = 6371
  const lat1 = (lat * Math.PI) / 180
  const lng1 = (lng * Math.PI) / 180
  const d = km / R
  const ring: [number, number][] = []
  for (let i = 0; i <= steps; i++) {
    const brng = (i / steps) * 2 * Math.PI
    const lat2 = Math.asin(Math.sin(lat1) * Math.cos(d) + Math.cos(lat1) * Math.sin(d) * Math.cos(brng))
    const lng2 =
      lng1 +
      Math.atan2(Math.sin(brng) * Math.sin(d) * Math.cos(lat1), Math.cos(d) - Math.sin(lat1) * Math.sin(lat2))
    ring.push([(lng2 * 180) / Math.PI, (lat2 * 180) / Math.PI])
  }
  return ring
}

function coverageGeoJSON() {
  return {
    type: 'FeatureCollection' as const,
    features: COVERAGE_HUBS.map((hub) => ({
      type: 'Feature' as const,
      id: hub.id,
      properties: {
        id: hub.id,
        name: hub.name,
        kind: hub.base ? 'base' : hub.onConfirm ? 'soft' : 'hub',
      },
      geometry: {
        type: 'Polygon' as const,
        coordinates: [circleRing(hub.lng, hub.lat, hub.radiusKm)],
      },
    })),
  }
}

const AREA_LAYERS = [FILL_BASE, FILL_HUB, FILL_SOFT, LINE_BASE, LINE_HUB, LINE_SOFT]

function wipeAreas(map: any) {
  AREA_LAYERS.forEach((id) => {
    try {
      if (map.getLayer(id)) map.removeLayer(id)
    } catch {
      /* */
    }
  })
  try {
    if (map.getSource(SRC)) map.removeSource(SRC)
  } catch {
    /* */
  }
}

function paintAreas(map: any) {
  wipeAreas(map)
  map.addSource(SRC, { type: 'geojson', data: coverageGeoJSON() })

  // Opaque enough to read as real coverage footprints, not tags
  map.addLayer({
    id: FILL_SOFT,
    type: 'fill',
    source: SRC,
    filter: ['==', ['get', 'kind'], 'soft'],
    paint: { 'fill-color': SOFT, 'fill-opacity': 0.22 },
  })
  map.addLayer({
    id: FILL_HUB,
    type: 'fill',
    source: SRC,
    filter: ['==', ['get', 'kind'], 'hub'],
    paint: { 'fill-color': INK, 'fill-opacity': 0.2 },
  })
  map.addLayer({
    id: FILL_BASE,
    type: 'fill',
    source: SRC,
    filter: ['==', ['get', 'kind'], 'base'],
    paint: { 'fill-color': BRICK, 'fill-opacity': 0.38 },
  })
  map.addLayer({
    id: LINE_SOFT,
    type: 'line',
    source: SRC,
    filter: ['==', ['get', 'kind'], 'soft'],
    paint: { 'line-color': SOFT, 'line-width': 1.25, 'line-opacity': 0.55, 'line-dasharray': [1.2, 1.2] },
  })
  map.addLayer({
    id: LINE_HUB,
    type: 'line',
    source: SRC,
    filter: ['==', ['get', 'kind'], 'hub'],
    paint: { 'line-color': INK, 'line-width': 1.4, 'line-opacity': 0.75 },
  })
  map.addLayer({
    id: LINE_BASE,
    type: 'line',
    source: SRC,
    filter: ['==', ['get', 'kind'], 'base'],
    paint: { 'line-color': BRICK, 'line-width': 2, 'line-opacity': 0.95 },
  })
}

function labelEl(hub: CoverageHub) {
  const el = document.createElement('button')
  el.type = 'button'
  el.className = `cov-label${hub.base ? ' is-base' : ''}${hub.onConfirm ? ' is-soft' : ''}`
  el.setAttribute('aria-label', hub.name)
  el.textContent = hub.name
  return el
}

export default function CoverageMap({ token }: { token: string }) {
  const hostRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const themeRef = useRef(false)
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
        themeRef.current = night
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
            try {
              m.remove()
            } catch {
              /* */
            }
          })
          markersRef.current = []
        }

        const placeLabels = () => {
          clearMarkers()
          COVERAGE_HUBS.forEach((hub) => {
            const el = labelEl(hub)
            el.addEventListener('click', (e) => {
              e.stopPropagation()
              setActive(hub.id)
              map.flyTo({ center: [hub.lng, hub.lat], zoom: hub.base ? 8.4 : 8.0, essential: true })
            })
            markersRef.current.push(
              new mapboxgl.Marker({ element: el, anchor: 'center' }).setLngLat([hub.lng, hub.lat]).addTo(map),
            )
          })
        }

        const syncOverlay = () => {
          try {
            map.resize()
          } catch {
            /* */
          }
          try {
            paintAreas(map)
          } catch {
            /* */
          }
          placeLabels()
          setGlOk(true)
        }

        map.on('load', syncOverlay)
        map.on('style.load', syncOverlay)

        map.on('click', (e: any) => {
          const feats = map.queryRenderedFeatures(e.point, {
            layers: [FILL_BASE, FILL_HUB, FILL_SOFT].filter((id) => map.getLayer(id)),
          }) as Array<{ properties?: { id?: string } }>
          const id = feats?.[0]?.properties?.id
          if (!id) return
          const hub = COVERAGE_HUBS.find((h) => h.id === id)
          if (!hub) return
          setActive(hub.id)
          map.flyTo({ center: [hub.lng, hub.lat], zoom: hub.base ? 8.4 : 8.0, essential: true })
        })

        ;[FILL_BASE, FILL_HUB, FILL_SOFT].forEach((layerId) => {
          map.on('mouseenter', layerId, () => {
            map.getCanvas().style.cursor = 'pointer'
          })
          map.on('mouseleave', layerId, () => {
            map.getCanvas().style.cursor = ''
          })
        })

        requestAnimationFrame(() => {
          try {
            map.resize()
          } catch {
            /* */
          }
        })
        setTimeout(() => {
          try {
            map.resize()
            if (map.isStyleLoaded()) paintAreas(map)
          } catch {
            /* */
          }
        }, 300)

        resizeObs = new ResizeObserver(() => {
          try {
            map.resize()
          } catch {
            /* */
          }
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
        try {
          m.remove()
        } catch {
          /* */
        }
      })
      markersRef.current = []
      try {
        mapRef.current?.remove()
      } catch {
        /* */
      }
      mapRef.current = null
    }
  }, [token])

  // Only swap style when the user actually toggles theme — never on first glOk
  useEffect(() => {
    const map = mapRef.current
    if (!map || !glOk) return
    if (themeRef.current === dark) return
    themeRef.current = dark
    map.setStyle(dark ? STYLE_DARK : STYLE_LIGHT)
  }, [dark, glOk])

  function focusHub(hub: CoverageHub) {
    setActive(hub.id)
    mapRef.current?.flyTo({
      center: [hub.lng, hub.lat],
      zoom: hub.base ? 8.4 : 8.0,
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
          <span>
            <i className="cov-leg-base" /> Travel base
          </span>
          <span>
            <i className="cov-leg-hub" /> Active hubs
          </span>
          <span>
            <i className="cov-leg-soft" /> On confirm
          </span>
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
          Canada-wide network. Tap a shaded area to zoom. Address on <a href="/book">/book</a> confirms coverage and
          travel before checkout.
        </p>
      )}
    </div>
  )
}
