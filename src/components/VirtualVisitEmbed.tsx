'use client'

import { useState } from 'react'

/** Live SuperSplat free-roam embed — same capture as old bricks-site homepage. */
const SPLAT_EMBED_SRC = 'https://superspl.at/s?id=283a2ab0'
const SPLAT_GIF =
  'https://rbywjnnctjglhcdemnnj.supabase.co/storage/v1/object/public/BRX%20Images/GaussianSplatRender.gif'

export default function VirtualVisitEmbed() {
  const [loaded, setLoaded] = useState(false)

  return (
    <div className="visit-embed">
      {!loaded ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="visit-embed-fallback" src={SPLAT_GIF} alt="" aria-hidden />
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
