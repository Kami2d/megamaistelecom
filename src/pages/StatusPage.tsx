import { useEffect, useMemo, useState } from 'react'
import { RefreshCw, Search } from 'lucide-react'
import { categories, type ServiceCategory } from '../data/status'
import { statusProvider, type StatusSnapshot } from '../services/status'
import { Container } from '../components/Container'
import { IncidentHistory } from '../components/IncidentHistory'
import { InternetDiagnostics } from '../components/InternetDiagnostics'
import { NetworkStatus } from '../components/NetworkStatus'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { ServiceCard } from '../components/ServiceCard'
import { StatusSummary } from '../components/StatusSummary'

export function StatusPage() {
  const [snapshot, setSnapshot] = useState<StatusSnapshot | null>(null)
  const [category, setCategory] = useState<'all' | ServiceCategory>('all')
  const [query, setQuery] = useState('')

  const refresh = async () => {
    setSnapshot(await statusProvider.load())
  }

  useEffect(() => {
    void refresh()
  }, [])

  const visibleServices = useMemo(() => {
    if (!snapshot) return []
    const term = query.trim().toLocaleLowerCase('pt-BR')
    return snapshot.services.filter((service) => {
      const matchesCategory = category === 'all' || service.category === category
      const matchesQuery = !term || service.name.toLocaleLowerCase('pt-BR').includes(term)
      return matchesCategory && matchesQuery
    })
  }, [snapshot, category, query])

  const groups = categories
    .map((item) => ({
      ...item,
      services: visibleServices.filter((service) => service.category === item.id),
    }))
    .filter((group) => group.services.length > 0)

  const checkedAt = snapshot
    ? snapshot.checkedAt.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '—'

  return (
    <>
      <section className="relative overflow-hidden bg-ink-950 py-16 text-white sm:py-20">
        <div className="grid-technical pointer-events-none absolute inset-0 opacity-70" />
        <div className="pointer-events-none absolute -right-32 -top-24 h-80 w-80 rounded-full bg-blue-brand/20 blur-[100px]" />
        <Container className="relative">
          <Reveal>
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-cyan-signal">
              Transparência e atendimento
            </p>
            <h1 className="mt-5 font-display text-4xl font-bold tracking-[-0.055em] sm:text-5xl lg:text-6xl">
              Central de Status
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/65">
              Consulte a disponibilidade dos principais serviços e plataformas
              da internet em tempo real.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-cyan-signal/35 bg-cyan-signal/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-cyan-signal">
                Modo demonstração
              </span>
              <span className="text-xs text-white/60">
                Última consulta local: {checkedAt}
              </span>
              <button
                type="button"
                onClick={() => void refresh()}
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:border-cyan-signal/60 hover:bg-white/10"
              >
                <RefreshCw size={14} aria-hidden="true" />
                Atualizar consulta
              </button>
            </div>
            <p className="mt-4 max-w-2xl text-[11px] leading-relaxed text-white/40">
              Os estados exibidos são fictícios, usados apenas para demonstrar a
              interface. Nenhuma verificação externa foi realizada.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <Container>
          {snapshot ? (
            <StatusSummary services={snapshot.services} />
          ) : (
            <div className="rounded-[24px] border border-line bg-white p-8 text-sm text-ink-500" role="status">
              Preparando painel...
            </div>
          )}
        </Container>
      </section>

      <section id="servicos" className="scroll-mt-24 bg-mist py-20 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Serviços populares"
            title="Acompanhe as plataformas que você mais usa."
            description="Filtre por categoria ou pesquise pelo nome. Para cada serviço com fonte oficial confirmada, há um link direto para a página de status da plataforma."
          />

          <Reveal delay={80}>
            <div className="mt-9 flex flex-col gap-4">
              <div className="relative">
                <label htmlFor="status-search" className="sr-only">
                  Pesquisar serviço
                </label>
                <Search
                  size={17}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-500"
                  aria-hidden="true"
                />
                <input
                  id="status-search"
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Pesquisar serviço (ex.: Netflix)"
                  className="w-full rounded-xl border border-line bg-white py-3.5 pl-11 pr-4 text-sm text-ink-950 outline-none transition-colors placeholder:text-ink-500/60 focus:border-blue-brand focus:ring-2 focus:ring-blue-brand/15"
                />
              </div>
              <div className="flex flex-wrap gap-2" aria-label="Filtrar por categoria">
                <button
                  type="button"
                  onClick={() => setCategory('all')}
                  aria-pressed={category === 'all'}
                  className={`rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
                    category === 'all'
                      ? 'bg-ink-950 text-white'
                      : 'border border-line bg-white text-ink-600 hover:border-blue-brand/40 hover:text-blue-brand'
                  }`}
                >
                  Todos
                </button>
                {categories.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setCategory(item.id)}
                    aria-pressed={category === item.id}
                    className={`rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
                      category === item.id
                        ? 'bg-ink-950 text-white'
                        : 'border border-line bg-white text-ink-600 hover:border-blue-brand/40 hover:text-blue-brand'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </Reveal>

          <div className="mt-12 space-y-12">
            {groups.map((group) => (
              <div key={group.id}>
                <div className="mb-5 flex items-center gap-3">
                  <h2 className="font-display text-xl font-bold tracking-[-0.04em] text-ink-950">
                    {group.label}
                  </h2>
                  <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold text-ink-500">
                    {group.services.length}
                  </span>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {group.services.map((service, index) => (
                    <Reveal key={service.id} delay={(index % 3) * 60}>
                      <ServiceCard service={service} />
                    </Reveal>
                  ))}
                </div>
              </div>
            ))}

            {groups.length === 0 && (
              <p className="rounded-[18px] border border-line bg-white p-8 text-center text-sm text-ink-500">
                Nenhum serviço encontrado para a busca informada.
              </p>
            )}
          </div>
        </Container>
      </section>

      <section className="bg-white py-20 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Histórico"
            title="Incidentes recentes"
            description="Registros demonstrativos para mostrar como o histórico será apresentado quando houver dados oficiais."
          />
          <Reveal delay={80}>
            <div className="mt-9">
              <IncidentHistory incidents={snapshot?.incidents ?? []} />
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="bg-mist py-20 sm:py-24">
        <Container>
          <Reveal>
            <NetworkStatus />
          </Reveal>
        </Container>
      </section>

      <section className="bg-white py-20 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Suporte ao cliente"
            title="Uma orientação antes de chamar o suporte."
            description="Responda três perguntas rápidas e receba sugestões gerais para o seu caso."
          />
          <Reveal delay={80}>
            <div className="mt-9">
              <InternetDiagnostics />
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  )
}
