import { Activity } from 'lucide-react'
import type { StatusHistoryPoint, StatusHistoryStatus } from '../data/status'

type StatusHistoryChartProps = {
  points?: StatusHistoryPoint[]
  sourceName?: string
}

const statusStyle: Record<StatusHistoryStatus, { color: string; dot: string; label: string }> = {
  operational: { color: '#10b981', dot: 'bg-emerald-500', label: 'Operacional' },
  degraded: { color: '#f59e0b', dot: 'bg-amber-500', label: 'Instabilidade' },
  outage: { color: '#ef4444', dot: 'bg-red-500', label: 'Fora do ar' },
}

const statusOrder: StatusHistoryStatus[] = ['operational', 'degraded', 'outage']

function formatPointTime(value: string): string {
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? '—'
    : date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

export function StatusHistoryChart({
  points,
  sourceName = 'Downdetector',
}: StatusHistoryChartProps) {
  const history = points ?? []

  // Sem dados reais, o card não exibe nada — nenhum aviso e nenhum gráfico vazio.
  if (history.length === 0) return null

  const counts = statusOrder.reduce(
    (total, status) => ({
      ...total,
      [status]: history.filter((point) => point.status === status).length,
    }),
    { operational: 0, degraded: 0, outage: 0 },
  )
  const maxReports = Math.max(...history.map((point) => point.reports ?? 1), 1)
  const step = 240 / history.length
  const barWidth = Math.max(2, step - 1.5)
  const ariaLabel = `Histórico segundo ${sourceName}: ${counts.operational} pontos operacionais, ${counts.degraded} com instabilidade e ${counts.outage} fora do ar.`

  return (
    <div className="mt-4 rounded-xl border border-line bg-mist px-3 py-3">
      <div className="flex items-center justify-between gap-2">
        <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-ink-500">
          <Activity size={12} aria-hidden="true" />
          Gráfico · {sourceName}
        </p>
        <span className="text-[10px] text-ink-500">
          {formatPointTime(history[0].at)} –{' '}
          {formatPointTime(history[history.length - 1].at)}
        </span>
      </div>

      <svg
        viewBox="0 0 240 52"
        width="100%"
        height="52"
        preserveAspectRatio="none"
        role="img"
        aria-label={ariaLabel}
        className="mt-2"
      >
        <line
          x1="0"
          y1="47"
          x2="240"
          y2="47"
          stroke="currentColor"
          strokeWidth="1"
          className="text-ink-900/10"
        />
        {history.map((point, index) => {
          const value = point.reports ?? 1
          const height = Math.max(4, Math.round((value / maxReports) * 40))
          return (
            <rect
              key={`${point.at}-${index}`}
              x={index * step + 0.75}
              y={47 - height}
              width={barWidth}
              height={height}
              rx="1.5"
              fill={statusStyle[point.status].color}
            />
          )
        })}
      </svg>

      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
        {statusOrder.map((status) => (
          <span
            key={status}
            className="inline-flex items-center gap-1 text-[10px] text-ink-500"
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${statusStyle[status].dot}`}
              aria-hidden="true"
            />
            {statusStyle[status].label}: {counts[status]}
          </span>
        ))}
      </div>
    </div>
  )
}
