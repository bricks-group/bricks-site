import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  FALLBACK_TZ,
  PROVINCE_TZ,
  SLOT_DURATION_MIN,
  SLOT_STEP_MIN,
  WORK_END,
  WORK_START,
  buildDaySlots,
  civilLocalToIso,
  filterOpenSlots,
  formatBookedWhen,
  formatSlotLabel,
  localYmd,
  normalizeProvince,
  provinceFromAddress,
  resolvePropertyTimezone,
  slotBoundsIso,
  zoneAbbrev,
} from './schedule.ts'

describe('province → IANA timezone', () => {
  it('maps every listed province and territory', () => {
    assert.equal(PROVINCE_TZ.BC, 'America/Vancouver')
    assert.equal(PROVINCE_TZ.AB, 'America/Edmonton')
    assert.equal(PROVINCE_TZ.SK, 'America/Regina')
    assert.equal(PROVINCE_TZ.MB, 'America/Winnipeg')
    assert.equal(PROVINCE_TZ.ON, 'America/Toronto')
    assert.equal(PROVINCE_TZ.QC, 'America/Toronto')
    assert.equal(PROVINCE_TZ.NB, 'America/Halifax')
    assert.equal(PROVINCE_TZ.NS, 'America/Halifax')
    assert.equal(PROVINCE_TZ.PE, 'America/Halifax')
    assert.equal(PROVINCE_TZ.NL, 'America/St_Johns')
    assert.equal(PROVINCE_TZ.YT, 'America/Whitehorse')
    assert.equal(PROVINCE_TZ.NT, 'America/Yellowknife')
    assert.equal(PROVINCE_TZ.NU, 'America/Iqaluit')
  })

  it('normalizes codes, CA- prefixes, and names', () => {
    assert.equal(normalizeProvince('bc'), 'BC')
    assert.equal(normalizeProvince('CA-BC'), 'BC')
    assert.equal(normalizeProvince('British Columbia'), 'BC')
    assert.equal(normalizeProvince('Québec'), 'QC')
    assert.equal(normalizeProvince('Newfoundland and Labrador'), 'NL')
    assert.equal(normalizeProvince('PEI'), 'PE')
    assert.equal(normalizeProvince('NWT'), 'NT')
    assert.equal(normalizeProvince('unknown'), null)
  })

  it('parses province from a typed Canadian address', () => {
    assert.equal(provinceFromAddress('401 W Georgia St, Vancouver, BC, Canada'), 'BC')
    assert.equal(provinceFromAddress('888 3 St SE, Calgary, Alberta'), 'AB')
    assert.equal(provinceFromAddress('2450 South Service Rd, Regina, SK'), 'SK')
    assert.equal(provinceFromAddress('10 Fort St, Winnipeg, Manitoba, Canada'), 'MB')
    assert.equal(provinceFromAddress('100 Queen St W, Toronto, ON'), 'ON')
    assert.equal(provinceFromAddress('1 Place Ville Marie, Montréal, QC'), 'QC')
    assert.equal(provinceFromAddress('1657 Barrington St, Halifax, Nova Scotia'), 'NS')
    assert.equal(provinceFromAddress("10 Duckworth St, St. John's, NL"), 'NL')
    assert.equal(provinceFromAddress('200 Granville St, Vancouver, V6C 1S4'), 'BC')
    assert.equal(provinceFromAddress('somewhere without a region'), null)
  })

  it('resolves province first, then address, then allowlisted tz, then silent fallback', () => {
    assert.deepEqual(
      resolvePropertyTimezone({ province: 'BC', address: 'Toronto, ON', timezone: 'America/Halifax' }),
      { tz: 'America/Vancouver', province: 'BC', source: 'province' },
    )
    assert.deepEqual(
      resolvePropertyTimezone({ address: 'Calgary, AB' }),
      { tz: 'America/Edmonton', province: 'AB', source: 'address' },
    )
    assert.deepEqual(
      resolvePropertyTimezone({ timezone: 'America/St_Johns' }),
      { tz: 'America/St_Johns', province: null, source: 'timezone' },
    )
    assert.deepEqual(
      resolvePropertyTimezone({ timezone: 'America/New_York', address: '' }),
      { tz: FALLBACK_TZ, province: null, source: 'fallback' },
    )
  })
})

