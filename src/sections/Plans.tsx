import { ArrowRight, Info } from 'lucide-react'
import { usePlanSelection } from '../context/PlanSelectionContext'
import { plans } from '../data/plans'
import { formatPrice } from '../lib/format'
import { Container } from '../components/Container'
import { PlanCard } from '../components/PlanCard'
import { WhatsAppCta } from '../components/WhatsAppCta'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'

export function Plans() {
  const { selectedPlanId: selectedId, setSelectedPlanId: setSelectedId } = usePlanSelection()
  const selectedPlan = plans.find((plan) => plan.id === selectedId) ?? plans[0]

  const focusPlan = (index: number) => {
    const plan = plans[index]
    setSelectedId(plan.id)
    window.requestAnimationFrame(() => {
      document.querySelector<HTMLElement>(`[data-plan-id="${plan.id}"]`)?.focus()
    })
  }

  return (
    <section id="planos" className="relative rounded-t-[3rem] bg-mist pb-24 pt-16 sm:pb-28 sm:pt-20">
      <Container>
        <SectionHeading
          eyebrow="Nossos planos"
          align="center"
          title="A velocidade que se ajusta ao seu dia a dia."
          description="Cada rotina pede uma conexão diferente. Compare de 400 a 800 Mbps e escolha a ideal para sua casa ou empresa."
        />

        <div
          role="radiogroup"
          aria-label="Selecione um plano de internet"
          className="mt-14 grid gap-6 sm:grid-cols-2 xl:grid-cols-4"
        >
          {plans.map((plan, index) => (
            <Reveal key={plan.id} role="presentation" delay={index * 80} className="h-full">
              <PlanCard
                plan={plan}
                selected={plan.id === selectedId}
                onSelect={setSelectedId}
                onNavigate={focusPlan}
              />
            </Reveal>
          ))}
        </div>

        <Reveal delay={120}>
          <div className="mt-10 flex flex-col items-start justify-between gap-6 rounded-[1.75rem] bg-ink-950 px-6 py-7 text-white shadow-[0_35px_70px_-40px_rgba(2,7,22,0.8)] sm:flex-row sm:items-center sm:px-9">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-signal">
                Plano selecionado
              </p>
              <p className="mt-2 font-display text-xl font-bold tracking-[-0.02em]">
                {selectedPlan.name}{' '}
                <span className="font-sans text-sm font-medium text-white/50">
                  · {selectedPlan.speedMb} Mbps · {formatPrice(selectedPlan.monthlyPrice)}/mês
                </span>
              </p>
            </div>
            <WhatsAppCta
              message={`Olá! Escolhi o plano ${selectedPlan.name} (${selectedPlan.speedMb} Mbps). Gostaria de verificar a cobertura e as condições no meu endereço.`}
              variant="blue"
              className="w-full shrink-0 sm:w-auto"
            >
              Seguir com este plano
              <ArrowRight size={16} aria-hidden="true" />
            </WhatsAppCta>
          </div>
        </Reveal>

        <p className="mt-6 flex items-start gap-2 text-xs leading-relaxed text-ink-500">
          <Info size={15} className="mt-0.5 shrink-0 text-blue-brand" aria-hidden="true" />
          Valores, condições e disponibilidade são confirmados diretamente com a
          nossa equipe.
        </p>
      </Container>
    </section>
  )
}
