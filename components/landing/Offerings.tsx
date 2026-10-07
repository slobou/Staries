import Badge from '@/components/ui/Badge'
import Icon, { type IconName } from '@/components/ui/Icon'

type Status = 'live' | 'soon'

const BLOCKS: Array<{
  icon: IconName
  title: string
  text: string
  status: Status
}> = [
  {
    icon: 'shield-check',
    title: 'Authorship registry',
    text: 'Every chapter and every new version gets its own timestamped, tamper-proof record on Stellar.',
    status: 'live',
  },
  {
    icon: 'link',
    title: 'Public verification',
    text: 'Anyone can check a work against its certificate with no account and no permission — not even ours.',
    status: 'live',
  },
  {
    icon: 'wallet',
    title: 'Direct license payments',
    text: 'Set a price for commercial use, translation or adaptation. Buyers pay you directly and the payment is on-chain.',
    status: 'live',
  },
  {
    icon: 'book',
    title: 'Work token',
    text: 'A unique Stellar asset per finished work: a portable, platform-independent digital ISBN.',
    status: 'soon',
  },
  {
    icon: 'users',
    title: 'Automatic royalty splits',
    text: 'Soroban smart contracts split every payment between co-authors, illustrators and translators.',
    status: 'soon',
  },
]

export default function Offerings() {
  return (
    <section className="bg-brand">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-star">
          Our offerings
        </p>
        <h2 className="mt-3 max-w-2xl text-4xl font-black sm:text-5xl">
          Blockchain as invisible infrastructure.
        </h2>
        <p className="mt-4 max-w-2xl text-lg font-medium text-white/90">
          Your readers and you never need to learn what a blockchain is. You
          just get proof, payments and a public record.
        </p>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {BLOCKS.map(({ icon, title, text, status }) => (
            <article
              key={title}
              className="rounded-2xl bg-ink/90 p-6 shadow-lg shadow-black/10"
            >
              <div className="mb-5 flex items-center justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-star text-ink">
                  <Icon name={icon} />
                </span>
                <Badge tone={status === 'live' ? 'success' : 'star'}>
                  {status === 'live' ? 'Live' : 'Coming soon'}
                </Badge>
              </div>
              <h3 className="text-lg font-extrabold">{title}</h3>
              <p className="mt-2 text-sm text-white/65">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
