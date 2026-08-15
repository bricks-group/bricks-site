import Link from 'next/link'

export default function Footer() {
  return (
    <footer>
      <div className="foot">
        <div className="fbrand">
          <svg viewBox="0 0 24 24" fill="none" aria-label="Bricks mark" style={{ height: 18, width: 18 }}>
            <rect x="4" y="5" width="11" height="7" rx="1.2" fill="#D2542B" />
            <rect x="4" y="13" width="6" height="7" rx="1.2" fill="#D2542B" />
            <rect x="11" y="13" width="10" height="7" rx="1.2" fill="#D2542B" />
          </svg>
          <span className="wordmark" style={{ fontSize: 15 }}>bricks</span>
        </div>
        <div style={{ display: 'flex', gap: 18, alignItems: 'center', flexWrap: 'wrap', rowGap: 10 }}>
          <a href="mailto:booking@brxs.ca">booking@brxs.ca</a>
          <span className="mono" style={{ fontSize: 11, color: 'var(--inkMute)', whiteSpace: 'nowrap' }}>343-453-4578</span>
          <Link href="/terms">Terms &amp; Privacy</Link>
          <Link href="/blog">Resources</Link>
          <Link href="/service-areas">Service areas</Link>
          <a href="https://share.google/7ttYfc6W7JRwlqA9U" target="_blank" rel="noopener noreferrer">Find us on Google</a>
        </div>
      </div>
      <div className="foot" style={{ borderTop: 'none', paddingTop: 0 }}>
        <span className="dev">Bricks — GTA real estate media. Booking platform in development; media service live today.</span>
      </div>
    </footer>
  )
}
