/**
 * Trade vetting for the /work-with-bricks apply forms (2026-11-02).
 *
 * The required documents come from Dispatch's trade registry
 * (GET /api/onboarding/trades), so the form and the review agree.
 * If the registry can't be loaded, the form falls back to the old flow
 * (no vetting block, no docs_pending) and the review asks for what's missing.
 */

export type RegistryCredential = { kind: string; label: string; required_when?: string; expires?: boolean; min_limit_cents?: number }
export type RegistryProof = { kind: string; label: string; min_count?: number; required?: boolean }
export type RegistryTrade = {
  label: string
  enabled: boolean
  occupied_homes: boolean
  credentials: RegistryCredential[]
  proof: RegistryProof[]
  identity: { gov_id?: boolean; business_or_hst?: boolean; reviews_or_refs?: boolean; police_check?: boolean }
}

/** One file input on the form. */
export type UploadSlot = {
  kind: string
  label: string
  group: 'credential' | 'proof' | 'identity'
  required: boolean
  expires: boolean
  multiple: boolean
  minCount: number
}

export type Reference = { name: string; contact: string; relationship: string }

export const REVIEW_HOSTS = ['google.', 'g.page', 'goo.gl', 'homestars.', 'houzz.', 'yelp.', 'facebook.', 'trustedpros.']

export function tradeFromRegistry(registry: unknown, vendorType: string): RegistryTrade | null {
  const trades = (registry as { trades?: Record<string, RegistryTrade> } | null)?.trades
  const t = trades && trades[vendorType]
  if (!t || !Array.isArray(t.credentials) || !Array.isArray(t.proof) || typeof t.identity !== 'object') return null
  return t
}

/** COI stays on the existing insurance block (insurer, $2M confirm), so it is not duplicated here. */
export function uploadSlots(t: RegistryTrade, opts: { skipKinds?: string[] } = {}): UploadSlot[] {
  const skip = new Set(opts.skipKinds || [])
  const out: UploadSlot[] = []
  for (const c of t.credentials) {
    if (skip.has(c.kind) || (c.required_when && c.required_when !== 'always')) continue
    out.push({ kind: c.kind, label: c.label, group: 'credential', required: true, expires: !!c.expires, multiple: false, minCount: 1 })
  }
  for (const p of t.proof) {
    const n = Math.max(1, p.min_count || 1)
    out.push({ kind: p.kind, label: p.label, group: 'proof', required: p.required !== false, expires: false, multiple: n > 1, minCount: n })
  }
  if (t.identity.gov_id) out.push({ kind: 'id_verification', label: 'Government photo ID', group: 'identity', required: true, expires: false, multiple: false, minCount: 1 })
  if (t.identity.police_check) {
    // Consent is required at apply; the check itself can follow (it shows as missing until it does).
    out.push({ kind: 'police_check', label: 'Police check from the last 6 months', group: 'identity', required: false, expires: false, multiple: false, minCount: 1 })
  }
  return out
}

export type VettingInput = {
  reviewsLink: string
  references: Reference[]
  policeConsent: boolean
  businessName: string
  hstNumber: string
}

/** Returns an applicant-facing error, or '' when the vetting section is complete. */
export function vettingError(t: RegistryTrade, v: VettingInput): string {
  const link = v.reviewsLink.trim()
  if (link && !/^https:\/\//i.test(link)) return 'Your reviews link must be a full URL starting with https://.'
  const refs = v.references.filter((r) => r.name.trim() && r.contact.trim())
  if (t.occupied_homes && t.identity.reviews_or_refs && !link && refs.length < 2) return 'Add a Google or HomeStars reviews link, or two references.'
  if (t.identity.business_or_hst && !v.businessName.trim() && !v.hstNumber.trim()) return 'Add your business name or HST number.'
  if (t.identity.police_check && !v.policeConsent) return 'Agree to a police check before you take jobs in clients’ homes.'
  return ''
}

export function vettingPayload(v: VettingInput) {
  const refs = v.references
    .map((r) => ({ name: r.name.trim(), contact: r.contact.trim(), relationship: r.relationship.trim() }))
    .filter((r) => r.name && r.contact)
  return {
    reviews_link: v.reviewsLink.trim() || undefined,
    references: refs.length ? refs : undefined,
    police_check_consent: v.policeConsent || undefined,
  }
}

export type PickedFile = { name: string; size: number }

/** Checks the picked files against the slots. `today` is YYYY-MM-DD. */
export function uploadsError<F extends PickedFile>(
  slots: UploadSlot[],
  files: Record<string, F[]>,
  expiry: Record<string, string>,
  today: string,
  opts: { maxBytes: number; exts: string[] },
): string {
  for (const s of slots) {
    const picked = (files[s.kind] || []).filter((f) => f.size > 0)
    if (s.required && picked.length < s.minCount) {
      return s.minCount > 1 ? `Add at least ${s.minCount} files for: ${s.label}.` : `Attach: ${s.label}.`
    }
    for (const f of picked) {
      if (!opts.exts.some((x) => f.name.toLowerCase().endsWith(x))) return `${s.label}: files must be PDF, PNG or JPEG.`
      if (f.size > opts.maxBytes) return `${s.label}: ${f.name} is too large (${Math.round(opts.maxBytes / 1048576)} MB max).`
    }
    if (s.expires && picked.length) {
      const d = (expiry[s.kind] || '').trim()
      if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) return `Add the expiry date for: ${s.label}.`
      if (d < today) return `${s.label} has expired. Upload a current one.`
    }
  }
  return ''
}

/** Upload order: credentials, ID, police check, then proof (largest last). */
export function uploadPlan<F extends PickedFile>(slots: UploadSlot[], files: Record<string, F[]>, expiry: Record<string, string>) {
  const rank = { credential: 0, identity: 1, proof: 2 } as const
  return [...slots]
    .sort((a, b) => rank[a.group] - rank[b.group])
    .flatMap((s) => (files[s.kind] || []).filter((f) => f.size > 0).map((f) => ({
      kind: s.kind, label: s.label, file: f, expiry: s.expires ? (expiry[s.kind] || undefined) : undefined,
    })))
}
