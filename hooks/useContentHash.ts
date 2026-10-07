'use client'

import { useEffect, useState } from 'react'
import { sha256Hex } from '@/lib/stellar/hash'

/**
 * Live SHA-256 fingerprint of `content` (debounced). Returns `null` while the
 * content is empty or the hash is still being computed.
 */
export function useContentHash(content: string, delayMs = 150): string | null {
  const [computed, setComputed] = useState<{ source: string; hash: string } | null>(
    null
  )

  useEffect(() => {
    if (!content.trim()) return
    let cancelled = false
    const timer = setTimeout(async () => {
      const hash = await sha256Hex(content)
      if (!cancelled) setComputed({ source: content, hash })
    }, delayMs)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [content, delayMs])

  // Ignore a stale hash that belongs to previous text.
  return content.trim() && computed?.source === content ? computed.hash : null
}
