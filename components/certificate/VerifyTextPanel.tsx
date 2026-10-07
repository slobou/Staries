'use client'

import { useState } from 'react'
import Alert from '@/components/ui/Alert'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { Field, Textarea } from '@/components/ui/Field'
import { shortHash } from '@/lib/stellar/hash'
import {
  verifyContent,
  type OnChainCertificate,
  type VerificationResult,
} from '@/lib/stellar/registry'

/**
 * "Is this exactly the text that was registered?"
 * Hashing happens in the browser; the text is never uploaded anywhere.
 */
export default function VerifyTextPanel({
  certificate,
}: {
  certificate: OnChainCertificate
}) {
  const [text, setText] = useState('')
  const [result, setResult] = useState<VerificationResult | null>(null)
  const [checking, setChecking] = useState(false)

  async function handleVerify() {
    setChecking(true)
    try {
      setResult(await verifyContent(text, certificate))
    } finally {
      setChecking(false)
    }
  }

  return (
    <Card className="space-y-5">
      <div>
        <h3 className="text-lg font-extrabold">Check a text against this certificate</h3>
        <p className="mt-1 text-sm text-white/60">
          Paste the chapter exactly as published. Changing even a single letter
          produces a completely different fingerprint.
        </p>
      </div>

      <Field label="Text to verify" htmlFor="verify-text">
        <Textarea
          id="verify-text"
          rows={7}
          value={text}
          onChange={(e) => {
            setText(e.target.value)
            setResult(null)
          }}
          className="font-serif text-base"
        />
      </Field>

      <Button variant="primary" disabled={!text.trim() || checking} onClick={handleVerify}>
        {checking ? 'Checking…' : 'Verify text'}
      </Button>

      {result &&
        (result.matches ? (
          <Alert tone="success" title="Match — this is the registered text">
            Its fingerprint is identical to the one recorded on Stellar on{' '}
            {new Date(certificate.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}.
          </Alert>
        ) : (
          <Alert tone="error" title="No match — this text is different">
            <p>
              Fingerprint of your text:{' '}
              <span className="font-mono">{shortHash(result.computedHash, 12)}</span>
            </p>
            <p>
              Registered fingerprint:{' '}
              <span className="font-mono">{shortHash(certificate.hash, 12)}</span>
            </p>
          </Alert>
        ))}
    </Card>
  )
}
