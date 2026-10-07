import Logo from '@/components/brand/Logo'
import Button from '@/components/ui/Button'

export default function FinalCta() {
  return (
    <section className="bg-brand">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-8 px-6 py-24 text-center">
        <Logo className="h-24" byline />
        <h2 className="text-3xl font-black sm:text-4xl">
          Your story is yours. Make it provable.
        </h2>
        <p className="max-w-xl text-lg font-medium text-white/90">
          Connect a Stellar wallet, publish your first chapter and get your
          certificate of authorship in seconds.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button href="/write" variant="accent" size="lg">
            Publish my first Star
          </Button>
          <Button href="/explore" variant="outline" size="lg">
            Explore the catalog
          </Button>
        </div>
      </div>
    </section>
  )
}
