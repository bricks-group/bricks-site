import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'ctqwxwrcxwruaqojohpf.supabase.co' },
    ],
  },
  async headers() {
    return [
      {
        source: '/.well-known/apple-developer-merchantid-domain-association',
        headers: [
          { key: 'Content-Type', value: 'application/octet-stream' },
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
    ]
  },
}

export default nextConfig
