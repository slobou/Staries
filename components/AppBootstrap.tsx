'use client'

import { useEffect } from 'react'
import { initWalletKit } from '@/lib/walletKit'
import { useLibraryHydration } from '@/hooks/useLibrary'
import { useWalletStore } from '@/store/walletStore'

/**
 * Client-side startup, mounted once in the root layout:
 *  - initializes the Stellar wallet kit
 *  - restores the persisted wallet session and the persisted library
 * Renders nothing.
 */
export default function AppBootstrap() {
  useLibraryHydration()

  useEffect(() => {
    initWalletKit()
    void useWalletStore.persist.rehydrate()
  }, [])

  return null
}
