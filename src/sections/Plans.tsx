import { ArrowRight, Info, Sparkles } from 'lucide-react'
import { usePlanSelection } from '../context/PlanSelectionContext'
import { plans } from '../data/plans'
import { formatPrice } from '../lib/format'
import { Container } from '../components/Container'
import { CtaLink } from '../components/CtaLink'
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
    <section id="planos" className="relative overflow-hidden rounded-t-[3rem] bg-[linear-gradient(180deg,#eef3fb,#f7faff)] pb-24 pt-16 sm:pb-28 sm:pt-20">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(60%_100%_at_50%_0%,rgba(30,107,255,0.08),transparent_70%)]"
        aria-hidden="true"
      />
      <Container className="relative">
        <SectionHeading
          eyebrow="Nossos planos"
          align="center"
          title="A velocidade que se ajusta ao seu dia a dia."
          description="Cada rotina pede uma conexão diferente. Compare de 350 a 1000 Mbps e escolha a ideal para sua casa ou empresa."
        />

        <div
          role="radiogroup"
          aria-label="Selecione um plano de internet"
          className="mt-14 mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {plans.map((plan, index) => (
            <Reveal
              key={plan.id}
              role="presentation"
              delay={index * 80}
              className="h-full"
            >
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
          <div className="relative mt-10 flex flex-col items-start justify-between gap-6 overflow-hidden rounded-[1.75rem] border border-white/10 bg-[linear-gradient(135deg,rgba(5,16,44,0.96),rgba(2,7,22,0.92))] px-6 py-7 text-white shadow-[0_35px_70px_-40px_rgba(2,7,22,0.8)] backdrop-blur-xl sm:flex-row sm:items-center sm:px-9">
            <div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_120%_at_0%_50%,rgba(30,107,255,0.22),transparent_60%),radial-gradient(50%_100%_at_100%_50%,rgba(255,106,26,0.14),transparent_60%)]"
              aria-hidden="true"
            />
            <div className="relative">
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
            <div className="relative flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
              <CtaLink
                href="#simulador"
                variant="outline-light"
                size="sm"
                className="w-full shrink-0 sm:w-auto"
              >
                Ainda em dúvida? Monte seu plano
                <Sparkles size={16} aria-hidden="true" />
              </CtaLink>
              <WhatsAppCta
                message={`Olá! Escolhi o plano ${selectedPlan.name} (${selectedPlan.speedMb} Mbps). Gostaria de verificar a cobertura e as condições no meu endereço.`}
                variant="blue"
                className="w-full shrink-0 sm:w-auto"
              >
                Seguir com este plano
                <ArrowRight size={16} aria-hidden="true" />
              </WhatsAppCta>
            </div>
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
