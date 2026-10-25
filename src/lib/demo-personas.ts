/** Who a prospect can explore the demo as. Keys match the demo build's ?demo_as= personas. */
export type DemoPersona = { key: string; label: string; who: string; line: string }

export const DEMO_PERSONAS: DemoPersona[] = [
  { key: 'manager', label: 'Brokerage', who: 'Royal Realty Group', line: 'Every agent, deal and listing in the office, with trust and compliance.' },
  { key: 'team_lead', label: 'Team', who: 'Chen Group', line: "A team's listings, media and deals, with the pipeline on one desk." },
  { key: 'solo', label: 'Agent', who: 'Alex Chen', line: 'Listing media, bookings and your own deals in one place.' },
  { key: 'builder', label: 'Builder', who: 'Ashfield Homes', line: 'Site progress you can see, from first dig to handover.' },
  { key: 'property_manager', label: 'Property manager', who: 'Harbourline Rentals', line: 'Unit photos, condition reports and turnovers, by property.' },
  { key: 'reit', label: 'Portfolio', who: 'Lakeshore Residential REIT', line: 'Every property in the portfolio, photographed on a schedule.' },
  { key: 'commercial', label: 'Commercial', who: 'Bayview Commercial', line: 'Leasing media and aerials for commercial space.' },
  { key: 'photographer', label: 'Photographer', who: 'Bianchi Visuals', line: "Today's shoots, checklists, uploads and payouts, on a phone." },
]

export function demoLink(base: string, key: string): string {
  const root = base.trim().replace(/\/$/, '')
  return `${root}/?demo_as=${encodeURIComponent(key)}`
}
