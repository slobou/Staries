'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import Alert from '@/components/ui/Alert'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import EmptyState from '@/components/ui/EmptyState'
import Icon from '@/components/ui/Icon'
import Spinner from '@/components/ui/Spinner'
import { useCertificate } from '@/hooks/useCertificate'
import { useContentHash } from '@/hooks/useContentHash'
import { useLibraryReady } from '@/hooks/useLibrary'
import { chaptersOf, isPublished, latestRegistration } from '@/lib/library'
import type { Chapter } from '@/lib/types'
import { useLibraryStore } from '@/store/libraryStore'

/**
 * Reader-side trust check: recomputes the fingerprint of the text on screen and
 * compares it with the record read from Stellar. The reader does not have to
 * trust Staries — only the math.
 */
function AuthenticityBanner({ chapter }: { chapter: Chapter }) {
  const latest = latestRegistration(chapter)!
  const onChain = useCertificate(latest.txId)
  const localHash = useContentHash(chapter.content, 0)

  if (onChain.status === 'loading' || !localHash) {
    return (
      <p className="flex items-center gap-2 text-sm text-white/55">
        <Spinner /> Verifying authorship on Stellar…
      </p>
    )
  }

  if (onChain.status !== 'ok') {
    return (
      <Alert tone="warning" title="Could not reach the Stellar network">
        We could not confirm this chapter&apos;s certificate right now.
      </Alert>
    )
  }

  const matches = onChain.certificate.hash === localHash

  return matches ? (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3">
      <p className="flex items-center gap-2 text-sm font-bold text-emerald-200">
        <Icon name="shield-check" className="h-5 w-5" />
        Authorship verified — this text matches its record on Stellar
      </p>
      <Link
        href={`/certificate/${latest.txId}`}
        className="text-sm font-bold text-emerald-200 underline underline-offset-4"
      >
        View certificate
      </Link>
    </div>
  ) : (
    <Alert tone="warning" title="This text differs from the registered version">
      The author may have edited this chapter since it was last registered.{' '}
      <Link href={`/certificate/${latest.txId}`} className="font-bold underline underline-offset-4">
        See the registered certificate
      </Link>
    </Alert>
  )
}

export default function ChapterReader({
  workId,
  chapterId,
}: {
  workId: string
  chapterId: string
}) {
  const ready = useLibraryReady()
  const work = useLibraryStore((s) => s.works.find((w) => w.id === workId))
  const allChapters = useLibraryStore((s) => s.chapters)
  const chapters = useMemo(
    () => chaptersOf(allChapters, workId).filter(isPublished),
    [allChapters, workId]
  )

  if (!ready) return null

  const index = chapters.findIndex((c) => c.id === chapterId)
  const chapter = chapters[index]

  if (!work || !chapter) {
    return (
      <EmptyState
        title="Chapter not found"
        description="This chapter does not exist or has not been published."
        action={<Button href="/explore">Back to Explore</Button>}
      />
    )
  }

  const previous = chapters[index - 1]
  const next = chapters[index + 1]

  return (
    <article className="space-y-8">
      <header className="space-y-3">
        <Link
          href={`/stars/${work.id}`}
          className="text-sm font-bold text-brand-light hover:text-star"
        >
          ← {work.title}
        </Link>
        <div className="flex items-center gap-3">
          <Badge tone="brand">Chapter {chapter.number}</Badge>
          <span className="text-sm text-white/50">by {work.authorName}</span>
        </div>
        <h1 className="text-3xl font-black sm:text-4xl">{chapter.title}</h1>
      </header>

      <AuthenticityBanner chapter={chapter} />

      <div className="whitespace-pre-wrap font-serif text-lg leading-[1.9] text-white/90">
        {chapter.content}
      </div>

      <nav aria-label="Chapter navigation" className="flex justify-between gap-3 border-t border-white/10 pt-6">
        {previous ? (
          <Button href={`/stars/${work.id}/read/${previous.id}`} variant="outline">
            ← {previous.title}
          </Button>
        ) : (
          <span />
        )}
        {next ? (
          <Button href={`/stars/${work.id}/read/${next.id}`} variant="accent">
            {next.title} →
          </Button>
        ) : (
          <Button href={`/stars/${work.id}`} variant="primary">
            Back to the Star
          </Button>
        )}
      </nav>
    </article>
  )
}
