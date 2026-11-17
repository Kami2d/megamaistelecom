import { ArrowRight, Camera, HeartPulse, ShieldCheck, UsersRound } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { Combo } from '../data/combos'
import { isWhatsAppConfigured, whatsappUrl } from '../lib/whatsapp'
import { WhatsAppCta } from './WhatsAppCta'

const icons: Record<string, LucideIcon> = {
  seguranca: Camera,
  telemedicina: HeartPulse,
  familia: UsersRound,
}

type ComboCardProps = {
  combo: Combo
  featured?: boolean
}

const secondaryCtaClass =
  'mt-5 inline-flex items-center justify-center gap-2 rounded-xl border border-ink-900/15 px-5 py-3 text-sm font-semibold text-ink-900 transition-colors hover:border-blue-brand/50 hover:bg-blue-brand/5 hover:text-blue-brand'

export function ComboCard({ combo, featured = false }: ComboCardProps) {
  const Icon = icons[combo.id] ?? ShieldCheck
  const href = whatsappUrl(combo.message)

  if (featured) {
    return (
      <article className="relative flex h-full min-h-[360px] flex-col justify-between overflow-hidden rounded-[24px] bg-ink-950 p-7 text-white sm:p-9">
        <img
          src="/images/combo-connectivity.jpg"
          alt="Ambiente conectado com tecnologia"
          className="absolute inset-0 h-full w-full object-cover opacity-35"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/80 to-ink-950/20" />

        <div className="relative">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-cyan-signal">
            {combo.category}
          </p>
        </div>

        <div className="relative mt-14 max-w-xl">
          <h3 className="font-display text-3xl font-bold leading-tight tracking-[-0.045em] sm:text-4xl">
            {combo.title}
          </h3>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/70">
            {combo.description}
          </p>
          <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center">
            <WhatsAppCta message={combo.message} variant="light">
              Quero este combo
              <ArrowRight size={16} aria-hidden="true" />
            </WhatsAppCta>
            <span className="text-xs font-medium text-cyan-signal">
              {combo.benefit}
            </span>
          </div>
        </div>
      </article>
    )
  }

  return (
    <article className="flex h-full flex-col rounded-[22px] border border-line bg-white p-7 transition-shadow duration-300 hover:shadow-card">
      <div className="grid h-11 w-11 place-items-center rounded-xl bg-blue-brand/10 text-blue-brand">
        <Icon size={20} strokeWidth={1.8} aria-hidden="true" />
      </div>
      <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-brand">
        {combo.category}
      </p>
      <h3 className="mt-3 font-display text-xl font-bold leading-snug tracking-[-0.035em] text-ink-950">
        {combo.title}
      </h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-500">
        {combo.description}
      </p>
      <p className="mt-5 border-t border-line pt-4 text-xs font-semibold text-ink-700">
        {combo.benefit}
      </p>
      {isWhatsAppConfigured ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={secondaryCtaClass}
        >
          Quero este combo
          <ArrowRight size={15} aria-hidden="true" />
        </a>
      ) : (
        <button
          type="button"
          disabled
          title="Atendimento pelo WhatsApp em breve"
          className={`${secondaryCtaClass} cursor-not-allowed opacity-60`}
        >
          Em breve
        </button>
      )}
    </article>
  )
}
