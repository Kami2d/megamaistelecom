import { useState } from 'react'
import { Plus } from 'lucide-react'
import { faqItems } from '../data/faq'

export function FaqAccordion() {
  const [openId, setOpenId] = useState<string | null>(faqItems[0].id)

  return (
    <div className="border-y border-line">
      {faqItems.map((item) => {
        const open = openId === item.id
        return (
          <div key={item.id} className="border-b border-line last:border-b-0">
            <h3>
              <button
                id={`faq-button-${item.id}`}
                type="button"
                aria-expanded={open}
                aria-controls={`faq-panel-${item.id}`}
                onClick={() => setOpenId(open ? null : item.id)}
                className="flex w-full items-center justify-between gap-6 py-6 text-left transition-colors hover:text-blue-brand"
              >
                <span className="font-display text-[17px] font-semibold tracking-[-0.03em] text-ink-950">
                  {item.question}
                </span>
                <span
                  className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border transition-all duration-300 ${
                    open
                      ? 'rotate-45 border-blue-brand bg-blue-brand text-white'
                      : 'border-line text-blue-brand'
                  }`}
                  aria-hidden="true"
                >
                  <Plus size={16} />
                </span>
              </button>
            </h3>
            <div
              id={`faq-panel-${item.id}`}
              role="region"
              aria-labelledby={`faq-button-${item.id}`}
              className="faq-panel"
              data-open={open}
            >
              <div>
                <p className="max-w-2xl pb-6 pr-10 text-sm leading-relaxed text-ink-500">
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
