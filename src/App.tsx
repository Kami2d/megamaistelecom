import { useEffect, useState } from 'react'
import { FloatingWhatsApp } from './components/FloatingWhatsApp'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { StatusPage } from './pages/StatusPage'
import { About } from './sections/About'
import { Benefits } from './sections/Benefits'
import { Combos } from './sections/Combos'
import { ConversionBanner } from './sections/ConversionBanner'
import { Coverage } from './sections/Coverage'
import { Faq } from './sections/Faq'
import { Hero } from './sections/Hero'
import { Plans } from './sections/Plans'
import { SpeedTest } from './sections/SpeedTest'

type Route = 'home' | 'status'

export default function App() {
  const [route, setRoute] = useState<Route>(() =>
    window.location.hash === '#status' ? 'status' : 'home',
  )

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(window.location.hash === '#status' ? 'status' : 'home')
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  useEffect(() => {
    if (route === 'status') {
      window.scrollTo({ top: 0, behavior: 'auto' })
      return
    }
    const hash = window.location.hash.slice(1)
    if (!hash || hash === 'status') return
    window.requestAnimationFrame(() => {
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' })
    })
  }, [route])

  return (
    <>
      <a
        href="#inicio"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-ink-950"
      >
        Pular para o conteúdo
      </a>
      <Header />
      <main>
        {route === 'status' ? (
          <div className="pt-[76px]">
            <StatusPage />
          </div>
        ) : (
          <>
            <Hero />
            <Benefits />
            <Plans />
            <Combos />
            <Coverage />
            <SpeedTest />
            <About />
            <ConversionBanner />
            <Faq />
          </>
        )}
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  )
}
