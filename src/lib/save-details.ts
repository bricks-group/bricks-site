/**
 * "Save your details for next time" after a guest pays (Kam 2026-11-21).
 * The paid Checkout Session is the only input: the email and contact come
 * from what Stripe holds for that session, never from the browser, so the
 * button can only ever start an account for the person who just paid.
 */
export type PaidSession = {
  status?: string
  payment_status?: string
  created?: number
  customer_email?: string | null
  customer_details?: { email?: string | null; name?: string | null; phone?: string | null } | null
  metadata?: Record<string, string> | null
}

export const SAVE_WINDOW_S = 24 * 3600

export type SaveDetails = { email: string; data: Record<string, string> }

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

export function detailsFromPaidSession(s: PaidSession, nowS: number): SaveDetails | { error: string } {
  if (s.status !== 'complete' || s.payment_status !== 'paid') return { error: 'not_paid' }
  if (!s.created || nowS - s.created > SAVE_WINDOW_S) return { error: 'expired' }
  const md = s.metadata || {}
  const email = String(md.email || s.customer_email || s.customer_details?.email || '').trim().toLowerCase()
  if (!EMAIL.test(email)) return { error: 'no_email' }
  const data: Record<string, string> = { signup_source: 'www_booking' }
  const name = String(md.agent_name || s.customer_details?.name || '').trim().slice(0, 120)
  const phone = String(md.phone || s.customer_details?.phone || '').trim().slice(0, 40)
  const brokerage = String(md.brokerage || '').trim().slice(0, 120)
  if (name) { data.name = name; data.full_name = name }
  if (phone) data.phone = phone
  if (brokerage) data.brokerage = brokerage
  return { email, data }
}
