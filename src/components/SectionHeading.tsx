import type { ReactNode } from 'react'
import { Reveal } from './Reveal'

type SectionHeadingProps = {
  eyebrow: string
  title: ReactNode
  description?: string
  align?: 'left' | 'center'
  tone?: 'dark' | 'light'
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  tone = 'dark',
}: SectionHeadingProps) {
  const isLight = tone === 'light'
  const alignment = align === 'center' ? 'mx-auto text-center' : ''

  return (
    <Reveal className={`max-w-2xl ${alignment}`}>
      <div className="mb-5 flex items-center gap-3">
        <span className="h-px w-8 bg-blue-brand" aria-hidden="true" />
        <p
          className={`text-[11px] font-bold uppercase tracking-[0.24em] ${
            isLight ? 'text-cyan-signal' : 'text-blue-brand'
          }`}
        >
          {eyebrow}
        </p>
      </div>
      <h2
        className={`font-display text-3xl font-bold leading-[1.12] tracking-[-0.04em] sm:text-4xl lg:text-[44px] ${
          isLight ? 'text-white' : 'text-ink-950'
        }`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`mt-5 text-[15px] leading-relaxed sm:text-base ${
            isLight ? 'text-white/65' : 'text-ink-500'
          }`}
        >
          {description}
        </p>
      )}
    </Reveal>
  )
}
