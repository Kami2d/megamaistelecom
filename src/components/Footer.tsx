import { Instagram, MapPin, MessageCircle } from 'lucide-react'
import { siteConfig } from '../data/site'
import { isWhatsAppConfigured, whatsappUrl } from '../lib/whatsapp'
import { BrandLogo } from './BrandLogo'
import { Container } from './Container'

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink-950 pb-10 pt-20 text-white">
      <div className="grid-technical pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -right-40 top-0 h-[420px] w-[420px] rounded-full bg-blue-brand/20 blur-[120px]"
        aria-hidden="true"
      />

      <Container className="relative">
        <div className="grid gap-12 pb-14 sm:grid-cols-2 lg:grid-cols-[1.1fr_1.5fr_1.3fr] lg:gap-10">
          <div>
            <BrandLogo />
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-white/55">
              {siteConfig.brand.descriptor}. Fibra para casas e negócios em
              localidades do Maranhão, conforme a área de cobertura.
            </p>
            <a
              href={siteConfig.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram oficial da MEGA+"
              className="mt-7 inline-grid h-11 w-11 place-items-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-cyan-signal/60 hover:text-cyan-signal"
            >
              <Instagram size={18} aria-hidden="true" />
            </a>
          </div>

          <div>
            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">
              Unidades
            </h2>
            <ul className="mt-5 space-y-4">
              {siteConfig.units.map((unit) => (
                <li key={unit.name} className="flex items-start gap-2.5 text-sm text-white/60">
                  <MapPin size={15} className="mt-0.5 shrink-0 text-cyan-signal" aria-hidden="true" />
                  <span>
                    <strong className="block font-semibold text-white/85">{unit.name}</strong>
                    {unit.address}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">
              Contato
            </h2>
            <div className="mt-5 space-y-4 text-sm text-white/60">
              <div>
                <p className="text-white/40">Canais de contato</p>
                {isWhatsAppConfigured ? (
                  <a
                    href={whatsappUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex items-center gap-2 font-display text-xl font-bold text-white transition-colors hover:text-cyan-signal"
                  >
                    <MessageCircle size={17} className="text-cyan-signal" aria-hidden="true" />
                    {siteConfig.contact.phone}
                  </a>
                ) : (
                  <p className="mt-1 text-white/35">WhatsApp em breve</p>
                )}
              </div>
              <div>
                <p className="text-white/40">Navegação</p>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
                  {siteConfig.navigation.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      className="text-white/70 transition-colors hover:text-cyan-signal"
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>
              <p className="pt-1 text-white/40">
                Atendimento conforme a área de cobertura
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 py-6 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.brand.legalName} · CNPJ{' '}
            {siteConfig.cnpj}. Todos os direitos reservados.
          </p>
          <p>{siteConfig.brand.tagline}</p>
        </div>

        <div className="mt-2 select-none overflow-hidden" aria-hidden="true">
          <p className="giant-wordmark">
            MEGA<b>+</b>
          </p>
        </div>
      </Container>
    </footer>
  )
}
