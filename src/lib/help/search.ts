/** Client-side help search: every query word must appear in the title, summary, collection or body. */
export type SearchDoc = { u: string; t: string; s: string; c: string; b: string }
export type Hit = { doc: SearchDoc; score: number; snippet: string }

const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[’']/g, '')

export function tokens(q: string): string[] {
  return norm(q).split(/[^a-z0-9$]+/).filter((w) => w.length > 1 || /\d/.test(w))
}

export function search(docs: SearchDoc[], q: string, limit = 20): Hit[] {
  const words = tokens(q)
  if (!words.length) return []
  const hits: Hit[] = []
  for (const doc of docs) {
    const t = norm(doc.t), s = norm(doc.s), c = norm(doc.c), b = norm(doc.b)
    let score = 0
    let all = true
    for (const w of words) {
      const inT = t.includes(w), inS = s.includes(w), inC = c.includes(w), inB = b.includes(w)
      if (!inT && !inS && !inC && !inB) { all = false; break }
      score += (inT ? 10 : 0) + (inS ? 4 : 0) + (inC ? 2 : 0) + (inB ? 1 : 0)
      if (new RegExp(`\\b${w.replace(/[$]/g, '\\$')}`).test(t)) score += 3
    }
    if (!all) continue
    if (t.includes(norm(q).trim())) score += 8
    hits.push({ doc, score, snippet: snippet(doc, words) })
  }
  return hits.sort((a, b) => b.score - a.score || a.doc.t.localeCompare(b.doc.t)).slice(0, limit)
}

function snippet(doc: SearchDoc, words: string[]): string {
  const nb = norm(doc.b)
  const inSummary = words.every((w) => norm(doc.t).includes(w) || norm(doc.s).includes(w))
  if (inSummary) return doc.s
  let at = -1
  for (const w of words) { const i = nb.indexOf(w); if (i >= 0 && (at < 0 || i < at)) at = i }
  if (at < 0) return doc.s
  const start = Math.max(0, doc.b.lastIndexOf(' ', Math.max(0, at - 60)) + 1)
  const end = Math.min(doc.b.length, start + 170)
  const cut = doc.b.slice(start, end).replace(/\s+\S*$/, '')
  return `${start > 0 ? '…' : ''}${cut}${end < doc.b.length ? '…' : ''}`
}
