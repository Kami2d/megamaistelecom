import { ArrowUpRight, Instagram, MapPin, MessageCircle } from 'lucide-react'
import { siteConfig } from '../data/site'
import { isWhatsAppConfigured, whatsappUrl } from '../lib/whatsapp'
import { BrandLogo } from './BrandLogo'
import { Container } from './Container'

const footerLinks = [
  { label: 'Planos de internet', href: '#planos' },
  { label: 'Combos e serviços', href: '#combos' },
  { label: 'Consultar cobertura', href: '#cobertura' },
  { label: 'Teste de velocidade', href: '#velocidade' },
  { label: 'Sobre a MEGA+', href: '#sobre' },
]

export function Footer() {
  return (
    <footer className="bg-ink-950 text-white">
      <Container className="py-16 sm:py-20">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr] lg:gap-10">
          <div>
            <BrandLogo />
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-white/55">
              {siteConfig.brand.descriptor}. {siteConfig.brand.tagline}
            </p>
            <a
              href={siteConfig.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram oficial da MEGA+"
              className="mt-6 inline-grid h-10 w-10 place-items-center rounded-xl border border-white/15 text-white/70 transition-colors hover:border-cyan-signal/60 hover:text-cyan-signal"
            >
              <Instagram size={18} aria-hidden="true" />
            </a>
          </div>

          <div>
            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">
              Navegação
            </h2>
            <ul className="mt-5 space-y-3">
              {siteConfig.navigation.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-sm text-white/65 transition-colors hover:text-cyan-signal"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">
              Serviços
            </h2>
            <ul className="mt-5 space-y-3">
              {footerLinks.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-sm text-white/65 transition-colors hover:text-cyan-signal"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">
              Atendimento
            </h2>
            <div className="mt-5 space-y-4 text-sm text-white/65">
              {isWhatsAppConfigured ? (
                <a
                  href={whatsappUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 transition-colors hover:text-cyan-signal"
                >
                  <MessageCircle size={16} className="text-cyan-signal" aria-hidden="true" />
                  WhatsApp comercial
                </a>
              ) : (
                <p className="flex items-center gap-2.5 text-white/35">
                  <MessageCircle size={16} aria-hidden="true" />
                  WhatsApp em breve
                </p>
              )}
              <a
                href={siteConfig.customerPortalUrl}
                className="flex items-center gap-2.5 transition-colors hover:text-cyan-signal"
              >
                <ArrowUpRight size={16} className="text-cyan-signal" aria-hidden="true" />
                Área do Cliente
              </a>
              <p className="flex items-start gap-2.5">
                <MapPin size={16} className="mt-0.5 shrink-0 text-cyan-signal" aria-hidden="true" />
                <span>
                  Atuação: {siteConfig.locations.join(' · ')}
                  <br />
                  <span className="text-white/35">Endereço: a confirmar</span>
                </span>
              </p>
              <p className="text-white/35">Telefone e e-mail: a confirmar</p>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-7 text-xs text-white/35 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.brand.legalName}. MVP
            demonstrativo — conteúdo sujeito a confirmação.
          </p>
          <p>Fibra óptica com velocidade e estabilidade.</p>
        </div>
      </Container>
    </footer>
  )
}
