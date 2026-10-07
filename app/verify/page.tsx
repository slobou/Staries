'use client'

import { useRouter } from 'next/navigation'
import { useState, type FormEvent } from 'react'
import Alert from '@/components/ui/Alert'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { Field, Input } from '@/components/ui/Field'
import PageShell from '@/components/ui/PageShell'
import { extractTxId } from '@/hooks/useCertificate'

export default function VerifyPage() {
  const router = useRouter()
  const [input, setInput] = useState('')
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const txId = extractTxId(input)
    if (!txId) {
      setError('That does not look like a certificate link or a transaction id.')
      return
    }
    router.push(`/certificate/${txId}`)
  }

  return (
    <PageShell
      eyebrow="Verification"
      title="Verify a work"
      description="Check who published a work, when, and whether the text you have is exactly the one that was registered. No account needed."
      width="max-w-2xl"
    >
      <form onSubmit={handleSubmit}>
        <Card className="space-y-5">
          <Field
            label="Certificate link or transaction id"
            htmlFor="tx"
            hint="Paste the link the author shared, or a Stellar Expert transaction link."
          >
            <Input
              id="tx"
              required
              autoComplete="off"
              spellCheck={false}
              value={input}
              onChange={(e) => {
                setInput(e.target.value)
                setError(null)
              }}
              placeholder="https://…/certificate/76eec1fe…"
              className="font-mono"
            />
          </Field>
          {error && <Alert tone="error">{error}</Alert>}
          <Button type="submit" variant="accent">
            Find certificate
          </Button>
        </Card>
      </form>
    </PageShell>
  )
}
