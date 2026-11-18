import {
  monitoredServices,
  statusUnknownMessage,
  type MonitoredService,
  type ServiceStatus,
  type StatusIncident,
  type StatusSource,
} from '../data/status'

export type StatusSnapshot = {
  services: MonitoredService[]
  incidents: StatusIncident[]
  /** Horário desta tentativa de consulta. */
  checkedAt: Date
  /** Horário da última consulta bem-sucedida. */
  lastSuccessfulAt: Date | null
  /** Origem dos dados: navegador (fontes com CORS) ou backend configurado. */
  origin: 'browser' | 'backend'
  mode: 'live'
}

export interface StatusProvider {
  id: string
  mode: StatusSnapshot['mode']
  load(): Promise<StatusSnapshot>
}

function positiveInt(value: unknown, fallback: number): number {
  const parsed = typeof value === 'string' || typeof value === 'number' ? Number(value) : NaN
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback
}

/**
 * Quando definida, a página passa a consumir apenas este endpoint (backend).
 * O contrato de resposta está documentado no README. Sem ela, são consultadas
 * diretamente apenas as fontes oficiais que liberam CORS.
 */
export const statusBackendUrl =
  typeof import.meta.env.VITE_STATUS_API_URL === 'string'
    ? import.meta.env.VITE_STATUS_API_URL.trim()
    : ''

/** Intervalo do polling, entre 2 e 5 minutos por padrão. */
export const statusPollIntervalMs = positiveInt(
  import.meta.env.VITE_STATUS_POLL_INTERVAL_MS,
  180_000,
)

const cacheTtlMs = positiveInt(import.meta.env.VITE_STATUS_CACHE_TTL_MS, 180_000)
const requestTimeoutMs = positiveInt(import.meta.env.VITE_STATUS_REQUEST_TIMEOUT_MS, 8_000)

type StatuspageComponent = { id?: string; name?: string; status?: string }

type StatuspageIncident = {
  id?: string
  name?: string
  status?: string
  impact?: string
  created_at?: string
  updated_at?: string
  components?: StatuspageComponent[]
}

type StatuspageMaintenance = StatuspageIncident & {
  scheduled_for?: string
  scheduled_until?: string
}

