import { lazy, Suspense, useEffect } from 'react'
import { useUI } from './lib/state'
import { initSmoothScroll, lockScroll } from './lib/scroll'
import { isTouch } from './lib/env'
import { useGlobalInput } from './hooks/useGlobalInput'
import { useCameraPath } from './hooks/useCameraPath'

import Preloader from './components/Preloader'
import Cursor from './components/Cursor'
import CodeRain from './components/CodeRain'
import BlueprintReveal from './components/BlueprintReveal'
import FxOverlay from './components/FxOverlay'
import SvgFilters from './components/SvgFilters'
import Navbar from './components/Navbar'
import ScrollProgress from './components/ScrollProgress'
import Marquee from './components/Marquee'
import Terminal from './components/Terminal'
import RageBanner from './components/RageBanner'
import ProjectModal from './components/ProjectModal'
import RobotComms from './components/RobotComms'
import SectionRail from './components/SectionRail'
import CursorTrail from './components/CursorTrail'
import { sfx } from './lib/sound'

import Hero from './sections/Hero'
import About from './sections/About'
import Skills from './sections/Skills'
import Experience from './sections/Experience'
import Projects from './sections/Projects'
import Education from './sections/Education'
import Contact from './sections/Contact'
import Footer from './sections/Footer'
import { marqueeA, marqueeB } from './data/resume'

const Scene = lazy(() => import('./three/Scene'))

export default function App() {
  const booted = useUI((s) => s.booted)
  const rage = useUI((s) => s.rage)
  const overlayOpen = useUI((s) => s.terminal || s.activeProject !== null || s.menuOpen)

  useGlobalInput()
  useCameraPath(booted)

  useEffect(() => initSmoothScroll(), [])

  useEffect(() => {
    if (!isTouch) document.documentElement.classList.add('has-cursor')
  }, [])

  useEffect(() => {
    lockScroll(!booted || overlayOpen)
  }, [booted, overlayOpen])

  useEffect(() => {
    document.documentElement.classList.toggle('rage', rage)
    if (!rage) return
    sfx.rage()
    const id = window.setTimeout(() => useUI.getState().setRage(false), 9000)
    return () => window.clearTimeout(id)
  }, [rage])

  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>

      <div className="rage-shake fixed inset-0 z-0" aria-hidden>
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </div>
      <CodeRain />
      <BlueprintReveal />
      <SvgFilters />

      <ScrollProgress />
      <Navbar />
      <SectionRail />
      <RobotComms />

      <main id="main" className="relative z-10">
        <Hero />
        <Marquee items={marqueeA} />
        <About />
        <Skills />
        <Marquee items={marqueeB} reverse />
        <Experience />
        <Projects />
        <Education />
        <Marquee items={marqueeA} />
        <Contact />
      </main>
      <Footer />

      <FxOverlay />
      <ProjectModal />
      <Terminal />
      <RageBanner />
      <Preloader />
      <CursorTrail />
      <Cursor />
    </>
  )
}
