import { useEffect, useRef, type CSSProperties, type RefObject } from 'react'

type StepsTimelineProps = {
  /** Seção usada como referência para o progresso de rolagem. */
  sectionRef: RefObject<HTMLElement | null>
}

/**
 * Linha de progresso dos passos, inspirada no widget "mp-line".
 * O preenchimento acompanha a rolagem da seção e acende um nó por etapa.
 */
export function StepsTimeline({ sectionRef }: StepsTimelineProps) {
  const lineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const line = lineRef.current
    const section = sectionRef.current
    if (!line || !section) return

    const container = line.parentElement
    const nodes = Array.from(line.querySelectorAll<HTMLElement>('.nd'))
    const cards = Array.from(section.querySelectorAll<HTMLElement>('[data-step-card]'))
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let frame = 0

    const layout = () => {
      const isVertical = window.innerWidth <= 1023

      if (!isVertical || !container) {
        nodes.forEach((node) => {
          node.style.top = ''
        })
        line.style.setProperty('--lh', '80%')
        return
      }

      const containerTop = container.getBoundingClientRect().top
      nodes.forEach((node, index) => {
        const card = cards[index]
        if (card) {
          const top = Math.round(card.getBoundingClientRect().top - containerTop + 26)
          node.style.top = `${top}px`
        }
      })

      const lastCard = cards[cards.length - 1]
      if (lastCard) {
        const top = Math.round(lastCard.getBoundingClientRect().top - containerTop + 26)
        line.style.setProperty('--lh', `${top}px`)
      }
    }

    const update = () => {
      frame = 0
      // Usa o bloco dos cards como referência: a barra começa a encher quando
      // ele entra por baixo e chega ao fim enquanto ainda está bem visível.
      const rect = (container ?? section).getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const start = viewportHeight * 0.85
      const end = viewportHeight * 0.3
      const progress = Math.min(1, Math.max(0, (start - rect.top) / (start - end)))

      line.style.setProperty('--p', progress.toFixed(3))
      nodes.forEach((node, index) => {
        const threshold = index / Math.max(1, nodes.length - 1) - 0.04
        node.classList.toggle('on', progress >= threshold)
      })
    }

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }

    const onResize = () => {
      layout()
      schedule()
    }

    const observer =
      typeof ResizeObserver === 'undefined' || !container
        ? null
        : new ResizeObserver(onResize)
    if (observer && container) observer.observe(container)

    if (reducedMotion) {
      line.style.setProperty('--p', '1')
      nodes.forEach((node) => node.classList.add('on'))
      layout()
      window.addEventListener('resize', layout)
      window.addEventListener('load', layout)
      return () => {
        observer?.disconnect()
        window.removeEventListener('resize', layout)
        window.removeEventListener('load', layout)
      }
    }

    layout()
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', onResize)
    window.addEventListener('load', onResize)

    return () => {
      observer?.disconnect()
      if (frame) window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('load', onResize)
    }
  }, [sectionRef])

  const style = {
    '--p': 0,
    '--lh': '80%',
  } as CSSProperties

  return (
    <div ref={lineRef} className="mp-line mp-line--steps" style={style} aria-hidden="true">
      <div className="tr">
        <div className="fl" />
      </div>
      <i className="nd" />
      <i className="nd" />
      <i className="nd" />
    </div>
  )
}
