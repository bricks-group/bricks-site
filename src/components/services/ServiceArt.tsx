import type { ReactElement } from 'react'
import { MARK_BRICKS } from '@/lib/brandMark'

/**
 * Module covers for "Every part, one system." One visual language for all six:
 * 100-unit square, 10-unit hairline grid, ink line at 0.9, hairlines at 0.45, square caps and mitred joins,
 * paper fills, brick (#D2542B via --brick) for the one live accent, and the logo bricks (brandMark.ts) as the recurring motif.
 * Motion (optional): .sa-flow dashes run and .sa-lift accents rise on tile hover / reveal. Reduced motion: static.
 */
export type ArtKind = 'os' | 'media' | 'visit' | 'site' | 'pros' | 'integrations'

/** The logo mark at (x, y), s units wide. tone: 'brick' (filled) | 'ink' (outlined) | 'paper' (filled paper). */
function Mark({ x, y, s, tone = 'brick', className }: { x: number; y: number; s: number; tone?: 'brick' | 'ink' | 'paper'; className?: string }) {
  const k = s / 18 // mark content spans 3..21 → 18 units wide
  return (
    <g className={`sa-mark sa-mark-${tone} ${className ?? ''}`} transform={`translate(${x - 3 * k} ${y - 4 * k}) scale(${k})`} style={{ strokeWidth: 0.9 / k }}>
      {MARK_BRICKS.map((b, i) => (
        <rect key={i} x={b.x} y={b.y} width={b.width} height={b.height} rx={b.rx} fillOpacity={tone === 'brick' ? b.fillOpacity : 1} />
      ))}
    </g>
  )
}

function Grid() {
  const l = [10, 20, 30, 40, 50, 60, 70, 80, 90]
  return (
    <g className="sa-grid">
      {l.map((v) => <path key={`h${v}`} d={`M0 ${v}H100`} />)}
      {l.map((v) => <path key={`v${v}`} d={`M${v} 0V100`} />)}
    </g>
  )
}

function Os() {
  return (
    <>
      <rect className="sa-fill" x="14" y="20" width="72" height="60" />
      <rect x="14" y="20" width="72" height="60" />
      <path d="M14 27H86M30 27V80" />
      <Mark x={17.5} y={22.6} s={4.2} />
      <path className="sa-hair" d="M17 34H26M17 39H24M17 44H26M17 49H22" />
      <rect className="sa-hair" x="35" y="32" width="14" height="10" /><rect className="sa-hair" x="52" y="32" width="14" height="10" /><rect className="sa-hair" x="69" y="32" width="13" height="10" />
      <path d="M38 38.5h6M55 38.5h8M72 38.5h5" />
      {/* deal pipeline: four stages, one deal advancing in brick */}
      <path className="sa-hair" d="M35 50H82M35 58H82M35 66H82M35 74H82" />
      <path d="M35 50h30M35 58h22M35 66h36" />
      <path className="sa-acc sa-lift" d="M35 74h44" />
      <rect className="sa-accfill sa-lift" x="77.5" y="72" width="4" height="4" />
    </>
  )
}

function Media() {
  return (
    <>
      {/* viewfinder over a listing exterior, film strip below */}
      <path d="M16 18h8M16 18v8M84 18h-8M84 18v8M16 66h8M16 66v-8M84 66h-8M84 66v-8" />
      <path className="sa-hair" d="M40 18v48M60 18v48M16 34h68M16 50h68" />
      <path className="sa-fillpath" d="M30 60V44L50 30L70 44V60Z" />
      <path d="M30 60V44L50 30L70 44V60M24 60H76M46 60v-9h8v9" />
      <Mark x={57} y={47} s={7} tone="ink" />
      <rect className="sa-accfill sa-lift" x="74" y="21" width="5" height="5" />
      <rect className="sa-fill" x="14" y="72" width="72" height="12" />
      <path d="M14 72H86M14 84H86M32 72v12M50 72v12M68 72v12" />
      <rect className="sa-accfill" x="50.9" y="74" width="16.2" height="8" />
      <path className="sa-hair" d="M17 74.5h2M23 74.5h2M17 81.5h2M23 81.5h2" />
    </>
  )
}

function Visit() {
  return (
    <>
      {/* one-point wireframe room; the logo bricks are the furniture */}
      <rect className="sa-fill" x="34" y="28" width="32" height="26" />
      <path d="M14 14L34 28H66L86 14M14 86L34 54H66L86 86M34 28V54M66 28V54M14 14V86M86 14V86" />
      <path className="sa-hair" d="M40.4 54L30 86M46.8 54L46 86M53.2 54L54 86M59.6 54L70 86M28 63H72M23 71H77M18 79H82" />
      <path className="sa-hair" d="M14 14L34 28M86 14L66 28" />
      <rect className="sa-hair" x="70" y="34" width="6" height="14" />
      <g className="sa-lift"><Mark x={41} y={60} s={18} /></g>
      <path className="sa-acc sa-flow" d="M26 92H74" strokeDasharray="2 2.5" />
      <path className="sa-acc" d="M71 89.5L74 92L71 94.5" />
    </>
  )
}

