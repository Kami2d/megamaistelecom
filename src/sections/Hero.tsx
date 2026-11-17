import { ArrowRight, MapPin, ShieldCheck, Zap } from 'lucide-react'
import { siteConfig } from '../data/site'
import { plans } from '../data/plans'
import { CtaLink } from '../components/CtaLink'
import { Container } from '../components/Container'
import { Reveal } from '../components/Reveal'
import { SpeedRing } from '../components/SpeedRing'

const marqueeItems = [
  ...plans.map((plan) => `${plan.speedMb} Mbps`),
  'Suporte 24h',
  'Fibra óptica',
]

export function Hero() {
  return (
    <section
      id="inicio"
      tabIndex={-1}
      className="relative isolate overflow-hidden bg-ink-950 pb-0 pt-[140px] text-white lg:pt-[170px]"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 80% at 75% 0%, #0d2a78 0%, rgba(10,28,78,0) 55%), linear-gradient(180deg, #05102c 0%, #020716 100%)',
        }}
        aria-hidden="true"
      />
      <div className="grid-technical pointer-events-none absolute inset-0 opacity-70" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -right-64 -top-64 h-[900px] w-[900px] rounded-full bg-[radial-gradient(circle,rgba(61,139,255,0.5),rgba(30,107,255,0.14)_40%,transparent_68%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -left-80 bottom-0 h-[700px] w-[700px] rounded-full bg-[radial-gradient(circle,rgba(30,107,255,0.3),transparent_65%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute right-[10%] top-[30%] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(255,106,26,0.22),transparent_70%)]"
        aria-hidden="true"
      />

      <Container className="relative">
        <div className="grid items-center gap-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          <Reveal>
            <span className="eyebrow-pill">
              Fibra óptica em {siteConfig.locations.slice(0, 2).join(' e ')} e região
            </span>

            <h1 className="mt-8 max-w-[720px] font-display text-[clamp(2.9rem,6.1vw,5.9rem)] font-extrabold italic leading-[0.95] tracking-[-0.03em]">
              <span className="bg-[linear-gradient(165deg,#fff_30%,#d6e9ff_55%,#7fd3ff_100%)] bg-clip-text text-transparent">
                Sua conexão precisa acompanhar o seu ritmo.
              </span>
            </h1>

            <p className="mt-7 max-w-[560px] text-base leading-relaxed text-white/60 sm:text-lg">
              Internet fibra óptica de 400 a 800 Mbps para trabalhar, estudar,
              assistir aos seus conteúdos favoritos e manter seu negócio
              conectado. Consulte a cobertura no seu endereço.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <CtaLink href="#planos">
                Encontrar meu plano
                <ArrowRight size={17} aria-hidden="true" />
              </CtaLink>
              <CtaLink href="#cobertura" variant="outline-light">
                Consultar cobertura
                <MapPin size={17} aria-hidden="true" />
              </CtaLink>
            </div>

            <ul className="mt-11 flex flex-wrap items-center gap-x-7 gap-y-3 border-t border-white/10 pt-7">
              {[
                { icon: Zap, label: '400 a 800 Mbps' },
                { icon: ShieldCheck, label: 'Suporte técnico 24h' },
                { icon: MapPin, label: 'Atendimento no Maranhão' },
              ].map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-2 text-[13px] text-white/55">
                  <Icon size={15} className="text-cyan-signal" aria-hidden="true" />
                  {label}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={160}>
            <SpeedRing />
          </Reveal>
        </div>

        <div className="marquee relative mt-16 border-t border-cyan-signal/10 py-6 sm:mt-20">
          <div className="marquee-track">
            {[...marqueeItems, ...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, index) => (
              <span
                key={`${item}-${index}`}
                data-fill={index % 3 === 0}
                data-accent={index % 5 === 4}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
