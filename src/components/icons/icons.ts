/**
 * Bricks precision icons. 24-unit grid, live area 2–22, 1.5px stroke (non-scaling, so it stays 1.5px at 16, 24 and 48),
 * square caps, mitred joins, no fills. Bare on the page: no circles, no bubbles. Colour = currentColor.
 * Same paths as public/icons/bricks-*.svg. Source of truth: /workspace/ship/visual-system/bricks-visual-tokens.md
 */
export const ICONS = {
  'media': { group: 'Services', d: 'M3 7h5l1.5-2.5h5L16 7h5v12H3zM15.5 13a3.5 3.5 0 1 1-7 0a3.5 3.5 0 1 1 7 0zM18 9.5h1' },
  'drone': { group: 'Services', d: 'M10 10h4v4h-4zM10 10L7.8 7.8M14 10l2.2-2.2M10 14l-2.2 2.2M14 14l2.2 2.2M8.5 6a2.5 2.5 0 1 1-5 0a2.5 2.5 0 1 1 5 0zM20.5 6a2.5 2.5 0 1 1-5 0a2.5 2.5 0 1 1 5 0zM8.5 18a2.5 2.5 0 1 1-5 0a2.5 2.5 0 1 1 5 0zM20.5 18a2.5 2.5 0 1 1-5 0a2.5 2.5 0 1 1 5 0z' },
  'film': { group: 'Services', d: 'M3 5h18v14H3zM3 8.5h18M3 15.5h18M7 5v3.5M12 5v3.5M17 5v3.5M7 15.5V19M12 15.5V19M17 15.5V19' },
  'tour-3d': { group: 'Services', d: 'M12 3l8 4.5v9L12 21l-8-4.5v-9zM4 7.5l8 4.5 8-4.5M12 12v9' },
  'floor-plan': { group: 'Services', d: 'M3 3h18v18H3zM10 3v8H3M14 21v-7h7M10 15v6M17 3v4' },
  'site-progress': { group: 'Services', d: 'M6 21V4M6 4h14M6 8l4-4M17 4v5M15.5 9h3v2.5h-3zM3 21h18M14 21v-6h4v6' },
  'booked': { group: 'Status', d: 'M4 5h16v15H4zM4 9h16M8 3v4M16 3v4M9 14.5l2 2 4-4' },
  'assigned': { group: 'Status', d: 'M3 12h10M9 8l4 4-4 4M15 4h5v16h-5' },
  'in-flight': { group: 'Status', d: 'M4 20L20 4M20 4h-7M20 4v7M4 14v6h6' },
  'uploading': { group: 'Status', d: 'M12 16V4M7 9l5-5 5 5M4 15v5h16v-5' },
  'qc': { group: 'Status', d: 'M4 4h11v11H4zM15 15l5 5M7 9.5l2 2 3.5-3.5' },
  'delivered': { group: 'Status', d: 'M4 4h16v16H4zM8 12l3 3 5-6' },
  'held': { group: 'Status', d: 'M4 4h16v16H4zM10 8v8M14 8v8' },
  'survey-mark': { group: 'Map tools', d: 'M12 3l9 16H3zM12 10v6M9 13h6' },
  'coordinate': { group: 'Map tools', d: 'M12 2v7M12 15v7M2 12h7M15 12h7M9 9h6v6H9z' },
  'parcel': { group: 'Map tools', d: 'M4 6l12-2 4 9-6 7-10-3zM9 5.2L8 18.4' },
  'elevation': { group: 'Map tools', d: 'M3 18l5-6 4 3 4-7 5 10M3 21h18' },
  'measure': { group: 'Map tools', d: 'M3 17L17 3l4 4L7 21zM7 13l2 2M10 10l2 2M13 7l2 2' },
  'layers': { group: 'Map tools', d: 'M12 3l9 5-9 5-9-5zM3 12.5l9 5 9-5M3 17l9 5 9-5' },
  'deal': { group: 'Core', d: 'M5 3h10l4 4v14H5zM15 3v4h4M8 11h8M8 15h8M8 19h4' },
  'calendar': { group: 'Core', d: 'M4 5h16v15H4zM4 9h16M8 3v4M16 3v4M8 13h2v2H8zM14 13h2v2h-2z' },
  'e-sign': { group: 'Core', d: 'M6 15L15 6l3 3-9 9H6zM13 8l3 3M4 21h16' },
  'mls': { group: 'Core', d: 'M3 11l9-7 9 7M5 9.5V20h14V9.5M10 20v-6h4v6' },
  'crm': { group: 'Core', d: 'M3 5h18v14H3zM7 9h4v4H7zM14 10h4M14 13h4M7 16h11' },
  'integrations': { group: 'Core', d: 'M4 4h6v6H4zM14 14h6v6h-6zM10 7h7v7' },
} as const

export type IconName = keyof typeof ICONS
