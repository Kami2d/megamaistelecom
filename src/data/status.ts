/**
 * Catálogo de serviços monitorados pela Central de Status.
 *
 * Os status exibidos são preenchidos em tempo de execução pelo provider
 * (`src/services/status.ts`) a partir das páginas/APIs oficiais de cada
 * plataforma. Quando não há uma fonte consultável pelo navegador, o serviço
 * aparece como "Informação indisponível" com link para a fonte oficial.
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
  /** Detalhe do incidente ativo divulgado pela fonte oficial. */
  incidentDescription?: string
  /** Explicação quando não há API pública ou quando a consulta falhou. */
  note?: string
}

export type StatusIncident = {
  id: string
  serviceName: string
  description: string
  startedAt: string
  currentStatus: ServiceStatus
  resolvedAt?: string
  sourceName: string
  sourceUrl: string | null
}

export const statusLabels: Record<ServiceStatus, string> = {
  operational: 'Operacional',
  degraded: 'Instabilidade parcial',
  outage: 'Interrupção',
  maintenance: 'Manutenção programada',
  unknown: 'Informação indisponível',
}

export const statusUnknownMessage =
  'Não foi possível verificar o status deste serviço pela fonte oficial.'

export const categories: { id: ServiceCategory; label: string }[] = [
  { id: 'streaming', label: 'Streaming' },
  { id: 'social', label: 'Redes sociais' },
  { id: 'games', label: 'Jogos' },
  { id: 'communication', label: 'Comunicação' },
]

/**
 * Estado neutro usado antes da consulta e como fallback. Nenhum status é
 * inventado: `unknown` significa que a fonte oficial não pôde ser consultada.
 */
export const monitoredServices: MonitoredService[] = [
  {
    id: 'youtube',
    name: 'YouTube',
    category: 'streaming',
    status: 'unknown',
    lastUpdated: '—',
    sourceName: 'YouTube (site oficial)',
    sourceUrl: 'https://www.youtube.com/',
    note: 'O YouTube não disponibiliza uma API pública de status para consulta direta pelo navegador.',
  },
  {
    id: 'netflix',
    name: 'Netflix',
    category: 'streaming',
    status: 'unknown',
    lastUpdated: '—',
    sourceName: 'Central de ajuda da Netflix',
    sourceUrl: 'https://help.netflix.com/',
    note: 'A Netflix não mantém uma página de status com API pública confirmada.',
  },
  {
    id: 'disney',
    name: 'Disney+',
    category: 'streaming',
    status: 'unknown',
    lastUpdated: '—',
    sourceName: 'Central de ajuda do Disney+',
    sourceUrl: 'https://help.disneyplus.com/',
    note: 'O Disney+ não disponibiliza uma API pública de status.',
  },
  {
    id: 'prime-video',
    name: 'Amazon Prime Video',
    category: 'streaming',
    status: 'unknown',
    lastUpdated: '—',
    sourceName: 'Ajuda do Prime Video',
    sourceUrl: 'https://www.primevideo.com/help',
    note: 'O Prime Video não disponibiliza uma API pública de status.',
  },
  {
    id: 'twitch',
    name: 'Twitch',
    category: 'streaming',
    status: 'unknown',
    lastUpdated: '—',
    sourceName: 'Twitch Status',
    sourceUrl: 'https://status.twitch.com/',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    category: 'social',
    status: 'unknown',
    lastUpdated: '—',
    sourceName: 'Meta Status',
    sourceUrl: 'https://www.facebook.com/supportstatus/',
    note: 'A Meta não oferece uma API pública de status para estas plataformas.',
  },
  {
    id: 'facebook',
    name: 'Facebook',
    category: 'social',
    status: 'unknown',
    lastUpdated: '—',
    sourceName: 'Meta Status',
    sourceUrl: 'https://www.facebook.com/supportstatus/',
    note: 'A Meta não oferece uma API pública de status para estas plataformas.',
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    category: 'social',
    status: 'unknown',
    lastUpdated: '—',
    sourceName: 'Meta Status',
    sourceUrl: 'https://www.facebook.com/supportstatus/',
    note: 'A Meta não oferece uma API pública de status para estas plataformas.',
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    category: 'social',
    status: 'unknown',
    lastUpdated: '—',
    sourceName: 'Central de ajuda do TikTok',
    sourceUrl: 'https://support.tiktok.com/',
    note: 'O TikTok não disponibiliza uma API pública de status.',
  },
  {
    id: 'x',
    name: 'X',
    category: 'social',
    status: 'unknown',
    lastUpdated: '—',
    sourceName: 'Central de ajuda do X',
    sourceUrl: 'https://help.x.com/',
    note: 'O X não disponibiliza uma API pública de status.',
  },
  {
    id: 'steam',
    name: 'Steam',
    category: 'games',
    status: 'unknown',
    lastUpdated: '—',
    sourceName: 'Estatísticas de servidores Steam',
    sourceUrl: 'https://store.steampowered.com/stats/',
    note: 'As estatísticas da Steam não permitem consulta via navegador por restrição de CORS.',
  },
  {
    id: 'psn',
    name: 'PlayStation Network',
    category: 'games',
    status: 'unknown',
    lastUpdated: '—',
    sourceName: 'PlayStation Status',
    sourceUrl: 'https://status.playstation.com/',
  },
  {
    id: 'xbox',
    name: 'Xbox Network',
    category: 'games',
    status: 'unknown',
    lastUpdated: '—',
    sourceName: 'Xbox Live Status',
    sourceUrl: 'https://support.xbox.com/help/errors/xbox-live-status',
    note: 'A Xbox não disponibiliza uma API pública de status.',
  },
  {
    id: 'riot',
    name: 'Riot Games',
    category: 'games',
    status: 'unknown',
    lastUpdated: '—',
    sourceName: 'Riot Games Status',
    sourceUrl: 'https://status.riotgames.com/',
    note: 'A página da Riot não expõe um endpoint público de status compatível.',
  },
  {
    id: 'epic',
    name: 'Epic Games',
    category: 'games',
    status: 'unknown',
    lastUpdated: '—',
    sourceName: 'Epic Games Status',
    sourceUrl: 'https://status.epicgames.com/',
  },
  {
    id: 'discord',
    name: 'Discord',
    category: 'communication',
    status: 'unknown',
    lastUpdated: '—',
    sourceName: 'Discord Status',
    sourceUrl: 'https://discordstatus.com/',
  },
  {
    id: 'telegram',
    name: 'Telegram',
    category: 'communication',
    status: 'unknown',
    lastUpdated: '—',
    sourceName: 'Telegram (site oficial)',
    sourceUrl: 'https://telegram.org/',
    note: 'O Telegram não disponibiliza uma API pública de status.',
  },
  {
    id: 'google-meet',
    name: 'Google Meet',
    category: 'communication',
    status: 'unknown',
    lastUpdated: '—',
    sourceName: 'Google Workspace Status',
    sourceUrl: 'https://status.cloud.google.com/',
    note: 'O feed público do Google cobre incidentes de infraestrutura, não o status individual do Meet.',
  },
]
