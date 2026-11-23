/**
 * Proxy da API v2 do Downdetector.
 *
 * As credenciais ficam apenas no servidor (DOWNDETECTOR_CLIENT_ID e
 * DOWNDETECTOR_CLIENT_SECRET). O navegador consulta GET /api/downdetector,
 * que devolve status actual, volume de relatos e histórico em 15 min.
 *
 * Contrato: https://downdetectorapi.com/v2/docs/api.json
 */

import { createServer } from 'node:http'
import { existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createEnrichmentHandler } from './enrichment.mjs'

const here = dirname(fileURLToPath(import.meta.url))
const API_BASE = 'https://downdetectorapi.com/v2'
const PORT = Number(process.env.PORT ?? 8787)
const COUNTRY = (process.env.DOWNDETECTOR_COUNTRY ?? 'BR').toUpperCase()
const CACHE_TTL_MS = positiveInt(process.env.DOWNDETECTOR_CACHE_TTL_MS, 180_000)
const BASELINE_TTL_MS = 24 * 60 * 60 * 1000
const CONCURRENCY = positiveInt(process.env.DOWNDETECTOR_CONCURRENCY, 4)
const REQUEST_TIMEOUT_MS = positiveInt(process.env.DOWNDETECTOR_REQUEST_TIMEOUT_MS, 10_000)
const CORS_ORIGIN = process.env.DOWNDETECTOR_CORS_ORIGIN ?? '*'

function positiveInt(value, fallback) {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback
}

function loadEnv() {
  for (const name of ['.env', '.env.local']) {
    const path = join(process.cwd(), name)
    if (!existsSync(path)) continue
    for (const line of readFileSync(path, 'utf8').split(/\r?\n/)) {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/i)
      if (!match) continue
      const [, key, raw] = match
      if (process.env[key] !== undefined) continue
      process.env[key] = raw.replace(/^(['"])(.*)\1$/, '$2')
    }
  }
}

loadEnv()

const clientId = process.env.DOWNDETECTOR_CLIENT_ID ?? ''
const clientSecret = process.env.DOWNDETECTOR_CLIENT_SECRET ?? ''
const configured = Boolean(clientId && clientSecret)

// Criado após loadEnv(): o handler lê as variáveis da Provider Enrichment API.
const enrichment = createEnrichmentHandler(send)

const catalog = JSON.parse(
  readFileSync(join(here, '..', 'src', 'data', 'downdetector-services.json'), 'utf8'),
)

let token = null
let tokenExpiresAt = 0
const companyCache = new Map()
const baselineCache = new Map()
let snapshotCache = { at: 0, payload: null }

function hasCredentials() {
  return configured
}

async function getToken() {
  if (token && Date.now() < tokenExpiresAt - 5 * 60 * 1000) return token

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
  const response = await fetch(`${API_BASE}/tokens?grant_type=client_credentials`, {
    method: 'POST',
    headers: { Authorization: `Basic ${auth}`, Accept: 'application/json' },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  })
  if (!response.ok) {
    throw new Error(`Falha ao autenticar na API do Downdetector (HTTP ${response.status})`)
  }

  const payload = await response.json()
  if (typeof payload?.access_token !== 'string' || !payload.access_token) {
    throw new Error('A API do Downdetector não retornou um access_token')
  }

  token = payload.access_token
  tokenExpiresAt = Date.now() + 60 * 60 * 1000
  return token
}

async function apiFetch(path, retry = true) {
  const bearer = await getToken()
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { Authorization: `Bearer ${bearer}`, Accept: 'application/json' },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  })

  if (response.status === 401 && retry) {
    token = null
    tokenExpiresAt = 0
    return apiFetch(path, false)
  }
  if (!response.ok) {
    throw new Error(`Downdetector HTTP ${response.status} em ${path}`)
  }
  return response.json()
}

async function resolveCompany(service) {
  const key = `${service.slug}:${COUNTRY}`
  if (companyCache.has(key)) return companyCache.get(key)

  const search = (country) => {
    const params = new URLSearchParams({
      fields: 'id,name,slug,country_iso,country_id',
      slug: service.slug,
    })
    if (country) params.set('country', country)
    return apiFetch(`/companies/search?${params.toString()}`)
  }

  let results = []
  try {
    results = await search(COUNTRY)
  } catch {
    results = []
  }
  if (!Array.isArray(results) || results.length === 0) {
    results = await search('')
  }
  if (!Array.isArray(results) || results.length === 0) {
    throw new Error(`Empresa não encontrada no Downdetector: ${service.slug}`)
  }

  const found = results.find((item) => item?.country_iso === COUNTRY) ?? results[0]
  const resolved = {
    companyId: Number(found.id),
    countryId: found.country_id ? Number(found.country_id) : null,
  }
  if (!Number.isFinite(resolved.companyId)) {
    throw new Error(`ID de empresa inválido para ${service.slug}`)
  }

  companyCache.set(key, resolved)
  return resolved
}

async function getBaseline(companyId) {
  const cached = baselineCache.get(companyId)
  if (cached && Date.now() < cached.at + BASELINE_TTL_MS) return cached.value

  const value = await apiFetch(`/companies/${companyId}/baseline`)
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error(`Baseline indisponível para a empresa ${companyId}`)
  }

  baselineCache.set(companyId, { at: Date.now(), value })
  return value
}

