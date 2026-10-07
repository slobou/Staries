import Link from 'next/link'
import Logo from '@/components/brand/Logo'
import { STELLAR_NETWORK } from '@/lib/stellar/config'

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-ink-deep">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-8 text-sm text-white/60">
        <div className="flex items-center gap-4">
          <Logo className="h-10" byline />
          <p className="max-w-xs text-xs">
            Authors and readers, connected through fast publishing, immersive
            reading and curated quality.
          </p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-2 font-bold">
          <Link href="/explore" className="hover:text-white">Explore</Link>
          <Link href="/verify" className="hover:text-white">Verify a work</Link>
          <Link href="/write" className="hover:text-white">Publish</Link>
          <Link href="/how-it-works" className="hover:text-white">How it works</Link>
          <Link href="/about" className="hover:text-white">About</Link>
          <Link href="/faq" className="hover:text-white">FAQ</Link>
          <Link href="/roadmap" className="hover:text-white">Roadmap</Link>
          <Link href="/wallet-help" className="hover:text-white">Wallet guide</Link>
          <Link href="/glossary" className="hover:text-white">Glossary</Link>
          <Link href="/legal" className="hover:text-white">Legal</Link>
        </nav>
        <p className="text-xs">
          {`Proofs anchored on the Stellar ${STELLAR_NETWORK === 'testnet' ? 'Testnet' : 'network'}.`}
        </p>
      </div>
    </footer>
  )
}
