import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useUI } from '../lib/state'
import { sfx } from '../lib/sound'
import { reducedMotion } from '../lib/env'
import { RobotIcon } from './Icons'

const SECTION_LINES: Record<string, string> = {
  home: "HELLO, HUMAN. I'M KP-01. MOVE YOUR CURSOR — I'M WATCHING.",
  about: 'ACCESSING DEVELOPER DOSSIER... 2.5+ YEARS OF FIELD DATA FOUND.',
  skills: '26 MODULES ONLINE. GRAB THE NEURAL CORE AND SPIN IT.',
  experience: 'REPLAYING MISSION LOG. PERFORMANCE: +35% VELOCITY.',
  projects: '5 DEPLOYMENTS DETECTED. CLICK ANY FILE TO DECRYPT.',
  education: 'TRAINING DATA VERIFIED. HOVER TO DECRYPT EACH DATASET.',
  contact: 'CHANNEL OPEN. MY ARM IS REACHING — SAY HELLO.',
}

/** Robot "comms" HUD: types contextual lines on section change, hovers and events. */
export default function RobotComms() {
  const booted = useUI((s) => s.booted)
  const section = useUI((s) => s.section)
  const rage = useUI((s) => s.rage)
  const idle = useUI((s) => s.idle)
  const comms = useUI((s) => s.comms)
  const say = useUI((s) => s.say)
  const [shown, setShown] = useState('')
  const [minimized, setMinimized] = useState(false)
  const [dim, setDim] = useState(false)
  const wasIdle = useRef(false)

  useEffect(() => {
    if (booted) say(SECTION_LINES[section] ?? '')
  }, [booted, section, say])

  useEffect(() => {
    if (rage) say('⚠ RAGE PROTOCOL ENGAGED. STAND BACK, HUMAN.')
  }, [rage, say])

  useEffect(() => {
    if (idle) say('NO INPUT DETECTED... ENTERING STANDBY. ZZZ')
    else if (wasIdle.current) say('MOTION DETECTED. RESUMING SURVEILLANCE.')
    wasIdle.current = idle
  }, [idle, say])

  useEffect(() => {
    if (reducedMotion) {
      setShown(comms.text)
      return
    }
    let i = 0
    setShown('')
    setDim(false)
    const dimTimer = window.setTimeout(() => setDim(true), 6500)
    const id = window.setInterval(() => {
      i++
      setShown(comms.text.slice(0, i))
      if (i % 2 === 0 && !minimized) sfx.type()
      if (i >= comms.text.length) window.clearInterval(id)
    }, 22)
    return () => {
      window.clearInterval(id)
      window.clearTimeout(dimTimer)
    }
  }, [comms.id])

  return (
    <AnimatePresence>
      {booted && comms.text && (
        <motion.aside
          aria-live="polite"
          aria-label="Robot assistant messages"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="fixed bottom-6 left-6 z-[72] hidden w-80 md:block"
          data-no-sfx
        >
          <div className={`glass relative border-signal/30 transition-opacity duration-700 hover:opacity-100 ${dim ? 'opacity-35' : 'opacity-100'}`}>
          <span className="bracket tl" />
          <span className="bracket br" />
          <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
            <div className="flex items-center gap-2 font-mono text-[9px] tracking-[0.3em] text-ash">
              <RobotIcon className={`h-5 w-5 ${idle ? 'opacity-40' : ''}`} />
              KP-01 // COMMS
              <span className={`h-1.5 w-1.5 rounded-full ${idle ? 'bg-ash' : 'animate-pulse bg-signal'}`} />
            </div>
            <button
              onClick={() => setMinimized((m) => !m)}
              className="font-mono text-[10px] text-ash hover:text-signal"
              aria-label={minimized ? 'Expand robot messages' : 'Minimize robot messages'}
              aria-expanded={!minimized}
            >
              {minimized ? '[+]' : '[–]'}
            </button>
          </div>
          {!minimized && (
            <p className="min-h-[3.5rem] px-3 py-3 font-mono text-[11px] leading-5 text-white/90">
              <span className="text-signal">&gt; </span>
              {shown}
              <span className="caret text-signal">▌</span>
            </p>
          )}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
