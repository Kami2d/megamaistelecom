import { ArrowRight, Plus } from 'lucide-react'
import { objections } from '../data/objections'
import { Container } from '../components/Container'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { WhatsAppCta } from '../components/WhatsAppCta'

export function Objections() {
  return (
    <section id="confianca" className="bg-white py-24 sm:py-32">
      <Container>
        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading
              eyebrow="Escolha com confiança"
              title="Antes de contratar, tenha certeza de que está escolhendo bem."
              description="Cada casa tem uma rotina. Cada empresa tem uma necessidade. Por isso, escolher sua internet começa com as informações certas."
            />
            <Reveal delay={100}>
              <WhatsAppCta
                message="Olá! Tenho algumas dúvidas antes de contratar a internet da MEGA+."
                variant="outline-dark"
                className="mt-8"
              >
                Tirar minhas dúvidas
                <ArrowRight size={16} aria-hidden="true" />
              </WhatsAppCta>
            </Reveal>
          </div>

          <div className="border-t border-ink-900/10">
            {objections.map((item, index) => (
              <Reveal key={item.id} delay={index * 70}>
                <article className="group flex gap-5 border-b border-ink-900/10 py-7 sm:gap-7">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-mist-2 text-blue-brand shadow-[0_10px_24px_-12px_rgba(10,28,78,0.4)] transition-all duration-500 group-hover:rotate-90 group-hover:bg-ink-800 group-hover:text-cyan-signal">
                    <Plus size={21} aria-hidden="true" />
                  </span>
                  <div className="grid flex-1 gap-2 sm:grid-cols-[0.9fr_1.1fr] sm:gap-10">
                    <h3 className="font-display text-xl font-bold italic tracking-[-0.02em] text-ink-950 sm:text-2xl">
                      “{item.question}”
                    </h3>
                    <p className="text-sm leading-relaxed text-ink-500">{item.answer}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
