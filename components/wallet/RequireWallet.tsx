'use client'

import type { ReactNode } from 'react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Icon from '@/components/ui/Icon'
import { useWallet } from '@/hooks/useWallet'

/**
 * Renders `children` only when a wallet is connected, passing the address.
 * Otherwise shows a friendly connect prompt. Authors never need to know what
 * a "wallet" is beyond this one step: it is their signature on the proof.
 */
export default function RequireWallet({
  purpose = 'continue',
  children,
}: {
  /** Finishes the sentence "Connect your wallet to …". */
  purpose?: string
  children: (address: string) => ReactNode
}) {
  const { address, isConnected, ready, connecting, connect } = useWallet()

  if (!ready) return null

  if (!isConnected || !address) {
    return (
      <Card className="mx-auto flex max-w-lg flex-col items-center gap-4 py-12 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand/30 text-brand-light">
          <Icon name="wallet" className="h-7 w-7" />
        </span>
        <h2 className="text-xl font-extrabold">Connect your wallet to {purpose}</h2>
        <p className="text-sm text-white/65">
          Your Stellar wallet is your signature: it proves that the work is
          yours. Staries never sees your private keys.
        </p>
        <Button variant="accent" onClick={connect} disabled={connecting}>
          {connecting ? 'Connecting…' : 'Connect wallet'}
        </Button>
      </Card>
    )
  }

  return <>{children(address)}</>
}
