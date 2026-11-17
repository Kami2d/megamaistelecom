import {
  ArrowRight,
  Check,
  Headset,
  MapPin,
  RadioTower,
  Zap,
} from 'lucide-react'
import { siteConfig } from '../data/site'
import { CtaLink } from '../components/CtaLink'
import { Container } from '../components/Container'
import { Reveal } from '../components/Reveal'

const signals = [
  { icon: RadioTower, label: 'Fibra óptica' },
  { icon: Headset, label: 'Suporte 24h' },
  { icon: Zap, label: '400 a 800 MB' },
]

export function Hero() {
  return (
    <section
      id="inicio"
      className="relative overflow-hidden bg-ink-950 pb-20 pt-32 text-white sm:pb-24 lg:pb-32 lg:pt-40"
    >
      <div className="grid-technical pointer-events-none absolute inset-0 opacity-70" />
      <div className="pointer-events-none absolute -left-40 top-10 h-[420px] w-[420px] rounded-full bg-blue-deep/25 blur-[120px]" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-[380px] w-[380px] rounded-full bg-cyan-signal/10 blur-[110px]" />

      <Container className="relative grid items-center gap-14 lg:grid-cols-[1.04fr_0.96fr] lg:gap-20">
        <Reveal>
          <div className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/5 px-4 py-2">
            <span className="relative flex h-2 w-2">
              <span className="signal-pulse absolute inline-flex h-full w-full rounded-full bg-cyan-signal" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-signal" />
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/75">
              Fibra óptica em São Luís e região
            </span>
          </div>

          <h1 className="mt-8 max-w-[660px] font-display text-[42px] font-bold leading-[1.06] tracking-[-0.055em] sm:text-6xl lg:text-[68px]">
            Uma conexão{' '}
            <span className="text-cyan-signal">gigante</span> para transformar
            seus dias.
          </h1>

          <p className="mt-7 max-w-[540px] text-base leading-relaxed text-white/65 sm:text-lg">
            Internet fibra óptica de alta velocidade para você trabalhar,
            estudar, assistir e aproveitar tudo sem limites.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <CtaLink href="#planos" className="w-full sm:w-auto">
              Conheça nossos planos
              <ArrowRight size={17} aria-hidden="true" />
            </CtaLink>
            <CtaLink
              href="#cobertura"
              variant="outline-light"
              className="w-full sm:w-auto"
            >
              <MapPin size={16} aria-hidden="true" />
              Consulte sua cobertura
            </CtaLink>
          </div>

          <ul className="mt-11 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/10 pt-7">
            {signals.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2 text-sm text-white/60">
                <Icon size={16} className="text-cyan-signal" aria-hidden="true" />
                {label}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={160}>
          <div className="relative mx-auto max-w-[520px] lg:max-w-none">
            <div className="pointer-events-none absolute -inset-6 rounded-[44px] bg-blue-brand/15 blur-3xl" />
            <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-ink-900 shadow-[0_40px_100px_-40px_rgba(0,0,0,0.9)]">
              <img
                src="/images/hero-fiber.jpg"
                alt="Infraestrutura tecnológica de fibra óptica"
                className="h-[380px] w-full object-cover opacity-70 sm:h-[500px] lg:h-[540px]"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/20 to-transparent" />

              <svg
                className="pointer-events-none absolute inset-0 h-full w-full"
                viewBox="0 0 500 540"
                fill="none"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  d="M-20 430C120 360 170 250 500 90"
                  stroke="rgba(63,201,238,0.5)"
                  strokeWidth="1.5"
                  className="fiber-track"
                />
                <path
                  d="M-20 500C150 420 260 320 520 180"
                  stroke="rgba(63,201,238,0.22)"
                  strokeWidth="1"
                  className="fiber-track"
                />
                <circle cx="398" cy="140" r="5" fill="#3FC9EE" />
                <circle cx="398" cy="140" r="14" stroke="rgba(63,201,238,0.35)" />
              </svg>

              <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-3">
                <div className="rounded-2xl border border-white/15 bg-ink-950/80 px-5 py-4 backdrop-blur-sm">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">
                    Velocidade máxima
                  </p>
                  <p className="mt-1 font-display text-3xl font-bold tracking-tight">
                    800 <span className="text-cyan-signal">MB</span>
                  </p>
                </div>
                <div className="hidden rounded-xl border border-cyan-signal/30 bg-cyan-signal/10 px-4 py-3 text-xs font-semibold text-cyan-signal sm:block">
                  Fibra óptica
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 -left-3 hidden items-center gap-3 rounded-2xl border border-ink-900/5 bg-white px-5 py-3.5 text-ink-900 shadow-float sm:flex">
              <Check size={16} className="text-blue-brand" aria-hidden="true" />
              <span className="text-xs font-semibold">
                Planos residenciais e empresariais
              </span>
            </div>
          </div>
        </Reveal>
      </Container>

      <Container className="relative mt-20 lg:hidden">
        <p className="flex items-center gap-2 text-xs text-white/40">
          <MapPin size={14} aria-hidden="true" />
          Atendimento em {siteConfig.locations.join(' · ')}
        </p>
      </Container>
    </section>
  )
}
