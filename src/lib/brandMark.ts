/**
 * The Bricks mark, brick by brick. Exact geometry of public/bricks-mark.svg
 * (same rects as BrandMark and BricksLoader): 24-unit box, 1.2 gaps, 0.8 corner, top brick at 0.82.
 */
export const MARK_VIEWBOX = '0 0 24 24'
export const MARK_COLOR = '#D2542B'
export const MARK_BRICKS = [
  { x: 3, y: 4, width: 11, height: 6.4, rx: 0.8, fillOpacity: 0.82 },
  { x: 3, y: 11.6, width: 6, height: 8.4, rx: 0.8, fillOpacity: 1 },
  { x: 10.2, y: 11.6, width: 10.8, height: 8.4, rx: 0.8, fillOpacity: 1 },
] as const
