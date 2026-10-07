'use client'

import ActivityView from '@/components/activity/ActivityView'
import PageShell from '@/components/ui/PageShell'
import RequireWallet from '@/components/wallet/RequireWallet'

export default function ActivityPage() {
  return (
    <PageShell
      eyebrow="History"
      title="Activity"
      description="Your authorship records, license income and purchases. Every item links to a public proof on Stellar."
      width="max-w-4xl"
    >
      <RequireWallet purpose="see your activity">
        {(address) => <ActivityView address={address} />}
      </RequireWallet>
    </PageShell>
  )
}
