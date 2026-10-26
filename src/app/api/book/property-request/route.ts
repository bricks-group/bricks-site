import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAnonKey, getSupabasePublicUrl } from '@/lib/supabase-public'
import { sendContactMessage } from '@/lib/contact-mail'
import { CLIENT_LABEL, SERVICES_FOR, isPropertyClient } from '@/lib/clientServices'

/**
 * Property request from /book/property. Public like the rest of /api/book so it
 * works while the marketing gate is on (/api/contact stays gated). Only known
 * client types and service keys are accepted; the message goes to the same
 * contact inbox, and nothing is booked or charged.
 */
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/
const clip = (v: unknown, n: number) => (typeof v === 'string' ? v.trim().slice(0, n) : '')

export async function POST(req: NextRequest) {
  const url = getSupabasePublicUrl()
  const key = getSupabaseAnonKey()
  if (!process.env.RESEND_API_KEY && (!url || !key)) return NextResponse.json({ ok: false, error: 'Requests are unavailable right now. Email help@brxs.ca.' }, { status: 503 })

  let b: Record<string, unknown>
  try { b = await req.json() } catch { return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 }) }
  if (clip(b.website, 200)) return NextResponse.json({ ok: true }) // honeypot

  const kind = clip(b.kind, 40)
  const name = clip(b.name, 120)
  const email = clip(b.email, 254)
  const address = clip(b.address, 300)
  if (!isPropertyClient(kind)) return NextResponse.json({ ok: false, error: 'Pick who it’s for.' }, { status: 400 })
  if (!name || !EMAIL_RE.test(email)) return NextResponse.json({ ok: false, error: 'Add your name and a valid email.' }, { status: 400 })
  if (!address) return NextResponse.json({ ok: false, error: 'Add the property address.' }, { status: 400 })
  const keys = Array.isArray(b.services) ? b.services.map((x) => clip(x, 60)) : []
  const services = SERVICES_FOR[kind].filter((s) => keys.includes(s.key))
  if (!services.length) return NextResponse.json({ ok: false, error: 'Pick at least one service.' }, { status: 400 })

  const message = [
    `Property request (${CLIENT_LABEL[kind]})`,
    `Services: ${services.map((s) => `${s.name} [${s.key}]`).join(', ')}`,
    `Address: ${address}`,
    clip(b.company, 160) && `Company: ${clip(b.company, 160)}`,
    clip(b.phone, 40) && `Phone: ${clip(b.phone, 40)}`,
    clip(b.units, 40) && `Units or spaces: ${clip(b.units, 40)}`,
    clip(b.size, 40) && `Size (sq ft): ${clip(b.size, 40)}`,
    clip(b.notes, 2000) && `Notes: ${clip(b.notes, 2000)}`,
  ].filter(Boolean).join('\n')

  const sent = await sendContactMessage({ name, email, message }, { sourceLabel: 'the Bricks /book/property request form', supabaseUrl: url, supabaseKey: key })
  if (!sent.ok) return NextResponse.json({ ok: false, error: 'Could not send. Email help@brxs.ca.' }, { status: sent.status })
  return NextResponse.json({ ok: true })
}
