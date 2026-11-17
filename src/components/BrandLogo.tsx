import { siteConfig } from '../data/site'

type BrandLogoProps = {
  tone?: 'light' | 'dark'
  compact?: boolean
  className?: string
}

export function BrandLogo({
  tone = 'light',
  compact = false,
  className = '',
}: BrandLogoProps) {
  const textTone = tone === 'light' ? 'text-white' : 'text-ink-950'
  const subTone = tone === 'light' ? 'text-white/55' : 'text-ink-500'

  return (
    <a
      href="#inicio"
      aria-label={`${siteConfig.brand.legalName} — voltar ao início`}
      className={`group inline-flex items-center gap-2.5 ${className}`}
    >
      <img
        src="/images/logotipo.png"
        alt=""
        aria-hidden="true"
        className="h-10 w-10 shrink-0 object-contain transition-transform duration-300 group-hover:-translate-y-0.5"
      />
      <span className="leading-none">
        <span
          className={`block font-display text-[22px] font-bold tracking-[-0.06em] ${textTone}`}
        >
          MEGA<span className="text-cyan-signal">+</span>
        </span>
        {!compact && (
          <span
            className={`mt-1.5 block text-[9px] font-semibold uppercase tracking-[0.24em] ${subTone}`}
          >
            Telecom
          </span>
        )}
      </span>
    </a>
  )
}
