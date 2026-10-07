'use client'

import { useParams } from 'next/navigation'
import StarDetail from '@/components/catalog/StarDetail'
import PageShell from '@/components/ui/PageShell'

export default function StarPage() {
  const { workId } = useParams<{ workId: string }>()

  return (
    <PageShell>
      <StarDetail workId={workId} />
    </PageShell>
  )
}
