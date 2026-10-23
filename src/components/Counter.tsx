import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'

export default function Counter({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const m = value.match(/^([\d.]+)(.*)$/)
  const num = m ? parseFloat(m[1]) : 0
  const suffix = m ? m[2] : ''
  const decimals = m ? (m[1].split('.')[1] ?? '').length : 0

  useEffect(() => {
    const el = ref.current
    if (!el || !m) return
    const obj = { v: 0 }
    el.textContent = (0).toFixed(decimals) + suffix
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return
        io.disconnect()
        gsap.to(obj, {
          v: num,
          duration: 2.2,
          ease: 'power3.out',
          onUpdate: () => {
            el.textContent = obj.v.toFixed(decimals) + suffix
          },
        })
      },
      { threshold: 0.6 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [value])

  return (
    <span ref={ref} className={className} aria-label={value}>
      {value}
    </span>
  )
}
