import type { FeatureItem } from '@/components/features/Feature'

/** Builder hub: live on app.brxs.ca. Reports are visual documentation; never call them certified or lender-certified. */
export const HUB: readonly FeatureItem[] = [
  {
    title: 'Progress reports.',
    body: 'Pick a date range and Bricks drafts the report from your dated visits: true maps, before and after, milestones and what changed since the last report. Each edit is saved as a new revision, with a change log.',
    points: [
      'Download it as a PDF, or share a read-only link that expires',
      'Scale bars and photo location pins on every true map',
      'A scope line on every report: visual documentation of site conditions, not a cost, quantity or completion certification',
    ],
    shot: 'progress-report',
    alt: 'The top of a Bricks progress report with sample data: project, date range and an orthomosaic with a scale bar and two photo location pins',
  },
  {
    title: 'Measured, with the method shown.',
    body: 'Cut, fill, net volume and area changed between two point clouds, plus the areas and distances you save on the maps.',
    points: [
      'Every measurement names its method and where its scale comes from',
      'Volumes are an estimate for tracking progress, not a survey',
    ],
    shot: 'report-measure',
    alt: 'The measurements section of a Bricks progress report with sample data: fill, cut, net and area changed, the method and scale, and two measurements saved on the maps',
  },
  {
    title: 'Progress by line, and an issues log.',
    body: 'Each line item carries your % complete and the evidence that shows it, marked as your own figures. Issues are logged with a location and a photo, and stay open until you close them.',
    points: [
      'Line items weighted by value and marked as your figures',
      'Opened and closed dates on every issue',
    ],
    shot: 'report-issues',
    alt: 'The issues log of a Bricks progress report with sample data: two open issues and one closed, each with a location, a photo and dates',
  },
  {
    title: 'Evidence you can check.',
    body: 'Lenders and quantity surveyors get dated, measured evidence they can check. Every file in the evidence index carries a SHA-256 checksum.',
    points: [
      'Weather for each visit from NASA POWER, modelled for the site',
      'Capture details for each visit: aircraft, height, ground sample distance, and pilot certificate and ground control where recorded',
    ],
    shot: 'report-evidence',
    alt: 'The evidence index of a Bricks progress report with sample data: dated orthomosaics, point clouds and stills, each with a SHA-256 checksum, file name and size',
  },
  {
    title: 'Investor updates.',
    body: 'A monthly update on the same engine. Each one starts from the last, so what changed is already written. Add your schedule, budget, next steps and risks.',
    points: ['Schedule and budget figures stay marked as yours', 'Same PDF and expiring link as a progress report'],
    shot: 'investor-update',
    alt: 'The schedule and budget section of a Bricks investor update with sample data: change since the last update, target and forecast dates, budget, next steps and risks',
  },
  {
    title: 'Your own captures.',
    body: 'Upload or link maps, point clouds and models from another flight. Each import becomes a dated visit on the project timeline.',
    points: ['GeoTIFF, LAS, LAZ, E57, PLY, OBJ, GLB, photos, video or PDF, up to 5 GB a file', 'Marked as imported, so reports never say Bricks captured it'],
    shot: 'capture-import',
    alt: 'The Bricks form for adding your own captures with sample files: an orthomosaic GeoTIFF, a LAS point cloud and an OBJ model, plus a field to paste links',
  },
  {
    title: '3D compare.',
    body: 'Put two dates side by side, or show only what changed. Bricks measures fill, cut and the area changed between two point clouds.',
    points: ['Measured on a 0.5 m grid, coarser on very large sites; changes under 10 cm are left out', 'An estimate for tracking progress, not a survey'],
    shot: 'compare-3d',
    alt: 'Bricks comparing two point clouds of a sample site a month apart, with raised areas in orange and fill, cut and area changed measured below',
  },
]

/** Pick hub features by title, in the order given. Throws at build time on a typo so pages never drift. */
export function hubItems(...titles: string[]): FeatureItem[] {
  return titles.map((t) => {
    const f = HUB.find((x) => x.title === t)
    if (!f) throw new Error(`Unknown hub feature: ${t}`)
    return f
  })
}
