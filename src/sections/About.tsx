import { useLayoutEffect, useRef } from 'react'
import { highlightWords, profile, stats } from '../data/resume'
import { gsap } from '../lib/gsap'
import { reducedMotion } from '../lib/env'
import SectionHeading from '../components/SectionHeading'
import TiltCard from '../components/TiltCard'
import Counter from '../components/Counter'

export default function About() {
  const textRef = useRef<HTMLParagraphElement>(null)
  const words = profile.summary.split(' ')

  useLayoutEffect(() => {
    if (reducedMotion || !textRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.about-word',
        { opacity: 0.1, y: 10, filter: 'blur(4px)' },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          stagger: 0.04,
          ease: 'none',
          scrollTrigger: { trigger: textRef.current, start: 'top 80%', end: 'bottom 55%', scrub: 0.6 },
        },
      )
    }, textRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="about" className="section" aria-label="About">
      <div className="container-x">
        <SectionHeading index="01" kicker="USER PROFILE" title="Developer Dossier" />

        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <p ref={textRef} className="font-tech text-2xl font-semibold leading-snug text-white md:text-4xl">
            {words.map((w, i) => (
              <span key={i} className={`about-word inline-block ${highlightWords.includes(w) ? 'text-signal' : ''}`}>
                {w}&nbsp;
              </span>
            ))}
          </p>

          <TiltCard className="glass self-start p-7">
            <p className="hud-label mb-6">// IDENTITY RECORD</p>
            <dl className="space-y-4 font-mono text-xs">
              {[
                ['NAME', profile.name],
                ['CLASS', 'MERN STACK DEVELOPER'],
                ['LOCATION', profile.location],
                ['EXPERIENCE', '2.5+ YEARS'],
                ['STATUS', 'OPEN TO OPPORTUNITIES'],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 border-b border-white/10 pb-3">
                  <dt className="text-ash">{k}</dt>
                  <dd className="text-right text-white">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-6 flex items-center gap-3 font-mono text-[10px] tracking-[0.25em] text-signal">
              <span className="h-2 w-2 animate-pulse rounded-full bg-signal" /> CLEARANCE LEVEL: FULL STACK
            </div>
          </TiltCard>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-4 md:mt-24 lg:grid-cols-4">
          {stats.map((s, i) => (
            <TiltCard key={s.label} className="glass group p-6 md:p-8">
              <p className="hud-label mb-4">STAT_0{i + 1}</p>
              <Counter value={s.value} className="red-glow-text block font-display text-4xl font-black text-white md:text-6xl" />
              <p className="mt-3 font-tech text-sm font-semibold uppercase tracking-widest text-ash md:text-base">{s.label}</p>
              <div className="mt-5 h-px w-full bg-white/10">
                <div className="h-px w-1/3 bg-signal transition-all duration-700 group-hover:w-full" />
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  )
}
