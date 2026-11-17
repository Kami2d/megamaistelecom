import { speedTestConfig } from '../data/speedTest'

export type ThroughputProgress = {
  bytes: number
  total: number
}

function withCacheBuster(url: string): string {
  const separator = url.includes('?') ? '&' : '?'
  return `${url}${separator}t=${Date.now()}-${Math.random().toString(36).slice(2)}`
}

/** Measures round-trip time against a tiny same-origin asset. */
export async function measureLatency(signal?: AbortSignal): Promise<number> {
  const samples: number[] = []

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const start = performance.now()
    const response = await fetch(withCacheBuster(speedTestConfig.pingUrl), {
      cache: 'no-store',
      signal,
    })
    if (!response.ok) throw new Error('Falha ao medir latência')
    await response.arrayBuffer()
    samples.push(performance.now() - start)
  }

  return Math.round(samples.reduce((sum, value) => sum + value, 0) / samples.length)
}

/**
 * Streams a known-size same-origin file and measures real download throughput.
 * No external service or backend endpoint is involved.
 */
export async function measureDownload(
  onProgress: (progress: ThroughputProgress) => void,
  signal?: AbortSignal,
): Promise<number> {
  const start = performance.now()
  const response = await fetch(withCacheBuster(speedTestConfig.payloadUrl), {
    cache: 'no-store',
    signal,
  })

  if (!response.ok) throw new Error('Falha ao baixar o arquivo de teste')

  const total = Number(response.headers.get('content-length')) || speedTestConfig.payloadBytes
  let bytes = 0

  if (response.body) {
    const reader = response.body.getReader()
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      bytes += value.byteLength
      onProgress({ bytes, total })
    }
  } else {
    const buffer = await response.arrayBuffer()
    bytes = buffer.byteLength
    onProgress({ bytes, total })
  }

  const seconds = (performance.now() - start) / 1000
  if (seconds <= 0) return 0
  return (bytes * 8) / seconds / 1_000_000
}
