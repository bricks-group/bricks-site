'use client'

import { useEffect, useRef, useState } from 'react'
import { COVERAGE_HUBS, chipMeta, hubKind, type CoverageHub } from '@/lib/coverage'

const BRICK = '#D2542B'
const INK = '#14110e'
const SOFT = '#8a837a'
// light-v11 / dark-v11 on purpose. applyBricksBasemap retints root style
// layers to the Bricks paper/ink palette. Mapbox Standard keeps those layers
// inside the basemap import and lights them itself, so the overlay fights it.
// HD lanes, 3D, and rain/snow also only read at street pitch — see MapCutout.
const STYLE_LIGHT = 'mapbox://styles/mapbox/light-v11'
const STYLE_DARK = 'mapbox://styles/mapbox/dark-v11'
const SRC = 'bricks-coverage-areas'
const FILL_BASE = 'bricks-cov-fill-base'
const FILL_HUB = 'bricks-cov-fill-hub'
const FILL_SOFT = 'bricks-cov-fill-soft'
const LINE_BASE = 'bricks-cov-line-base'
const LINE_HUB = 'bricks-cov-line-hub'
const LINE_SOFT = 'bricks-cov-line-soft'

function readThemeDark(): boolean {
  if (typeof document === 'undefined') return false
  return document.documentElement.getAttribute('data-theme') === 'dark'
}

/** Bricks paper / ink tokens — retint Mapbox light/dark to match the site. */
function bricksPalette(dark: boolean) {
  if (dark) {
    return {
      paper: '#141210',
      paperSoft: '#1C1A17',
      paperDeep: '#23201C',
      ink: '#F4F1EB',
      inkMute: '#8F8678',
      inkFaint: '#5C564E',
      water: '#1B2226',
      park: '#1A1F1A',
    }
  }
  return {
    paper: '#F4F1EB',
    paperSoft: '#EDE8DF',
    paperDeep: '#E4DED2',
    ink: '#14110E',
    inkMute: '#6B6054',
    inkFaint: '#A39684',
    water: '#D8E0DC',
    park: '#E8E4DA',
  }
}

