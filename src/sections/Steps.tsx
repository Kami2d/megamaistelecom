import { ArrowRight, Check } from 'lucide-react'
import { Container } from '../components/Container'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { WhatsAppCta } from '../components/WhatsAppCta'

const steps = [
  {
    number: '01',
    title: 'Converse com a MEGA+',
    description:
      'Chame a equipe pelo WhatsApp e conte se procura internet para sua casa ou para sua empresa.',
  },
  {
    number: '02',
    title: 'Consulte cobertura e planos',
    description:
      'Informe seu endereço, verifique a disponibilidade e conheça velocidades, valores e condições.',
  },
  {
    number: '03',
    title: 'Escolha e combine a instalação',
    description:
      'Se o plano atender às suas necessidades, confirme as condições e veja as possibilidades de agendamento.',
  },
]

export function Steps() {
  return (
    <section
      id="como-contratar"
      className="relative overflow-hidden bg-[radial-gradient(60%_50%_at_50%_100%,rgba(30,107,255,0.35),transparent_70%),linear-gradient(180deg,#050f2c,#020716)] py-24 text-white sm:py-32"
    >
      <Container className="relative">
        <SectionHeading
          eyebrow="Como contratar"
          tone="light"
          align="center"
          title="Da escolha do plano à instalação, um passo de cada vez."
          description="Você não precisa descobrir tudo sozinho. Comece com uma conversa e conheça as opções disponíveis para sua casa ou empresa."
        />

        <div className="relative mt-16 grid gap-6 pl-10 lg:grid-cols-3 lg:gap-6 lg:pl-0">
          <span className="steps-track lg:left-0 lg:right-0 lg:top-[1.1rem] lg:bottom-auto lg:h-[2px] lg:w-auto" aria-hidden="true">
            <i className="lg:w-full lg:h-full" />
          </span>

          {steps.map((step, index) => (
            <Reveal key={step.number} delay={index * 100}>
              <article className="glass-panel relative flex h-full flex-col gap-4 rounded-[1.65rem] p-7">
                <span
                  className={`absolute -left-[3.1rem] top-2 grid h-9 w-9 place-items-center rounded-full bg-ink-900 text-white shadow-[inset_0_0_0_2px_rgba(255,255,255,0.25)] lg:static lg:h-auto lg:w-auto lg:bg-transparent lg:p-0 lg:text-left lg:shadow-none ${
                    index === steps.length - 1 ? '!bg-coral-accent' : ''
                  }`}
                  aria-hidden="true"
                >
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-white/20 lg:hidden">
                    <Check size={13} />
                  </span>
                  <span className="font-display text-[3.5rem] font-extrabold italic leading-[0.9] tracking-[-0.04em] text-transparent [-webkit-text-stroke:1.4px_rgba(140,190,255,0.55)] lg:block">
                    {step.number}
                  </span>
                </span>
                <h3 className="pt-2 font-display text-xl font-bold text-white lg:pt-0">
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
              Falar com a MEGA+ agora
              <ArrowRight size={17} aria-hidden="true" />
            </WhatsAppCta>
            <p className="max-w-lg text-xs leading-relaxed text-white/40">
              A contratação depende da cobertura, da disponibilidade técnica e da
              confirmação das condições comerciais.
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
