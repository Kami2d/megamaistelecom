import { combos } from '../data/combos'
import { ComboCard } from '../components/ComboCard'
import { Container } from '../components/Container'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'

export function Combos() {
  const [featured, ...others] = combos

  return (
    <section id="combos" className="relative overflow-hidden bg-[radial-gradient(70%_50%_at_0%_0%,rgba(30,107,255,0.06),transparent_60%),radial-gradient(50%_40%_at_100%_100%,rgba(255,106,26,0.05),transparent_60%),linear-gradient(180deg,#eef3fb,#f7faff)] py-24 sm:py-28">
      <Container>
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading
            eyebrow="Combos e serviços"
            title="Internet que vai além da conexão."
            description="Combine fibra óptica com soluções para segurança, saúde e família. As condições comerciais de cada combo são informadas no atendimento."
          />
          <Reveal delay={100}>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-500">
              Sob consulta · sem valores publicados
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          <Reveal className="h-full lg:col-span-2">
            <ComboCard combo={featured} featured />
          </Reveal>
          <div className="grid gap-5">
            {others.map((combo, index) => (
              <Reveal key={combo.id} delay={(index + 1) * 90}>
                <ComboCard combo={combo} />
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
