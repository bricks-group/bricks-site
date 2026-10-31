import BricksLoader from '@/components/BricksLoader'
import '../visit.css'

export default function Loading() {
  return (
    <main className="pv pv-loading" aria-busy="true">
      <BricksLoader variant="assemble" size={44} label="Loading your visit" />
    </main>
  )
}
