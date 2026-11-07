/**
 * Guard rules for the help assistant and the help@ inbound classifier.
 * Rules run BEFORE retrieval or any model call, so a model can never talk its
 * way past them. The assistant explains published policy only; anything that
 * needs a person (money, account-specific, legal, privacy, security, or a
 * request to change a booking) is escalated with the visitor's consent.
 */

export type EscalationReason =
  | 'refund' | 'cancellation_change' | 'money' | 'account_specific' | 'legal' | 'privacy' | 'security' | 'complaint' | 'human_requested'

const RULES: { reason: EscalationReason; re: RegExp }[] = [
  // Requests to get money back or dispute a charge (asking how refunds work is policy and is answered).
  { reason: 'refund', re: /\b(i|we)\b[^.?!]{0,40}\b(want|need|would like|request(ing)?|get|expect(ing)?|demand|owed)\b[^.?!]{0,30}\b(refund|money back|reimburse)|\brefund (me|my|us|our)\b|\bwhere('?s| is) my refund\b|\bhaven'?t (got|received) (my|the) refund\b|\bchargeback\b|\bdispute (a|the|my) charge\b/i },
  // Asking us to change a booking or plan (not asking what the rules are).
  { reason: 'cancellation_change', re: /\b(please |can you |could you |i want to |i need to |i'?d like to |help me )(cancel|reschedule|move|change|postpone|rebook)\b|\bcancel (my|our|the) (booking|shoot|order|plan|subscription|appointment)\b|\breschedule (my|our) \b/i },
  { reason: 'money', re: /\b(charged (me )?twice|double charged|overcharged|wrong (amount|charge|price)|unauthori[sz]ed (charge|payment)|billing (error|issue|problem)|my (invoice|payment|card|payout)s?\b|compensat(e|ion)|discount for me|credit (me|my account)|price match)/i },
  { reason: 'account_specific', re: /\b(my|our) (account|booking|order|shoot|listing|photos|media|subscription|plan|team|brokerage|payout|job|appointment)\b[^\n]{0,80}\b(status|missing|wrong|not|hasn'?t|still|late|check|look up|change|update)|\bwhere('?s| is| are) (my|our)\b|\bbooking (id|number|#|ref)|\border (id|number|#)\b|\b(look up|check on|find) (my|our)\b/i },
  { reason: 'legal', re: /\b(lawyer|attorney|legal action|lawsuit|sue|suing|small claims|court|liabilit(y|ies)|negligen|breach of contract|cease and desist|copyright (claim|infringement)|dmca|indemn)/i },
  { reason: 'privacy', re: /\b(delete (my|all my|our) (data|information|info|account|photos)|my (personal )?(data|information)|access request|data request|pipeda|gdpr|ccpa|erase|right to be forgotten|who has (my|access)|share(d)? my (data|info))/i },
  { reason: 'security', re: /\b(hack(ed)?|breach|compromis|phish|scam|fraud|stolen|suspicious (login|email|activity)|someone (else )?(logged|signed) in|2fa|two.factor|vulnerab|exploit|leak(ed)?)\b/i },
  { reason: 'complaint', re: /\b(complain(t)?|unacceptable|terrible service|ruined|damage(d)? (my|our|the) (property|home|house|floor)|injur|harass|unsafe|furious|angry)\b/i },
  { reason: 'human_requested', re: /\b(speak|talk|chat) (to|with) (a |an )?(human|person|someone|agent|representative|real person|kam|staff|support)\b|\b(human|real person) please\b|\bescalate\b/i },
]

export function escalationReasons(text: string): EscalationReason[] {
  const out: EscalationReason[] = []
  for (const r of RULES) if (r.re.test(text)) out.push(r.reason)
  return out
}

/** Prompt-injection and system-probing patterns. Matched text is never sent to a model. */
const INJECTION = [
  /\b(ignore|disregard|forget|override|bypass)\b[^.?!]{0,40}\b(previous|prior|above|earlier|all|your|the|these|system|safety)\b[^.?!]{0,30}\b(instruction|prompt|rule|guideline|polic|direction)/i,
  /\b(system|developer|hidden|initial|original) (prompt|message|instruction)s?\b/i,
  /\byou are (now|no longer)\b|\bact as\b|\bpretend (to be|you)\b|\brole.?play\b|\bjailbreak\b|\bdan mode\b|\bdeveloper mode\b/i,
  /\b(reveal|print|show|repeat|output|leak)\b[^.?!]{0,30}\b(prompt|instructions|rules|context|api key|secret|token|env)/i,
  /<\|?(system|im_start|im_end|assistant)\|?>|\[\/?(system|inst)\]|^\s*(system|assistant)\s*:/im,
  /\bnew instructions?\b|\bfrom now on\b[^.?!]{0,40}\b(you|answer|respond|reply)\b/i,
]

export function looksLikeInjection(text: string): boolean {
  return INJECTION.some((re) => re.test(text))
}

/** Replies must not claim Bricks did something; the assistant can only explain. */
const ACTION_CLAIM = /\b(i|we)('ve| have|'ll| will)?\s+(just\s+)?(cancel(l)?ed|refunded|rescheduled|booked|changed|updated|deleted|processed|issued|credited|moved|confirmed|reset|sent|escalated your refund|approved)\b|\byour (refund|booking|cancellation|reschedule|change|account deletion) (has been|is) (processed|issued|approved|confirmed|done|complete)/i

export function claimsAction(text: string): boolean {
  return ACTION_CLAIM.test(text)
}

export const MAX_QUESTION_CHARS = 600

export function cleanQuestion(raw: unknown): string {
  if (typeof raw !== 'string') return ''
  // Strip control characters and zero-width/bidi characters often used to hide instructions.
  return raw.replace(/[\u0000-\u0008\u000B-\u001F\u007F\u200B-\u200F\u202A-\u202E\u2060-\u2064\uFEFF]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, MAX_QUESTION_CHARS)
}
