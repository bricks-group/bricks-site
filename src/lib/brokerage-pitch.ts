/**
 * Brokerage pitch, shared by /pricing and /brokerage. Swap the headline here (Kam may pick another).
 * Keep it defensible: no "only", no "no other brokerage", no competitor-office phrasing.
 */
import { OFFICE_SEAT_PRICE_PER_MONTH } from './catalog'
import { stackFor } from './savings'

export const BROKERAGE_PITCH = {
  title: 'Give your agents more than a desk.',
  lede: 'A reason to join. A reason to stay.',
} as const

const seats = Object.values(OFFICE_SEAT_PRICE_PER_MONTH)
export const SEAT_MONTHLY_RANGE = { min: Math.min(...seats), max: Math.max(...seats) }
export const AGENT_STACK_MONTHLY = stackFor('diamond').separate

export const BROKERAGE_PILLARS = [
  { title: 'All of Bricks in every seat', detail: 'CRM, e-sign, forms, media booking and AI, with Virtual Visit tours on request.' },
  { title: 'Oversight', detail: 'Your roster, every deal and listing in one pipeline, and trust accounting.' },
  {
    title: 'Savings',
    detail: `Agents don’t buy their own CRM, e-sign, forms and AI. Bought separately, that’s about $${AGENT_STACK_MONTHLY} a month per agent. A seat is $${SEAT_MONTHLY_RANGE.min} to $${SEAT_MONTHLY_RANGE.max}.`,
  },
  { title: 'Retention', detail: 'The tools agents use every day come with the seat, paid by the office, not by them.' },
] as const
