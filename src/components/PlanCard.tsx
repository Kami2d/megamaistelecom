import type { KeyboardEvent } from 'react'
import { ArrowUpRight, Check, Router, Upload } from 'lucide-react'
import { plans, type Plan } from '../data/plans'
import { formatPrice } from '../lib/format'
import { WhatsAppCta } from './WhatsAppCta'

type PlanCardProps = {
  plan: Plan
  selected: boolean
  onSelect: (id: string) => void
  onNavigate: (index: number) => void
}

export function PlanCard({ plan, selected, onSelect, onNavigate }: PlanCardProps) {
  const featured = Boolean(plan.badge)
  const index = plans.findIndex((item) => item.id === plan.id)
  const message = `Olá! Tenho interesse no plano ${plan.name} (${plan.speedMb} Mbps), por ${formatPrice(plan.monthlyPrice)}/mês. Gostaria de consultar a cobertura e as condições no meu endereço.`

  return (
    <article
      role="radio"
      tabIndex={selected ? 0 : -1}
      aria-checked={selected}
      aria-label={`${plan.name}, ${plan.speedMb} Mbps, ${formatPrice(plan.monthlyPrice)} por mês`}
      onClick={() => onSelect(plan.id)}
      onKeyDown={(event: KeyboardEvent<HTMLElement>) => {
        if (event.target !== event.currentTarget) return

        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onSelect(plan.id)
          return
        }

        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
          event.preventDefault()
          onNavigate((index + 1) % plans.length)
        } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
          event.preventDefault()
          onNavigate((index - 1 + plans.length) % plans.length)
        } else if (event.key === 'Home') {
          event.preventDefault()
          onNavigate(0)
        } else if (event.key === 'End') {
          event.preventDefault()
          onNavigate(plans.length - 1)
        }
      }}
      data-plan-id={plan.id}
      data-featured={featured}
      className="plan-card cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-signal"
    >
      <span className="plan-meter" aria-hidden="true" />

      <div className="flex items-center justify-between gap-3">
        <p className={`text-[11px] font-bold uppercase tracking-[0.18em] ${featured ? 'text-white/55' : 'text-ink-500'}`}>
          Fibra óptica
        </p>
        {plan.badge && (
          <span className="rounded-full bg-[linear-gradient(100deg,#ff5a10,#ffa13d)] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-white shadow-[0_8px_18px_-8px_rgba(255,106,26,0.9)]">
            {plan.badge}
          </span>
        )}
      </div>

      <div>
        <p
          className={`font-display font-extrabold italic leading-[0.85] tracking-[-0.05em] ${
            plan.speedMb >= 1000
              ? 'text-[clamp(3rem,4.5vw,4.5rem)]'
              : 'text-[clamp(4rem,6.5vw,6rem)]'
          } ${
            featured ? 'text-white [text-shadow:0_0_36px_rgba(98,203,255,0.4)]' : 'text-ink-950'
          }`}
        >
          {plan.speedMb}
          <span className={`ml-2 font-display text-[0.26em] not-italic tracking-normal ${featured ? 'text-cyan-signal' : 'text-blue-brand'}`}>
            Mbps
          </span>
        </p>
        <h3 className={`mt-3 font-display text-xl font-bold tracking-[-0.02em] ${featured ? 'text-white' : 'text-ink-950'}`}>
          {plan.name}
        </h3>
        <p className={`mt-1.5 text-[13px] leading-relaxed ${featured ? 'text-white/65' : 'text-ink-500'}`}>
          {plan.description}
        </p>
      </div>

      <div className={`border-t pt-5 ${featured ? 'border-white/16' : 'border-ink-900/10'}`}>
        <p className={`text-[11px] font-bold uppercase tracking-[0.16em] ${featured ? 'text-white/45' : 'text-ink-500'}`}>
          A partir de
        </p>
        <p className={`mt-1 font-display text-[2.4rem] font-extrabold italic leading-none tracking-[-0.03em] ${featured ? 'text-white' : 'text-ink-950'}`}>
          {formatPrice(plan.monthlyPrice)}
          <span className={`ml-1 font-sans text-xs font-medium not-italic ${featured ? 'text-white/45' : 'text-ink-500'}`}>
            /mês
          </span>
        </p>
        <p className={`mt-2 text-[11px] ${featured ? 'text-white/40' : 'text-ink-500'}`}>
          Preço de catálogo · condições no atendimento
        </p>
      </div>

      <ul className="flex-1 space-y-2.5">
        {plan.benefits.map((benefit) => (
          <li key={benefit} className={`flex items-start gap-2.5 text-[13px] ${featured ? 'text-white/80' : 'text-ink-600'}`}>
            <span
              className={`mt-0.5 grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full ${
                featured ? 'bg-cyan-signal/20 text-cyan-signal' : 'bg-blue-brand/12 text-blue-brand'
              }`}
            >
              <Check size={11} strokeWidth={3} aria-hidden="true" />
            </span>
            {benefit}
          </li>
        ))}
        {plan.uploadMb !== null && (
          <li className={`flex items-start gap-2.5 text-[13px] ${featured ? 'text-white/80' : 'text-ink-600'}`}>
            <Upload size={15} className={featured ? 'text-cyan-signal' : 'text-blue-brand'} aria-hidden="true" />
            Upload de {plan.uploadMb} Mbps
          </li>
        )}
        {plan.routers !== null && (
          <li className={`flex items-start gap-2.5 text-[13px] ${featured ? 'text-white/80' : 'text-ink-600'}`}>
            <Router size={15} className={featured ? 'text-cyan-signal' : 'text-blue-brand'} aria-hidden="true" />
            {plan.routers} roteador{plan.routers > 1 ? 'es' : ''}
          </li>
        )}
      </ul>

      <p className={`rounded-xl px-3 py-2 text-[11px] leading-tight ${featured ? 'bg-white/[0.07] text-white/65' : 'bg-mist-2 text-ink-600'}`}>
        Com repetidor Wi-Fi · sujeito a disponibilidade e condições
      </p>

      <WhatsAppCta
        message={message}
        className="mt-1 w-full"
        onClick={(event) => event.stopPropagation()}
      >
        Quero este plano
        <ArrowUpRight size={16} aria-hidden="true" />
      </WhatsAppCta>
    </article>
  )
}
