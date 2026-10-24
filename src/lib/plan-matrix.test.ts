import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { ADDONS } from './catalog'
import { MATRIX_PLANS, PLAN_MATRIX, cellFor, planHas } from './plan-matrix'

/**
 * Mirror of the plan gates in Bricks OS (backend/server.py, origin/main, read 2026-10-24).
 * require_plan(tier) or require_plan_or_addon('diamond', addon) on each route.
 */
const OS_GATES: Record<string, { tier: 'clay' | 'keystone' | 'marble' | 'diamond'; addon?: string }> = {
  'POST /mls/sync': { tier: 'clay' },
  'GET /crm/contacts': { tier: 'keystone' },
  'GET /crm/reengagement-scan': { tier: 'keystone' },
  'POST /crm/contacts/import': { tier: 'keystone' },
  'POST /integrations/crm/connect': { tier: 'keystone' },
  'POST /esign/envelopes': { tier: 'keystone' },
  'POST /forms/templates': { tier: 'marble' },
  'POST /mls/listings/{listing_id}/generate-copy': { tier: 'diamond', addon: 'ai_listing_copy' },
  'POST /mls/listings/{listing_id}/cma': { tier: 'diamond', addon: 'ai_cma' },
  'POST /mls/listings/{listing_id}/draft-document': { tier: 'diamond', addon: 'ai_document_drafter' },
}

const rows = PLAN_MATRIX.flatMap((g) => g.rows)

test('every gated row starts at the tier the app enforces', () => {
  for (const r of rows.filter((r) => r.gate)) {
    const g = OS_GATES[r.gate!]
    assert.ok(g, `no OS gate mirrored for ${r.gate}`)
    assert.equal(r.from, g.tier, r.label)
    if (g.addon) assert.equal(r.addon?.replace(/-/g, '_'), g.addon, r.label)
  }
})

test('OS source still gates those routes the same way (when the Bricks-OS checkout is present)', (t) => {
  const repo = '/workspace/Bricks-OS'
  if (!existsSync(repo)) return t.skip('Bricks-OS not checked out')
  let src = ''
  try { src = execSync('git show origin/main:backend/server.py', { cwd: repo, encoding: 'utf8', maxBuffer: 64 << 20 }) } catch { return t.skip('cannot read origin/main') }
  let checked = 0
  for (const [route, g] of Object.entries(OS_GATES)) {
    const [method, path] = route.split(' ')
    const i = src.indexOf(`@api_router.${method.toLowerCase()}("${path}"`)
    if (i < 0) continue // route lives in another module (listing_file.py)
    const head = src.slice(i, i + 900)
    const want = g.addon ? new RegExp(`require_plan_or_addon\\(\\s*request,\\s*["']diamond["']\\s*,\\s*["']${g.addon}["']`) : new RegExp(`require_plan\\(\\s*request,\\s*["']${g.tier}["']`)
    assert.match(head, want, route)
    checked++
  }
  assert.ok(checked >= 6, `only ${checked} gates found in server.py`)
})

test('rows not shipped yet say coming soon on every plan', () => {
  for (const label of ['Place signature fields on the PDF', 'Connect DocuSign']) {
    for (const p of MATRIX_PLANS) assert.deepEqual(cellFor(rows.find((r) => r.label === label)!, p), { kind: 'text', text: 'Coming soon' })
  }
})

test('AI add-on cells use the catalog price, on Keystone and Marble only', () => {
  for (const r of rows.filter((r) => r.addon)) {
    const price = ADDONS.find((a) => a.id === r.addon)!.price.replace(' / mo', '/mo')
    assert.deepEqual(cellFor(r, 'keystone'), { kind: 'text', text: `Add-on, ${price}` })
    assert.deepEqual(cellFor(r, 'marble'), { kind: 'text', text: `Add-on, ${price}` })
    assert.deepEqual(cellFor(r, 'clay'), { kind: 'no' })
    assert.deepEqual(cellFor(r, 'diamond'), { kind: 'yes' })
  }
})

test('trust accounting is brokerage only; brokerage seats get every shipped feature', () => {
  assert.equal(planHas('Trust accounting', 'diamond'), false)
  assert.equal(planHas('Trust accounting', 'brokerage'), true)
  for (const r of rows.filter((r) => r.from)) assert.equal(planHas(r.label, 'brokerage'), true, r.label)
})

test('labels are unique and planHas rejects unknown rows', () => {
  assert.equal(new Set(rows.map((r) => r.label)).size, rows.length)
  assert.throws(() => planHas('Not a feature', 'clay'))
})

test('compare section is collapsed by default and has no uppercase chips', () => {
  const src = readFileSync(new URL('../app/pricing/CompareFeatures.tsx', import.meta.url), 'utf8')
  assert.match(src, /<details className="cf"/)
  assert.doesNotMatch(src, /<details[^>]*\sopen/)
  assert.doesNotMatch(src, /uppercase/)
})
