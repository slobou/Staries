'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import Badge from '@/components/ui/Badge'
import Card from '@/components/ui/Card'
import EmptyState from '@/components/ui/EmptyState'
import { useLibraryReady } from '@/hooks/useLibrary'
import { PAYMENT_ASSET_CODE } from '@/lib/stellar/payments'
import { getTransactionUrl } from '@/lib/stellar/registry'
import { shortHash } from '@/lib/stellar/hash'
import { LICENSE_KINDS, type LicenseKind, type LicensePurchase } from '@/lib/types'
import { truncateAddress } from '@/utils/stellarUtils'
import { useLibraryStore } from '@/store/libraryStore'

const KIND_LABEL = Object.fromEntries(
  LICENSE_KINDS.map(({ kind, label }) => [kind, label])
) as Record<LicenseKind, string>

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-extrabold">{title}</h2>
      {children}
    </section>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Card className="space-y-1 !p-5">
      <p className="text-xs font-bold uppercase tracking-wider text-white/45">{label}</p>
      <p className="text-3xl font-black text-star">{value}</p>
    </Card>
  )
}

/** On-chain history of one wallet: records it signed, licenses it bought and sold. */
export default function ActivityView({ address }: { address: string }) {
  const ready = useLibraryReady()
  const works = useLibraryStore((s) => s.works)
  const chapters = useLibraryStore((s) => s.chapters)
  const purchases = useLibraryStore((s) => s.purchases)

  const records = useMemo(
    () =>
      chapters
        .flatMap((chapter) => {
          const work = works.find((w) => w.id === chapter.workId)
          if (!work || work.authorAddress !== address) return []
          return chapter.registrations.map((registration, index) => ({
            chapter,
            work,
            registration,
            version: index + 1,
          }))
        })
        .sort((a, b) => b.registration.registeredAt.localeCompare(a.registration.registeredAt)),
    [chapters, works, address]
  )

  const bought = purchases.filter((p) => p.buyerAddress === address)
  const sold = purchases.filter((p) => p.authorAddress === address)
  const income = sold.reduce((sum, p) => sum + p.amount, 0)
  const titleOf = (workId: string) => works.find((w) => w.id === workId)?.title ?? 'Unknown work'

  if (!ready) return null

  return (
    <div className="space-y-12">
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Authorship records" value={String(records.length)} />
        <Stat label="Licenses sold" value={String(sold.length)} />
        <Stat label="License income" value={`${income} ${PAYMENT_ASSET_CODE}`} />
      </div>

      <Section title="Authorship records">
        {records.length === 0 ? (
          <EmptyState
            title="No records yet"
            description="Publish a chapter and its certificate will appear here."
          />
        ) : (
          <ul className="divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/10 bg-ink-raised/60">
            {records.map(({ chapter, work, registration, version }) => (
              <li key={registration.txId}>
                <Link
                  href={`/certificate/${registration.txId}`}
                  className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 transition hover:bg-white/5"
                >
                  <span>
                    <span className="block font-bold">{work.title}</span>
                    <span className="text-sm text-white/55">
                      Chapter {chapter.number}: {chapter.title}
                    </span>
                  </span>
                  <span className="flex items-center gap-3 text-xs text-white/50">
                    <Badge tone="brand">v{version}</Badge>
                    <span className="font-mono">{shortHash(registration.hash, 6)}</span>
                    {new Date(registration.registeredAt).toLocaleString()}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title="Licenses I sold">
        {sold.length === 0 ? (
          <p className="text-sm text-white/50">No licenses sold yet.</p>
        ) : (
          <PurchaseList purchases={sold} titleOf={titleOf} counterparty="buyerAddress" />
        )}
      </Section>

      <Section title="Licenses I bought">
        {bought.length === 0 ? (
          <p className="text-sm text-white/50">You have not bought any licenses yet.</p>
        ) : (
          <PurchaseList purchases={bought} titleOf={titleOf} counterparty="authorAddress" />
        )}
      </Section>
    </div>
  )
}

function PurchaseList({
  purchases,
  titleOf,
  counterparty,
}: {
  purchases: LicensePurchase[]
  titleOf: (workId: string) => string
  counterparty: 'buyerAddress' | 'authorAddress'
}) {
  return (
    <ul className="divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/10 bg-ink-raised/60">
      {purchases.map((p) => (
        <li key={p.id} className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
          <span>
            <span className="block font-bold">{titleOf(p.workId)}</span>
            <span className="text-sm text-white/55">
              {KIND_LABEL[p.kind]} · {counterparty === 'buyerAddress' ? 'from' : 'to'}{' '}
              <span className="font-mono">{truncateAddress(p[counterparty])}</span>
            </span>
          </span>
          <span className="flex items-center gap-4 text-sm">
            <span className="font-extrabold text-star">
              {p.amount} {PAYMENT_ASSET_CODE}
            </span>
            <a
              href={getTransactionUrl(p.txId)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-white/50 underline underline-offset-4 hover:text-white"
            >
              Payment proof
            </a>
          </span>
        </li>
      ))}
    </ul>
  )
}
