'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import Alert from '@/components/ui/Alert'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import EmptyState from '@/components/ui/EmptyState'
import { useLibraryReady } from '@/hooks/useLibrary'
import { chaptersOf, isPublished, latestRegistration } from '@/lib/library'
import type { LicenseOffers } from '@/lib/types'
import { useLibraryStore } from '@/store/libraryStore'
import LicenseOffersEditor, { hasInvalidOffer } from './LicenseOffersEditor'

/** Manage one Star: its chapters and the licenses it offers. */
export default function WorkManager({
  workId,
  address,
}: {
  workId: string
  address: string
}) {
  const ready = useLibraryReady()
  const works = useLibraryStore((s) => s.works)
  const allChapters = useLibraryStore((s) => s.chapters)
  const updateOffers = useLibraryStore((s) => s.updateOffers)

  const work = works.find((w) => w.id === workId)
  const chapters = useMemo(() => chaptersOf(allChapters, workId), [allChapters, workId])

  const [draftOffers, setDraftOffers] = useState<LicenseOffers | null>(null)
  const [saved, setSaved] = useState(false)

  if (!ready) return null

  if (!work || work.authorAddress !== address) {
    return (
      <EmptyState
        title="Star not found"
        description="This Star does not exist, or it belongs to a different wallet."
        action={<Button href="/write">Back to My Stars</Button>}
      />
    )
  }

  const offers = draftOffers ?? work.offers
  const invalid = hasInvalidOffer(offers)

  return (
    <div className="space-y-10">
      <section aria-labelledby="chapters-heading" className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="chapters-heading" className="text-xl font-extrabold">
            Chapters
          </h2>
          <Button href={`/write/${work.id}/chapters/new`} variant="accent" size="sm">
            New chapter
          </Button>
        </div>

        {chapters.length === 0 ? (
          <EmptyState
            title="No chapters yet"
            description="Add your first chapter, then publish it to get its certificate of authorship."
          />
        ) : (
          <ul className="divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/10 bg-ink-raised/60">
            {chapters.map((chapter) => {
              const latest = latestRegistration(chapter)
              return (
                <li key={chapter.id}>
                  <Link
                    href={`/write/${work.id}/chapters/${chapter.id}`}
                    className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 transition hover:bg-white/5"
                  >
                    <span className="font-bold">
                      <span className="mr-3 text-white/40">{chapter.number}</span>
                      {chapter.title}
                    </span>
                    <span className="flex items-center gap-2">
                      {isPublished(chapter) ? (
                        <Badge tone="success">
                          Protected · v{chapter.registrations.length}
                        </Badge>
                      ) : (
                        <Badge>Draft</Badge>
                      )}
                      {latest && (
                        <span className="hidden text-xs text-white/40 sm:inline">
                          {new Date(latest.registeredAt).toLocaleDateString()}
                        </span>
                      )}
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </section>

      <section aria-labelledby="licenses-heading">
        <Card className="space-y-5">
          <h2 id="licenses-heading" className="text-xl font-extrabold">
            License pricing
          </h2>
          <LicenseOffersEditor
            value={offers}
            onChange={(next) => {
              setSaved(false)
              setDraftOffers(next)
            }}
          />
          {invalid && (
            <Alert tone="error">
              Every license you offer needs a price greater than zero.
            </Alert>
          )}
          <div className="flex items-center justify-end gap-3">
            {saved && <span className="text-sm font-bold text-emerald-300">Saved</span>}
            <Button
              variant="primary"
              disabled={draftOffers === null || invalid}
              onClick={() => {
                if (!draftOffers) return
                updateOffers(work.id, draftOffers)
                setDraftOffers(null)
                setSaved(true)
              }}
            >
              Save pricing
            </Button>
          </div>
        </Card>
      </section>
    </div>
  )
}
