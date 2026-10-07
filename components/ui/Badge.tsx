import type { ReactNode } from 'react'

type Tone = 'brand' | 'star' | 'success' | 'neutral' | 'danger'

const TONES: Record<Tone, string> = {
  brand: 'bg-brand/25 text-brand-light',
  star: 'bg-star/20 text-star',
  success: 'bg-emerald-500/15 text-emerald-300',
  neutral: 'bg-white/10 text-white/70',
  danger: 'bg-red-500/15 text-red-300',
}

export default function Badge({
  tone = 'neutral',
  children,
}: {
  tone?: Tone
  children: ReactNode
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${TONES[tone]}`}
    >
      {children}
    </span>
  )
}
