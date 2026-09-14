import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ProjectSitePlan from './ProjectSitePlan'

// Same env var + default the /api/book/slots route already uses to reach
// Bricks-OS server-side.
const OS_API = (process.env.BRICKS_OS_API_URL || 'https://api.brxs.ca').replace(/\/$/, '')

export type DevPhase = {
  id: string
  name: string
  status: 'future' | 'under_construction' | 'released'
  release_date: string | null
  sort_order: number
  map_x: number | null
  map_y: number | null
}

export type DevLot = {
  id: string
  phase_id: string | null
  lot_number: string
  status: 'available' | 'reserved' | 'sold'
  price_cents: number | null
  sqft: number | null
  floor_plan_url: string | null
  map_x: number | null
  map_y: number | null
}

export type DevAmenity = {
  id: string
  name: string
  description: string | null
  media_url: string | null
  map_x: number | null
  map_y: number | null
}

export type DevProjectPublic = {
  id: string
  name: string
  slug: string
  description: string | null
  site_plan_image_url: string | null
  status: string
  phases: DevPhase[]
  lots: DevLot[]
  amenities: DevAmenity[]
}

async function getProject(slug: string): Promise<DevProjectPublic | null> {
  const res = await fetch(`${OS_API}/api/dev/projects/by-slug/${encodeURIComponent(slug)}/public`, {
    // Short revalidation — lot status changes as units sell/lease, shouldn't
    // go stale for long, but this is a low-traffic page, not worth SSR-per-request.
    next: { revalidate: 60 },
  })
  if (res.status === 404) return null
  if (!res.ok) {
    throw new Error(`Bricks-OS /api/dev/projects/by-slug/${slug}/public returned ${res.status}`)
  }
  return res.json()
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const project = await getProject(slug)
  if (!project) return { title: 'Project not found | Bricks' }
  const title = `${project.name} — Interactive Site Plan | Bricks`
  const description = project.description || `Explore ${project.name}'s site plan, available units, and amenities.`
  return {
    title,
    description,
    alternates: { canonical: `/projects/${project.slug}` },
    robots: { index: true, follow: true },
    openGraph: {
      title,
      description,
      images: project.site_plan_image_url ? [{ url: project.site_plan_image_url }] : undefined,
    },
  }
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = await getProject(slug)
  if (!project) notFound()
  return <ProjectSitePlan project={project} />
}
