import { useState } from 'react'
import { ArrowRight, Info } from 'lucide-react'
import { plans } from '../data/plans'
import { formatPrice } from '../lib/format'
import { Container } from '../components/Container'
import { PlanCard } from '../components/PlanCard'
import { WhatsAppCta } from '../components/WhatsAppCta'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'

export function Plans() {
  const [selectedId, setSelectedId] = useState('wifi-master')
  const selectedPlan = plans.find((plan) => plan.id === selectedId) ?? plans[0]

  return (
    <section id="planos" className="bg-mist py-24 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Planos de internet"
          align="center"
          title="Escolha a velocidade que combina com você."
          description="Planos de fibra óptica com valores de catálogo editáveis. Selecione um plano para ver o resumo e conversar com nossa equipe."
        />

        <div
          role="radiogroup"
          aria-label="Selecione um plano de internet"
          className="mt-14 grid gap-5 sm:grid-cols-2 xl:grid-cols-4"
        >
          {plans.map((plan, index) => (
            <Reveal key={plan.id} delay={index * 80}>
              <PlanCard
                plan={plan}
                selected={plan.id === selectedId}
                onSelect={setSelectedId}
              />
            </Reveal>
          ))}
        </div>

        <Reveal delay={120}>
          <div
            role="status"
            aria-live="polite"
            className="mt-8 flex flex-col items-start justify-between gap-6 rounded-[22px] border border-ink-900/10 bg-white px-6 py-6 shadow-card sm:flex-row sm:items-center sm:px-8"
          >
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-brand">
                Plano selecionado
              </p>
              <p className="mt-2 font-display text-xl font-bold tracking-[-0.03em] text-ink-950">
                {selectedPlan.name}{' '}
                <span className="font-sans text-sm font-medium text-ink-500">
                  · {selectedPlan.speedMb} MB · {formatPrice(selectedPlan.monthlyPrice)}/mês
                </span>
              </p>
            </div>
            <WhatsAppCta
              message={`Olá! Escolhi o plano ${selectedPlan.name} (${selectedPlan.speedMb} MB). Gostaria de seguir com a contratação.`}
              className="w-full shrink-0 sm:w-auto"
            >
              Contratar {selectedPlan.name}
              <ArrowRight size={16} aria-hidden="true" />
            </WhatsAppCta>
          </div>
        </Reveal>

        <p className="mt-6 flex items-start gap-2 text-xs leading-relaxed text-ink-500">
          <Info size={15} className="mt-0.5 shrink-0 text-blue-brand" aria-hidden="true" />
          Condições contratuais e valores com desconto por pontualidade são
          informados pela equipe comercial no atendimento.
        </p>
      </Container>
    </section>
  )
}
