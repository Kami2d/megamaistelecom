import { useEffect, useRef, type RefObject } from 'react'
import { ArrowUpRight, Instagram, MessageCircle } from 'lucide-react'
import { siteConfig } from '../data/site'
import { isWhatsAppConfigured, whatsappUrl } from '../lib/whatsapp'
import { BrandLogo } from './BrandLogo'
import { Container } from './Container'

type MobileMenuProps = {
  open: boolean
  onClose: () => void
  triggerRef: RefObject<HTMLButtonElement | null>
}

export function MobileMenu({ open, onClose, triggerRef }: MobileMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    triggerRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }

      if (event.key !== 'Tab') return

      const trigger = triggerRef.current
      const links = Array.from(
        panelRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? [],
      )
      const focusables = trigger ? [trigger, ...links] : links
      if (!focusables.length) return

      const first = focusables[0]
      const last = focusables[focusables.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
      triggerRef.current?.focus()
    }
  }, [open, onClose, triggerRef])

  if (!open) return null

  return (
    <div
      ref={panelRef}
      id="mobile-navigation"
      role="dialog"
      aria-modal="true"
      aria-label="Menu de navegação"
      className="fixed inset-0 z-40 overflow-y-auto bg-ink-950 pt-[76px] lg:hidden"
    >
      <div className="grid-technical pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />

      <Container className="relative flex min-h-[calc(100vh-76px)] flex-col justify-between py-10">
        <nav aria-label="Navegação principal mobile">
          <ul>
            {siteConfig.navigation.map((item, index) => (
              <li key={item.href} className="border-b border-white/10 first:border-t">
                <a
                  href={item.href}
                  onClick={onClose}
                  className="flex items-center justify-between py-4 text-left transition-colors hover:text-cyan-signal"
                >
                  <span className="font-display text-[1.7rem] font-extrabold italic tracking-[-0.03em] text-white">
                    <span className="mr-4 font-sans text-[11px] font-medium not-italic text-white/30">
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

        <div className="mt-12 space-y-4">
          {isWhatsAppConfigured ? (
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="cta-pill w-full bg-[linear-gradient(100deg,#ff5a10,#ff8a2a)] text-white"
              data-variant="primary"
              data-size="md"
            >
              Falar no WhatsApp
              <MessageCircle size={16} aria-hidden="true" />
            </a>
          ) : (
            <button
              type="button"
              disabled
              title="Atendimento pelo WhatsApp em breve"
              className="cta-pill w-full bg-white/10 text-white/40"
              data-variant="outline-light"
              data-size="md"
            >
              WhatsApp em breve
              <MessageCircle size={16} aria-hidden="true" />
            </button>
          )}
          <a
            href={siteConfig.customerPortalUrl}
            onClick={onClose}
            className="cta-pill w-full bg-white/[0.06] text-white"
            data-variant="outline-light"
            data-size="md"
          >
            Área do Cliente
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>
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
