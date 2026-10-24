import { test } from 'node:test'
import assert from 'node:assert/strict'
import { packageLines } from './quote-lines'
import { PHOTO_RATE, DRONE_RATE, FLOOR_PLAN_ONLY_RATE, CORE_FROM } from './pricing'

const sum = (xs: { amount: number }[]) => xs.reduce((s, x) => s + x.amount, 0)

// The live Essentials quote (Large, GTA) that showed HDR + drone and no floor plan line.
const essentialsLarge = {
  photo_rate: 249, drone_rate: 139, base_rate: 388, drone_included: true,
  floor_plan_included: true, floor_plan_only: false, floor_plan_only_rate: 0,
}

test('Essentials shows the floor plan as an included $0 line', () => {
  const lines = packageLines(essentialsLarge, FLOOR_PLAN_ONLY_RATE)
  const fp = lines.find((l) => l.key === 'floor_plan')
  assert.ok(fp, 'floor plan line present')
  assert.equal(fp!.amount, 0)
  assert.equal(fp!.note, 'included')
})

test('package lines add up to the charged base (client total = server charge)', () => {
  assert.equal(sum(packageLines(essentialsLarge, FLOOR_PLAN_ONLY_RATE)), essentialsLarge.base_rate)
  for (let b = 0; b < 4; b++) {
    const q = { photo_rate: PHOTO_RATE[b], drone_rate: DRONE_RATE[b], drone_included: true, floor_plan_included: true }
    assert.equal(sum(packageLines(q, FLOOR_PLAN_ONLY_RATE)), PHOTO_RATE[b] + DRONE_RATE[b])
  }
  // Essentials "from" is photo + drone only: the floor plan is never billed on top.
  assert.equal(CORE_FROM, PHOTO_RATE[0] + DRONE_RATE[0])
})

test('Photos only has no floor plan line; floor plan only is one $99 line', () => {
  const photos = packageLines({ photo_rate: 249, drone_rate: 0, drone_included: false, floor_plan_included: false }, FLOOR_PLAN_ONLY_RATE)
  assert.equal(photos.find((l) => l.key === 'floor_plan'), undefined)
  assert.equal(sum(photos), 249)
  const fpo = packageLines({ photo_rate: 0, drone_rate: 0, floor_plan_only: true, floor_plan_only_rate: 99, base_rate: 99 }, FLOOR_PLAN_ONLY_RATE)
  assert.deepEqual(fpo.map((l) => [l.key, l.amount]), [['floor_plan_only', 99]])
})
