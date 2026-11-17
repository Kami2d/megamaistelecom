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
import { SectionHeading } from '../components/SectionHeading'
import { WhatsAppCta } from '../components/WhatsAppCta'

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
    <div className="relative mx-auto h-[230px] w-[230px]" aria-hidden="true">
      <svg viewBox="0 0 210 210" className="h-full w-full -rotate-90">
        <defs>
          <linearGradient id="speed-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1e6bff" />
            <stop offset="100%" stopColor="#62cbff" />
          </linearGradient>
        </defs>
        <circle cx="105" cy="105" r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="12" />
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
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/45">
          Download
        </span>
        <span className="mt-1 font-display text-[3rem] font-extrabold italic leading-none tracking-[-0.05em] text-white">
          {mbps.toFixed(1)}
        </span>
        <span className="mt-1 text-xs font-semibold text-cyan-signal">Mbps</span>
        {phase === 'idle' && (
          <span className="mt-2 text-[10px] text-white/35">Escala até 1000 Mbps</span>
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
  const downloadStartedAtRef = useRef(0)

  useEffect(() => () => abortRef.current?.abort(), [])

  const runTest = async () => {
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller
    downloadStartedAtRef.current = 0
    let timedOut = false
    const timeout = window.setTimeout(() => {
      timedOut = true
      controller.abort()
    }, 20000)

    setPhase('running')
    setMbps(0)
    setLatency(null)
    setBytes(0)
    setError('')

    try {
      const downloadResult = await measureDownload(
        ({ bytes: current }) => {
          setBytes(current)
          if (downloadStartedAtRef.current === 0) downloadStartedAtRef.current = performance.now()
          const seconds = (performance.now() - downloadStartedAtRef.current) / 1000
          if (seconds > 0) setMbps((current * 8) / seconds / 1_000_000)
        },
        controller.signal,
      )
      const latencyResult = await measureLatency(controller.signal)

      setMbps(downloadResult)
      setLatency(latencyResult)
      setPhase('done')
    } catch (caught) {
      if ((caught as Error).name === 'AbortError' && !timedOut) return
      setMbps(0)
      setError('Não foi possível medir agora. Verifique sua conexão e tente novamente.')
      setPhase('error')
    } finally {
      window.clearTimeout(timeout)
    }
  }

  const progress = Math.min(1, bytes / speedTestConfig.payloadBytes)
  const transferredMb = (bytes / (1024 * 1024)).toFixed(2)
  const running = phase === 'running'

  return (
    <section id="velocidade" className="bg-mist py-24 sm:py-28">
      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20">
          <div>
            <SectionHeading
              eyebrow="Teste de velocidade"
              title="Descubra a velocidade da sua conexão."
              description="Meça o download e a latência diretamente no navegador, sem instalar nada e sem enviar seus dados a serviços externos."
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
            <div className="relative overflow-hidden rounded-[2rem] bg-[radial-gradient(70%_70%_at_50%_-10%,#123a78_0%,rgba(18,58,120,0)_60%),linear-gradient(170deg,#05102c,#020716)] p-7 text-white shadow-[0_45px_90px_-45px_rgba(2,7,22,0.8)] sm:p-9">
              <div className="grid-technical pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />

              <div className="relative">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[linear-gradient(140deg,#1e6bff,#5aa6ff)]">
                      <Activity size={20} aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-display text-base font-bold tracking-[-0.02em]">
                        Speed test MEGA+
                      </h3>
                      <p className="text-[11px] text-white/45">Medição local no navegador</p>
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] ${
                      phase === 'done'
                        ? 'bg-cyan-signal/15 text-cyan-signal'
                        : phase === 'error'
                          ? 'bg-red-500/15 text-red-200'
                          : 'bg-white/10 text-white/60'
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
                  className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10"
                >
                  <div
                    className="h-full rounded-full bg-[linear-gradient(90deg,#1e6bff,#62cbff)] transition-[width] duration-200"
                    style={{ width: `${progress * 100}%` }}
                  />
                </div>

                <div className="mt-7 grid grid-cols-2 gap-3">
                  <div className="glass-panel rounded-2xl px-4 py-3.5">
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/45">
                      Latência
                    </p>
                    <p className="mt-1 font-display text-xl font-bold tracking-[-0.03em] text-white">
                      {latency === null ? '—' : `${latency} ms`}
                    </p>
                  </div>
                  <div className="glass-panel rounded-2xl px-4 py-3.5">
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/45">
                      Transferido
                    </p>
                    <p className="mt-1 font-display text-xl font-bold tracking-[-0.03em] text-white">
                      {transferredMb} MB
                    </p>
                  </div>
                </div>

                <div className="mt-6 min-h-[1.5rem]" role="status" aria-live="polite">
                  {error && <p className="text-sm text-red-200">{error}</p>}
                  {phase === 'done' && (
                    <p className="text-sm leading-relaxed text-white/60">
                      Resultado: <strong className="text-white">{mbps.toFixed(1)} Mbps</strong> de
                      download com {latency} ms de latência neste servidor.
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={runTest}
                  disabled={running}
                  aria-busy={running}
                  className="cta-pill mt-4 w-full bg-[linear-gradient(100deg,#ff5a10,#ff6a1a_45%,#ff8a2a)] text-white disabled:cursor-not-allowed disabled:opacity-70"
                  data-variant="primary"
                  data-size="md"
                >
                  {running ? 'Testando...' : phase === 'done' ? 'Testar novamente' : 'Iniciar teste'}
                  {running ? (
                    <Gauge size={17} className="animate-spin" aria-hidden="true" />
                  ) : phase === 'done' ? (
                    <RotateCcw size={17} aria-hidden="true" />
                  ) : (
                    <Gauge size={17} aria-hidden="true" />
                  )}
                </button>

                {phase === 'done' && (
                  <WhatsAppCta
                    message={`Olá! Acabei de fazer o speed test no site da MEGA+: ${mbps.toFixed(1)} Mbps de download e ${latency} ms de latência. Podem me ajudar a melhorar minha conexão?`}
                    variant="outline-light"
                    size="sm"
                    className="mt-3 w-full"
                  >
                    Enviar resultado para a equipe
                    <ArrowRight size={14} aria-hidden="true" />
                  </WhatsAppCta>
                )}

                <p className="mt-5 text-center text-[11px] leading-relaxed text-white/30">
                  {siteConfig.brand.legalName} · medição sem cadastro e sem dados pessoais
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
