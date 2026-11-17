import { MessageCircle } from 'lucide-react'
import { isWhatsAppConfigured, whatsappUrl } from '../lib/whatsapp'

export function FloatingWhatsApp() {
  if (!isWhatsAppConfigured) return null

  return (
    <div className="group fixed bottom-5 right-5 z-40 sm:bottom-7 sm:right-7">
      <span className="pulse-ring pointer-events-none" aria-hidden="true" />
      <a
        href={whatsappUrl()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar com a MEGA+ pelo WhatsApp"
        className="relative grid h-14 w-14 place-items-center rounded-full bg-[linear-gradient(140deg,#29d366,#14a84a)] text-white shadow-[0_16px_34px_-10px_rgba(20,168,74,0.8)] transition-transform duration-300 hover:scale-105 active:scale-95 sm:h-[60px] sm:w-[60px]"
      >
        <MessageCircle size={27} aria-hidden="true" />
      </a>
      <span className="pointer-events-none absolute bottom-[70px] right-0 whitespace-nowrap rounded-full bg-ink-950 px-3.5 py-2 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity duration-300 group-hover:opacity-100">
        Fale com a gente
      </span>
    </div>
  )
}
