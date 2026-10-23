import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { gsap } from '../lib/gsap'
import { reducedMotion } from '../lib/env'
import { useUI } from '../lib/state'
import { sfx } from '../lib/sound'

const LINES = [
  { at: 0, text: 'INITIALIZING SYSTEM...' },
  { at: 14, text: 'MOUNTING KERNEL MODULES ........... OK' },
  { at: 32, text: 'LOADING NEURAL CORE...' },
  { at: 52, text: 'CALIBRATING OPTICAL SENSORS ....... OK' },
  { at: 70, text: 'SYNCING MERN STACK DRIVERS ........ OK' },
  { at: 88, text: 'COMPILING KUNAL.EXE ............... OK' },
  { at: 100, text: 'NEURAL CORE 100% — BOOT COMPLETE' },
]

type Phase = 'boot' | 'glitch' | 'shutter' | 'done'

export default function Preloader() {
  const sceneReady = useUI((s) => s.sceneReady)
  const setBooted = useUI((s) => s.setBooted)
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState<Phase>('boot')
  const obj = useRef({ v: 0 })

  useEffect(() => {
    const t = gsap.to(obj.current, {
      v: 90,
      duration: reducedMotion ? 0.3 : 2.6,
      ease: 'power2.inOut',
      onUpdate: () => setProgress(Math.round(obj.current.v)),
    })
    return () => {
      t.kill()
    }
  }, [])

  const reached = progress >= 90
  useEffect(() => {
    if (!sceneReady || !reached) return
    const t = gsap.to(obj.current, {
      v: 100,
      duration: 0.5,
      ease: 'power1.out',
      onUpdate: () => setProgress(Math.round(obj.current.v)),
      onComplete: () => {
        window.setTimeout(() => setPhase('glitch'), reducedMotion ? 0 : 350)
      },
    })
    return () => {
      t.kill()
    }
  }, [sceneReady, reached])

  // If WebGL never reports ready (blocked/unsupported), still finish booting.
  useEffect(() => {
    const id = window.setTimeout(() => useUI.getState().setSceneReady(true), 7000)
    return () => window.clearTimeout(id)
  }, [])

  useEffect(() => {
    if (phase === 'glitch') {
      const id = window.setTimeout(() => setPhase('shutter'), reducedMotion ? 0 : 450)
      return () => window.clearTimeout(id)
    }
    if (phase === 'shutter') {
      sfx.boot()
      setBooted(true)
      const id = window.setTimeout(() => setPhase('done'), reducedMotion ? 0 : 1000)
      return () => window.clearTimeout(id)
    }
  }, [phase, setBooted])

  if (phase === 'done') return null

  return (
    <div role="status" aria-live="polite" aria-label={`Loading ${progress}%`} className="fixed inset-0 z-[90]">
      <AnimatePresence>
        {phase !== 'shutter' && (
          <motion.div
            key="boot"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 flex items-center justify-center bg-black"
            style={phase === 'glitch' ? { animation: 'shake .08s infinite' } : undefined}
          >
            <div className="absolute inset-0 opacity-40" style={{ background: 'repeating-linear-gradient(0deg, rgba(255,30,30,.08) 0 1px, transparent 1px 3px)' }} />
            <div className="container-x relative grid max-w-5xl gap-10 md:grid-cols-[1fr_auto] md:items-center">
              <div className="font-mono text-[11px] leading-6 text-ash md:text-xs">
                <p className="mb-4 text-signal">KP-OS v2.6.0 // BIOS CHECK</p>
                {LINES.filter((l) => progress >= l.at).map((l) => (
                  <p key={l.text}>
                    <span className="text-signal">&gt;</span> {l.text}
                  </p>
                ))}
                <p className="caret text-signal">█</p>
              </div>

              <div className="flex flex-col items-center gap-6">
                <svg viewBox="0 0 140 100" className="h-28 w-40 md:h-36 md:w-48" aria-hidden style={{ filter: 'drop-shadow(0 0 10px #FF1E1E)' }}>
                  {[
                    'M14 10 V90',
                    'M14 50 L54 10',
                    'M14 50 L54 90',
                    'M76 90 V10 H104 Q126 10 126 32 Q126 54 104 54 H76',
                  ].map((d, i) => (
                    <motion.path
                      key={d}
                      d={d}
                      fill="none"
                      stroke={i === 3 ? '#FF1E1E' : '#FFFFFF'}
                      strokeWidth="6"
                      strokeLinecap="square"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: reducedMotion ? 0 : 0.9, delay: reducedMotion ? 0 : 0.2 + i * 0.35, ease: 'easeInOut' }}
                    />
                  ))}
                </svg>
                <div className="w-64">
                  <div className="mb-2 flex justify-between font-mono text-[10px] tracking-[0.3em] text-ash">
                    <span>LOADING</span>
                    <span className="text-white">{String(progress).padStart(3, '0')}%</span>
                  </div>
                  <div className="h-1 w-full bg-white/10">
                    <div className="h-full bg-signal transition-[width] duration-150" style={{ width: `${progress}%`, boxShadow: '0 0 14px #FF1E1E' }} />
                  </div>
                </div>
              </div>
            </div>
            {phase === 'glitch' && <div className="absolute inset-0 bg-signal mix-blend-screen" style={{ animation: 'blink .09s steps(1) infinite' }} />}
          </motion.div>
        )}
      </AnimatePresence>

      {phase === 'shutter' && (
        <>
          <motion.div
            className="absolute inset-x-0 top-0 h-1/2 border-b-2 border-signal bg-black"
            initial={{ y: 0 }}
            animate={{ y: '-100%' }}
            transition={{ duration: 0.9, ease: [0.8, 0, 0.2, 1] }}
            style={{ boxShadow: '0 4px 40px #FF1E1E' }}
          />
          <motion.div
            className="absolute inset-x-0 bottom-0 h-1/2 border-t-2 border-signal bg-black"
            initial={{ y: 0 }}
            animate={{ y: '100%' }}
            transition={{ duration: 0.9, ease: [0.8, 0, 0.2, 1] }}
            style={{ boxShadow: '0 -4px 40px #FF1E1E' }}
          />
        </>
      )}
    </div>
  )
}
