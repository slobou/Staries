import StarShape from '@/components/brand/StarShape'

/** Shown while a page is loading. Picked up automatically by Next.js. */
export default function Loading() {
  return (
    <main
      className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-24"
      role="status"
      aria-live="polite"
    >
      <StarShape className="h-12 w-12 animate-pulse text-star" />
      <p className="text-sm font-medium text-white/60">Loading…</p>
    </main>
  )
}
