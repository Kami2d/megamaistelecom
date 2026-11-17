import { useState } from 'react'
import { ArrowLeft, ArrowRight, MessageCircle, RotateCcw, Search } from 'lucide-react'
import { CtaLink } from './CtaLink'
import { WhatsAppCta } from './WhatsAppCta'

type AnswerKey = 'issue' | 'devices' | 'others'
type Answers = Record<AnswerKey, string>

const questions: {
  id: AnswerKey
  title: string
  options: { value: string; label: string }[]
}[] = [
  {
    id: 'issue',
    title: 'Qual problema você está enfrentando?',
    options: [
      { value: 'video', label: 'Vídeos travando' },
      { value: 'sites', label: 'Sites não carregam' },
      { value: 'social', label: 'Redes sociais não funcionam' },
      { value: 'games', label: 'Jogos com ping alto' },
      { value: 'offline', label: 'Internet completamente indisponível' },
    ],
  },
  {
    id: 'devices',
    title: 'O problema acontece em todos os dispositivos?',
    options: [
      { value: 'all', label: 'Sim, em todos os dispositivos' },
      { value: 'one', label: 'Não, apenas em um dispositivo' },
    ],
  },
  {
    id: 'others',
    title: 'Outros serviços estão funcionando normalmente?',
    options: [
      { value: 'yes', label: 'Sim' },
      { value: 'no', label: 'Não' },
    ],
  },
]

const emptyAnswers: Answers = { issue: '', devices: '', others: '' }

function buildGuidance(answers: Answers) {
  const platformIssue = ['video', 'social', 'games'].includes(answers.issue)

  if (answers.devices === 'one') {
    return {
      title: 'Pode ser um problema apenas no dispositivo',
      tips: [
        'Confirme se o Wi-Fi deste aparelho está conectado e com sinal.',
        'Reinicie o dispositivo e tente novamente.',
        'Teste outro aplicativo ou navegador para comparar.',
      ],
      statusLink: platformIssue,
    }
  }

  if (answers.issue === 'offline' && answers.devices === 'all') {
    return {
      title: 'Verifique a conexão antes de acionar o suporte',
      tips: [
        'Confira se o roteador está ligado e se os cabos estão conectados.',
        'Reinicie o roteador e aguarde ele estabilizar.',
        'Se a conexão continuar indisponível, fale com o suporte.',
      ],
      statusLink: false,
    }
  }

  if (platformIssue && answers.others === 'yes') {
    return {
      title: 'O problema pode estar na plataforma',
      tips: [
        'Consulte a Central de Status para verificar o serviço afetado.',
        'Teste outra plataforma para comparar o comportamento.',
        'Se apenas este serviço falhar, aguarde a normalização da plataforma.',
      ],
      statusLink: true,
    }
  }

  return {
    title: 'Vamos reduzir as possibilidades',
    tips: [
      'Reinicie o roteador e aguarde alguns minutos.',
      'Verifique se outros serviços apresentam o mesmo comportamento.',
      'Se o problema persistir, registre o horário e fale com o suporte.',
    ],
    statusLink: true,
  }
}

export function InternetDiagnostics() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Answers>(emptyAnswers)
  const finished = step === questions.length
  const guidance = finished ? buildGuidance(answers) : null

  const selectOption = (value: string) => {
    const current = questions[step]
    setAnswers((previous) => ({ ...previous, [current.id]: value }))
    setStep((previous) => previous + 1)
  }

  const restart = () => {
    setAnswers(emptyAnswers)
    setStep(0)
  }

  const summary = Object.entries(answers)
    .map(([key, value]) => {
      const question = questions.find((item) => item.id === key)
      const option = question?.options.find((item) => item.value === value)
      return `${question?.title ?? ''} ${option?.label ?? ''}`.trim()
    })
    .join(' | ')

  return (
    <div className="rounded-[24px] border border-line bg-white p-7 shadow-card sm:p-9">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-brand">
            Diagnóstico guiado
          </p>
          <h2 className="mt-2 font-display text-2xl font-bold tracking-[-0.04em] text-ink-950">
            Está com problemas na sua internet?
          </h2>
        </div>
        <span className="shrink-0 rounded-full bg-mist-2 px-3 py-1 text-[11px] font-semibold text-ink-500">
          {finished ? 'Concluído' : `Etapa ${step + 1} de 3`}
        </span>
      </div>

      {!finished && (
        <div className="mt-8">
          <h3 className="font-display text-lg font-semibold tracking-[-0.03em] text-ink-950">
            {questions[step].title}
          </h3>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {questions[step].options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => selectOption(option.value)}
                className="rounded-xl border border-line bg-mist px-5 py-4 text-left text-sm font-medium text-ink-700 transition-all hover:border-blue-brand/50 hover:bg-blue-brand/5 hover:text-blue-brand"
              >
                {option.label}
              </button>
            ))}
          </div>
          {step > 0 && (
            <button
              type="button"
              onClick={() => setStep((value) => value - 1)}
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-ink-500 transition-colors hover:text-blue-brand"
            >
              <ArrowLeft size={15} aria-hidden="true" />
              Voltar
            </button>
          )}
        </div>
      )}

      {finished && guidance && (
        <div className="mt-8" role="status" aria-live="polite">
          <div className="rounded-[18px] border border-blue-brand/20 bg-blue-brand/5 p-6">
            <h3 className="font-display text-lg font-bold tracking-[-0.03em] text-ink-950">
              {guidance.title}
            </h3>
            <ul className="mt-4 space-y-2.5">
              {guidance.tips.map((tip) => (
                <li key={tip} className="flex items-start gap-2.5 text-sm text-ink-600">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-brand" aria-hidden="true" />
                  {tip}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-[11px] leading-relaxed text-ink-500">
              Orientação inicial baseada nas suas respostas. Não é um diagnóstico
              técnico e não substitui uma verificação da conexão.
            </p>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <WhatsAppCta
              message={`Olá! Preciso de ajuda com minha internet. Respostas: ${summary}`}
              className="w-full sm:w-auto"
            >
              <MessageCircle size={16} aria-hidden="true" />
              Falar com o suporte
            </WhatsAppCta>
            {guidance.statusLink && (
              <CtaLink href="#servicos" variant="outline-dark" className="w-full sm:w-auto">
                <Search size={16} aria-hidden="true" />
                Ver status dos serviços
              </CtaLink>
            )}
            <button
              type="button"
              onClick={restart}
              className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-semibold text-ink-500 transition-colors hover:text-blue-brand"
            >
              <RotateCcw size={15} aria-hidden="true" />
              Refazer
            </button>
          </div>
          <p className="mt-4 flex items-center gap-1.5 text-[11px] text-ink-500">
            <ArrowRight size={12} aria-hidden="true" />
            O suporte confirma as condições e os próximos passos para o seu caso.
          </p>
        </div>
      )}
    </div>
  )
}
