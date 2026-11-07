'use client'

import { useEffect, useState, type ComponentProps } from 'react'
import Link from 'next/link'

export const SITE_ORIGIN = 'https://www.brxs.ca'

/** True once mounted on the help host (help.brxs.ca), where every path is a help page. */
export function useOnHelpHost(): boolean {
  const [onHelp, setOnHelp] = useState(false)
  useEffect(() => { setOnHelp(window.location.hostname.toLowerCase().startsWith('help.')) }, [])
  return onHelp
}

/**
 * Shared header/footer link. On www it is a normal Next link. On help.brxs.ca a
 * relative site path would stay on the help host (and land on a help page or a
 * 404), so it becomes a plain link to the same page on www.brxs.ca.
 */
export default function SiteLink(props: ComponentProps<typeof Link>) {
  const onHelp = useOnHelpHost()
  const { href, prefetch: _prefetch, replace: _replace, scroll: _scroll, shallow: _shallow, locale: _locale, legacyBehavior: _lb, passHref: _ph, ...rest } = props
  if (onHelp && typeof href === 'string' && href.startsWith('/')) {
    return <a href={SITE_ORIGIN + href} {...rest} />
  }
  return <Link {...props} />
}
