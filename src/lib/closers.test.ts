import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const root = join(__dirname, '..', '..')
const read = (p: string) => readFileSync(join(root, p), 'utf8')
const closer = (s: string) => (s.match(/<Close [^>]*\/>/) || [''])[0]

// The closing band repeats the hero action on these pages, so it is the orange primary.
for (const p of ['src/app/page.tsx', 'src/app/platform/page.tsx', 'src/app/brokerage/page.tsx']) {
  test(`${p}: last call to action is the orange primary`, () => {
    const c = closer(read(p))
    assert.ok(c, 'has a closing band')
    assert.doesNotMatch(c, /primary=\{false\}/)
  })
}

test('closing band button reads in light and dark mode, with hover and focus states', () => {
  const css = read('src/components/calm/calm.css')
  assert.match(css, /\.cm-close \.btn\.btn-primary\{background:#D2542B!important;color:#fff!important/)
  assert.match(css, /\.cm-close \.btn\.btn-primary:hover\{/)
  assert.match(css, /\.cm-close \.btn:focus-visible\{outline:2px solid var\(--ink\)/)
  // the outlined variant follows the theme tokens instead of the fixed night colour that matched the dark page
  assert.match(css, /\.cm-close \.btn:not\(\.btn-primary\)\{background:transparent;color:var\(--ink\);border:1px solid var\(--ink\)/)
})

test('Close renders a single button', () => {
  const s = read('src/components/calm/Calm.tsx')
  const body = s.slice(s.indexOf('export function Close'))
  assert.equal((body.slice(0, body.indexOf('\n}')).match(/className=\{cls\}/g) || []).length, 2, 'one link, internal or external')
})
