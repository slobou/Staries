'use client'

import { useCallback, useEffect, useState } from 'react'
import { fundWithFriendbot, getXlmBalance } from '@/lib/stellar/horizon'
import { describeStellarError } from '@/lib/stellar/horizon'

interface AccountBalanceState {
  /** XLM balance, `null` if the account is not active on the network yet. */
  balance: string | null
  loading: boolean
  error: string | null
  funding: boolean
  refresh: () => Promise<void>
  /** Testnet only: activates and funds the account with free test XLM. */
  fund: () => Promise<void>
}

export function useAccountBalance(address: string | null): AccountBalanceState {
  const [balance, setBalance] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [funding, setFunding] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    if (!address) return
    setLoading(true)
    setError(null)
    try {
      setBalance(await getXlmBalance(address))
    } catch (e) {
      setError(describeStellarError(e))
    } finally {
      setLoading(false)
    }
  }, [address])

  const fund = useCallback(async () => {
    if (!address) return
    setFunding(true)
    setError(null)
    try {
      await fundWithFriendbot(address)
      await refresh()
    } catch (e) {
      setError(describeStellarError(e))
    } finally {
      setFunding(false)
    }
  }, [address, refresh])

  useEffect(() => {
    // Reading from an external system (the network) on address change.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refresh()
  }, [refresh])

  return { balance, loading, error, funding, refresh, fund }
}
