/** Anonymous day counts only. No session, cookie or persistent visitor data. */
export type AvailabilityRead = { source?: string; days?: { date: string; available: boolean; open?: number; reason?: string }[] }
const reads = new Map<string, { at: number; promise: Promise<AvailabilityRead> }>()

export function readAvailability(url: string, fetcher: typeof fetch = fetch, now = Date.now()): Promise<AvailabilityRead> {
  const previous = reads.get(url)
  if (previous && now - previous.at < 60_000) return previous.promise
  if (reads.size >= 32) reads.delete(reads.keys().next().value!)
  const entry = { at: now, promise: null as unknown as Promise<AvailabilityRead> }
  entry.promise = fetcher(url, { credentials: 'omit' })
    .then(async r => {
      if (!r.ok) throw new Error('Availability unavailable')
      const data = await r.json() as AvailabilityRead
      if (data.source !== 'live' || !Array.isArray(data.days)) {
        if (reads.get(url) === entry) reads.delete(url)
      }
      return data
    })
    .catch(error => { if (reads.get(url) === entry) reads.delete(url); throw error })
  reads.set(url, entry)
  return entry.promise
}
