/**
 * Package lines on the /book quote. The floor plan comes with the drone
 * (Essentials and up) at no extra charge, so it shows as an "Included" $0 line.
 * Same rule as quote-engine, OS www-quote and Companion SQFT_PRICING:
 * Essentials = HDR photo + drone; the floor plan is never billed on top.
 */
export type QuoteForLines = {
  photo_rate: number
  drone_rate: number
  base_rate?: number
  drone_included?: boolean
  floor_plan_included?: boolean
  floor_plan_only?: boolean
  floor_plan_only_rate?: number
}

export type QuoteLine = { key: string; label: string; note?: string; amount: number }

export function packageLines(q: QuoteForLines, fallbackFloorPlanOnlyRate: number): QuoteLine[] {
  if (q.floor_plan_only) {
    return [{ key: 'floor_plan_only', label: 'Floor plan only', amount: q.floor_plan_only_rate ?? q.base_rate ?? fallbackFloorPlanOnlyRate }]
  }
  const lines: QuoteLine[] = [{ key: 'photo', label: 'HDR photography', amount: q.photo_rate }]
  if (q.drone_included !== false) {
    lines.push({ key: 'drone', label: 'Licensed drone', amount: q.drone_rate })
  } else {
    lines.push({ key: 'drone', label: 'Licensed drone', note: 'not included — Photos only', amount: 0 })
  }
  const floorPlan = q.floor_plan_included ?? q.drone_included !== false
  if (floorPlan) lines.push({ key: 'floor_plan', label: 'Branded floor plan', note: 'included', amount: 0 })
  return lines
}
