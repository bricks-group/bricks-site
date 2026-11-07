/** BM25 retrieval over the canonical help index. Pure and deterministic. */
import type { Chunk, RetrievalIndex } from './corpus'

const STOP = new Set(('a an and are as at be but by can do does for from get got have how i if in into is it its me my of on or our so than that the their them then there these they this to us was we what when where which who why will with would you your bricks please hi hello thanks thank much many write tell make about need want know get got will work does any some also just like could should there here really policy policies').split(' '))

const SYN: Record<string, string> = {
  photographer: 'photo', photographers: 'photo', photos: 'photo', photography: 'photo', pictures: 'photo', pics: 'photo',
  cost: 'price', costs: 'price', pricing: 'price', prices: 'price', fee: 'price', fees: 'price', rates: 'price', rate: 'price',
  reschedule: 'reschedul', rescheduling: 'reschedul', rescheduled: 'reschedul',
  cancel: 'cancel', cancelling: 'cancel', canceling: 'cancel', cancellation: 'cancel', cancelled: 'cancel', canceled: 'cancel',
  refund: 'refund', refunds: 'refund', refunded: 'refund',
  drones: 'drone', aerial: 'drone', uav: 'drone',
  booking: 'book', bookings: 'book', booked: 'book', schedule: 'book',
  login: 'sign', signin: 'sign', log: 'sign', password: 'password',
  delivered: 'deliver', delivery: 'deliver', receive: 'deliver', arrive: 'deliver', arrived: 'deliver',
  invoices: 'invoice', receipts: 'invoice', receipt: 'invoice',
  prepare: 'ready', preparing: 'ready', preparation: 'ready', prep: 'ready', ready: 'ready', readying: 'ready',
  turnaround: 'deliver', km: 'km', kilometres: 'km', kilometers: 'km', distance: 'km',
}

export function terms(s: string): string[] {
  return s
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[’']/g, '')
    .split(/[^a-z0-9$]+/)
    .filter((w) => w && !STOP.has(w) && (w.length > 1 || /\d/.test(w)))
    .map((w) => SYN[w] ?? (w.length > 5 ? w.replace(/(ations|ation|ings|ing|ed|es|ly|s)$/, '') : w.length > 3 ? w.replace(/s$/, '') : w))
}

type Prepared = { chunk: Chunk; tf: Map<string, number>; len: number }
const prepCache = new WeakMap<RetrievalIndex, { docs: Prepared[]; df: Map<string, number>; avg: number }>()

function prepare(index: RetrievalIndex) {
  const hit = prepCache.get(index)
  if (hit) return hit
  const df = new Map<string, number>()
  const docs = index.chunks.map((chunk) => {
    // Titles and sections are weighted by repetition.
    const ts = [...terms(chunk.title), ...terms(chunk.title), ...terms(chunk.section), ...terms(chunk.text)]
    const tf = new Map<string, number>()
    for (const t of ts) tf.set(t, (tf.get(t) ?? 0) + 1)
    for (const t of tf.keys()) df.set(t, (df.get(t) ?? 0) + 1)
    return { chunk, tf, len: ts.length }
  })
  const avg = docs.reduce((n, d) => n + d.len, 0) / Math.max(1, docs.length)
  const out = { docs, df, avg }
  prepCache.set(index, out)
  return out
}

export type Retrieved = { chunk: Chunk; score: number; matched: number }

export function retrieve(index: RetrievalIndex, query: string, k = 4): Retrieved[] {
  const q = [...new Set(terms(query))]
  if (!q.length) return []
  const { docs, df, avg } = prepare(index)
  const N = docs.length
  const k1 = 1.2, b = 0.75
  const scored: Retrieved[] = []
  for (const d of docs) {
    let score = 0, matched = 0
    for (const t of q) {
      const f = d.tf.get(t)
      if (!f) continue
      matched++
      const idf = Math.log(1 + (N - (df.get(t) ?? 0) + 0.5) / ((df.get(t) ?? 0) + 0.5))
      score += idf * ((f * (k1 + 1)) / (f + k1 * (1 - b + (b * d.len) / avg)))
    }
    if (score > 0) scored.push({ chunk: d.chunk, score, matched })
  }
  scored.sort((x, y) => y.score - x.score)
  // One chunk per article keeps citations distinct.
  const seen = new Set<string>()
  const out: Retrieved[] = []
  for (const r of scored) {
    if (seen.has(r.chunk.url)) continue
    seen.add(r.chunk.url)
    out.push(r)
    if (out.length >= k) break
  }
  return out
}

/** Share of distinct query terms the best chunk covers, 0..1. */
export function coverage(query: string, r: Retrieved | undefined): number {
  const q = new Set(terms(query))
  return r && q.size ? r.matched / q.size : 0
}
