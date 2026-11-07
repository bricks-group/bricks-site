// TRESA safeguard: every agent listing-media booking names the agent, their
// email and their brokerage, so the public listing page can identify the
// brokerage as the advertiser (O. Reg. 567/05 s.12.1). Commercial, builder and
// Site Progress bookings don't go through this check.
export function agentIdentityError(body: Record<string, unknown>): string | null {
  const s = (k: string) => (body[k] == null ? '' : String(body[k])).trim()
  if (!s('agent_name')) return 'agent_name is required'
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(s('email'))) return 'a valid email is required'
  if (!s('brokerage')) return 'brokerage is required'
  return null
}
