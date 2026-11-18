import { useEffect, useState, type CSSProperties } from 'react'

type FiberTone = 'deep' | 'mid' | 'cyan'

type FiberLine = {
  id: string
  d: string
  tone: FiberTone
  width: number
  opacity: number
  /** Mantida em telas pequenas quando a quantidade de linhas é reduzida. */
  mobile?: boolean
  /** Recebe um rastro luminoso animado via stroke-dashoffset. */
  flow?: boolean
  flowDuration?: number
  flowDelay?: number
}

type FiberParticle = {
  id: string
  lineId: string
  duration: number
  /** Offset negativo distribui as partículas fora de sincronia. */
  begin: number
  size: number
  trail: number
  mobile?: boolean
  fade?: 'soft' | 'late'
}

const fiberLines: FiberLine[] = [
  {
    id: 'l1',
    d: 'M -160 88 C 200 30, 430 190, 780 122 S 1230 36, 1600 148',
    tone: 'deep',
    width: 1.4,
    opacity: 0.26,
    mobile: true,
    flow: true,
    flowDuration: 9,
    flowDelay: -1.4,
  },
  {
    id: 'l2',
    d: 'M -140 198 C 250 296, 540 104, 920 194 S 1290 322, 1600 212',
    tone: 'mid',
    width: 1.8,
    opacity: 0.34,
    mobile: true,
    flow: true,
    flowDuration: 7.5,
    flowDelay: -4.8,
  },
  {
    id: 'l3',
    d: 'M -180 306 C 230 232, 570 402, 930 276 S 1320 186, 1620 334',
    tone: 'cyan',
    width: 1.2,
    opacity: 0.22,
    mobile: true,
  },
  {
    id: 'l4',
    d: 'M -140 414 C 270 520, 600 320, 950 420 S 1320 548, 1600 390',
    tone: 'deep',
    width: 2,
    opacity: 0.3,
    mobile: true,
    flow: true,
    flowDuration: 11,
    flowDelay: -6.2,
  },
  {
    id: 'l5',
    d: 'M -180 524 C 190 436, 520 650, 890 526 S 1280 414, 1620 566',
    tone: 'mid',
    width: 1.3,
    opacity: 0.18,
    mobile: true,
  },
  {
    id: 'l6',
    d: 'M -140 628 C 270 712, 600 526, 970 638 S 1320 766, 1600 658',
    tone: 'cyan',
    width: 1.7,
    opacity: 0.3,
    mobile: true,
    flow: true,
    flowDuration: 8.2,
    flowDelay: -2.9,
  },
  {
    id: 'l7',
    d: 'M -200 736 C 230 626, 570 842, 950 726 S 1340 614, 1620 796',
    tone: 'deep',
    width: 1.1,
    opacity: 0.2,
  },
  {
    id: 'l8',
    d: 'M -120 842 C 290 768, 630 906, 990 796 S 1350 706, 1600 866',
    tone: 'mid',
    width: 1.5,
    opacity: 0.24,
    flow: true,
    flowDuration: 9.6,
    flowDelay: -7.4,
  },
  {
    id: 'l9',
    d: 'M -180 36 C 270 146, 630 -24, 990 94 S 1320 216, 1600 74',
    tone: 'cyan',
    width: 1,
    opacity: 0.16,
  },
  {
    id: 'l10',
    d: 'M -140 886 C 230 776, 610 654, 970 826 S 1320 936, 1620 726',
    tone: 'deep',
    width: 1.4,
    opacity: 0.18,
    flow: true,
    flowDuration: 12,
    flowDelay: -3.6,
  },
  {
    id: 'l11',
    d: 'M -200 266 C 210 442, 630 124, 1010 328 S 1340 506, 1620 286',
    tone: 'mid',
    width: 1.2,
    opacity: 0.16,
  },
]

const fiberParticles: FiberParticle[] = [
  { id: 'p1', lineId: 'l1', duration: 9.4, begin: -1.2, size: 1.8, trail: 38, mobile: true },
  { id: 'p2', lineId: 'l1', duration: 13.2, begin: -8.6, size: 1.2, trail: 24 },
  { id: 'p3', lineId: 'l2', duration: 7.8, begin: -5.4, size: 2.5, trail: 58, mobile: true },
  { id: 'p4', lineId: 'l2', duration: 11.6, begin: -2.1, size: 1.4, trail: 30, fade: 'late' },
  { id: 'p5', lineId: 'l3', duration: 10.5, begin: -7.7, size: 1.6, trail: 34, mobile: true },
  { id: 'p6', lineId: 'l4', duration: 8.6, begin: -3.8, size: 2.8, trail: 66, mobile: true },
  { id: 'p7', lineId: 'l4', duration: 14, begin: -11.2, size: 1.1, trail: 22, fade: 'late' },
  { id: 'p8', lineId: 'l5', duration: 12.4, begin: -9.1, size: 1.3, trail: 28, mobile: true },
  { id: 'p9', lineId: 'l6', duration: 9.1, begin: -6.7, size: 2.2, trail: 50, mobile: true },
  { id: 'p10', lineId: 'l6', duration: 15, begin: -2.8, size: 1, trail: 20, fade: 'late' },
  { id: 'p11', lineId: 'l7', duration: 11.2, begin: -4.5, size: 1.7, trail: 40 },
  { id: 'p12', lineId: 'l8', duration: 8.9, begin: -7.9, size: 2.4, trail: 56 },
  { id: 'p13', lineId: 'l8', duration: 13.8, begin: -1.6, size: 1.2, trail: 26, fade: 'late' },
  { id: 'p14', lineId: 'l9', duration: 10.1, begin: -5.9, size: 1.1, trail: 22 },
  { id: 'p15', lineId: 'l10', duration: 12.8, begin: -10.4, size: 1.9, trail: 44 },
  { id: 'p16', lineId: 'l11', duration: 9.8, begin: -3.2, size: 1.5, trail: 36 },
]

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches)

  useEffect(() => {
    const media = window.matchMedia(query)
    const onChange = () => setMatches(media.matches)

    onChange()
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [query])

  return matches
}

