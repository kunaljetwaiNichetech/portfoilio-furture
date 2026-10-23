import Lenis from 'lenis'
import { gsap, ScrollTrigger } from './gsap'
import { reducedMotion } from './env'
import { scrollState } from './state'

let lenis: Lenis | null = null

export function initSmoothScroll() {
  const onNative = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight
    scrollState.progress = max > 0 ? window.scrollY / max : 0
  }

  if (reducedMotion) {
    window.addEventListener('scroll', onNative, { passive: true })
    return () => window.removeEventListener('scroll', onNative)
  }

  lenis = new Lenis({ duration: 1.15, smoothWheel: true, wheelMultiplier: 0.9, touchMultiplier: 1.2 })
  lenis.on('scroll', (l: Lenis) => {
    scrollState.progress = l.progress
    scrollState.velocity = l.velocity
    ScrollTrigger.update()
  })
  const raf = (time: number) => lenis?.raf(time * 1000)
  gsap.ticker.add(raf)
  gsap.ticker.lagSmoothing(0)

  return () => {
    gsap.ticker.remove(raf)
    lenis?.destroy()
    lenis = null
  }
}

export function scrollToTarget(target: string | number) {
  if (lenis) {
    lenis.scrollTo(target, { duration: 1.6 })
    return
  }
  const behavior: ScrollBehavior = reducedMotion ? 'auto' : 'smooth'
  if (typeof target === 'number') window.scrollTo({ top: target, behavior })
  else document.querySelector(target)?.scrollIntoView({ behavior })
}

export function lockScroll(locked: boolean) {
  if (lenis) {
    if (locked) lenis.stop()
    else lenis.start()
  }
  document.documentElement.style.overflow = locked ? 'hidden' : ''
}
