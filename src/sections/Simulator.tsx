import { useMemo, useState } from 'react'
import { ArrowRight, Minus, Plus, Sparkles } from 'lucide-react'
import { plans } from '../data/plans'
import { formatPrice } from '../lib/format'
import { Container } from '../components/Container'
import { Reveal } from '../components/Reveal'
import { WhatsAppCta } from '../components/WhatsAppCta'

const uses = [
  { label: 'Navegação e redes', weight: 1 },
  { label: 'Streaming no dia a dia', weight: 2 },
  { label: 'Trabalho ou aulas online', weight: 3 },
  { label: 'Conteúdo em 4K', weight: 4 },
  { label: 'Jogos online', weight: 4 },
  { label: 'Muitos dispositivos', weight: 4 },
]

const homes = [
  { id: 'compact', label: 'Compacto / poucos ambientes', weight: 0 },
  { id: 'large', label: 'Amplo / vários ambientes', weight: 3 },
]

const reasons: Record<number, string> = {
  350: 'Uma opção enxuta para navegar, estudar e resolver as tarefas do dia a dia.',
  550: 'Mais velocidade para dividir a conexão entre streaming, trabalho, estudos e videochamadas.',
  650: 'Mais desempenho para muitos dispositivos conectados e uma rotina digital intensa.',
}

export function Simulator() {
  const [people, setPeople] = useState(3)
  const [selectedUses, setSelectedUses] = useState<string[]>([
    'Streaming no dia a dia',
    'Trabalho ou aulas online',
  ])
  const [home, setHome] = useState('compact')

  const suggestion = useMemo(() => {
    const score =
      people +
      selectedUses.reduce((total, label) => {
        const item = uses.find((use) => use.label === label)
        return total + (item?.weight ?? 0)
      }, 0) +
      (homes.find((item) => item.id === home)?.weight ?? 0)

    const speed = score <= 7 ? 350 : score <= 12 ? 550 : 650
    return plans.find((plan) => plan.speedMb === speed) ?? plans[0]
  }, [people, selectedUses, home])

  const toggleUse = (label: string) => {
    setSelectedUses((current) =>
      current.includes(label)
        ? current.filter((item) => item !== label)
        : [...current, label],
    )
  }

  const summary = [
    `${people} ${people === 1 ? 'pessoa' : 'pessoas'} na internet`,
    selectedUses.length ? selectedUses.join(', ') : 'Uso não informado',
    homes.find((item) => item.id === home)?.label ?? '',
    `Indicação: ${suggestion.name} (${suggestion.speedMb} Mbps)`,
  ].join(' | ')

  return (
    <section id="simulador" className="bg-mist py-24 sm:py-28">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] bg-[radial-gradient(80%_80%_at_0%_0%,#1d56e0_0%,rgba(29,86,224,0)_55%),radial-gradient(60%_70%_at_100%_100%,rgba(255,106,26,0.25),rgba(255,106,26,0)_60%),linear-gradient(160deg,#0a1a4c,#030a20)] px-6 py-14 text-white shadow-[0_50px_90px_-40px_rgba(8,30,100,0.7)] sm:px-12 sm:py-16">
            <div
              className="pointer-events-none absolute inset-0 opacity-70"
              style={{
                background:
                  'repeating-linear-gradient(90deg, transparent 0 46px, rgba(98,203,255,0.07) 46px 47px)',
                maskImage: 'linear-gradient(180deg, transparent, #000)',
              }}
              aria-hidden="true"
            />

            <div className="relative grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
              <div className="flex flex-col justify-center">
                <span className="eyebrow-pill w-max">Monte seu plano</span>
                <h2 className="mt-6 font-display text-[2rem] font-extrabold italic leading-[1.02] tracking-[-0.025em] sm:text-[2.75rem] lg:text-[3.25rem]">
                  Monte a sugestão que combina com a sua rotina.
                </h2>
                <p className="mt-5 max-w-md text-[15px] leading-relaxed text-white/70">
                  Conte sua rotina online e receba uma indicação inicial. Seus
                  dados seguem na mensagem para a nossa equipe avaliar.
                </p>
                <p className="mt-8 flex items-start gap-2 text-xs leading-relaxed text-white/60">
                  <Sparkles size={15} className="mt-0.5 shrink-0 text-cyan-signal" aria-hidden="true" />
                  O resultado é uma indicação inicial. A escolha final depende da
                  cobertura e das condições confirmadas no atendimento.
                </p>
              </div>

              <div className="glass-panel rounded-[1.75rem] p-6 sm:p-8">
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <p className="text-sm font-medium text-white/80">
                      Quantas pessoas dividem a conexão em casa?
                    </p>
                    <div className="flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => setPeople((value) => Math.max(1, value - 1))}
                        aria-label="Diminuir número de pessoas"
                        className="choice-chip grid h-11 w-11 place-items-center"
                      >
                        <Minus size={17} aria-hidden="true" />
                      </button>
                      <output className="glass-panel inline-flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-full text-center">
                        <span className="font-display text-2xl font-extrabold italic leading-none">
                          {people}
                        </span>
                        <span className="mt-1 font-sans text-[10px] font-medium not-italic text-white/50">
                          pessoas
                        </span>
                      </output>
                      <button
                        type="button"
                        onClick={() => setPeople((value) => Math.min(12, value + 1))}
                        aria-label="Aumentar número de pessoas"
                        className="choice-chip grid h-11 w-11 place-items-center"
                      >
                        <Plus size={17} aria-hidden="true" />
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-3">
                    <p className="text-sm font-medium text-white/80">
                      Quais atividades consomem mais internet por aí?
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {uses.map((use) => (
                        <button
                          key={use.label}
                          type="button"
                          aria-pressed={selectedUses.includes(use.label)}
                          onClick={() => toggleUse(use.label)}
                          className="choice-chip"
                        >
                          {use.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-3">
                    <p className="text-sm font-medium text-white/80">Como é o espaço que será conectado?</p>
                    <div className="flex flex-wrap gap-2" role="group" aria-label="Tamanho do imóvel">
                      {homes.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          aria-pressed={home === item.id}
                          onClick={() => setHome(item.id)}
                          className="choice-chip"
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div
                    role="status"
                    aria-live="polite"
                    className="mt-1 grid gap-5 rounded-[1.35rem] bg-[linear-gradient(120deg,rgba(255,255,255,0.98),#eaf2ff)] p-5 text-ink-950 sm:grid-cols-[1fr_auto] sm:items-center sm:p-6"
                  >
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink-500">
                        Indicação inicial
                      </p>
                      <p className="mt-1 font-display text-3xl font-extrabold italic tracking-[-0.03em]">
                        Fibra {suggestion.speedMb} Mbps
                      </p>
                      <p className="mt-1.5 max-w-md text-[13px] leading-relaxed text-ink-500">
                        {reasons[suggestion.speedMb]} Valor de catálogo a partir de{' '}
                        <strong className="font-semibold text-ink-800">
                          {formatPrice(suggestion.monthlyPrice)}/mês
                        </strong>
                        .
                      </p>
                    </div>
                    <WhatsAppCta message={`Olá! Montei minha indicação no site da MEGA+: ${summary}. Podem confirmar a cobertura e as condições para o meu endereço?`}>
                      Enviar minha indicação
                      <ArrowRight size={16} aria-hidden="true" />
                    </WhatsAppCta>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
