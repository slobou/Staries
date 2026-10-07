'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useState } from 'react'
import Logo from '@/components/brand/Logo'
import { useWallet } from '@/hooks/useWallet'
import { STELLAR_NETWORK } from '@/lib/stellar/config'
import { truncateAddress } from '@/utils/stellarUtils'

const LINKS = [
  { href: '/explore', label: 'Explore' },
  { href: '/write', label: 'My Stars' },
  { href: '/verify', label: 'Verify' },
  { href: '/activity', label: 'Activity' },
]

export default function Navbar() {
  const pathname = usePathname()
  const { address, isConnected, ready, connecting, connect, disconnect } =
    useWallet()
  const [copied, setCopied] = useState(false)

  const copyAddress = useCallback(async () => {
    if (!address) return
    await navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [address])

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-ink/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-6 py-4">
        <div className="flex items-center gap-3">
          <Link href="/" aria-label="Staries home">
            <Logo className="h-11" />
          </Link>
          <span className="rounded-full bg-star/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-star">
            {STELLAR_NETWORK}
          </span>
        </div>

        <nav aria-label="Main" className="order-last flex w-full gap-1 overflow-x-auto sm:order-none sm:w-auto">
          {LINKS.map(({ href, label }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`)
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? 'page' : undefined}
                className={`rounded-full px-4 py-1.5 text-sm font-bold transition ${
                  active
                    ? 'bg-brand/30 text-white'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-2">
          {!ready ? null : isConnected && address ? (
            <>
              <button
                onClick={copyAddress}
                title="Copy address"
                className="rounded-full border border-white/15 bg-ink-raised px-3.5 py-1.5 font-mono text-sm text-white/90 transition hover:border-star"
              >
                {copied ? 'Copied!' : truncateAddress(address)}
              </button>
              <button
                onClick={disconnect}
                className="rounded-full px-3 py-1.5 text-sm font-bold text-white/60 transition hover:text-red-300"
              >
                Disconnect
              </button>
            </>
          ) : (
            <button
              onClick={connect}
              disabled={connecting}
              className="rounded-full bg-star px-5 py-2 text-sm font-bold text-ink transition hover:bg-star-dark disabled:opacity-60"
            >
              {connecting ? 'Connecting…' : 'Connect wallet'}
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
