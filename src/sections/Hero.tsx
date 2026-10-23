import { motion } from 'framer-motion'
import { profile } from '../data/resume'
import { useUI } from '../lib/state'
import { scrollToTarget } from '../lib/scroll'
import ScrambleText from '../components/ScrambleText'
import Typewriter from '../components/Typewriter'
import Magnetic from '../components/Magnetic'
import HudCorners from '../components/HudCorners'
import ScanLaser from '../components/ScanLaser'
import { ArrowIcon, DownloadIcon } from '../components/Icons'

export default function Hero() {
  const booted = useUI((s) => s.booted)
  const fade = (delay: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: booted ? { opacity: 1, y: 0 } : {},
    transition: { duration: 0.8, delay, ease: [0.2, 0.8, 0.2, 1] as const },
  })

  return (
    <section id="home" aria-label="Introduction" className="rage-shake relative flex min-h-[100svh] items-center overflow-hidden">
      <ScanLaser start={booted} />
      <HudCorners />

      <div className="container-x relative z-10 pb-16 pt-32 md:pb-32 md:pt-44">
        <motion.p {...fade(0.1)} className="mb-6 flex items-center gap-3 font-mono text-[11px] tracking-[0.35em] text-signal">
          <span className="h-px w-10 bg-signal" /> SYS.ID 0x4B50 // PORTFOLIO v2.6
        </motion.p>

        <h1 aria-label={profile.name} className="font-display font-black uppercase leading-[0.88] tracking-tight">
          {profile.nameParts.map((part, i) => (
            <span key={part} className="block">
              <ScrambleText
                text={part}
                reveal="mount"
                ready={booted}
                delay={250 + i * 320}
                className={
                  i === 2
                    ? 'stroke-text text-[clamp(2.8rem,9.5vw,9.5rem)]'
                    : 'text-[clamp(2.8rem,9.5vw,9.5rem)] text-white'
                }
              />
            </span>
          ))}
        </h1>

        <motion.div {...fade(1.3)} className="mt-8 flex items-center gap-4 font-tech text-xl font-bold tracking-[0.2em] text-white md:text-3xl">
          <span className="text-signal">&gt;</span>
          <Typewriter words={profile.roles} start={booted} />
        </motion.div>

        <motion.p {...fade(1.5)} className="mt-5 max-w-md text-sm leading-7 text-ash md:text-base">
          {profile.tagline}. Based in {profile.location}.
        </motion.p>

        <motion.div {...fade(1.7)} className="mt-10 flex flex-wrap gap-4">
          <Magnetic>
            <button onClick={() => scrollToTarget('#projects')} className="btn-primary">
              View Work <ArrowIcon className="h-4 w-4" />
            </button>
          </Magnetic>
          <Magnetic>
            <a href={profile.resumeUrl} download className="btn-ghost">
              Download Resume <DownloadIcon className="h-4 w-4" />
            </a>
          </Magnetic>
        </motion.div>
      </div>

      <motion.button
        {...fade(2)}
        onClick={() => scrollToTarget('#about')}
        aria-label="Scroll to profile"
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 font-mono text-[9px] tracking-[0.4em] text-ash"
      >
        SCROLL
        <span className="relative h-10 w-px overflow-hidden bg-white/20">
          <motion.span
            className="absolute left-0 top-0 h-4 w-px bg-signal"
            animate={{ y: [-16, 40] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          />
        </span>
      </motion.button>
    </section>
  )
}
