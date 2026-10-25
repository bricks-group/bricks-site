import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'rbywjnnctjglhcdemnnj.supabase.co' },
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
      { source: '/index.html', destination: '/', permanent: true },
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
      { source: '/office', destination: '/brokerage', permanent: true },
      { source: '/office.html', destination: '/brokerage', permanent: true },
      { source: '/blog/gta-real-estate-media-cost-2026.html', destination: '/blog/gta-real-estate-media-cost-2026', permanent: true },
      { source: '/blog/3d-tour-vs-video-walkthrough.html', destination: '/blog/3d-tour-vs-video-walkthrough', permanent: true },
      { source: '/blog/drone-photography-rules-ontario.html', destination: '/blog/drone-photography-rules-ontario', permanent: true },
      { source: '/blog/whats-included-listing-shoot.html', destination: '/blog/whats-included-listing-shoot', permanent: true },
      { source: '/listing-photos', destination: '/real-estate-photography', permanent: true },
      { source: '/listing-photos/', destination: '/real-estate-photography', permanent: true },
      { source: '/blog/canada-real-estate-photography-cost-2026.html', destination: '/blog/canada-real-estate-photography-cost-2026', permanent: true },
      // Retired bricks-site routes → prelaunch equivalents (do not resurrect Vendor OS).
      { source: '/vendors', destination: '/photographers', permanent: true },
      { source: '/apply', destination: '/photographers', permanent: true },
      { source: '/apply.html', destination: '/photographers', permanent: true },
      { source: '/brokerages', destination: '/brokerage', permanent: true },
      { source: '/brokerages.html', destination: '/brokerage', permanent: true },
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
