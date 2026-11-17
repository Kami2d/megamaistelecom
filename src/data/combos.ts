export type Combo = {
  id: string
  category: string
  title: string
  description: string
  benefit: string
  message: string
  featured?: boolean
}

/** Combo categories requested for the MVP. Commercial terms are not published. */
export const combos: Combo[] = [
  {
    id: 'seguranca',
    category: 'Internet + segurança',
    title: 'Sua casa conectada e protegida',
    description:
      'Combine sua internet fibra óptica com câmeras de segurança e acompanhe os ambientes que importam para você.',
    benefit: 'Mais tranquilidade para a sua rotina',
    message: 'Olá! Gostaria de saber mais sobre o combo internet + câmeras de segurança.',
    featured: true,
  },
  {
    id: 'telemedicina',
    category: 'Internet + telemedicina',
    title: 'Cuidado que chega até você',
    description:
      'Uma conexão estável para consultas online e atendimentos de saúde sem complicação.',
    benefit: 'Conexão para cuidar de quem você ama',
    message: 'Olá! Gostaria de saber mais sobre o combo internet + telemedicina.',
  },
  {
    id: 'familia',
    category: 'Combos para famílias',
    title: 'Todo mundo online ao mesmo tempo',
    description:
      'Velocidade para trabalho, estudos, jogos e entretenimento sem disputar conexão.',
    benefit: 'Um plano para cada pessoa da casa',
    message: 'Olá! Gostaria de conhecer os combos de internet para famílias.',
  },
]
