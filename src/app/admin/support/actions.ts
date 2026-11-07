'use server'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { supportDb } from '@/lib/support/db'
import { adminSecret, verifyAdminToken } from '@/lib/support/alert'
import { resendSender } from '@/lib/support/inbound'

export async function isAdmin(): Promise<boolean> {
  const c = (await cookies()).get('bricks_support_admin')?.value
  return verifyAdminToken(adminSecret(), c)
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
