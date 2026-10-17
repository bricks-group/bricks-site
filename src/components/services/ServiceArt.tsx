import { ICONS, type IconName } from '@/components/icons/icons'
import { MARK_BRICKS } from '@/lib/brandMark'

/**
 * Technical linework for the two software tiles (Bricks, Integrations). Visual system rules:
 * 24-unit grid (viewBox 240 = 10 × 24), 1.5px non-scaling stroke, square caps, mitred joins, no fills,
 * graphite on off-white, no accent (the accent is reserved for state). Glyphs reuse the Bricks icon set.
 */
export type ArtKind = 'os' | 'integrations' | 'pros'

function Glyph({ name, x, y, s = 1 }: { name: IconName; x: number; y: number; s?: number }) {
  return <path d={ICONS[name].d} transform={`translate(${x} ${y}) scale(${s})`} vectorEffect="non-scaling-stroke" />
}
const P = (d: string, c?: string) => <path className={c} d={d} vectorEffect="non-scaling-stroke" />

function Os() {
  return (
    <>
      {P('M24 48H216V204H24ZM24 72H216M72 72V204', 'la-1')}
      {/* sidebar: the modules, drawn with the icon set */}
      <Glyph name="deal" x={36} y={84} /><Glyph name="crm" x={36} y={114} /><Glyph name="calendar" x={36} y={144} /><Glyph name="mls" x={36} y={174} />
      {/* figures row */}
      {P('M90 90H138V126H90ZM144 90H192V126H144ZM90 108H96M144 108H150', 'la-2')}
      {P('M102 108H126M156 108H186', 'la-1')}
      {/* deal pipeline */}
      {P('M90 144H204M90 162H204M90 180H204', 'la-2')}
      {P('M90 144H162M90 162H138M90 180H186', 'la-1')}
      {/* the mark in the window bar */}
      {MARK_BRICKS.map((b, i) => (
        <rect key={i} className="la-1" x={30 + b.x * 0.75} y={54 + b.y * 0.6} width={b.width * 0.75} height={b.height * 0.6} vectorEffect="non-scaling-stroke" />
      ))}
    </>
  )
}

function Integrations() {
  const nodes: [IconName, number, number][] = [['mls', 108, 36], ['deal', 180, 108], ['e-sign', 108, 180], ['crm', 36, 108]]
  return (
    <>
      {P('M120 72V96M120 144V168M72 120H96M144 120H168', 'la-1')}
      {P('M48 48H192V192H48Z', 'la-2')}
      {nodes.map(([n, x, y]) => (
        <g key={n} className="la-1">
          {P(`M${x - 12} ${y - 12}H${x + 36}V${y + 36}H${x - 12}Z`)}
          <Glyph name={n} x={x} y={y} />
        </g>
      ))}
      {P('M96 96H144V144H96Z', 'la-1')}
      {MARK_BRICKS.map((b, i) => (
        <rect key={i} className="la-1" x={98 + b.x * 1.83} y={98 + b.y * 1.83} width={b.width * 1.83} height={b.height * 1.83} vectorEffect="non-scaling-stroke" />
      ))}
    </>
  )
}

function Pros() {
  return (
    <>
      {/* the photographer's phone: a job, dispatched */}
      {P('M78 24H162V216H78ZM78 48H162M78 192H162M114 204H126', 'la-1')}
      {P('M90 60H150V132H90Z', 'la-1')}
      <Glyph name="assigned" x={108} y={72} />
      {P('M96 108H144M96 120H132', 'la-2')}
      {P('M90 144H150V180H90Z', 'la-2')}
      <Glyph name="media" x={108} y={150} />
    </>
  )
}

export default function ServiceArt({ kind }: { kind: ArtKind }) {
  return (
    <svg className={`la la-${kind}`} viewBox="0 0 240 240" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="square" strokeLinejoin="miter">
      {kind === 'os' ? <Os /> : kind === 'pros' ? <Pros /> : <Integrations />}
    </svg>
  )
}
