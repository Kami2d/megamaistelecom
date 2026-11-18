/**
 * Catálogo configurável da Central de Status.
 *
 * Cada serviço declara aqui o seu nome, categoria e fonte oficial. Quando a
 * fonte expõe uma API compatível com Statuspage e libera CORS, o endpoint é
 * consultado diretamente pelo navegador. Caso contrário o serviço permanece
 * como "Informação indisponível" — nunca recebemos um status inventado.
 *
 * Para adicionar um serviço: basta incluir uma entrada em `serviceCatalog`.
 * Para trocar uma fonte: alterar apenas o `source` da entrada correspondente.
 */

export type ServiceStatus =
  | 'operational'
  | 'degraded'
  | 'outage'
  | 'maintenance'
  | 'unknown'

export type ServiceCategory =
  | 'streaming'
  | 'social'
  | 'games'
  | 'communication'
  | 'infrastructure'
  | 'internet'

/** Estado da fonte de monitoramento, separado do estado do serviço. */
export type SourceState = 'ok' | 'error' | 'unconfigured'

/** Tipo de adaptador usado pelo provider para interpretar a resposta. */
export type StatusSourceKind = 'statuspage' | 'unavailable'

export type StatusSource = {
  kind: StatusSourceKind
  /** URL JSON da API oficial. Obrigatório para `statuspage`. */
  endpoint?: string
  /** Só é consultado no navegador quando a fonte libera CORS. */
  browserAccess: boolean
  sourceName: string
  sourceUrl: string
  /** Motivo exibido quando não há consulta automática confiável. */
  unavailableReason?: string
}

export type MonitoredService = {
  id: string
  name: string
  category: ServiceCategory
  /** Estado atual. `unknown` quando a fonte não pôde ser consultada. */
  status: ServiceStatus
  /** Horário da última consulta bem-sucedida desta fonte. */
  lastUpdated: string
  sourceName: string
  sourceUrl: string | null
  source?: StatusSource
  sourceState?: SourceState
  /** Último estado válido, preservado apenas como informação histórica. */
  lastKnownStatus?: ServiceStatus
  lastKnownAt?: string
  incidentDescription?: string
  incidentStartedAt?: string
  components?: string[]
  resolutionEta?: string
  maintenance?: boolean
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
  components?: string[]
  resolutionEta?: string
  maintenance?: boolean
}

export const statusLabels: Record<ServiceStatus, string> = {
  operational: 'Operacional',
  degraded: 'Instabilidade',
  outage: 'Interrupção',
  maintenance: 'Manutenção',
  unknown: 'Informação indisponível',
}

export const statusUnknownMessage =
  'Não foi possível verificar o status deste serviço pela fonte oficial.'

export const categories: { id: ServiceCategory; label: string }[] = [
  { id: 'streaming', label: 'Streaming' },
  { id: 'social', label: 'Redes sociais' },
  { id: 'games', label: 'Jogos e plataformas' },
  { id: 'communication', label: 'Comunicação' },
  { id: 'infrastructure', label: 'Infraestrutura e nuvem' },
  { id: 'internet', label: 'Serviços de internet' },
]

/** API Statuspage com CORS liberado: consulta direta pelo navegador. */
const statuspage = (
  endpoint: string,
  sourceUrl: string,
  sourceName: string,
): StatusSource => ({
  kind: 'statuspage',
  endpoint,
  browserAccess: true,
  sourceName,
  sourceUrl,
})

/** API oficial sem CORS: o navegador não consulta; um backend pode fazê-lo. */
const backendStatuspage = (
  endpoint: string,
  sourceUrl: string,
  sourceName: string,
  reason: string,
): StatusSource => ({
  kind: 'statuspage',
  endpoint,
  browserAccess: false,
  sourceName,
  sourceUrl,
  unavailableReason: reason,
})

/** Sem API pública confiável: apenas link para a página oficial. */
const officialPage = (
  sourceUrl: string,
  sourceName: string,
  unavailableReason: string,
): StatusSource => ({
  kind: 'unavailable',
  browserAccess: false,
  sourceName,
  sourceUrl,
  unavailableReason,
})

type CatalogEntry = {
  id: string
  name: string
  category: ServiceCategory
  source: StatusSource
}

