import { MessageCircle } from 'lucide-react'
import { isWhatsAppConfigured, whatsappUrl } from '../lib/whatsapp'

export function FloatingWhatsApp() {
  if (!isWhatsAppConfigured) return null

  return (
    <div className="group fixed bottom-5 right-5 z-40 sm:bottom-8 sm:right-8">
      <span className="pointer-events-none absolute inset-0 rounded-full bg-[#25D366]/40 signal-pulse" aria-hidden="true" />
      <a
        href={whatsappUrl()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar com a MEGA+ pelo WhatsApp"
        className="relative grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_16px_36px_-12px_rgba(37,211,102,0.8)] transition-transform duration-300 hover:scale-105 active:scale-95 sm:h-[60px] sm:w-[60px]"
      >
        <MessageCircle size={25} aria-hidden="true" />
      </a>
      <span className="pointer-events-none absolute bottom-[70px] right-0 whitespace-nowrap rounded-lg bg-ink-950 px-3 py-2 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity duration-300 group-hover:opacity-100">
        Fale com a gente
      </span>
    </div>
  )
}
