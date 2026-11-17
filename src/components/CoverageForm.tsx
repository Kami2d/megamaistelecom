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
    <div className="relative overflow-hidden rounded-[2rem] bg-[radial-gradient(90%_80%_at_100%_0%,#1d56e0_0%,rgba(29,86,224,0)_55%),linear-gradient(160deg,#0a1a4c,#030a20)] p-7 text-white shadow-[0_45px_90px_-45px_rgba(8,30,100,0.75)] sm:p-10">
      <div className="grid-technical pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />

      <div className="relative">
        <div className="mb-8 flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[linear-gradient(140deg,#1e6bff,#5aa6ff)] shadow-[0_12px_26px_-10px_rgba(30,107,255,0.9)]">
            <MapPin size={21} aria-hidden="true" />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold tracking-[-0.02em]">
              Consulte sua região
            </h3>
            <p className="text-xs text-white/50">Consulta demonstrativa de CEP</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <label
            htmlFor="cep"
            className="mb-2 block text-[11px] font-bold uppercase tracking-[0.16em] text-white/55"
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
              className={`field-input min-w-0 flex-1 px-4 py-3.5 text-sm font-medium ${
                status === 'error' ? '!border-red-400' : ''
              }`}
            />
            <button
              type="submit"
              className="cta-pill !min-h-[3.4rem] shrink-0 bg-white text-ink-900"
              data-variant="light"
              data-size="md"
            >
              Consultar
              <Search size={16} aria-hidden="true" />
            </button>
          </div>

          <div id="cep-feedback" className="mt-4 min-h-[48px]" aria-live="polite">
            {status === 'error' && (
              <p className="flex items-start gap-2 rounded-xl bg-red-500/15 px-4 py-3 text-sm text-red-200">
                <AlertCircle size={17} className="mt-0.5 shrink-0" aria-hidden="true" />
                Digite um CEP válido com 8 números, no formato 00000-000.
              </p>
            )}
            {status === 'checked' && (
              <div className="rounded-2xl bg-white/[0.08] px-4 py-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]">
                <p className="flex items-start gap-2 text-sm font-medium text-white">
                  <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-cyan-signal" aria-hidden="true" />
                  CEP {cep} válido.
                </p>
                <p className="mt-1.5 pl-6 text-xs leading-relaxed text-white/50">
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

        <p className="mt-4 text-[11px] leading-relaxed text-white/35">
          Atendimento comercial confirma endereço, disponibilidade e condições.
        </p>
      </div>
    </div>
  )
}
