import { ArrowUpRight, Instagram, MessageCircle } from 'lucide-react'
import { siteConfig } from '../data/site'
import { Container } from '../components/Container'
import { FaqAccordion } from '../components/FaqAccordion'
import { WhatsAppCta } from '../components/WhatsAppCta'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'

export function Faq() {
  return (
    <section id="faq" className="bg-mist py-24 sm:py-28">
      <Container>
        <div className="grid gap-14 lg:grid-cols-[0.78fr_1.22fr] lg:gap-24">
          <div id="contato" className="scroll-mt-28">
            <SectionHeading
              eyebrow="Dúvidas frequentes"
              title="Antes de contratar, tire suas dúvidas."
              description="Reunimos as perguntas mais comuns sobre planos, instalação e atendimento."
            />

            <Reveal delay={120}>
              <div className="mt-9 rounded-[22px] border border-line bg-white p-6">
                <p className="font-display text-lg font-semibold tracking-[-0.03em] text-ink-950">
                  Ainda precisa de ajuda?
                </p>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">
                  Nossa equipe responde suas perguntas e confirma as condições
                  disponíveis para o seu endereço.
                </p>
                <WhatsAppCta
                  message="Olá! Tenho dúvidas sobre os planos da MEGA+ e gostaria de falar com a equipe."
                  className="mt-6 w-full"
                >
                  <MessageCircle size={16} aria-hidden="true" />
                  Falar no WhatsApp
                </WhatsAppCta>
                <a
                  href={siteConfig.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex items-center justify-center gap-2 text-sm font-semibold text-ink-600 transition-colors hover:text-blue-brand"
                >
                  <Instagram size={16} aria-hidden="true" />
                  Ver Instagram oficial
                  <ArrowUpRight size={14} aria-hidden="true" />
                </a>
              </div>
            </Reveal>
          </div>

          <Reveal delay={100}>
            <FaqAccordion />
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
