import { useEffect, useRef, type HTMLAttributes } from 'react'
import { gsap } from '../lib/gsap'
import { isTouch, reducedMotion } from '../lib/env'
import { cn } from '../lib/cn'

export function Brackets() {
  return (
    <>
      <span aria-hidden className="bracket tl" />
      <span aria-hidden className="bracket tr" />
      <span aria-hidden className="bracket bl" />
      <span aria-hidden className="bracket br" />
    </>
  )
}

type Props = HTMLAttributes<HTMLDivElement> & { max?: number; brackets?: boolean }

export default function TiltCard({ children, className, max = 9, brackets = true, ...rest }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || isTouch || reducedMotion) return
    gsap.set(el, { transformPerspective: 900 })
    const rx = gsap.quickTo(el, 'rotationX', { duration: 0.5, ease: 'power3.out' })
    const ry = gsap.quickTo(el, 'rotationY', { duration: 0.5, ease: 'power3.out' })
    const move = (e: PointerEvent) => {
      const b = el.getBoundingClientRect()
      const px = (e.clientX - b.left) / b.width
      const py = (e.clientY - b.top) / b.height
      ry((px - 0.5) * max * 2)
      rx(-(py - 0.5) * max * 2)
      el.style.setProperty('--gx', `${px * 100}%`)
      el.style.setProperty('--gy', `${py * 100}%`)
    }
    const leave = () => {
      rx(0)
      ry(0)
    }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    return () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
    }
  }, [max])

  return (
    <div ref={ref} className={cn('tilt-card relative', className)} {...rest}>
      {brackets && <Brackets />}
      <div aria-hidden className="tilt-glare" />
      {children}
    </div>
  )
}
