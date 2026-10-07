'use client'

import { useEffect, useState } from 'react'
import { fetchCertificate, type OnChainCertificate } from '@/lib/stellar/registry'
import { StellarNotFoundError } from '@/lib/stellar/horizon'

export type CertificateState =
  | { status: 'loading' }
  | { status: 'ok'; certificate: OnChainCertificate }
  | { status: 'not-found'; message: string }
  | { status: 'invalid'; message: string }

/**
 * Loads a certificate from the Stellar network.
 * Use `key={txId}` on the consuming component to reset when the id changes.
 */
export function useCertificate(txId: string): CertificateState {
  const [state, setState] = useState<CertificateState>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false
    fetchCertificate(txId)
      .then((certificate) => {
        if (!cancelled) setState({ status: 'ok', certificate })
      })
      .catch((error: unknown) => {
        if (cancelled) return
        const message = error instanceof Error ? error.message : 'Unknown error'
        setState(
          error instanceof StellarNotFoundError
            ? { status: 'not-found', message }
            : { status: 'invalid', message }
        )
      })
    return () => {
      cancelled = true
    }
  }, [txId])

  return state
}

/** Extracts a transaction id from a bare id or a pasted explorer/certificate URL. */
export function extractTxId(input: string): string | null {
  return input.match(/[0-9a-f]{64}/i)?.[0].toLowerCase() ?? null
}
