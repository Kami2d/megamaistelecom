import { ArrowRight, Check, MapPin } from 'lucide-react'
import { siteConfig } from '../data/site'
import { Container } from '../components/Container'
import { CoverageForm } from '../components/CoverageForm'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { WhatsAppCta } from '../components/WhatsAppCta'

export function Coverage() {
  return (
    <section id="cobertura" className="bg-white py-24 sm:py-28">
      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
          <div>
            <SectionHeading
              eyebrow="Cobertura"
              title="Sua região já está conectada?"
              description="Informe seu CEP para validar o formato e siga com a confirmação de disponibilidade diretamente com a nossa equipe."
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
                  Consulta frontend demonstrativa, sem integração de infraestrutura.
                </li>
                <li className="flex items-start gap-3">
                  <Check size={16} className="mt-0.5 shrink-0 text-blue-brand" aria-hidden="true" />
                  Atendimento comercial para confirmar endereço e condições.
                </li>
              </ul>

              <WhatsAppCta
                message="Olá! Quero falar com a equipe sobre a cobertura da MEGA+ no meu endereço."
                variant="outline-dark"
                className="mt-8"
              >
                Falar sobre cobertura
                <ArrowRight size={16} aria-hidden="true" />
              </WhatsAppCta>
            </Reveal>
          </div>

          <Reveal delay={160}>
            <CoverageForm />
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
