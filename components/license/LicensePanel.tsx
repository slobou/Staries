'use client'

import { useMemo } from 'react'
import Alert from '@/components/ui/Alert'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Icon from '@/components/ui/Icon'
import Spinner from '@/components/ui/Spinner'
import FundingNotice from '@/components/wallet/FundingNotice'
import { usePurchaseLicense } from '@/hooks/usePurchaseLicense'
import { useWallet } from '@/hooks/useWallet'
import { PAYMENT_ASSET_CODE } from '@/lib/stellar/payments'
import { LICENSE_KINDS, type Work } from '@/lib/types'
import { useLibraryStore } from '@/store/libraryStore'

/** Everything a visitor can do with a work, and what it costs. */
export default function LicensePanel({ work }: { work: Work }) {
  const { address, isConnected, ready, connecting, connect } = useWallet()
  const purchases = useLibraryStore((s) => s.purchases)
  const { status, kind: payingKind, error, receipt, buy } = usePurchaseLicense()

  const owned = useMemo(
    () =>
      new Set(
        purchases
          .filter((p) => p.workId === work.id && p.buyerAddress === address)
          .map((p) => p.kind)
      ),
    [purchases, work.id, address]
  )

  const isAuthor = isConnected && address === work.authorAddress
  const busy = status === 'paying'

  return (
    <Card className="space-y-5">
      <div>
        <h2 className="text-xl font-extrabold">Licenses</h2>
        <p className="mt-1 text-sm text-white/60">
          Payments go straight from your wallet to the author&apos;s wallet. No
          intermediary holds the money, and the payment is publicly recorded.
        </p>
      </div>

      <ul className="space-y-3">
        {LICENSE_KINDS.map(({ kind, label, description }) => {
          const price = work.offers[kind]
          const offered = price !== null
          return (
            <li
              key={kind}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-ink-deep px-4 py-3"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold">{label}</p>
                <p className="text-xs text-white/50">{description}</p>
              </div>

              {!offered ? (
                <span className="text-xs font-bold text-white/35">Not offered</span>
              ) : kind === 'reading' || price === 0 ? (
                <Badge tone="success">Free</Badge>
              ) : owned.has(kind) ? (
                <Badge tone="success">
                  <Icon name="check" className="h-3 w-3" /> Licensed
                </Badge>
              ) : (
                <div className="flex items-center gap-3">
                  <span className="text-sm font-extrabold">
                    {price} {PAYMENT_ASSET_CODE}
                  </span>
                  <Button
                    size="sm"
                    variant="accent"
                    disabled={!ready || busy || isAuthor || !isConnected}
                    onClick={() =>
                      address && buy({ work, kind, buyerAddress: address })
                    }
                  >
                    {busy && payingKind === kind ? (
                      <>
                        <Spinner /> Paying…
                      </>
                    ) : (
                      'Buy license'
                    )}
                  </Button>
                </div>
              )}
            </li>
          )
        })}
      </ul>

      {ready && !isConnected && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-brand/15 px-4 py-3 text-sm">
          <span>Connect a wallet to buy a license.</span>
          <Button size="sm" variant="primary" onClick={connect} disabled={connecting}>
            {connecting ? 'Connecting…' : 'Connect wallet'}
          </Button>
        </div>
      )}
      {isAuthor && (
        <Alert tone="info">This is your own work, so you cannot buy a license for it.</Alert>
      )}
      {isConnected && address && !isAuthor && <FundingNotice address={address} />}
      {error && (
        <Alert tone="error" title="Payment failed">
          {error}
        </Alert>
      )}
      {status === 'done' && receipt && (
        <Alert tone="success" title="License purchased">
          The author was paid directly.{' '}
          <a
            href={receipt.explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold underline underline-offset-4"
          >
            View the payment on Stellar Expert
          </a>
        </Alert>
      )}
    </Card>
  )
}
