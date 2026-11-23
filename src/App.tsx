import { useEffect, useState } from 'react'
import { FloatingWhatsApp } from './components/FloatingWhatsApp'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { PlanSelectionProvider } from './context/PlanSelectionContext'
import { siteConfig } from './data/site'
import { CustomerPortalPage } from './pages/CustomerPortalPage'
import { StatusPage } from './pages/StatusPage'
import { About } from './sections/About'
import { AppPromo } from './sections/AppPromo'
import { ConversionBanner } from './sections/ConversionBanner'
import { Coverage } from './sections/Coverage'
import { Faq } from './sections/Faq'
import { Hero } from './sections/Hero'
import { Objections } from './sections/Objections'
import { Plans } from './sections/Plans'
import { Simulator } from './sections/Simulator'
import { Steps } from './sections/Steps'

type Route = 'home' | 'status' | 'cliente'

const homeHashes = new Set<string>(
  siteConfig.navigation.filter((item) => item.href !== '#status').map((item) => item.href),
)

function routeFromHash(hash: string, current: Route): Route {
  if (hash.startsWith('#status')) return 'status'
  if (hash.startsWith('#cliente')) return 'cliente'
  if (!hash || hash === '#inicio' || homeHashes.has(hash)) return 'home'
  return current
}

export default function App() {
  const [route, setRoute] = useState<Route>(() => routeFromHash(window.location.hash, 'home'))
  const [hash, setHash] = useState(() => window.location.hash)

  useEffect(() => {
    const handleHashChange = () => {
      const nextHash = window.location.hash
      setHash(nextHash)
      setRoute((current) => routeFromHash(nextHash, current))
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  useEffect(() => {
    if (route === 'status' || route === 'cliente') {
      window.scrollTo({ top: 0, behavior: 'auto' })
      return
    }
    const target = hash.slice(1)
    if (!target || target === 'inicio') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    const frame = window.requestAnimationFrame(() => {
      document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' })
    })
    return () => window.cancelAnimationFrame(frame)
  }, [route, hash])

  return (
    <PlanSelectionProvider>
      <a
        href="#inicio"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-ink-950"
      >
        Pular para o conteúdo
      </a>
      <Header />
      <main>
        {route === 'status' ? (
          <div id="inicio" tabIndex={-1} className="bg-ink-950 pt-[76px] outline-none">
            <StatusPage />
          </div>
        ) : route === 'cliente' ? (
          <div id="inicio" tabIndex={-1} className="bg-ink-950 pt-[76px] outline-none">
            <CustomerPortalPage />
          </div>
        ) : (
          <>
            <Hero />
            <Plans />
            <Simulator />
            <AppPromo />
            <Objections />
            <Steps />
            <Coverage />
            <About />
            <Faq />
            <ConversionBanner />
          </>
        )}
      </main>
      <Footer />
      <FloatingWhatsApp />
    </PlanSelectionProvider>
  )
}
