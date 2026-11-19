import { useEffect, useState, type CSSProperties } from 'react'

type Scheme = 'blue' | 'orange' | 'mix'

type FiberLine = {
  id: string
  d: string
  scheme: Scheme
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
  /** Intensidade luminosa extra (ex.: algumas partículas laranjas). */
  intense?: boolean
}

/**
 * Linhas de fibra: ~70% azuis, ~30% laranjas, com alguns gradientes azul↔laranja.
 * Algumas linhas permanecem sem partículas para preservar profundidade visual.
 */
const fiberLines: FiberLine[] = [
  {
    id: 'l1',
    d: 'M -160 88 C 200 30, 430 190, 780 122 S 1230 36, 1600 148',
    scheme: 'blue',
    width: 1.4,
    opacity: 0.26,
    mobile: true,
    flow: true,
    flowDuration: 9.8,
    flowDelay: -1.4,
  },
  {
    id: 'l2',
    d: 'M -140 198 C 250 296, 540 104, 920 194 S 1290 322, 1600 212',
    scheme: 'mix',
    width: 1.8,
    opacity: 0.28,
    mobile: true,
    flow: true,
    flowDuration: 7.6,
    flowDelay: -5.1,
  },
  {
    id: 'l3',
    d: 'M -180 306 C 230 232, 570 402, 930 276 S 1320 186, 1620 334',
    scheme: 'blue',
    width: 1.2,
    opacity: 0.2,
    mobile: true,
  },
  {
    id: 'l4',
    d: 'M -140 414 C 270 520, 600 320, 950 420 S 1320 548, 1600 390',
    scheme: 'blue',
    width: 2,
    opacity: 0.3,
    mobile: true,
    flow: true,
    flowDuration: 11.4,
    flowDelay: -6.8,
  },
  {
    id: 'l5',
    d: 'M -180 524 C 190 436, 520 650, 890 526 S 1280 414, 1620 566',
    scheme: 'orange',
    width: 1.35,
    opacity: 0.24,
    mobile: true,
    flow: true,
    flowDuration: 10.2,
    flowDelay: -3.2,
  },
  {
    id: 'l6',
    d: 'M -140 628 C 270 712, 600 526, 970 638 S 1320 766, 1600 658',
    scheme: 'blue',
    width: 1.7,
    opacity: 0.28,
    mobile: true,
    flow: true,
    flowDuration: 8.4,
    flowDelay: -2.6,
  },
  {
    id: 'l7',
    d: 'M -200 736 C 230 626, 570 842, 950 726 S 1340 614, 1620 796',
    scheme: 'blue',
    width: 1.1,
    opacity: 0.18,
  },
  {
    id: 'l8',
    d: 'M -120 842 C 290 768, 630 906, 990 796 S 1350 706, 1600 866',
    scheme: 'orange',
    width: 1.55,
    opacity: 0.26,
    flow: true,
    flowDuration: 9.1,
    flowDelay: -7.5,
  },
  {
    id: 'l9',
    d: 'M -180 36 C 270 146, 630 -24, 990 94 S 1320 216, 1600 74',
    scheme: 'blue',
    width: 1,
    opacity: 0.15,
  },
  {
    id: 'l10',
    d: 'M -140 886 C 230 776, 610 654, 970 826 S 1320 936, 1620 726',
    scheme: 'mix',
    width: 1.45,
    opacity: 0.22,
    flow: true,
    flowDuration: 12.6,
    flowDelay: -4.2,
  },
  {
    id: 'l11',
    d: 'M -200 266 C 210 442, 630 124, 1010 328 S 1340 506, 1620 286',
    scheme: 'blue',
    width: 1.2,
    opacity: 0.16,
  },
]

/** Partículas com velocidades e inícios dessincronizados; nem toda linha possui partícula. */
const fiberParticles: FiberParticle[] = [
  { id: 'p1', lineId: 'l1', duration: 9.6, begin: -1.1, size: 1.8, trail: 40, mobile: true },
  { id: 'p2', lineId: 'l1', duration: 14.2, begin: -9.4, size: 1.2, trail: 26, fade: 'late' },
  { id: 'p3', lineId: 'l2', duration: 7.9, begin: -5.6, size: 2.4, trail: 60, mobile: true, intense: true },
  { id: 'p4', lineId: 'l2', duration: 12.8, begin: -2.3, size: 1.3, trail: 30, fade: 'late' },
  { id: 'p5', lineId: 'l4', duration: 8.7, begin: -3.9, size: 2.7, trail: 66, mobile: true },
  { id: 'p6', lineId: 'l4', duration: 15.1, begin: -11.7, size: 1.1, trail: 22, fade: 'late' },
  { id: 'p7', lineId: 'l5', duration: 10.6, begin: -7.2, size: 2.1, trail: 52, mobile: true, intense: true },
  { id: 'p8', lineId: 'l5', duration: 16.4, begin: -13.5, size: 1.2, trail: 26, fade: 'late' },
  { id: 'p9', lineId: 'l6', duration: 9.2, begin: -6.4, size: 2.2, trail: 50, mobile: true },
  { id: 'p10', lineId: 'l8', duration: 8.3, begin: -4.8, size: 2.6, trail: 62, intense: true },
  { id: 'p11', lineId: 'l8', duration: 13.9, begin: -10.9, size: 1.3, trail: 28, fade: 'late' },
  { id: 'p12', lineId: 'l10', duration: 11.8, begin: -8.1, size: 1.9, trail: 44 },
  { id: 'p13', lineId: 'l11', duration: 10.3, begin: -3.4, size: 1.4, trail: 32 },
]

