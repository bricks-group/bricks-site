import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { CAREERS_EMAIL } from './careers'

describe('careers inbox', () => {
  it('is careers@brxs.ca', () => assert.equal(CAREERS_EMAIL, 'careers@brxs.ca'))
  it('apply form and hub point applicants at it, not help@', () => {
    const form = readFileSync('src/app/work-with-bricks/TradeApplyForm.tsx', 'utf8')
    assert.ok(form.includes('CAREERS_EMAIL'))
    assert.ok(!form.includes('help@brxs.ca'))
    assert.ok(readFileSync('src/app/work-with-bricks/page.tsx', 'utf8').includes('CAREERS_EMAIL'))
  })
})