describe('civil clocks and labels', () => {
  it('converts the same wall clock to different UTC instants by zone', () => {
    const ymd = '2026-09-25'
    const van = civilLocalToIso(ymd, '14:00', 'America/Vancouver')
    const tor = civilLocalToIso(ymd, '14:00', 'America/Toronto')
    const yyt = civilLocalToIso(ymd, '14:00', 'America/St_Johns')
    const sk = civilLocalToIso(ymd, '14:00', 'America/Regina')
    assert.ok(van && tor && yyt && sk)
    assert.notEqual(van, tor)
    assert.equal(van, '2026-09-25T21:00:00.000Z')
    assert.equal(tor, '2026-09-25T18:00:00.000Z')
    assert.equal(yyt, '2026-09-25T16:30:00.000Z')
    assert.equal(sk, '2026-09-25T20:00:00.000Z')
  })

  it('labels Vancouver with PT, not ET or an IANA name', () => {
    const iso = '2026-09-25T21:00:00.000Z'
    const when = formatBookedWhen(iso, 'America/Vancouver')
    const label = formatSlotLabel(iso, 'America/Vancouver')
    assert.match(when, /Fri, Sep 25 · 2:00 PM PT/)
    assert.equal(label, '2:00 PM PT')
    assert.doesNotMatch(when, /ET/)
    assert.doesNotMatch(when, /America\/Toronto/)
    assert.doesNotMatch(label, /America\/Toronto/)
  })

  it('uses NT for Newfoundland and AT for Halifax — never hard-coded ET', () => {
    assert.equal(zoneAbbrev('America/St_Johns'), 'NT')
    assert.equal(zoneAbbrev('America/Halifax'), 'AT')
    assert.match(formatBookedWhen('2026-09-25T16:30:00.000Z', 'America/St_Johns'), /2:00 PM NT/)
    assert.match(formatBookedWhen('2026-09-25T17:00:00.000Z', 'America/Halifax'), /2:00 PM AT/)
  })

  it('fallback zone still shows ET, not “Toronto time” or America/Toronto', () => {
    const when = formatBookedWhen('2026-09-25T18:00:00.000Z', FALLBACK_TZ)
    assert.match(when, /2:00 PM ET/)
    assert.doesNotMatch(when, /Toronto/)
    assert.doesNotMatch(when, /America\//)
  })
})

describe('slot generation', () => {
  it('keeps half-hour steps and 09:00–17:00 in the property zone', () => {
    const now = new Date('2026-09-01T12:00:00.000Z')
    const slots = buildDaySlots('2026-09-25', now, 'America/Vancouver')
    assert.equal(slots.length, 15)
    assert.equal(slots[0].start, civilLocalToIso('2026-09-25', WORK_START, 'America/Vancouver'))
    assert.equal(slots[0].label, `9:00 AM PT`)
    assert.equal(slots[1].label, '9:30 AM PT')
    const last = slots[slots.length - 1]
    assert.equal(last.start, civilLocalToIso('2026-09-25', '16:00', 'America/Vancouver'))
    const bounds = slotBoundsIso('2026-09-25', WORK_START, 'America/Vancouver')
    assert.ok(bounds)
    const durMin = (Date.parse(bounds.end) - Date.parse(bounds.start)) / 60000
    assert.equal(durMin, SLOT_DURATION_MIN)
    assert.equal(SLOT_STEP_MIN, 30)
    assert.equal(WORK_END, '17:00')
    for (const s of slots) {
      assert.doesNotMatch(s.label, /America\//)
      assert.match(s.label, /PT$/)
    }
  })

  it('filters past slots using the property-local civil day', () => {
    // 11:30 AM PDT on 2026-09-25
    const now = new Date('2026-09-25T18:30:00.000Z')
    const van = buildDaySlots('2026-09-25', now, 'America/Vancouver')
    assert.equal(van[0].label, '12:00 PM PT')
    assert.ok(van.every((s) => Date.parse(s.start) > now.getTime()))

    const todayVan = localYmd(now, 'America/Vancouver')
    assert.equal(todayVan, '2026-09-25')
    const yesterday = buildDaySlots('2026-09-24', now, 'America/Vancouver')
    assert.equal(yesterday.length, 0)
  })

  it('hides overlapping taken ranges without depending on timezone labels', () => {
    const now = new Date('2026-09-01T12:00:00.000Z')
    const slots = buildDaySlots('2026-09-25', now, 'America/Edmonton')
    const taken = [{ start: slots[2].start, end: slots[2].end }]
    const open = filterOpenSlots(slots, taken)
    assert.ok(open.length < slots.length)
    assert.ok(!open.some((s) => s.start === slots[2].start))
    // 60-min bookings on a 30-min grid also hide the neighboring starts they overlap.
    assert.ok(open.every((s) => Date.parse(s.end) <= Date.parse(taken[0].start) || Date.parse(s.start) >= Date.parse(taken[0].end)))
  })
})
