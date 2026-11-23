/**
 * Speedtest Provider Enrichment API (1.0.8) — lado do provedor.
 *
 * A Ookla chama este endpoint quando um assinante faz um Speedtest, enviando
 * ipv4/ipv6 e (opcionalmente) a porta de origem. A resposta descreve o serviço
 * contratado pelo assinante; ela NÃO mede velocidade e não inventa dados: se
 * não houver registro, a resposta é 404.
 *
 * Contrato: https://www.ookla.com/enrichment-api/
 * Paths: GET/POST /v1/subscriber-service
 * Autenticação: bearerAuth, oauth2, basicAuth e apiKeyAuth (configuráveis).
 */

import { isIPv4, isIPv6 } from 'node:net'
import { existsSync, readFileSync, statSync } from 'node:fs'
import { timingSafeEqual } from 'node:crypto'
import { join } from 'node:path'

const MAX_BODY_BYTES = 16 * 1024
const ENRICHMENT_PATHS = new Set([
  '/v1/subscriber-service',
  '/api/v1/subscriber-service',
])

function positiveInt(value, fallback) {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback
}

/** Comparação em tempo constante para tokens/senhas. */
function safeEqual(left, right) {
  const a = Buffer.from(String(left))
  const b = Buffer.from(String(right))
  if (a.length !== b.length) return false
  return timingSafeEqual(a, b)
}

function parseCookies(header = '') {
  const cookies = {}
  for (const part of header.split(';')) {
    const separator = part.indexOf('=')
    if (separator < 0) continue
    const key = part.slice(0, separator).trim()
    if (!key) continue
    const value = part.slice(separator + 1).trim()
    try {
      cookies[key] = decodeURIComponent(value)
    } catch {
      cookies[key] = value
    }
  }
  return cookies
}

/** Normaliza IPv6 para a forma comprimida canônica, facilitando o match. */
function normalizeIp(value) {
  const ip = String(value ?? '').trim()
  if (!ip) return ''
  if (isIPv4(ip)) return ip
  if (isIPv6(ip)) {
    try {
      return new URL(`http://[${ip}]/`).hostname.replace(/^\[|\]$/g, '').toLowerCase()
    } catch {
      return ip.toLowerCase()
    }
  }
  return ''
}

function asArray(value) {
  return Array.isArray(value) ? value : value === '' || value == null ? [] : [value]
}

