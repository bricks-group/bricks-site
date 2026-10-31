/** Thin line icons for the help centre: 24 grid, 1.5 stroke, square caps, no fills. */
const PATHS: Record<string, string> = {
  start: 'M5 19V5h14v14H5Z M9 9h6 M9 12h6 M9 15h3',
  camera: 'M3 8h4l2-3h6l2 3h4v11H3V8Z M12 16.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z',
  calendar: 'M4 6h16v14H4V6Z M4 10h16 M8 3v5 M16 3v5 M8 14h3',
  card: 'M3 6h18v12H3V6Z M3 10h18 M7 15h4',
  person: 'M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z M4 21c1-4.5 4-6.5 8-6.5s7 2 8 6.5',
  people: 'M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z M2.5 20c.8-3.8 3.2-5.5 6.5-5.5s5.7 1.7 6.5 5.5 M16 4.5a3.5 3.5 0 0 1 0 6.5 M18 14.8c1.9.7 3 2.4 3.5 5.2',
  building: 'M5 21V3h14v18 M3 21h18 M9 7h2 M13 7h2 M9 11h2 M13 11h2 M9 15h2 M13 15h2 M10.5 21v-3h3v3',
  crane: 'M6 21V4 M6 4h14 M6 4 3 8h3 M17 4v6 M15 10h4v3h-4v-3Z M3 21h10 M6 8l4-4',
  key: 'M8 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z M12 12h9 M18 12v3 M21 12v3',
  tower: 'M7 21V5l5-2 5 2v16 M4 21h16 M10 8h4 M10 11h4 M10 14h4 M10 17h4',
  chart: 'M4 4v16h16 M7 15l4-4 3 3 5-6 M15 8h4v4',
  grid: 'M4 4h7v7H4V4Z M13 4h7v7h-7V4Z M4 13h7v7H4v-7Z M13 13h7v7h-7v-7Z',
  link: 'M10 14l4-4 M8.5 11.5 6 14a3 3 0 0 0 4 4l2.5-2.5 M15.5 12.5 18 10a3 3 0 0 0-4-4l-2.5 2.5',
  lock: 'M5 11h14v10H5V11Z M8 11V7a4 4 0 0 1 8 0v4 M12 15v2',
  home: 'M3 11l9-7 9 7 M5 9.5V20h14V9.5 M10 20v-5h4v5',
  aperture: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z M12 3l3 7 M21 12l-7 2 M15.5 20.3 12 14 M5 18l5-4 M3.5 9.5 10 10 M9 3.5 10 10',
  wrench: 'M14.5 4a5 5 0 0 0-4.6 6.9L4 16.8 7.2 20l5.9-5.9A5 5 0 0 0 20 9.5l-3 3-3.5-1-1-3.5 3-3Z',
  mail: 'M3 5h18v14H3V5Z M3 6l9 7 9-7',
  search: 'M10.5 17a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13Z M15.5 15.5 20 20',
  arrow: 'M5 12h14 M13 6l6 6-6 6',
  chevron: 'M9 6l6 6-6 6',
  close: 'M6 6l12 12 M18 6 6 18',
  check: 'M5 12.5 9.5 17 19 7',
  question: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6v.6 M12 17v.5',
}

export default function HelpIcon({ name, size = 24, className }: { name: string; size?: number; className?: string }) {
  const d = PATHS[name] ?? PATHS.start
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
      focusable="false"
    >
      <path d={d} />
    </svg>
  )
}
