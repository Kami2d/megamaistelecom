import { ArrowRight, Camera, HeartPulse, UsersRound } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { Combo } from '../data/combos'
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

export function ComboCard({ combo, featured = false }: ComboCardProps) {
  const Icon = icons[combo.id] ?? Camera

  if (featured) {
    return (
      <article className="relative flex h-full min-h-[23rem] flex-col justify-between overflow-hidden rounded-[1.75rem] bg-ink-950 p-7 text-white sm:p-9">
        <img
          src="/images/combo-connectivity.jpg"
          alt="Ambiente conectado com tecnologia"
          className="absolute inset-0 h-full w-full object-cover opacity-35"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#020716_0%,rgba(2,7,22,0.82)_55%,rgba(2,7,22,0.2)_100%)]" />

        <div className="relative">
          <span className="eyebrow-pill">{combo.category}</span>
        </div>

        <div className="relative mt-14 max-w-xl">
          <h3 className="font-display text-3xl font-extrabold italic leading-[1.05] tracking-[-0.03em] sm:text-[2.7rem]">
            {combo.title}
          </h3>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/65">
            {combo.description}
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <WhatsAppCta message={combo.message}>
              Quero este combo
              <ArrowRight size={16} aria-hidden="true" />
            </WhatsAppCta>
            <span className="text-xs font-semibold text-cyan-signal">
              {combo.benefit}
            </span>
          </div>
        </div>
      </article>
    )
  }

  return (
    <article className="group flex h-full flex-col rounded-[1.5rem] border border-ink-900/[0.06] bg-[linear-gradient(180deg,#ffffff,#f8fbff)] p-7 shadow-[0_24px_50px_-36px_rgba(10,28,78,0.32)] transition-all duration-300 hover:-translate-y-1 hover:border-blue-brand/15 hover:shadow-[0_35px_70px_-40px_rgba(10,28,78,0.45)]">
      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-brand/10 text-blue-brand transition-colors duration-300 group-hover:bg-blue-brand/15">
        <Icon size={21} strokeWidth={1.8} aria-hidden="true" />
      </div>
      <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-brand">
        {combo.category}
      </p>
      <h3 className="mt-3 font-display text-xl font-bold italic leading-snug tracking-[-0.02em] text-ink-950">
        {combo.title}
      </h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-500">
        {combo.description}
      </p>
      <p className="mt-5 border-t border-line pt-4 text-xs font-semibold text-ink-700">
        {combo.benefit}
      </p>
      <WhatsAppCta
        message={combo.message}
        variant="outline-dark"
        size="sm"
        className="mt-5 w-full"
      >
        Quero este combo
        <ArrowRight size={15} aria-hidden="true" />
      </WhatsAppCta>
    </article>
  )
}
