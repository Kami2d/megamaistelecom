import type { AnchorHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'blue' | 'outline-light' | 'outline-dark' | 'light' | 'dark'
type Size = 'md' | 'sm'

const variants: Record<Variant, string> = {
  primary:
    'text-white bg-[linear-gradient(100deg,#ff5a10,#ff6a1a_45%,#ff8a2a)] shadow-[0_14px_34px_-12px_rgba(255,106,26,0.7),inset_0_1px_0_rgba(255,255,255,0.35)] hover:shadow-[0_20px_44px_-14px_rgba(255,106,26,0.85),inset_0_1px_0_rgba(255,255,255,0.35)]',
  blue: 'text-white bg-[linear-gradient(100deg,#1559f0,#1e6bff_50%,#3f8cff)] shadow-[0_14px_34px_-12px_rgba(30,107,255,0.75),inset_0_1px_0_rgba(255,255,255,0.3)] hover:shadow-[0_20px_44px_-14px_rgba(30,107,255,0.85)]',
  'outline-light':
    'text-white bg-white/[0.06] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.22)] hover:bg-white/[0.12] hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.4)]',
  'outline-dark':
    'bg-white text-ink-900 shadow-[inset_0_0_0_1px_rgba(10,28,78,0.14)] hover:bg-mist-2 hover:shadow-[inset_0_0_0_1px_rgba(30,107,255,0.4)]',
  light: 'bg-white text-ink-900 shadow-[0_18px_40px_-18px_rgba(0,0,0,0.55)] hover:bg-cyan-signal',
  dark: 'bg-ink-950 text-white shadow-[0_18px_40px_-18px_rgba(2,7,22,0.65)] hover:bg-ink-800',
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
  const classes = `cta-pill ${variants[variant]} ${className}`
  const dataProps = { 'data-variant': variant, 'data-size': size }

  if (disabled) {
    return (
      <button
        type="button"
        disabled
        title={title}
        aria-label={props['aria-label']}
        className={`${classes} cursor-not-allowed opacity-60`}
        {...dataProps}
      >
        {children}
      </button>
    )
  }

  return (
    <a {...props} {...dataProps} title={title} className={classes}>
      {children}
    </a>
  )
}
