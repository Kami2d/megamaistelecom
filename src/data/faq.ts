export type FaqItem = {
  id: string
  question: string
  answer: string
}

/**
 * Answers avoid inventing policies: they direct the visitor to the commercial
 * team wherever the reference material does not state a rule.
 */
export const faqItems: FaqItem[] = [
  {
    id: 'fidelidade',
    question: 'Qual é o prazo de fidelidade?',
    answer:
      'As condições contratuais podem variar conforme o plano e a região. Antes de assinar, nossa equipe informa todas as condições vigentes para você.',
  },
  {
    id: 'roteador',
    question: 'O roteador está incluso?',
    answer:
      'A disponibilidade e a quantidade de roteadores dependem do plano contratado. Confirme essa informação diretamente com o nosso atendimento.',
  },
  {
    id: 'contratacao',
    question: 'Como faço para contratar?',
    answer:
      'Escolha um plano, consulte a disponibilidade da sua região e fale com a nossa equipe pelo WhatsApp. O atendimento comercial confirma os próximos passos.',
  },
  {
    id: 'instalacao',
    question: 'Como funciona a instalação?',
    answer:
      'Após a confirmação da disponibilidade, a equipe informa o prazo e as etapas de instalação para o seu endereço.',
  },
  {
    id: 'suporte',
    question: 'Como entrar em contato com o suporte?',
    answer:
      'O suporte técnico da MEGA+ atende 24 horas. Fale com a equipe pelo WhatsApp ou pelo nosso Instagram oficial.',
  },
]
