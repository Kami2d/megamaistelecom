import type { AnchorHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'outline-light' | 'outline-dark' | 'light' | 'dark'
type Size = 'md' | 'sm'

const variants: Record<Variant, string> = {
  primary:
    'bg-blue-brand text-white shadow-[0_14px_30px_-14px_rgba(20,103,232,0.95)] hover:bg-blue-bright hover:shadow-[0_18px_34px_-14px_rgba(43,139,245,0.9)]',
  'outline-light':
    'border border-white/25 text-white hover:border-cyan-signal/70 hover:bg-white/10',
  'outline-dark':
    'border border-ink-900/15 bg-white text-ink-900 hover:border-blue-brand/45 hover:bg-mist-2',
  light: 'bg-white text-ink-950 hover:bg-cyan-signal',
  dark: 'bg-ink-950 text-white hover:bg-ink-800',
}

const sizes: Record<Size, string> = {
  md: 'px-6 py-3.5 text-sm',
  sm: 'px-5 py-2.5 text-xs',
}

type CtaLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode
  variant?: Variant
  size?: Size
  className?: string
  disabled?: boolean
}

export function CtaLink({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  title,
  ...props
}: CtaLinkProps) {
  const classes = `inline-flex items-center justify-center gap-2.5 rounded-xl font-semibold tracking-[-0.01em] transition-all duration-300 active:translate-y-px ${sizes[size]} ${variants[variant]} ${className}`

  if (disabled) {
    return (
      <button
        type="button"
        disabled
        title={title}
        className={`${classes} cursor-not-allowed opacity-60`}
      >
        {children}
      </button>
    )
  }

  return (
    <a {...props} title={title} className={classes}>
      {children}
    </a>
  )
}
