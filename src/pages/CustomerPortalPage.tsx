import { ArrowLeft, ExternalLink, LockKeyhole, ShieldCheck } from 'lucide-react'
import { siteConfig } from '../data/site'
import { Container } from '../components/Container'
import { CtaLink } from '../components/CtaLink'
import { Reveal } from '../components/Reveal'

export function CustomerPortalPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-ink-950 py-14 text-white sm:py-16">
        <div className="grid-technical pointer-events-none absolute inset-0 opacity-70" />
        <div className="pointer-events-none absolute -right-32 -top-24 h-80 w-80 rounded-full bg-blue-brand/20 blur-[100px]" />
        <Container className="relative">
          <Reveal>
            <a
              href="#planos"
              className="inline-flex items-center gap-2 text-xs font-semibold text-white/60 transition-colors hover:text-cyan-signal"
            >
              <ArrowLeft size={15} aria-hidden="true" />
              Voltar ao site
            </a>
            <span className="eyebrow-pill mt-8">Acesso do assinante</span>
            <h1 className="mt-6 font-display text-4xl font-extrabold italic tracking-[-0.035em] sm:text-5xl lg:text-6xl">
              Área do cliente
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/65">
              Acesse a Central do Assinante para consultar seus serviços, faturas
              e informações da sua conta MEGA+. O login abre em uma nova aba, no
              site oficial da operadora.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="bg-mist py-12 sm:py-16">
        <Container>
          <Reveal>
            <div className="mx-auto max-w-2xl overflow-hidden rounded-[1.75rem] border border-ink-900/10 bg-white shadow-card">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-6 py-4">
                <span className="inline-flex items-center gap-2 text-xs font-semibold text-ink-700">
                  <LockKeyhole size={14} className="text-blue-brand" aria-hidden="true" />
                  Central do Assinante · acesso seguro
                </span>
                <span className="rounded-full bg-blue-brand/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-blue-brand">
                  Site oficial
                </span>
              </div>

              <div className="px-6 py-10 text-center sm:px-10 sm:py-12">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[linear-gradient(140deg,#1e6bff,#5aa6ff)] shadow-[0_16px_32px_-14px_rgba(30,107,255,0.8)]">
                  <LockKeyhole size={26} aria-hidden="true" />
                </div>
                <h2 className="mt-6 font-display text-2xl font-bold italic tracking-[-0.025em] text-ink-950 sm:text-3xl">
                  Entre na sua conta
                </h2>
                <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-500">
                  Use seu login MEGA+ para acompanhar seus serviços e informações
                  da conta. Por segurança, a Central do Assinante abre em uma nova
                  aba do navegador.
                </p>

                <CtaLink
                  href={siteConfig.customerPortalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="md"
                  variant="primary"
                  className="mt-8"
                >
                  Acessar Central do Assinante
                  <ExternalLink size={16} aria-hidden="true" />
                </CtaLink>

                <p className="mt-7 inline-flex items-center justify-center gap-2 text-xs text-ink-500">
                  <ShieldCheck size={15} className="text-blue-brand" aria-hidden="true" />
                  Autenticação feita diretamente no portal da operadora
                </p>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  )
}
