/**
 * "More than a local vendor": what Bricks Site Progress adds beyond a file handoff.
 * Shared by /pricing (builder view) and /builders. Every Bricks line is built today in Bricks OS
 * (frontend/src/components/developer, read 2026-10-24); keep it that way. Nothing planned is listed:
 * Procore sync and lender draw reports are not on the roadmap in code, so they are left out.
 * The vendor column describes a typical per-visit drone/photo firm; some include a PDF or a share link.
 */
export const BUILDER_EDGE_TITLE = 'More than a local vendor.'
export const BUILDER_EDGE_LEDE = 'One vendor, one portal, dated evidence for every draw.'

export type EdgeRow = { topic: string; vendor: string; bricks: string; /** OS source that backs the Bricks line. */ source: string }

export const BUILDER_EDGE: readonly EdgeRow[] = [
  {
    topic: 'Every site',
    vendor: 'A folder or download link per visit, per firm.',
    bricks: 'One portal for every site you run, with each visit filed by date.',
    source: 'pages/developer/DeveloperProjectsPage.js, components/developer/SiteTimeline.js',
  },
  {
    topic: 'Over time',
    vendor: 'You line up old files yourself.',
    bricks: 'Pick any two dates and swipe between maps and pictures, or view 3D models side by side.',
    source: 'components/developer/SiteTimeline.js (ImageCompare, Compare dates)',
  },
  {
    topic: 'On the map',
    vendor: 'Measuring needs separate software.',
    bricks: 'Measure distance and area on the map, and elevation on the elevation model.',
    source: 'components/developer/MeasureView.js',
  },
  {
    topic: 'Sharing',
    vendor: 'Forward files, or a link to one capture.',
    bricks: 'Read-only timeline links for your GC, lender or asset manager. Links expire, and you can turn one off.',
    source: 'components/developer/ShareLinksPanel.js, pages/SiteSharePage.js',
  },
  {
    topic: 'Reporting',
    vendor: 'A PDF report, on some packages.',
    bricks: 'A site report for any visit, with then-and-now pictures and a progress note, ready to print or save as PDF.',
    source: 'components/developer/SiteReport.js, ProgressNote.js',
  },
  {
    topic: 'Booking',
    vendor: 'Email or call to book each visit.',
    bricks: 'Book online. Upcoming visits show on the site timeline.',
    source: 'pages/developer/DeveloperOverviewPage.js (Book a site visit), timeline status scheduled',
  },
  {
    topic: 'Pilots',
    vendor: 'Whoever the firm sends.',
    bricks: 'Vetted, certified pilots, with drone liability insurance checked for the flight date.',
    source: '/builders proof rows (Dispatch vetting and insurance checks)',
  },
]
