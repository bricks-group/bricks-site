/**
 * Browser-safe Supabase URL + anon/publishable key.
 * Read ONLY from env — never bake credentials into source.
 */
export function getSupabasePublicUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    ''
  ).replace(/\/$/, '')
}

export function getSupabaseAnonKey(): string {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    ''
  ).trim()
}

export function getSupabaseFunctionsBase(): string {
  const url = getSupabasePublicUrl()
  return url ? `${url}/functions/v1/` : ''
}

export function supabasePublicConfigured(): boolean {
  return Boolean(getSupabasePublicUrl() && getSupabaseAnonKey())
}
