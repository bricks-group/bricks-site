// Property-province GST/HST for on-site services (Kam 2026-11-07).
// Mirrors Bricks-OS backend/common/property_tax.py, which is authoritative:
// the OS quote and checkout compute the charged tax. This copy only labels
// on-page estimates before the OS quote arrives. SK is not bookable.
export const PROPERTY_TAX_RATES: Record<string, number> = {
  ON: 0.13, NS: 0.14, NB: 0.15, NL: 0.15, PE: 0.15,
  AB: 0.05, BC: 0.05, MB: 0.05, QC: 0.05, NT: 0.05, NU: 0.05, YT: 0.05, SK: 0.05,
}
const HST = new Set(['ON', 'NS', 'NB', 'NL', 'PE'])
const NAMES: Array<[RegExp, string]> = [
  [/\bnewfoundland(?: and labrador)?\b|\blabrador\b/i, 'NL'], [/\bnova scotia\b/i, 'NS'],
  [/\bprince edward island\b/i, 'PE'], [/\bnew brunswick\b|\bnouveau-brunswick\b/i, 'NB'],
  [/\bqu[eé]bec\b/i, 'QC'], [/\bontario\b/i, 'ON'], [/\bmanitoba\b/i, 'MB'],
  [/\bsaskatchewan\b/i, 'SK'], [/\balberta\b/i, 'AB'], [/\bbritish columbia\b/i, 'BC'],
  [/\bnorthwest territories\b/i, 'NT'], [/\bnunavut\b/i, 'NU'], [/\byukon\b/i, 'YT'],
]
const FSA: Record<string, string> = {
  A: 'NL', B: 'NS', C: 'PE', E: 'NB', G: 'QC', H: 'QC', J: 'QC', K: 'ON', L: 'ON', M: 'ON', N: 'ON',
  P: 'ON', R: 'MB', S: 'SK', T: 'AB', V: 'BC', X: 'NT', Y: 'YT',
}

export function provinceFromAddress(text: string | null | undefined): string | null {
  const s = String(text || '')
  const postal = s.match(/\b([ABCEGHJ-NPRSTVXY]\d[A-Z])\s*-?\s*\d[A-Z]\d\b/i)
  if (postal) {
    const fsa = postal[1].toUpperCase()
    if (['X0A', 'X0B', 'X0C'].includes(fsa)) return 'NU'
    return FSA[fsa[0]] || null
  }
  for (const [re, p] of NAMES) if (re.test(s)) return p
  const abbr = [...s.matchAll(/(?:^|[\s,(])(ON|NS|NB|NL|PE|PEI|BC|AB|SK|MB|QC|NT|NU|YT)(?=$|[\s,).])/gi)]
  if (abbr.length) {
    const a = abbr[abbr.length - 1][1].toUpperCase()
    return a === 'PEI' ? 'PE' : a
  }
  return null
}

export function propertyTax(province: string | null | undefined) {
  const p = province && PROPERTY_TAX_RATES[province] != null ? province : 'ON'
  const rate = PROPERTY_TAX_RATES[p]
  const type = HST.has(p) ? 'HST' : 'GST'
  return { province: p, rate, type, label: `${type} (${Math.round(rate * 100)}%)` }
}

/** OS 422 for Saskatchewan / unknown province (never fall back to a local quote). */
export function isProvinceBlock(j: unknown): boolean {
  const o = (j || {}) as { code?: string; detail?: unknown; error?: unknown }
  if (o.code === 'sk_unavailable' || o.code === 'province_unknown') return true
  return /saskatchewan|which province/i.test(String(o.detail || o.error || ''))
}
