'use client'

import { Input } from '@/components/ui/Field'
import { LICENSE_KINDS, type LicenseKind, type LicenseOffers } from '@/lib/types'
import { PAYMENT_ASSET_CODE } from '@/lib/stellar/payments'

/**
 * Lets the author decide how others may use the work and at what price.
 * Personal reading is always free (it is how readers discover the work);
 * every other license is opt-in and paid directly to the author's wallet.
 */
export default function LicenseOffersEditor({
  value,
  onChange,
}: {
  value: LicenseOffers
  onChange: (next: LicenseOffers) => void
}) {
  function setOffer(kind: LicenseKind, price: number | null) {
    onChange({ ...value, [kind]: price })
  }

  return (
    <fieldset className="space-y-3">
      <legend className="mb-1 text-sm font-bold">Licenses you offer</legend>
      {LICENSE_KINDS.map(({ kind, label, description }) => {
        const price = value[kind]
        const offered = price !== null
        const isReading = kind === 'reading'
        const inputId = `offer-${kind}`

        return (
          <div
            key={kind}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-ink-deep px-4 py-3"
          >
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold">{label}</p>
              <p className="text-xs text-white/50">{description}</p>
            </div>

            {isReading ? (
              <span className="text-sm font-bold text-emerald-300">Always free</span>
            ) : (
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-sm text-white/70">
                  <input
                    type="checkbox"
                    checked={offered}
                    onChange={(e) => setOffer(kind, e.target.checked ? 10 : null)}
                    className="h-4 w-4 accent-brand"
                  />
                  Offer
                </label>
                <div className="flex items-center gap-2">
                  <label htmlFor={inputId} className="sr-only">
                    {label} price in {PAYMENT_ASSET_CODE}
                  </label>
                  <Input
                    id={inputId}
                    type="number"
                    min={0.0000001}
                    step="any"
                    disabled={!offered}
                    value={price ?? ''}
                    onChange={(e) => {
                      const next = Number(e.target.value)
                      setOffer(kind, Number.isFinite(next) && next > 0 ? next : 0)
                    }}
                    className="w-28 !py-2 text-right"
                  />
                  <span className="text-xs font-bold text-white/60">
                    {PAYMENT_ASSET_CODE}
                  </span>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </fieldset>
  )
}

/** Offers with a price of 0 or less are invalid and must not be saved. */
export function hasInvalidOffer(offers: LicenseOffers): boolean {
  return LICENSE_KINDS.some(
    ({ kind }) => kind !== 'reading' && offers[kind] !== null && !(offers[kind]! > 0)
  )
}
