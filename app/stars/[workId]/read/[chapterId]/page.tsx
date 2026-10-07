'use client'

import { useParams } from 'next/navigation'
import ChapterReader from '@/components/reader/ChapterReader'
import PageShell from '@/components/ui/PageShell'

export default function ReadChapterPage() {
  const { workId, chapterId } = useParams<{ workId: string; chapterId: string }>()

  return (
    <PageShell width="max-w-3xl">
      <ChapterReader workId={workId} chapterId={chapterId} />
    </PageShell>
  )
}
