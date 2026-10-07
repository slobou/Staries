import type { Metadata } from 'next'
import Badge from '@/components/ui/Badge'
import Card from '@/components/ui/Card'
import PageShell from '@/components/ui/PageShell'

export const metadata: Metadata = { title: 'Roadmap' }

const ITEMS = [
  {
    title: 'Authorship registry',
    status: 'live',
    text: 'Every chapter and every new version gets its own timestamped record on Stellar.',
  },
  {
    title: 'Public certificate and verification',
    status: 'live',
    text: 'Anyone can open a certificate and check a text against it, with no account.',
  },
  {
    title: 'Direct license payments',
    status: 'live',
    text: 'Buyers pay the author wallet to wallet. The payment is the receipt.',
  },
  {
    title: 'Shared catalog and IPFS storage',
    status: 'next',
    text: 'A shared backend so every reader sees every Star, with chapter content stored on IPFS.',
  },
  {
    title: 'Work token',
    status: 'next',
    text: 'A unique Stellar asset per finished work: a portable, platform-independent digital ISBN.',
  },
  {
    title: 'Royalty splits with Soroban',
    status: 'next',
    text: 'Smart contracts split every payment between co-authors, illustrators and translators.',
  },
  {
    title: 'USDC payments',
    status: 'next',
    text: 'Stable-value licenses so prices do not move with the market.',
  },
  {
    title: 'Easier onboarding',
    status: 'later',
    text: 'Passkey wallets so readers and authors never have to install an extension.',
  },
] as const

const LABELS = { live: 'Live', next: 'Up next', later: 'Later' } as const

export default function RoadmapPage() {
  return (
    <PageShell
      eyebrow="Roadmap"
      title="What is live and what is next"
      description="Staries runs on Stellar Testnet today. This is where it is going."
      width="max-w-3xl"
    >
      <ol className="space-y-3">
        {ITEMS.map((item) => (
          <li key={item.title}>
            <Card className="flex flex-wrap items-start justify-between gap-3">
              <div className="max-w-xl space-y-1">
                <h2 className="font-extrabold">{item.title}</h2>
                <p className="text-sm text-white/65">{item.text}</p>
              </div>
              <Badge tone={item.status === 'live' ? 'success' : 'neutral'}>
                {LABELS[item.status]}
              </Badge>
            </Card>
          </li>
        ))}
      </ol>
    </PageShell>
  )
}
