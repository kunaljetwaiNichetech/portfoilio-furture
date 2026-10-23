import { useEffect, useRef } from 'react'
import { reducedMotion, lowPower } from '../lib/env'
import { useUI } from '../lib/state'

const CHARS = '01010110100101{}<>/=;$#*01'

/** Red binary rain on a transparent 2D canvas; trails fade via destination-out so the 3D scene shows through. */
export default function CodeRain() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (reducedMotion) return
    const c = ref.current
    const ctx = c?.getContext('2d')
    if (!c || !ctx) return
    const size = lowPower ? 18 : 16
    let w = 0
    let h = 0
    let drops: number[] = []

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 1.5)
      w = window.innerWidth
      h = window.innerHeight
      c.width = w * dpr
      c.height = h * dpr
      c.style.width = `${w}px`
      c.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const cols = Math.ceil(w / size)
      drops = Array.from({ length: cols }, () => Math.random() * -60)
    }
    resize()
    window.addEventListener('resize', resize)

    let raf = 0
    let last = 0
    const draw = (t: number) => {
      raf = requestAnimationFrame(draw)
      const rage = useUI.getState().rage
      if (t - last < (rage ? 22 : 60)) return
      last = t
      ctx.globalCompositeOperation = 'destination-out'
      ctx.fillStyle = 'rgba(0,0,0,0.14)'
      ctx.fillRect(0, 0, w, h)
      ctx.globalCompositeOperation = 'source-over'
      ctx.font = `${size - 3}px "JetBrains Mono", monospace`
      for (let i = 0; i < drops.length; i++) {
        if (!rage && i % 2 === 1) continue
        const y = drops[i] * size
        ctx.fillStyle = Math.random() > 0.97 ? '#FFFFFF' : '#FF1E1E'
        ctx.fillText(CHARS[(Math.random() * CHARS.length) | 0], i * size, y)
        if (y > h && Math.random() > 0.975) drops[i] = 0
        drops[i]++
      }
    }
    raf = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  if (reducedMotion) return null
  return <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 z-[1] opacity-[0.16]" />
}
