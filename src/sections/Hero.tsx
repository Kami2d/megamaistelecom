import { useEffect, useRef } from 'react'
import { ArrowRight, MapPin, ShieldCheck, Zap } from 'lucide-react'
import { siteConfig } from '../data/site'
import { CtaLink } from '../components/CtaLink'
import { Container } from '../components/Container'
import { FiberOpticBackground } from '../components/FiberOpticBackground'
import { Reveal } from '../components/Reveal'
import { SpeedRing } from '../components/SpeedRing'

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const glow = glowRef.current
    if (!section || !glow) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let frame = 0
    let x = 0
    let y = 0

    const apply = () => {
      frame = 0
      section.style.setProperty('--cursor-x', `${x}px`)
      section.style.setProperty('--cursor-y', `${y}px`)
    }

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return
      const rect = section.getBoundingClientRect()
      x = event.clientX - rect.left
      y = event.clientY - rect.top
      glow.classList.add('is-active')
      if (!frame) frame = window.requestAnimationFrame(apply)
    }

    const onPointerLeave = () => glow.classList.remove('is-active')

    section.addEventListener('pointermove', onPointerMove)
    section.addEventListener('pointerleave', onPointerLeave)
    return () => {
      section.removeEventListener('pointermove', onPointerMove)
      section.removeEventListener('pointerleave', onPointerLeave)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="inicio"
      tabIndex={-1}
      className="relative isolate overflow-hidden bg-ink-950 pb-16 pt-[140px] text-white sm:pb-20 lg:pb-24 lg:pt-[170px]"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 80% at 75% 0%, #0d2a78 0%, rgba(10,28,78,0) 55%), linear-gradient(180deg, #05102c 0%, #020716 100%)',
        }}
        aria-hidden="true"
      />
      <div ref={glowRef} className="hero-cursor-glow pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="grid-technical pointer-events-none absolute inset-0 opacity-70" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -right-64 -top-64 h-[900px] w-[900px] rounded-full bg-[radial-gradient(circle,rgba(61,139,255,0.5),rgba(30,107,255,0.14)_40%,transparent_68%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -left-80 bottom-0 h-[700px] w-[700px] rounded-full bg-[radial-gradient(circle,rgba(30,107,255,0.3),transparent_65%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute right-[10%] top-[30%] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(255,106,26,0.22),transparent_70%)]"
        aria-hidden="true"
      />

      <FiberOpticBackground />

      <span className="signal-plus" style={{ fontSize: '17rem', left: '-3rem', top: '20%', transform: 'rotate(-12deg)' }} aria-hidden="true">+</span>
      <span className="signal-plus" style={{ fontSize: '10rem', right: '6%', bottom: '6%', transform: 'rotate(9deg)' }} aria-hidden="true">+</span>
      <div className="signal-ribbon pointer-events-none absolute -left-1/3 top-[42%] h-[2px] w-[170%] -rotate-6 opacity-30" aria-hidden="true" />

      <Container className="relative z-10">
        <div className="grid items-center gap-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          <Reveal>
            <span className="eyebrow-pill">
              Fibra óptica em {siteConfig.locations.slice(0, 2).join(' e ')} e região
            </span>

            <h1 className="mt-8 max-w-[720px] font-display text-[clamp(2.9rem,6.1vw,5.9rem)] font-extrabold italic leading-[0.95] tracking-[-0.03em]">
              <span className="bg-[linear-gradient(165deg,#fff_30%,#d6e9ff_55%,#7fd3ff_100%)] bg-clip-text text-transparent">
                Conexão rápida.
              </span>
              <span className="mt-1 block text-cyan-signal">
                Atendimento de verdade.
              </span>
            </h1>

            <p className="mt-7 max-w-[560px] text-base leading-relaxed text-white/70 sm:text-lg">
              Fibra de 350 a 650 Mbps para trabalhar, estudar, curtir seus
              conteúdos e manter seu negócio sempre online. Confira a cobertura
              no seu endereço.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <CtaLink href="#planos">
                Encontrar meu plano
                <ArrowRight size={17} aria-hidden="true" />
              </CtaLink>
              <CtaLink href="#cobertura" variant="outline-light">
                Verificar cobertura
                <MapPin size={17} aria-hidden="true" />
              </CtaLink>
            </div>

            <ul className="mt-11 flex flex-wrap items-center gap-x-7 gap-y-3 border-t border-white/10 pt-7">
              {[
                { icon: Zap, label: '350 a 650 Mbps' },
                { icon: ShieldCheck, label: 'Atendimento técnico 24h' },
                { icon: MapPin, label: 'Presença no Maranhão' },
              ].map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-2 text-[13px] text-white/70">
                  <Icon size={15} className="text-cyan-signal" aria-hidden="true" />
                  {label}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={160}>
            <SpeedRing />
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
