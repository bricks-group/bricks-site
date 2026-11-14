'use client'

import { useState } from 'react'

/** Live SuperSplat free-roam embed — same capture as old bricks-site homepage. */
const SPLAT_EMBED_SRC = 'https://superspl.at/s?id=283a2ab0'
/** Official scene poster, self-hosted and hashed. The original 10 MB GIF was not on the box. */
const SPLAT_POSTER = '/media/v/visit-poster.bb56847e1311.webp'
const POSTER_W = 960
const POSTER_H = 540

export default function VirtualVisitEmbed() {
  const [loaded, setLoaded] = useState(false)

  return (
    <div className="visit-embed">
      {!loaded ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className="visit-embed-fallback"
          src={SPLAT_POSTER}
          alt="Virtual Visit free-roam 3D walkthrough of a sample home"
          width={POSTER_W}
          height={POSTER_H}
          loading="lazy"
          decoding="async"
        />
      ) : null}
      <iframe
        className="visit-embed-frame"
        style={{ opacity: loaded ? 1 : 0 }}
        src={SPLAT_EMBED_SRC}
        title="Gaussian splat Virtual Visit"
        allow="fullscreen; xr-spatial-tracking"
        allowFullScreen
        loading="lazy"
        onLoad={() => setLoaded(true)}
      />
    </div>
  )
}
