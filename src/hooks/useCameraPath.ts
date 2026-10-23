import { useEffect } from 'react'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { reducedMotion } from '../lib/env'
import { camState, useUI } from '../lib/state'
import { POSES, resolvePose } from '../three/poses'

/** Scroll-driven camera path: each section tweens the 3D camera and robot head into its pose. */
export function useCameraPath(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return
    const triggers = Object.entries(POSES).map(([id, pose]) => {
      const el = document.getElementById(id)
      if (!el) return null
      return ScrollTrigger.create({
        trigger: el,
        start: 'top 55%',
        end: 'bottom 45%',
        onToggle: (self) => {
          if (!self.isActive) return
          useUI.getState().setSection(id)
          gsap.to(camState, {
            ...resolvePose(pose),
            duration: reducedMotion ? 0 : 1.8,
            ease: 'power3.inOut',
            overwrite: 'auto',
          })
        },
      })
    })
    const refresh = () => ScrollTrigger.refresh()
    refresh()
    document.fonts?.ready.then(refresh)
    window.addEventListener('load', refresh)
    return () => {
      triggers.forEach((t) => t?.kill())
      window.removeEventListener('load', refresh)
    }
  }, [enabled])
}
