import type { Metadata } from 'next'
import ExploreView from '@/components/catalog/ExploreView'
import PageShell from '@/components/ui/PageShell'

export const metadata: Metadata = { title: 'Explore' }

export default function ExplorePage() {
  return (
    <PageShell
      eyebrow="Catalog"
      title="Explore Stars"
      description="Discover works whose authorship is verifiable. Every Star here has a public certificate on Stellar."
    >
      <ExploreView />
    </PageShell>
  )
}
