export type DemoSurface = 'os-overview' | 'os-deal' | 'companion' | 'go'

export type DemoStep = {
  id: string
  surface: DemoSurface
  /** Brixton short label in the step rail */
  label: string
  /** Brixton chat lines for this step */
  lines: string[]
  /** Hint under the stage */
  tip: string
  src: string
  kind: 'desk' | 'phone'
  title: string
  nw: number
  nh: number
}

/** Guided tour — Ashfield/OS-first. Active surface is unlocked for in-demo poking. */
export const DEMO_STEPS: DemoStep[] = [
  {
    id: 'desk',
    surface: 'os-overview',
    label: 'The desk',
    lines: [
      "Hey — I'm Brixton. I'll walk you through Bricks in a few beats.",
      'This is the Bricks desk for Ashfield. Scroll the overview — sidebar stays on this story until we move.',
    ],
    tip: 'Scroll the desk. When you’re ready, Next.',
    src: '/screens/os.html?screen=overview',
    kind: 'desk',
    title: 'bricks',
    nw: 1440,
    nh: 920,
  },
  {
    id: 'deal',
    surface: 'os-deal',
    label: 'A deal',
    lines: [
      'Same desk, a deal in motion — not a shoot queue pretending to be the product.',
      'Transactions live here. Listing file, pipeline, the work of the shop.',
    ],
    tip: 'Poke the deal board, then Next.',
    src: '/screens/os.html?screen=transactions',
    kind: 'desk',
    title: 'bricks',
    nw: 1440,
    nh: 920,
  },
  {
    id: 'companion',
    surface: 'companion',
    label: 'Companion',
    lines: [
      'Companion is the agent app — book a shoot to an exact clock, not a vague window.',
      'Same loop as the desk, in your pocket. Try the booking flow.',
    ],
    tip: 'Tap through Companion. Next when ready.',
    src: '/screens/book.html',
    kind: 'phone',
    title: 'Companion',
    nw: 390,
    nh: 844,
  },
  {
    id: 'go',
    surface: 'go',
    label: 'Photographers',
    lines: [
      'The Bricks app in the field: photographers get the job, shoot, upload, get paid on a fixed rate card.',
      'Independent contractors. Auto-assign is the backbone. Take a look at Today.',
    ],
    tip: 'Explore the photographer app, then Next for how to try the real thing.',
    src: '/screens/disp.html',
    kind: 'phone',
    title: 'bricks',
    nw: 390,
    nh: 844,
  },
  {
    id: 'close',
    surface: 'os-overview',
    label: 'You’re set',
    lines: [
      'That’s the spine: Bricks on the desk, Companion for agents, the Bricks app for photographers.',
      'Media is live to book. The Bricks app is live in preview. Want the real loop? Book a shoot or open Bricks.',
    ],
    tip: 'Book a shoot, open Bricks, or restart the tour.',
    src: '/screens/os.html?screen=overview&lock=1',
    kind: 'desk',
    title: 'bricks',
    nw: 1440,
    nh: 920,
  },
]
