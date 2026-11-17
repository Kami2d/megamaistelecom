import {
  Cable,
  Gauge,
  Headset,
  ShieldCheck,
  Wifi,
  Wrench,
  type LucideIcon,
} from 'lucide-react'
import { benefits, type BenefitIcon } from '../data/benefits'
import { Container } from '../components/Container'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'

const iconMap: Record<BenefitIcon, LucideIcon> = {
  fiber: Cable,
  gauge: Gauge,
  shield: ShieldCheck,
  headset: Headset,
  install: Wrench,
  wifi: Wifi,
}

export function Benefits() {
  return (
    <section id="diferenciais" className="bg-white py-24 sm:py-28">
      <Container>
        <div className="grid gap-14 lg:grid-cols-[0.82fr_1.18fr] lg:gap-24">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading
              eyebrow="Por que MEGA+"
              title={
                <>
                  Velocidade que se sente. <br className="hidden lg:block" />
                  Estabilidade que permanece.
                </>
              }
              description="Mais do que megas, uma conexão pensada para acompanhar a sua rotina com tranquilidade."
            />
            <Reveal delay={120}>
              <p className="mt-8 max-w-sm border-l-2 border-blue-brand/30 pl-5 text-sm leading-relaxed text-ink-500">
                Nossa comunicação e atendimento seguem o posicionamento oficial
                da MEGA+: conectar você com velocidade e estabilidade.
              </p>
            </Reveal>
          </div>

          <div className="grid gap-x-10 gap-y-9 sm:grid-cols-2">
            {benefits.map((benefit, index) => {
              const Icon = iconMap[benefit.icon]
              return (
                <Reveal key={benefit.title} delay={index * 70}>
                  <article className="group h-full border-t border-line pt-6 transition-colors duration-300 hover:border-blue-brand/60">
                    <div className="mb-5 grid h-11 w-11 place-items-center rounded-xl bg-mist-2 text-blue-brand transition-colors duration-300 group-hover:bg-blue-brand group-hover:text-white">
                      <Icon size={20} strokeWidth={1.8} aria-hidden="true" />
                    </div>
                    <h3 className="font-display text-lg font-semibold tracking-[-0.03em] text-ink-950">
                      {benefit.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-500">
                      {benefit.description}
                    </p>
                  </article>
                </Reveal>
              )
            })}
          </div>
        </div>
      </Container>
    </section>
  )
}
