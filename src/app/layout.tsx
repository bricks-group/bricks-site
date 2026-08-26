import type { Metadata } from 'next'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.brxs.ca'),
  title: {
    default: 'Bricks — GTA Real Estate Photography & Media',
    template: '%s',
  },
  description: 'GTA real estate listing media — HDR photography, licensed drone, floor plans, and 3D virtual tours. Book a shoot in 24–48h.',
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
        <meta name="theme-color" content="#D2542B" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var r=document.documentElement,s="bricks-theme",v=localStorage.getItem(s);if(v)r.setAttribute("data-theme",v);else if(window.matchMedia&&window.matchMedia("(prefers-color-scheme:dark)").matches)r.setAttribute("data-theme","dark")})()`,
          }}
        />
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
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