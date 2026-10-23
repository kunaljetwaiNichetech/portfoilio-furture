import { useEffect, useRef } from 'react'
import { isTouch, reducedMotion } from '../lib/env'
import { pointer, useUI } from '../lib/state'

const N = 22
type Spark = { x: number; y: number; vx: number; vy: number; life: number }

/** Red ribbon + spark trail following the cursor (2D canvas, desktop only). */
export default function CursorTrail() {
  const ref = useRef<HTMLCanvasElement>(null)
  const disabled = isTouch || reducedMotion

  useEffect(() => {
    if (disabled) return
    const c = ref.current
    const ctx = c?.getContext('2d')
    if (!c || !ctx) return
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2)
      c.width = window.innerWidth * dpr
      c.height = window.innerHeight * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const pts = Array.from({ length: N }, () => ({ x: pointer.x, y: pointer.y }))
    const sparks: Spark[] = []
    let px = pointer.x
    let py = pointer.y
    let raf = 0
    let wasDrawn = false

    const loop = () => {
      raf = requestAnimationFrame(loop)
      const rage = useUI.getState().rage
      pts[0].x = pointer.x
      pts[0].y = pointer.y
      let spread = 0
      for (let i = 1; i < N; i++) {
        pts[i].x += (pts[i - 1].x - pts[i].x) * 0.42
        pts[i].y += (pts[i - 1].y - pts[i].y) * 0.42
        spread += Math.abs(pts[i].x - pts[0].x) + Math.abs(pts[i].y - pts[0].y)
      }

      const speed = Math.hypot(pointer.x - px, pointer.y - py)
      px = pointer.x
      py = pointer.y
      if (speed > 18 && sparks.length < 80) {
        for (let s = 0; s < (rage ? 4 : 2); s++) {
          sparks.push({ x: pointer.x, y: pointer.y, vx: (Math.random() - 0.5) * 4, vy: (Math.random() - 0.5) * 4, life: 1 })
        }
      }

      if (spread < 2 && sparks.length === 0) {
        if (wasDrawn) {
          ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
          wasDrawn = false
        }
        return
      }
      wasDrawn = true
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
      ctx.lineCap = 'round'
      for (let i = 0; i < N - 1; i++) {
        const k = 1 - i / N
        ctx.strokeStyle = rage ? `rgba(255,255,255,${k * 0.9})` : `rgba(255,30,30,${k * 0.75})`
        ctx.lineWidth = k * (rage ? 5 : 3)
        ctx.beginPath()
        ctx.moveTo(pts[i].x, pts[i].y)
        ctx.lineTo(pts[i + 1].x, pts[i + 1].y)
        ctx.stroke()
      }
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i]
        s.x += s.vx
        s.y += s.vy
        s.vy += 0.08
        s.life -= 0.03
        if (s.life <= 0) {
          sparks.splice(i, 1)
          continue
        }
        ctx.fillStyle = i % 3 ? `rgba(255,59,59,${s.life})` : `rgba(255,255,255,${s.life})`
        ctx.fillRect(s.x, s.y, 2, 2)
      }
    }
    loop()
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [disabled])

  if (disabled) return null
  return <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 z-[99] h-full w-full mix-blend-screen" />
}
