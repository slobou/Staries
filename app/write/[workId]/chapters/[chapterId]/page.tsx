'use client'

import { useParams } from 'next/navigation'
import ChapterEditor from '@/components/publish/ChapterEditor'
import PageShell from '@/components/ui/PageShell'
import RequireWallet from '@/components/wallet/RequireWallet'

export default function EditChapterPage() {
  const { workId, chapterId } = useParams<{ workId: string; chapterId: string }>()

  return (
    <PageShell
      eyebrow="Publish"
      title="Edit chapter"
      description="Every time you publish a changed version, a new certificate is added. Older versions stay on the blockchain."
      width="max-w-3xl"
    >
      <RequireWallet purpose="edit this chapter">
        {(address) => (
          <ChapterEditor workId={workId} chapterId={chapterId} address={address} />
        )}
      </RequireWallet>
    </PageShell>
  )
}
