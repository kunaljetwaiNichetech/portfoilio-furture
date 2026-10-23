import { useEffect, useRef, type ReactNode } from 'react'
import { gsap } from '../lib/gsap'
import { isTouch, reducedMotion } from '../lib/env'
import { cn } from '../lib/cn'

export default function Magnetic({ children, strength = 0.35, className }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || isTouch || reducedMotion) return
    const xTo = gsap.quickTo(el, 'x', { duration: 0.8, ease: 'elastic.out(1, 0.35)' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.8, ease: 'elastic.out(1, 0.35)' })
    const move = (e: PointerEvent) => {
      const b = el.getBoundingClientRect()
      xTo((e.clientX - (b.left + b.width / 2)) * strength)
      yTo((e.clientY - (b.top + b.height / 2)) * strength)
    }
    const leave = () => {
      xTo(0)
      yTo(0)
    }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    return () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
    }
  }, [strength])

  return (
    <div ref={ref} className={cn('inline-block will-change-transform', className)}>
      {children}
    </div>
  )
}
