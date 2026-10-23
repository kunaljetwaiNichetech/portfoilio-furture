import { useEffect, useState } from 'react'
import { profile } from '../data/resume'
import { pointer, useUI } from '../lib/state'

export default function HudCorners() {
  const rage = useUI((s) => s.rage)
  const idle = useUI((s) => s.idle)
  const [fps, setFps] = useState(60)
  const [coords, setCoords] = useState({ x: 0, y: 0 })
  const [uptime, setUptime] = useState(0)

  useEffect(() => {
    let frames = 0
    let last = performance.now()
    let raf = 0
    const tick = (now: number) => {
      frames++
      if (now - last >= 500) {
        setFps(Math.round((frames * 1000) / (now - last)))
        frames = 0
        last = now
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    const id = window.setInterval(() => {
      setCoords({ x: Math.round(pointer.x), y: Math.round(pointer.y) })
      setUptime((u) => u + 1)
    }, 1000 / 8)
    return () => {
      cancelAnimationFrame(raf)
      window.clearInterval(id)
    }
  }, [])

  const secs = Math.floor(uptime / 8)
  const time = `${String(Math.floor(secs / 60)).padStart(2, '0')}:${String(secs % 60).padStart(2, '0')}`
  const box = 'absolute font-mono text-[10px] leading-5 tracking-[0.2em] text-ash'

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-10 hidden sm:block">
      <div className={`${box} left-6 top-24 md:left-10`}>
        <p className="text-white">
          <span className="mr-2 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-signal" />
          SYSTEM {rage ? <span className="text-signal">OVERDRIVE</span> : idle ? 'STANDBY' : 'ONLINE'}
        </p>
        <p>FPS ...... <span className="text-signal">{fps}</span></p>
        <p>UPTIME ... {time}</p>
      </div>
      <div className={`${box} right-6 top-24 text-right md:right-10`}>
        <p className="text-white">{profile.locationShort}</p>
        <p>LAT {profile.coords.lat.toFixed(4)}° N</p>
        <p>LNG {profile.coords.lng.toFixed(4)}° E</p>
        <p className="mt-2">CURSOR X:{String(coords.x).padStart(4, '0')} Y:{String(coords.y).padStart(4, '0')}</p>
        <p>TARGET <span className="text-signal">{idle ? 'LOST' : 'ACQUIRED'}</span></p>
      </div>
      <div className={`${box} bottom-8 right-6 text-right md:right-10`}>
        <p>NEURAL CORE ▮▮▮▮▮▮▮▯</p>
        <p>PRESS <span className="text-signal">[R]</span> // ↑↑↓↓←→←→BA</p>
      </div>
      {['left-4 top-20 border-l border-t', 'right-4 top-20 border-r border-t', 'bottom-4 right-4 border-b border-r'].map((c) => (
        <span key={c} className={`absolute h-10 w-10 border-signal/70 ${c}`} />
      ))}
    </div>
  )
}
