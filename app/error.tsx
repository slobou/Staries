'use client'

import Button from '@/components/ui/Button'
import PageShell from '@/components/ui/PageShell'

/** Shown when something unexpected breaks while rendering a page. */
export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <PageShell width="max-w-2xl">
      <div className="flex flex-col items-center gap-6 py-16 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-star">Something went wrong</p>
        <h1 className="text-4xl font-black">We lost the thread.</h1>
        <p className="max-w-md text-white/65">
          An unexpected error happened. Your work is safe: nothing was published or paid
          unless you saw a confirmation.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button variant="accent" onClick={() => reset()}>
            Try again
          </Button>
          <Button href="/" variant="outline">
            Back to home
          </Button>
        </div>
      </div>
    </PageShell>
  )
}
