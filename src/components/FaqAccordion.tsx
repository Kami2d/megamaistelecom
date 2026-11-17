import { useState } from 'react'
import { Plus } from 'lucide-react'
import { faqItems } from '../data/faq'

export function FaqAccordion() {
  const [openId, setOpenId] = useState<string | null>(faqItems[0].id)

  return (
    <div className="space-y-3">
      {faqItems.map((item) => {
        const open = openId === item.id
        return (
          <div key={item.id} className="faq-row" data-open={open}>
            <h3>
              <button
                id={`faq-button-${item.id}`}
                type="button"
                aria-expanded={open}
                aria-controls={`faq-panel-${item.id}`}
                onClick={() => setOpenId(open ? null : item.id)}
                className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left sm:px-7"
              >
                <span className="font-display text-[17px] font-bold tracking-[-0.02em] text-ink-950">
                  {item.question}
                </span>
                <span
                  className={`grid h-10 w-10 shrink-0 place-items-center rounded-full transition-all duration-500 ${
                    open
                      ? 'rotate-45 bg-[linear-gradient(100deg,#ff5a10,#ffa13d)] text-white shadow-[0_10px_20px_-8px_rgba(255,106,26,0.8)]'
                      : 'bg-mist-2 text-blue-brand'
                  }`}
                  aria-hidden="true"
                >
                  <Plus size={17} />
                </span>
              </button>
            </h3>
            <div
              id={`faq-panel-${item.id}`}
              role="region"
              aria-labelledby={`faq-button-${item.id}`}
              aria-hidden={!open}
              className="faq-panel"
              data-open={open}
            >
              <div>
                <p className="max-w-2xl px-6 pb-6 pr-16 text-sm leading-relaxed text-ink-500 sm:px-7">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
