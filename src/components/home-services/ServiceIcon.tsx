import type { TradeIcon } from '@/lib/services'

/** Thin 1.5px line icons for the home services. No fills, no gradients. */
const PATHS: Record<TradeIcon, string> = {
  staging: 'M5 11V8a2 2 0 012-2h10a2 2 0 012 2v3M3 11h4v4h10v-4h4v7H3zM5 18v2M19 18v2',
  cleaning: 'M7 10h10l-1.2 11H8.2zM9.5 10V6h5v4M12 6V3M4 4l2 2M20 4l-2 2M3 9h2M19 9h2',
  inspection: 'M6 4h12v17H6zM9 4V2.5h6V4M10.5 15a3 3 0 100-6 3 3 0 000 6zM12.6 14.1L15.5 17',
  measure: 'M3 16L16 3l5 5L8 21zM7 12l2 2M10 9l2 2M13 6l2 2M5.5 14.5l1 1M8.5 11.5l1 1',
  repairs: 'M14.5 3.5l6 6-2.5 2.5-6-6zM13.2 7.8L4 17l3 3 9.2-9.2',
}

export default function ServiceIcon({ name, size = 24 }: { name: TradeIcon; size?: number }) {
  return (
    <svg className="hs-ico" width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d={PATHS[name]} stroke="currentColor" strokeWidth="1.5" strokeLinejoin="miter" strokeLinecap="square" />
    </svg>
  )
}
