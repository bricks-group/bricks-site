import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { isPublicPath, isSitePreview, PREVIEW_ENV } from './middleware.ts'

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
    assert.equal(isPublicPath('/supersplat-viewer/index.html'), true)
  })

  it('opens the help centre and its feedback API while marketing stays gated', () => {
    assert.equal(isPublicPath('/help'), true)
    assert.equal(isPublicPath('/help/booking/book-a-shoot'), true)
    assert.equal(isPublicPath('/help/search-index.json'), true)
    assert.equal(isPublicPath('/api/help-feedback'), true)
    assert.equal(isPublicPath('/helpdesk'), false)
  })

  it('opens the plan visit one-tap page and its proxy while marketing stays gated', () => {
    assert.equal(isPublicPath('/visit/confirm'), true)
    assert.equal(isPublicPath('/api/visit/confirm'), true)
    assert.equal(isPublicPath('/api/visit/decline'), true)
    assert.equal(isPublicPath('/visits'), false)
  })

  it('opens book + booking APIs while marketing stays gated', () => {
    assert.equal(isPublicPath('/book'), true)
    assert.equal(isPublicPath('/book/'), true)
    assert.equal(isPublicPath('/api/book/slots'), true)
    assert.equal(isPublicPath('/api/address-suggest'), true)
    assert.equal(isPublicPath('/book/property'), true)
    assert.equal(isPublicPath('/api/book/property-request'), true)
    assert.equal(isPublicPath('/api/quote'), true)
    assert.equal(isPublicPath('/api/create-checkout'), true)
    assert.equal(isPublicPath('/api/confirm-paid'), true)
  })

  it('opens photographers apply + legal surface while marketing stays gated', () => {
    assert.equal(isPublicPath('/photographers'), true)
    assert.equal(isPublicPath('/photographers/'), true)
    assert.equal(isPublicPath('/legal'), true)
    assert.equal(isPublicPath('/legal/'), true)
    assert.equal(isPublicPath('/legal/ic-agreement.txt'), true)
    assert.equal(isPublicPath('/terms'), true)
    assert.equal(isPublicPath('/terms/'), true)
    assert.equal(isPublicPath('/privacy'), true)
    assert.equal(isPublicPath('/account-deletion'), true)
    assert.equal(isPublicPath('/dpa'), true)
  })

  it('opens blog + SEO landings without opening OS homepage', () => {
    assert.equal(isPublicPath('/blog'), true)
    assert.equal(isPublicPath('/blog/canada-real-estate-photography-cost-2026'), true)
    assert.equal(isPublicPath('/real-estate-photography'), true)
    assert.equal(isPublicPath('/listing-photos'), true)
  })

  it('opens contact-first /demo + unlock + invite API; keeps mint UI gated', () => {
    assert.equal(isPublicPath('/demo'), true)
    assert.equal(isPublicPath('/demo/'), true)
    assert.equal(isPublicPath('/demo/unlock'), true)
    assert.equal(isPublicPath('/demo/unlock/'), true)
    assert.equal(isPublicPath('/api/demo/invite'), true)
    assert.equal(isPublicPath('/api/demo/other'), true)
    // Mint UI stays behind marketing gate.
    assert.equal(isPublicPath('/demo/invite'), false)
    assert.equal(isPublicPath('/demo/invite/'), false)
  })

  it('opens developer/REIT project microsites — the paid product itself', () => {
    assert.equal(isPublicPath('/projects'), true)
    assert.equal(isPublicPath('/projects/'), true)
    assert.equal(isPublicPath('/projects/ashfield-meadows-a1b2c3d4'), true)
  })

  it('still gates marketing and other APIs', () => {
    assert.equal(isPublicPath('/'), false)
    assert.equal(isPublicPath('/pricing'), false)
    assert.equal(isPublicPath('/about'), false)
    assert.equal(isPublicPath('/gallery'), false)
    assert.equal(isPublicPath('/service-areas'), false)
    assert.equal(isPublicPath('/platform'), false)
    assert.equal(isPublicPath('/api/contact'), false)
    assert.equal(isPublicPath('/api/newsletter'), false)
  })
})


describe('isSitePreview', () => {
  const prev = process.env[PREVIEW_ENV]
  function restore() {
    if (prev === undefined) delete process.env[PREVIEW_ENV]
    else process.env[PREVIEW_ENV] = prev
  }

  it('is off when the preview env is unset, 0, or false', () => {
    delete process.env[PREVIEW_ENV]
    assert.equal(isSitePreview(), false)
    process.env[PREVIEW_ENV] = ''
    assert.equal(isSitePreview(), false)
    process.env[PREVIEW_ENV] = '0'
    assert.equal(isSitePreview(), false)
    process.env[PREVIEW_ENV] = 'false'
    assert.equal(isSitePreview(), false)
    process.env[PREVIEW_ENV] = 'off'
    assert.equal(isSitePreview(), false)
    restore()
  })

  it('is on when BRICKS_SITE_PREVIEW is set to 1', () => {
    process.env[PREVIEW_ENV] = '1'
    assert.equal(isSitePreview(), true)
    process.env[PREVIEW_ENV] = 'true'
    assert.equal(isSitePreview(), true)
    restore()
  })
})
