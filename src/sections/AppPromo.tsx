import { ShieldCheck, Smartphone } from 'lucide-react'
import { siteConfig } from '../data/site'
import { Container } from '../components/Container'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'

export function AppPromo() {
  return (
    <section
      id="app"
      className="relative overflow-x-clip bg-[radial-gradient(60%_60%_at_85%_35%,rgba(30,107,255,0.22),transparent_65%),radial-gradient(45%_50%_at_10%_85%,rgba(255,106,26,0.12),transparent_70%),linear-gradient(180deg,#020716,#06143a_60%,#020716)] pb-0 pt-24 sm:pt-28"
    >
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-cyan-signal/10"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute right-[8%] top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-blue-brand/15 blur-[90px]"
        aria-hidden="true"
      />

      <Container>
        <div className="grid items-center gap-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          <div>
            <SectionHeading
              tone="light"
              eyebrow="Aplicativo MEGA+"
              title={
                <>
                  A MEGA+ cabe no{' '}
                  <span className="text-coral-accent">seu bolso.</span>
                </>
              }
              description="Baixe o aplicativo da MEGA+ na Google Play e tenha sua operadora sempre por perto, de onde você estiver."
            />

            <Reveal delay={120}>
              <div className="mt-9">
                <a
                  href={siteConfig.playStoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Baixar o aplicativo MEGA+ na Google Play"
                  className="group inline-block rounded-xl ring-cyan-signal/60 outline-none transition-transform duration-300 hover:-translate-y-1 focus-visible:ring-4"
                >
                  <img
                    src="/images/playstore.png"
                    alt="Disponível no Google Play — baixar aplicativo MEGA+"
                    width={900}
                    height={297}
                    className="h-auto w-[220px] drop-shadow-[0_12px_28px_rgba(0,0,0,0.45)] transition-[filter] duration-300 group-hover:brightness-110 sm:w-[250px]"
                  />
                </a>

                <div className="mt-7 flex flex-wrap gap-3">
                  <span className="-translate-y-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/70">
                    <Smartphone size={14} className="text-cyan-signal" aria-hidden="true" />
                    Para Android
                  </span>
                  <span className="-translate-y-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/70">
                    <ShieldCheck size={14} className="text-cyan-signal" aria-hidden="true" />
                    Download pela Google Play
                  </span>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={180} className="self-stretch">
            <div className="relative mx-auto h-full min-h-[360px] w-full sm:min-h-[420px] lg:min-h-[460px]">
              <div
                className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-bright/20 blur-[80px]"
                aria-hidden="true"
              />
              {/* A máscara acompanha a área visível do celular, então o fade nunca
                  fica acima da borda da seção nem corta o aparelho no meio. */}
              <div className="app-promo-phone-frame pointer-events-none absolute inset-y-0 -inset-x-6 overflow-hidden sm:-inset-x-8">
                <div className="absolute left-1/2 top-0 w-[min(92vw,520px)] max-w-none -translate-x-1/2">
                  <img
                    src="/images/celular.png"
                    alt="Celular exibindo o aplicativo da MEGA+"
                    width={563}
                    height={1118}
                    loading="lazy"
                    className="app-promo-phone relative z-10 w-full"
                  />
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
