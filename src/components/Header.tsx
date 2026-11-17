import { useEffect, useState } from 'react'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { siteConfig } from '../data/site'
import { BrandLogo } from './BrandLogo'
import { Container } from './Container'
import { CtaLink } from './CtaLink'
import { MobileMenu } from './MobileMenu'

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${
          scrolled || menuOpen
            ? 'border-white/10 bg-ink-950/95 shadow-[0_10px_40px_-24px_rgba(0,0,0,0.9)] backdrop-blur-md'
            : 'border-transparent bg-transparent'
        }`}
      >
        <Container className="flex h-[76px] items-center justify-between gap-6">
          <BrandLogo />

          <nav aria-label="Navegação principal" className="hidden xl:block">
            <ul className="flex items-center gap-6">
              {siteConfig.navigation.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="group relative py-2 text-[13px] font-medium text-white/70 transition-colors hover:text-white"
                  >
                    {item.label}
                    <span className="absolute bottom-0 left-0 h-px w-0 bg-cyan-signal transition-all duration-300 group-hover:w-full" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <CtaLink
              href={siteConfig.customerPortalUrl}
              variant="outline-light"
              size="sm"
              className="hidden sm:inline-flex"
            >
              Área do Cliente
              <ArrowUpRight size={15} aria-hidden="true" />
            </CtaLink>
            <button
              type="button"
              onClick={() => setMenuOpen((value) => !value)}
              aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              className="grid h-11 w-11 place-items-center rounded-xl border border-white/20 text-white transition-colors hover:bg-white/10 xl:hidden"
            >
              {menuOpen ? (
                <X size={21} aria-hidden="true" />
              ) : (
                <Menu size={21} aria-hidden="true" />
              )}
            </button>
          </div>
        </Container>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}
