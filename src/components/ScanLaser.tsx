import { useEffect, useState } from 'react'
import { reducedMotion } from '../lib/env'
import { profile } from '../data/resume'

/** Sweeping red laser + HUD readout that "scans" the developer after boot. */
export default function ScanLaser({ start }: { start: boolean }) {
  const [pct, setPct] = useState(0)

  useEffect(() => {
    if (!start) return
    let v = 0
    const id = window.setInterval(() => {
      v = Math.min(100, v + 3 + Math.random() * 6)
      setPct(Math.round(v))
      if (v >= 100) window.clearInterval(id)
    }, reducedMotion ? 10 : 70)
    return () => window.clearInterval(id)
  }, [start])

  const done = pct >= 100

  return (
    <>
      {!reducedMotion && (
        <div aria-hidden className="pointer-events-none absolute inset-0 z-[5] overflow-hidden">
          <div className="scan-beam" />
        </div>
      )}
      <div
        role="status"
        className="absolute left-1/2 top-[5.5rem] z-10 -translate-x-1/2 whitespace-nowrap border border-signal/40 bg-black/70 px-4 py-1.5 font-mono text-[10px] tracking-[0.3em] backdrop-blur md:top-24"
      >
        {done ? (
          <span className="text-white">
            <span className="text-signal">■</span> {profile.handle} LOADED
          </span>
        ) : (
          <span className="text-ash">
            SCANNING DEVELOPER... <span className="text-signal">{pct}%</span>
          </span>
        )}
      </div>
    </>
  )
}
