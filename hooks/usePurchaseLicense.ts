'use client'

import { useCallback, useState } from 'react'
import { describeStellarError } from '@/lib/stellar/horizon'
import { payForLicense, type LicensePaymentReceipt } from '@/lib/stellar/payments'
import type { LicenseKind, Work } from '@/lib/types'
import { useLibraryStore } from '@/store/libraryStore'
import { useStellarSigner } from './useStellarSigner'

export type PurchaseStatus = 'idle' | 'paying' | 'done' | 'error'

/** Buys a license: pays the author directly on Stellar, then records the purchase. */
export function usePurchaseLicense() {
  const sign = useStellarSigner()
  const addPurchase = useLibraryStore((s) => s.addPurchase)

  const [status, setStatus] = useState<PurchaseStatus>('idle')
  const [kind, setKind] = useState<LicenseKind | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [receipt, setReceipt] = useState<LicensePaymentReceipt | null>(null)

  const buy = useCallback(
    async (params: { work: Work; kind: LicenseKind; buyerAddress: string }) => {
      const { work, kind, buyerAddress } = params
      const amount = work.offers[kind]
      if (!amount || amount <= 0) {
        setError('This license is not available for purchase.')
        setStatus('error')
        return
      }

      setKind(kind)
      setError(null)
      setReceipt(null)
      setStatus('paying')
      try {
        const result = await payForLicense({
          buyerAddress,
          authorAddress: work.authorAddress,
          amount,
          workId: work.id,
          sign,
        })
        addPurchase({
          workId: work.id,
          kind,
          buyerAddress,
          authorAddress: work.authorAddress,
          amount,
          txId: result.txId,
        })
        setReceipt(result)
        setStatus('done')
      } catch (e) {
        setError(describeStellarError(e))
        setStatus('error')
      }
    },
    [sign, addPurchase]
  )

  return { status, kind, error, receipt, buy }
}
