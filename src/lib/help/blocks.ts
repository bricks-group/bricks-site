import type { Block } from './types'

export const p = (x: string): Block => ({ t: 'p', x })
export const h = (x: string): Block => ({ t: 'h2', x })
export const ul = (...items: string[]): Block => ({ t: 'ul', items })
export const ol = (...items: string[]): Block => ({ t: 'ol', items })
export const note = (x: string): Block => ({ t: 'note', x })
export const table = (head: string[], rows: string[][]): Block => ({ t: 'table', head, rows })
export const fig = (id: Extract<Block, { t: 'fig' }>['id'], caption: string): Block => ({ t: 'fig', id, caption })
export const flow = (...steps: [string, string][]): Block => ({ t: 'flow', steps: steps.map(([k, v]) => ({ k, v })) })
export const qa = (...items: [string, string][]): Block => ({ t: 'qa', items: items.map(([q, a]) => ({ q, a })) })
export const code = (x: string): Block => ({ t: 'code', x })
