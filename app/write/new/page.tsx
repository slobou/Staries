'use client'

import PageShell from '@/components/ui/PageShell'
import WorkForm from '@/components/studio/WorkForm'
import RequireWallet from '@/components/wallet/RequireWallet'

export default function NewWorkPage() {
  return (
    <PageShell
      eyebrow="Author studio"
      title="New Star"
      description="Tell readers about your work and decide how others can license it. You can add chapters next."
      width="max-w-3xl"
    >
      <RequireWallet purpose="create a Star">
        {(address) => <WorkForm authorAddress={address} />}
      </RequireWallet>
    </PageShell>
  )
}
