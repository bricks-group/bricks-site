import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { isGtaMajorMarket, GTA_MAJOR_TRAVEL_ZERO_LABEL } from './coverage'

describe('GTA major markets — $0 travel', () => {
  it('includes Mississauga, Toronto, Hamilton, London', () => {
    assert.equal(isGtaMajorMarket(43.589, -79.644), true)
    assert.equal(isGtaMajorMarket(43.65, -79.38), true)
    assert.equal(isGtaMajorMarket(43.255, -79.871), true)
    assert.equal(isGtaMajorMarket(42.984, -81.245), true)
  })
  it('excludes Ottawa and Calgary', () => {
    assert.equal(isGtaMajorMarket(45.4215, -75.6972), false)
    assert.equal(isGtaMajorMarket(51.0447, -114.0719), false)
  })
  it('documents which markets are $0 travel', () => {
    assert.match(GTA_MAJOR_TRAVEL_ZERO_LABEL.toLowerCase(), /golden horseshoe/)
    assert.match(GTA_MAJOR_TRAVEL_ZERO_LABEL.toLowerCase(), /gta/)
  })
})
