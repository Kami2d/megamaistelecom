/** Confidence-building answers shown before the FAQ. */
export type Objection = {
  id: string
  question: string
  answer: string
}

export const objections: Objection[] = [
  {
    id: 'cobertura',
    question: 'A MEGA+ atende no meu endereço?',
    answer:
      'A disponibilidade pode variar de uma região para outra. Informe seu endereço à equipe para consultar a cobertura antes de escolher o plano.',
  },
  {
    id: 'velocidade',
    question: 'Qual velocidade é ideal para mim?',
    answer:
      'Depende de como você usa a internet, de quantas pessoas se conectam e das atividades realizadas. O simulador ajuda você a comparar as opções de 400 a 800 Mbps.',
  },
  {
    id: 'instalacao',
    question: 'Quanto tempo leva para instalar?',
    answer:
      'A equipe informa o prazo conforme a cobertura, a disponibilidade técnica e as condições de agendamento para o seu endereço.',
  },
  {
    id: 'wifi',
    question: 'E se o sinal não chegar bem a todos os cômodos?',
    answer:
      'A distribuição do Wi-Fi depende do tamanho do imóvel, das paredes e da posição do roteador. Consulte as opções com repetidor e veja qual solução faz sentido para o seu ambiente.',
  },
]
