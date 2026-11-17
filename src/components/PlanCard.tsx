import { ArrowUpRight, Check, Router, Upload } from 'lucide-react'
import type { Plan } from '../data/plans'
import { formatPrice } from '../lib/format'
import { isWhatsAppConfigured, whatsappUrl } from '../lib/whatsapp'

type PlanCardProps = {
  plan: Plan
  selected: boolean
  onSelect: (id: string) => void
}

export function PlanCard({ plan, selected, onSelect }: PlanCardProps) {
  const message = `Olá! Tenho interesse no plano ${plan.name} (${plan.speedMb} MB), por ${formatPrice(plan.monthlyPrice)}/mês. Gostaria de mais informações.`

  return (
    <article
      role="radio"
      tabIndex={0}
      aria-checked={selected}
      aria-label={`${plan.name}, ${plan.speedMb} MB, ${formatPrice(plan.monthlyPrice)} por mês`}
      onClick={() => onSelect(plan.id)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onSelect(plan.id)
        }
      }}
      className={`relative flex h-full cursor-pointer flex-col rounded-[22px] border bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-card sm:p-7 ${
        selected
          ? 'border-blue-brand ring-2 ring-blue-brand/20 shadow-card'
          : 'border-line'
      }`}
    >
      {plan.badge && (
        <span className="absolute right-5 top-5 rounded-full bg-blue-brand/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-blue-brand">
          {plan.badge}
        </span>
      )}

      <div className="flex items-center gap-3">
        <div className="grid h-9 w-9 place-items-center rounded-lg bg-ink-950 font-display text-xs font-bold text-cyan-signal">
          {plan.speedMb}
        </div>
        <p className="font-display text-base font-semibold tracking-[-0.03em] text-ink-950">
          {plan.name}
        </p>
      </div>

      <p className="mt-7 font-display text-[34px] font-bold leading-none tracking-[-0.05em] text-ink-950">
        {formatPrice(plan.monthlyPrice)}
        <span className="ml-1 font-sans text-sm font-medium tracking-normal text-ink-500">
          /mês
        </span>
      </p>
      <p className="mt-2 text-[11px] leading-relaxed text-ink-500">
        Preço de catálogo. Valor com desconto por pontualidade: a confirmar.
      </p>

      <div className="my-6 border-t border-line" />

      <ul className="flex-1 space-y-3">
        {plan.benefits.map((benefit) => (
          <li key={benefit} className="flex items-start gap-2.5 text-[13px] text-ink-600">
            <Check
              size={15}
              className="mt-0.5 shrink-0 text-blue-brand"
              aria-hidden="true"
            />
            {benefit}
          </li>
        ))}
        {plan.uploadMb !== null && (
          <li className="flex items-start gap-2.5 text-[13px] text-ink-600">
            <Upload size={15} className="mt-0.5 shrink-0 text-blue-brand" aria-hidden="true" />
            Upload de {plan.uploadMb} MB
          </li>
        )}
        {plan.routers !== null && (
          <li className="flex items-start gap-2.5 text-[13px] text-ink-600">
            <Router size={15} className="mt-0.5 shrink-0 text-blue-brand" aria-hidden="true" />
            {plan.routers} roteador{plan.routers > 1 ? 'es' : ''}
          </li>
        )}
      </ul>

      {isWhatsAppConfigured ? (
        <a
          href={whatsappUrl(message)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(event) => event.stopPropagation()}
          className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-ink-950 px-5 py-3.5 text-sm font-semibold text-white transition-colors duration-300 hover:bg-blue-brand"
        >
          Contratar agora
          <ArrowUpRight size={16} aria-hidden="true" />
        </a>
      ) : (
        <button
          type="button"
          disabled
          title="Atendimento pelo WhatsApp em breve"
          onClick={(event) => event.stopPropagation()}
          className="mt-8 inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-ink-950 px-5 py-3.5 text-sm font-semibold text-white opacity-60"
        >
          Em breve
        </button>
      )}
    </article>
  )
}
