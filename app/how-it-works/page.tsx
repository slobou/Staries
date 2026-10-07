import type { Metadata } from 'next'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import PageShell from '@/components/ui/PageShell'

export const metadata: Metadata = { title: 'How it works' }

const STEPS = [
  {
    title: 'Write and publish',
    text: 'Write or paste your chapter and press “Publish & protect”. Nothing else to learn.',
  },
  {
    title: 'Your browser creates a fingerprint',
    text: 'The text is turned into a short code (a SHA-256 hash). The same text always gives the same code; change one letter and the code is completely different.',
    sample: '9f2c…a41e',
  },
  {
    title: 'You sign with your wallet',
    text: 'Your wallet approves a tiny Stellar transaction that records the fingerprint with your public address. Staries never sees your keys.',
  },
  {
    title: 'Stellar timestamps it',
    text: 'The network adds the transaction to a public ledger. From that moment the record cannot be altered or removed by anyone, including us.',
  },
  {
    title: 'You get a certificate',
    text: 'A public page with the author, date and fingerprint. Anyone can open it and compare it with the real text, with no account.',
  },
]

export default function HowItWorksPage() {
  return (
    <PageShell
      eyebrow="How it works"
      title="From manuscript to proof in about five seconds"
      description="What happens when you press “Publish & protect”, without the jargon."
      width="max-w-3xl"
    >
      <ol className="relative space-y-4 border-l border-white/10 pl-8">
        {STEPS.map((step, index) => (
          <li key={step.title} className="relative">
            <span className="absolute -left-[3.2rem] flex h-9 w-9 items-center justify-center rounded-full bg-star font-black text-ink">
              {index + 1}
            </span>
            <Card className="space-y-2">
              <h2 className="text-lg font-extrabold">{step.title}</h2>
              <p className="text-sm text-white/70">{step.text}</p>
              {step.sample && (
                <p className="inline-block rounded-lg bg-ink px-3 py-1.5 font-mono text-sm text-star">
                  {step.sample}
                </p>
              )}
            </Card>
          </li>
        ))}
      </ol>

      <Card className="mt-10 space-y-2 border-brand/40 bg-brand/15">
        <h2 className="font-extrabold">Is my text public?</h2>
        <p className="text-sm text-white/75">
          Not on the blockchain. Only the fingerprint is written to Stellar, never the text
          itself. Readers see a chapter only in Staries, once you publish it.
        </p>
      </Card>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button href="/write" variant="accent">
          Try it now
        </Button>
        <Button href="/verify" variant="outline">
          Verify a work
        </Button>
      </div>
    </PageShell>
  )
}
