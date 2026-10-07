import type { ReactNode } from 'react'

type Tone = 'info' | 'success' | 'error' | 'warning'

const TONES: Record<Tone, string> = {
  info: 'border-brand/50 bg-brand/15 text-brand-light',
  success: 'border-emerald-400/40 bg-emerald-500/10 text-emerald-200',
  error: 'border-red-400/40 bg-red-500/10 text-red-200',
  warning: 'border-star/40 bg-star/10 text-star',
}

export default function Alert({
  tone = 'info',
  title,
  children,
}: {
  tone?: Tone
  title?: string
  children?: ReactNode
}) {
  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={`rounded-xl border px-4 py-3 text-sm ${TONES[tone]}`}
    >
      {title && <p className="font-bold">{title}</p>}
      {children && <div className={title ? 'mt-1 opacity-90' : ''}>{children}</div>}
    </div>
  )
}
