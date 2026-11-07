import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  buildDaySlots,
  buildTwilightSlots,
  isBookableStart,
  localClockHm,
  sunsetIso,
} from './schedule'

const TOR = 'America/Toronto'
const VAN = 'America/Vancouver'
const EPOCH = new Date(0)

function minutes(hm: string) {
  const [h, m] = hm.split(':').map(Number)
  return h * 60 + m
}

describe('sunsetIso (NOAA)', () => {
  it('Toronto Nov 7 2026 ≈ 16:58 EST', () => {
    const hm = localClockHm(sunsetIso('2026-11-07', 43.65, -79.38)!, TOR)
    assert.ok(Math.abs(minutes(hm) - minutes('16:58')) <= 5, hm)
  })
  it('Toronto Jun 21 2026 ≈ 21:03 EDT', () => {
    const hm = localClockHm(sunsetIso('2026-06-21', 43.65, -79.38)!, TOR)
    assert.ok(Math.abs(minutes(hm) - minutes('21:03')) <= 5, hm)
  })
  it('Vancouver Jul 1 2026 ≈ 21:21 PDT', () => {
    const hm = localClockHm(sunsetIso('2026-07-01', 49.28, -123.12)!, VAN)
    assert.ok(Math.abs(minutes(hm) - minutes('21:21')) <= 5, hm)
  })
  it('polar night returns null', () => {
    assert.equal(sunsetIso('2026-12-21', 78.2, 15.6), null)
  })
})

describe('twilight slots', () => {
  it('summer: one slot starting ~30 min before sunset, outside normal hours', () => {
    const s = buildTwilightSlots('2026-06-21', EPOCH, TOR, { lat: 43.65, lng: -79.38 })
    assert.equal(s.length, 1)
    const start = minutes(localClockHm(s[0].start, TOR))
    assert.equal(start % 15, 0)
    assert.ok(start >= minutes('20:15') && start <= minutes('20:45'), localClockHm(s[0].start, TOR))
    assert.match(s[0].label, /Twilight/)
    assert.ok(!buildDaySlots('2026-06-21', EPOCH, TOR).some((d) => d.start === s[0].start))
  })
  it('falls back to the province point when there is no pin', () => {
    const a = buildTwilightSlots('2026-06-21', EPOCH, TOR, { province: 'ON' })
    assert.equal(a.length, 1)
  })
  it('no point → no twilight slot', () => {
    assert.deepEqual(buildTwilightSlots('2026-06-21', EPOCH, TOR, {}), [])
  })
  it('past dates and passed times are not offered', () => {
    const now = new Date('2026-06-22T12:00:00Z')
    assert.deepEqual(buildTwilightSlots('2026-06-21', now, TOR, { province: 'ON' }), [])
  })
})

describe('isBookableStart (checkout guard)', () => {
  const tw = buildTwilightSlots('2026-06-21', EPOCH, TOR, { lat: 43.65, lng: -79.38 })[0]
  it('normal hours always ok', () => {
    const s = buildDaySlots('2026-06-21', EPOCH, TOR)[0]
    assert.equal(isBookableStart('2026-06-21', s.start, TOR), true)
  })
  it('twilight slot only with the add-on', () => {
    assert.equal(isBookableStart('2026-06-21', tw.start, TOR, { twilight: true, lat: 43.65, lng: -79.38 }), true)
    assert.equal(isBookableStart('2026-06-21', tw.start, TOR, { twilight: false, lat: 43.65, lng: -79.38 }), false)
  })
  it('general evening slots stay closed even with twilight', () => {
    const late = new Date(Date.parse(tw.start) + 90 * 60000).toISOString()
    assert.equal(isBookableStart('2026-06-21', late, TOR, { twilight: true, lat: 43.65, lng: -79.38 }), false)
    const early = new Date(Date.parse(tw.start) - 120 * 60000).toISOString()
    assert.equal(isBookableStart('2026-06-21', early, TOR, { twilight: true, lat: 43.65, lng: -79.38 }), false)
  })
  it('pin vs province fallback within tolerance', () => {
    assert.equal(isBookableStart('2026-06-21', tw.start, TOR, { twilight: true, province: 'ON' }), true)
  })
})
