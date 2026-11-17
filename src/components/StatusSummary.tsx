import { AlertTriangle, CheckCircle2, HelpCircle, Wrench, XCircle } from 'lucide-react'
import { type MonitoredService, type ServiceStatus } from '../data/status'

type StatusSummaryProps = {
  services: MonitoredService[]
}

const cards: {
  status: ServiceStatus
  label: string
  icon: typeof CheckCircle2
  accent: string
}[] = [
  {
    status: 'operational',
    label: 'Operacionais',
    icon: CheckCircle2,
    accent: 'text-emerald-600',
  },
  {
    status: 'degraded',
    label: 'Com instabilidade',
    icon: AlertTriangle,
    accent: 'text-amber-600',
  },
  {
    status: 'outage',
    label: 'Indisponíveis',
    icon: XCircle,
    accent: 'text-red-600',
  },
  {
    status: 'maintenance',
    label: 'Em manutenção',
    icon: Wrench,
    accent: 'text-blue-brand',
  },
]

export function StatusSummary({ services }: StatusSummaryProps) {
  const operational = services.filter((s) => s.status === 'operational').length
  const availability = services.length
    ? Math.round((operational / services.length) * 100)
    : 0
  const unknown = services.filter((s) => s.status === 'unknown').length

  return (
    <div className="rounded-[24px] border border-ink-900/5 bg-white p-6 shadow-card sm:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-brand">
            Visão geral
          </p>
          <h2 className="mt-2 font-display text-2xl font-bold tracking-[-0.04em] text-ink-950">
            {services.length} serviços monitorados
          </h2>
          <p className="mt-1 text-xs text-ink-500">
            Percentual calculado sobre os dados demonstrativos recebidos.
          </p>
        </div>
        <div className="lg:min-w-[280px]">
          <div className="flex items-end justify-between">
            <span className="text-xs font-semibold text-ink-600">
              Disponibilidade geral
            </span>
            <span className="font-display text-3xl font-bold tracking-[-0.05em] text-ink-950">
              {availability}%
            </span>
          </div>
          <div
            className="mt-3 h-2 overflow-hidden rounded-full bg-mist-2"
            role="progressbar"
            aria-label="Disponibilidade geral"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={availability}
          >
            <div
              className="h-full rounded-full bg-blue-brand transition-[width] duration-500"
              style={{ width: `${availability}%` }}
            />
          </div>
          <p className="mt-2 flex items-center gap-1.5 text-[11px] text-ink-500">
            <HelpCircle size={12} aria-hidden="true" />
            {unknown} serviço{unknown === 1 ? '' : 's'} sem informação válida
            {unknown === 1 ? '' : 's'}
          </p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {cards.map(({ status, label, icon: Icon, accent }) => (
          <div key={status} className="rounded-xl border border-line bg-mist px-4 py-4">
            <Icon size={18} className={accent} aria-hidden="true" />
            <p className="mt-3 font-display text-2xl font-bold tracking-[-0.04em] text-ink-950">
              {services.filter((service) => service.status === status).length}
            </p>
            <p className="mt-0.5 text-[11px] font-medium text-ink-500">{label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
