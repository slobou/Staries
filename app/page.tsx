import type { Metadata } from 'next'
import Card from '@/components/ui/Card'
import PageShell from '@/components/ui/PageShell'

export const metadata: Metadata = { title: 'Glossary' }

const TERMS = [
  ['Certificate', 'A public page that shows who registered a text, when, and its fingerprint. It is rebuilt from the Stellar network.'],
  ['Fingerprint (hash)', 'A short code computed from a text. The same text always gives the same code, and any change gives a different one.'],
  ['Ledger', 'The shared public record of the Stellar network. Once something is written, it cannot be changed.'],
  ['License', 'Permission to use a work in a specific way, such as commercial use, translation or adaptation. Personal reading is free.'],
  ['Public address', 'Your account identifier on Stellar. It starts with “G” and is safe to share. Think of it as an account number.'],
  ['Stellar', 'The public blockchain Staries uses to anchor proofs and send payments quickly and at a very low cost.'],
  ['Star', 'A work published on Staries. Its chapters are protected one by one.'],
  ['Testnet', 'A practice version of Stellar where coins are free and have no value. Staries runs here for now.'],
  ['Transaction', 'A signed action on the network, such as registering a fingerprint or paying for a license.'],
  ['Wallet', 'An app or browser extension that holds your keys and asks for your approval before anything is signed. Staries never sees your keys.'],
  ['XLM (lumens)', 'The native coin of Stellar. It pays the tiny network fee and, for now, license payments.'],
] as const

export default function GlossaryPage() {
  return (
    <PageShell
      eyebrow="Help"
      title="Glossary"
      description="The few technical words you may meet, in plain language."
      width="max-w-3xl"
    >
      <dl className="grid gap-3">
        {TERMS.map(([term, definition]) => (
          <Card key={term} className="space-y-1">
            <dt className="font-extrabold text-star">{term}</dt>
            <dd className="text-sm text-white/70">{definition}</dd>
          </Card>
        ))}
      </dl>
    </PageShell>
  )
}
