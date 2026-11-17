import { useEffect, useRef, useState } from 'react'
import {
  Activity,
  ArrowDown,
  ArrowRight,
  Clock3,
  Gauge,
  Info,
  RotateCcw,
} from 'lucide-react'
import { siteConfig } from '../data/site'
import { speedTestConfig } from '../data/speedTest'
import { measureDownload, measureLatency } from '../lib/speedTest'
import { Container } from '../components/Container'
import { Reveal } from '../components/Reveal'
import { WhatsAppCta } from '../components/WhatsAppCta'
import { SectionHeading } from '../components/SectionHeading'

type Phase = 'idle' | 'running' | 'done' | 'error'

const radius = 84
const circumference = 2 * Math.PI * radius

const statusLabel: Record<Phase, string> = {
  idle: 'Pronto para testar',
  running: 'Medindo sua conexão...',
  done: 'Teste concluído',
  error: 'Não foi possível medir',
}

function SpeedGauge({ mbps, phase }: { mbps: number; phase: Phase }) {
  const ratio = Math.min(1, Math.max(0, mbps / speedTestConfig.maxMbps))

  return (
    <div className="relative mx-auto h-[210px] w-[210px]" aria-hidden="true">
      <svg viewBox="0 0 210 210" className="h-full w-full -rotate-90">
        <defs>
          <linearGradient id="speed-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1467e8" />
            <stop offset="100%" stopColor="#3fc9ee" />
          </linearGradient>
        </defs>
        <circle cx="105" cy="105" r={radius} fill="none" stroke="#e8eff8" strokeWidth="12" />
        <circle
          cx="105"
          cy="105"
          r={radius}
          fill="none"
          stroke="url(#speed-gradient)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - ratio)}
          className="transition-[stroke-dashoffset] duration-500 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink-500">
          Download
        </span>
        <span className="mt-1 font-display text-[44px] font-bold leading-none tracking-[-0.06em] text-ink-950">
          {mbps.toFixed(1)}
        </span>
        <span className="mt-1 text-xs font-semibold text-blue-brand">Mbps</span>
        {phase === 'idle' && (
          <span className="mt-2 text-[10px] text-ink-500">Escala até 1000 Mbps</span>
        )}
      </div>
    </div>
  )
}

