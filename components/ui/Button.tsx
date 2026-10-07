import Link from 'next/link'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'accent' | 'outline' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-brand text-white hover:bg-brand-dark',
  accent: 'bg-star text-ink hover:bg-star-dark',
  outline:
    'border border-white/25 text-white hover:border-star hover:text-star',
  ghost: 'text-white/70 hover:text-white hover:bg-white/5',
}

const SIZES: Record<Size, string> = {
  sm: 'px-3.5 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
}

export function buttonClasses(variant: Variant = 'primary', size: Size = 'md') {
  return `inline-flex items-center justify-center gap-2 rounded-full font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTS[variant]} ${SIZES[size]}`
}

interface CommonProps {
  variant?: Variant
  size?: Size
  className?: string
  children: ReactNode
}

type ButtonProps = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'> & {
    href?: undefined
  }

type LinkProps = CommonProps & {
  href: string
  external?: boolean
}

/** Renders a `<button>`, or a link styled as a button when `href` is given. */
export default function Button(props: ButtonProps | LinkProps) {
  if (props.href !== undefined) {
    const { variant, size, className = '', children, href, external } = props
    const classes = `${buttonClasses(variant, size)} ${className}`
    return external ? (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
      </a>
    ) : (
      <Link href={href} className={classes}>
        {children}
      </Link>
    )
  }

  const { variant, size, className = '', children, ...rest } = props
  return (
    <button
      type="button"
      className={`${buttonClasses(variant, size)} ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}
