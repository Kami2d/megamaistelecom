import { useMemo, useState, type ReactNode } from 'react'
import { ArrowRight, Briefcase, Home, Minus, Plus, Sparkles } from 'lucide-react'
import { plans } from '../data/plans'
import { formatPrice } from '../lib/format'
import { Container } from '../components/Container'
import { Reveal } from '../components/Reveal'
import { WhatsAppCta } from '../components/WhatsAppCta'

type AudienceId = 'casa' | 'empresa'

const audiences = [
  { id: 'casa' as const, label: 'Casa / residência', short: 'Casa', icon: Home, weight: 0 },
  { id: 'empresa' as const, label: 'Empresa / escritório', short: 'Empresa', icon: Briefcase, weight: 3 },
]

type Use = { label: string; weight: number; audience?: AudienceId }

const uses: Use[] = [
  { label: 'Navegação e redes', weight: 1 },
  { label: 'Trabalho ou aulas online', weight: 3 },
  { label: 'Videochamadas e reuniões', weight: 3 },
  { label: 'Muitos dispositivos', weight: 4 },
  { label: 'Filmes e séries', weight: 2, audience: 'casa' },
  { label: 'Conteúdo em 4K', weight: 4, audience: 'casa' },
  { label: 'Jogos online', weight: 4, audience: 'casa' },
  { label: 'Câmeras e segurança', weight: 3, audience: 'empresa' },
  { label: 'Backup e sistemas na nuvem', weight: 4, audience: 'empresa' },
  { label: 'Pagamentos e sistemas internos', weight: 4, audience: 'empresa' },
]

const spaces: Record<AudienceId, { id: string; label: string; weight: number }[]> = {
  casa: [
    { id: 'compact', label: 'Compacto / poucos ambientes', weight: 0 },
    { id: 'large', label: 'Amplo / vários ambientes', weight: 3 },
  ],
  empresa: [
    { id: 'small', label: 'Pequeno / uma sala', weight: 0 },
    { id: 'large', label: 'Várias salas ou andares', weight: 3 },
  ],
}

const devices = [
  { id: 'few', label: 'Até 5 dispositivos', weight: 0 },
  { id: 'medium', label: '6 a 15 dispositivos', weight: 2 },
  { id: 'many', label: '16 ou mais dispositivos', weight: 4 },
]

const reasons: Record<number, string> = {
  350: 'Uma opção enxuta para navegar, estudar e resolver as tarefas do dia a dia.',
  550: 'Mais velocidade para dividir a conexão entre trabalho, estudos e videochamadas.',
  650: 'Mais desempenho para muitos dispositivos conectados e uma rotina digital intensa.',
  1000: 'A opção de maior desempenho do catálogo, ideal para fluxos pesados e muitos acessos ao mesmo tempo.',
}

function Field({ step, title, children }: { step: number; title: string; children: ReactNode }) {
  return (
    <div className="grid gap-3">
      <p className="flex items-center gap-2.5 text-sm font-medium text-white/80">
        <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-cyan-signal/15 text-[10px] font-bold text-cyan-signal">
          {step}
        </span>
        {title}
      </p>
      {children}
    </div>
  )
}

