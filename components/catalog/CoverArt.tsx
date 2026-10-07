import StarShape from '@/components/brand/StarShape'

/** Brand-colored cover pairs; picked deterministically from the title. */
const PALETTES = [
  'from-brand to-brand-dark text-star',
  'from-star to-star-dark text-brand-dark',
  'from-ink-raised to-ink-deep text-star',
  'from-brand-light to-brand text-ink',
]

function pick(title: string): string {
  let sum = 0
  for (const char of title) sum = (sum + char.charCodeAt(0)) % 997
  return PALETTES[sum % PALETTES.length]
}

/** Placeholder cover until authors can upload one. */
export default function CoverArt({
  title,
  className = '',
}: {
  title: string
  className?: string
}) {
  return (
    <div
      className={`relative flex aspect-[2/3] flex-col justify-between overflow-hidden rounded-xl bg-gradient-to-br p-4 ${pick(title)} ${className}`}
      role="img"
      aria-label={`Cover of ${title}`}
    >
      <StarShape className="h-7 w-7" />
      <p className="line-clamp-4 text-lg font-black leading-tight text-white drop-shadow">
        {title}
      </p>
    </div>
  )
}
