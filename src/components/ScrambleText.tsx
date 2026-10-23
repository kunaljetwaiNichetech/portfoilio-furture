import { useCallback, useEffect, useRef, useState, type ElementType } from 'react'
import { reducedMotion } from '../lib/env'
import { cn } from '../lib/cn'

const GLYPHS = '!<>-_\\/[]{}=+*^?#01XΣΔ§'
const rand = () => GLYPHS[(Math.random() * GLYPHS.length) | 0]

type CharState = { c: string; s: 0 | 1 | 2 } // 0 hidden, 1 scrambling, 2 resolved

type Props = {
  text: string
  as?: ElementType
  className?: string
  charClassName?: string
  /** 'mount' reveals letter-by-letter when `ready` turns true, 'view' when scrolled into view. */
  reveal?: 'mount' | 'view' | false
  ready?: boolean
  delay?: number
  hover?: boolean
}

export default function ScrambleText({
  text,
  as,
  className,
  charClassName,
  reveal = false,
  ready = true,
  delay = 0,
  hover = true,
}: Props) {
  const Tag = (as ?? 'span') as ElementType
  const ref = useRef<HTMLElement>(null)
  const raf = useRef(0)
  const [chars, setChars] = useState<CharState[]>(() =>
    text.split('').map((c) => ({ c, s: reveal && !reducedMotion ? 0 : 2 })),
  )

  const run = useCallback(
    (mode: 'reveal' | 'scramble') => {
      if (reducedMotion) {
        setChars(text.split('').map((c) => ({ c, s: 2 })))
        return
      }
      cancelAnimationFrame(raf.current)
      const start = performance.now()
      const step = (now: number) => {
        const f = (now - start) / 30
        let done = true
        const next = text.split('').map((ch, i): CharState => {
          if (ch === ' ') return { c: ' ', s: 2 }
          const appear = mode === 'reveal' ? i * 1.4 : 0
          const resolve = appear + (mode === 'reveal' ? 7 : 3 + i * 0.6)
          if (f >= resolve) return { c: ch, s: 2 }
          done = false
          if (f < appear) return { c: ch, s: 0 }
          return { c: rand(), s: 1 }
        })
        setChars(next)
        if (!done) raf.current = requestAnimationFrame(step)
      }
      raf.current = requestAnimationFrame(step)
    },
    [text],
  )

  useEffect(() => {
    if (reveal !== 'mount' || !ready) return
    const id = window.setTimeout(() => run('reveal'), delay)
    return () => window.clearTimeout(id)
  }, [reveal, ready, delay, run])

  useEffect(() => {
    if (reveal !== 'view' || !ref.current) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          window.setTimeout(() => run('reveal'), delay)
          io.disconnect()
        }
      },
      { threshold: 0.4 },
    )
    io.observe(ref.current)
    return () => io.disconnect()
  }, [reveal, delay, run])

  useEffect(() => () => cancelAnimationFrame(raf.current), [])

  return (
    <Tag
      ref={ref}
      aria-label={text}
      className={cn('inline-block', className)}
      onMouseEnter={hover ? () => run('scramble') : undefined}
    >
      {chars.map((ch, i) => (
        <span
          key={i}
          aria-hidden
          className={cn('scramble-char inline-block whitespace-pre', ch.s === 1 && 'hot', charClassName)}
          style={{ opacity: ch.s === 0 ? 0 : 1 }}
        >
          {ch.c}
        </span>
      ))}
    </Tag>
  )
}
