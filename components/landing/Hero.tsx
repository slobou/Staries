import StarShape from '@/components/brand/StarShape'
import Button from '@/components/ui/Button'
import Icon from '@/components/ui/Icon'

/** Illustrative only — the real certificate page reads live data from Stellar. */
function SampleCertificate() {
  return (
    <div
      className="relative w-full max-w-md rounded-3xl bg-ink p-6 shadow-2xl shadow-black/30"
      aria-label="Sample authorship certificate"
    >
      <div className="mb-5 flex items-center justify-between">
        <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-star">
          <StarShape className="h-4 w-4" /> Certificate of authorship
        </span>
        <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-bold text-emerald-300">
          Verified
        </span>
      </div>
      <p className="text-xl font-extrabold">The Silent Song of the Thorn Forest</p>
      <p className="text-sm text-white/60">Chapter 1 · Lyra and the Broken Map</p>

      <dl className="mt-6 space-y-4 text-sm">
        <div>
          <dt className="text-xs font-bold uppercase tracking-wider text-white/45">
            Content fingerprint (SHA-256)
          </dt>
          <dd className="mt-1 break-all font-mono text-xs text-brand-light">
            a3f8c2d1e9b47c60d52f1a8e0b3c97d4…e51f09a2c7
          </dd>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <dt className="text-xs font-bold uppercase tracking-wider text-white/45">
              Registered
            </dt>
            <dd className="mt-1">Oct 7, 2026 · 11:14</dd>
          </div>
          <div>
            <dt className="text-xs font-bold uppercase tracking-wider text-white/45">
              Network fee
            </dt>
            <dd className="mt-1">0.00001 XLM</dd>
          </div>
        </div>
      </dl>

      <div className="mt-6 flex items-center gap-2 border-t border-white/10 pt-4 text-xs text-white/55">
        <Icon name="link" className="h-4 w-4 text-brand-light" />
        Anchored on the Stellar blockchain
      </div>
      <p className="absolute -bottom-3 right-6 rounded-full bg-star px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-ink">
        Example
      </p>
    </div>
  )
}

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-brand">
      <StarShape className="pointer-events-none absolute -left-64 top-1/2 hidden h-[28rem] w-[28rem] -translate-y-1/2 text-star xl:block" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-6 py-20 lg:grid-cols-2 lg:py-28">
        <div className="space-y-7 xl:pl-24">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-star">
            Authorship, protected
          </p>
          <h1 className="text-5xl font-black leading-[1.05] sm:text-6xl">
            Publish it.
            <br />
            Protect it.
            <br />
            <span className="text-star">Prove it.</span>
          </h1>
          <p className="max-w-lg text-lg font-medium text-white/90">
            We connect authors and readers through fast publishing, immersive
            reading, and curated quality. Every chapter you publish gets a
            permanent proof of authorship on Stellar — in seconds, for a
            fraction of a cent.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button href="/write" variant="accent" size="lg">
              Start publishing
            </Button>
            <Button href="/verify" variant="outline" size="lg">
              Verify a work
            </Button>
          </div>
        </div>
        <div className="flex justify-center lg:justify-end">
          <SampleCertificate />
        </div>
      </div>
    </section>
  )
}
