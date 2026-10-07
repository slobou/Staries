'use client'

import { useMemo } from 'react'
import Alert from '@/components/ui/Alert'
import Button from '@/components/ui/Button'
import EmptyState from '@/components/ui/EmptyState'
import Spinner from '@/components/ui/Spinner'
import { useCertificate } from '@/hooks/useCertificate'
import { useLibraryStore } from '@/store/libraryStore'
import CertificateCard from './CertificateCard'
import VerifyTextPanel from './VerifyTextPanel'

/** Loads a certificate from Stellar and renders it with the verification tool. */
export default function CertificateView({ txId }: { txId: string }) {
  const state = useCertificate(txId)

  // Friendly context when the work is known locally. The certificate itself never depends on it.
  // Select stable store slices and derive here: a selector that builds a new object
  // on every call would make zustand re-render forever.
  const chapters = useLibraryStore((s) => s.chapters)
  const works = useLibraryStore((s) => s.works)
  const known = useMemo(() => {
    const chapter = chapters.find((c) => c.registrations.some((r) => r.txId === txId))
    const work = chapter && works.find((w) => w.id === chapter.workId)
    return chapter && work ? { chapter, work } : null
  }, [chapters, works, txId])

  if (state.status === 'loading') {
    return (
      <p className="flex items-center gap-3 py-16 text-white/60">
        <Spinner className="h-5 w-5" /> Reading the record from Stellar…
      </p>
    )
  }

  if (state.status === 'not-found') {
    return (
      <EmptyState
        title="Certificate not found"
        description="No transaction with that id exists on this network. Check the link, or make sure you are on the right network."
        action={<Button href="/verify">Try another certificate</Button>}
      />
    )
  }

  if (state.status === 'invalid') {
    return (
      <Alert tone="error" title="This is not a valid Staries certificate">
        {state.message}
      </Alert>
    )
  }

  return (
    <div className="space-y-8">
      <CertificateCard
        certificate={state.certificate}
        title={known?.work.title}
        subtitle={
          known
            ? `Chapter ${known.chapter.number}: ${known.chapter.title} · by ${known.work.authorName}`
            : undefined
        }
      />
      <VerifyTextPanel certificate={state.certificate} />
    </div>
  )
}
