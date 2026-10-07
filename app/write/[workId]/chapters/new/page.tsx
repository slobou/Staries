'use client'

import { useParams } from 'next/navigation'
import ChapterEditor from '@/components/publish/ChapterEditor'
import PageShell from '@/components/ui/PageShell'
import RequireWallet from '@/components/wallet/RequireWallet'

export default function NewChapterPage() {
  const { workId } = useParams<{ workId: string }>()

  return (
    <PageShell
      eyebrow="Publish"
      title="New chapter"
      description="Write or paste your chapter, then publish it to get a permanent certificate of authorship."
      width="max-w-3xl"
    >
      <RequireWallet purpose="publish a chapter">
        {(address) => <ChapterEditor workId={workId} address={address} />}
      </RequireWallet>
    </PageShell>
  )
}
