/**
 * /book prefill from a Bricks link (Book a shoot on a listing or the desk):
 * ?address=&name=&email=&phone=&brokerage=. Values are trimmed, single-spaced,
 * length-capped, and dropped when they don't look right (email shape, phone
 * digits). The booking still needs a picked address suggestion, a time and
 * payment, so nothing here can book on its own.
 */
export type BookPrefill = {
  address?: string
  name?: string
  email?: string
  phone?: string
  brokerage?: string
}

const CAPS: Record<keyof BookPrefill, number> = { address: 160, name: 120, email: 120, phone: 40, brokerage: 120 }

function clean(v: string | null, max: number): string {
  // Strip control characters and angle brackets; collapse whitespace.
  return (v || '').replace(/[\u0000-\u001f\u007f<>]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max)
}

export function readBookPrefill(search: string): BookPrefill {
  const q = new URLSearchParams(search || '')
  if (q.get('paid') === '1') return {}
  const out: BookPrefill = {}
  for (const k of Object.keys(CAPS) as (keyof BookPrefill)[]) {
    const v = clean(q.get(k), CAPS[k])
    if (!v) continue
    if (k === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) continue
    if (k === 'phone' && (v.replace(/\D/g, '').length < 7 || /[^0-9+().\-\s x]/i.test(v))) continue
    if (k === 'address' && v.length < 3) continue
    out[k] = v
  }
  return out
}
