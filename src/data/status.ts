/**
 * Demonstrative data for the Central de Status.
 *
 * Nothing here is a live verification. Every state is fictional and is shown
 * to the visitor under an explicit "modo demonstração" notice. A future
 * backend adapter must replace `demoStatusProvider` (see src/services/status.ts)
 * with normalized results from official status pages/APIs.
 */

export type ServiceStatus =
  | 'operational'
  | 'degraded'
  | 'outage'
  | 'maintenance'
  | 'unknown'

export type ServiceCategory = 'streaming' | 'social' | 'games' | 'communication'

export type MonitoredService = {
  id: string
  name: string
  category: ServiceCategory
  status: ServiceStatus
  lastUpdated: string
  sourceName: string
  sourceUrl: string | null
  incidentDescription?: string
}

export type StatusIncident = {
  id: string
  serviceName: string
  description: string
  startedAt: string
  currentStatus: ServiceStatus
  resolvedAt?: string
}

export const statusLabels: Record<ServiceStatus, string> = {
  operational: 'Operacional',
  degraded: 'Instabilidade parcial',
  outage: 'Interrupção',
  maintenance: 'Manutenção programada',
  unknown: 'Informação indisponível',
}

export const statusUnknownMessage =
  'Não foi possível verificar o status deste serviço.'

export const categories: { id: ServiceCategory; label: string }[] = [
  { id: 'streaming', label: 'Streaming' },
  { id: 'social', label: 'Redes sociais' },
  { id: 'games', label: 'Jogos' },
  { id: 'communication', label: 'Comunicação' },
]

const time = (minutesAgo: number) =>
  new Date(Date.now() - minutesAgo * 60_000).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  })

export const monitoredServices: MonitoredService[] = [
  {
    id: 'youtube',
    name: 'YouTube',
    category: 'streaming',
    status: 'operational',
    lastUpdated: time(3),
    sourceName: 'Sem fonte pública confirmada',
    sourceUrl: null,
  },
  {
    id: 'netflix',
    name: 'Netflix',
    category: 'streaming',
    status: 'degraded',
    lastUpdated: time(7),
    sourceName: 'Netflix Status',
    sourceUrl: 'https://status.netflix.com/',
    incidentDescription:
      'Demonstração: lentidão no carregamento de alguns títulos.',
  },
  {
    id: 'disney',
    name: 'Disney+',
    category: 'streaming',
    status: 'operational',
    lastUpdated: time(5),
    sourceName: 'Sem fonte pública confirmada',
    sourceUrl: null,
  },
  {
    id: 'prime-video',
    name: 'Amazon Prime Video',
    category: 'streaming',
    status: 'operational',
    lastUpdated: time(4),
    sourceName: 'Sem fonte pública confirmada',
    sourceUrl: null,
  },
  {
    id: 'twitch',
    name: 'Twitch',
    category: 'streaming',
    status: 'maintenance',
    lastUpdated: time(12),
    sourceName: 'Twitch Status',
    sourceUrl: 'https://status.twitch.com/',
    incidentDescription:
      'Demonstração: manutenção programada em parte da plataforma.',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    category: 'social',
    status: 'operational',
    lastUpdated: time(2),
    sourceName: 'Meta Status',
    sourceUrl: 'https://www.facebook.com/supportstatus/',
  },
  {
    id: 'facebook',
    name: 'Facebook',
    category: 'social',
    status: 'operational',
    lastUpdated: time(2),
    sourceName: 'Meta Status',
    sourceUrl: 'https://www.facebook.com/supportstatus/',
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    category: 'social',
    status: 'degraded',
    lastUpdated: time(9),
    sourceName: 'Meta Status',
    sourceUrl: 'https://www.facebook.com/supportstatus/',
    incidentDescription:
      'Demonstração: atraso no envio de mensagens em algumas regiões.',
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    category: 'social',
    status: 'operational',
    lastUpdated: time(6),
    sourceName: 'Sem fonte pública confirmada',
    sourceUrl: null,
  },
  {
    id: 'x',
    name: 'X',
    category: 'social',
    status: 'unknown',
    lastUpdated: time(15),
    sourceName: 'Sem fonte pública confirmada',
    sourceUrl: null,
  },
  {
    id: 'steam',
    name: 'Steam',
    category: 'games',
    status: 'operational',
    lastUpdated: time(3),
    sourceName: 'Steam Stats',
    sourceUrl: 'https://store.steampowered.com/stats/',
  },
  {
    id: 'psn',
    name: 'PlayStation Network',
    category: 'games',
    status: 'outage',
    lastUpdated: time(11),
    sourceName: 'PlayStation Status',
    sourceUrl: 'https://status.playstation.com/',
    incidentDescription:
      'Demonstração: falha de conexão em serviços online selecionados.',
  },
  {
    id: 'xbox',
    name: 'Xbox Network',
    category: 'games',
    status: 'operational',
    lastUpdated: time(5),
    sourceName: 'Xbox Live Status',
    sourceUrl: 'https://support.xbox.com/help/errors/xbox-live-status',
  },
  {
    id: 'riot',
    name: 'Riot Games',
    category: 'games',
    status: 'unknown',
    lastUpdated: time(18),
    sourceName: 'Sem fonte pública confirmada',
    sourceUrl: null,
  },
  {
    id: 'epic',
    name: 'Epic Games',
    category: 'games',
    status: 'operational',
    lastUpdated: time(8),
    sourceName: 'Sem fonte pública confirmada',
    sourceUrl: null,
  },
  {
    id: 'discord',
    name: 'Discord',
    category: 'communication',
    status: 'operational',
    lastUpdated: time(1),
    sourceName: 'Discord Status',
    sourceUrl: 'https://discordstatus.com/',
  },
  {
    id: 'telegram',
    name: 'Telegram',
    category: 'communication',
    status: 'unknown',
    lastUpdated: time(21),
    sourceName: 'Sem fonte pública confirmada',
    sourceUrl: null,
  },
  {
    id: 'google-meet',
    name: 'Google Meet',
    category: 'communication',
    status: 'operational',
    lastUpdated: time(4),
    sourceName: 'Google Workspace Status',
    sourceUrl: 'https://status.cloud.google.com/',
  },
]

export const demoIncidents: StatusIncident[] = [
  {
    id: 'incident-psn',
    serviceName: 'PlayStation Network',
    description: 'Demonstração: indisponibilidade de serviços online.',
    startedAt: `Hoje, ${time(52)}`,
    currentStatus: 'outage',
  },
  {
    id: 'incident-netflix',
    serviceName: 'Netflix',
    description: 'Demonstração: lentidão intermitente na reprodução.',
    startedAt: `Hoje, ${time(38)}`,
    currentStatus: 'degraded',
  },
  {
    id: 'incident-whatsapp',
    serviceName: 'WhatsApp',
    description: 'Demonstração: atraso no envio de mensagens.',
    startedAt: `Ontem, ${time(180)}`,
    currentStatus: 'operational',
    resolvedAt: `Ontem, ${time(140)}`,
  },
]
