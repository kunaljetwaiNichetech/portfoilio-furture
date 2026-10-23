import { useLayoutEffect, useRef } from 'react'
import { projects } from '../data/resume'
import { endOfArchive, projectIcons } from '../data/ascii'
import { gsap } from '../lib/gsap'
import { lowPower } from '../lib/env'
import { useUI } from '../lib/state'
import { scrollToTarget } from '../lib/scroll'
import { cn } from '../lib/cn'
import SectionHeading from '../components/SectionHeading'
import TiltCard from '../components/TiltCard'
import ProjectThumb from '../components/ProjectThumb'
import AsciiTitle from '../components/AsciiTitle'
import { ArrowIcon } from '../components/Icons'

const horizontal = typeof window !== 'undefined' && !lowPower && window.innerWidth >= 1024
const pad = (n: number) => String(n).padStart(2, '0')

function Panel({ index }: { index: number }) {
  const p = projects[index]
  const open = useUI((s) => s.setActiveProject)
  const icon = projectIcons[p.variant].replace(/^\n/, '')

  const thumb = (
    <button
      type="button"
      data-cursor="view"
      onClick={() => open(index)}
      aria-label={`Open ${p.title} details`}
      className="group relative block w-full text-left"
    >
      <ProjectThumb variant={p.variant} code={p.code} />
      <span className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/95 to-transparent p-3 font-mono text-[10px] tracking-[0.25em] text-white opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        CLICK TO DECRYPT FILE <span className="text-signal">▶</span>
      </span>
    </button>
  )

  return (
    <TiltCard
      max={3}
      className="glass border-anim relative grid h-full overflow-hidden lg:grid-cols-[1.08fr_1fr]"
      onMouseEnter={() =>
        useUI.getState().say(`ANALYZING ${p.code}: ${p.asciiName}... ${p.stack.length} TECH SIGNATURES. ${p.href ? 'LIVE LINK AVAILABLE.' : 'PRIVATE BUILD.'}`)
      }
    >
      <span
        aria-hidden
        className="stroke-text pointer-events-none absolute -bottom-10 left-1/2 hidden select-none font-display text-[13rem] font-black leading-none opacity-[0.12] lg:block"
      >
        {pad(index + 1)}
      </span>

      <div className="relative z-10 flex min-w-0 flex-col p-6 md:p-9">
        <div className="flex flex-wrap items-center gap-3 font-mono text-[10px] tracking-[0.3em]">
          <span className="border border-signal/60 bg-signal/10 px-2 py-1 text-signal">{p.code}</span>
          <span className="text-ash">{p.category}</span>
          <span className="ml-auto text-ash">
            <span className="text-white">{pad(index + 1)}</span> / {pad(projects.length)}
          </span>
        </div>

        <div className="mt-6 lg:hidden">{thumb}</div>

        <AsciiTitle text={p.asciiName} maxFont={12} className="mt-7" />
        <h3 className="mt-4 font-display text-lg font-bold uppercase tracking-wide text-white md:text-xl">
          {p.title}
          <span className="mt-1 block font-tech text-base font-semibold tracking-[0.2em] text-ash">{p.subtitle}</span>
        </h3>

        <ul className="mt-5 space-y-3">
          {p.points.map((pt) => (
            <li key={pt} className="flex gap-3 text-sm leading-6 text-white/80">
              <span className="mt-0.5 font-mono text-signal">▸</span>
              {pt}
            </li>
          ))}
        </ul>

        <div className="mt-5 flex flex-wrap gap-2">
          {p.stack.map((s) => (
            <span key={s} className="chip">{s}</span>
          ))}
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-3 pt-7">
          <button type="button" onClick={() => open(index)} className="btn-primary !px-5 !py-3">
            Decrypt File
          </button>
          {p.href ? (
            <a href={p.href} target="_blank" rel="noreferrer" className="btn-ghost !px-5 !py-3">
              {p.linkLabel} <ArrowIcon className="h-3.5 w-3.5" />
            </a>
          ) : (
            <span className="font-mono text-[10px] tracking-[0.25em] text-ash">// {p.linkLabel.toUpperCase()} — PRIVATE BUILD</span>
          )}
        </div>
      </div>

      <div className="relative z-10 hidden flex-col gap-5 border-l border-white/10 bg-black/30 p-6 lg:flex">
        {thumb}
        <div className="flex flex-1 items-end justify-between gap-4">
          <pre aria-hidden className="ascii-icon m-0 font-mono text-[10px] leading-[1.2] text-signal/90">{icon}</pre>
          <dl className="shrink-0 space-y-1 text-right font-mono text-[10px] tracking-[0.2em] text-ash">
            <div>
              <dt className="inline">STATUS </dt>
              <dd className="inline text-white">DEPLOYED</dd>
            </div>
            <div>
              <dt className="inline">MODULES </dt>
              <dd className="inline text-white">{pad(p.stack.length)}</dd>
            </div>
            <div>
              <dt className="inline">ACCESS </dt>
              <dd className="inline text-signal">{p.href ? 'PUBLIC' : 'CLASSIFIED'}</dd>
            </div>
          </dl>
        </div>
      </div>
    </TiltCard>
  )
}

