import { ICONS, type IconName } from './icons'

type Props = { name: IconName; size?: 16 | 20 | 24 | 32 | 48; label?: string; className?: string }

/** Bare precision icon. Pass `label` only when the icon carries meaning on its own (no visible text next to it). */
export default function BricksIcon({ name, size = 24, label, className }: Props) {
  return (
    <svg
      className={`bx-icon ${className ?? ''}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="square"
      strokeLinejoin="miter"
      strokeMiterlimit={10}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <path d={ICONS[name].d} vectorEffect="non-scaling-stroke" />
    </svg>
  )
}
