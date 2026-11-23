import type { ServiceStatus, StatusHistoryPoint } from '../data/status'

export type DowndetectorStatus = Extract<
  ServiceStatus,
  'operational' | 'degraded' | 'outage'
>

export type DowndetectorServiceData = {
  id: string
  status?: DowndetectorStatus
  history?: StatusHistoryPoint[]
  reports?: number
}

export type DowndetectorFeed = {
  checkedAt: string
  services: DowndetectorServiceData[]
}

/** Integração com o proxy do Downdetector desativada neste projeto. */
export const downdetectorApiUrl = ''

const validStatuses = new Set<DowndetectorStatus>([
  'operational',
  'degraded',
  'outage',
])

function asRecord(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null
}

function asString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value : undefined
}

function normalizeHistory(value: unknown): StatusHistoryPoint[] | undefined {
  if (!Array.isArray(value)) return undefined

  const points = value
    .map((item) => {
      const record = asRecord(item)
      const at = asString(record?.at)
      const status = record?.status
      if (
        !at ||
        Number.isNaN(new Date(at).getTime()) ||
        !validStatuses.has(status as DowndetectorStatus)
      ) {
        return null
      }

      const reports = record?.reports
      return {
        at,
        status: status as DowndetectorStatus,
        ...(typeof reports === 'number' && Number.isFinite(reports) && reports >= 0
          ? { reports }
          : {}),
      }
    })
    .filter((point): point is StatusHistoryPoint => point !== null)
    .sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime())
    .slice(-48)

  return points.length ? points : undefined
}

function normalizeFeed(payload: unknown): DowndetectorFeed | null {
  const root = asRecord(payload)
  if (!root || !Array.isArray(root.services)) return null

  const checkedAt = asString(root.checkedAt)
  if (!checkedAt || Number.isNaN(new Date(checkedAt).getTime())) return null

  type NormalizedService = {
    id: string
    status: DowndetectorStatus | undefined
    history: StatusHistoryPoint[] | undefined
    reports: number | undefined
  }

  const services = root.services
    .map((item): NormalizedService | null => {
      const record = asRecord(item)
      const id = asString(record?.id)
      if (!record || !id) return null

      const status = record.status
      const reports = record.reports
      return {
        id,
        status: validStatuses.has(status as DowndetectorStatus)
          ? (status as DowndetectorStatus)
          : undefined,
        history: normalizeHistory(record.history),
        reports:
          typeof reports === 'number' && Number.isFinite(reports) && reports >= 0
            ? reports
            : undefined,
      }
    })
    .filter((service): service is NormalizedService => service !== null)

  return { checkedAt, services }
}

/** Retorna null quando o proxy não está configurado ou falha — nunca inventa dados. */
export async function loadDowndetectorFeed(): Promise<DowndetectorFeed | null> {
  if (!downdetectorApiUrl) return null

  const controller = new AbortController()
  const timer = window.setTimeout(() => controller.abort(), 8_000)
  try {
    const response = await fetch(downdetectorApiUrl, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    })
    if (!response.ok) return null
    return normalizeFeed(await response.json())
  } catch {
    return null
  } finally {
    window.clearTimeout(timer)
  }
}
