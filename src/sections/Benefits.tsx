import { ArrowRight, Headset, MapPin, RadioTower } from 'lucide-react'
import { siteConfig } from '../data/site'
import { plans } from '../data/plans'
import { useInView } from '../hooks/useInView'
import { Container } from '../components/Container'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { WhatsAppCta } from '../components/WhatsAppCta'

const maxSpeed = Math.max(...plans.map((plan) => plan.speedMb))

export function Benefits() {
  const [dialRef, dialInView] = useInView<HTMLDivElement>()
  const [barsRef, barsInView] = useInView<HTMLDivElement>()

  return (
    <section
      id="diferenciais"
      className="relative overflow-hidden bg-ink-950 py-24 sm:py-32"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(50% 50% at 85% 10%, rgba(30,107,255,0.35), transparent 70%), radial-gradient(40% 40% at 5% 90%, rgba(255,106,26,0.18), transparent 70%)',
        }}
        aria-hidden="true"
      />

      <Container className="relative">
        <div className="mb-14 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading
            eyebrow="Além da velocidade"
            tone="light"
            title={<>Uma boa internet começa com gente que responde.</>}
            description="Escolher uma provedora envolve mais do que megas: veja como é a instalação, onde pedir ajuda e se atendemos sua região."
          />
          <Reveal delay={100}>
            <WhatsAppCta
              message="Olá! Quero verificar se a MEGA+ atende a minha região."
              variant="outline-light"
            >
              Verificar minha localidade
              <MapPin size={17} aria-hidden="true" />
            </WhatsAppCta>
          </Reveal>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          <Reveal className="lg:row-span-2">
            <article className="bento-card h-full min-h-[24rem] lg:min-h-full" data-hero="true">
              <div className="flex flex-1 items-center justify-center py-4">
                <div ref={dialRef} className="relative aspect-square w-[min(19rem,85%)]">
                  <svg viewBox="0 0 240 240" className="h-full w-full overflow-visible" aria-hidden="true">
                    <defs>
                      <linearGradient id="dial-gradient" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#ff5a10" />
                        <stop offset="100%" stopColor="#ffa13d" />
                      </linearGradient>
                    </defs>
                    <circle cx="120" cy="120" r="100" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
                    <circle
                      cx="120"
                      cy="120"
                      r="100"
                      fill="none"
                      stroke="url(#dial-gradient)"
                      strokeWidth="10"
                      strokeLinecap="round"
                      pathLength={100}
                      className="dial-progress"
                      data-visible={dialInView}
                      transform="rotate(-90 120 120)"
                    />
                    {Array.from({ length: 36 }, (_, index) => {
                      const angle = (index * 10 * Math.PI) / 180
                      return (
                        <line
                          key={index}
                          x1={120 + 112 * Math.cos(angle)}
                          y1={120 + 112 * Math.sin(angle)}
                          x2={120 + 118 * Math.cos(angle)}
                          y2={120 + 118 * Math.sin(angle)}
                          stroke="rgba(255,255,255,0.28)"
                          strokeWidth="2"
                        />
                      )
                    })}
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="font-display text-[4.5rem] font-extrabold italic leading-none text-white [text-shadow:0_0_30px_rgba(255,140,60,0.5)]">
                      24h
                    </span>
                    <span className="mt-1 max-w-[8rem] text-[11px] font-medium leading-tight text-amber-accent">
                      prazo confirmado no atendimento
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-white">Instalação ágil, em até 24 horas</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">
                  Quer começar sem demora? Informamos o prazo de até 24 horas,
                  sujeito à disponibilidade técnica e ao agendamento.
                </p>
              </div>
            </article>
          </Reveal>

          <Reveal delay={80}>
            <article className="bento-card h-full">
              <div className="relative flex flex-1 items-center justify-center py-4">
                <div className="pulse-ring" aria-hidden="true" />
                <div className="pulse-ring" style={{ animationDelay: '1.06s' }} aria-hidden="true" />
                <div className="relative grid h-16 w-16 place-items-center rounded-[1.25rem] bg-[linear-gradient(140deg,#1e6bff,#5aa6ff)] shadow-[0_14px_30px_-10px_rgba(30,107,255,0.9)]">
                  <Headset size={30} className="text-white" aria-hidden="true" />
                </div>
              </div>
              <h3 className="font-display text-xl font-bold text-white">Suporte técnico disponível 24 horas</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">
                Quando aparecer uma questão, saber onde pedir ajuda faz diferença.
                Veja os canais e condições de atendimento.
              </p>
            </article>
          </Reveal>

          <Reveal delay={140}>
            <article className="bento-card h-full">
              <div className="flex flex-1 items-center justify-center py-4">
                <div className="flex flex-wrap justify-center gap-2">
                  {siteConfig.locations.map((location, index) => (
                    <span
                      key={location}
                      className="location-chip inline-flex items-center gap-2 rounded-full bg-white/[0.07] px-3.5 py-2.5 text-xs font-medium text-white/85 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]"
                      style={{ animationDelay: `${index * 90}ms` }}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${index === 0 ? 'bg-coral-accent shadow-[0_0_12px_var(--color-coral-accent)]' : 'bg-cyan-signal shadow-[0_0_12px_var(--color-cyan-signal)]'}`}
                        aria-hidden="true"
                      />
                      {location}
                    </span>
                  ))}
                </div>
              </div>
              <h3 className="font-display text-xl font-bold text-white">Presença regional</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">
                Atuamos em localidades do Maranhão, conforme nossa área de cobertura.
              </p>
            </article>
          </Reveal>

          <Reveal delay={100} className="lg:col-span-2">
            <article className="bento-card h-full min-h-[15rem]">
              <div ref={barsRef} className="stat-bars flex flex-1 items-end gap-3 pt-6" data-visible={barsInView}>
                {plans.map((plan) => (
                  <div key={plan.id} className="flex h-full flex-1 flex-col justify-end gap-2">
                    <span className="text-center font-display text-sm font-bold italic text-white">
                      {plan.speedMb}
                      <small className="ml-0.5 font-sans text-[9px] font-medium not-italic text-white/45">Mbps</small>
                    </span>
                    <i
                      style={{ height: `${(plan.speedMb / maxSpeed) * 100}%` }}
                      className="block rounded-t-xl"
                    />
                  </div>
                ))}
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-white">Planos para cada jeito de usar a internet</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">
                  De 400 a 800 Mbps, escolha a opção que combina com sua casa ou
                  empresa e com o número de dispositivos conectados.
                </p>
              </div>
            </article>
          </Reveal>
        </div>

        <Reveal delay={120}>
          <div className="mt-10 flex flex-col items-center justify-between gap-5 rounded-[1.75rem] border border-white/10 bg-white/[0.04] px-6 py-6 text-center sm:flex-row sm:text-left">
            <p className="flex items-center gap-3 text-sm text-white/55">
              <RadioTower size={18} className="text-cyan-signal" aria-hidden="true" />
              <span>
                Cobertura, instalação e condições são validadas pela nossa equipe.
              </span>
            </p>
            <WhatsAppCta message="Olá! Quero verificar a cobertura da MEGA+ no meu endereço.">
              Verificar cobertura
              <ArrowRight size={16} aria-hidden="true" />
            </WhatsAppCta>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
