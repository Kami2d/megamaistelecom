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
      <span className={`eyebrow-pill ${isLight ? '' : 'eyebrow-pill--dark'}`}>
        {eyebrow}
      </span>
      <h2
        className={`mt-6 font-display text-[2rem] font-extrabold italic leading-[1.02] tracking-[-0.025em] sm:text-[2.75rem] lg:text-[3.5rem] ${
          isLight ? 'text-white' : 'text-ink-950'
        }`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`mt-5 text-[15px] leading-relaxed sm:text-base ${
            isLight ? 'text-white/60' : 'text-ink-500'
          }`}
        >
          {description}
        </p>
      )}
    </Reveal>
  )
}