function applyBricksBasemap(map: any, dark: boolean) {
  const c = bricksPalette(dark)
  const style = map.getStyle?.()
  if (!style?.layers) return

  for (const layer of style.layers as Array<{ id: string; type: string }>) {
    const id = layer.id
    const type = layer.type
    const key = id.toLowerCase()
    try {
      if (type === 'background') {
        map.setPaintProperty(id, 'background-color', c.paper)
        continue
      }
      if (type === 'fill') {
        if (key.includes('water') || key.includes('ocean') || key.includes('river') || key.includes('lake')) {
          map.setPaintProperty(id, 'fill-color', c.water)
        } else if (key.includes('park') || key.includes('pitch') || key.includes('grass') || key.includes('landuse') || key.includes('national-park')) {
          map.setPaintProperty(id, 'fill-color', c.park)
        } else if (key.includes('landcover') || key.includes('land') || key.includes('earth')) {
          map.setPaintProperty(id, 'fill-color', c.paper)
        }
        continue
      }
      if (type === 'line') {
        if (key.includes('water')) {
          map.setPaintProperty(id, 'line-color', c.water)
        } else if (key.includes('road') || key.includes('bridge') || key.includes('tunnel') || key.includes('street') || key.includes('path')) {
          map.setPaintProperty(id, 'line-color', c.paperDeep)
          try {
            map.setPaintProperty(id, 'line-opacity', 0.55)
          } catch {
            /* */
          }
        } else if (key.includes('boundary') || key.includes('admin') || key.includes('building')) {
          map.setPaintProperty(id, 'line-color', c.inkFaint)
          try {
            map.setPaintProperty(id, 'line-opacity', 0.35)
          } catch {
            /* */
          }
        }
        continue
      }
      if (type === 'symbol') {
        try {
          map.setPaintProperty(id, 'text-color', c.inkMute)
        } catch {
          /* */
        }
        try {
          map.setPaintProperty(id, 'text-halo-color', c.paper)
          map.setPaintProperty(id, 'text-halo-width', 1.2)
        } catch {
          /* */
        }
        try {
          map.setPaintProperty(id, 'icon-opacity', 0.55)
        } catch {
          /* */
        }
      }
    } catch {
      /* layer may not support paint prop */
    }
  }

  try {
    map.getCanvas().style.background = c.paper
  } catch {
    /* */
  }
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
        kind: hubKind(hub),
      },
      geometry: {
        type: 'Polygon' as const,
        coordinates: [hub.ring && hub.ring.length >= 4 ? hub.ring : circleRing(hub.lng, hub.lat, hub.radiusKm)],
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

function paintAreas(map: any, dark = false) {
  applyBricksBasemap(map, dark)
  wipeAreas(map)
  map.addSource(SRC, { type: 'geojson', data: coverageGeoJSON() })

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
    paint: { 'fill-color': BRICK, 'fill-opacity': 0.34 },
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
  el.className = `cov-label${hub.status === 'base' ? ' is-base' : ''}${hub.status === 'confirm' ? ' is-soft' : ''}`
  el.setAttribute('aria-label', hub.name)
  // The button is a 44px tap target; the visible pill is the span inside it.
  const pill = document.createElement('span')
  pill.textContent = hub.name
  el.appendChild(pill)
  return el
}

function flyZoom(hub: CoverageHub) {
  if (hub.status === 'base') return 6.35
  return 8.1
}

const DEFAULT_HUB = COVERAGE_HUBS.find((h) => h.status === 'base') || COVERAGE_HUBS[0]

function focusCamera(map: any, hub: CoverageHub, animate: boolean) {
  const ring = hub.ring
  if (ring && ring.length >= 4) {
    let minLng = ring[0][0]
    let maxLng = ring[0][0]
    let minLat = ring[0][1]
    let maxLat = ring[0][1]
    for (const [lng, lat] of ring) {
      if (lng < minLng) minLng = lng
      if (lng > maxLng) maxLng = lng
      if (lat < minLat) minLat = lat
      if (lat > maxLat) maxLat = lat
    }
    map.fitBounds(
      [
        [minLng, minLat],
        [maxLng, maxLat],
      ],
      { padding: 48, maxZoom: 7.2, duration: animate ? 900 : 0, essential: true },
    )
    return
  }
  const opts = { center: [hub.lng, hub.lat] as [number, number], zoom: flyZoom(hub), essential: true }
  if (animate) map.flyTo(opts)
  else map.jumpTo(opts)
}

export default function CoverageMap({ token }: { token: string }) {
  const hostRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const themeRef = useRef(false)
  const bootedRef = useRef(false)
  const [active, setActive] = useState<string | null>(DEFAULT_HUB?.id ?? null)
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
        const start = DEFAULT_HUB
        const map = new mapboxgl.Map({
          container: hostRef.current,
          style: night ? STYLE_DARK : STYLE_LIGHT,
          center: start ? [start.lng, start.lat] : [-79.55, 43.55],
          zoom: start ? flyZoom(start) : 6.35,
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
              focusCamera(map, hub, true)
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
            paintAreas(map, readThemeDark())
          } catch {
            /* */
          }
          placeLabels()
          if (!bootedRef.current && DEFAULT_HUB) {
            bootedRef.current = true
            setActive(DEFAULT_HUB.id)
            focusCamera(map, DEFAULT_HUB, false)
          }
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
          focusCamera(map, hub, true)
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
            if (map.isStyleLoaded()) paintAreas(map, readThemeDark())
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

  useEffect(() => {
    const map = mapRef.current
    if (!map || !glOk) return
    if (themeRef.current === dark) return
    themeRef.current = dark
    map.setStyle(dark ? STYLE_DARK : STYLE_LIGHT)
  }, [dark, glOk])

  function focusHub(hub: CoverageHub) {
    setActive(hub.id)
    if (mapRef.current) focusCamera(mapRef.current, hub, true)
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
            className={`cov-chip${active === hub.id ? ' is-on' : ''}${hub.status === 'base' ? ' is-base' : ''}`}
            onClick={() => focusHub(hub)}
          >
            <span className="cov-chip-name">{hub.name}</span>
            <span className="cov-chip-meta">{chipMeta(hub)}</span>
          </button>
        ))}
      </div>
      {activeHub ? (
        <p className="cov-map-note">
          <b>{activeHub.name}</b>
          {activeHub.note}
        </p>
      ) : (
        <p className="cov-map-note">
          Across Ontario, wherever a photographer is near. Tap a shaded area to zoom. Address on <a href="/book">/book</a> confirms coverage and
          travel before checkout.
        </p>
      )}
    </div>
  )
}
