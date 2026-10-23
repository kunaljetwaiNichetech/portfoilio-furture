import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { blockText } from '../lib/blockFont'
import { reducedMotion } from '../lib/env'
import { cn } from '../lib/cn'

const NOISE = '▓▒░█'
const CHAR_W = 0.6

/** Block-letter ASCII title with red drop shadow, auto-fit to its container, decoding in on view and hover. */
export default function AsciiTitle({ text, maxFont = 14, className }: { text: string; maxFont?: number; className?: string }) {
  const art = useMemo(() => blockText(text), [text])
  const wrap = useRef<HTMLDivElement>(null)
  const raf = useRef(0)
  const [font, setFont] = useState(8)
  const [reveal, setReveal] = useState(reducedMotion ? art.cols + 6 : -1)
  const [seed, setSeed] = useState(0)

  useEffect(() => {
    const el = wrap.current
    if (!el) return
    const ro = new ResizeObserver(() => setFont(Math.min(maxFont, el.clientWidth / (art.cols * CHAR_W))))
    ro.observe(el)
    return () => ro.disconnect()
  }, [art.cols, maxFont])

  const decode = useCallback(() => {
    if (reducedMotion) return
    cancelAnimationFrame(raf.current)
    const start = performance.now()
    const total = art.cols + 6
    const step = (now: number) => {
      const v = ((now - start) / 700) * total
      setReveal(v)
      setSeed((s) => s + 1)
      if (v < total) raf.current = requestAnimationFrame(step)
    }
    raf.current = requestAnimationFrame(step)
  }, [art.cols])

  useEffect(() => {
    const el = wrap.current
    if (!el || reducedMotion) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          decode()
          io.disconnect()
        }
      },
      { threshold: 0.5 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf.current)
    }
  }, [decode])

  const render = (src: string) =>
    src
      .split('\n')
      .map((line) =>
        line
          .split('')
          .map((ch, c) => {
            if (c < reveal - 5) return ch
            if (c < reveal && ch !== ' ') return NOISE[(c * 7 + seed) % NOISE.length]
            return ' '
          })
          .join(''),
      )
      .join('\n')

  return (
    <div ref={wrap} role="img" aria-label={text} className={cn('relative w-full select-none', className)} onMouseEnter={decode}>
      <pre aria-hidden className="pointer-events-none absolute left-0 top-0 m-0 font-mono leading-[1.02] text-signal opacity-60" style={{ fontSize: font }}>
        {render(art.shadow)}
      </pre>
      <pre
        aria-hidden
        className="relative m-0 font-mono leading-[1.02] text-white"
        style={{ fontSize: font, textShadow: '0 0 10px rgba(255,30,30,0.55)' }}
      >
        {render(art.main)}
      </pre>
    </div>
  )
}
