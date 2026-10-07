'use client'

import { useCallback } from 'react'
import { StellarWalletsKit } from '@/lib/walletKit'
import { NETWORK_PASSPHRASE } from '@/lib/stellar/config'
import type { TransactionSigner } from '@/lib/stellar/registry'
import { useWalletStore } from '@/store/walletStore'

/**
 * Returns a `TransactionSigner` backed by the connected wallet.
 * The private key never reaches Staries: the wallet signs, we only submit.
 */
export function useStellarSigner(): TransactionSigner {
  const address = useWalletStore((s) => s.address)

  return useCallback(
    async (xdr: string) => {
      if (!address) throw new Error('Connect your wallet first')
      const { signedTxXdr } = await StellarWalletsKit.signTransaction(xdr, {
        networkPassphrase: NETWORK_PASSPHRASE,
        address,
      })
      return signedTxXdr
    },
    [address]
  )
}
