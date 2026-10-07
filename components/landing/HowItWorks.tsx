import Icon, { type IconName } from '@/components/ui/Icon'

const STEPS: Array<{ icon: IconName; title: string; text: string }> = [
  {
    icon: 'pencil',
    title: 'Write & publish',
    text: 'Write or paste your chapter in Staries and press “Publish & protect”.',
  },
  {
    icon: 'hash',
    title: 'We fingerprint it',
    text: 'Your browser computes a SHA-256 hash of the text. The text itself never goes on-chain.',
  },
  {
    icon: 'wallet',
    title: 'You sign it',
    text: 'Your wallet signs a tiny Stellar transaction that records the hash. Staries never sees your keys.',
  },
  {
    icon: 'shield-check',
    title: 'Get your certificate',
    text: 'A public, permanent certificate with a link anyone can open and verify — forever.',
  },
]

export default function HowItWorks() {
  return (
    <section className="bg-ink">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-star">
          How it works
        </p>
        <h2 className="mt-3 max-w-2xl text-4xl font-black sm:text-5xl">
          From manuscript to proof in about five seconds.
        </h2>
        <ol className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(({ icon, title, text }, index) => (
            <li
              key={title}
              className="relative rounded-2xl border border-white/10 bg-ink-raised/60 p-6"
            >
              <span className="absolute right-5 top-4 text-4xl font-black text-white/10">
                {index + 1}
              </span>
              <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-brand/30 text-brand-light">
                <Icon name={icon} />
              </span>
              <h3 className="text-lg font-extrabold">{title}</h3>
              <p className="mt-2 text-sm text-white/65">{text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
