import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import nextConfig from '../../next.config'
import { config } from '../middleware'
import { unstable_doesMiddlewareMatch } from 'next/experimental/testing/server'

test('static assets bypass middleware; private and extension-bearing pages do not', () => {
  for (const url of ['/fonts/GeneralSans-Regular.woff2', '/media/demo.webp', '/assets/logo.svg', '/favicon.svg', '/_next/static/app.js', '/screens/home.png']) {
    assert.equal(unstable_doesMiddlewareMatch({ config, nextConfig, url }), false, url)
  }
  for (const url of ['/admin/support', '/api/support/inbound', '/projects/example', '/help/search-index.json']) {
    assert.equal(unstable_doesMiddlewareMatch({ config, nextConfig, url }), true, url)
  }
})

test('hashed fonts have immutable headers and mutable media gets bounded caching', async () => {
  const rules = await nextConfig.headers!()
  assert.ok(rules.some(r => r.source.includes('/fonts/') && r.headers.some(h => h.key === 'Cache-Control' && h.value.includes('immutable'))))
  assert.ok(rules.some(r => r.source === '/media/:path*' && r.headers.some(h => h.key === 'Cache-Control' && h.value.includes('max-age=86400'))))
})

test('project pages are on-demand ISR without enumerating live projects', () => {
  const s = readFileSync('src/app/projects/[slug]/page.tsx', 'utf8')
  assert.match(s, /export const revalidate = 60/)
  assert.match(s, /generateStaticParams/)
})


test('help hub hrefs avoid /help redirects and keep website links on www', async () => {
  const help = await import('./help') as Record<string, unknown>
  assert.equal(typeof help.helpHubHref, 'function')
  const href = help.helpHubHref as (value: string) => string
  assert.equal(href('/help'), '/')
  assert.equal(href('/help?q=booking'), '/?q=booking')
  assert.equal(href('/help/booking/book-a-listing-shoot'), '/booking/book-a-listing-shoot')
  assert.equal(href('/book'), 'https://www.brxs.ca/book')
  assert.equal(href('mailto:help@brxs.ca'), 'mailto:help@brxs.ca')
})


test('only live anonymous availability responses can be shared at the CDN', async () => {
  const { GET } = await import('../app/api/book/days/route')
  const { NextRequest } = await import('next/server')
  const original = globalThis.fetch
  try {
    globalThis.fetch = async () => Response.json({ ok: true, source: 'live', days: [{ date: '2026-12-01', available: true }] })
    const live = await GET(new NextRequest('https://www.brxs.ca/api/book/days?start=2026-12-01'))
    assert.match(live.headers.get('Cache-Control') || '', /s-maxage=60/)
    assert.match(live.headers.get('Cache-Control') || '', /stale-while-revalidate/)
    globalThis.fetch = async () => Response.json({ ok: false, source: 'unavailable', days: [] })
    const failed = await GET(new NextRequest('https://www.brxs.ca/api/book/days'))
    assert.equal(failed.headers.get('Cache-Control'), 'no-store')
  } finally { globalThis.fetch = original }
})


test('availability mounts dedupe in flight, retain only live results briefly, retry errors', async () => {
  const { existsSync } = await import('node:fs')
  assert.ok(existsSync('src/lib/availability-read.ts'), 'shared availability read is missing')
  const { readAvailability } = await import('./availability-read')
  let calls = 0
  const fetcher = async () => { calls++; return Response.json({ source: 'live', days: [] }) }
  await Promise.all([readAvailability('/days?test=one', fetcher, 1000), readAvailability('/days?test=one', fetcher, 1000)])
  assert.equal(calls, 1)
  await readAvailability('/days?test=one', fetcher, 2000)
  assert.equal(calls, 1)
  await readAvailability('/days?test=one', fetcher, 62000)
  assert.equal(calls, 2)
  const fallback = async () => { calls++; return Response.json({ source: 'fallback', days: [] }) }
  await readAvailability('/days?test=error', fallback, 1000)
  await readAvailability('/days?test=error', fallback, 1000)
  assert.equal(calls, 4)
})
