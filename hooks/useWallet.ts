'use client'

import { useCallback, useState, useSyncExternalStore } from 'react'
import { useWalletStore } from '@/store/walletStore'
import { StellarWalletsKit } from '@/lib/walletKit'

export function useWallet() {
  const { address, isConnected, setAddress, reset } = useWalletStore()
  const [connecting, setConnecting] = useState(false)

  // `true` once the persisted wallet session has been read from localStorage.
  const ready = useSyncExternalStore(
    (onChange) => useWalletStore.persist.onFinishHydration(onChange),
    () => useWalletStore.persist.hasHydrated(),
    () => false
  )

  const connect = useCallback(async () => {
    try {
      setConnecting(true)
      const { address: addr } = await StellarWalletsKit.authModal()
      setAddress(addr)
    } catch {
      // user closed modal or cancelled
    } finally {
      setConnecting(false)
    }
  }, [setAddress])

  const disconnect = useCallback(async () => {
    try {
      await StellarWalletsKit.disconnect()
    } catch {
      // ignore
    }
    reset()
  }, [reset])

  return { address, isConnected, ready, connecting, connect, disconnect }
}
