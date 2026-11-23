/** Tempos compartilhados pelo turbo dos fios e pela contagem do velocímetro. */
export const SPEED_BURST_RAMP_UP_MS = 650
export const SPEED_BURST_HOLD_MS = 240
export const SPEED_BURST_RAMP_DOWN_MS = 1100
export const SPEED_BURST_PEAK_RATE = 2.6

export const SPEED_BURST_DURATION_MS =
  SPEED_BURST_RAMP_UP_MS + SPEED_BURST_HOLD_MS + SPEED_BURST_RAMP_DOWN_MS

/** Entrada igual nas duas animações: os dois aparecem no mesmo instante. */
export function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3)
}

/** Saída suave, sem tranco ao voltar ao ritmo padrão. */
export function easeInOutSine(t: number) {
  return (1 - Math.cos(Math.PI * t)) / 2
}
