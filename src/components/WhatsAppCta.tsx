import type { ComponentProps } from 'react'
import { isWhatsAppConfigured, whatsappUrl } from '../lib/whatsapp'
import { CtaLink } from './CtaLink'

type WhatsAppCtaProps = Omit<ComponentProps<typeof CtaLink>, 'href'> & {
  message?: string
  unavailableLabel?: string
}

/**
 * WhatsApp CTA that degrades to a disabled button while the phone number is
 * still the demonstrative one. No wa.me link is rendered in that case.
 */
export function WhatsAppCta({
  message,
  children,
  unavailableLabel = 'Em breve',
  ...props
}: WhatsAppCtaProps) {
  if (!isWhatsAppConfigured) {
    return (
      <CtaLink
        {...props}
        disabled
        title="Atendimento pelo WhatsApp em breve"
        aria-label="Atendimento pelo WhatsApp em breve"
      >
        {unavailableLabel}
      </CtaLink>
    )
  }

  return (
    <CtaLink
      {...props}
      href={whatsappUrl(message)}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </CtaLink>
  )
}
