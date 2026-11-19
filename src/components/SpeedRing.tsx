import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { Activity, Clock3, Headset, MapPin, RadioTower } from 'lucide-react'
import { usePlanSelection } from '../context/PlanSelectionContext'
import { plans } from '../data/plans'

const center = 300
const radius = 205
const circumference = 2 * Math.PI * radius
const startAngle = 135
const sweepDegrees = 270
const arcLength = circumference * (sweepDegrees / 360)
// O gradiente é aplicado dentro do <g> rotacionado, então as coordenadas
// precisam estar no espaço local (antes da rotação de `startAngle`).
const gradientStart = { x: center + radius, y: center }
const gradientEnd = {
  x: center + radius * Math.cos((sweepDegrees * Math.PI) / 180),
  y: center + radius * Math.sin((sweepDegrees * Math.PI) / 180),
}
const speeds = plans.map((plan) => plan.speedMb)

type Rgb = { r: number; g: number; b: number }
const blue: Rgb = { r: 30, g: 107, b: 255 }
const orange: Rgb = { r: 255, g: 106, b: 26 }
const amber: Rgb = { r: 255, g: 161, b: 61 }

function mixColor(from: Rgb, to: Rgb, amount: number) {
  const t = Math.min(1, Math.max(0, amount))
  const r = Math.round(from.r + (to.r - from.r) * t)
  const g = Math.round(from.g + (to.g - from.g) * t)
  const b = Math.round(from.b + (to.b - from.b) * t)
  return `rgb(${r} ${g} ${b})`
}

const ticks = Array.from({ length: 55 }, (_, index) => {
  const angle = ((135 + index * 5) * Math.PI) / 180
  const major = index % 9 === 0
  const from = major ? 232 : 237
  const to = 250
  return {
    x1: center + from * Math.cos(angle),
    y1: center + from * Math.sin(angle),
    x2: center + to * Math.cos(angle),
    y2: center + to * Math.sin(angle),
    major,
  }
})

function downloadEstimate(speedMb: number) {
  const seconds = Math.round((20 * 1024 * 8) / speedMb)
  const minutes = Math.floor(seconds / 60)
  const rest = seconds % 60
  return minutes > 0 ? `${minutes} min ${rest} s` : `${rest} s`
}

