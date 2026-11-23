import { ArrowUpRight, HeartHandshake, Gauge, RadioTower } from 'lucide-react'
import { siteConfig } from '../data/site'
import { Container } from '../components/Container'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'

const pillars = [
  {
    icon: Gauge,
    title: 'Velocidade',
    description: 'Conexão para acompanhar o ritmo da sua rotina.',
  },
  {
    icon: RadioTower,
    title: 'Conectividade',
    description: 'Fibra óptica para trabalho, estudo e entretenimento.',
  },
  {
    icon: HeartHandshake,
    title: 'Atendimento',
    description: 'Suporte técnico 24 horas para você não ficar sozinho.',
  },
]

export function About() {
  return (
    <section id="sobre" className="relative overflow-hidden bg-[radial-gradient(55%_45%_at_100%_50%,rgba(30,107,255,0.05),transparent_60%),#ffffff] py-24 sm:py-28">
      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-24">
          <Reveal>
            <div className="relative">
              <div className="absolute -bottom-5 -left-5 h-40 w-40 rounded-[2rem] border-2 border-blue-brand/25" aria-hidden="true" />
              <div className="relative overflow-hidden rounded-[2rem] shadow-card">
                <img
                  src="/images/about-workspace.jpg"
                  alt="Ambiente de trabalho conectado"
                  className="h-[360px] w-full object-cover sm:h-[470px]"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_25%,rgba(2,7,22,0.8)_100%)]" />
                <div className="absolute inset-x-6 bottom-6 flex items-center justify-between gap-4 rounded-2xl border border-white/15 bg-ink-950/80 px-5 py-4 text-white backdrop-blur-md">
                  <div>
                    <p className="font-display text-lg font-extrabold italic tracking-[-0.02em]">
                      MEGA<span className="text-cyan-signal">+</span>
                    </p>
                    <p className="mt-0.5 text-[11px] text-white/55">
                      {siteConfig.brand.tagline}
                    </p>
                  </div>
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-cyan-signal">
                    <ArrowUpRight size={18} aria-hidden="true" />
                  </span>
                </div>
              </div>
            </div>
          </Reveal>

          <div>
            <SectionHeading
              eyebrow="Sobre nós"
              title="Muito mais que internet. Uma conexão com você."
            />
            <Reveal delay={120}>
              <p className="mt-6 text-[15px] leading-relaxed text-ink-600">
                A MEGA+ Telecom é uma provedora de fibra óptica e link dedicado
                que atende planos residenciais e empresariais. Nosso compromisso
                é conectar você com velocidade e estabilidade nos momentos que
                realmente importam.
              </p>
              <p className="mt-4 text-[15px] leading-relaxed text-ink-600">
                Estamos presentes em {siteConfig.locations.join(', ')} e
                região, com atendimento sujeito à área de cobertura.
              </p>

              <div className="mt-10 space-y-5 border-t border-line pt-8">
                {pillars.map(({ icon: Icon, title, description }) => (
                  <div key={title} className="flex items-start gap-4">
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-mist-2 text-blue-brand">
                      <Icon size={19} strokeWidth={1.8} aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-display text-base font-bold tracking-[-0.02em] text-ink-950">
                        {title}
                      </h3>
                      <p className="mt-1 text-sm text-ink-500">{description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  )
}
