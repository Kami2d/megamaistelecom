import { useEffect, useRef } from 'react'
import { ArrowUpRight, Instagram, MessageCircle, X } from 'lucide-react'
import { siteConfig } from '../data/site'
import { isWhatsAppConfigured, whatsappUrl } from '../lib/whatsapp'
import { BrandLogo } from './BrandLogo'
import { Container } from './Container'

type MobileMenuProps = {
  open: boolean
  onClose: () => void
}

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      id="mobile-navigation"
      className="fixed inset-0 z-40 overflow-y-auto bg-ink-950 pt-[76px] xl:hidden"
    >
      <div className="absolute right-5 top-5">
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Fechar menu"
          className="grid h-11 w-11 place-items-center rounded-xl border border-white/15 text-white transition-colors hover:bg-white/10"
        >
          <X size={20} aria-hidden="true" />
        </button>
      </div>

      <Container className="flex min-h-[calc(100vh-76px)] flex-col justify-between py-10">
        <nav aria-label="Navegação principal mobile">
          <ul className="divide-y divide-white/10 border-y border-white/10">
            {siteConfig.navigation.map((item, index) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={onClose}
                  className="flex items-center justify-between py-5 font-display text-2xl font-semibold tracking-[-0.04em] text-white transition-colors hover:text-cyan-signal"
                >
                  <span>
                    <span className="mr-4 text-xs font-medium text-white/30">
                      0{index + 1}
                    </span>
                    {item.label}
                  </span>
                  <ArrowUpRight size={18} className="text-white/35" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-12 space-y-5">
          <a
            href={siteConfig.customerPortalUrl}
            onClick={onClose}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-brand px-6 py-4 text-sm font-semibold text-white transition-colors hover:bg-blue-bright"
          >
            Área do Cliente <ArrowUpRight size={16} aria-hidden="true" />
          </a>
          {isWhatsAppConfigured ? (
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 px-6 py-4 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              <MessageCircle size={17} aria-hidden="true" /> Falar no WhatsApp
            </a>
          ) : (
            <button
              type="button"
              disabled
              title="Atendimento pelo WhatsApp em breve"
              className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-white/10 px-6 py-4 text-sm font-semibold text-white/35"
            >
              <MessageCircle size={17} aria-hidden="true" /> WhatsApp em breve
            </button>
          )}
          <div className="flex items-center justify-between border-t border-white/10 pt-6">
            <BrandLogo compact />
            <a
              href={siteConfig.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram oficial da MEGA+"
              className="text-white/60 transition-colors hover:text-cyan-signal"
            >
              <Instagram size={20} aria-hidden="true" />
            </a>
          </div>
        </div>
      </Container>
    </div>
  )
}
