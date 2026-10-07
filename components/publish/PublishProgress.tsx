import Icon from '@/components/ui/Icon'
import Spinner from '@/components/ui/Spinner'
import type { PublishStep } from '@/hooks/usePublishChapter'

const STEPS: Array<{ id: PublishStep; label: string; detail: string }> = [
  { id: 'hashing', label: 'Creating fingerprint', detail: 'SHA-256 of your text, computed in your browser' },
  { id: 'signing', label: 'Waiting for your signature', detail: 'Approve the transaction in your wallet' },
  { id: 'submitting', label: 'Recording on Stellar', detail: 'Usually takes 3–5 seconds' },
  { id: 'confirming', label: 'Confirming certificate', detail: 'Reading the record back from the network' },
]

const ORDER: PublishStep[] = ['hashing', 'signing', 'submitting', 'confirming', 'done']

export default function PublishProgress({ step }: { step: PublishStep }) {
  const current = ORDER.indexOf(step)

  return (
    <ol className="space-y-3" aria-live="polite" aria-label="Publishing progress">
      {STEPS.map(({ id, label, detail }, index) => {
        const done = current > index
        const active = current === index
        return (
          <li key={id} className="flex items-start gap-3">
            <span
              className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                done
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : active
                    ? 'bg-star/20 text-star'
                    : 'bg-white/5 text-white/25'
              }`}
            >
              {done ? (
                <Icon name="check" className="h-3.5 w-3.5" />
              ) : active ? (
                <Spinner className="h-3.5 w-3.5" />
              ) : (
                <span className="text-xs font-bold">{index + 1}</span>
              )}
            </span>
            <div className={active || done ? '' : 'opacity-40'}>
              <p className="text-sm font-bold">{label}</p>
              <p className="text-xs text-white/55">{detail}</p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
