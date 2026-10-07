'use client'

import Button from '@/components/ui/Button'
import PageShell from '@/components/ui/PageShell'
import Studio from '@/components/studio/Studio'
import RequireWallet from '@/components/wallet/RequireWallet'

export default function StudioPage() {
  return (
    <PageShell
      eyebrow="Author studio"
      title="My Stars"
      description="Everything you have written, and the proof of authorship behind it."
      actions={
        <Button href="/write/new" variant="accent">
          New Star
        </Button>
      }
    >
      <RequireWallet purpose="open your studio">
        {(address) => <Studio address={address} />}
      </RequireWallet>
    </PageShell>
  )
}