export function Simulator() {
  const [audience, setAudience] = useState<AudienceId>('casa')
  const [people, setPeople] = useState(3)
  const [selectedUses, setSelectedUses] = useState<string[]>([
    'Filmes e séries',
    'Trabalho ou aulas online',
  ])
  const [space, setSpace] = useState(spaces.casa[0].id)
  const [device, setDevice] = useState(devices[0].id)

  const maxPeople = audience === 'casa' ? 12 : 40
  const currentSpaces = spaces[audience]
  const audienceData = audiences.find((item) => item.id === audience) ?? audiences[0]
  const spaceData = currentSpaces.find((item) => item.id === space) ?? currentSpaces[0]
  const deviceData = devices.find((item) => item.id === device) ?? devices[0]
  const visibleUses = uses.filter((use) => !use.audience || use.audience === audience)

  const suggestion = useMemo(() => {
    const score =
      people +
      selectedUses.reduce((total, label) => {
        const item = uses.find((use) => use.label === label)
        return total + (item?.weight ?? 0)
      }, 0) +
      spaceData.weight +
      deviceData.weight +
      audienceData.weight

    const speed = score <= 9 ? 350 : score <= 16 ? 550 : score <= 23 ? 650 : 1000
    return plans.find((plan) => plan.speedMb === speed) ?? plans[0]
  }, [people, selectedUses, spaceData.weight, deviceData.weight, audienceData.weight])

  const toggleUse = (label: string) => {
    setSelectedUses((current) =>
      current.includes(label)
        ? current.filter((item) => item !== label)
        : [...current, label],
    )
  }

  const changeAudience = (next: AudienceId) => {
    if (next === audience) return
    setAudience(next)
    setSpace(spaces[next][0].id)
    setPeople((value) => Math.min(value, next === 'casa' ? 12 : 40))
    setSelectedUses((current) =>
      current.filter((label) => {
        const item = uses.find((use) => use.label === label)
        return !item?.audience || item.audience === next
      }),
    )
  }

  const summary = [
    audienceData.label,
    `${people} ${people === 1 ? 'pessoa' : 'pessoas'} usando a internet`,
    selectedUses.length ? selectedUses.join(', ') : 'Uso não informado',
    deviceData.label,
    spaceData.label,
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
                  A internet certa para a sua casa ou empresa.
                </h2>
                <p className="mt-5 max-w-md text-[15px] leading-relaxed text-white/70">
                  Conte como você usa a internet — pessoas, dispositivos,
                  atividades e espaço — e receba uma indicação inicial. Seus
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
                  <Field step={1} title="Onde a internet vai ser usada?">
                    <div className="flex flex-wrap gap-2" role="group" aria-label="Tipo de uso">
                      {audiences.map((item) => {
                        const Icon = item.icon
                        return (
                          <button
                            key={item.id}
                            type="button"
                            aria-pressed={audience === item.id}
                            onClick={() => changeAudience(item.id)}
                            className="choice-chip flex items-center gap-2"
                          >
                            <Icon size={15} aria-hidden="true" />
                            {item.label}
                          </button>
                        )
                      })}
                    </div>
                  </Field>

                  <Field
                    step={2}
                    title={
                      audience === 'casa'
                        ? 'Quantas pessoas dividem a conexão em casa?'
                        : 'Quantas pessoas usam a internet na empresa?'
                    }
                  >
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
                          {audience === 'casa' ? 'pessoas' : 'usuários'}
                        </span>
                      </output>
                      <button
                        type="button"
                        onClick={() => setPeople((value) => Math.min(maxPeople, value + 1))}
                        aria-label="Aumentar número de pessoas"
                        className="choice-chip grid h-11 w-11 place-items-center"
                      >
                        <Plus size={17} aria-hidden="true" />
                      </button>
                    </div>
                  </Field>

                  <Field step={3} title="O que vai ser feito na conexão?">
                    <div className="flex flex-wrap gap-2" role="group" aria-label="Atividades na internet">
                      {visibleUses.map((use) => (
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
                  </Field>

                  <Field step={4} title="Quantos dispositivos ficam conectados?">
                    <div className="flex flex-wrap gap-2" role="group" aria-label="Quantidade de dispositivos">
                      {devices.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          aria-pressed={device === item.id}
                          onClick={() => setDevice(item.id)}
                          className="choice-chip"
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </Field>

                  <Field
                    step={5}
                    title={
                      audience === 'casa'
                        ? 'Como é o espaço que será conectado?'
                        : 'Como é o tamanho do escritório?'
                    }
                  >
                    <div className="flex flex-wrap gap-2" role="group" aria-label="Tamanho do imóvel">
                      {currentSpaces.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          aria-pressed={space === item.id}
                          onClick={() => setSpace(item.id)}
                          className="choice-chip"
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </Field>

                  <div
                    role="status"
                    aria-live="polite"
                    className="mt-1 grid gap-5 rounded-[1.35rem] bg-[linear-gradient(120deg,rgba(255,255,255,0.98),#eaf2ff)] p-5 text-ink-950 sm:grid-cols-[1fr_auto] sm:items-center sm:p-6"
                  >
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink-500">
                        Indicação inicial · {audienceData.short}
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
