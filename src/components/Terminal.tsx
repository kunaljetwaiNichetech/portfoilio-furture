import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { education, experience, profile, projects, skillGroups } from '../data/resume'
import { useUI } from '../lib/state'
import { scrollToTarget } from '../lib/scroll'
import { sfx } from '../lib/sound'
import { blockText } from '../lib/blockFont'
import { cn } from '../lib/cn'

type Line = { kind: 'in' | 'out' | 'sys'; text: string }

const art = (text: string, kind: Line['kind'] = 'sys'): Line[] => blockText(text, '█', ' ').main.split('\n').map((t) => ({ kind, text: t }))

const BANNER: Line[] = [
  ...art('KUNAL.EXE'),
  { kind: 'sys', text: '>>> KONAMI OVERRIDE ACCEPTED. ROOT SHELL GRANTED.' },
  { kind: 'sys', text: "Type 'help' to list commands." },
]

function run(cmd: string): Line[] | 'clear' | 'exit' {
  const [name, ...args] = cmd.trim().toLowerCase().split(/\s+/)
  const out = (...t: string[]): Line[] => t.map((text) => ({ kind: 'out', text }))
  switch (name) {
    case '':
      return []
    case 'help':
      return out(
        'about        — who is this developer',
        'skills       — installed system modules',
        'experience   — mission log',
        'projects     — deployments',
        'education    — training data',
        'contact      — establish connection',
        'goto <id>    — jump to a section (about, skills, projects, contact...)',
        'ascii <text> — render text as block-letter ASCII art',
        'rage         — toggle ROBOT RAGE MODE',
        'clear / exit',
      )
    case 'about':
    case 'whoami':
      return out(`${profile.name} — ${profile.roles[0]}`, profile.summary, `LOCATION: ${profile.location}`)
    case 'skills':
      return skillGroups.flatMap((g) => out(`[${g.code}] ${g.title.toUpperCase()}`, '  ' + g.skills.map((s) => s.name).join(' · ')))
    case 'experience':
      return experience.flatMap((e) => out(`${e.role} @ ${e.company} (${e.period})`, ...e.highlights.map((h) => '  - ' + h)))
    case 'projects':
      return projects.flatMap((p) => out(`[${p.code}] ${p.title} — ${p.subtitle}`, `  ${p.stack.join(', ')}  ::  ${p.linkLabel}`))
    case 'education':
      return education.flatMap((e) => out(`${e.full} — ${e.institute} (${e.period}) ${e.status}`))
    case 'contact':
      return out(`EMAIL: ${profile.email}`, `PHONE: ${profile.phone}`, `LINKEDIN: ${profile.socials.linkedin}`, `GITHUB: ${profile.socials.github}`)
    case 'goto': {
      const id = args[0]
      if (!id || !document.getElementById(id)) return out(`goto: unknown section '${id ?? ''}'`)
      useUI.getState().setTerminal(false)
      window.setTimeout(() => scrollToTarget(`#${id}`), 300)
      return out(`Navigating to #${id}...`)
    }
    case 'ascii':
    case 'banner':
      return art((args.join(' ') || 'KUNAL').slice(0, 14), 'out')
    case 'rage':
      useUI.getState().toggleRage()
      return out('ROBOT RAGE MODE toggled.')
    case 'sudo':
      return out('Permission granted. Hiring protocol initiated → ' + profile.email)
    case 'clear':
      return 'clear'
    case 'exit':
    case 'quit':
      return 'exit'
    default:
      return out(`command not found: ${name}. Try 'help'.`)
  }
}

export default function Terminal() {
  const open = useUI((s) => s.terminal)
  const setOpen = useUI((s) => s.setTerminal)
  const [lines, setLines] = useState<Line[]>(BANNER)
  const [value, setValue] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [hIdx, setHIdx] = useState(-1)
  const input = useRef<HTMLInputElement>(null)
  const body = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    sfx.open()
    window.setTimeout(() => input.current?.focus(), 50)
  }, [open])

  useEffect(() => {
    body.current?.scrollTo({ top: body.current.scrollHeight })
  }, [lines])

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const res = run(value)
    if (value.trim()) setHistory((h) => [value, ...h].slice(0, 30))
    setHIdx(-1)
    if (res === 'clear') setLines([])
    else if (res === 'exit') setOpen(false)
    else setLines((l) => [...l, { kind: 'in', text: value }, ...res])
    setValue('')
  }

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp' && history.length) {
      e.preventDefault()
      const i = Math.min(hIdx + 1, history.length - 1)
      setHIdx(i)
      setValue(history[i])
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const i = Math.max(hIdx - 1, -1)
      setHIdx(i)
      setValue(i === -1 ? '' : history[i])
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[85] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
          data-no-pulse
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Hidden terminal"
            initial={{ scaleY: 0.02, scaleX: 0.6 }}
            animate={{ scaleY: 1, scaleX: 1 }}
            exit={{ scaleY: 0.02, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.7, 0, 0.2, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="glass relative flex h-[70vh] w-full max-w-3xl flex-col border-signal/50 shadow-red"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-2 font-mono text-[10px] tracking-[0.3em] text-ash">
              <span>root@kunal.exe:~</span>
              <button onClick={() => setOpen(false)} className="text-signal hover:text-white" aria-label="Close terminal">
                [X] EXIT
              </button>
            </div>
            <div ref={body} className="flex-1 overflow-y-auto p-4 font-mono text-xs leading-6" data-lenis-prevent>
              {lines.map((l, i) => (
                <p
                  key={i}
                  className={cn(
                    l.text.includes('█') ? 'whitespace-pre text-[10px] leading-[1.05]' : 'whitespace-pre-wrap',
                    l.kind === 'in' ? 'text-white' : l.kind === 'sys' ? 'text-signal' : 'text-ash',
                  )}
                >
                  {l.kind === 'in' && <span className="text-signal">❯ </span>}
                  {l.text}
                </p>
              ))}
            </div>
            <form onSubmit={submit} className="flex items-center gap-2 border-t border-white/10 px-4 py-3 font-mono text-xs">
              <span className="text-signal">❯</span>
              <label htmlFor="term-input" className="sr-only">Command</label>
              <input
                id="term-input"
                ref={input}
                value={value}
                onChange={(e) => {
                  setValue(e.target.value)
                  sfx.type()
                }}
                onKeyDown={onKey}
                autoComplete="off"
                spellCheck={false}
                className="flex-1 bg-transparent text-white outline-none"
              />
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
