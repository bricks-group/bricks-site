import type { Metadata } from 'next'
import Script from 'next/script'
import { headers } from 'next/headers'
import { Analytics } from '@vercel/analytics/next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import './globals.css'
import './map-cutout.css'
import './book/book-wizard.css'

const gated = Boolean(process.env.WWW_SITE_GATE_PASSWORD?.trim())

export const metadata: Metadata = {
  metadataBase: new URL('https://www.brxs.ca'),
  title: {
    default: gated ? 'bricks' : 'Bricks — the system for Canadian real estate',
    template: '%s',
  },
  description: gated
    ? 'bricks'
    : 'The system for Canadian real estate. Media is live to book. OS is live in preview at app.brxs.ca.',
  icons: { icon: '/favicon.svg' },
  openGraph: {
    type: 'website',
    siteName: 'Bricks',
    locale: 'en_CA',
  },
  twitter: { card: 'summary_large_image' },
  ...(gated ? { robots: { index: false, follow: false } } : {}),
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = (await headers()).get('x-bricks-pathname') || ''
  const bare = pathname === '/gate'

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=location.search||'';var h=location.hash||'';var blob=s+h;if(/access_token|refresh_token|[?&#]type=(signup|recovery|invite|magiclink|email)(?:&|$)|[?&#]code=/.test(blob)){location.replace('https://app.brxs.ca/auth/callback'+s+h);}}catch(e){}})();`,
          }}
        />
        <meta name="theme-color" content="#F4F1EB" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#141210" media="(prefers-color-scheme: dark)" />
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var KEY='bricks-theme';var stored=localStorage.getItem(KEY)||'system';var resolved=stored==='dark'||stored==='light'?stored:(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');var root=document.documentElement;root.setAttribute('data-theme',resolved);root.style.colorScheme=resolved;}catch(e){}})();`,
          }}
        />
      </head>
      <body>
        {bare ? null : <Nav />}
        {children}
        {bare ? null : <Footer />}
        <Analytics />
        {bare ? null : <Script src="/assets/protect.js" strategy="afterInteractive" />}
      </body>
    </html>
  )
}
