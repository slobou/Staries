const ROWS = [
  {
    topic: 'Proof of authorship',
    before: '$150 and ~6 months of waiting',
    after: 'Automatic when you publish: ~5 seconds, a fraction of a cent',
  },
  {
    topic: 'Royalties',
    before: 'Quarterly, opaque, unverifiable',
    after: 'Paid straight to your wallet, auditable on-chain',
  },
  {
    topic: 'Licenses',
    before: 'Lawyers, contracts, months of negotiation',
    after: 'You set the price, the buyer pays, the license is recorded',
  },
  {
    topic: 'Identity of the work',
    before: 'Tied to the platform where you published',
    after: 'A public record that belongs to you, even if you leave',
  },
]

export default function BeforeAfter() {
  return (
    <section className="bg-star text-ink">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-brand-dark">
          Our solution
        </p>
        <h2 className="mt-3 max-w-2xl text-4xl font-black sm:text-5xl">
          What changes with Staries.
        </h2>
        <div className="mt-12 overflow-hidden rounded-3xl bg-white/35">
          <div className="hidden grid-cols-[1fr_1.2fr_1.5fr] gap-6 border-b border-ink/10 px-8 py-4 text-xs font-extrabold uppercase tracking-widest text-ink/60 md:grid">
            <span />
            <span>Without Staries</span>
            <span>With Staries</span>
          </div>
          {ROWS.map(({ topic, before, after }) => (
            <div
              key={topic}
              className="grid gap-2 border-b border-ink/10 px-8 py-6 last:border-b-0 md:grid-cols-[1fr_1.2fr_1.5fr] md:gap-6"
            >
              <h3 className="text-lg font-extrabold">{topic}</h3>
              <p className="text-ink/70">
                <span className="mr-2 text-xs font-bold uppercase md:hidden">Before:</span>
                {before}
              </p>
              <p className="font-bold">
                <span className="mr-2 text-xs font-bold uppercase text-brand-dark md:hidden">With Staries:</span>
                {after}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