function EndCard() {
  return (
    <button
      type="button"
      onClick={() => scrollToTarget('#contact')}
      className="glass group flex h-full w-full flex-col items-center justify-center gap-6 p-8 text-left"
      aria-label="More builds available on request. Go to contact"
    >
      <pre aria-hidden className="ascii-icon m-0 font-mono text-[11px] leading-[1.25] text-white/80 transition-colors group-hover:text-signal">
        {endOfArchive.replace(/^\n/, '')}
      </pre>
      <span className="font-mono text-[10px] tracking-[0.3em] text-ash group-hover:text-white">CLICK TO OPEN CHANNEL ▶</span>
    </button>
  )
}

export default function Projects() {
  const section = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const bar = useRef<HTMLDivElement>(null)
  const counter = useRef<HTMLSpanElement>(null)

  useLayoutEffect(() => {
    if (!horizontal || !section.current || !track.current) return
    const ctx = gsap.context(() => {
      const el = track.current!
      const dist = () => el.scrollWidth - window.innerWidth
      gsap.to(el, {
        x: () => -dist(),
        ease: 'none',
        scrollTrigger: {
          trigger: section.current,
          start: 'top top',
          end: () => `+=${dist()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            if (bar.current) bar.current.style.transform = `scaleX(${self.progress})`
            if (counter.current) counter.current.textContent = pad(Math.min(projects.length, Math.floor(self.progress * projects.length) + 1))
          },
        },
      })
    }, section)
    return () => ctx.revert()
  }, [])

  return (
    <section
      id="projects"
      ref={section}
      aria-label="Projects"
      className={cn('relative', horizontal ? 'flex h-screen flex-col justify-center overflow-hidden pb-16 pt-20' : 'section')}
    >
      <div className="container-x flex flex-wrap items-end justify-between gap-6">
        <SectionHeading index="04" kicker="MISSIONS / DEPLOYMENTS" title="Deployed Systems" className={horizontal ? '!mb-8' : undefined} />
        {horizontal && (
          <div className="mb-9 w-64 font-mono text-[10px] tracking-[0.3em] text-ash" aria-hidden>
            <div className="mb-2 flex justify-between">
              <span>SCROLL ▸ DEPLOYMENT</span>
              <span>
                <span ref={counter} className="text-signal">01</span> / {pad(projects.length)}
              </span>
            </div>
            <div className="h-[2px] bg-white/10">
              <div ref={bar} className="h-full origin-left scale-x-0 bg-signal" style={{ boxShadow: '0 0 10px #FF1E1E' }} />
            </div>
          </div>
        )}
      </div>

      {horizontal ? (
        <div ref={track} className="flex w-max items-stretch gap-10 pl-[max(4rem,calc((100vw-1400px)/2+4rem))] pr-[12vw]">
          {projects.map((p, i) => (
            <div key={p.id} className="h-[min(66vh,620px)] w-[min(78vw,1080px)] shrink-0">
              <Panel index={i} />
            </div>
          ))}
          <div className="h-[min(66vh,620px)] w-[24rem] shrink-0">
            <EndCard />
          </div>
        </div>
      ) : (
        <div className="container-x grid gap-8">
          {projects.map((p, i) => (
            <Panel key={p.id} index={i} />
          ))}
          <EndCard />
        </div>
      )}
    </section>
  )
}
