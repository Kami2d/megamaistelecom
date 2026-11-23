/**
 * Catalog data supplied for the MVP. Prices are the published monthly values.
 * `punctualityPrice` is intentionally null: the punctuality-discount condition
 * exists as a distinct field but the amount was not provided by the company.
 */
export type Plan = {
  id: string
  name: string
  speedMb: number
  monthlyPrice: number
  punctualityPrice: number | null
  badge?: string
  description: string
  benefits: string[]
  uploadMb: number | null
  routers: number | null
}

export const plans: Plan[] = [
  {
    id: 'wifi-smart',
    name: 'Wi-Fi Smart',
    speedMb: 350,
    monthlyPrice: 80,
    punctualityPrice: null,
    description: 'Para navegar, estudar e acompanhar sua rotina online.',
    benefits: [
      'Internet por fibra óptica',
      'Wi-Fi para sua casa',
      'Atendimento técnico 24h',
    ],
    uploadMb: null,
    routers: null,
  },
  {
    id: 'wifi-master',
    name: 'Wi-Fi Master',
    speedMb: 550,
    monthlyPrice: 100,
    punctualityPrice: null,
    badge: 'Mais escolhido',
    description: 'Mais velocidade para trabalho, estudos e vários acessos.',
    benefits: [
      'Internet por fibra óptica',
      'Wi-Fi para sua casa',
      'Atendimento técnico 24h',
    ],
    uploadMb: null,
    routers: null,
  },
  {
    id: 'wifi-plus',
    name: 'Wi-Fi Plus',
    speedMb: 650,
    monthlyPrice: 120,
    punctualityPrice: null,
    description: 'Desempenho para muitos dispositivos e uso intenso no dia a dia.',
    benefits: [
      'Internet por fibra óptica',
      'Wi-Fi para sua casa',
      'Atendimento técnico 24h',
    ],
    uploadMb: null,
    routers: null,
  },
  {
    id: 'wifi-ultra',
    name: 'Wi-Fi Ultra',
    speedMb: 1000,
    monthlyPrice: 160,
    punctualityPrice: null,
    description: 'Máxima velocidade para quem precisa de performance sem limites.',
    benefits: [
      'Internet por fibra óptica',
      'Wi-Fi para sua casa',
      'Atendimento técnico 24h',
    ],
    uploadMb: null,
    routers: null,
  },
]
