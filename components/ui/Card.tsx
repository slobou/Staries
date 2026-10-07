import type { HTMLAttributes } from 'react'

export default function Card({
  className = '',
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-2xl border border-white/10 bg-ink-raised/60 p-6 ${className}`}
      {...props}
    />
  )
}
