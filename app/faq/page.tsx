import type { Metadata } from 'next'
import Card from '@/components/ui/Card'
import PageShell from '@/components/ui/PageShell'

export const metadata: Metadata = { title: 'FAQ' }

const QUESTIONS = [
  {
    q: 'Do I need to know anything about blockchain?',
    a: 'No. You write and press “Publish & protect”. Your wallet asks you to approve a tiny transaction and the certificate appears. Blockchain is the trust layer, not the product.',
  },
  {
    q: 'Does Staries put my text on the blockchain?',
    a: 'No. Only a fingerprint (a SHA-256 hash) of your text is recorded. The fingerprint proves what the text was without revealing it. Keep your original files: the proof cannot recreate the text.',
  },
  {
    q: 'What does a certificate prove?',
    a: 'That an account controlled by the author committed to this exact text at a specific moment. If anyone changes a single character, verification fails. It is strong technical evidence, but it is not a legal copyright registration.',
  },
  {
    q: 'Can someone else register my work?',
    a: 'Anyone can register any text, so the value of the proof is being early, public and verifiable. Publishing first gives you the earliest record.',
  },
  {
    q: 'How much does it cost?',
    a: 'A Stellar transaction costs a fraction of a cent. On Testnet, which is what this demo uses, everything is free and the coins have no value.',
  },
  {
    q: 'Who holds my keys?',
    a: 'You do. Staries never sees your private key. Your wallet signs each transaction, and you can disconnect at any time.',
  },
  {
    q: 'What happens if I edit a published chapter?',
    a: 'Publish again and a new certificate is created for the new text. The old certificates remain valid proofs of the earlier versions.',
  },
  {
    q: 'How do licenses work?',
    a: 'Authors set a price for commercial use, translation or adaptation. Buyers pay the author directly from their wallet and the payment is public proof of the license. Personal reading is free.',
  },
]

export default function FaqPage() {
  return (
    <PageShell
      eyebrow="Help"
      title="Frequently asked questions"
      description="Short, honest answers about authorship proofs, wallets and licenses."
      width="max-w-3xl"
    >
      <div className="space-y-3">
        {QUESTIONS.map((item) => (
          <Card key={item.q} className="p-0">
            <details className="group">
              <summary className="cursor-pointer list-none px-6 py-4 font-bold marker:hidden">
                <span className="flex items-center justify-between gap-4">
                  {item.q}
                  <span className="text-star transition group-open:rotate-45" aria-hidden="true">
                    +
                  </span>
                </span>
              </summary>
              <p className="px-6 pb-5 text-white/70">{item.a}</p>
            </details>
          </Card>
        ))}
      </div>
    </PageShell>
  )
}
