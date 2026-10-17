import { CORE_FROM } from '@/lib/pricing'

/**
 * Companion booking steps — copy is lifted from live www (homepage band lede,
 * /agents "Drop the address, pick the services", /book "Live quote from the
 * address", /real-estate-photography "tailored quote by footprint and travel",
 * homepage FAQ "Exact clock time — not a window"). No new claims.
 */
export const STEPS_TITLE = 'Book a shoot in three steps.'
export const STEPS_LEDE =
  'Companion is the agent app. Property, package, exact clock time — pay locks it, the photographer gets GO, media lands back on the listing file.'

export const STEPS = [
  {
    key: 'property',
    n: '01',
    label: 'Property',
    title: 'Drop the address.',
    body: 'The quote is live from the address — tailored by footprint and travel.',
    flow: 1,
  },
  {
    key: 'package',
    n: '02',
    label: 'Package',
    title: 'Pick the services.',
    body: `Essentials from $${CORE_FROM} is HDR + licensed drone + floor plan. Media is always à la carte.`,
    flow: 2,
  },
  {
    key: 'time',
    n: '03',
    label: 'Time',
    title: 'Lock an exact clock time.',
    body: 'Exact clock time — not a window. Assignee and travel are final on the quote; pay locks it.',
    flow: 3,
  },
] as const
