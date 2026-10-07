import type { ReactNode } from 'react'

/** Standard page container + heading used by every app (non-landing) page. */
export default function PageShell({
  title,
  eyebrow,
  description,
  actions,
  width = 'max-w-5xl',
  children,
}: {
  /** Omit when the page renders its own <h1>. */
  title?: string
  eyebrow?: string
  description?: string
  actions?: ReactNode
  width?: string
  children: ReactNode
}) {
  return (
    <main className={`mx-auto w-full flex-1 px-6 py-12 ${width}`}>
      {title && (
      <header className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          {eyebrow && (
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-star">
              {eyebrow}
            </p>
          )}
          <h1 className="text-3xl font-black sm:text-4xl">{title}</h1>
          {description && (
            <p className="max-w-2xl text-white/65">{description}</p>
          )}
        </div>
        {actions && <div className="flex gap-3">{actions}</div>}
      </header>
      )}
      {children}
    </main>
  )
}
