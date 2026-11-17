import { useState, type FormEvent } from 'react'
import { AlertCircle, ArrowRight, CheckCircle2, MapPin, Search } from 'lucide-react'
import { formatCep, isValidCep } from '../lib/format'
import { WhatsAppCta } from './WhatsAppCta'

type Status = 'idle' | 'error' | 'checked'

export function CoverageForm() {
  const [cep, setCep] = useState('')
  const [status, setStatus] = useState<Status>('idle')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus(isValidCep(cep) ? 'checked' : 'error')
  }

  return (
    <div className="rounded-[24px] border border-ink-900/5 bg-white p-7 shadow-card sm:p-9">
      <div className="mb-7 flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-xl bg-blue-brand text-white">
          <MapPin size={20} aria-hidden="true" />
        </div>
        <div>
          <h3 className="font-display text-lg font-bold tracking-[-0.03em] text-ink-950">
            Consulte sua região
          </h3>
          <p className="text-xs text-ink-500">Consulta demonstrativa de CEP</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <label
          htmlFor="cep"
          className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-ink-600"
        >
          Digite seu CEP
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            id="cep"
            name="cep"
            type="text"
            inputMode="numeric"
            autoComplete="postal-code"
            maxLength={9}
            placeholder="00000-000"
            value={cep}
            onChange={(event) => {
              setCep(formatCep(event.target.value))
              if (status !== 'idle') setStatus('idle')
            }}
            aria-invalid={status === 'error'}
            aria-describedby="cep-feedback"
            className={`min-w-0 flex-1 rounded-xl border bg-mist px-4 py-3.5 text-sm font-medium text-ink-950 outline-none transition-colors placeholder:text-ink-500/60 focus:border-blue-brand focus:bg-white focus:ring-2 focus:ring-blue-brand/15 ${
              status === 'error' ? 'border-red-400' : 'border-line'
            }`}
          />
          <button
            type="submit"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-brand px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-blue-bright"
          >
            <Search size={16} aria-hidden="true" />
            Consultar
          </button>
        </div>

        <div id="cep-feedback" className="mt-4 min-h-[48px]" aria-live="polite">
          {status === 'error' && (
            <p className="flex items-start gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle size={17} className="mt-0.5 shrink-0" aria-hidden="true" />
              Digite um CEP válido com 8 números, no formato 00000-000.
            </p>
          )}
          {status === 'checked' && (
            <div className="rounded-xl border border-blue-brand/15 bg-blue-brand/5 px-4 py-3">
              <p className="flex items-start gap-2 text-sm font-medium text-ink-800">
                <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-blue-brand" aria-hidden="true" />
                CEP {cep} válido.
              </p>
              <p className="mt-1.5 pl-6 text-xs leading-relaxed text-ink-500">
                Este MVP não consulta a infraestrutura. A disponibilidade real
                será confirmada pelo nosso atendimento.
              </p>
              <WhatsAppCta
                message={`Olá! Meu CEP é ${cep}. Gostaria de consultar a disponibilidade de internet na minha região.`}
                size="sm"
                className="mt-4 w-full sm:w-auto"
              >
                Confirmar pelo WhatsApp
                <ArrowRight size={14} aria-hidden="true" />
              </WhatsAppCta>
            </div>
          )}
        </div>
      </form>
    </div>
  )
}
