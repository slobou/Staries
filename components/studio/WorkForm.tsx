'use client'

import { useRouter } from 'next/navigation'
import { useState, type FormEvent } from 'react'
import Alert from '@/components/ui/Alert'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { Field, Input, Select, Textarea } from '@/components/ui/Field'
import { GENRES, LANGUAGES } from '@/lib/catalog'
import { DEFAULT_OFFERS, useLibraryStore } from '@/store/libraryStore'
import type { LicenseOffers } from '@/lib/types'
import LicenseOffersEditor, { hasInvalidOffer } from './LicenseOffersEditor'

export default function WorkForm({ authorAddress }: { authorAddress: string }) {
  const router = useRouter()
  const createWork = useLibraryStore((s) => s.createWork)

  const [title, setTitle] = useState('')
  const [authorName, setAuthorName] = useState('')
  const [synopsis, setSynopsis] = useState('')
  const [genre, setGenre] = useState<string>(GENRES[0])
  const [language, setLanguage] = useState<string>(LANGUAGES[0])
  const [offers, setOffers] = useState<LicenseOffers>(DEFAULT_OFFERS)
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (hasInvalidOffer(offers)) {
      setError('Every license you offer needs a price greater than zero.')
      return
    }
    const work = createWork({
      authorAddress,
      authorName: authorName.trim(),
      title: title.trim(),
      synopsis: synopsis.trim(),
      genre,
      language,
      offers,
    })
    router.push(`/write/${work.id}`)
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card className="space-y-6">
        <Field label="Title *" htmlFor="title">
          <Input
            id="title"
            required
            maxLength={120}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Field>

        <Field
          label="Author name *"
          htmlFor="author"
          hint="The name readers will see. It can be a pen name."
        >
          <Input
            id="author"
            required
            maxLength={80}
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
          />
        </Field>

        <Field label="Synopsis *" htmlFor="synopsis">
          <Textarea
            id="synopsis"
            required
            rows={5}
            maxLength={2000}
            value={synopsis}
            onChange={(e) => setSynopsis(e.target.value)}
          />
        </Field>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Genre *" htmlFor="genre">
            <Select id="genre" value={genre} onChange={(e) => setGenre(e.target.value)}>
              {GENRES.map((g) => (
                <option key={g}>{g}</option>
              ))}
            </Select>
          </Field>
          <Field label="Language *" htmlFor="language">
            <Select
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              {LANGUAGES.map((l) => (
                <option key={l}>{l}</option>
              ))}
            </Select>
          </Field>
        </div>

        <LicenseOffersEditor value={offers} onChange={setOffers} />

        {error && <Alert tone="error">{error}</Alert>}

        <div className="flex justify-end gap-3">
          <Button href="/write" variant="ghost">
            Cancel
          </Button>
          <Button type="submit" variant="accent">
            Create Star
          </Button>
        </div>
      </Card>
    </form>
  )
}
