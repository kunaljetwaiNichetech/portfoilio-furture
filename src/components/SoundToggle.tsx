import { useUI } from '../lib/state'
import { setAmbient, sfx } from '../lib/sound'
import { cn } from '../lib/cn'

export default function SoundToggle() {
  const sound = useUI((s) => s.sound)
  const setSound = useUI((s) => s.setSound)

  const toggle = () => {
    const next = !sound
    setSound(next)
    setAmbient(next)
    if (next) window.setTimeout(() => sfx.open(), 30)
  }

  return (
    <button
      onClick={toggle}
      aria-pressed={sound}
      aria-label={sound ? 'Mute sound effects' : 'Enable sound effects'}
      data-cursor-label={sound ? 'MUTE' : 'AUDIO ON'}
      data-no-sfx
      className="flex h-10 items-center gap-2 border border-white/20 px-3 font-mono text-[10px] tracking-[0.25em] text-ash transition-colors hover:border-signal hover:text-white"
    >
      <span className="flex h-3 items-end gap-[2px]" aria-hidden>
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={cn('w-[2px] origin-bottom bg-signal', sound ? 'eq-bar' : 'h-[3px] opacity-60')}
            style={sound ? { animationDelay: `${i * 0.12}s`, height: '100%' } : undefined}
          />
        ))}
      </span>
      SFX
    </button>
  )
}
