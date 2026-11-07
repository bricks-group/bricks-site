import { test } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import robots from '../app/robots'
import sitemap from '../app/sitemap'
import { isPublicPath } from '../middleware'
import * as schema from './schema'

test('AI search and requested model crawlers are explicitly allowed', () => {
  const rules = robots().rules
  const entries = Array.isArray(rules) ? rules : [rules]
  for (const bot of ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'PerplexityBot', 'ClaudeBot', 'Claude-SearchBot', 'Claude-User', 'Googlebot', 'Google-Extended', 'Applebot-Extended', 'bingbot']) {
    assert.ok(entries.some((r) => [r.userAgent].flat().includes(bot) && [r.allow].flat().includes('/')), bot)
  }
})

test('sitemap includes Site Progress booking and stable content dates', () => {
  const first = sitemap()
  assert.ok(first.some((p) => p.url === 'https://www.brxs.ca/book/site'))
  const root = first.find((p) => p.url === 'https://www.brxs.ca/')!
  assert.equal(String(root.lastModified), '2026-11-07')
  assert.equal(new Set(first.map((p) => p.url)).size, first.length)
})

test('both AI text endpoints remain public even if the marketing gate is enabled', () => {
  assert.equal(isPublicPath('/llms.txt'), true)
  assert.equal(isPublicPath('/llms-full.txt'), true)
})

test('the canonical entity is software-first and retains verified contacts', () => {
  assert.match(schema.ORGANIZATION_SCHEMA.description, /subscription software/i)
  assert.match(schema.ORGANIZATION_SCHEMA.description, /Virtual Visit/)
  assert.ok(schema.ORGANIZATION_SCHEMA.contactPoint.some((p) => p.email === 'help@brxs.ca'))
  assert.ok(schema.ORGANIZATION_SCHEMA.sameAs.length >= 3)
})

test('pricing schema includes individual monthly and annual CAD plans', () => {
  const app = schema.osSoftwareApplicationSchema('https://www.brxs.ca/pricing')
  assert.equal(app.name, 'Bricks')
  assert.equal(app['@id'], 'https://www.brxs.ca/#software')
  for (const [plan, price] of [['Clay', 0], ['Keystone', 49], ['Keystone', 490], ['Marble', 99], ['Marble', 990], ['Diamond', 149], ['Diamond', 1490]] as const) {
    assert.ok(app.offers.some((offer) => offer.name.includes(plan) && offer.price === price && offer.priceCurrency === 'CAD'), `${plan}: ${price}`)
  }
})

test('service and breadcrumb schema builders are available', () => {
  for (const key of ['virtualVisitServiceSchema', 'siteProgressServiceSchema', 'siteBreadcrumbItems']) {
    assert.equal(typeof (schema as Record<string, unknown>)[key], 'function', key)
  }
  assert.equal(schema.mediaServiceSchema({ url: 'https://www.brxs.ca/media', offers: [] }).name, 'Bricks listing media')
})

test('full-text endpoint exists and the short index is software-first', () => {
  assert.equal(existsSync('src/app/llms-full.txt/route.ts'), true)
  const index = readFileSync('public/llms.txt', 'utf8')
  assert.match(index, /subscription software/i)
  assert.match(index, /https:\/\/www\.brxs\.ca\/llms-full\.txt/)
  assert.doesNotMatch(index, /Bricks OS|Vendor OS|\bGO\b/)
})