function mapStatus(value) {
  if (value === 'success') return 'operational'
  if (value === 'warning') return 'degraded'
  if (value === 'danger') return 'outage'
  return undefined
}

function baselineIndex(pointInTime) {
  const date = new Date(pointInTime)
  if (Number.isNaN(date.getTime())) return 0
  return Math.min(95, date.getUTCHours() * 4 + Math.floor(date.getUTCMinutes() / 15))
}

/** Classificação por bucket usando a linha de base oficial da API. */
function classifyBucket(total, expected) {
  if (!Number.isFinite(total) || total <= 0) return 'operational'
  const baseline = Number.isFinite(expected) && expected > 0 ? expected : 1
  const ratio = total / baseline
  if (ratio >= 4) return 'outage'
  if (ratio >= 2) return 'degraded'
  return 'operational'
}

async function loadService(service) {
  const company = await resolveCompany(service)
  const reportsParams = new URLSearchParams({ companies: String(company.companyId) })
  if (company.countryId) reportsParams.set('countries', String(company.countryId))

  const [statusText, reports, baseline] = await Promise.all([
    apiFetch(`/companies/${company.companyId}/status`),
    apiFetch(`/slugs/${encodeURIComponent(service.slug)}/reports?${reportsParams.toString()}`),
    getBaseline(company.companyId),
  ])

  const status = mapStatus(statusText)
  const buckets = Array.isArray(reports) ? reports.slice(-48) : []
  const history = buckets
    .filter((item) => item && typeof item.point_in_time === 'string')
    .map((item) => {
      const total = Number(item.total ?? 0)
      const expected = Number(baseline[baselineIndex(item.point_in_time)] ?? 0)
      return {
        at: item.point_in_time,
        status: classifyBucket(total, expected),
        reports: total,
      }
    })

  const lastBucket = buckets.at(-1)
  return {
    id: service.id,
    status,
    reports: lastBucket && Number.isFinite(Number(lastBucket.total))
      ? Number(lastBucket.total)
      : undefined,
    history: history.length ? history : undefined,
  }
}

async function mapWithConcurrency(items, limit, mapper) {
  const results = new Array(items.length)
  let next = 0
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length) {
      const index = next++
      try {
        results[index] = await mapper(items[index])
      } catch (error) {
        results[index] = { error: error instanceof Error ? error.message : String(error) }
      }
    }
  })
  await Promise.all(workers)
  return results
}

async function buildSnapshot() {
  if (snapshotCache.payload && Date.now() < snapshotCache.at + CACHE_TTL_MS) {
    return snapshotCache.payload
  }

  const results = await mapWithConcurrency(catalog, CONCURRENCY, loadService)
  const services = results.filter((item) => item && item.id && !item.error)
  const errors = results.filter((item) => item?.error).map((item) => item.error)

  const payload = {
    checkedAt: new Date().toISOString(),
    source: 'Downdetector API v2',
    country: COUNTRY,
    services,
    errors,
  }

  snapshotCache = { at: Date.now(), payload }
  return payload
}

function send(res, status, payload) {
  const body = JSON.stringify(payload)
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
    'Access-Control-Allow-Origin': CORS_ORIGIN,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Accept, Content-Type, Authorization, X-API-Key',
    'Cache-Control': 'no-store',
  })
  res.end(body)
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', `http://localhost:${PORT}`)
  const path = url.pathname

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': CORS_ORIGIN,
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers':
        req.headers['access-control-request-headers'] ??
        'Accept, Content-Type, Authorization, X-API-Key',
      'Access-Control-Max-Age': '600',
    })
    res.end()
    return
  }

  // Provider Enrichment API da Ookla (GET/POST /v1/subscriber-service).
  if (await enrichment.handle(req, res, url)) return

  if (path === '/api/health') {
    send(res, 200, {
      configured: hasCredentials(),
      country: COUNTRY,
      services: catalog.length,
      enrichment: enrichment.status(),
    })
    return
  }

  if (path !== '/api/downdetector') {
    send(res, 404, { error: 'Rota não encontrada' })
    return
  }

  if (!hasCredentials()) {
    send(res, 503, {
      error:
        'Credenciais do Downdetector não configuradas. Defina DOWNDETECTOR_CLIENT_ID e DOWNDETECTOR_CLIENT_SECRET no servidor.',
    })
    return
  }

  try {
    send(res, 200, await buildSnapshot())
  } catch (error) {
    send(res, 502, {
      error: error instanceof Error ? error.message : 'Falha ao consultar o Downdetector',
    })
  }
})

server.listen(PORT, () => {
  console.log(`Downdetector proxy em http://localhost:${PORT}/api/downdetector`)
  const enrichmentStatus = enrichment.status()
  console.log(
    `Ookla Enrichment em http://localhost:${PORT}/v1/subscriber-service ` +
      `(autenticação: ${enrichmentStatus.schemes.join(', ') || 'não configurada'})`,
  )
  if (!configured) {
    console.warn(
      'Credenciais ausentes: defina DOWNDETECTOR_CLIENT_ID e DOWNDETECTOR_CLIENT_SECRET (ou no .env).',
    )
  }
})
