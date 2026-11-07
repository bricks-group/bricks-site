import { SOFTWARE_MODULES, moduleHref } from './software-modules'

export const HELP_URL = 'https://help.brxs.ca'

/** Software dropdown: one entry per in-depth module page, then the with/without comparison and calculator. */
export const softwareParts = [
  ...SOFTWARE_MODULES.map((m) => ({ href: moduleHref(m.slug), label: m.short, detail: m.blurb })),
  { href: '/why-bricks', label: 'With and without Bricks', detail: 'Side by side, and a savings calculator' },
]
