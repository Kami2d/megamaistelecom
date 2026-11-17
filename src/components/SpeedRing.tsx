import { useMemo, type KeyboardEvent } from 'react'
import { Clock3, Headset, MapPin } from 'lucide-react'
import { usePlanSelection } from '../context/PlanSelectionContext'
import { plans } from '../data/plans'

const center = 300
const radius = 205
const circumference = 2 * Math.PI * radius
const startAngle = 135
const sweepDegrees = 270
const arcLength = circumference * (sweepDegrees / 360)
const speeds = plans.map((plan) => plan.speedMb)

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
  const headAngle = ((startAngle + ratio * sweepDegrees) * Math.PI) / 180
  const head = {
    x: center + radius * Math.cos(headAngle),
    y: center + radius * Math.sin(headAngle),
  }
  const estimate = useMemo(() => downloadEstimate(speed), [speed])

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
            <linearGradient id="ring-gradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#1e6bff" />
              <stop offset="55%" stopColor="#3d8bff" />
              <stop offset="100%" stopColor="#62cbff" />
            </linearGradient>
            <linearGradient id="ring-gradient-warm" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ff5a10" />
              <stop offset="100%" stopColor="#ffa13d" />
            </linearGradient>
            <radialGradient id="ring-core">
              <stop offset="0%" stopColor="#123a78" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#05102c" stopOpacity="0" />
            </radialGradient>
          </defs>

          <circle cx={center} cy={center} r="262" fill="url(#ring-core)" />

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
              stroke={speed === speeds[speeds.length - 1] ? 'url(#ring-gradient-warm)' : 'url(#ring-gradient)'}
              strokeWidth="40"
              strokeLinecap="round"
              opacity="0.16"
              strokeDasharray={`${arcLength} ${circumference}`}
              strokeDashoffset={arcLength * (1 - ratio)}
              className="transition-all duration-700 ease-out"
            />
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={speed === speeds[speeds.length - 1] ? 'url(#ring-gradient-warm)' : 'url(#ring-gradient)'}
              strokeWidth="16"
              strokeLinecap="round"
              strokeDasharray={`${arcLength} ${circumference}`}
              strokeDashoffset={arcLength * (1 - ratio)}
              className="transition-all duration-700 ease-out"
            />
          </g>

          <circle cx={head.x} cy={head.y} r="22" fill="#fff" opacity="0.16" />
          <circle cx={head.x} cy={head.y} r="9" fill="#fff" className="transition-all duration-700 ease-out" />
        </svg>

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/45">
            Fibra óptica de até
          </p>
          <p className="mt-2 font-display text-[clamp(4.5rem,11vw,8rem)] font-extrabold italic leading-[0.85] tracking-[-0.05em] text-white [text-shadow:0_0_45px_rgba(98,203,255,0.45)]">
            {speed}
          </p>
          <p className="mt-2 font-display text-lg font-bold italic text-cyan-signal">Mbps</p>
        </div>
      </div>

      <div
        role="radiogroup"
        aria-label="Velocidade para simulação"
        className="glass-panel-strong relative z-10 -mt-12 flex w-full flex-wrap justify-center gap-1 rounded-full p-1.5 sm:-mt-14"
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
            className={`rounded-full px-3 py-2.5 font-display text-sm font-bold italic transition-colors sm:px-5 sm:text-base ${
              speed === option ? 'bg-[linear-gradient(100deg,#1e6bff,#3f8cff)] text-white' : 'text-white/60 hover:text-white'
            }`}
          >
            {option} <span className="font-sans text-[10px] not-italic opacity-75">Mbps</span>
          </button>
        ))}
      </div>

      <p className="mx-auto mt-5 max-w-sm text-center text-[13px] leading-relaxed text-white/50">
        Um filme em 4K de 20 GB baixa em cerca de <strong className="font-semibold text-white">{estimate}</strong> na velocidade máxima do plano.
      </p>

      <div className="mt-7 grid gap-2.5 sm:grid-cols-3">
        {[
          { icon: Clock3, title: 'Instalação ágil', tone: 'warm' },
          { icon: Headset, title: 'Suporte técnico 24h', tone: 'blue' },
          { icon: MapPin, title: 'Atendimento regional', tone: 'blue' },
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
