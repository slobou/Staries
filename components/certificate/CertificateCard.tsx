'use client'

import { useState } from 'react'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Icon from '@/components/ui/Icon'
import StarShape from '@/components/brand/StarShape'
import { STELLAR_NETWORK } from '@/lib/stellar/config'
import { getAccountUrl, type OnChainCertificate } from '@/lib/stellar/registry'

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <dt className="text-xs font-bold uppercase tracking-wider text-white/45">{label}</dt>
      <dd className="break-all text-sm">{children}</dd>
    </div>
  )
}

/**
 * Public certificate of authorship. Every value shown here was read from the
 * Stellar network — it is exactly what any third party would see.
 */
export default function CertificateCard({
  certificate,
  title,
  subtitle,
}: {
  certificate: OnChainCertificate
  /** Optional work title (only known when the work is in the local library). */
  title?: string
  subtitle?: string
}) {
  const [copied, setCopied] = useState(false)

  async function copyLink() {
    await navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <article className="relative overflow-hidden rounded-3xl border border-star/30 bg-ink-raised/70 p-8">
      <StarShape className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 text-star/10" />

      <header className="relative flex flex-wrap items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-star">
          <StarShape className="h-4 w-4" /> Certificate of authorship
        </p>
        <Badge tone="success">
          <Icon name="check" className="h-3 w-3" /> Verified on Stellar
        </Badge>
      </header>

      {title && (
        <div className="relative mt-6">
          <h2 className="text-2xl font-black sm:text-3xl">{title}</h2>
          {subtitle && <p className="mt-1 text-white/60">{subtitle}</p>}
        </div>
      )}

      <dl className="relative mt-8 grid gap-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Row label="Content fingerprint (SHA-256)">
            <span className="font-mono text-brand-light">{certificate.hash}</span>
          </Row>
        </div>
        <Row label="Published by">
          <a
            href={getAccountUrl(certificate.author)}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-white/90 underline decoration-white/30 underline-offset-4 hover:text-star"
          >
            {certificate.author}
          </a>
        </Row>
        <Row label="Registered on">
          {new Date(certificate.createdAt).toLocaleString(undefined, {
            dateStyle: 'long',
            timeStyle: 'medium',
          })}
          <span className="block text-xs text-white/45">
            Timestamp set by the Stellar network (ledger {certificate.ledger.toLocaleString()})
          </span>
        </Row>
        <div className="sm:col-span-2">
          <Row label="Transaction">
            <span className="font-mono text-white/80">{certificate.txId}</span>
          </Row>
        </div>
      </dl>

      <footer className="relative mt-8 flex flex-wrap items-center gap-3 border-t border-white/10 pt-6">
        <Button href={certificate.explorerUrl} external variant="accent" size="sm">
          View on Stellar Expert <Icon name="external" className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={copyLink}>
          {copied ? 'Link copied!' : 'Copy certificate link'}
        </Button>
        <p className="ml-auto text-xs text-white/45">
          Network: Stellar {STELLAR_NETWORK === 'testnet' ? 'Testnet' : 'Mainnet'}
        </p>
      </footer>
    </article>
  )
}
