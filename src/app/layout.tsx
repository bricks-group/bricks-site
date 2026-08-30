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
        <style>{`
          @font-face { font-family:'General Sans'; src:url('/fonts/GeneralSans-Regular.woff2') format('woff2'); font-weight:400; font-display:swap; }
          @font-face { font-family:'General Sans'; src:url('/fonts/GeneralSans-Medium.woff2') format('woff2'); font-weight:500; font-display:swap; }
          @font-face { font-family:'General Sans'; src:url('/fonts/GeneralSans-Semibold.woff2') format('woff2'); font-weight:600; font-display:swap; }
          @font-face { font-family:'Ioskeley Mono'; src:url('/fonts/IoskeleyMono-Regular.woff2') format('woff2'); font-weight:400; font-display:swap; }
          @font-face { font-family:'Ioskeley Mono'; src:url('/fonts/IoskeleyMono-Medium.woff2') format('woff2'); font-weight:500; font-display:swap; }
          @font-face { font-family:'Ioskeley Mono'; src:url('/fonts/IoskeleyMono-Bold.woff2') format('woff2'); font-weight:700; font-display:swap; }
        `}</style>
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