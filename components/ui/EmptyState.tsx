import type { ReactNode } from 'react'
import StarShape from '@/components/brand/StarShape'

export default function EmptyState({
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-white/15 px-6 py-14 text-center">
      <StarShape className="h-10 w-10 text-star/70" />
      <h3 className="text-lg font-extrabold">{title}</h3>
      {description && (
        <p className="max-w-md text-sm text-white/60">{description}</p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}
