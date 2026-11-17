import { AlertTriangle, CheckCircle2, HelpCircle, Wrench, XCircle } from 'lucide-react'
import { type ServiceStatus, statusLabels } from '../data/status'

const styles: Record<ServiceStatus, { wrapper: string; icon: typeof CheckCircle2 }> = {
  operational: {
    wrapper: 'bg-emerald-50 text-emerald-700 ring-emerald-600/15',
    icon: CheckCircle2,
  },
  degraded: {
    wrapper: 'bg-amber-50 text-amber-700 ring-amber-600/15',
    icon: AlertTriangle,
  },
  outage: {
    wrapper: 'bg-red-50 text-red-700 ring-red-600/15',
    icon: XCircle,
  },
  maintenance: {
    wrapper: 'bg-blue-50 text-blue-700 ring-blue-600/15',
    icon: Wrench,
  },
  unknown: {
    wrapper: 'bg-slate-100 text-slate-600 ring-slate-500/15',
    icon: HelpCircle,
  },
}

export function StatusBadge({ status }: { status: ServiceStatus }) {
  const style = styles[status]
  const Icon = style.icon

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold ring-1 ring-inset ${style.wrapper}`}
    >
      <Icon size={12} aria-hidden="true" />
      {statusLabels[status]}
    </span>
  )
}
