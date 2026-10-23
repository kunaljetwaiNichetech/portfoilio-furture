import { useLayoutEffect, useRef } from 'react'
import { experience, projects } from '../data/resume'
import { gsap } from '../lib/gsap'
import { reducedMotion } from '../lib/env'
import SectionHeading from '../components/SectionHeading'
import TiltCard from '../components/TiltCard'
import { RobotIcon } from '../components/Icons'

export default function Experience() {
  const wrap = useRef<HTMLDivElement>(null)
  const job = experience[0]
  const nodes = [
    ...job.highlights.map((h) => ({ tag: 'ACHIEVEMENT', text: h })),
    { tag: 'DEPLOYMENTS', text: `Shipped ${projects.map((p) => p.title).join(', ')}.` },
  ]

  useLayoutEffect(() => {
    if (!wrap.current) return
    const ctx = gsap.context(() => {
      if (reducedMotion) {
        gsap.set('.tl-fill', { scaleY: 1 })
        gsap.set('.tl-bot', { top: '100%' })
        return
      }
      gsap
        .timeline({ scrollTrigger: { trigger: '.tl-track', start: 'top 70%', end: 'bottom 60%', scrub: 0.8 } })
        .fromTo('.tl-fill', { scaleY: 0 }, { scaleY: 1, ease: 'none' }, 0)
        .fromTo('.tl-bot', { top: '0%' }, { top: '100%', ease: 'none' }, 0)

      gsap.utils.toArray<HTMLElement>('.tl-node').forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          x: 60,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 82%' },
        })
      })
    }, wrap)
    return () => ctx.revert()
  }, [])

  return (
    <section id="experience" className="section" aria-label="Experience">
      <div ref={wrap} className="container-x">
        <SectionHeading index="03" kicker="MISSION LOG" title="Field Operations" />

        <div className="tl-track relative pl-12 md:pl-20">
          <div aria-hidden className="absolute bottom-0 left-4 top-0 w-px bg-white/10 md:left-8">
            <div className="tl-fill absolute inset-0 origin-top bg-signal" style={{ boxShadow: '0 0 12px #FF1E1E, 0 0 24px #FF1E1E' }} />
            <div className="tl-bot absolute left-1/2 h-9 w-9 -translate-x-1/2 -translate-y-1/2">
              <RobotIcon className="h-full w-full drop-shadow-[0_0_8px_#FF1E1E]" />
            </div>
          </div>

          <TiltCard className="glass border-anim mb-10 p-7 md:p-10" max={4}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="hud-label">MISSION_01 // {job.current ? 'ACTIVE' : 'COMPLETE'}</p>
                <h3 className="mt-3 font-display text-2xl font-black uppercase text-white md:text-4xl">{job.company}</h3>
                <p className="mt-2 font-tech text-lg font-semibold uppercase tracking-widest text-signal">{job.role}</p>
              </div>
              <div className="text-right font-mono text-xs text-ash">
                <p className="text-white">{job.period}</p>
                <p className="mt-1">{job.location}</p>
                {job.current && (
                  <p className="mt-3 inline-flex items-center gap-2 border border-signal/50 px-2 py-1 text-[10px] tracking-[0.2em] text-signal">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-signal" /> IN PROGRESS
                  </p>
                )}
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {job.stack.map((s) => (
                <span key={s} className="chip">{s}</span>
              ))}
            </div>
          </TiltCard>

          <ol className="space-y-6">
            {nodes.map((n, i) => (
              <li key={n.text} className="tl-node relative">
                <span aria-hidden className="absolute -left-[2.35rem] top-6 h-3 w-3 rotate-45 border border-signal bg-black md:-left-[3.35rem]" />
                <div className="glass p-6">
                  <p className="hud-label mb-2">
                    LOG_{String(i + 1).padStart(2, '0')} // {n.tag}
                  </p>
                  <p className="text-sm leading-7 text-white/85 md:text-base">{n.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