export function SpeedRing() {
  const { selectedSpeed: speed, setSelectedSpeed: setSpeed } = usePlanSelection()
  const ratio = speed / speeds[speeds.length - 1]
  const speedProgress =
    speeds.length > 1
      ? (speed - speeds[0]) / (speeds[speeds.length - 1] - speeds[0])
      : 0
  const barColor = mixColor(blue, orange, speedProgress)
  const barColorLight = mixColor(orange, amber, speedProgress)
  const estimate = useMemo(() => downloadEstimate(speed), [speed])
  const [displaySpeed, setDisplaySpeed] = useState(speeds[0])
  const [ready, setReady] = useState(false)
  const displayRef = useRef(speeds[0])

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setReady(true))
    return () => window.cancelAnimationFrame(frame)
  }, [])

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      displayRef.current = speed
      setDisplaySpeed(speed)
      return
    }

    const start = performance.now()
    const from = displayRef.current
    const duration = 450
    let frame = 0

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - progress, 3)
      const value = Math.round(from + (speed - from) * eased)
      displayRef.current = value
      setDisplaySpeed(value)
      if (progress < 1) frame = window.requestAnimationFrame(tick)
    }

    frame = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(frame)
  }, [speed])

  const gaugeRatio = ready ? ratio : 0
  const gaugeHeadAngle = ((startAngle + gaugeRatio * sweepDegrees) * Math.PI) / 180
  const gaugeHead = {
    x: center + radius * Math.cos(gaugeHeadAngle),
    y: center + radius * Math.sin(gaugeHeadAngle),
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = index
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % speeds.length
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp')
      next = (index - 1 + speeds.length) % speeds.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = speeds.length - 1
    else return

    event.preventDefault()
    setSpeed(speeds[next])
    event.currentTarget.parentElement
      ?.querySelectorAll<HTMLButtonElement>('[role="radio"]')
      [next]?.focus()
  }

  return (
    <div className="relative mx-auto w-full max-w-[540px]">
      <div className="relative mx-auto aspect-square w-full max-w-[500px]">
        <svg viewBox="0 0 600 600" className="h-full w-full overflow-visible" aria-hidden="true">
          <defs>
            <linearGradient
              id="ring-gradient"
              gradientUnits="userSpaceOnUse"
              x1={gradientStart.x}
              y1={gradientStart.y}
              x2={gradientEnd.x}
              y2={gradientEnd.y}
            >
              <stop offset="0%" stopColor="#1e6bff" />
              <stop offset="55%" stopColor={barColor} />
              <stop offset="100%" stopColor={barColorLight} />
            </linearGradient>
            <radialGradient id="ring-core">
              <stop offset="0%" stopColor={barColor} stopOpacity="0.55" />
              <stop offset="100%" stopColor="#05102c" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="ring-glass" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.24" />
              <stop offset="45%" stopColor="#8fc6ff" stopOpacity="0.06" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.12" />
            </linearGradient>
            <linearGradient id="ring-glass-edge" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.65" />
              <stop offset="50%" stopColor="#62cbff" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#ffa13d" stopOpacity="0.4" />
            </linearGradient>
            <radialGradient id="ring-head-neon">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="30%" stopColor="#62cbff" stopOpacity="0.85" />
              <stop offset="65%" stopColor="#1e6bff" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#1e6bff" stopOpacity="0" />
            </radialGradient>
          </defs>

          <g className="ring-core-pulse">
            <circle cx={center} cy={center} r="280" fill="url(#ring-core)" />
            <circle
              cx={center}
              cy={center}
              r="280"
              fill="url(#ring-glass)"
              stroke="url(#ring-glass-edge)"
              strokeWidth="1.5"
            />
            <circle
              cx={center}
              cy={center}
              r="272"
              fill="none"
              stroke="rgba(255,255,255,0.32)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="150 1600"
              transform={`rotate(200 ${center} ${center})`}
            />
          </g>

          <g className="orbit-slow">
            <circle
              cx={center}
              cy={center}
              r="284"
              fill="none"
              stroke="rgba(98,203,255,0.22)"
              strokeWidth="1.5"
              strokeDasharray="3 14"
            />
          </g>
          <g className="orbit-reverse">
            <circle
              cx={center}
              cy={center}
              r="270"
              fill="none"
              stroke="rgba(255,106,26,0.24)"
              strokeWidth="1"
              strokeDasharray="70 26"
            />
          </g>

          <g>
            {ticks.map((tick, index) => (
              <line
                key={index}
                x1={tick.x1}
                y1={tick.y1}
                x2={tick.x2}
                y2={tick.y2}
                className="ring-tick"
                data-major={tick.major}
              />
            ))}
          </g>

          <g transform={`rotate(${startAngle} ${center} ${center})`}>
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="16"
              strokeDasharray={`${arcLength} ${circumference}`}
            />
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="url(#ring-gradient)"
              strokeWidth="40"
              strokeLinecap="round"
              strokeDasharray={`${arcLength} ${circumference}`}
              strokeDashoffset={arcLength * (1 - gaugeRatio)}
              className="ring-bar-glow transition-[stroke-dashoffset] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
            />
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="url(#ring-gradient)"
              strokeWidth="16"
              strokeLinecap="round"
              strokeDasharray={`${arcLength} ${circumference}`}
              strokeDashoffset={arcLength * (1 - gaugeRatio)}
              className="ring-bar transition-[stroke-dashoffset] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
            />
          </g>

          <circle
            cx={gaugeHead.x}
            cy={gaugeHead.y}
            r="26"
            fill="url(#ring-head-neon)"
            opacity="0.85"
            className="ring-head-glow"
          />
          <circle
            cx={gaugeHead.x}
            cy={gaugeHead.y}
            r="9"
            fill="#fff"
            className="ring-head-core"
          />
        </svg>

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/60">
            Velocidade de até
          </p>
          <p className="mt-2 font-display text-[clamp(4.5rem,11vw,8rem)] font-extrabold italic leading-[0.85] tracking-[-0.05em] text-white [text-shadow:0_0_45px_rgba(98,203,255,0.45)]">
            {displaySpeed}
          </p>
          <p className="mt-2 font-display text-lg font-bold italic text-cyan-signal">Mbps</p>
        </div>
      </div>

      <div className="glass-frost pointer-events-none absolute -left-6 top-[14%] z-20 hidden items-center gap-2 rounded-2xl px-3 py-2 text-[11px] font-semibold text-white sm:flex float-chip">
        <Activity size={15} className="text-cyan-signal" aria-hidden="true" />
        Sinal estável
      </div>
      <div className="glass-frost pointer-events-none absolute -right-8 top-[32%] z-20 hidden items-center gap-2 rounded-2xl px-3 py-2 text-[11px] font-semibold text-white sm:flex float-chip float-chip--warm">
        <RadioTower size={15} className="text-coral-accent" aria-hidden="true" />
        Fibra de ponta a ponta
      </div>
      <div className="glass-frost pointer-events-none absolute bottom-[40%] -left-2 z-20 hidden items-center gap-2 rounded-2xl px-3 py-2 text-[11px] font-semibold text-white sm:flex float-chip float-chip--delayed">
        <MapPin size={15} className="text-cyan-signal" aria-hidden="true" />
        Cobertura local
      </div>

      <div
        role="radiogroup"
        aria-label="Velocidade para simulação"
        className="glass-panel-strong relative z-10 mx-auto -mt-10 flex w-fit max-w-full flex-wrap justify-center gap-0.5 rounded-full p-1 sm:-mt-12"
      >
        {speeds.map((option, index) => (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={speed === option}
            tabIndex={speed === option ? 0 : -1}
            onClick={() => setSpeed(option)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className={`rounded-full px-2.5 py-1.5 font-display text-xs font-bold italic transition-colors sm:px-4 sm:py-2 sm:text-sm ${
              speed === option ? 'bg-[linear-gradient(100deg,#1e6bff,#3f8cff)] text-white' : 'text-white/60 hover:text-white'
            }`}
          >
            {option} <span className="font-sans text-[10px] not-italic opacity-75">Mbps</span>
          </button>
        ))}
      </div>

      <p className="mx-auto mt-5 max-w-sm text-center text-[13px] leading-relaxed text-white/65">
        Um filme em 4K de 20 GB é baixado em cerca de <strong className="font-semibold text-white">{estimate}</strong> no pico do plano.
      </p>

      <div className="mt-7 grid gap-2.5 sm:grid-cols-3">
        {[
          { icon: Clock3, title: 'Instalação ágil', tone: 'warm' },
          { icon: Headset, title: 'Atendimento técnico 24h', tone: 'blue' },
          { icon: MapPin, title: 'Presença regional', tone: 'blue' },
        ].map(({ icon: Icon, title, tone }) => (
          <div
            key={title}
            className="glass-panel flex items-center gap-3 rounded-2xl px-3.5 py-3 text-white/85"
          >
            <span
              className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${
                tone === 'warm'
                  ? 'bg-[linear-gradient(140deg,#ff5a10,#ffa13d)]'
                  : 'bg-[linear-gradient(140deg,#1e6bff,#5aa6ff)]'
              }`}
            >
              <Icon size={17} aria-hidden="true" />
            </span>
            <span className="text-xs font-semibold leading-tight">{title}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
