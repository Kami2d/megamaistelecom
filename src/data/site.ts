/**
 * Single source of truth for brand, contact and commercial metadata.
 * Values marked as demonstrative must be confirmed with Mega Mais Telecom
 * before the site goes live. They can be overridden at build time through
 * environment variables (see .env.example) without editing this file.
 */
const fromEnv = (key: string, fallback: string) => {
  const value = import.meta.env[key]
  return typeof value === 'string' && value.trim() ? value.trim() : fallback
}

export const demoWhatsappPhone = '559900000000'

export const siteConfig = {
  brand: {
    legalName: 'Mega Mais Telecom',
    shortName: 'MEGA+',
    descriptor: 'Fibra Óptica e Link Dedicado',
    tagline: 'Conectando você ao futuro.',
    instagramHandle: '@megamais.telecom',
  },
  // DEMONSTRATIVE default — set VITE_WHATSAPP_PHONE no deploy.
  whatsappPhone: fromEnv('VITE_WHATSAPP_PHONE', demoWhatsappPhone),
  whatsappDefaultMessage:
    'Olá! Vim pelo site e gostaria de conhecer os planos da MEGA+.',
  // DEMONSTRATIVE default — set VITE_CUSTOMER_PORTAL_URL no deploy.
  customerPortalUrl: fromEnv('VITE_CUSTOMER_PORTAL_URL', '#contato'),
  instagramUrl: 'https://www.instagram.com/megamais.telecom/',
  // Regions published in the official Instagram bio.
  locations: ['São Luís', 'Rosário', 'Barreirinhas', 'PJ-MA'],
  // Not published in the reference material — kept editable and shown as pending.
  contact: {
    phone: null as string | null,
    email: null as string | null,
    address: null as string | null,
  },
  navigation: [
    { label: 'Início', href: '#inicio' },
    { label: 'Planos', href: '#planos' },
    { label: 'Combos', href: '#combos' },
    { label: 'Sobre nós', href: '#sobre' },
    { label: 'Cobertura', href: '#cobertura' },
    { label: 'Status dos Serviços', href: '#status' },
    { label: 'Teste de velocidade', href: '#velocidade' },
    { label: 'Contato', href: '#contato' },
  ],
} as const

export type SiteConfig = typeof siteConfig

/** False while the demo number is in use, so CTAs never open wa.me. */
export const isWhatsAppConfigured =
  siteConfig.whatsappPhone.replace(/\D/g, '') !== demoWhatsappPhone
