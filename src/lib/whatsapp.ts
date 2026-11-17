import { siteConfig } from '../data/site'

export { isWhatsAppConfigured } from '../data/site'

/** Builds a configurable wa.me deep link with a prefilled message. */
export function whatsappUrl(message: string = siteConfig.whatsappDefaultMessage): string {
  const phone = siteConfig.whatsappPhone.replace(/\D/g, '')
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
}
