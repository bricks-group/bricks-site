/**
 * Full feature matrix for /pricing ("Compare every feature").
 * Every row mirrors a real plan gate in Bricks OS (origin/main, checked 2026-10-24):
 * backend/server.py require_plan / require_plan_or_addon, and backend/common/listing_file.py.
 * `gate` names the route that enforces it; plan-matrix.test.ts keeps `from` in step with those gates.
 * Brokerage seats with a live subscription get full access (plus trust accounting, office-seat only).
 */
import { ADDONS } from './catalog'

export const MATRIX_PLANS = ['clay', 'keystone', 'marble', 'diamond', 'brokerage'] as const
export type MatrixPlan = (typeof MATRIX_PLANS)[number]
export const MATRIX_PLAN_NAMES: Record<MatrixPlan, string> = {
  clay: 'Clay',
  keystone: 'Keystone',
  marble: 'Marble',
  diamond: 'Diamond',
  brokerage: 'Brokerage seat',
}

type Tier = 'clay' | 'keystone' | 'marble' | 'diamond'
type AddonId = (typeof ADDONS)[number]['id']

export type MatrixRow = {
  label: string
  /** First individual plan that includes it. Brokerage seats include every tier. */
  from?: Tier
  /** Diamond includes it; lower paid plans can add it by the month. */
  addon?: AddonId
  /** Not shipped yet, on any plan. */
  soon?: boolean
  /** Same text on every plan (e.g. quoted per job). */
  all?: string
  /** Brokerage seats only. */
  brokerageOnly?: boolean
  /** OS route that enforces the gate, for the test. */
  gate?: string
}

export type MatrixGroup = { title: string; rows: readonly MatrixRow[] }

export const PLAN_MATRIX: readonly MatrixGroup[] = [
  {
    title: 'Listings and media',
    rows: [
      { label: 'Book listing media and site visits, priced per job', from: 'clay' },
      { label: 'Listing file: captures, deliverables, media zip and a share link', from: 'clay' },
      { label: 'A listing site for each shoot, with an inquiry form', from: 'clay' },
    ],
  },
  {
    title: 'Virtual Visit',
    rows: [{ label: 'Virtual Visit tour with an embeddable viewer', all: 'On request' }],
  },
  {
    title: 'Transactions and MLS',
    rows: [
      { label: 'Deal file: documents, checklist, conditions, deadlines and commission', from: 'clay' },
      { label: 'Calendar with a feed for your own calendar app', from: 'clay' },
      { label: 'Connect your own MLS: sync, listing checks and submission', from: 'clay', gate: 'POST /mls/sync' },
    ],
  },
  {
    title: 'CRM and contacts',
    rows: [
      { label: 'Contacts, tasks and activity', from: 'keystone', gate: 'GET /crm/contacts' },
      { label: 'Re-engagement scan for contacts gone quiet', from: 'keystone', gate: 'GET /crm/reengagement-scan' },
      { label: 'Contact import', from: 'keystone', gate: 'POST /crm/contacts/import' },
      { label: 'Follow Up Boss two-way sync, contacts and deals', from: 'keystone', gate: 'POST /integrations/crm/connect' },
      { label: 'kvCORE contact import', from: 'keystone', gate: 'POST /integrations/crm/connect' },
    ],
  },
  {
    title: 'E-sign and documents',
    rows: [
      { label: 'E-sign with a signing checklist and shareable links', from: 'keystone', gate: 'POST /esign/envelopes' },
      { label: 'Place signature fields on the PDF', soon: true },
      { label: 'Connect DocuSign', soon: true },
      { label: 'Forms: your templates, prefilled from the listing, saved as PDF', from: 'marble', gate: 'POST /forms/templates' },
    ],
  },
  {
    title: 'AI',
    rows: [
      { label: 'AI listing copy', addon: 'ai-listing-copy', from: 'diamond', gate: 'POST /mls/listings/{listing_id}/generate-copy' },
      { label: 'AI CMA from sold comps, with a PDF', addon: 'ai-cma', from: 'diamond', gate: 'POST /mls/listings/{listing_id}/cma' },
      { label: 'AI document drafter', addon: 'ai-document-drafter', from: 'diamond', gate: 'POST /mls/listings/{listing_id}/draft-document' },
    ],
  },
  {
    title: 'Team and seats',
    rows: [
      { label: 'Team members use your plan, with no charge per agent', from: 'clay' },
      { label: 'Trust accounting', brokerageOnly: true },
    ],
  },
  {
    title: 'Support',
    rows: [{ label: 'Email support', from: 'clay' }],
  },
]

const TIER_RANK: Record<Tier, number> = { clay: 0, keystone: 1, marble: 2, diamond: 3 }

export type Cell = { kind: 'yes' } | { kind: 'no' } | { kind: 'text'; text: string }

/** What one plan gets for one row. */
export function cellFor(row: MatrixRow, plan: MatrixPlan): Cell {
  if (row.soon) return { kind: 'text', text: 'Coming soon' }
  if (row.all) return { kind: 'text', text: row.all }
  if (row.brokerageOnly) return plan === 'brokerage' ? { kind: 'yes' } : { kind: 'no' }
  if (plan === 'brokerage') return { kind: 'yes' }
  if (!row.from) return { kind: 'no' }
  if (TIER_RANK[plan] >= TIER_RANK[row.from]) return { kind: 'yes' }
  // App shows add-ons to Keystone and Marble (OS plans.js rowState).
  if (row.addon && plan !== 'clay') {
    const a = ADDONS.find((x) => x.id === row.addon)!
    return { kind: 'text', text: `Add-on, ${a.price.replace(' / mo', '/mo')}` }
  }
  return { kind: 'no' }
}

/** True when the plan has the row today (used by the savings section to stay like for like). */
export function planHas(label: string, plan: MatrixPlan): boolean {
  for (const g of PLAN_MATRIX) for (const r of g.rows) if (r.label === label) return cellFor(r, plan).kind === 'yes'
  throw new Error(`No matrix row: ${label}`)
}
