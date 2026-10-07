'use client'

import { useParams } from 'next/navigation'
import CertificateView from '@/components/certificate/CertificateView'
import PageShell from '@/components/ui/PageShell'

export default function CertificatePage() {
  const { txId } = useParams<{ txId: string }>()

  return (
    <PageShell
      eyebrow="Public certificate"
      title="Proof of authorship"
      description="This record was read live from the Stellar blockchain. It does not depend on Staries to stay true."
      width="max-w-3xl"
    >
      <CertificateView key={txId} txId={txId} />
    </PageShell>
  )
}
