import { useEffect, useRef, useState } from 'react'
import { isTouch } from '../lib/env'
import { onPulse, pointer } from '../lib/state'
import { cn } from '../lib/cn'
import { sfx } from '../lib/sound'

type Mode = 'idle' | 'lock' | 'view'
type Ripple = { id: number; x: number; y: number }

export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const [mode, setMode] = useState<Mode>('idle')
  const [label, setLabel] = useState('')
  const [ripples, setRipples] = useState<Ripple[]>([])

  useEffect(() => {
    return onPulse((p) => {
      setRipples((r) => [...r.slice(-5), { id: p.id, x: p.cx, y: p.cy }])
      window.setTimeout(() => setRipples((r) => r.filter((x) => x.id !== p.id)), 900)
    })
  }, [])

  useEffect(() => {
    if (isTouch) return
    let locked: HTMLElement | null = null
    let current: Mode = 'idle'
    const r = { x: window.innerWidth / 2, y: window.innerHeight / 2, w: 38, h: 38 }

    const over = (e: PointerEvent) => {
      const t = (e.target as HTMLElement).closest<HTMLElement>('[data-cursor], a, button, [role="button"], label')
      if (t === locked) return
      locked = t
      if (!t) {
        current = 'idle'
        setLabel('')
      } else if (t.dataset.cursor === 'view') {
        current = 'view'
        setLabel(t.dataset.cursorLabel || 'VIEW')
      } else {
        current = 'lock'
        setLabel(t.dataset.cursorLabel || 'TARGET LOCKED')
      }
      if (t) sfx.hover()
      setMode(current)
    }

    let raf = 0
    const loop = () => {
      raf = requestAnimationFrame(loop)
      if (dot.current) dot.current.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0)`
      let tx = pointer.x
      let ty = pointer.y
      let tw = 38
      let th = 38
      if (current === 'lock' && locked?.isConnected) {
        const b = locked.getBoundingClientRect()
        tx = b.left + b.width / 2
        ty = b.top + b.height / 2
        tw = b.width + 16
        th = b.height + 16
      } else if (current === 'view') {
        tw = th = 92
      }
      r.x += (tx - r.x) * 0.2
      r.y += (ty - r.y) * 0.2
      r.w += (tw - r.w) * 0.2
      r.h += (th - r.h) * 0.2
      const el = ring.current
      if (el) {
        el.style.transform = `translate3d(${r.x - r.w / 2}px, ${r.y - r.h / 2}px, 0)`
        el.style.width = `${r.w}px`
        el.style.height = `${r.h}px`
      }
    }
    loop()
    window.addEventListener('pointerover', over)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointerover', over)
    }
  }, [])

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[100]">
      {ripples.map((p) => (
        <span
          key={p.id}
          className="absolute block rounded-full border-2 border-signal"
          style={{
            left: p.x,
            top: p.y,
            width: 20,
            height: 20,
            boxShadow: '0 0 30px #FF1E1E, inset 0 0 20px #FF1E1E',
            animation: 'ripple 0.85s cubic-bezier(0.2,0.8,0.2,1) forwards',
          }}
        />
      ))}
      <style>{`@keyframes ripple{from{transform:translate(-50%,-50%) scale(.2);opacity:1}to{transform:translate(-50%,-50%) scale(9);opacity:0}}`}</style>

      {!isTouch && (
        <>
          <div ref={ring} className="absolute left-0 top-0" style={{ width: 38, height: 38 }}>
            <div
              className={cn(
                'relative h-full w-full transition-[border-radius,background,border-color] duration-300',
                mode === 'idle' && 'rounded-full border border-white/40',
                mode === 'lock' && 'rounded-none border border-transparent',
                mode === 'view' && 'rounded-full border border-signal bg-signal/90',
              )}
            >
              {mode !== 'view' && (
                <>
                  <span className="bracket tl" />
                  <span className="bracket tr" />
                  <span className="bracket bl" />
                  <span className="bracket br" />
                </>
              )}
              {mode === 'view' && (
                <span className="absolute inset-0 flex items-center justify-center font-display text-[11px] font-bold tracking-[0.2em] text-black">
                  {label}
                </span>
              )}
              {mode === 'lock' && (
                <span className="absolute -top-6 left-0 whitespace-nowrap font-mono text-[9px] tracking-[0.25em] text-signal">
                  ◉ {label}
                </span>
              )}
            </div>
          </div>
          <div ref={dot} className="absolute left-0 top-0">
            <svg width="26" height="26" viewBox="0 0 26 26" className="-translate-x-1/2 -translate-y-1/2" style={{ filter: 'drop-shadow(0 0 4px #FF1E1E)' }}>
              <path d="M13 0v9M13 17v9M0 13h9M17 13h9" stroke="#FF1E1E" strokeWidth="1.5" />
              <circle cx="13" cy="13" r="1.8" fill="#FFFFFF" />
            </svg>
          </div>
        </>
      )}
    </div>
  )
}
