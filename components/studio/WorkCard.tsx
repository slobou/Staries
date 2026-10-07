import Link from 'next/link'
import Badge from '@/components/ui/Badge'
import StarShape from '@/components/brand/StarShape'
import { isPublished } from '@/lib/library'
import type { Chapter, Work } from '@/lib/types'

export default function WorkCard({
  work,
  chapters,
}: {
  work: Work
  chapters: Chapter[]
}) {
  const published = chapters.filter(isPublished).length

  return (
    <Link
      href={`/write/${work.id}`}
      className="group flex flex-col gap-4 rounded-2xl border border-white/10 bg-ink-raised/60 p-6 transition hover:border-star/60"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand/30 text-star">
          <StarShape className="h-6 w-6" />
        </span>
        <Badge tone={published > 0 ? 'success' : 'neutral'}>
          {published > 0 ? 'Published' : 'Draft'}
        </Badge>
      </div>
      <div className="space-y-1">
        <h3 className="text-lg font-extrabold group-hover:text-star">{work.title}</h3>
        <p className="line-clamp-2 text-sm text-white/60">{work.synopsis}</p>
      </div>
      <p className="mt-auto text-xs font-bold text-white/50">
        {work.genre} · {work.language} · {published}/{chapters.length} chapters protected
      </p>
    </Link>
  )
}
