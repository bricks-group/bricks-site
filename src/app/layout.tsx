import type { Metadata } from 'next'
import Script from 'next/script'
import { headers } from 'next/headers'
import { Analytics } from '@vercel/analytics/next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import SiteBreadcrumbs from '@/components/SiteBreadcrumbs'
import { ORGANIZATION_SCHEMA, WEBSITE_SCHEMA } from '@/lib/schema'
import MotionLayer from '@/components/MotionLayer'
import { AUTH_HEAD_SCRIPT } from '@/lib/site-session'
import { OG_IMAGE } from '@/lib/og'
import './globals.css'
import './map-cutout.css'
import './book/book-wizard.css'
import './motion.css'
import './visual-tokens.css'
import './calm-global.css'

const gated = Boolean(process.env.WWW_SITE_GATE_PASSWORD?.trim())

export const metadata: Metadata = {
  metadataBase: new URL('https://www.brxs.ca'),
  verification: { google: 'HRH8wse2Fuj4diHsacOxRs1HUsIszBNlpoAfTxuC3u4' },
  title: {
    default: gated ? 'bricks' : 'Bricks — the system for Canadian real estate',
    template: '%s',
  },
  description: gated
    ? 'bricks'
    : 'Subscription software for Canadian real estate: builders, developers, investors and realtors, with listing media, Virtual Visit and Site Progress booked inside.',
  icons: { icon: '/favicon.svg' },
  openGraph: {
    type: 'website',
    siteName: 'Bricks',
    locale: 'en_CA',
    images: [OG_IMAGE],
  },
  twitter: { card: 'summary_large_image', images: [OG_IMAGE] },
  ...(gated ? { robots: { index: false, follow: false } } : {}),
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = (await headers()).get('x-bricks-pathname') || ''
  // /gate and the plan visit one-tap page use their own focused chrome.
  const bare = pathname === '/gate' || pathname === '/visit' || pathname.startsWith('/visit/')

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=location.search||'';var h=location.hash||'';var blob=s+h;if(/access_token|refresh_token|[?&#]type=(signup|recovery|invite|magiclink|email)(?:&|$)|[?&#]code=/.test(blob)){location.replace('https://app.brxs.ca/auth/callback'+s+h);}}catch(e){}})();`,
          }}
        />
        <script dangerouslySetInnerHTML={{ __html: AUTH_HEAD_SCRIPT }} />
        <noscript>
          <style>{'.nav-auth-out{visibility:visible !important}'}</style>
        </noscript>
        <meta name="theme-color" content="#F4F1EB" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#141210" media="(prefers-color-scheme: dark)" />
        <link rel="preload" href="/fonts/GeneralSans-Regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/GeneralSans-Medium.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="stylesheet" href="/fonts/fonts.css" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var KEY='bricks-theme';var stored=localStorage.getItem(KEY)||'system';var resolved=stored==='dark'||stored==='light'?stored:(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');var root=document.documentElement;root.setAttribute('data-theme',resolved);root.style.colorScheme=resolved;}catch(e){}})();`,
          }}
        />
      </head>
      <body>
        {bare ? null : <Nav />}
        {bare ? null : <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': [ORGANIZATION_SCHEMA, WEBSITE_SCHEMA] }) }} />}
        {bare ? null : <SiteBreadcrumbs pathname={pathname} />}
        {children}
        {bare ? null : <Footer />}
        {bare ? null : <MotionLayer />}
        <Analytics />
        {bare ? null : <Script src="/assets/protect.js" strategy="afterInteractive" />}
      </body>
    </html>
  )
}
