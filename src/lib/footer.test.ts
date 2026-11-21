import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const footer = readFileSync(join(process.cwd(), 'src/components/Footer.tsx'), 'utf8')
const cols = footer.split('<div className="foot-col">').slice(1).map((c) => c.split('</div>\n        </div>')[0])

test('footer stays short: 4 link columns, 6 links or fewer in each', () => {
  assert.equal(cols.length, 4)
  for (const c of cols) assert.ok((c.match(/<(Link|a) /g) ?? []).length <= 6, 'too many links in a column')
  assert.ok((footer.match(/<(Link|a) [^>]*href/g) ?? []).length <= 40, 'footer link budget')
})

test('footer links to the hubs that carry the long tail, and legal sits in the bottom row', () => {
  for (const hub of ['/platform', '/media', '/services', '/service-areas', '/blog', '/gallery']) assert.ok(footer.includes(`href="${hub}"`), hub)
  const meta = footer.slice(footer.indexOf('foot-meta'))
  for (const p of ['/terms', '/privacy', '/legal']) assert.ok(meta.includes(`href="${p}"`), p)
})
