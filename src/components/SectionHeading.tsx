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

      <div className={`mt-6 flex items-center gap-2 ${alignment.includes('mx-auto') ? 'justify-center' : ''}`} aria-hidden="true">
        <span className="h-[2px] w-12 rounded-full bg-[linear-gradient(90deg,#1e6bff,#62cbff)]" />
        <span className="font-display text-sm font-extrabold italic text-coral-accent">+</span>
        <span className={`h-[2px] w-6 rounded-full ${isLight ? 'bg-white/20' : 'bg-ink-900/15'}`} />
      </div>

      {description && (
        <p
          className={`mt-5 text-[15px] leading-relaxed sm:text-base ${
            isLight ? 'text-white/70' : 'text-ink-500'
          }`}
        >
          {description}
        </p>
      )}
    </Reveal>
  )
}
