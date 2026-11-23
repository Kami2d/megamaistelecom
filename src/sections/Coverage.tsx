import { ArrowRight, Check, MapPin } from 'lucide-react'
import { siteConfig } from '../data/site'
import { Container } from '../components/Container'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { WhatsAppCta } from '../components/WhatsAppCta'

export function Coverage() {
  return (
    <section id="cobertura" className="relative overflow-hidden bg-[radial-gradient(60%_55%_at_0%_100%,rgba(98,203,255,0.09),transparent_60%),radial-gradient(40%_40%_at_100%_0%,rgba(30,107,255,0.04),transparent_60%),#ffffff] py-24 sm:py-28">
      <Container>
        <div className="mx-auto max-w-3xl">
          <SectionHeading
            eyebrow="Cobertura"
            title="Consulte sua região"
            description="Fale com a nossa equipe pelo WhatsApp e confirme a disponibilidade de internet no seu endereço."
          />

          <Reveal delay={120}>
            <p className="mt-8 text-[11px] font-bold uppercase tracking-[0.18em] text-ink-500">
              Localidades atendidas
            </p>
            <div className="mt-4 flex flex-wrap gap-2.5">
              {siteConfig.locations.map((location) => (
                <span
                  key={location}
                  className="inline-flex items-center gap-2 rounded-full border border-line bg-mist px-4 py-2 text-sm font-medium text-ink-700"
                >
                  <MapPin size={14} className="text-blue-brand" aria-hidden="true" />
                  {location}
                </span>
              ))}
            </div>

            <ul className="mt-8 space-y-3 text-sm text-ink-600">
              <li className="flex items-start gap-3">
                <Check size={16} className="mt-0.5 shrink-0 text-blue-brand" aria-hidden="true" />
                Disponibilidade confirmada pelo atendimento, sem consulta automática.
              </li>
              <li className="flex items-start gap-3">
                <Check size={16} className="mt-0.5 shrink-0 text-blue-brand" aria-hidden="true" />
                Atendimento comercial para confirmar endereço e condições.
              </li>
            </ul>

            <WhatsAppCta
              message="Olá! Quero falar com a equipe sobre a cobertura da MEGA+ no meu endereço."
              variant="primary"
              className="mt-8"
            >
              Falar sobre cobertura
              <ArrowRight size={16} aria-hidden="true" />
            </WhatsAppCta>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