/**
 * Fundo de fibra óptica do Hero: curvas discretas e rastros luminosos que
 * percorrem os caminhos SVG continuamente. Não recebe eventos e some em
 * prefers-reduced-motion, deixando apenas as linhas estáticas.
 */
export function FiberOpticBackground() {
  const isMobile = useMediaQuery('(max-width: 767px)')
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

  const visibleLines = isMobile ? fiberLines.filter((line) => line.mobile) : fiberLines
  const visibleLineIds = new Set(visibleLines.map((line) => line.id))
  const showMotion = !prefersReducedMotion
  const visibleParticles = fiberParticles.filter((particle) => {
    if (!showMotion || !visibleLineIds.has(particle.lineId)) return false
    return !isMobile || particle.mobile
  })

  return (
    <svg
      className="pointer-events-none absolute inset-0 z-[1] h-full w-full"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="fiber-gradient-deep" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#0a2158" stopOpacity="0" />
          <stop offset="24%" stopColor="#173e9f" />
          <stop offset="62%" stopColor="#3d82ff" />
          <stop offset="100%" stopColor="#0b245f" stopOpacity="0" />
        </linearGradient>

        <linearGradient id="fiber-gradient-mid" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#0a235e" stopOpacity="0" />
          <stop offset="30%" stopColor="#2b6fe6" />
          <stop offset="68%" stopColor="#62cbff" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#0d327e" stopOpacity="0" />
        </linearGradient>

        <linearGradient id="fiber-gradient-cyan" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#0c2b73" stopOpacity="0" />
          <stop offset="42%" stopColor="#3b8dff" stopOpacity="0.7" />
          <stop offset="72%" stopColor="#62cbff" />
          <stop offset="100%" stopColor="#0b245f" stopOpacity="0" />
        </linearGradient>

        <linearGradient id="fiber-flow-gradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#1e6bff" stopOpacity="0" />
          <stop offset="45%" stopColor="#62cbff" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#dff9ff" stopOpacity="0" />
        </linearGradient>

        <linearGradient
          id="fiber-trail-gradient"
          x1="-70"
          y1="0"
          x2="0"
          y2="0"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#1e6bff" stopOpacity="0" />
          <stop offset="55%" stopColor="#3b8dff" stopOpacity="0.65" />
          <stop offset="100%" stopColor="#dff9ff" stopOpacity="1" />
        </linearGradient>

        <filter
          id="fiber-particle-glow"
          x="-250%"
          y="-600%"
          width="600%"
          height="1300%"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur stdDeviation="2.8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g>
        {visibleLines.map((line) => (
          <g key={line.id}>
            <path
              className="fiber-line-halo"
              d={line.d}
              stroke={`url(#fiber-gradient-${line.tone})`}
              strokeWidth={line.width * 7}
              opacity={line.opacity * 0.22}
            />
            <path
              id={`fiber-path-${line.id}`}
              className="fiber-line"
              d={line.d}
              stroke={`url(#fiber-gradient-${line.tone})`}
              strokeWidth={line.width}
              opacity={line.opacity}
            />
            {showMotion && line.flow && (
              <path
                className="fiber-flow"
                d={line.d}
                stroke="url(#fiber-flow-gradient)"
                strokeWidth={line.width * 1.15}
                style={
                  {
                    '--fiber-duration': `${line.flowDuration ?? 9}s`,
                    '--fiber-delay': `${line.flowDelay ?? 0}s`,
                  } as CSSProperties
                }
              />
            )}
          </g>
        ))}
      </g>

      {visibleParticles.map((particle) => {
        const motionDuration = `${particle.duration}s`
        const motionBegin = `${particle.begin}s`
        const fadeValues =
          particle.fade === 'late' ? '0;0;1;0' : '0;1;1;0'

        return (
          <g key={particle.id}>
            <animateMotion
              dur={motionDuration}
              begin={motionBegin}
              rotate="auto"
              repeatCount="indefinite"
            >
              <mpath href={`#fiber-path-${particle.lineId}`} />
            </animateMotion>
            <animate
              attributeName="opacity"
              values={fadeValues}
              keyTimes="0;0.09;0.84;1"
              dur={motionDuration}
              begin={motionBegin}
              repeatCount="indefinite"
            />
            <g filter="url(#fiber-particle-glow)">
              <path
                d={`M ${-particle.trail} 0 L 0 0`}
                fill="none"
                stroke="url(#fiber-trail-gradient)"
                strokeWidth={Math.max(1, particle.size * 0.9)}
                strokeLinecap="round"
              />
              <circle r={particle.size} fill="#62cbff" opacity="0.9" />
              <circle r={Math.max(0.7, particle.size * 0.45)} fill="#ffffff" />
            </g>
          </g>
        )
      })}
    </svg>
  )
}
