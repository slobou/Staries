import { shortHash } from '@/lib/stellar/hash'

/** Shows the live fingerprint of the text and how it relates to the last on-chain version. */
export default function FingerprintPreview({
  hash,
  registeredHash,
}: {
  hash: string | null
  registeredHash?: string
}) {
  const status = !hash
    ? null
    : !registeredHash
      ? 'Not registered yet'
      : hash === registeredHash
        ? 'Matches the registered version'
        : 'Changed since the last registered version'

  return (
    <div className="rounded-xl border border-white/10 bg-ink-deep px-4 py-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-bold uppercase tracking-wider text-white/45">
          Content fingerprint (SHA-256)
        </p>
        {status && (
          <p
            className={`text-xs font-bold ${
              hash === registeredHash ? 'text-emerald-300' : 'text-star'
            }`}
          >
            {status}
          </p>
        )}
      </div>
      <p className="mt-1 break-all font-mono text-xs text-brand-light">
        {hash ? shortHash(hash, 20) : 'Start writing to generate the fingerprint…'}
      </p>
    </div>
  )
}
