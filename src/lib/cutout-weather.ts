/**
 * Mapbox Standard HD + precipitation for the booking address cutout.
 *
 * Rain and snow particles only read when the camera is pitched and zoomed
 * past ~11 (Mapbox fades them out below that). MapCutout is locked at
 * zoom 16.2 / pitch 52, so this is the surface where they show. CoverageMap
 * stays on light-v11 / dark-v11 for the Bricks paper/ink retint.
 *
 * One precipitation pass at a time: snow in Dec–Feb, rain otherwise.
 * They are not stacked, and this is not a live forecast.
 */

export const CUTOUT_HD_BASEMAP = {
  showPointOfInterestLabels: false,
  showTransitLabels: false,
  show3dObjects: true,
  show3dBuildings: true,
  show3dLandmarks: true,
  show3dFacades: true,
  show3dTrees: true,
  showHdRoads: true,
} as const

export type CutoutPrecip = 'rain' | 'snow'

/** monthIndex is Date#getMonth() (0 = January). */
export function cutoutPrecipKind(monthIndex: number): CutoutPrecip {
  if (monthIndex === 11 || monthIndex === 0 || monthIndex === 1) return 'snow'
  return 'rain'
}

export const CUTOUT_RAIN = {
  density: 0.5,
  intensity: 1,
  color: '#a8adbc',
  opacity: 0.7,
  vignette: 0.35,
  'vignette-color': '#464646',
  direction: [0, 80] as [number, number],
  'droplet-size': [2.6, 18.2] as [number, number],
  'distortion-strength': 0.4,
  'center-thinning': 0.15,
}

export const CUTOUT_SNOW = {
  density: 0.85,
  intensity: 1,
  'center-thinning': 0.1,
  direction: [0, 50] as [number, number],
  opacity: 0.9,
  color: '#ffffff',
  'flake-size': 0.71,
  vignette: 0.25,
  'vignette-color': '#ffffff',
}

type WeatherMap = {
  setRain: (rain: typeof CUTOUT_RAIN | null) => void
  setSnow: (snow: typeof CUTOUT_SNOW | null) => void
}

export function applyCutoutWeather(map: WeatherMap, monthIndex = new Date().getMonth()) {
  if (cutoutPrecipKind(monthIndex) === 'snow') {
    map.setRain(null)
    map.setSnow(CUTOUT_SNOW)
    return
  }
  map.setSnow(null)
  map.setRain(CUTOUT_RAIN)
}
