import { Clock3 } from 'lucide-react'
import type { StatusIncident } from '../data/status'
import { StatusBadge } from './StatusBadge'

export function IncidentHistory({ incidents }: { incidents: StatusIncident[] }) {
  return (
    <div className="overflow-hidden rounded-[20px] border border-line bg-white">
      <ul className="divide-y divide-line">
        {incidents.map((incident) => (
          <li key={incident.id} className="grid gap-4 p-5 sm:grid-cols-[1fr_auto] sm:items-start sm:p-6">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="font-display text-[15px] font-bold tracking-[-0.03em] text-ink-950">
                  {incident.serviceName}
                </h3>
                <StatusBadge status={incident.currentStatus} />
              </div>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">
                {incident.description}
              </p>
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[11px] text-ink-500">
                <span className="inline-flex items-center gap-1.5">
                  <Clock3 size={13} aria-hidden="true" />
                  Início: {incident.startedAt}
                </span>
                {incident.resolvedAt && (
                  <span className="inline-flex items-center gap-1.5">
                    <Clock3 size={13} aria-hidden="true" />
                    Resolução: {incident.resolvedAt}
                  </span>
                )}
              </div>
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-500/70 sm:text-right">
              {incident.resolvedAt ? 'Encerrado' : 'Em acompanhamento'}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