const serviceCatalog: CatalogEntry[] = [
  // Streaming
  {
    id: 'youtube',
    name: 'YouTube',
    category: 'streaming',
    source: officialPage(
      'https://www.youtube.com/',
      'YouTube (site oficial)',
      'O YouTube não divulga uma API pública de status com leitura automatizada.',
    ),
  },
  {
    id: 'netflix',
    name: 'Netflix',
    category: 'streaming',
    source: officialPage(
      'https://help.netflix.com/',
      'Central de ajuda da Netflix',
      'A Netflix não mantém uma página de status com API pública confirmada.',
    ),
  },
  {
    id: 'disney',
    name: 'Disney+',
    category: 'streaming',
    source: officialPage(
      'https://help.disneyplus.com/',
      'Central de ajuda do Disney+',
      'O Disney+ não disponibiliza uma API pública de status.',
    ),
  },
  {
    id: 'prime-video',
    name: 'Amazon Prime Video',
    category: 'streaming',
    source: officialPage(
      'https://www.primevideo.com/help',
      'Ajuda do Prime Video',
      'O Prime Video não disponibiliza uma API pública de status.',
    ),
  },
  {
    id: 'twitch',
    name: 'Twitch',
    category: 'streaming',
    source: statuspage(
      'https://status.twitch.com/api/v2/summary.json',
      'https://status.twitch.com/',
      'Twitch Status',
    ),
  },
  {
    id: 'max',
    name: 'Max',
    category: 'streaming',
    source: officialPage(
      'https://help.max.com/',
      'Central de ajuda da Max',
      'A Max não disponibiliza uma API pública de status.',
    ),
  },
  {
    id: 'spotify',
    name: 'Spotify',
    category: 'streaming',
    source: officialPage(
      'https://support.spotify.com/',
      'Suporte do Spotify',
      'Não foi confirmado um endpoint oficial de status com CORS para consulta automática.',
    ),
  },
  {
    id: 'globoplay',
    name: 'Globoplay',
    category: 'streaming',
    source: officialPage(
      'https://support.globoplay.com/',
      'Central de ajuda do Globoplay',
      'O Globoplay não disponibiliza uma API pública de status.',
    ),
  },
  {
    id: 'apple-tv',
    name: 'Apple TV+',
    category: 'streaming',
    source: officialPage(
      'https://www.apple.com/support/systemstatus/',
      'Apple System Status',
      'O painel da Apple não expõe um endpoint JSON com CORS para o navegador.',
    ),
  },

  // Redes sociais
  {
    id: 'instagram',
    name: 'Instagram',
    category: 'social',
    source: officialPage(
      'https://www.facebook.com/supportstatus/',
      'Meta Status',
      'A Meta não oferece uma API pública de status para o Instagram.',
    ),
  },
  {
    id: 'facebook',
    name: 'Facebook',
    category: 'social',
    source: officialPage(
      'https://www.facebook.com/supportstatus/',
      'Meta Status',
      'A Meta não oferece uma API pública de status para o Facebook.',
    ),
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    category: 'social',
    source: officialPage(
      'https://www.facebook.com/supportstatus/',
      'Meta Status',
      'A Meta não oferece uma API pública de status para o WhatsApp.',
    ),
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    category: 'social',
    source: officialPage(
      'https://support.tiktok.com/',
      'Central de ajuda do TikTok',
      'O TikTok não disponibiliza uma API pública de status.',
    ),
  },
  {
    id: 'x',
    name: 'X (Twitter)',
    category: 'social',
    source: officialPage(
      'https://help.x.com/',
      'Central de ajuda do X',
      'O X não disponibiliza uma API pública de status.',
    ),
  },
  {
    id: 'threads',
    name: 'Threads',
    category: 'social',
    source: officialPage(
      'https://www.threads.net/',
      'Threads (site oficial)',
      'A Meta não oferece uma API pública de status para o Threads.',
    ),
  },

  // Jogos e plataformas de jogos
  {
    id: 'steam',
    name: 'Steam',
    category: 'games',
    source: officialPage(
      'https://store.steampowered.com/stats/',
      'Estatísticas de servidores Steam',
      'As estatísticas da Steam não permitem leitura automatizada pelo navegador (CORS).',
    ),
  },
  {
    id: 'psn',
    name: 'PlayStation Network',
    category: 'games',
    source: backendStatuspage(
      'https://status.playstation.com/api/v2/summary.json',
      'https://status.playstation.com/',
      'PlayStation Status',
      'A API oficial da PlayStation não libera CORS para o navegador; requer consulta via backend.',
    ),
  },
  {
    id: 'xbox',
    name: 'Xbox Network',
    category: 'games',
    source: officialPage(
      'https://support.xbox.com/help/errors/xbox-live-status',
      'Xbox Live Status',
      'A Xbox não disponibiliza uma API pública de status.',
    ),
  },
  {
    id: 'riot',
    name: 'Riot Games',
    category: 'games',
    source: officialPage(
      'https://status.riotgames.com/',
      'Riot Games Status',
      'A página oficial é uma aplicação sem endpoint público de status documentado.',
    ),
  },
  {
    id: 'epic',
    name: 'Epic Games',
    category: 'games',
    source: statuspage(
      'https://status.epicgames.com/api/v2/summary.json',
      'https://status.epicgames.com/',
      'Epic Games Status',
    ),
  },
  {
    id: 'battlenet',
    name: 'Battle.net',
    category: 'games',
    source: officialPage(
      'https://www.blizzard.com/support/',
      'Suporte da Blizzard',
      'Não há página de status oficial com API pública confirmada para Battle.net.',
    ),
  },
  {
    id: 'minecraft',
    name: 'Minecraft Services',
    category: 'games',
    source: officialPage(
      'https://status.mojang.com/',
      'Mojang Status',
      'O endpoint da Mojang não libera CORS para consulta direta pelo navegador.',
    ),
  },
  {
    id: 'roblox',
    name: 'Roblox',
    category: 'games',
    source: officialPage(
      'https://status.roblox.com/',
      'Roblox Status',
      'A página oficial da Roblox não expõe uma API pública de status documentada.',
    ),
  },
  {
    id: 'ea',
    name: 'EA Services',
    category: 'games',
    source: officialPage(
      'https://help.ea.com/en/help/faq/server-status/',
      'EA Server Status',
      'A EA não disponibiliza uma API pública de status.',
    ),
  },
  {
    id: 'ubisoft',
    name: 'Ubisoft Connect',
    category: 'games',
    source: officialPage(
      'https://status.ubisoft.com/',
      'Ubisoft Status',
      'Não foi confirmado um endpoint oficial com CORS para consulta automática.',
    ),
  },

  // Comunicação
  {
    id: 'discord',
    name: 'Discord',
    category: 'communication',
    source: statuspage(
      'https://discordstatus.com/api/v2/summary.json',
      'https://discordstatus.com/',
      'Discord Status',
    ),
  },
  {
    id: 'telegram',
    name: 'Telegram',
    category: 'communication',
    source: officialPage(
      'https://telegram.org/',
      'Telegram (site oficial)',
      'O Telegram não disponibiliza uma API pública de status.',
    ),
  },
  {
    id: 'google-meet',
    name: 'Google Meet',
    category: 'communication',
    source: officialPage(
      'https://status.cloud.google.com/',
      'Google Cloud Status',
      'As fontes públicas do Google cobrem a infraestrutura, não o status individual do Meet.',
    ),
  },
  {
    id: 'zoom',
    name: 'Zoom',
    category: 'communication',
    source: statuspage(
      'https://status.zoom.us/api/v2/summary.json',
      'https://status.zoom.us/',
      'Zoom Status',
    ),
  },
  {
    id: 'teams',
    name: 'Microsoft Teams',
    category: 'communication',
    source: officialPage(
      'https://portal.office.com/servicestatus',
      'Microsoft 365 Status',
      'O painel da Microsoft não expõe API pública com CORS para o navegador.',
    ),
  },
  {
    id: 'google-chat',
    name: 'Google Chat',
    category: 'communication',
    source: officialPage(
      'https://status.cloud.google.com/',
      'Google Cloud Status',
      'As fontes públicas do Google cobrem a infraestrutura, não o status individual do Chat.',
    ),
  },

  // Infraestrutura e serviços em nuvem
  {
    id: 'google-cloud',
    name: 'Google Cloud',
    category: 'infrastructure',
    source: officialPage(
      'https://status.cloud.google.com/',
      'Google Cloud Status',
      'O feed de incidentes do Google não libera CORS para leitura direta pelo navegador.',
    ),
  },
  {
    id: 'aws',
    name: 'Amazon Web Services (AWS)',
    category: 'infrastructure',
    source: officialPage(
      'https://health.aws.amazon.com/health/status',
      'AWS Health Dashboard',
      'O painel da AWS não oferece endpoint JSON público com CORS.',
    ),
  },
  {
    id: 'azure',
    name: 'Microsoft Azure',
    category: 'infrastructure',
    source: officialPage(
      'https://azure.status.microsoft/',
      'Azure Status',
      'O feed XML da Azure não libera CORS para leitura direta pelo navegador.',
    ),
  },
  {
    id: 'cloudflare',
    name: 'Cloudflare',
    category: 'infrastructure',
    source: statuspage(
      'https://www.cloudflarestatus.com/api/v2/summary.json',
      'https://www.cloudflarestatus.com/',
      'Cloudflare Status',
    ),
  },
  {
    id: 'google-workspace',
    name: 'Google Workspace',
    category: 'infrastructure',
    source: officialPage(
      'https://status.cloud.google.com/',
      'Google Workspace Status',
      'O feed público do Google cobre incidentes de infraestrutura, não componentes individuais.',
    ),
  },
  {
    id: 'github',
    name: 'GitHub',
    category: 'infrastructure',
    source: statuspage(
      'https://www.githubstatus.com/api/v2/summary.json',
      'https://www.githubstatus.com/',
      'GitHub Status',
    ),
  },
  {
    id: 'gitlab',
    name: 'GitLab',
    category: 'infrastructure',
    source: officialPage(
      'https://status.gitlab.com/',
      'GitLab System Status',
      'A página da GitLab usa outro provedor de status, sem API JSON pública confirmada.',
    ),
  },
  {
    id: 'oracle',
    name: 'Oracle Cloud',
    category: 'infrastructure',
    source: officialPage(
      'https://status.oracle.com/',
      'Oracle Cloud Status',
      'Não foi confirmado um endpoint oficial com CORS para consulta automática.',
    ),
  },

  // Serviços de internet
  {
    id: 'google-search',
    name: 'Google Search',
    category: 'internet',
    source: officialPage(
      'https://www.google.com/',
      'Google (site oficial)',
      'A Busca do Google não possui página de status com API pública.',
    ),
  },
  {
    id: 'google-dns',
    name: 'Google DNS',
    category: 'internet',
    source: officialPage(
      'https://developers.google.com/speed/public-dns',
      'Google Public DNS',
      'O Google Public DNS não possui página de status com API pública.',
    ),
  },
  {
    id: 'cloudflare-dns',
    name: 'Cloudflare DNS',
    category: 'internet',
    source: officialPage(
      'https://www.cloudflarestatus.com/',
      'Cloudflare Status',
      'O painel da Cloudflare informa a rede como um todo, sem componente específico de DNS.',
    ),
  },
  {
    id: 'opendns',
    name: 'OpenDNS',
    category: 'internet',
    source: officialPage(
      'https://status.opendns.com/',
      'OpenDNS Status',
      'Não foi confirmado um endpoint oficial com CORS para consulta automática.',
    ),
  },
  {
    id: 'fastly',
    name: 'Fastly',
    category: 'internet',
    source: officialPage(
      'https://status.fastly.com/',
      'Fastly Status',
      'A API pública da Fastly não libera CORS para o navegador.',
    ),
  },
  {
    id: 'akamai',
    name: 'Akamai',
    category: 'internet',
    source: statuspage(
      'https://status.akamai.com/api/v2/summary.json',
      'https://status.akamai.com/',
      'Akamai Status',
    ),
  },
]

/** Estado neutro usado antes da primeira consulta e como fallback. */
export const monitoredServices: MonitoredService[] = serviceCatalog.map((entry) => ({
  ...entry,
  status: 'unknown',
  lastUpdated: '—',
  sourceName: entry.source.sourceName,
  sourceUrl: entry.source.sourceUrl,
  sourceState: entry.source.browserAccess ? undefined : 'unconfigured',
}))