type StatuspageSummary = {
  status?: { indicator?: string; description?: string }
  incidents?: StatuspageIncident[]
  scheduled_maintenances?: StatuspageMaintenance[]
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

function formatDateTime(value?: string): string {
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

function formatTime(date: Date): string {
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

function parseDate(value: unknown): Date | null {
  if (typeof value !== 'string' && typeof value !== 'number') return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null
}

function asString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value : undefined
}

function safeUrl(value: unknown): string | null {
  const raw = asString(value)
  if (!raw) return null
  try {
    const url = new URL(raw)
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.href : null
  } catch {
    return null
  }
}

function asStringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined
  const names = value
    .map((item) => {
      const record = asRecord(item)
      return asString(record?.name) ?? asString(item)
    })
    .filter((name): name is string => Boolean(name))
  return names.length ? names.slice(0, 4) : undefined
}

function toServiceStatus(value: unknown): ServiceStatus {
  return value === 'operational' ||
    value === 'degraded' ||
    value === 'outage' ||
    value === 'maintenance' ||
    value === 'unknown'
    ? value
    : 'unknown'
}

async function fetchJson<T>(url: string): Promise<T> {
  const controller = new AbortController()
  const timer = window.setTimeout(() => controller.abort(), requestTimeoutMs)
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

type SourceReport = {
  status: ServiceStatus
  lastUpdated: string
  incidentDescription?: string
  incidentStartedAt?: string
  components?: string[]
  resolutionEta?: string
  maintenance?: boolean
  incidents: StatusIncident[]
}

function collectIncidents(
  data: StatuspageSummary,
  service: MonitoredService,
  source: StatusSource,
): StatusIncident[] {
  const activeIncidents = (data.incidents ?? [])
    .filter((item) => !item.status || ACTIVE_INCIDENT_STATUSES.has(item.status))
    .map<StatusIncident>((item) => ({
      id: `${service.id}-incident-${item.id ?? item.name ?? 'atual'}`,
      serviceName: service.name,
      description: item.name ?? 'Incidente divulgado pela fonte oficial.',
      startedAt: formatDateTime(item.created_at ?? item.updated_at),
      currentStatus: mapImpact(item.impact),
      sourceName: source.sourceName,
      sourceUrl: source.sourceUrl,
      components: asStringArray(item.components),
    }))

  const maintenances = (data.scheduled_maintenances ?? [])
    .filter((item) => item.status && ACTIVE_MAINTENANCE_STATUSES.has(item.status))
    .map<StatusIncident>((item) => ({
      id: `${service.id}-maintenance-${item.id ?? item.name ?? 'atual'}`,
      serviceName: service.name,
      description: item.name ?? 'Manutenção divulgada pela fonte oficial.',
      startedAt: formatDateTime(item.scheduled_for),
      currentStatus: 'maintenance',
      sourceName: source.sourceName,
      sourceUrl: source.sourceUrl,
      components: asStringArray(item.components),
      resolutionEta: formatDateTime(item.scheduled_until),
      maintenance: true,
    }))

  return [...activeIncidents, ...maintenances]
}

function normalizeStatuspage(
  data: StatuspageSummary,
  service: MonitoredService,
  source: StatusSource,
  timeLabel: string,
): SourceReport {
  const incidents = collectIncidents(data, service, source)
  const active = incidents[0]
  const hasMaintenance = incidents.some((item) => item.maintenance)

  return {
    status: mapIndicator(data.status?.indicator),
    lastUpdated: timeLabel,
    incidentDescription: active?.description,
    incidentStartedAt: active?.startedAt === '—' ? undefined : active?.startedAt,
    components: active?.components,
    resolutionEta: active?.resolutionEta === '—' ? undefined : active?.resolutionEta,
    maintenance: hasMaintenance || mapIndicator(data.status?.indicator) === 'maintenance',
    incidents,
  }
}

function preserveHistory(
  service: MonitoredService,
  previous: StatusSnapshot | null,
): Pick<MonitoredService, 'lastKnownStatus' | 'lastKnownAt'> {
  const previousService = previous?.services.find((item) => item.id === service.id)
  if (previousService && previousService.status !== 'unknown') {
    return {
      lastKnownStatus: previousService.status,
      lastKnownAt: previousService.lastUpdated,
    }
  }
  return {
    lastKnownStatus: service.lastKnownStatus,
    lastKnownAt: service.lastKnownAt,
  }
}

/** Serviço sem fonte consultável: nunca recebe um estado inferido. */
function buildUnconfigured(
  service: MonitoredService,
  previous: StatusSnapshot | null,
): MonitoredService {
  return {
    ...service,
    status: 'unknown',
    lastUpdated: previous?.services.find((item) => item.id === service.id)?.lastUpdated ?? '—',
    sourceState: 'unconfigured',
    lastKnownStatus: undefined,
    lastKnownAt: undefined,
    incidentDescription: undefined,
    incidentStartedAt: undefined,
    components: undefined,
    resolutionEta: undefined,
    maintenance: undefined,
    note: service.source?.unavailableReason ?? service.note ?? statusUnknownMessage,
  }
}

/** Falha da fonte: o estado anterior vira histórico, nunca estado atual. */
function buildSourceFailure(
  service: MonitoredService,
  previous: StatusSnapshot | null,
  reason: string,
): MonitoredService {
  return {
    ...service,
    status: 'unknown',
    lastUpdated: previous?.services.find((item) => item.id === service.id)?.lastUpdated ?? '—',
    sourceState: 'error',
    ...preserveHistory(service, previous),
    incidentDescription: undefined,
    incidentStartedAt: undefined,
    components: undefined,
    resolutionEta: undefined,
    maintenance: undefined,
    note: reason,
  }
}

function buildBrowserSnapshot(
  reports: Map<string, SourceReport | null>,
  checkedAt: Date,
  previous: StatusSnapshot | null,
): StatusSnapshot {
  const services = monitoredServices.map<MonitoredService>((service) => {
    const source = service.source
    const consultable = source?.kind === 'statuspage' && source.browserAccess && source.endpoint

    if (!consultable || !source?.endpoint) {
      return buildUnconfigured(service, previous)
    }

    const report = reports.get(service.id)
    if (!report) {
      return buildSourceFailure(
        service,
        previous,
        'Não foi possível consultar a fonte oficial neste momento. O último estado válido, quando existir, aparece apenas como histórico.',
      )
    }

    return {
      ...service,
      status: report.status,
      lastUpdated: report.lastUpdated,
      sourceState: 'ok',
      lastKnownStatus: undefined,
      lastKnownAt: undefined,
      incidentDescription: report.incidentDescription,
      incidentStartedAt: report.incidentStartedAt,
      components: report.components,
      resolutionEta: report.resolutionEta,
      maintenance: report.maintenance,
      note: undefined,
    }
  })

  const successfulSources = [...reports.values()].filter(Boolean).length

  return {
    services,
    incidents: [...reports.values()]
      .filter((report): report is SourceReport => Boolean(report))
      .flatMap((report) => report.incidents),
    checkedAt,
    lastSuccessfulAt: successfulSources > 0 ? checkedAt : (previous?.lastSuccessfulAt ?? null),
    origin: 'browser',
    mode: 'live',
  }
}

function normalizeBackendSnapshot(
  payload: unknown,
  fallbackCheckedAt: Date,
  previous: StatusSnapshot | null,
): StatusSnapshot {
  const root = asRecord(payload) ?? {}
  const checkedAt = parseDate(root.checkedAt) ?? fallbackCheckedAt
  const timeLabel = formatTime(checkedAt)
  const incomingServices = Array.isArray(root.services) ? root.services : []

  const services = monitoredServices.map<MonitoredService>((service) => {
    const raw = incomingServices
      .map(asRecord)
      .find((item) => item !== null && asString(item.id) === service.id)

    if (!raw) {
      return buildSourceFailure(service, previous, 'O backend não retornou dados para este serviço.')
    }

    const status = toServiceStatus(raw.status)
    if (status === 'unknown') {
      return buildSourceFailure(
        service,
        previous,
        'O backend não informou um estado reconhecido para este serviço.',
      )
    }

    return {
      ...service,
      status,
      lastUpdated: asString(raw.lastUpdated) ?? timeLabel,
      sourceName: asString(raw.sourceName) ?? service.sourceName,
      sourceUrl: safeUrl(raw.sourceUrl) ?? service.sourceUrl,
      sourceState: 'ok',
      lastKnownStatus: undefined,
      lastKnownAt: undefined,
      incidentDescription: asString(raw.incidentDescription),
      incidentStartedAt: asString(raw.incidentStartedAt),
      components: asStringArray(raw.components),
      resolutionEta: asString(raw.resolutionEta),
      maintenance: raw.maintenance === true,
      note: asString(raw.note),
    }
  })

  const incomingIncidents = Array.isArray(root.incidents) ? root.incidents : []
  const incidents = incomingIncidents
    .map(asRecord)
    .filter((item): item is Record<string, unknown> => item !== null)
    .filter((item) => Boolean(asString(item.id) && asString(item.serviceName) && asString(item.description)))
    .map<StatusIncident>((item) => ({
      id: String(item.id),
      serviceName: String(item.serviceName),
      description: String(item.description),
      startedAt: asString(item.startedAt) ?? formatDateTime(asString(item.created_at)),
      currentStatus: toServiceStatus(item.currentStatus ?? item.status),
      resolvedAt: asString(item.resolvedAt),
      sourceName: asString(item.sourceName) ?? 'Fonte oficial',
      sourceUrl: safeUrl(item.sourceUrl),
      components: asStringArray(item.components),
      resolutionEta: asString(item.resolutionEta),
      maintenance: item.maintenance === true,
    }))

  return {
    services,
    incidents,
    checkedAt,
    lastSuccessfulAt: checkedAt,
    origin: 'backend',
    mode: 'live',
  }
}

/** Snapshot neutro usado quando o próprio backend falha. */
function buildBackendFailure(previous: StatusSnapshot | null): StatusSnapshot {
  const checkedAt = new Date()
  return {
    services: monitoredServices.map((service) =>
      buildSourceFailure(
        service,
        previous,
        'Não foi possível consultar o backend de status. Nenhum estado atual foi assumido.',
      ),
    ),
    incidents: [],
    checkedAt,
    lastSuccessfulAt: previous?.lastSuccessfulAt ?? null,
    origin: 'backend',
    mode: 'live',
  }
}

async function loadFromBrowser(previous: StatusSnapshot | null): Promise<StatusSnapshot> {
  const checkedAt = new Date()
  const consultable = monitoredServices.filter(
    (service) => service.source?.kind === 'statuspage' && service.source.browserAccess && service.source.endpoint,
  )

  const entries = await Promise.all(
    consultable.map(async (service): Promise<[string, SourceReport | null]> => {
      const source = service.source as StatusSource & { endpoint: string }
      try {
        const data = await fetchJson<StatuspageSummary>(source.endpoint)
        return [service.id, normalizeStatuspage(data, service, source, formatTime(checkedAt))]
      } catch {
        return [service.id, null]
      }
    }),
  )

  return buildBrowserSnapshot(new Map(entries), checkedAt, previous)
}

async function loadFromBackend(previous: StatusSnapshot | null): Promise<{
  snapshot: StatusSnapshot
  success: boolean
}> {
  try {
    const payload = await fetchJson<unknown>(statusBackendUrl)
    return { snapshot: normalizeBackendSnapshot(payload, new Date(), previous), success: true }
  } catch {
    return { snapshot: buildBackendFailure(previous), success: false }
  }
}

let cachedSnapshot: StatusSnapshot | null = null
let lastFetchAt = 0
let inFlight: Promise<StatusSnapshot> | null = null

/** Provider usado pela página. Consulta o backend quando configurado. */
export const liveStatusProvider: StatusProvider = {
  id: statusBackendUrl ? 'status-backend' : 'official-sources',
  mode: 'live',
  async load() {
    const now = Date.now()
    if (cachedSnapshot && now - lastFetchAt < cacheTtlMs) return cachedSnapshot
    if (inFlight) return inFlight

    inFlight = (async () => {
      const result = statusBackendUrl
        ? await loadFromBackend(cachedSnapshot)
        : { snapshot: await loadFromBrowser(cachedSnapshot), success: true }

      if (result.success) {
        cachedSnapshot = result.snapshot
        lastFetchAt = Date.now()
      }
      return result.snapshot
    })().finally(() => {
      inFlight = null
    })

    return inFlight
  },
}

export const statusProvider: StatusProvider = liveStatusProvider
