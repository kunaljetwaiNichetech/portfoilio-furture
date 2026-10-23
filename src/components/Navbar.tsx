import { useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { navLinks, profile } from '../data/resume'
import { scrollToTarget } from '../lib/scroll'
import { useUI } from '../lib/state'
import { cn } from '../lib/cn'
import Magnetic from './Magnetic'
import ScrambleText from './ScrambleText'
import SoundToggle from './SoundToggle'

export default function Navbar() {
  const { scrollY } = useScroll()
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const open = useUI((s) => s.menuOpen)
  const setOpen = useUI((s) => s.setMenuOpen)

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setHidden(y > prev && y > 160)
    setScrolled(y > 40)
  })

  const go = (id: string) => {
    setOpen(false)
    window.setTimeout(() => scrollToTarget(`#${id}`), open ? 350 : 0)
  }

  return (
    <>
      <motion.header
        animate={{ y: hidden && !open ? '-110%' : '0%' }}
        transition={{ duration: 0.45, ease: [0.7, 0, 0.2, 1] }}
        className={cn(
          'fixed inset-x-0 top-0 z-[75] transition-colors duration-500',
          scrolled ? 'border-b border-white/5 bg-black/55 backdrop-blur-xl' : 'bg-transparent',
        )}
      >
        <nav aria-label="Primary" className="container-x flex h-16 items-center justify-between md:h-20">
          <button onClick={() => scrollToTarget(0)} aria-label="Back to top" className="group flex items-center gap-3">
            <span className="relative grid h-9 w-9 place-items-center border border-signal font-display text-sm font-black text-white shadow-red">
              {profile.initials}
            </span>
            <span className="hidden font-mono text-[11px] tracking-[0.3em] text-ash sm:block">
              {profile.handle}
              <span className="caret ml-1 text-signal">_</span>
            </span>
          </button>

          <ul className="hidden items-center gap-1 lg:flex">
            {navLinks.map((l, i) => (
              <li key={l.id}>
                <Magnetic strength={0.4}>
                  <button
                    onClick={() => go(l.id)}
                    className="group relative px-4 py-2 font-mono text-[11px] uppercase tracking-[0.25em] text-ash transition-colors hover:text-white"
                  >
                    <span className="mr-1 text-signal">0{i + 1}.</span>
                    <ScrambleText text={l.label} />
                    <span className="absolute inset-x-4 -bottom-0.5 h-px origin-left scale-x-0 bg-signal transition-transform duration-300 group-hover:scale-x-100" />
                  </button>
                </Magnetic>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-2 font-mono text-[10px] tracking-[0.25em] text-ash md:flex">
              <span className="h-2 w-2 animate-pulse rounded-full bg-signal shadow-[0_0_10px_#FF1E1E]" />
              ONLINE
            </span>
            <SoundToggle />
            <button
              onClick={() => setOpen(!open)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              className="relative flex h-10 w-10 flex-col items-center justify-center gap-1.5 border border-white/20 lg:hidden"
            >
              <span className={cn('h-px w-5 bg-white transition-transform', open && 'translate-y-[3.5px] rotate-45 bg-signal')} />
              <span className={cn('h-px w-5 bg-white transition-transform', open && '-translate-y-[3.5px] -rotate-45 bg-signal')} />
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)', x: [0, -10, 8, -4, 0] }}
            exit={{ clipPath: 'inset(100% 0 0 0)' }}
            transition={{ duration: 0.55, ease: [0.7, 0, 0.2, 1] }}
            className="fixed inset-0 z-[74] flex flex-col justify-center bg-black/95 backdrop-blur-xl lg:hidden"
          >
            <div className="absolute inset-0 opacity-30" style={{ background: 'repeating-linear-gradient(0deg, rgba(255,30,30,.15) 0 1px, transparent 1px 4px)' }} />
            <ul className="container-x relative space-y-4">
              {navLinks.map((l, i) => (
                <motion.li
                  key={l.id}
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.06 }}
                >
                  <button onClick={() => go(l.id)} className="flex items-baseline gap-4 text-left">
                    <span className="font-mono text-xs text-signal">0{i + 1}</span>
                    <ScrambleText text={l.label.toUpperCase()} reveal="mount" delay={200 + i * 80} className="glitch font-display text-4xl font-black text-white" />
                  </button>
                </motion.li>
              ))}
            </ul>
            <p className="container-x relative mt-12 font-mono text-[11px] tracking-[0.25em] text-ash">
              {profile.email} // {profile.locationShort}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
