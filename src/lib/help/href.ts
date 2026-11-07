/** URLs rendered inside help.brxs.ca (the hub is mounted at /, not /help). */
export function helpHubHref(href: string): string {
  if (/^\/help(?:[/?#]|$)/.test(href)) {
    const path = href.slice(5)
    return path.startsWith('/') ? path : `/${path}`
  }
  // A website-only link must not be rewritten into a help collection.
  if (href.startsWith('/') && !href.startsWith('//')) return `https://www.brxs.ca${href}`
  return href
}
