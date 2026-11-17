export type BenefitIcon =
  | 'fiber'
  | 'gauge'
  | 'shield'
  | 'headset'
  | 'install'
  | 'wifi'

export type Benefit = {
  icon: BenefitIcon
  title: string
  description: string
}

/** Positioning and service promises published in the official Instagram bio. */
export const benefits: Benefit[] = [
  {
    icon: 'fiber',
    title: 'Fibra óptica de verdade',
    description: 'Conexão por fibra para mais velocidade e estabilidade no dia a dia.',
  },
  {
    icon: 'gauge',
    title: 'Alta velocidade',
    description: 'Planos de 400 a 800 MB para acompanhar trabalho, estudo e lazer.',
  },
  {
    icon: 'shield',
    title: 'Conexão estável',
    description: 'Menos quedas e mais confiança nos momentos que mais importam.',
  },
  {
    icon: 'headset',
    title: 'Suporte especializado',
    description: 'Atendimento técnico 24 horas, conforme divulgado no Instagram oficial.',
  },
  {
    icon: 'install',
    title: 'Instalação orientada',
    description: 'Nossa equipe acompanha as etapas até a sua conexão ficar pronta.',
  },
  {
    icon: 'wifi',
    title: 'Wi-Fi para toda a casa',
    description: 'Conectividade sem fio para seus dispositivos em cada ambiente.',
  },
]
