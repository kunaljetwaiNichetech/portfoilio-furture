import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { projects } from '../data/resume'
import { projectIcons } from '../data/ascii'
import AsciiTitle from './AsciiTitle'
import { useUI } from '../lib/state'
import { sfx } from '../lib/sound'
import ProjectThumb from './ProjectThumb'
import { Brackets } from './TiltCard'
import { ArrowIcon } from './Icons'

export default function ProjectModal() {
  const index = useUI((s) => s.activeProject)
  const setActive = useUI((s) => s.setActiveProject)
  const p = index !== null ? projects[index] : null
  const closeBtn = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!p) return
    sfx.open()
    window.setTimeout(() => closeBtn.current?.focus(), 100)
  }, [p])

  return (
    <AnimatePresence>
      {p && (
        <motion.div
          key={p.id}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md md:p-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setActive(null)}
        >
          <motion.article
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-title"
            onClick={(e) => e.stopPropagation()}
            initial={{ clipPath: 'inset(50% 0 50% 0)', x: 0 }}
            animate={{ clipPath: 'inset(0% 0 0% 0)', x: [0, -14, 10, -6, 3, 0] }}
            exit={{ clipPath: 'inset(50% 0 50% 0)' }}
            transition={{ duration: 0.6, ease: [0.7, 0, 0.2, 1] }}
            className="glass relative max-h-[90vh] w-full max-w-5xl overflow-y-auto border-signal/40"
            data-lenis-prevent
          >
            <Brackets />
            <div className="grid gap-8 p-6 md:grid-cols-[1.1fr_1fr] md:p-10">
              <div>
                <ProjectThumb variant={p.variant} code={p.code} />
                <div className="mt-4 flex flex-wrap gap-2">
                  {p.stack.map((s) => (
                    <span key={s} className="chip">{s}</span>
                  ))}
                </div>
                <pre aria-hidden className="ascii-icon mt-6 font-mono text-[10px] leading-[1.2] text-signal/90">
                  {projectIcons[p.variant].replace(/^\n/, '')}
                </pre>
              </div>
              <div className="flex flex-col">
                <div className="flex items-start justify-between gap-4">
                  <p className="font-mono text-[11px] tracking-[0.3em] text-signal">{p.code} // DEPLOYMENT FILE</p>
                  <button
                    ref={closeBtn}
                    onClick={() => setActive(null)}
                    className="font-mono text-[11px] tracking-[0.2em] text-ash hover:text-signal"
                    aria-label="Close project"
                  >
                    [ESC] CLOSE
                  </button>
                </div>
                <AsciiTitle text={p.asciiName} maxFont={11} className="mt-6" />
                <h3 id="project-title" data-text={p.title} className="glitch mt-4 font-display text-2xl font-black uppercase leading-tight text-white md:text-3xl">
                  {p.title}
                </h3>
                <p className="mt-2 font-tech text-lg font-semibold uppercase tracking-widest text-ash">{p.subtitle}</p>
                <p className="mt-6 text-sm leading-7 text-white/80">{p.summary}</p>
                <ul className="mt-6 space-y-3">
                  {p.points.map((pt) => (
                    <li key={pt} className="flex gap-3 text-sm leading-6 text-ash">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-signal" />
                      {pt}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-8">
                  {p.href ? (
                    <a href={p.href} target="_blank" rel="noreferrer" className="btn-primary">
                      LAUNCH {p.linkLabel} <ArrowIcon className="h-4 w-4" />
                    </a>
                  ) : (
                    <span className="btn-ghost">{p.linkLabel} — PRIVATE BUILD</span>
                  )}
                </div>
              </div>
            </div>
          </motion.article>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
