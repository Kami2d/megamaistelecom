import { RadioTower, ServerOff } from 'lucide-react'
import { NetworkLine } from './NetworkLine'

const networkAreas = [
  'Situação geral da rede',
  'Manutenções programadas',
  'Interrupções conhecidas',
  'Comunicados técnicos',
  'Previsões de normalização',
]

export function NetworkStatus() {
  return (
    <div className="overflow-hidden rounded-[24px] bg-ink-950 text-white">
      <div className="grid gap-8 p-7 sm:p-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
        <div>
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-white/10 text-cyan-signal">
            <RadioTower size={21} strokeWidth={1.8} aria-hidden="true" />
          </div>
          <h2 className="mt-6 font-display text-2xl font-bold tracking-[-0.04em]">
            Status da Rede Mega Mais
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-white/60">
            Esta área é exclusiva da infraestrutura da Mega Mais Telecom. O
            status de plataformas externas nunca é usado para determinar a
            situação da nossa rede.
          </p>
          <div className="mt-6">
            <NetworkLine progress={0.776} />
          </div>
          <div className="mt-4 flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3.5">
            <ServerOff size={18} className="mt-0.5 shrink-0 text-cyan-signal" aria-hidden="true" />
            <p className="text-sm font-medium text-white/85">
              Informações da rede indisponíveis no momento.
            </p>
          </div>
        </div>

        <ul className="divide-y divide-white/10 border-y border-white/10">
          {networkAreas.map((area) => (
            <li
              key={area}
              className="flex items-center justify-between gap-4 py-4 text-sm"
            >
              <span className="text-white/75">{area}</span>
              <span className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/35">
                Sem dados confirmados
              </span>
            </li>
          ))}
        </ul>
      </div>
      <p className="border-t border-white/10 px-7 py-4 text-[11px] text-white/35 sm:px-10">
        Área reservada para futura integração com sistemas internos da empresa.
      </p>
    </div>
  )
}
