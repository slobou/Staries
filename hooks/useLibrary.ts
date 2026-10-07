'use client'

import { useEffect, useSyncExternalStore } from 'react'
import { useLibraryStore } from '@/store/libraryStore'

/**
 * `true` once the persisted library has been loaded from localStorage.
 * Pages must wait for it before deciding something "does not exist",
 * otherwise a hard refresh would flash a false "not found".
 */
export function useLibraryReady(): boolean {
  return useSyncExternalStore(
    (onChange) => useLibraryStore.persist.onFinishHydration(onChange),
    () => useLibraryStore.persist.hasHydrated(),
    () => false
  )
}

/** Mount once (root layout): loads the persisted library on the client. */
export function useLibraryHydration(): void {
  useEffect(() => {
    void useLibraryStore.persist.rehydrate()
  }, [])
}
