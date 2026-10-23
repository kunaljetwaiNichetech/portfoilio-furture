import { useEffect, useRef } from 'react'
import { cn } from '../lib/cn'
import { reducedMotion } from '../lib/env'
import { scrollState, useUI } from '../lib/state'

/** Infinite tech strip whose speed, direction and skew react to scroll velocity. */
export default function Marquee({ items, reverse = false }: { items: string[]; reverse?: boolean }) {
  const wrap = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const row = [...items, ...items]

  useEffect(() => {
    if (reducedMotion || !wrap.current) return
    let visible = false
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
    io.observe(wrap.current)

    const base = reverse ? 1 : -1
    let dir = base
    let x = 0
    let skew = 0
    let raf = 0
    const loop = () => {
      raf = requestAnimationFrame(loop)
      const el = track.current
      if (!visible || !el) return
      const v = scrollState.velocity
      if (Math.abs(v) > 0.5) dir = base * Math.sign(v)
      const speed = (useUI.getState().rage ? 7 : 0.7) + Math.min(Math.abs(v) * 0.5, 22)
      x += speed * dir
      const half = el.scrollWidth / 2
      if (x <= -half) x += half
      if (x > 0) x -= half
      skew += (Math.max(-10, Math.min(10, v * 0.35)) - skew) * 0.1
      el.style.transform = `translate3d(${x}px,0,0) skewX(${-skew}deg)`
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
    }
  }, [reverse])

  return (
    <div
      ref={wrap}
      aria-hidden
      className={cn(
        'relative z-10 overflow-hidden border-y border-signal/30 bg-black/80 py-4 backdrop-blur-sm',
        reverse ? '-rotate-1' : 'rotate-1',
      )}
    >
      <div ref={track} className="flex w-max gap-10 whitespace-nowrap will-change-transform">
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-10 font-display text-xl font-bold tracking-[0.2em] md:text-3xl">
            <span className={i % 3 === 0 ? 'stroke-text' : 'text-white'}>{t}</span>
            <span className="text-signal">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}
