import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

// UI standard (Kam 2026-10-17 / 2026-10-23): sentence-case labels, no mono-caps eyebrows on product forms.
const FORMS = [
  'src/app/photographers/PhotographerForm.tsx',
  'src/app/construction/ConstructionForm.tsx',
  'src/app/book/site/SiteBookingForm.tsx',
  'src/app/book/book-wizard.css',
]

for (const f of FORMS) {
  test(`${f} has no uppercase-transformed text`, () => {
    const src = readFileSync(join(process.cwd(), f), 'utf8')
    assert.doesNotMatch(src, /text-transform:\s*uppercase/)
  })
}

test('photographer application sections are plain headings, not numbered eyebrows', () => {
  const src = readFileSync(join(process.cwd(), 'src/app/photographers/PhotographerForm.tsx'), 'utf8')
  assert.doesNotMatch(src, /className="fsec">\s*\d/)
  assert.match(src, /className="fsec">About you</)
})
