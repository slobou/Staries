'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import LicensePanel from '@/components/license/LicensePanel'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import EmptyState from '@/components/ui/EmptyState'
import Icon from '@/components/ui/Icon'
import { useLibraryReady } from '@/hooks/useLibrary'
import { chaptersOf, isPublished, latestRegistration } from '@/lib/library'
import { getAccountUrl } from '@/lib/stellar/registry'
import { useLibraryStore } from '@/store/libraryStore'
import { truncateAddress } from '@/utils/stellarUtils'
import CoverArt from './CoverArt'

export default function StarDetail({ workId }: { workId: string }) {
  const ready = useLibraryReady()
  const work = useLibraryStore((s) => s.works.find((w) => w.id === workId))
  const allChapters = useLibraryStore((s) => s.chapters)
  const chapters = useMemo(
    () => chaptersOf(allChapters, workId).filter(isPublished),
    [allChapters, workId]
  )

  if (!ready) return null

  if (!work || chapters.length === 0) {
    return (
      <EmptyState
        title="Star not found"
        description="This Star does not exist or has no published chapters yet."
        action={<Button href="/explore">Back to Explore</Button>}
      />
    )
  }

  return (
    <div className="space-y-12">
      <div className="grid gap-8 md:grid-cols-[14rem_1fr]">
        <CoverArt title={work.title} className="w-56 max-w-full" />
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge tone="brand">{work.genre}</Badge>
            <Badge>{work.language}</Badge>
            <Badge tone="success">
              <Icon name="shield-check" className="h-3 w-3" /> Authorship protected
            </Badge>
          </div>
          <h1 className="text-4xl font-black">{work.title}</h1>
          <p className="text-white/70">
            by <span className="font-bold text-white">{work.authorName}</span> ·{' '}
            <a
              href={getAccountUrl(work.authorAddress)}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-white/50 underline underline-offset-4 hover:text-star"
            >
              {truncateAddress(work.authorAddress)}
            </a>
          </p>
          <p className="whitespace-pre-line leading-relaxed text-white/80">{work.synopsis}</p>
        </div>
      </div>

      <section aria-labelledby="chapters" className="space-y-4">
        <h2 id="chapters" className="text-xl font-extrabold">
          Chapters
        </h2>
        <ul className="divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/10 bg-ink-raised/60">
          {chapters.map((chapter) => {
            const latest = latestRegistration(chapter)
            return (
              <li key={chapter.id}>
                <Link
                  href={`/stars/${work.id}/read/${chapter.id}`}
                  className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 transition hover:bg-white/5"
                >
                  <span className="font-bold">
                    <span className="mr-3 text-white/40">{chapter.number}</span>
                    {chapter.title}
                  </span>
                  {latest && (
                    <span className="text-xs text-white/45">
                      Registered {new Date(latest.registeredAt).toLocaleDateString()}
                    </span>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </section>

      <LicensePanel work={work} />
    </div>
  )
}
