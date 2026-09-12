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
    assert.equal(isPublicPath('/sitemap.xml'), true)
    assert.equal(isPublicPath('/media/work/01.jpg'), true)
    assert.equal(isPublicPath('/assets/protect.js'), true)
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

  it('opens blog + SEO landings without opening OS homepage', () => {
    assert.equal(isPublicPath('/blog'), true)
    assert.equal(isPublicPath('/blog/canada-real-estate-photography-cost-2026'), true)
    assert.equal(isPublicPath('/real-estate-photography'), true)
    assert.equal(isPublicPath('/listing-photos'), true)
  })

  it('still gates marketing and other APIs', () => {
    assert.equal(isPublicPath('/'), false)
    assert.equal(isPublicPath('/pricing'), false)
    assert.equal(isPublicPath('/about'), false)
    assert.equal(isPublicPath('/gallery'), false)
    assert.equal(isPublicPath('/service-areas'), false)
    assert.equal(isPublicPath('/platform'), false)
    assert.equal(isPublicPath('/legal'), false)
    assert.equal(isPublicPath('/api/contact'), false)
    assert.equal(isPublicPath('/api/newsletter'), false)
  })
})