function Site() {
  return (
    <>
      {/* parcel, footprints from the logo bricks, drone survey path in brick */}
      <path className="sa-fillpath" d="M18 22H78L84 78H22Z" />
      <path d="M18 22H78L84 78H22Z" />
      <Mark x={36} y={36} s={30} tone="ink" />
      <path className="sa-acc sa-flow" d="M24 28H76V38H25V48H78V58H26V68H80" strokeDasharray="2.2 2" />
      <rect className="sa-accfill sa-lift" x="78" y="66" width="5" height="5" />
      <path className="sa-hair" d="M18 88H84M18 86v4M84 86v4M51 86v4" />
      <path className="sa-hair" d="M90 22V78M88 22h4M88 78h4" />
    </>
  )
}

function Pros() {
  return (
    <>
      {/* dispatch: three photographers, one job, one assigned route */}
      <path className="sa-hair" d="M12 64L40 40L88 30M30 86L52 58L80 82M12 30L52 58" />
      <path className="sa-hair sa-flow" d="M24 26L44 48" strokeDasharray="1.6 2" />
      <path className="sa-hair sa-flow" d="M78 74L58 58" strokeDasharray="1.6 2" />
      <path className="sa-acc sa-flow" d="M20 74H36V58H46" strokeDasharray="2.2 2" />
      {[[24, 26], [78, 74], [20, 74]].map(([x, y]) => (
        <g key={`${x}`}><rect className="sa-fill" x={x - 4} y={y - 4} width="8" height="8" /><rect x={x - 4} y={y - 4} width="8" height="8" /><path d={`M${x - 2} ${y + 1.5}h4M${x - 1} ${y - 1.5}h2`} /></g>
      ))}
      <rect className="sa-accfill" x="16" y="70" width="8" height="8" />
      <path className="sa-paperline" d="M18 75.5h4M19 72.5h2" />
      <g className="sa-lift">
        <path className="sa-accfill" d="M44 40H64V60H58L54 66L50 60H44Z" />
        <Mark x={48.4} y={45} s={11.2} tone="paper" />
      </g>
    </>
  )
}

function Integrations() {
  return (
    <>
      {/* the system at the centre, four feeds wired in on the grid */}
      <path d="M50 28V40M50 60V72M28 50H40M60 50H72" />
      <path className="sa-hair" d="M20 20H80V80H20Z" />
      {[[50, 20], [50, 80], [20, 50], [80, 50]].map(([x, y]) => (
        <g key={`${x}-${y}`}><rect className="sa-fill" x={x - 8} y={y - 8} width="16" height="16" /><rect x={x - 8} y={y - 8} width="16" height="16" /></g>
      ))}
      <path d="M45 22L50 17.5L55 22V24.5H45Z" />{/* MLS: listing */}
      <path d="M44 76H56V85H44ZM44 79H56M48 76V74M52 76V74" />{/* calendar */}
      <path d="M14 46.5H26V53.5H14ZM14 49H26" />{/* payments */}
      <path d="M74 53L84 47M74 53.5h3" />{/* e-sign */}
      <rect className="sa-fill" x="40" y="40" width="20" height="20" />
      <rect x="40" y="40" width="20" height="20" />
      <Mark x={43.6} y={44.4} s={12.8} />
      <rect className="sa-accfill sa-pk sa-pk1" x="48.6" y="31" width="2.8" height="2.8" />
      <rect className="sa-accfill sa-pk sa-pk2" x="64" y="48.6" width="2.8" height="2.8" />
      <rect className="sa-accfill sa-pk sa-pk3" x="48.6" y="64" width="2.8" height="2.8" />
      <rect className="sa-accfill sa-pk sa-pk4" x="31" y="48.6" width="2.8" height="2.8" />
    </>
  )
}

const ART: Record<ArtKind, () => ReactElement> = { os: Os, media: Media, visit: Visit, site: Site, pros: Pros, integrations: Integrations }

export default function ServiceArt({ kind }: { kind: ArtKind }) {
  const A = ART[kind]
  return (
    <svg className={`sa sa-${kind}`} viewBox="0 0 100 100" aria-hidden="true" shapeRendering="geometricPrecision">
      <Grid />
      <A />
    </svg>
  )
}
