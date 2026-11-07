'use server'
import { cookies, headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { supportDb } from '@/lib/support/db'
import { adminSecret, signAdminToken, verifyAdminToken } from '@/lib/support/alert'
import { sendEmailCode, signInWithEmailCode, signInWithPassword, type SigninResult } from '@/lib/support/account-signin'
import { clientKey, limited } from '@/lib/support/rate-limit'
import { resendSender } from '@/lib/support/inbound'

export async function isAdmin(): Promise<boolean> {
  const c = (await cookies()).get(ADMIN_COOKIE)?.value
  return verifyAdminToken(adminSecret(), c)
}

const ADMIN_COOKIE = 'bricks_support_admin'
const EMAIL_COOKIE = 'bricks_support_signin_email'
const SESSION_DAYS = 7

async function tooMany(scope: string): Promise<boolean> {
  const h = await headers()
  const ip = (h.get('x-forwarded-for') || '').split(',')[0].trim() || h.get('x-real-ip') || 'unknown'
  return limited(supportDb(), clientKey(`support-signin:${scope}`, ip), { windowSec: 600, max: 8 })
}

/** Same signed cookie the alert-email link sets, so every admin check stays one code path. */
async function finish(r: SigninResult): Promise<never> {
  const secret = adminSecret()
  if (!r.ok || !secret) redirect(`/admin/support?e=${!secret ? 'config' : r.ok ? 'config' : r.reason}`)
  const c = await cookies()
  c.set(ADMIN_COOKIE, signAdminToken(secret, Math.floor(Date.now() / 1000) + SESSION_DAYS * 86400), { httpOnly: true, secure: true, sameSite: 'lax', path: '/admin', maxAge: SESSION_DAYS * 86400 })
  c.delete({ name: EMAIL_COOKIE, path: '/admin' })
  redirect('/admin/support')
}

export async function signInPassword(form: FormData) {
  if (await tooMany('password')) redirect('/admin/support?e=busy')
  await finish(await signInWithPassword(String(form.get('email') || ''), String(form.get('password') || '')))
}

export async function requestCode(form: FormData) {
  if (await tooMany('code')) redirect('/admin/support?e=busy')
  const email = String(form.get('email') || '').trim().toLowerCase()
  await sendEmailCode(email)
  ;(await cookies()).set(EMAIL_COOKIE, email.slice(0, 254), { httpOnly: true, secure: true, sameSite: 'lax', path: '/admin', maxAge: 15 * 60 })
  // Same answer whether or not the account exists.
  redirect('/admin/support?e=sent')
}

export async function signInCode(form: FormData) {
  if (await tooMany('verify')) redirect('/admin/support?e=busy')
  const email = (await cookies()).get(EMAIL_COOKIE)?.value || String(form.get('email') || '')
  await finish(await signInWithEmailCode(email, String(form.get('code') || '')))
}

export async function signOut() {
  const c = await cookies()
  c.delete({ name: ADMIN_COOKIE, path: '/admin' })
  redirect('/admin/support')
}

export async function pendingCodeEmail(): Promise<string> {
  return (await cookies()).get(EMAIL_COOKIE)?.value || ''
}

/** Kam approves one draft: sends exactly this reply as help@brxs.ca via the existing outbound path. */
export async function approveAndSend(form: FormData) {
  if (!(await isAdmin())) throw new Error('unauthorized')
  const id = String(form.get('id') || '')
  const body = String(form.get('body') || '').trim()
  const db = supportDb()
  if (!db || !id || !body) throw new Error('bad request')
  const r = await db.select('support_email_outbound', `id=eq.${encodeURIComponent(id)}&select=id,status,to_email,subject,body_text,idempotency_key,ops_escalation_id,support_email_messages!support_email_outbound_inbound_message_id_fkey(rfc_message_id)`)
  const row = r.rows[0]
  if (!row || row.status !== 'shadow') throw new Error('draft is not pending')
  const send = resendSender()
  if (!send) throw new Error('sender not configured')
  const msg = row.support_email_messages as { rfc_message_id?: string } | null
  // Claim first so a double click can't send twice.
  const claim = await db.update('support_email_outbound', { id, status: 'shadow' }, { status: 'queued', mode: 'manual', body_text: body, edited: body !== String(row.body_text), reviewed_at: new Date().toISOString() })
  if (!claim.ok) throw new Error('claim failed')
  try {
    const sent = await send({ to: String(row.to_email), subject: String(row.subject), text: body, inReplyTo: msg?.rfc_message_id ?? '', idempotencyKey: `manual:${row.idempotency_key}` })
    await db.update('support_email_outbound', { id }, { status: 'sent', provider_message_id: sent.id, sent_at: new Date().toISOString(), attempts: 1 })
    if (row.ops_escalation_id) await db.update('ops_escalations', { id: String(row.ops_escalation_id) }, { status: 'resolved' })
  } catch (e) {
    await db.update('support_email_outbound', { id }, { status: 'failed', last_error: e instanceof Error ? e.message : 'send_failed' })
  }
  revalidatePath('/admin/support')
}

export async function dismiss(form: FormData) {
  if (!(await isAdmin())) throw new Error('unauthorized')
  const id = String(form.get('id') || '')
  const db = supportDb()
  if (!db || !id) throw new Error('bad request')
  const r = await db.select('support_email_outbound', `id=eq.${encodeURIComponent(id)}&select=ops_escalation_id`)
  await db.update('support_email_outbound', { id, status: 'shadow' }, { status: 'cancelled', reviewed_at: new Date().toISOString() })
  const ops = r.rows[0]?.ops_escalation_id
  if (ops) await db.update('ops_escalations', { id: String(ops) }, { status: 'dismissed' })
  revalidatePath('/admin/support')
}
