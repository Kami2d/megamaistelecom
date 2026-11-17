/**
 * Single source of truth for brand, contact and commercial metadata.
 *
 * Contact details, units and CNPJ below were taken from the reference MVP that
 * the client approved. Confirm them before publishing. Values can still be
 * overridden at build time through environment variables (see .env.example).
 */
const fromEnv = (key: string, fallback: string) => {
  const value = import.meta.env[key]
  return typeof value === 'string' && value.trim() ? value.trim() : fallback
}

const configuredPortalUrl = fromEnv('VITE_CUSTOMER_PORTAL_URL', '#contato')
const safePortalUrl = /^(#|https?:\/\/)/.test(configuredPortalUrl) ? configuredPortalUrl : '#contato'

/**
 * Legacy placeholder kept only as a guard: if an old deploy still sets this
 * number explicitly, WhatsApp CTAs stay disabled until the real number is set.
 */
export const demoWhatsappPhone = '559900000000'

export const siteConfig = {
  brand: {
    legalName: 'Mega Mais Telecom',
    shortName: 'MEGA+',
    descriptor: 'Fibra Óptica e Link Dedicado',
    tagline: 'Conectando você ao futuro.',
    instagramHandle: '@megamais.telecom',
  },
  whatsappPhone: fromEnv('VITE_WHATSAPP_PHONE', '5598992165127'),
  whatsappDefaultMessage:
    'Olá! Vim pelo site da MEGA+ Telecom e gostaria de consultar a cobertura no meu endereço.',
  customerPortalUrl: safePortalUrl,
  instagramUrl: 'https://www.instagram.com/megamais.telecom/',
  cnpj: '46.434.669/0001-92',
  locations: ['Rosário', 'São Luís', 'Codó', 'São João Batista'],
  units: [
    {
      name: 'Rosário · sede',
      address: 'Rua Santa Luzia, 158, Centro, Rosário – MA, 65150-000',
    },
    {
      name: 'São Luís',
      address: 'R. Principal, nº 05, Cruzeiro de Santa Bárbara, São Luís – MA, 65059-815',
    },
    {
      name: 'Codó',
      address: 'Av. Cristóvão Colombo, Trizidela, Codó – MA, 65400-000',
    },
    {
      name: 'São João Batista',
      address: 'Maranhão',
    },
  ],
  contact: {
    phone: '(98) 99216-5127',
    email: null as string | null,
    address: null as string | null,
  },
  navigation: [
    { label: 'Planos', href: '#planos' },
    { label: 'Simulador', href: '#simulador' },
    { label: 'Diferenciais', href: '#diferenciais' },
    { label: 'Como contratar', href: '#como-contratar' },
    { label: 'Cobertura', href: '#cobertura' },
    { label: 'Dúvidas', href: '#faq' },
    { label: 'Status', href: '#status' },
  ],
} as const

export type SiteConfig = typeof siteConfig

/** False only when the legacy placeholder is explicitly configured. */
export const isWhatsAppConfigured =
  siteConfig.whatsappPhone.replace(/\D/g, '') !== demoWhatsappPhone