const schemeDefs: Record<
  Scheme,
  {
    base: Array<[string, string, string?]>
    flow: Array<[string, string, string?]>
    trail: Array<[string, string, string?]>
    particle: string
    core: string
  }
> = {
  blue: {
    base: [
      ['0%', '#07152E', '0'],
      ['22%', '#2678FF', '0.95'],
      ['62%', '#50C8FF', '1'],
      ['100%', '#07152E', '0'],
    ],
    flow: [
      ['0%', '#2678FF', '0'],
      ['45%', '#50C8FF', '0.85'],
      ['100%', '#A5E8FF', '0'],
    ],
    trail: [
      ['0%', '#2678FF', '0'],
      ['55%', '#50C8FF', '0.7'],
      ['100%', '#A5E8FF', '1'],
    ],
    particle: '#50C8FF',
    core: '#ffffff',
  },
  orange: {
    base: [
      ['0%', '#3a1600', '0'],
      ['22%', '#FF6900', '0.95'],
      ['62%', '#FF851B', '1'],
      ['100%', '#3a1600', '0'],
    ],
    flow: [
      ['0%', '#FF6900', '0'],
      ['45%', '#FF851B', '0.9'],
      ['100%', '#FFB15C', '0'],
    ],
    trail: [
      ['0%', '#FF6900', '0'],
      ['55%', '#FF851B', '0.75'],
      ['100%', '#FFB15C', '1'],
    ],
    particle: '#FF851B',
    core: '#fff4e8',
  },
  mix: {
    base: [
      ['0%', '#07152E', '0'],
      ['28%', '#2678FF', '0.95'],
      ['58%', '#FF851B', '0.95'],
      ['100%', '#3a1600', '0'],
    ],
    flow: [
      ['0%', '#2678FF', '0'],
      ['45%', '#50C8FF', '0.8'],
      ['72%', '#FF851B', '0.85'],
      ['100%', '#FFB15C', '0'],
    ],
    trail: [
      ['0%', '#2678FF', '0'],
      ['45%', '#50C8FF', '0.6'],
      ['75%', '#FF851B', '0.85'],
      ['100%', '#FFB15C', '1'],
    ],
    particle: '#FFB15C',
    core: '#ffffff',
  },
}

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
 * Fundo de fibra óptica do Hero: curvas em azul e laranja com rastros luminosos
 * que percorrem os caminhos SVG de forma independente. Some em
 * prefers-reduced-motion, preservando apenas as linhas estáticas.
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
  const lineById = new Map(fiberLines.map((line) => [line.id, line]))

  return (
    <svg
      className="pointer-events-none absolute inset-0 z-[1] h-full w-full"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        {fiberLines.map((line) => {
          const scheme = schemeDefs[line.scheme]
          return (
            <g key={line.id}>
              <linearGradient id={`fiber-base-${line.id}`} x1="0" y1="0" x2="1" y2="0">
                {scheme.base.map(([offset, color, opacity]) => (
                  <stop key={`${offset}-${color}`} offset={offset} stopColor={color} stopOpacity={opacity ?? '1'} />
                ))}
              </linearGradient>
              <linearGradient id={`fiber-flow-${line.id}`} x1="0" y1="0" x2="1" y2="0">
                {scheme.flow.map(([offset, color, opacity]) => (
                  <stop key={`${offset}-${color}`} offset={offset} stopColor={color} stopOpacity={opacity ?? '1'} />
                ))}
              </linearGradient>
              <linearGradient
                id={`fiber-trail-${line.id}`}
                x1="-70"
                y1="0"
                x2="0"
                y2="0"
                gradientUnits="userSpaceOnUse"
              >
                {scheme.trail.map(([offset, color, opacity]) => (
                  <stop key={`${offset}-${color}`} offset={offset} stopColor={color} stopOpacity={opacity ?? '1'} />
                ))}
              </linearGradient>
            </g>
          )
        })}

        <filter
          id="fiber-particle-glow"
          x="-250%"
          y="-600%"
          width="600%"
          height="1300%"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur stdDeviation="2.6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter
          id="fiber-particle-glow-intense"
          x="-300%"
          y="-700%"
          width="700%"
          height="1500%"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur stdDeviation="3.6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
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
              stroke={`url(#fiber-base-${line.id})`}
              strokeWidth={line.width * 7}
              opacity={line.opacity * 0.22}
            />
            <path
              id={`fiber-path-${line.id}`}
              className="fiber-line"
              d={line.d}
              stroke={`url(#fiber-base-${line.id})`}
              strokeWidth={line.width}
              opacity={line.opacity}
            />
            {showMotion && line.flow && (
              <path
                className="fiber-flow"
                d={line.d}
                stroke={`url(#fiber-flow-${line.id})`}
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
        const line = lineById.get(particle.lineId)
        if (!line) return null
        const scheme = schemeDefs[line.scheme]
        const motionDuration = `${particle.duration}s`
        const motionBegin = `${particle.begin}s`
        const fadeValues = particle.fade === 'late' ? '0;0;1;0' : '0;1;1;0'
        const trailWidth = Math.max(1, particle.size * (particle.intense ? 1.05 : 0.9))

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
            <g filter={particle.intense ? 'url(#fiber-particle-glow-intense)' : 'url(#fiber-particle-glow)'}>
              <path
                d={`M ${-particle.trail} 0 L 0 0`}
                fill="none"
                stroke={`url(#fiber-trail-${line.id})`}
                strokeWidth={trailWidth}
                strokeLinecap="round"
              />
              <circle r={particle.size * (particle.intense ? 1.08 : 1)} fill={scheme.particle} opacity="0.92" />
              <circle r={Math.max(0.7, particle.size * 0.45)} fill={scheme.core} />
            </g>
          </g>
        )
      })}
    </svg>
  )
}
