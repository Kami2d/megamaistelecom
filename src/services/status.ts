import {
  monitoredServices,
  type MonitoredService,
  type ServiceStatus,
  type StatusIncident,
} from '../data/status'

export type StatusSnapshot = {
  services: MonitoredService[]
  incidents: StatusIncident[]
  checkedAt: Date
  mode: 'demo' | 'live'
}

export interface StatusProvider {
  id: string
  mode: StatusSnapshot['mode']
  load(): Promise<StatusSnapshot>
}

type StatuspageSource = {
  endpoint: string
  sourceName: string
  sourceUrl: string
}

type StatuspageSummary = {
  status?: { indicator?: string; description?: string }
  incidents?: Array<{
    id: string
    name: string
    status?: string
    impact?: string
    created_at?: string
    updated_at?: string
  }>
  scheduled_maintenances?: Array<{
    id: string
    name: string
    status?: string
    impact?: string
    scheduled_for?: string
  }>
}

/**
 * Fontes oficiais que expõem um endpoint JSON com CORS liberado para leitura
 * direta pelo navegador. Os demais serviços do catálogo permanecem como
 * "Informação indisponível", com link para a fonte oficial.
 */
const statuspageSources: Record<string, StatuspageSource> = {
  discord: {
    endpoint: 'https://discordstatus.com/api/v2/summary.json',
    sourceName: 'Discord Status',
    sourceUrl: 'https://discordstatus.com/',
  },
  twitch: {
    endpoint: 'https://status.twitch.com/api/v2/summary.json',
    sourceName: 'Twitch Status',
    sourceUrl: 'https://status.twitch.com/',
  },
  epic: {
    endpoint: 'https://status.epicgames.com/api/v2/summary.json',
    sourceName: 'Epic Games Status',
    sourceUrl: 'https://status.epicgames.com/',
  },
  psn: {
    endpoint: 'https://status.playstation.com/api/v2/summary.json',
    sourceName: 'PlayStation Status',
    sourceUrl: 'https://status.playstation.com/',
  },
}

const ACTIVE_INCIDENT_STATUSES = new Set([
  'investigating',
  'identified',
  'monitoring',
])
const ACTIVE_MAINTENANCE_STATUSES = new Set([
  'scheduled',
  'in_progress',
  'verifying',
])

function mapIndicator(indicator?: string): ServiceStatus {
  switch (indicator) {
    case 'none':
      return 'operational'
    case 'maintenance':
      return 'maintenance'
    case 'minor':
      return 'degraded'
    case 'major':
    case 'critical':
      return 'outage'
    default:
      return 'unknown'
  }
}

function mapImpact(impact?: string): ServiceStatus {
  switch (impact) {
    case 'minor':
      return 'degraded'
    case 'major':
    case 'critical':
      return 'outage'
    case 'maintenance':
      return 'maintenance'
    default:
      return 'degraded'
  }
}

function formatDateTime(value?: string) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

async function fetchJson<T>(url: string, timeoutMs = 8000): Promise<T> {
  const controller = new AbortController()
  const timer = window.setTimeout(() => controller.abort(), timeoutMs)
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    return (await response.json()) as T
  } finally {
    window.clearTimeout(timer)
  }
}

type SourceResult = {
  id: string
  source: StatuspageSource
  data: StatuspageSummary | null
}

function collectIncidents(result: SourceResult): StatusIncident[] {
  if (!result.data) return []

  const activeIncidents = (result.data.incidents ?? [])
    .filter((item) => !item.status || ACTIVE_INCIDENT_STATUSES.has(item.status))
    .map<StatusIncident>((item) => ({
      id: `${result.id}-incident-${item.id}`,
      serviceName: monitoredServices.find((service) => service.id === result.id)?.name ?? result.id,
      description: item.name,
      startedAt: formatDateTime(item.created_at ?? item.updated_at),
      currentStatus: mapImpact(item.impact),
      sourceName: result.source.sourceName,
      sourceUrl: result.source.sourceUrl,
    }))

  const maintenances = (result.data.scheduled_maintenances ?? [])
    .filter((item) => item.status && ACTIVE_MAINTENANCE_STATUSES.has(item.status))
    .map<StatusIncident>((item) => ({
      id: `${result.id}-maintenance-${item.id}`,
      serviceName: monitoredServices.find((service) => service.id === result.id)?.name ?? result.id,
      description: item.name,
      startedAt: formatDateTime(item.scheduled_for),
      currentStatus: 'maintenance',
      sourceName: result.source.sourceName,
      sourceUrl: result.source.sourceUrl,
    }))

  return [...activeIncidents, ...maintenances]
}

export const liveStatusProvider: StatusProvider = {
  id: 'official-sources',
  mode: 'live',
  async load() {
    const checkedAt = new Date()
    const timeLabel = checkedAt.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    })

    const results = await Promise.all(
      Object.entries(statuspageSources).map(async ([id, source]): Promise<SourceResult> => {
        try {
          return { id, source, data: await fetchJson<StatuspageSummary>(source.endpoint) }
        } catch {
          return { id, source, data: null }
        }
      }),
    )

    const byId = new Map(results.map((result) => [result.id, result]))
    const services = monitoredServices.map<MonitoredService>((service) => {
      const result = byId.get(service.id)
      if (!result) return { ...service }

      if (!result.data) {
        return {
          ...service,
          lastUpdated: timeLabel,
          note: 'Não foi possível consultar a fonte oficial neste momento.',
        }
      }

      const active = result.data.incidents?.find((item) =>
        item.status ? ACTIVE_INCIDENT_STATUSES.has(item.status) : true,
      )

      return {
        ...service,
        status: mapIndicator(result.data.status?.indicator),
        lastUpdated: timeLabel,
        note: undefined,
        incidentDescription: active?.name,
      }
    })

    return {
      services,
      incidents: results.flatMap(collectIncidents),
      checkedAt,
      mode: 'live',
    }
  },
}

/** Provider usado pela página: consulta direta às fontes oficiais. */
export const statusProvider: StatusProvider = liveStatusProvider
