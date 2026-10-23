import { useEffect } from 'react'
import { firePulse, pointer, useUI } from '../lib/state'
import { setAmbient, sfx } from '../lib/sound'

const IDLE_MS = 15000

const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']

/** Pointer tracking, click pulses, and keyboard easter eggs (R = rage mode, Konami / ` = terminal). */
export function useGlobalInput() {
  useEffect(() => {
    const root = document.documentElement
    pointer.x = window.innerWidth / 2
    pointer.y = window.innerHeight / 2

    let lastActivity = performance.now()
    const activity = () => {
      lastActivity = performance.now()
      if (useUI.getState().idle) useUI.getState().setIdle(false)
    }
    let sawBoot = false
    const idleTimer = window.setInterval(() => {
      const ui = useUI.getState()
      if (!ui.booted) return
      if (!sawBoot) {
        sawBoot = true
        lastActivity = performance.now()
      }
      if (!ui.idle && performance.now() - lastActivity > IDLE_MS) ui.setIdle(true)
    }, 1000)

    const baseTitle = document.title
    const visibility = () => {
      document.title = document.hidden ? '⚠ SIGNAL LOST — COME BACK, HUMAN' : baseTitle
    }

    let audioPrimed = false
    const primeAudio = () => {
      if (audioPrimed) return
      audioPrimed = true
      if (useUI.getState().sound) setAmbient(true)
    }

    const move = (e: PointerEvent) => {
      activity()
      pointer.x = e.clientX
      pointer.y = e.clientY
      pointer.nx = (e.clientX / window.innerWidth) * 2 - 1
      pointer.ny = -(e.clientY / window.innerHeight) * 2 + 1
      root.style.setProperty('--mx', `${e.clientX}px`)
      root.style.setProperty('--my', `${e.clientY}px`)
    }
    const down = () => {
      pointer.down = true
      primeAudio()
    }
    const up = () => (pointer.down = false)

    const click = (e: MouseEvent) => {
      const t = e.target as HTMLElement
      if (t.closest('input, textarea, select, [data-no-pulse], [data-no-sfx]')) return
      firePulse(e.clientX, e.clientY)
      sfx.click()
    }

    let k = 0
    const key = (e: KeyboardEvent) => {
      activity()
      primeAudio()
      const name = e.key.length === 1 ? e.key.toLowerCase() : e.key
      if (name === KONAMI[k]) {
        k++
        if (k === KONAMI.length) {
          k = 0
          useUI.getState().setTerminal(true)
        }
      } else {
        k = name === KONAMI[0] ? 1 : 0
      }

      const typing = (e.target as HTMLElement).closest?.('input, textarea, [contenteditable]')
      if (typing || e.metaKey || e.ctrlKey || e.altKey) return

      const ui = useUI.getState()
      if (name === 'r' && !ui.terminal) ui.toggleRage()
      if (name === '`') ui.setTerminal(!ui.terminal)
      if (e.key === 'Escape') {
        ui.setTerminal(false)
        ui.setActiveProject(null)
        ui.setMenuOpen(false)
      }
    }

    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerdown', down)
    window.addEventListener('pointerup', up)
    window.addEventListener('click', click)
    window.addEventListener('keydown', key)
    window.addEventListener('wheel', activity, { passive: true })
    window.addEventListener('touchstart', activity, { passive: true })
    document.addEventListener('visibilitychange', visibility)
    return () => {
      window.clearInterval(idleTimer)
      window.removeEventListener('wheel', activity)
      window.removeEventListener('touchstart', activity)
      document.removeEventListener('visibilitychange', visibility)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerdown', down)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('click', click)
      window.removeEventListener('keydown', key)
    }
  }, [])
}
