import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    // Allow q=90 for listing photos. Default Next 16 only permits 75, which softens
    // gallery and showcase shots. Prefer static picture/srcset for new photos to
    // stay off the Vercel image-transform quota when we can.
    qualities: [75, 90],
    remotePatterns: [
      { protocol: 'https', hostname: 'rbywjnnctjglhcdemnnj.supabase.co' },
      { protocol: 'https', hostname: 'images.brxs.ca' },
    ],
  },
  async headers() {
    // The sign-up pop-ups in the other Bricks apps read these public documents
    // cross-origin, so the text has one source. Public pages, no credentials.
    const legalCors = [
      { key: 'Access-Control-Allow-Origin', value: '*' },
      { key: 'Access-Control-Allow-Methods', value: 'GET, HEAD, OPTIONS' },
    ]
    return [
      // Hashed self-hosted media (content-addressed filenames).
      { source: '/media/v/:path*', headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }] },
      // Only fingerprinted assets are immutable. Stable URLs stay refreshable.
      ...['/media/:path*', '/assets/:path*', '/screens/:path*', '/fonts/:path*'].map(source => ({
        source,
        headers: [{ key: 'Cache-Control', value: 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400' }],
      })),
      ...['/fonts/GeneralSans-Medium.0168813e5da4.woff2', '/fonts/GeneralSans-Regular.1336dc613744.woff2', '/fonts/GeneralSans-Semibold.225c2c18bd1c.woff2', '/fonts/JetBrainsMono-Medium.086c48dfbea9.woff2', '/fonts/JetBrainsMono-Regular.a9cb1cd82332.woff2', '/fonts/fonts.34eb12ef4704.css'].map(source => ({
        source,
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      })),
      { source: '/terms', headers: legalCors },
      { source: '/privacy', headers: legalCors },
      { source: '/legal/ic-agreement.txt', headers: legalCors },
      {
        source: '/.well-known/apple-developer-merchantid-domain-association',
        headers: [
          { key: 'Content-Type', value: 'application/octet-stream' },
        ],
      },
      {
        source: '/.well-known/bimi/bricks.svg',
        headers: [
          { key: 'Content-Type', value: 'image/svg+xml' },
          { key: 'Cache-Control', value: 'public, max-age=86400' },
        ],
      },
      {
        source: '/bimi/bricks.svg',
        headers: [
          { key: 'Content-Type', value: 'image/svg+xml' },
          { key: 'Cache-Control', value: 'public, max-age=86400' },
        ],
      },
    ]
  },
  async redirects() {
    return [
      // booking.brxs.ca is the old booking address; send every path to the booking page.
      { source: '/:path*', has: [{ type: 'host', value: 'booking.brxs.ca' }], destination: 'https://www.brxs.ca/book', permanent: false },
      // Home services share one page; the old per-trade addresses land on their section.
      ...['staging', 'cleaning', 'inspections', 'measurement', 'repairs'].map((t) => ({ source: `/${t}`, destination: `/services#${t}`, permanent: true })),
      { source: '/index.html', destination: '/', permanent: true },
      { source: '/help/photographers/no-show-trip-fee', destination: '/help/photographers/if-you-cant-get-in', permanent: true },
      { source: '/photographers/no-show-trip-fee', has: [{ type: 'host', value: 'help.brxs.ca' }], destination: '/photographers/if-you-cant-get-in', permanent: true },
      // Land on the help hub in one hop (www /help itself 308s to help.brxs.ca).
      { source: '/support', destination: 'https://help.brxs.ca/', permanent: true },
      { source: '/faq', destination: 'https://help.brxs.ca/', permanent: true },
      { source: '/faqs', destination: 'https://help.brxs.ca/', permanent: true },
      { source: '/about.html', destination: '/about', permanent: true },
      { source: '/contact.html', destination: '/contact', permanent: true },
      { source: '/pricing.html', destination: '/pricing', permanent: true },
      { source: '/book.html', destination: '/book', permanent: true },
      { source: '/gallery.html', destination: '/gallery', permanent: true },
      { source: '/service-areas.html', destination: '/service-areas', permanent: true },
      { source: '/terms.html', destination: '/terms', permanent: true },
      { source: '/privacy.html', destination: '/privacy', permanent: true },
      { source: '/blog.html', destination: '/blog', permanent: true },
      { source: '/photographers.html', destination: '/photographers', permanent: true },
      { source: '/vendors.html', destination: '/photographers', permanent: true },
      // Marketing-only: do not run on help.brxs.ca (help collections live at the host root).
      { source: '/office', has: [{ type: 'host', value: 'www.brxs.ca' }], destination: '/brokerage', permanent: true },
      { source: '/office', has: [{ type: 'host', value: 'brxs.ca' }], destination: 'https://www.brxs.ca/brokerage', permanent: true },
      { source: '/office.html', has: [{ type: 'host', value: 'www.brxs.ca' }], destination: '/brokerage', permanent: true },
      { source: '/office.html', has: [{ type: 'host', value: 'brxs.ca' }], destination: 'https://www.brxs.ca/brokerage', permanent: true },
      { source: '/blog/gta-real-estate-media-cost-2026.html', destination: '/blog/gta-real-estate-media-cost-2026', permanent: true },
      { source: '/blog/3d-tour-vs-video-walkthrough.html', destination: '/blog/3d-tour-vs-video-walkthrough', permanent: true },
      { source: '/blog/drone-photography-rules-ontario.html', destination: '/blog/drone-photography-rules-ontario', permanent: true },
      { source: '/blog/whats-included-listing-shoot.html', destination: '/blog/whats-included-listing-shoot', permanent: true },
      { source: '/photography', destination: '/real-estate-photography', permanent: true },
      { source: '/listing-photos', destination: '/real-estate-photography', permanent: true },
      { source: '/listing-photos/', destination: '/real-estate-photography', permanent: true },
      { source: '/blog/canada-real-estate-photography-cost-2026.html', destination: '/blog/canada-real-estate-photography-cost-2026', permanent: true },
      // Retired bricks-site routes → prelaunch equivalents (do not resurrect Vendor OS).
      { source: '/vendors', destination: '/photographers', permanent: true },
      { source: '/apply', destination: '/photographers', permanent: true },
      { source: '/apply.html', destination: '/photographers', permanent: true },
      // Marketing plural → singular. Host-scoped so help.brxs.ca/brokerages stays the help collection.
      { source: '/brokerages', has: [{ type: 'host', value: 'www.brxs.ca' }], destination: '/brokerage', permanent: true },
      { source: '/brokerages', has: [{ type: 'host', value: 'brxs.ca' }], destination: 'https://www.brxs.ca/brokerage', permanent: true },
      { source: '/brokerages.html', has: [{ type: 'host', value: 'www.brxs.ca' }], destination: '/brokerage', permanent: true },
      { source: '/brokerages.html', has: [{ type: 'host', value: 'brxs.ca' }], destination: 'https://www.brxs.ca/brokerage', permanent: true },
      // Retired aerial landing → current drone page (Google still has /aerial links).
      { source: '/aerial', destination: '/drone-photography', permanent: true },
      { source: '/aerial/', destination: '/drone-photography', permanent: true },
      { source: '/work', destination: '/gallery', permanent: true },
      { source: '/work.html', destination: '/gallery', permanent: true },
      { source: '/subscription', destination: '/pricing', permanent: true },
      { source: '/pricing-site', destination: '/pricing', permanent: true },
      { source: '/how', destination: '/', permanent: true },
      { source: '/how.html', destination: '/', permanent: true },
      { source: '/platform.html', destination: '/platform', permanent: true },
      { source: '/customers', destination: '/about', permanent: true },
      { source: '/customers.html', destination: '/about', permanent: true },
      { source: '/savings-calculator', destination: '/pricing', permanent: true },
      { source: '/login', destination: 'https://app.brxs.ca/login', permanent: false },
      { source: '/sign-in', destination: 'https://app.brxs.ca/login', permanent: false },
      { source: '/register', destination: 'https://app.brxs.ca/login?mode=register', permanent: false },
      { source: '/signup', destination: 'https://app.brxs.ca', permanent: false },
      { source: '/confirm-signup', destination: 'https://app.brxs.ca', permanent: false },
      { source: '/contractor', destination: '/legal/ic-agreement.txt', permanent: true },
      { source: '/contractor.html', destination: '/legal/ic-agreement.txt', permanent: true },
      { source: '/dpa.html', destination: '/dpa', permanent: true },
      { source: '/construction.html', destination: '/construction', permanent: true },
    ]
  },
}

export default nextConfig
