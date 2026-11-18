import { siteConfig } from '../data/site'

type BrandLogoProps = {
  /** Mantido para compatibilidade com os chamadores atuais. */
  tone?: 'light' | 'dark'
  /** Mantido para compatibilidade com os chamadores atuais. */
  compact?: boolean
  className?: string
}

/** Letreiro oficial da marca usado no cabeçalho, menu mobile e rodapé. */
export function BrandLogo({ className = '' }: BrandLogoProps) {
  return (
    <a
      href="#inicio"
      aria-label={`${siteConfig.brand.legalName} — voltar ao início`}
      className={`group inline-flex items-center ${className}`}
    >
      <img
        src="/images/letreiro.png"
        alt=""
        aria-hidden="true"
        className="h-14 w-auto object-contain transition-transform duration-300 group-hover:-translate-y-0.5 sm:h-16"
      />
    </a>
  )
}
