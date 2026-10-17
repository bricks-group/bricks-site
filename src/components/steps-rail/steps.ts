import { CORE_FROM } from '@/lib/pricing'

/**
 * Companion booking steps — copy is lifted from live www (homepage band lede,
 * /agents "Drop the address, pick the services", /book "Live quote from the
 * address", /real-estate-photography "tailored quote by footprint and travel",
 * homepage FAQ "Exact clock time — not a window"). No new claims.
 */
export const STEPS_TITLE = 'Book a shoot in three steps.'
export const STEPS_LEDE =
  'Book from Companion or right here. Finished media lands back on the listing.'

export const STEPS = [
  {
    key: 'property',
    n: '01',
    label: 'Property',
    title: 'Drop the address.',
    body: 'Your quote updates live, based on home size and travel.',
    flow: 1,
  },
  {
    key: 'package',
    n: '02',
    label: 'Package',
    title: 'Pick the services.',
    body: `Start with Essentials, from $${CORE_FROM}: HDR photos, drone and a floor plan.`,
    flow: 2,
  },
  {
    key: 'time',
    n: '03',
    label: 'Time',
    title: 'Pick an exact time.',
    body: 'A real time, not a window. Paying locks it in.',
    flow: 3,
  },
] as const
