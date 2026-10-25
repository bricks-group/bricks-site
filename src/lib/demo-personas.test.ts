import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { DEMO_PERSONAS, demoLink } from './demo-personas.ts'

describe('demo personas', () => {
  it('links each persona into the demo build', () => {
    assert.equal(demoLink('https://demo.brxs.ca/', 'manager'), 'https://demo.brxs.ca/?demo_as=manager')
  })
  it('keys are unique and copy follows the brand rules', () => {
    const keys = DEMO_PERSONAS.map((p) => p.key)
    assert.equal(new Set(keys).size, keys.length)
    for (const p of DEMO_PERSONAS) {
      const text = `${p.label} ${p.who} ${p.line}`
      assert.ok(!/Bricks OS|\bGO\b|down the street/.test(text), text)
      assert.equal(p.label[0], p.label[0].toUpperCase())
      assert.equal(p.label.slice(1), p.label.slice(1).toLowerCase(), `sentence case: ${p.label}`)
    }
  })
})
