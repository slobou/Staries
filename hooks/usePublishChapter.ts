'use client'

import { useCallback, useState } from 'react'
import { describeStellarError } from '@/lib/stellar/horizon'
import { registerContent, type OnChainCertificate } from '@/lib/stellar/registry'
import { useLibraryStore } from '@/store/libraryStore'
import { useStellarSigner } from './useStellarSigner'

export type PublishStep =
  | 'idle'
  | 'hashing'
  | 'signing'
  | 'submitting'
  | 'confirming'
  | 'done'
  | 'error'

/**
 * Anchors a chapter's current text on Stellar and records the resulting
 * certificate in the library. Each successful call adds one immutable version.
 */
export function usePublishChapter() {
  const sign = useStellarSigner()
  const addRegistration = useLibraryStore((s) => s.addRegistration)

  const [step, setStep] = useState<PublishStep>('idle')
  const [error, setError] = useState<string | null>(null)
  const [certificate, setCertificate] = useState<OnChainCertificate | null>(null)

  const publish = useCallback(
    async (params: { chapterId: string; authorAddress: string; content: string }) => {
      setError(null)
      setCertificate(null)
      setStep('hashing')
      try {
        const cert = await registerContent({
          authorAddress: params.authorAddress,
          content: params.content,
          sign,
          onStep: setStep,
        })
        addRegistration(params.chapterId, {
          txId: cert.txId,
          hash: cert.hash,
          registeredAt: cert.createdAt,
          ledger: cert.ledger,
        })
        setCertificate(cert)
        setStep('done')
        return cert
      } catch (e) {
        setError(describeStellarError(e))
        setStep('error')
        return null
      }
    },
    [sign, addRegistration]
  )

  const reset = useCallback(() => {
    setStep('idle')
    setError(null)
    setCertificate(null)
  }, [])

  return { step, error, certificate, publish, reset }
}
