import { useMemo, useState } from 'react'
import { ArrowRight, Minus, Plus, Sparkles } from 'lucide-react'
import { plans } from '../data/plans'
import { formatPrice } from '../lib/format'
import { Container } from '../components/Container'
import { Reveal } from '../components/Reveal'
import { WhatsAppCta } from '../components/WhatsAppCta'

const uses = [
  { label: 'Redes sociais', weight: 1 },
  { label: 'Vídeos e streaming', weight: 2 },
  { label: 'Home office ou aulas', weight: 3 },
  { label: 'Filmes em 4K', weight: 4 },
  { label: 'Jogos online', weight: 4 },
  { label: 'Muitos aparelhos', weight: 4 },
]

const homes = [
  { id: 'compact', label: 'Compacto, poucos cômodos', weight: 0 },
  { id: 'large', label: 'Vários cômodos ou andares', weight: 3 },
]

const reasons: Record<number, string> = {
  400: 'Uma opção enxuta para navegar, acessar redes sociais e resolver as tarefas do dia a dia.',
  500: 'Mais folga para dividir a conexão entre videochamadas, streaming, estudos e trabalho.',
  600: 'Espaço para vários dispositivos conectados sem disputar velocidade.',
  800: 'Máxima capacidade para uma rotina digital intensa, com muitos aparelhos e downloads.',
}

export function Simulator() {
  const [people, setPeople] = useState(3)
  const [selectedUses, setSelectedUses] = useState<string[]>([
    'Vídeos e streaming',
    'Home office ou aulas',
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

    const speed = score <= 6 ? 400 : score <= 10 ? 500 : score <= 14 ? 600 : 800
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
    `Sugestão: ${suggestion.name} (${suggestion.speedMb} Mbps)`,
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
                <span className="eyebrow-pill w-max">Simulador de plano</span>
                <h2 className="mt-6 font-display text-[2rem] font-extrabold italic leading-[1.02] tracking-[-0.025em] sm:text-[2.75rem] lg:text-[3.25rem]">
                  Ainda não sabe qual escolher?
                </h2>
                <p className="mt-5 max-w-md text-[15px] leading-relaxed text-white/60">
                  Conte como você usa a internet e receba uma orientação inicial.
                  A simulação vai junto na mensagem para a nossa equipe analisar.
                </p>
                <p className="mt-8 flex items-start gap-2 text-xs leading-relaxed text-white/40">
                  <Sparkles size={15} className="mt-0.5 shrink-0 text-cyan-signal" aria-hidden="true" />
                  O resultado é uma sugestão inicial. A indicação final depende da
                  cobertura e das condições confirmadas no atendimento.
                </p>
              </div>

              <div className="glass-panel rounded-[1.75rem] p-6 sm:p-8">
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <p className="text-sm font-medium text-white/80">
                      Quantas pessoas usam a internet no imóvel?
                    </p>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setPeople((value) => Math.max(1, value - 1))}
                        aria-label="Diminuir número de pessoas"
                        className="choice-chip grid h-11 w-11 place-items-center"
                      >
                        <Minus size={17} aria-hidden="true" />
                      </button>
                      <output className="min-w-0 flex-1 text-center font-display text-3xl font-extrabold italic">
                        {people} <span className="font-sans text-xs font-medium not-italic text-white/50">pessoas</span>
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
                      O que vocês mais fazem online?
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
                    <p className="text-sm font-medium text-white/80">Como é o imóvel?</p>
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
                        Sugestão inicial
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
                    <WhatsAppCta message={`Olá! Fiz a simulação no site da MEGA+: ${summary}. Podem confirmar a cobertura e as condições para o meu endereço?`}>
                      Enviar simulação
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
