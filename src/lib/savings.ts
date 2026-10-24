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

/**
 * The market-leading tool agents actually use for each job a Bricks plan includes (Kam, 2026-10-24).
 * Each job counted once: dotloop Premium covers transactions, e-sign and document templates, so Marble's
 * forms are not counted again. The cheapest-tool comparison lives only in SAVINGS_SOURCES.md (appendix).
 */
export const TOOLS: readonly Tool[] = [
  {
    id: 'crm',
    job: 'CRM',
    tool: 'Follow Up Boss Grow',
    usdMonthly: 69,
    url: 'https://www.followupboss.com/pricing',
    covers: ['Contacts, tasks and activity'],
  },
  {
    id: 'txn-esign',
    job: 'Transactions and e-sign',
    tool: 'dotloop Premium',
    usdMonthly: 34.99,
    url: 'https://www.dotloop.com/products/plans-pricing/',
    covers: ['Deal file: documents, checklist, conditions, deadlines and commission', 'E-sign with a signing checklist and shareable links'],
  },
  {
    id: 'ai',
    job: 'AI listing copy and document drafting',
    tool: 'ChatGPT Plus',
    usdMonthly: 20,
    url: 'https://chatgpt.com/pricing/',
    covers: ['AI listing copy', 'AI document drafter'],
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
 * Builders: what a site team buys today for one mapped visit a month on one site, from two vendors.
 * CAD list prices from each firm's own pricing page (no FX). Bricks Site Progress is a done-for-you
 * service, so we compare against services, not DIY drone software.
 */
export type SiteTool = { id: string; job: string; tool: string; cadPerVisit: number; unit: string; url: string; covers: string }
export const SITE_TOOLS: readonly SiteTool[] = [
  {
    id: 'mapping',
    job: 'Drone mapping, with a progress report and share link',
    tool: 'Buildmode Aerial Mapping',
    cadPerVisit: 950,
    unit: 'a recurring capture',
    url: 'https://buildmodeaerial.ca/pricing',
    covers: 'Orthomosaic, elevation model, point cloud, PDF report, share link',
  },
  {
    id: 'progress-media',
    job: 'Progress photos and video',
    tool: 'Video Drone',
    cadPerVisit: 325,
    unit: 'a shoot',
    url: 'https://www.videodrone.ca/construction/',
    covers: '15 photos and a 1.5-minute edited video',
  },
]
/** Buildmode's first capture carries ground control: $1,600 vs $950 after. */
export const SITE_FIRST_CAPTURE = 1600

export type SiteStack = { tools: { tool: SiteTool; cad: number }[]; separate: number; bricks: number; keep: number; setupBricks: number; setupSeparate: number }

export function builderStack(mappedMonthly: number, mappedSetup: number): SiteStack {
  const tools = SITE_TOOLS.map((tool) => ({ tool, cad: tool.cadPerVisit }))
  const separate = tools.reduce((s, t) => s + t.cad, 0)
  const mapping = SITE_TOOLS.find((t) => t.id === 'mapping')!
  return { tools, separate, bricks: mappedMonthly, keep: separate - mappedMonthly, setupBricks: mappedSetup, setupSeparate: SITE_FIRST_CAPTURE - mapping.cadPerVisit }
}

export const ROLES = [
  { id: 'agent', label: 'Agent' },
  { id: 'team', label: 'Team' },
  { id: 'brokerage', label: 'Brokerage' },
  { id: 'builder', label: 'Builder' },
] as const
export type Role = (typeof ROLES)[number]['id']
