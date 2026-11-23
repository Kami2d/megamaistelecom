import {
  ArrowUpRight,
  AtSign,
  Box,
  Clock3,
  Clapperboard,
  Cloud,
  CloudCog,
  Compass,
  Database,
  Facebook,
  Film,
  Gamepad2,
  GitBranch,
  Github,
  Globe,
  Instagram,
  Layers,
  MessageCircle,
  MessageSquare,
  MessagesSquare,
  Music2,
  Network,
  Play,
  Radio,
  Search,
  Send,
  Shield,
  ShieldCheck,
  Swords,
  Tv,
  Twitter,
  Twitch,
  Users,
  Video,
  Wrench,
  Youtube,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import {
  categories,
  type MonitoredService,
  statusLabels,
  statusUnknownMessage,
} from '../data/status'
import { StatusBadge } from './StatusBadge'
import { StatusHistoryChart } from './StatusHistoryChart'

const serviceIcons: Record<string, LucideIcon> = {
  youtube: Youtube,
  netflix: Clapperboard,
  disney: Tv,
  'prime-video': Play,
  twitch: Twitch,
  max: Film,
  spotify: Music2,
  globoplay: Radio,
  'apple-tv': Tv,
  instagram: Instagram,
  facebook: Facebook,
  whatsapp: MessageCircle,
  tiktok: Music2,
  x: Twitter,
  threads: AtSign,
  steam: Gamepad2,
  psn: Gamepad2,
  xbox: Gamepad2,
  riot: Swords,
  epic: Gamepad2,
  battlenet: Shield,
  minecraft: Box,
  roblox: Box,
  ea: Zap,
  ubisoft: Compass,
  discord: MessageSquare,
  telegram: Send,
  'google-meet': Video,
  zoom: Video,
  teams: Users,
  'google-chat': MessagesSquare,
  'google-cloud': Cloud,
  aws: CloudCog,
  azure: Cloud,
  cloudflare: Cloud,
  'google-workspace': Layers,
  github: Github,
  gitlab: GitBranch,
  oracle: Database,
  'google-search': Search,
  'google-dns': Network,
  'cloudflare-dns': Network,
  opendns: ShieldCheck,
  fastly: Zap,
  akamai: Globe,
}

export function ServiceCard({ service }: { service: MonitoredService }) {
  const Icon = serviceIcons[service.id] ?? Play
  const categoryLabel = categories.find((item) => item.id === service.category)?.label ?? ''
  const sourceFailed = service.sourceState === 'error'
  const sourceUnconfigured = service.sourceState === 'unconfigured'

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
      <p className="mt-1 text-[11px] text-ink-500">{categoryLabel}</p>
      <p className="mt-1 text-[11px] text-ink-500">
        Registro: {service.lastUpdated} · {service.sourceName}
      </p>

      {(sourceFailed || sourceUnconfigured) && (
        <p className="mt-3 inline-flex items-center gap-1.5 self-start rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-600">
          <Radio size={11} aria-hidden="true" />
          {sourceFailed ? 'Fonte indisponível no momento' : 'Sem fonte automática'}
        </p>
      )}

      {service.status === 'unknown' && !sourceFailed && !sourceUnconfigured && (
        <p className="mt-3 text-xs leading-relaxed text-ink-500">{statusUnknownMessage}</p>
      )}

      {service.lastKnownStatus && service.lastKnownAt && (
        <p className="mt-3 rounded-lg bg-mist px-3 py-2 text-[11px] leading-relaxed text-ink-600">
          Último estado válido: {statusLabels[service.lastKnownStatus]} em {service.lastKnownAt}.
          Registro histórico — não representa o estado atual.
        </p>
      )}

      {service.incidentDescription && (
        <div className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-800">
          {service.maintenance && (
            <span className="mr-1 inline-flex items-center gap-1 font-semibold">
              <Wrench size={11} aria-hidden="true" />
              Manutenção:
            </span>
          )}
          {service.incidentDescription}
          {service.incidentStartedAt && service.incidentStartedAt !== '—' && (
            <span className="mt-1 block text-[11px] text-amber-700/80">
              Início: {service.incidentStartedAt}
            </span>
          )}
          {service.components && service.components.length > 0 && (
            <span className="mt-1 block text-[11px] text-amber-700/80">
              Componentes: {service.components.join(', ')}
            </span>
          )}
          {service.resolutionEta && service.resolutionEta !== '—' && (
            <span className="mt-1 block text-[11px] text-amber-700/80">
              Previsão informada: {service.resolutionEta}
            </span>
          )}
        </div>
      )}

      {service.note && (
        <p className="mt-3 text-xs leading-relaxed text-ink-500">{service.note}</p>
      )}

      <StatusHistoryChart points={service.history} />

      <div className="mt-auto flex flex-wrap gap-x-4 gap-y-1 pt-4">
        {service.sourceUrl ? (
          <a
            href={service.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-blue-brand transition-colors hover:text-blue-bright"
          >
            {service.sourceName === 'Downdetector'
              ? 'Status: Downdetector'
              : 'Fonte oficial'}
            <ArrowUpRight size={12} aria-hidden="true" />
          </a>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-[11px] text-ink-500">
            <Clock3 size={12} aria-hidden="true" />
            Sem link de fonte disponível
          </span>
        )}

        <a
          href={service.downdetectorUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-blue-brand transition-colors hover:text-blue-bright"
        >
          Downdetector
          <ArrowUpRight size={12} aria-hidden="true" />
        </a>
      </div>
    </article>
  )
}
