import { navLinks } from '../data/resume'
import { useUI } from '../lib/state'
import { scrollToTarget } from '../lib/scroll'
import { cn } from '../lib/cn'

const items = [{ id: 'home', label: 'Boot' }, ...navLinks]

export default function SectionRail() {
  const section = useUI((s) => s.section)
  const booted = useUI((s) => s.booted)
  if (!booted) return null

  return (
    <nav aria-label="Section navigation" className="fixed right-5 top-1/2 z-[72] hidden -translate-y-1/2 lg:block">
      <ul className="flex flex-col items-end gap-4">
        {items.map((it, i) => {
          const active = section === it.id
          return (
            <li key={it.id}>
              <button
                onClick={() => scrollToTarget(i === 0 ? 0 : `#${it.id}`)}
                aria-label={`Go to ${it.label}`}
                aria-current={active ? 'true' : undefined}
                className="group flex items-center gap-3 py-1"
              >
                <span
                  className={cn(
                    'bg-black/80 px-1.5 py-0.5 font-mono text-[9px] tracking-[0.3em] transition-all duration-300',
                    active && section !== 'projects'
                      ? 'translate-x-0 text-signal opacity-100'
                      : 'translate-x-2 text-ash opacity-0 group-hover:translate-x-0 group-hover:opacity-100',
                  )}
                >
                  {String(i).padStart(2, '0')} {it.label.toUpperCase()}
                </span>
                <span
                  className={cn(
                    'block h-px transition-all duration-500',
                    active ? 'w-10 bg-signal shadow-[0_0_8px_#FF1E1E]' : 'w-4 bg-white/40 group-hover:w-6 group-hover:bg-white',
                  )}
                />
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
