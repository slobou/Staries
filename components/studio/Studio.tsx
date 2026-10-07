'use client'

import { useMemo } from 'react'
import Button from '@/components/ui/Button'
import EmptyState from '@/components/ui/EmptyState'
import FundingNotice from '@/components/wallet/FundingNotice'
import { useLibraryReady } from '@/hooks/useLibrary'
import { chaptersOf } from '@/lib/library'
import { useLibraryStore } from '@/store/libraryStore'
import WorkCard from './WorkCard'

/** The author's list of Stars. */
export default function Studio({ address }: { address: string }) {
  const ready = useLibraryReady()
  const works = useLibraryStore((s) => s.works)
  const chapters = useLibraryStore((s) => s.chapters)

  const mine = useMemo(
    () => works.filter((w) => w.authorAddress === address),
    [works, address]
  )

  if (!ready) return null

  return (
    <div className="space-y-8">
      <FundingNotice address={address} />
      {mine.length === 0 ? (
        <EmptyState
          title="Your first Star starts here"
          description="Create a Star, add a chapter and press “Publish & protect”. Your certificate of authorship is ready in seconds."
          action={
            <Button href="/write/new" variant="accent">
              Create a Star
            </Button>
          }
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {mine.map((work) => (
            <WorkCard
              key={work.id}
              work={work}
              chapters={chaptersOf(chapters, work.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
