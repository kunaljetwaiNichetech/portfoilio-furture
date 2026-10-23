import { useState } from 'react'
import { motion } from 'framer-motion'
import { education } from '../data/resume'
import { cn } from '../lib/cn'
import SectionHeading from '../components/SectionHeading'
import { Brackets } from '../components/TiltCard'

function FlipCard({ e, i }: { e: (typeof education)[number]; i: number }) {
  const [flipped, setFlipped] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, y: 60, rotateX: -25 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.9, delay: i * 0.12, ease: [0.2, 0.8, 0.2, 1] }}
      className="group h-80 [perspective:1200px]"
    >
      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        aria-pressed={flipped}
        aria-label={`${e.full}, ${e.institute}. Toggle details`}
        data-cursor-label="DECRYPT"
        className={cn(
          'relative h-full w-full text-left transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]',
          flipped && '[transform:rotateY(180deg)]',
        )}
      >
        <div className="glass absolute inset-0 flex flex-col p-7 [backface-visibility:hidden]">
          <Brackets />
          <p className="hud-label">{e.code}</p>
          <p className="mt-auto font-display text-5xl font-black uppercase text-white">{e.title}</p>
          <p className="mt-3 font-tech text-lg font-semibold uppercase tracking-wider text-ash">{e.institute}</p>
          <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 font-mono text-[11px] tracking-[0.2em]">
            <span className="text-white">{e.period}</span>
            <span className="text-signal">{e.status}</span>
          </div>
        </div>
        <div
          className="absolute inset-0 flex flex-col border border-signal/60 bg-black p-7 [backface-visibility:hidden] [transform:rotateY(180deg)]"
          style={{ boxShadow: 'inset 0 0 60px rgba(255,30,30,.25)' }}
        >
          <Brackets />
          <p className="hud-label text-signal">DECRYPTED // {e.code}</p>
          <p className="mt-6 font-display text-xl font-bold uppercase leading-snug text-white">{e.full}</p>
          <p className="mt-4 text-sm leading-6 text-ash">{e.detail}</p>
          <div className="mt-auto space-y-1 font-mono text-[11px] text-white/80">
            <p>INSTITUTE: {e.institute}</p>
            <p>TIMELINE: {e.period}</p>
            <p>RESULT: <span className="text-signal">{e.status}</span></p>
          </div>
        </div>
      </button>
    </motion.div>
  )
}

export default function Education() {
  return (
    <section id="education" className="section" aria-label="Education">
      <div className="container-x">
        <SectionHeading index="05" kicker="TRAINING DATA" title="Training Datasets" sub="Hover or tap a card to decrypt." />
        <div className="grid gap-6 md:grid-cols-3">
          {education.map((e, i) => (
            <FlipCard key={e.code} e={e} i={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
