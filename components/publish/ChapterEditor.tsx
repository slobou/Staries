'use client'

import { useState } from 'react'
import Alert from '@/components/ui/Alert'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import EmptyState from '@/components/ui/EmptyState'
import { Field, Input, Textarea } from '@/components/ui/Field'
import Icon from '@/components/ui/Icon'
import Spinner from '@/components/ui/Spinner'
import FundingNotice from '@/components/wallet/FundingNotice'
import { useContentHash } from '@/hooks/useContentHash'
import { useLibraryReady } from '@/hooks/useLibrary'
import { usePublishChapter } from '@/hooks/usePublishChapter'
import {
  latestRegistration,
  nextChapterNumber,
  wordCount,
} from '@/lib/library'
import type { Work } from '@/lib/types'
import { useLibraryStore } from '@/store/libraryStore'
import FingerprintPreview from './FingerprintPreview'
import PublishProgress from './PublishProgress'

interface ChapterEditorProps {
  workId: string
  /** Omit to create a new chapter. */
  chapterId?: string
  address: string
}

/** Guards (data loaded, ownership) around the actual form. */
export default function ChapterEditor({ workId, chapterId, address }: ChapterEditorProps) {
  const ready = useLibraryReady()
  const work = useLibraryStore((s) => s.works.find((w) => w.id === workId))
  const chapter = useLibraryStore((s) =>
    chapterId ? s.chapters.find((c) => c.id === chapterId) : undefined
  )

  if (!ready) return null

  if (!work || work.authorAddress !== address || (chapterId && chapter?.workId !== workId)) {
    return (
      <EmptyState
        title="Chapter not found"
        description="This chapter does not exist, or it belongs to a different wallet."
        action={<Button href="/write">Back to My Stars</Button>}
      />
    )
  }

  return <ChapterForm key={chapterId ?? 'new'} work={work} chapterId={chapterId} address={address} />
}

function ChapterForm({
  work,
  chapterId,
  address,
}: {
  work: Work
  chapterId?: string
  address: string
}) {
  const chapters = useLibraryStore((s) => s.chapters)
  const createChapter = useLibraryStore((s) => s.createChapter)
  const updateChapter = useLibraryStore((s) => s.updateChapter)

  // After the first save of a "new" chapter we keep editing the same record.
  const [savedId, setSavedId] = useState<string | undefined>(chapterId)
  const saved = chapters.find((c) => c.id === savedId)

  const [title, setTitle] = useState(saved?.title ?? '')
  const [number, setNumber] = useState(
    String(saved?.number ?? nextChapterNumber(chapters, work.id))
  )
  const [content, setContent] = useState(saved?.content ?? '')
  const [formError, setFormError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  const { step, error, certificate, publish, reset } = usePublishChapter()
  const hash = useContentHash(content)

  const latest = saved ? latestRegistration(saved) : undefined
  const versions = saved?.registrations.length ?? 0
  const unchanged = !!hash && hash === latest?.hash
  const publishing = ['hashing', 'signing', 'submitting', 'confirming'].includes(step)

  function validate(): { number: number } | null {
    const parsed = Number(number)
    if (!title.trim()) return fail('Give the chapter a title.')
    if (!Number.isInteger(parsed) || parsed < 1) return fail('Chapter number must be a whole number, 1 or higher.')
    if (!content.trim()) return fail('Write something first — there is nothing to protect yet.')
    if (chapters.some((c) => c.workId === work.id && c.number === parsed && c.id !== savedId)) {
      return fail(`Chapter ${parsed} already exists in this Star.`)
    }
    setFormError(null)
    return { number: parsed }
  }

  function fail(message: string) {
    setFormError(message)
    return null
  }

  /** Persists the current form and returns the chapter id. */
  function save(parsedNumber: number): string {
    const data = { title: title.trim(), number: parsedNumber, content }
    if (savedId) {
      updateChapter(savedId, data)
      return savedId
    }
    const created = createChapter({ workId: work.id, ...data })
    setSavedId(created.id)
    return created.id
  }

  function handleSaveDraft() {
    const valid = validate()
    if (!valid) return
    save(valid.number)
    setNotice('Draft saved.')
  }

  async function handlePublish() {
    const valid = validate()
    if (!valid) return
    setNotice(null)
    const id = save(valid.number)
    await publish({ chapterId: id, authorAddress: address, content })
  }

  if (step === 'done' && certificate) {
    return (
      <Card className="space-y-6 border-emerald-400/30">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300">
            <Icon name="shield-check" className="h-6 w-6" />
          </span>
          <div>
            <h2 className="text-xl font-extrabold">Your chapter is protected</h2>
            <p className="text-sm text-white/60">
              Version {versions} of “{title.trim()}” is now permanently recorded on Stellar.
            </p>
          </div>
        </div>
        <FingerprintPreview hash={certificate.hash} registeredHash={certificate.hash} />
        <div className="flex flex-wrap gap-3">
          <Button href={`/certificate/${certificate.txId}`} variant="accent">
            View certificate
          </Button>
          <Button href={`/write/${work.id}`} variant="outline">
            Back to {work.title}
          </Button>
          <Button variant="ghost" onClick={reset}>
            Keep editing
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <FundingNotice address={address} />

      <Card className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-[1fr_9rem]">
          <Field label="Chapter title *" htmlFor="chapter-title">
            <Input
              id="chapter-title"
              value={title}
              maxLength={160}
              disabled={publishing}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Field>
          <Field label="Number *" htmlFor="chapter-number">
            <Input
              id="chapter-number"
              type="number"
              min={1}
              step={1}
              value={number}
              disabled={publishing}
              onChange={(e) => setNumber(e.target.value)}
            />
          </Field>
        </div>

        <Field
          label="Content *"
          htmlFor="chapter-content"
          hint={`${wordCount(content).toLocaleString()} words · The text stays with Staries; only its fingerprint goes on the blockchain.`}
        >
          <Textarea
            id="chapter-content"
            rows={16}
            value={content}
            disabled={publishing}
            onChange={(e) => setContent(e.target.value)}
            className="font-serif text-base leading-relaxed"
          />
        </Field>

        <FingerprintPreview hash={hash} registeredHash={latest?.hash} />

        {latest && (
          <p className="flex items-center gap-2 text-xs text-white/55">
            <Badge tone="success">Protected · v{versions}</Badge>
            Last registered {new Date(latest.registeredAt).toLocaleString()}
          </p>
        )}

        {formError && <Alert tone="error">{formError}</Alert>}
        {error && <Alert tone="error" title="Could not publish">{error}</Alert>}
        {notice && !publishing && <Alert tone="success">{notice}</Alert>}

        {publishing ? (
          <PublishProgress step={step} />
        ) : (
          <div className="flex flex-wrap items-center justify-end gap-3">
            <Button href={`/write/${work.id}`} variant="ghost">
              Back
            </Button>
            <Button variant="outline" onClick={handleSaveDraft}>
              Save draft
            </Button>
            <Button variant="accent" onClick={handlePublish} disabled={unchanged}>
              {unchanged
                ? 'Already protected'
                : versions > 0
                  ? `Publish new version (v${versions + 1})`
                  : 'Publish & protect'}
            </Button>
          </div>
        )}
        {publishing && (
          <p className="flex items-center gap-2 text-xs text-white/50">
            <Spinner /> Please keep this tab open.
          </p>
        )}
      </Card>
    </div>
  )
}
