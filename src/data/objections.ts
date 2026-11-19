/** Confidence-building answers shown before the FAQ. */
export type Objection = {
  id: string
  question: string
  answer: string
}

export const objections: Objection[] = [
  {
    id: 'cobertura',
    question: 'Vocês atendem o meu endereço?',
    answer:
      'A cobertura muda conforme a localidade. Envie seu endereço e confirmamos a disponibilidade antes de qualquer escolha.',
  },
  {
    id: 'velocidade',
    question: 'Qual velocidade combina com minha rotina?',
    answer:
      'Depende do uso, de quantas pessoas se conectam e das atividades. Nosso simulador compara as opções de 350 a 650 Mbps.',
  },
  {
    id: 'instalacao',
    question: 'Qual é o prazo de instalação?',
    answer:
      'O prazo é informado conforme cobertura, disponibilidade técnica e agendamento do seu endereço.',
  },
  {
    id: 'wifi',
    question: 'E se o Wi-Fi não alcançar todos os ambientes?',
    answer:
      'O alcance varia conforme o tamanho do imóvel, as paredes e a posição do roteador. Conheça as opções com repetidor e escolha a melhor para o seu espaço.',
  },
]
