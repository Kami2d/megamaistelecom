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
    monthlyPrice: 120,
    punctualityPrice: null,
    description: 'Para navegar, estudar e acompanhar sua rotina online.',
    benefits: [
      'Internet por fibra óptica',
      'Wi-Fi para sua casa',
      'Atendimento técnico 24h',
      'Streaming e canais ao vivo',
    ],
    uploadMb: null,
    routers: null,
  },
  {
    id: 'wifi-master',
    name: 'Wi-Fi Master',
    speedMb: 550,
    monthlyPrice: 140,
    punctualityPrice: null,
    badge: 'Mais escolhido',
    description: 'Mais velocidade para streaming, trabalho e vários acessos.',
    benefits: [
      'Internet por fibra óptica',
      'Wi-Fi para sua casa',
      'Atendimento técnico 24h',
      'Streaming e canais ao vivo',
    ],
    uploadMb: null,
    routers: null,
  },
  {
    id: 'wifi-plus',
    name: 'Wi-Fi Plus',
    speedMb: 650,
    monthlyPrice: 160,
    punctualityPrice: null,
    description: 'Desempenho para muitos dispositivos e uso intenso no dia a dia.',
    benefits: [
      'Internet por fibra óptica',
      'Wi-Fi para sua casa',
      'Atendimento técnico 24h',
      'Streaming e canais ao vivo',
    ],
    uploadMb: null,
    routers: null,
  },
]
