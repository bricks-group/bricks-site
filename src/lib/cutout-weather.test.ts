import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  CUTOUT_HD_BASEMAP,
  CUTOUT_RAIN,
  CUTOUT_SNOW,
  applyCutoutWeather,
  cutoutPrecipKind,
} from './cutout-weather'

describe('cutout precipitation', () => {
  it('uses snow in December, January, and February', () => {
    assert.equal(cutoutPrecipKind(11), 'snow')
    assert.equal(cutoutPrecipKind(0), 'snow')
    assert.equal(cutoutPrecipKind(1), 'snow')
  })

  it('uses rain the rest of the year', () => {
    for (const month of [2, 3, 4, 5, 6, 7, 8, 9, 10]) {
      assert.equal(cutoutPrecipKind(month), 'rain')
    }
  })

  it('never stacks rain and snow', () => {
    const calls: string[] = []
    const map = {
      setRain(v: unknown) {
        calls.push(v === null ? 'rain:off' : 'rain:on')
      },
      setSnow(v: unknown) {
        calls.push(v === null ? 'snow:off' : 'snow:on')
      },
    }
    applyCutoutWeather(map, 0)
    assert.deepEqual(calls, ['rain:off', 'snow:on'])
    calls.length = 0
    applyCutoutWeather(map, 6)
    assert.deepEqual(calls, ['snow:off', 'rain:on'])
  })

  it('keeps the Standard HD flags the cutout asks for', () => {
    assert.equal(CUTOUT_HD_BASEMAP.showHdRoads, true)
    assert.equal(CUTOUT_HD_BASEMAP.show3dObjects, true)
    assert.equal(CUTOUT_HD_BASEMAP.show3dBuildings, true)
    assert.equal(CUTOUT_HD_BASEMAP.show3dLandmarks, true)
    assert.equal(CUTOUT_HD_BASEMAP.show3dFacades, true)
    assert.equal(CUTOUT_HD_BASEMAP.show3dTrees, true)
    assert.equal(CUTOUT_HD_BASEMAP.showPointOfInterestLabels, false)
    assert.equal(CUTOUT_HD_BASEMAP.showTransitLabels, false)
    assert.equal(CUTOUT_RAIN.density > 0, true)
    assert.equal(CUTOUT_SNOW.density > 0, true)
  })
})