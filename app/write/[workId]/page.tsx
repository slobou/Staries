'use client'

import { useParams } from 'next/navigation'
import PageShell from '@/components/ui/PageShell'
import WorkManager from '@/components/studio/WorkManager'
import RequireWallet from '@/components/wallet/RequireWallet'
import { useLibraryReady } from '@/hooks/useLibrary'
import { useLibraryStore } from '@/store/libraryStore'

export default function WorkPage() {
  const { workId } = useParams<{ workId: string }>()
  const ready = useLibraryReady()
  const title = useLibraryStore((s) => s.works.find((w) => w.id === workId)?.title)

  return (
    <PageShell
      eyebrow="Author studio"
      title={ready && title ? title : 'Star'}
      width="max-w-4xl"
    >
      <RequireWallet purpose="manage this Star">
        {(address) => <WorkManager workId={workId} address={address} />}
      </RequireWallet>
    </PageShell>
  )
}
