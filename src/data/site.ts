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

const configuredPortalUrl = fromEnv(
  'VITE_CUSTOMER_PORTAL_URL',
  'https://meganettelecom.sgp.net.br/accounts/central/login?next=/central/home/',
)
const safePortalUrl = /^(#|https?:\/\/)/.test(configuredPortalUrl) ? configuredPortalUrl : '#contato'

const defaultPlayStoreUrl =
  'https://play.google.com/store/apps/details?id=com.appnex.megamaistelecom'
const configuredPlayStoreUrl = fromEnv('VITE_PLAY_STORE_URL', defaultPlayStoreUrl)
const safePlayStoreUrl = configuredPlayStoreUrl.startsWith('https://play.google.com/')
  ? configuredPlayStoreUrl
  : defaultPlayStoreUrl

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
    tagline: 'Conectado ao que vem a seguir.',
    instagramHandle: '@megamais.telecom',
  },
  whatsappPhone: fromEnv('VITE_WHATSAPP_PHONE', '5598992165127'),
  whatsappDefaultMessage:
    'Olá! Vim pelo site da MEGA+ Telecom e gostaria de verificar a cobertura no meu endereço.',
  customerPortalUrl: safePortalUrl,
  playStoreUrl: safePlayStoreUrl,
  instagramUrl: 'https://www.instagram.com/megamais.telecom/',
  cnpj: '46.434.669/0001-92',
  locations: ['São Luís', 'Rosário', 'Presidente Juscelino', 'Barreirinhas'],
  units: [
    {
      name: 'São Luís · sede',
      address: 'R. Principal, nº 05, Cruzeiro de Santa Bárbara, São Luís – MA, 65059-815',
    },
    {
      name: 'Rosário',
      address: 'Rua Santa Luzia, 158, Centro, Rosário – MA, 65150-000',
    },
    {
      name: 'Presidente Juscelino',
      address: 'Maranhão',
    },
    {
      name: 'Barreirinhas',
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
