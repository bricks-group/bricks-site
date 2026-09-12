import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { isPublicPath } from './middleware.ts'

describe('isPublicPath', () => {
  it('keeps gate + static public', () => {
    assert.equal(isPublicPath('/gate'), true)
    assert.equal(isPublicPath('/api/gate'), true)
    assert.equal(isPublicPath('/_next/static/x'), true)
    assert.equal(isPublicPath('/favicon.svg'), true)
    assert.equal(isPublicPath('/robots.txt'), true)
  })

  it('opens book + booking APIs while marketing stays gated', () => {
    assert.equal(isPublicPath('/book'), true)
    assert.equal(isPublicPath('/book/'), true)
    assert.equal(isPublicPath('/api/book/slots'), true)
    assert.equal(isPublicPath('/api/address-suggest'), true)
  })

  it('opens photographers apply + IC agreement while marketing stays gated', () => {
    assert.equal(isPublicPath('/photographers'), true)
    assert.equal(isPublicPath('/photographers/'), true)
    assert.equal(isPublicPath('/legal/ic-agreement.txt'), true)
  })

  it('still gates marketing and other APIs', () => {
    assert.equal(isPublicPath('/'), false)
    assert.equal(isPublicPath('/pricing'), false)
    assert.equal(isPublicPath('/legal'), false)
    assert.equal(isPublicPath('/api/contact'), false)
    assert.equal(isPublicPath('/api/newsletter'), false)
  })
})