export function SpeedTest() {
  const [phase, setPhase] = useState<Phase>('idle')
  const [mbps, setMbps] = useState(0)
  const [latency, setLatency] = useState<number | null>(null)
  const [bytes, setBytes] = useState(0)
  const [error, setError] = useState('')
  const abortRef = useRef<AbortController | null>(null)
  const startedAtRef = useRef(0)

  useEffect(() => () => abortRef.current?.abort(), [])

  const runTest = async () => {
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller
    startedAtRef.current = performance.now()

    setPhase('running')
    setMbps(0)
    setLatency(null)
    setBytes(0)
    setError('')

    try {
      const [latencyResult, downloadResult] = await Promise.all([
        measureLatency(controller.signal),
        measureDownload(
          ({ bytes: current }) => {
            setBytes(current)
            const seconds = (performance.now() - startedAtRef.current) / 1000
            if (seconds > 0) setMbps((current * 8) / seconds / 1_000_000)
          },
          controller.signal,
        ),
      ])
      setMbps(downloadResult)
      setLatency(latencyResult)
      setPhase('done')
    } catch (caught) {
      if ((caught as Error).name === 'AbortError') return
      setError('Não foi possível medir agora. Verifique sua conexão e tente novamente.')
      setPhase('error')
    }
  }

  const progress = Math.min(1, bytes / speedTestConfig.payloadBytes)
  const transferredMb = (bytes / (1024 * 1024)).toFixed(2)
  const running = phase === 'running'

  return (
    <section id="velocidade" className="bg-white py-24 sm:py-28">
      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-[0.82fr_1.18fr] lg:gap-24">
          <div>
            <SectionHeading
              eyebrow="Teste de velocidade"
              title="Descubra a velocidade da sua conexão."
              description="Meça o download e a latência da sua conexão diretamente no navegador, sem instalar nada e sem enviar seus dados a serviços externos."
            />
            <Reveal delay={120}>
              <div className="mt-8 space-y-4 border-t border-line pt-7 text-sm text-ink-600">
                <p className="flex items-start gap-3">
                  <ArrowDown size={17} className="mt-0.5 shrink-0 text-blue-brand" aria-hidden="true" />
                  Download medido com um arquivo de 2 MB hospedado neste site.
                </p>
                <p className="flex items-start gap-3">
                  <Clock3 size={17} className="mt-0.5 shrink-0 text-blue-brand" aria-hidden="true" />
                  Latência calculada a partir de três medições rápidas.
                </p>
                <p className="flex items-start gap-3">
                  <Info size={17} className="mt-0.5 shrink-0 text-blue-brand" aria-hidden="true" />
                  Upload não está disponível neste MVP: exigiria um servidor de medição.
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal delay={160}>
            <div className="rounded-[24px] border border-ink-900/5 bg-mist p-7 shadow-card sm:p-9">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-ink-950 text-cyan-signal">
                    <Activity size={19} aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-bold tracking-[-0.03em] text-ink-950">
                      Speed test MEGA+
                    </h3>
                    <p className="text-[11px] text-ink-500">Medição local no navegador</p>
                  </div>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${
                    phase === 'done'
                      ? 'bg-blue-brand/10 text-blue-brand'
                      : phase === 'error'
                        ? 'bg-red-50 text-red-600'
                        : 'bg-white text-ink-500'
                  }`}
                >
                  {statusLabel[phase]}
                </span>
              </div>

              <div className="mt-8">
                <SpeedGauge mbps={mbps} phase={phase} />
              </div>

              <div
                role="progressbar"
                aria-label="Progresso do teste"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(progress * 100)}
                className="mt-3 h-1.5 overflow-hidden rounded-full bg-line"
              >
                <div
                  className="h-full rounded-full bg-blue-brand transition-[width] duration-200"
                  style={{ width: `${progress * 100}%` }}
                />
              </div>

              <div className="mt-7 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-line bg-white px-4 py-3.5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink-500">
                    Latência
                  </p>
                  <p className="mt-1 font-display text-xl font-bold tracking-[-0.03em] text-ink-950">
                    {latency === null ? '—' : `${latency} ms`}
                  </p>
                </div>
                <div className="rounded-xl border border-line bg-white px-4 py-3.5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink-500">
                    Transferido
                  </p>
                  <p className="mt-1 font-display text-xl font-bold tracking-[-0.03em] text-ink-950">
                    {transferredMb} MB
                  </p>
                </div>
              </div>

              <div className="mt-6" role="status" aria-live="polite">
                {error && <p className="text-sm text-red-600">{error}</p>}
                {phase === 'done' && (
                  <p className="text-sm leading-relaxed text-ink-600">
                    Resultado: <strong className="text-ink-950">{mbps.toFixed(1)} Mbps</strong> de
                    download com {latency} ms de latência neste servidor.
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={runTest}
                disabled={running}
                aria-busy={running}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-brand px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-blue-bright disabled:cursor-not-allowed disabled:opacity-70"
              >
                {running ? (
                  <>
                    <Gauge size={17} className="animate-spin" aria-hidden="true" />
                    Testando...
                  </>
                ) : phase === 'done' ? (
                  <>
                    <RotateCcw size={17} aria-hidden="true" />
                    Testar novamente
                  </>
                ) : (
                  <>
                    <Gauge size={17} aria-hidden="true" />
                    Iniciar teste
                  </>
                )}
              </button>

              {phase === 'done' && (
                <WhatsAppCta
                  message={`Olá! Acabei de fazer o speed test no site da MEGA+: ${mbps.toFixed(1)} Mbps de download e ${latency} ms de latência. Podem me ajudar a melhorar minha conexão?`}
                  variant="outline-dark"
                  size="sm"
                  className="mt-3 w-full"
                >
                  Enviar resultado para a equipe
                  <ArrowRight size={14} aria-hidden="true" />
                </WhatsAppCta>
              )}

              <p className="mt-5 text-center text-[11px] leading-relaxed text-ink-500">
                {siteConfig.brand.legalName} · medição sem cadastro e sem dados pessoais
              </p>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
