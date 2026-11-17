import { ArrowRight, MessageCircle } from 'lucide-react'
import { siteConfig } from '../data/site'
import { Container } from '../components/Container'
import { CtaLink } from '../components/CtaLink'
import { Reveal } from '../components/Reveal'
import { WhatsAppCta } from '../components/WhatsAppCta'

export function ConversionBanner() {
  return (
    <section className="bg-white pb-24 sm:pb-28">
      <Container>
        <Reveal>
          <div className="cta-panel relative overflow-hidden rounded-[28px] bg-ink-950 px-6 py-16 text-center text-white sm:px-12 sm:py-20">
            <div className="grid-technical pointer-events-none absolute inset-0 opacity-50" />
            <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-cyan-signal/15 blur-[100px]" />

            <div className="relative mx-auto max-w-3xl">
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-cyan-signal">
                Pronto para mudar de conexão?
              </p>
              <h2 className="mt-6 font-display text-3xl font-bold leading-[1.1] tracking-[-0.05em] sm:text-5xl">
                Chegou a hora de ter uma internet de verdade.
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-white/60 sm:text-base">
                Escolha seu plano, consulte a disponibilidade e converse com a
                equipe MEGA+ para dar o próximo passo.
              </p>
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <CtaLink href="#planos" variant="light" className="w-full sm:w-auto">
                  Quero contratar
                  <ArrowRight size={17} aria-hidden="true" />
                </CtaLink>
                <WhatsAppCta
                  message="Olá! Quero contratar internet fibra óptica da MEGA+. Podem me ajudar?"
                  variant="outline-light"
                  className="w-full sm:w-auto"
                >
                  <MessageCircle size={16} aria-hidden="true" />
                  Falar com atendimento
                </WhatsAppCta>
              </div>
              <p className="mt-6 text-[11px] text-white/35">
                Atendimento comercial · {siteConfig.brand.instagramHandle}
              </p>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
