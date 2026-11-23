import { useCallback, useEffect, useRef, useState } from 'react'
import { Menu, Smartphone, UserRound, X } from 'lucide-react'
import { siteConfig } from '../data/site'
import { BrandLogo } from './BrandLogo'
import { Container } from './Container'
import { CtaLink } from './CtaLink'
import { MobileMenu } from './MobileMenu'

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuTriggerRef = useRef<HTMLButtonElement>(null)
  const closeMenu = useCallback(() => setMenuOpen(false), [])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled || menuOpen
            ? 'glass-panel-strong border-b border-cyan-signal/10'
            : 'border-b border-transparent bg-transparent'
        }`}
      >
        <Container className="flex h-[76px] items-center justify-between gap-6">
          <BrandLogo />

          <nav
            aria-label="Navegação principal"
            className="glass-panel hidden rounded-full p-1.5 lg:block"
          >
            <ul className="flex items-center gap-0.5">
              {siteConfig.navigation.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="block rounded-full px-3.5 py-2.5 text-[13px] font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={siteConfig.playStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instalar o aplicativo MEGA+ na Google Play"
              title="Instalar o aplicativo MEGA+"
              className="glass-panel inline-flex h-11 items-center gap-2 rounded-full px-3 text-white transition-colors hover:bg-white/15 sm:px-4"
            >
              <Smartphone size={17} className="text-cyan-signal" aria-hidden="true" />
              <span className="hidden text-xs font-semibold xl:inline">Baixar app</span>
            </a>
            <CtaLink
              href="#cliente"
              size="sm"
              variant="outline-light"
              className="hidden sm:inline-flex"
            >
              Área do cliente
              <UserRound size={16} aria-hidden="true" />
            </CtaLink>
            <button
              ref={menuTriggerRef}
              type="button"
              onClick={() => setMenuOpen((value) => !value)}
              aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              className="glass-panel grid h-11 w-11 place-items-center rounded-full text-white transition-colors hover:bg-white/15 lg:hidden"
            >
              {menuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
            </button>
          </div>
        </Container>
      </header>

      <MobileMenu open={menuOpen} onClose={closeMenu} triggerRef={menuTriggerRef} />
    </>
  )
}
