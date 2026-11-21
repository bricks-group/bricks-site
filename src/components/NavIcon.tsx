/**
 * Nav icons: the same precision set the Bricks apps use (OS web / Companion / GO): 24 grid, 1.5px stroke,
 * square caps, mitred joins, no fills, currentColor. Paths match frontend/src/lib/bricks.js in Bricks OS
 * and src/components/icons/icons.ts here.
 */
const PATHS = {
  menu: 'M4 6h16M4 12h16M4 18h16',
  close: 'M6 6l12 12M18 6L6 18',
  person: 'M9 4h6v6H9zM5 20v-6h14v6',
  integrations: 'M4 4h6v6H4zM14 14h6v6h-6zM10 7h7v7',
  team: 'M6 8h4v4H6zM14 8h4v4h-4zM3 20v-3h10v3M11 20v-3h10v3',
  media: 'M3 7h5l1.5-2.5h5L16 7h5v12H3zM15.5 13a3.5 3.5 0 1 1-7 0a3.5 3.5 0 1 1 7 0zM18 9.5h1',
  card: 'M3 6h18v12H3zM3 10h18M6 15h4',
  gallery: 'M3 3h8v8H3zM13 3h8v8h-8zM3 13h8v8H3zM13 13h8v8h-8z',
  help: 'M4 4h16v16H4zM9.5 9.5a2.5 2.5 0 1 1 3.6 2.24c-.7.35-1.1.96-1.1 1.76V14M12 16.5v.5',
  mail: 'M3 5h18v14H3zM3 6l9 7 9-7',
  external: 'M14 4h6v6M20 4l-9 9M18 14v6H4V6h6',
  logout: 'M9 21H5V3h4M16 16l5-4-5-4M9 12h12',
  chevronDown: 'M6 9l6 6 6-6',
  chevronUp: 'M6 15l6-6 6 6',
} as const

export type NavIconName = keyof typeof PATHS

export default function NavIcon({ name, size = 20 }: { name: NavIconName; size?: 16 | 20 | 24 }) {
  return (
    <svg className="nav-ico" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={1.5} strokeLinecap="square" strokeLinejoin="miter" strokeMiterlimit={10} aria-hidden="true">
      <path d={PATHS[name]} vectorEffect="non-scaling-stroke" />
    </svg>
  )
}
