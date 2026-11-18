import { useRef } from 'react'
import { ArrowRight } from 'lucide-react'
import { Container } from '../components/Container'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { StepsTimeline } from '../components/StepsTimeline'
import { WhatsAppCta } from '../components/WhatsAppCta'

const steps = [
  {
    number: '01',
    title: 'Fale com a nossa equipe',
    description:
      'Chame a gente pelo WhatsApp e diga se a conexão é para casa ou para o negócio.',
  },
  {
    number: '02',
    title: 'Confira cobertura e opções',
    description:
      'Informe seu endereço, confirme a disponibilidade e conheça velocidades, valores e regras de contratação.',
  },
  {
    number: '03',
    title: 'Defina o plano e agende a instalação',
    description:
      'Se o plano atender ao que você precisa, confirme as condições e escolha a melhor data.',
  },
]

export function Steps() {
  const sectionRef = useRef<HTMLElement>(null)

  return (
    <section
      ref={sectionRef}
      id="como-contratar"
      className="relative overflow-hidden bg-[radial-gradient(60%_50%_at_50%_100%,rgba(30,107,255,0.35),transparent_70%),linear-gradient(180deg,#050f2c,#020716)] py-24 text-white sm:py-32"
    >
      <Container className="relative">
        <SectionHeading
          eyebrow="Como contratar"
          tone="light"
          align="center"
          title="Três passos para colocar a fibra para trabalhar por você."
          description="Comece pela conversa, veja o que está disponível no seu endereço e siga até a instalação no prazo combinado."
        />

        <div className="relative mt-14 grid gap-6 pl-14 lg:grid-cols-3 lg:gap-6 lg:pl-0 lg:pt-16">
          <StepsTimeline sectionRef={sectionRef} />

          {steps.map((step, index) => (
            <Reveal key={step.number} delay={index * 100}>
              <article
                data-step-card
                className="glass-panel group relative flex h-full flex-col gap-4 rounded-[1.75rem] p-7 transition duration-500 hover:-translate-y-1 hover:bg-white/[0.07] hover:shadow-[0_30px_70px_-40px_rgba(30,107,255,0.9)]"
              >
                <span
                  className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-cyan-signal/60 to-transparent opacity-60"
                  aria-hidden="true"
                />
                <div className="flex items-start justify-between gap-4">
                  <span className="font-display text-[3.5rem] font-extrabold italic leading-[0.9] tracking-[-0.04em] text-transparent [-webkit-text-stroke:1.4px_rgba(140,190,255,0.55)]">
                    {step.number}
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-white/45">
                    Passo {step.number}
                  </span>
                </div>
                <h3 className="mt-1 font-display text-xl font-bold text-white">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-white/60">{step.description}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={180}>
          <div className="mt-12 flex flex-col items-center gap-5 text-center">
            <WhatsAppCta message="Olá! Quero contratar a internet fibra óptica da MEGA+." variant="primary">
              Falar com a equipe agora
              <ArrowRight size={17} aria-hidden="true" />
            </WhatsAppCta>
            <p className="max-w-lg text-xs leading-relaxed text-white/60">
              A contratação está sujeita à cobertura, à disponibilidade técnica e
              à confirmação das condições comerciais.
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
