/**
 * Runtime flags for the help assistant. Everything defaults to OFF.
 *
 *   HELP_CHAT_ENABLED=true        kill switch; anything else hides the widget and 503s the API
 *   HELP_CHAT_MODE=model|extract  model needs an approved provider; extract quotes articles, no model
 *   AI_GATEWAY_API_KEY            Vercel AI Gateway key (approved provider). Not set as of 2026-11-07.
 *   HELP_CHAT_MODEL               gateway model id, e.g. openai/gpt-4o-mini
 */
import type { ModelFn } from './answer'

type Env = Record<string, string | undefined>

export type ChatStatus =
  | { enabled: true; mode: 'model' | 'extract' }
  | { enabled: false; reason: 'kill_switch' | 'no_provider' }

export function chatStatus(env: Env = process.env): ChatStatus {
  if ((env.HELP_CHAT_ENABLED || '').trim() !== 'true') return { enabled: false, reason: 'kill_switch' }
  const mode = (env.HELP_CHAT_MODE || 'model').trim()
  if (mode === 'extract') return { enabled: true, mode: 'extract' }
  if (!providerConfigured(env)) return { enabled: false, reason: 'no_provider' }
  return { enabled: true, mode: 'model' }
}

export function providerConfigured(env: Env = process.env): boolean {
  return Boolean((env.AI_GATEWAY_API_KEY || '').trim() && (env.HELP_CHAT_MODEL || '').trim())
}

export function gatewayModel(env: Env = process.env, fetchImpl: typeof fetch = fetch): ModelFn | null {
  const key = (env.AI_GATEWAY_API_KEY || '').trim()
  const model = (env.HELP_CHAT_MODEL || '').trim()
  if (!key || !model) return null
  return async ({ system, data }) => {
    const ctrl = new AbortController()
    const t = setTimeout(() => ctrl.abort(), 12_000)
    try {
      const r = await fetchImpl('https://ai-gateway.vercel.sh/v1/chat/completions', {
        method: 'POST',
        signal: ctrl.signal,
        headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          temperature: 0,
          max_tokens: 400,
          messages: [
            { role: 'system', content: system },
            { role: 'user', content: data },
          ],
        }),
      })
      if (!r.ok) throw new Error(`gateway_${r.status}`)
      const j = (await r.json()) as { choices?: { message?: { content?: string } }[] }
      return j.choices?.[0]?.message?.content ?? ''
    } finally {
      clearTimeout(t)
    }
  }
}
