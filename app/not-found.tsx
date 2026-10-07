import type { Metadata } from 'next'
import StarShape from '@/components/brand/StarShape'
import Button from '@/components/ui/Button'
import PageShell from '@/components/ui/PageShell'

export const metadata: Metadata = { title: 'Page not found' }

export default function NotFound() {
  return (
    <PageShell width="max-w-2xl">
      <div className="flex flex-col items-center gap-6 py-16 text-center">
        <StarShape className="h-16 w-16 text-star" />
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-star">Error 404</p>
        <h1 className="text-4xl font-black">This star is not in our sky.</h1>
        <p className="max-w-md text-white/65">
          The page you are looking for does not exist or has moved. Let&apos;s get you back to
          the stories.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button href="/" variant="accent">
            Back to home
          </Button>
          <Button href="/explore" variant="outline">
            Explore the catalog
          </Button>
        </div>
      </div>
    </PageShell>
  )
}
