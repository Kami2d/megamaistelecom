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
  benefits: string[]
  uploadMb: number | null
  routers: number | null
}

export const plans: Plan[] = [
  {
    id: 'wifi-smart',
    name: 'Wi-Fi Smart',
    speedMb: 400,
    monthlyPrice: 99.9,
    punctualityPrice: null,
    benefits: [
      'Internet por fibra óptica',
      'Wi-Fi para sua casa',
      'Suporte técnico 24h',
    ],
    uploadMb: null,
    routers: null,
  },
  {
    id: 'wifi-master',
    name: 'Wi-Fi Master',
    speedMb: 500,
    monthlyPrice: 119.9,
    punctualityPrice: null,
    badge: 'Destaque',
    benefits: [
      'Internet por fibra óptica',
      'Wi-Fi para sua casa',
      'Suporte técnico 24h',
    ],
    uploadMb: null,
    routers: null,
  },
  {
    id: 'wifi-plus',
    name: 'Wi-Fi Plus',
    speedMb: 600,
    monthlyPrice: 129.9,
    punctualityPrice: null,
    benefits: [
      'Internet por fibra óptica',
      'Wi-Fi para sua casa',
      'Suporte técnico 24h',
    ],
    uploadMb: null,
    routers: null,
  },
  {
    id: 'wifi-plus-360',
    name: 'Wi-Fi Plus 360º',
    speedMb: 800,
    monthlyPrice: 149.9,
    punctualityPrice: null,
    benefits: [
      'Internet por fibra óptica',
      'Wi-Fi para sua casa',
      'Suporte técnico 24h',
    ],
    uploadMb: null,
    routers: null,
  },
]
