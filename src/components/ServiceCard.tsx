import {
  ArrowUpRight,
  Clapperboard,
  Facebook,
  Gamepad2,
  Instagram,
  MessageCircle,
  MessageSquare,
  Music2,
  Play,
  Send,
  Swords,
  Twitch,
  Twitter,
  Video,
  Youtube,
  type LucideIcon,
} from 'lucide-react'
import { type MonitoredService, statusUnknownMessage } from '../data/status'
import { StatusBadge } from './StatusBadge'

const serviceIcons: Record<string, LucideIcon> = {
  youtube: Youtube,
  netflix: Clapperboard,
  disney: Play,
  'prime-video': Play,
  twitch: Twitch,
  instagram: Instagram,
  facebook: Facebook,
  whatsapp: MessageCircle,
  tiktok: Music2,
  x: Twitter,
  steam: Gamepad2,
  psn: Gamepad2,
  xbox: Gamepad2,
  riot: Swords,
  epic: Gamepad2,
  discord: MessageSquare,
  telegram: Send,
  'google-meet': Video,
}

export function ServiceCard({ service }: { service: MonitoredService }) {
  const Icon = serviceIcons[service.id] ?? Play

  return (
    <article className="flex h-full flex-col rounded-[18px] border border-line bg-white p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-brand/40 hover:shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-mist-2 text-ink-800">
          <Icon size={19} strokeWidth={1.8} aria-hidden="true" />
        </div>
        <StatusBadge status={service.status} />
      </div>

      <h3 className="mt-4 font-display text-[15px] font-bold tracking-[-0.03em] text-ink-950">
        {service.name}
      </h3>
      <p className="mt-1 text-[11px] text-ink-500">
        Registro: {service.lastUpdated} · {service.sourceName}
      </p>

      {service.status === 'unknown' && (
        <p className="mt-3 text-xs leading-relaxed text-ink-500">
          {statusUnknownMessage}
        </p>
      )}

      {service.incidentDescription && (
        <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-800">
          {service.incidentDescription}
        </p>
      )}

      {service.sourceUrl && (
        <a
          href={service.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto inline-flex items-center gap-1.5 pt-4 text-[11px] font-semibold text-blue-brand transition-colors hover:text-blue-bright"
        >
          Fonte oficial
          <ArrowUpRight size={12} aria-hidden="true" />
        </a>
      )}
    </article>
  )
}
