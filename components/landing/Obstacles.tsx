import StarShape from '@/components/brand/StarShape'
import Icon, { type IconName } from '@/components/ui/Icon'

const OBSTACLES: Array<{
  icon: IconName
  title: string
  stat: string
  text: string
}> = [
  {
    icon: 'dollar',
    title: 'Proof of authorship',
    stat: '$35–$150 · 3–8 months',
    text: 'Registering a work with a national copyright office is slow and expensive, covers only the finished work, and only counts in one country. Most independent authors never do it.',
  },
  {
    icon: 'eye-off',
    title: 'Opaque royalties',
    stat: 'Paid quarterly, unverifiable',
    text: 'Platforms pay months later and authors have to trust the statement. With co-authors, splitting income by hand is a constant source of disputes.',
  },
  {
    icon: 'shield-check',
    title: 'Platform lock-in',
    stat: 'Your history lives on their servers',
    text: 'Books have an ISBN; digital works have no platform-independent identity. If the platform closes or changes its terms, the author loses the record.',
  },
]

export default function Obstacles() {
  return (
    <section className="relative overflow-hidden bg-brand">
      <StarShape className="pointer-events-none absolute -right-28 -top-10 hidden h-80 w-80 text-star/90 xl:block" />
      <div className="relative mx-auto max-w-6xl px-6 py-24">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-star">
          Pain points
        </p>
        <h2 className="mt-3 max-w-2xl text-4xl font-black sm:text-5xl">
          Writing a book takes years. Protecting it shouldn&apos;t.
        </h2>
        <div className="mt-14 grid gap-10 md:grid-cols-3">
          {OBSTACLES.map(({ icon, title, stat, text }) => (
            <article key={title} className="space-y-4">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-star text-brand">
                <Icon name={icon} className="h-8 w-8" />
              </span>
              <h3 className="text-xl font-extrabold">{title}</h3>
              <p className="text-sm font-bold text-star">{stat}</p>
              <p className="font-medium text-white/90">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
