/**
 * "One system, not a stack of subscriptions" on /pricing.
 * Public list prices read from each vendor's own pricing page on 2026-10-24.
 * Sources, method and like-for-like notes: public/pricing/SAVINGS_SOURCES.md (savings.test.ts keeps them in step).
 * Never add a tool whose price is not public.
 */
import { SOFTWARE_PRICES } from './catalog'
import { planHas } from './plan-matrix'

/** Bank of Canada daily rate, CAD per USD. */
export const FX = { usdToCad: 1.3993, date: '2026-10-23', source: 'https://www.bankofcanada.ca/valet/observations/FXUSDCAD/json?recent=5' } as const

export const SAVINGS_CHECKED = '2026-10-24'
export const SAVINGS_FOOTNOTE = 'Prices from public list pricing as of Oct 2026; may vary.'
export const SAVINGS_SOURCES_PATH = '/pricing/SAVINGS_SOURCES.md'

export type Tool = {
  id: string
  job: string
  tool: string
  usdMonthly: number
  url: string
  /** Matrix rows this tool stands in for. A plan counts the tool only if it has every one. */
  covers: readonly string[]
}

export const TOOLS: readonly Tool[] = [
  {
    id: 'crm',
    job: 'CRM and transactions',
    tool: 'Wise Agent CRM',
    usdMonthly: 49,
    url: 'https://wiseagent.com/pricing/',
    covers: ['Contacts, tasks and activity', 'Deal file: documents, checklist, conditions, deadlines and commission'],
  },
  {
    id: 'esign',
    job: 'E-sign',
    tool: 'Dropbox Sign Essentials',
    usdMonthly: 15,
    url: 'https://sign.dropbox.com/products/dropbox-sign/pricing',
    covers: ['E-sign with a signing checklist and shareable links'],
  },
  {
    id: 'forms',
    job: 'Online forms with PDF',
    tool: 'Jotform Bronze',
    usdMonthly: 39,
    url: 'https://www.jotform.com/pricing/',
    covers: ['Forms: your templates, prefilled from the listing, saved as PDF'],
  },
  {
    id: 'ai-copy',
    job: 'AI listing copy',
    tool: 'ListingAI Essential',
    usdMonthly: 19,
    url: 'https://www.listingai.co/pricing',
    covers: ['AI listing copy'],
  },
]

export const cad = (usd: number) => Math.round(usd * FX.usdToCad)

export const SAVINGS_PLANS = ['keystone', 'marble', 'diamond'] as const
export type SavingsPlan = (typeof SAVINGS_PLANS)[number]

export type Stack = { plan: SavingsPlan; tools: { tool: Tool; cad: number }[]; separate: number; bricks: number; keep: number }

/** Tools a plan replaces: only jobs the plan includes outright (no add-ons). */
export function stackFor(plan: SavingsPlan): Stack {
  const tools = TOOLS.filter((t) => t.covers.every((label) => planHas(label, plan))).map((tool) => ({ tool, cad: cad(tool.usdMonthly) }))
  const separate = tools.reduce((s, t) => s + t.cad, 0)
  const bricks = SOFTWARE_PRICES[plan].monthly
  return { plan, tools, separate, bricks, keep: separate - bricks }
}

/**
 * Checked but not counted: Site Progress includes the flight; this is software you fly yourself.
 * Shown to builders as context only, never as a saving.
 */
export const DRONE_SOFTWARE = {
  tool: 'DroneDeploy Flight & Analysis',
  usdYearly: 4188,
  url: 'https://www.dronedeploy.com/pricing',
} as const

export const ROLES = [
  { id: 'agent', label: 'Agent' },
  { id: 'team', label: 'Team' },
  { id: 'brokerage', label: 'Brokerage' },
  { id: 'builder', label: 'Builder' },
] as const
export type Role = (typeof ROLES)[number]['id']
