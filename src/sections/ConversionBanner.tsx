import { ArrowRight, MessageCircle } from 'lucide-react'
import { siteConfig } from '../data/site'
import { Container } from '../components/Container'
import { CtaLink } from '../components/CtaLink'
import { Reveal } from '../components/Reveal'
import { WhatsAppCta } from '../components/WhatsAppCta'

export function ConversionBanner() {
  return (
    <section className="bg-mist pb-0 pt-4 sm:pt-8">
      <Container>
        <Reveal>
          <div className="relative isolate overflow-hidden rounded-t-[2.5rem] bg-[radial-gradient(60%_80%_at_50%_120%,rgba(255,106,26,0.55),rgba(255,106,26,0)_60%),radial-gradient(70%_90%_at_50%_-20%,#1d5ae8_0%,rgba(29,90,232,0)_60%),linear-gradient(180deg,#0a1b50,#050d2a)] px-6 pb-20 pt-20 text-center text-white sm:px-12 sm:pb-24 sm:pt-24">
            <div className="grid-technical pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
            <div
              className="pointer-events-none absolute left-1/2 top-0 h-[55%] w-[2px] -translate-x-1/2 bg-[linear-gradient(180deg,transparent,rgba(160,215,255,0.9),transparent)] shadow-[0_0_30px_6px_rgba(98,203,255,0.35)]"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute left-1/2 top-1/2 h-[900px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-signal/10"
              aria-hidden="true"
            />

            <div className="relative mx-auto max-w-3xl">
              <span className="eyebrow-pill">Próximo passo</span>
              <h2 className="mt-7 font-display text-[2.5rem] font-extrabold italic leading-[1] tracking-[-0.03em] sm:text-[3.75rem]">
                Sua próxima conexão pode começar aqui.
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-white/60 sm:text-base">
                Encontre o plano que faz sentido para você. Consulte a cobertura,
                tire suas dúvidas e compare as opções antes de decidir.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <CtaLink href="#planos" variant="primary">
                  Quero conhecer os planos
                  <ArrowRight size={17} aria-hidden="true" />
                </CtaLink>
                <WhatsAppCta
                  message="Olá! Quero contratar internet fibra óptica da MEGA+. Podem me ajudar?"
                  variant="outline-light"
                >
                  Falar com atendimento
                  <MessageCircle size={16} aria-hidden="true" />
                </WhatsAppCta>
              </div>
              <p className="mt-7 text-[11px] text-white/35">
                Atendimento comercial · {siteConfig.brand.instagramHandle}
              </p>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
