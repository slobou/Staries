'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import EmptyState from '@/components/ui/EmptyState'
import { Input } from '@/components/ui/Field'
import Icon from '@/components/ui/Icon'
import { useLibraryReady } from '@/hooks/useLibrary'
import { GENRES } from '@/lib/catalog'
import { isPublished } from '@/lib/library'
import { useLibraryStore } from '@/store/libraryStore'
import CoverArt from './CoverArt'

export default function ExploreView() {
  const ready = useLibraryReady()
  const works = useLibraryStore((s) => s.works)
  const chapters = useLibraryStore((s) => s.chapters)
  const [query, setQuery] = useState('')
  const [genre, setGenre] = useState<string | null>(null)

  const published = useMemo(
    () =>
      works
        .map((work) => ({
          work,
          count: chapters.filter((c) => c.workId === work.id && isPublished(c)).length,
        }))
        .filter(({ count }) => count > 0),
    [works, chapters]
  )

  const visible = published.filter(({ work }) => {
    const q = query.trim().toLowerCase()
    const matchesQuery =
      !q || work.title.toLowerCase().includes(q) || work.authorName.toLowerCase().includes(q)
    return matchesQuery && (!genre || work.genre === genre)
  })

  if (!ready) return null

  if (published.length === 0) {
    return (
      <EmptyState
        title="No Stars published yet"
        description="Be the first: publish a chapter and your Star appears here with its proof of authorship."
        action={
          <Button href="/write" variant="accent">
            Publish a Star
          </Button>
        }
      />
    )
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <label htmlFor="search" className="sr-only">
          Search by title or author
        </label>
        <Input
          id="search"
          type="search"
          placeholder="Search by title or author…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by genre">
          {[null, ...GENRES].map((g) => (
            <button
              key={g ?? 'all'}
              onClick={() => setGenre(g)}
              aria-pressed={genre === g}
              className={`rounded-full border px-4 py-1.5 text-sm font-bold transition ${
                genre === g
                  ? 'border-star bg-star text-ink'
                  : 'border-white/15 text-white/70 hover:border-white/40'
              }`}
            >
              {g ?? 'All'}
            </button>
          ))}
        </div>
      </div>

      {visible.length === 0 ? (
        <EmptyState title="No matches" description="Try a different search or genre." />
      ) : (
        <ul className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
          {visible.map(({ work, count }) => (
            <li key={work.id}>
              <Link href={`/stars/${work.id}`} className="group block space-y-3">
                <CoverArt
                  title={work.title}
                  className="transition group-hover:-translate-y-1 group-hover:shadow-xl group-hover:shadow-black/40"
                />
                <div className="space-y-1">
                  <h3 className="font-extrabold leading-tight group-hover:text-star">
                    {work.title}
                  </h3>
                  <p className="text-sm text-white/55">by {work.authorName}</p>
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <Badge tone="brand">{work.genre}</Badge>
                    <Badge tone="success">
                      <Icon name="shield-check" className="h-3 w-3" /> Protected
                    </Badge>
                  </div>
                  <p className="text-xs text-white/40">
                    {count} {count === 1 ? 'chapter' : 'chapters'}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
