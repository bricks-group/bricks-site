import { test } from 'node:test'
import assert from 'node:assert/strict'
import { LIGHT, bricksAppearance, cssColor, readSiteColors } from './checkout-theme'

test('hex with alpha becomes rgba; junk falls back', () => {
  assert.equal(cssColor('#14111020', '#000'), 'rgba(20,17,16,0.13)')
  assert.equal(cssColor('#F4F1EB', '#000'), '#F4F1EB')
  assert.equal(cssColor('var(--x)', '#000'), '#000')
})

test('appearance is square, paper and brick', () => {
  const a = bricksAppearance(readSiteColors(() => ''))
  assert.equal(a.variables?.borderRadius, '0px')
  assert.equal(a.variables?.colorBackground, LIGHT.paper)
  assert.equal(a.variables?.colorPrimary, LIGHT.brick)
  assert.match(String(a.rules?.['.Input']?.border), /1px solid/)
})
