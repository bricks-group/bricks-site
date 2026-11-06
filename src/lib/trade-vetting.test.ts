import { test } from 'node:test'
import assert from 'node:assert/strict'
import { tradeFromRegistry, uploadSlots, vettingError, vettingPayload, uploadsError, uploadPlan } from './trade-vetting'

const REG = {
  trades: {
    cleaner: { label: 'Cleaner', enabled: true, occupied_homes: true, credentials: [],
      proof: [{ kind: 'proof_photo', label: 'Photos of homes you cleaned', min_count: 3, required: true }],
      identity: { gov_id: true, business_or_hst: true, reviews_or_refs: true, police_check: true } },
    inspector: { label: 'Home inspector', enabled: true, occupied_homes: true,
      credentials: [
        { kind: 'rhi_or_training', label: 'RHI', required_when: 'always', expires: true },
        { kind: 'eo', label: 'E&O', required_when: 'always', expires: true },
        { kind: 'coi', label: 'CGL', required_when: 'always', expires: true },
      ],
      proof: [{ kind: 'sample_report', label: 'Sample report', min_count: 1, required: true }],
      identity: { gov_id: true, business_or_hst: true, reviews_or_refs: true, police_check: false } },
  },
}
const opts = { maxBytes: 3 * 1048576, exts: ['.pdf', '.png', '.jpg', '.jpeg'] }
const f = (name: string, size = 1000) => ({ name, size })

test('registry lookup tolerates junk', () => {
  assert.equal(tradeFromRegistry(null, 'cleaner'), null)
  assert.equal(tradeFromRegistry({ trades: {} }, 'cleaner'), null)
  assert.equal(tradeFromRegistry(REG, 'cleaner')?.label, 'Cleaner')
})

test('slots: cleaner gets proof x3, ID and optional police check', () => {
  const s = uploadSlots(tradeFromRegistry(REG, 'cleaner')!)
  assert.deepEqual(s.map((x) => [x.kind, x.required, x.minCount]), [['proof_photo', true, 3], ['id_verification', true, 1], ['police_check', false, 1]])
})

test('slots: inspector skips COI when the insurance block owns it', () => {
  const s = uploadSlots(tradeFromRegistry(REG, 'inspector')!, { skipKinds: ['coi'] })
  assert.deepEqual(s.map((x) => x.kind), ['rhi_or_training', 'eo', 'sample_report', 'id_verification'])
  assert.ok(s.find((x) => x.kind === 'eo')!.expires)
})

test('vetting: reviews link or two references, business or HST, police consent', () => {
  const t = tradeFromRegistry(REG, 'cleaner')!
  const base = { reviewsLink: '', references: [], policeConsent: true, businessName: 'Co', hstNumber: '' }
  assert.match(vettingError(t, base), /reviews link, or two references/)
  assert.match(vettingError(t, { ...base, reviewsLink: 'http://x' }), /https/)
  assert.equal(vettingError(t, { ...base, reviewsLink: 'https://g.page/x' }), '')
  const refs = [{ name: 'A', contact: 'a@x.ca', relationship: '' }, { name: 'B', contact: '416', relationship: 'client' }]
  assert.equal(vettingError(t, { ...base, references: refs }), '')
  assert.match(vettingError(t, { ...base, references: refs, businessName: '' }), /business name or HST/)
  assert.match(vettingError(t, { ...base, references: refs, policeConsent: false }), /police check/)
  assert.deepEqual(vettingPayload({ ...base, references: [...refs, { name: '', contact: '', relationship: '' }] }).references?.length, 2)
})

test('uploads: counts, types, size and expiry', () => {
  const s = uploadSlots(tradeFromRegistry(REG, 'inspector')!, { skipKinds: ['coi'] })
  const files = { rhi_or_training: [f('rhi.pdf')], eo: [f('eo.pdf')], sample_report: [f('r.pdf')], id_verification: [f('id.jpg')] }
  const exp = { rhi_or_training: '2027-01-01', eo: '2027-05-01' }
  assert.equal(uploadsError(s, files, exp, '2026-11-02', opts), '')
  assert.match(uploadsError(s, { ...files, eo: [] }, exp, '2026-11-02', opts), /Attach: E&O/)
  assert.match(uploadsError(s, files, { ...exp, eo: '' }, '2026-11-02', opts), /expiry date for: E&O/)
  assert.match(uploadsError(s, files, { ...exp, eo: '2026-01-01' }, '2026-11-02', opts), /expired/)
  assert.match(uploadsError(s, { ...files, eo: [f('eo.docx')] }, exp, '2026-11-02', opts), /PDF, PNG or JPEG/)
  assert.match(uploadsError(s, { ...files, eo: [f('eo.pdf', 9e6)] }, exp, '2026-11-02', opts), /too large/)
  const c = uploadSlots(tradeFromRegistry(REG, 'cleaner')!)
  assert.match(uploadsError(c, { proof_photo: [f('a.jpg'), f('b.jpg')], id_verification: [f('i.jpg')] }, {}, '2026-11-02', opts), /at least 3/)
})

test('upload plan: credentials, then identity, then proof, with expiry only where needed', () => {
  const s = uploadSlots(tradeFromRegistry(REG, 'inspector')!, { skipKinds: ['coi'] })
  const plan = uploadPlan(s, { sample_report: [f('r.pdf')], id_verification: [f('id.jpg')], eo: [f('eo.pdf')] }, { eo: '2027-05-01', sample_report: '2030-01-01' })
  assert.deepEqual(plan.map((p) => [p.kind, p.expiry]), [['eo', '2027-05-01'], ['id_verification', undefined], ['sample_report', undefined]])
})
