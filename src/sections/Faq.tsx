import { ArrowRight, Instagram, MessageCircle } from 'lucide-react'
import { siteConfig } from '../data/site'
import { Container } from '../components/Container'
import { FaqAccordion } from '../components/FaqAccordion'
import { WhatsAppCta } from '../components/WhatsAppCta'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'

export function Faq() {
  return (
    <section id="faq" className="relative overflow-hidden bg-[radial-gradient(60%_45%_at_100%_0%,rgba(30,107,255,0.06),transparent_60%),linear-gradient(180deg,#eef3fb,#f7faff)] py-24 sm:py-32">
      <Container>
        <div className="grid gap-14 lg:grid-cols-[0.78fr_1.22fr] lg:gap-20">
          <div id="contato" className="scroll-mt-28 lg:sticky lg:top-28 lg:self-start">
            <SectionHeading
              eyebrow="Dúvidas frequentes"
              title="Tudo o que você precisa saber antes de escolher."
              description="Antes de contratar, conheça as opções e confirme as condições para o seu endereço."
            />

            <Reveal delay={120}>
              <div className="mt-9 rounded-[1.6rem] border border-ink-900/[0.06] bg-[linear-gradient(180deg,#ffffff,#f8fbff)] p-6 shadow-[0_30px_60px_-36px_rgba(10,28,78,0.35)] sm:p-7">
                <p className="font-display text-xl font-bold tracking-[-0.02em] text-ink-950">
                  Ainda precisa de ajuda?
                </p>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">
                  Nossa equipe responde suas perguntas e confirma as condições
                  disponíveis para o seu endereço.
                </p>
                <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.16em] text-ink-500">
                  Fale por WhatsApp ou telefone
                </p>
                <p className="mt-1 font-display text-2xl font-extrabold italic tracking-[-0.02em] text-ink-950">
                  {siteConfig.contact.phone}
                </p>
                <WhatsAppCta
                  message="Olá! Tenho dúvidas sobre os planos da MEGA+ e gostaria de falar com a equipe."
                  className="mt-6 w-full"
                >
                  Enviar mensagem
                  <MessageCircle size={16} aria-hidden="true" />
                </WhatsAppCta>
                <a
                  href={siteConfig.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex items-center justify-center gap-2 text-sm font-semibold text-ink-600 transition-colors hover:text-blue-brand"
                >
                  <Instagram size={16} aria-hidden="true" />
                  Ver Instagram oficial
                  <ArrowRight size={14} aria-hidden="true" />
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
