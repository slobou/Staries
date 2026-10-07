import Icon, { type IconName } from '@/components/ui/Icon'

const AUDIENCE: Array<{ icon: IconName; title: string; text: string }> = [
  {
    icon: 'pencil',
    title: 'Emerging authors',
    text: 'Protect your work before you show it to anyone, and prove you published first — to an editor, a platform or a court.',
  },
  {
    icon: 'bookmark',
    title: 'Curious readers',
    text: 'Read with confidence. Check any work against its certificate with one click and see who published it and when.',
  },
  {
    icon: 'users',
    title: 'Our society',
    text: 'A fairer creative economy where authors keep control of their identity and get paid directly, transparently and fast.',
  },
]

export default function Audience() {
  return (
    <section className="bg-ink">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-star">
          Who we help
        </p>
        <h2 className="mt-3 max-w-2xl text-4xl font-black sm:text-5xl">
          Built for the people behind the stories.
        </h2>
        <div className="mt-14 grid gap-10 md:grid-cols-3">
          {AUDIENCE.map(({ icon, title, text }) => (
            <article key={title} className="space-y-4">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-star text-brand">
                <Icon name={icon} className="h-8 w-8" />
              </span>
              <h3 className="text-xl font-extrabold">{title}</h3>
              <p className="text-white/65">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
