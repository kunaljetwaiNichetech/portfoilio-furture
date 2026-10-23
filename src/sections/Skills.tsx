import { lazy, Suspense, useRef } from 'react'
import { useInView } from 'framer-motion'
import { skillGroups } from '../data/resume'
import SectionHeading from '../components/SectionHeading'
import TiltCard from '../components/TiltCard'

const SkillSphere = lazy(() => import('../three/SkillSphere'))
const allSkills = skillGroups.flatMap((g) => g.skills.map((s) => s.name))

function Ring({ value, on }: { value: number; on: boolean }) {
  const r = 26
  const c = 2 * Math.PI * r
  return (
    <svg viewBox="0 0 64 64" className="h-16 w-16 -rotate-90" aria-hidden>
      <circle cx="32" cy="32" r={r} stroke="rgba(255,255,255,.1)" strokeWidth="4" fill="none" />
      <circle
        cx="32"
        cy="32"
        r={r}
        stroke="#FF1E1E"
        strokeWidth="4"
        fill="none"
        strokeDasharray={c}
        strokeDashoffset={on ? c * (1 - value / 100) : c}
        style={{ transition: 'stroke-dashoffset 1.6s cubic-bezier(.2,.8,.2,1)', filter: 'drop-shadow(0 0 4px #FF1E1E)' }}
      />
    </svg>
  )
}

function Panel({ group }: { group: (typeof skillGroups)[number] }) {
  const ref = useRef<HTMLDivElement>(null)
  const on = useInView(ref, { once: true, margin: '-15% 0px' })
  const avg = Math.round(group.skills.reduce((a, s) => a + s.level, 0) / group.skills.length)

  return (
    <TiltCard className="glass p-6" max={6}>
      <div ref={ref} className="mb-6 flex items-center justify-between">
        <div>
          <p className="hud-label">{group.code} // LOADED</p>
          <h3 className="mt-2 font-display text-xl font-bold uppercase text-white">{group.title}</h3>
        </div>
        <div className="relative">
          <Ring value={avg} on={on} />
          <span className="absolute inset-0 grid place-items-center font-mono text-xs text-white">{avg}%</span>
        </div>
      </div>
      <ul className="space-y-3">
        {group.skills.map((s, i) => (
          <li key={s.name}>
            <div className="mb-1 flex justify-between font-mono text-[11px] uppercase tracking-wider">
              <span className="text-white/90">{s.name}</span>
              <span className="text-ash">{s.level}</span>
            </div>
            <div className="h-[3px] w-full bg-white/10" role="progressbar" aria-label={s.name} aria-valuenow={s.level} aria-valuemin={0} aria-valuemax={100}>
              <div
                className="h-full bg-gradient-to-r from-blood via-signal to-glow"
                style={{
                  width: on ? `${s.level}%` : '0%',
                  transition: `width 1.4s cubic-bezier(.2,.8,.2,1) ${i * 70}ms`,
                  boxShadow: '0 0 8px #FF1E1E',
                }}
              />
            </div>
          </li>
        ))}
      </ul>
    </TiltCard>
  )
}

export default function Skills() {
  const sphereRef = useRef<HTMLDivElement>(null)
  const sphereMounted = useInView(sphereRef, { once: true, margin: '300px 0px' })
  const sphereVisible = useInView(sphereRef, { margin: '100px 0px' })

  return (
    <section id="skills" className="section" aria-label="Skills">
      <div className="container-x">
        <SectionHeading index="02" kicker="SYSTEM MODULES" title="Installed Modules" sub="Drag the core to rotate. Every module below is battle-tested in production." />

        <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr]">
          <div
            ref={sphereRef}
            data-cursor="view"
            data-cursor-label="DRAG"
            className="glass relative aspect-square w-full self-start lg:sticky lg:top-28"
          >
            <span className="bracket tl" />
            <span className="bracket tr" />
            <span className="bracket bl" />
            <span className="bracket br" />
            <p className="hud-label absolute left-5 top-4 z-10">NEURAL SKILL CORE</p>
            <p className="hud-label absolute bottom-4 right-5 z-10">{allSkills.length} MODULES</p>
            <Suspense fallback={<div className="grid h-full place-items-center font-mono text-xs text-ash">LOADING CORE...</div>}>
              {sphereMounted && <SkillSphere skills={allSkills} active={sphereVisible} />}
            </Suspense>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {skillGroups.map((g, i) => (
              <div key={g.id} className={i === 0 ? 'md:col-span-2' : ''}>
                <Panel group={g} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