function isFiniteNumber(value) {
  return typeof value === 'number' && Number.isFinite(value)
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

/** Monta a resposta apenas com campos do contrato — nada é preenchido por padrão. */
function buildSubscriberResponse(service) {
  if (!isPlainObject(service)) return null

  const result = {}
  if (typeof service.type === 'string' && service.type.trim()) {
    result.type = service.type.trim()
  }
  if (typeof service.technology === 'string' && service.technology.trim()) {
    result.technology = service.technology.trim()
  }

  if (isPlainObject(service.display)) {
    const display = {}
    if (isPlainObject(service.display.provisioned)) {
      const provisioned = {}
      const { downloadMbps, uploadMbps } = service.display.provisioned
      if (isFiniteNumber(downloadMbps) && downloadMbps >= 0) provisioned.downloadMbps = downloadMbps
      if (isFiniteNumber(uploadMbps) && uploadMbps >= 0) provisioned.uploadMbps = uploadMbps
      if (Object.keys(provisioned).length) display.provisioned = provisioned
    }
    if (typeof service.display.brand === 'string' && service.display.brand.trim()) {
      display.brand = service.display.brand.trim()
    }
    if (typeof service.display.supportUrl === 'string' && service.display.supportUrl.trim()) {
      display.supportUrl = service.display.supportUrl.trim()
    }
    if (typeof service.display.isThrottled === 'boolean') {
      display.isThrottled = service.display.isThrottled
    }
    if (Object.keys(display).length) result.display = display
  }

  if (isPlainObject(service.location)) {
    const location = {}
    const { latitude, longitude, source } = service.location
    if (isFiniteNumber(latitude) && latitude >= -90 && latitude <= 90) location.latitude = latitude
    if (isFiniteNumber(longitude) && longitude >= -180 && longitude <= 180) location.longitude = longitude
    if (typeof source === 'string' && source.trim()) location.source = source.trim()
    if (Object.keys(location).length) result.location = location
  }

  if (isPlainObject(service.supplementalData)) {
    const supplementalData = {}
    for (const key of ['proprietary', 'nonproprietary']) {
      if (isPlainObject(service.supplementalData[key])) {
        supplementalData[key] = service.supplementalData[key]
      }
    }
    if (Object.keys(supplementalData).length) result.supplementalData = supplementalData
  }

  return Object.keys(result).length ? result : null
}

async function readJsonBody(req) {
  const chunks = []
  let bytes = 0
  for await (const chunk of req) {
    bytes += chunk.length
    if (bytes > MAX_BODY_BYTES) throw new Error('body-too-large')
    chunks.push(chunk)
  }
  if (!chunks.length) return {}
  const parsed = JSON.parse(Buffer.concat(chunks).toString('utf8'))
  if (!isPlainObject(parsed)) throw new Error('invalid-body')
  return parsed
}

function parsePort(value) {
  if (value === undefined || value === null || value === '') return undefined
  const text = String(value).trim()
  if (!/^\d+$/.test(text)) return Number.NaN
  const port = Number(text)
  return port >= 1 && port <= 65535 ? port : Number.NaN
}

function parseIdentifiers(url, body) {
  const identifiers = body.identifiers && isPlainObject(body.identifiers) ? body.identifiers : body
  const rawIpv4 = url.searchParams.get('ipv4') ?? identifiers.ipv4
  const rawIpv6 = url.searchParams.get('ipv6') ?? identifiers.ipv6
  const rawPort = url.searchParams.get('port') ?? identifiers.port

  const ipv4 = rawIpv4 === undefined || rawIpv4 === null || rawIpv4 === ''
    ? ''
    : normalizeIp(rawIpv4)
  const ipv6 = rawIpv6 === undefined || rawIpv6 === null || rawIpv6 === ''
    ? ''
    : normalizeIp(rawIpv6)
  const port = parsePort(rawPort)

  const errors = []
  if (rawIpv4 && !ipv4) errors.push('ipv4 inválido')
  if (rawIpv6 && !ipv6) errors.push('ipv6 inválido')
  if (!ipv4 && !ipv6) errors.push('informe ipv4 e/ou ipv6')
  if (Number.isNaN(port)) errors.push('port deve ser um inteiro entre 1 e 65535')

  return { identifiers: { ipv4, ipv6, port }, errors }
}

/**
 * Cria o handler. Chamado depois do loadEnv() do servidor para que as variáveis
 * de ambiente do .env.local já estejam disponíveis.
 */
export function createEnrichmentHandler(send) {
  const bearerToken = process.env.ENRICHMENT_BEARER_TOKEN?.trim() || ''
  const oauth2Token = process.env.ENRICHMENT_OAUTH2_TOKEN?.trim() || ''
  const basicUser = process.env.ENRICHMENT_BASIC_USER ?? ''
  const basicPassword = process.env.ENRICHMENT_BASIC_PASSWORD ?? ''
  const apiKey = process.env.ENRICHMENT_API_KEY?.trim() || ''
  const apiKeyName = process.env.ENRICHMENT_API_KEY_NAME?.trim() || 'X-API-Key'
  const apiKeyIn = (process.env.ENRICHMENT_API_KEY_IN?.trim() || 'header').toLowerCase()
  const subscribersFile =
    process.env.ENRICHMENT_SUBSCRIBERS_FILE?.trim() ||
    join(process.cwd(), 'server', 'subscribers.json')
  const upstreamUrl = process.env.ENRICHMENT_SUBSCRIBER_UPSTREAM_URL?.trim() || ''
  const upstreamToken = process.env.ENRICHMENT_UPSTREAM_TOKEN?.trim() || ''
  const timeoutMs = positiveInt(process.env.ENRICHMENT_REQUEST_TIMEOUT_MS, 5000)

  const schemes = []
  if (bearerToken) schemes.push('bearerAuth')
  if (oauth2Token) schemes.push('oauth2')
  if (basicUser && basicPassword) schemes.push('basicAuth')
  if (apiKey) schemes.push('apiKeyAuth')

  let catalog = []
  let catalogMtime = 0

  function loadCatalog() {
    try {
      if (!existsSync(subscribersFile)) {
        catalog = []
        catalogMtime = 0
        return
      }
      const mtime = statSync(subscribersFile).mtimeMs
      if (mtime === catalogMtime) return
      const parsed = JSON.parse(readFileSync(subscribersFile, 'utf8'))
      catalog = Array.isArray(parsed)
        ? parsed
        : Array.isArray(parsed?.subscribers)
          ? parsed.subscribers
          : []
      catalogMtime = mtime
    } catch (error) {
      console.error('[enrichment] Falha ao carregar a base de assinantes:', error.message)
      catalog = []
      catalogMtime = 0
    }
  }

  loadCatalog()

  function isAuthorized(req, url) {
    const header = String(req.headers.authorization ?? '')

    const bearer = /^Bearer\s+(.+)$/i.exec(header)
    if (bearer) {
      const token = bearer[1].trim()
      if (bearerToken && safeEqual(token, bearerToken)) return true
      if (oauth2Token && safeEqual(token, oauth2Token)) return true
    }

    if (basicUser && basicPassword) {
      const basic = /^Basic\s+(.+)$/i.exec(header)
      if (basic) {
        try {
          const decoded = Buffer.from(basic[1].trim(), 'base64').toString('utf8')
          const separator = decoded.indexOf(':')
          if (
            separator >= 0 &&
            safeEqual(decoded.slice(0, separator), basicUser) &&
            safeEqual(decoded.slice(separator + 1), basicPassword)
          ) {
            return true
          }
        } catch {
          // credencial Basic inválida: cai na resposta 401
        }
      }
    }

    if (apiKey) {
      let supplied = ''
      if (apiKeyIn === 'query') supplied = url.searchParams.get(apiKeyName) ?? ''
      else if (apiKeyIn === 'cookie') {
        supplied = parseCookies(String(req.headers.cookie ?? ''))[apiKeyName] ?? ''
      } else {
        supplied = req.headers[apiKeyName.toLowerCase()] ?? ''
      }
      if (supplied && safeEqual(String(supplied), apiKey)) return true
    }

    return false
  }

  function matchLocal({ ipv4, ipv6, port }) {
    loadCatalog()
    const entry = catalog.find((item) => {
      if (!isPlainObject(item)) return false
      const matchesIp =
        (ipv4 && asArray(item.ipv4).map(normalizeIp).includes(ipv4)) ||
        (ipv6 && asArray(item.ipv6).map(normalizeIp).includes(ipv6))
      if (!matchesIp) return false

      const ports = asArray(item.ports).map(Number).filter(Number.isFinite)
      if (port !== undefined && ports.length && !ports.includes(port)) return false
      return true
    })
    return entry?.service ?? null
  }

  async function lookupUpstream(identifiers) {
    if (!upstreamUrl) return null

    const target = new URL(upstreamUrl)
    if (identifiers.ipv4) target.searchParams.set('ipv4', identifiers.ipv4)
    if (identifiers.ipv6) target.searchParams.set('ipv6', identifiers.ipv6)
    if (identifiers.port !== undefined) target.searchParams.set('port', String(identifiers.port))

    const response = await fetch(target, {
      headers: {
        Accept: 'application/json',
        ...(upstreamToken ? { Authorization: `Bearer ${upstreamToken}` } : {}),
      },
      signal: AbortSignal.timeout(timeoutMs),
    })
    if (response.status === 404) return null
    if (!response.ok) throw new Error(`Upstream HTTP ${response.status}`)

    const payload = await response.json()
    return payload?.service ?? payload?.subscriberService ?? payload
  }

  async function handle(req, res, url) {
    if (!ENRICHMENT_PATHS.has(url.pathname)) return false

    if (req.method !== 'GET' && req.method !== 'POST') {
      send(res, 405, { error: 'Method not supported by this provider' })
      return true
    }

    if (!schemes.length) {
      send(res, 503, {
        error:
          'Provider Enrichment API não configurada. Defina ao menos um esquema de autenticação (ENRICHMENT_BEARER_TOKEN, ENRICHMENT_OAUTH2_TOKEN, ENRICHMENT_BASIC_USER + ENRICHMENT_BASIC_PASSWORD ou ENRICHMENT_API_KEY).',
      })
      return true
    }

    if (!isAuthorized(req, url)) {
      send(res, 401, { error: 'Unauthorized' })
      return true
    }

    let body = {}
    if (req.method === 'POST') {
      try {
        body = await readJsonBody(req)
      } catch (error) {
        const message =
          error.message === 'body-too-large'
            ? 'Payload muito grande'
            : 'JSON inválido no corpo da requisição'
        send(res, 400, { error: 'Bad request', details: [message] })
        return true
      }
    }

    const { identifiers, errors } = parseIdentifiers(url, body)
    if (errors.length) {
      send(res, 400, { error: 'Bad request', details: errors })
      return true
    }

    try {
      const service = matchLocal(identifiers) ?? (await lookupUpstream(identifiers))
      const response = buildSubscriberResponse(service)
      if (!response) {
        send(
          res,
          service ? 502 : 404,
          service
            ? { error: 'A base do provedor retornou dados de assinante inválidos' }
            : { error: 'Subscriber Service Not Found' },
        )
        return true
      }
      send(res, 200, response)
    } catch (error) {
      console.error('[enrichment] Falha na consulta:', error.message)
      send(res, 502, { error: 'Falha ao consultar a base de assinantes do provedor' })
    }
    return true
  }

  return {
    handle,
    status: () => ({
      configured: schemes.length > 0,
      schemes,
      paths: [...ENRICHMENT_PATHS],
      subscribers: catalog.length,
      upstream: Boolean(upstreamUrl),
      apiKeyIn: apiKey ? apiKeyIn : null,
    }),
  }
}
