import type { Metadata } from 'next'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import './globals.css'
import './map-cutout.css'
import './book/book-wizard.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.brxs.ca'),
  title: {
    default: 'Bricks — Canadian Real Estate Photography & Media',
    template: '%s',
  },
  description: 'Listing media for Canadian real estate — HDR photography, licensed drone, floor plans, with optional virtual tour and virtual visit. Book a shoot in 24–48h.',
  icons: { icon: '/favicon.svg' },
  openGraph: {
    type: 'website',
    siteName: 'Bricks',
    locale: 'en_CA',
  },
  twitter: { card: 'summary_large_image' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var KEY='bricks-theme';var stored=localStorage.getItem(KEY)||'system';var resolved=stored==='dark'||stored==='light'?stored:(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');var root=document.documentElement;root.setAttribute('data-theme',resolved);root.style.colorScheme=resolved;}catch(e){}})();`,
          }}
        />
      </head>
      <body>
        <Nav />
        {children}
        <Footer />
        <Analytics />
        <Script src="/assets/protect.js" strategy="afterInteractive" />
      </body>
    </html>
  )
}
