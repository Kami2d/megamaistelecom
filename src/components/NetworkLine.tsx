import type { CSSProperties } from 'react'

type NetworkLineProps = {
  /** Fração preenchida da linha (0 a 1). */
  progress?: number
}

/** Linha de sinal compacta usada no status da rede. */
export function NetworkLine({ progress = 0.776 }: NetworkLineProps) {
  const style = {
    '--p': Math.min(1, Math.max(0, progress)),
  } as CSSProperties

  return (
    <div className="mp-line mp-line--compact" style={style} aria-hidden="true">
      <div className="tr">
        <div className="fl" />
      </div>
      <i className="nd on" />
      <i className="nd on" />
      <i className="nd" />
    </div>
  )
}
