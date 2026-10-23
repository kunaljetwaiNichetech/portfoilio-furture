import { create } from 'zustand'

/** Mutable, render-free shared state read inside animation loops. */
export const pointer = { x: 0, y: 0, nx: 0, ny: 0, down: false }

export const scrollState = { progress: 0, velocity: 0 }

export const camState = {
  cx: 0, cy: 0, cz: 7,
  lx: 0, ly: 0, lz: 0,
  hx: 0, hy: 0, hz: 0,
  hRotY: 0, hRotX: 0,
}
export type CamPose = typeof camState

export type Pulse = { id: number; cx: number; cy: number; nx: number; ny: number; born: number }
export const pulses: Pulse[] = []
const pulseListeners = new Set<(p: Pulse) => void>()
let pulseId = 0

export function firePulse(cx: number, cy: number) {
  const p: Pulse = {
    id: ++pulseId,
    cx,
    cy,
    nx: (cx / window.innerWidth) * 2 - 1,
    ny: -(cy / window.innerHeight) * 2 + 1,
    born: performance.now(),
  }
  pulses.push(p)
  if (pulses.length > 10) pulses.shift()
  pulseListeners.forEach((l) => l(p))
}

export function onPulse(listener: (p: Pulse) => void) {
  pulseListeners.add(listener)
  return () => {
    pulseListeners.delete(listener)
  }
}

const storedSound = (() => {
  try {
    return localStorage.getItem('kp-sfx') === '1'
  } catch {
    return false
  }
})()

type UIState = {
  booted: boolean
  sceneReady: boolean
  rage: boolean
  terminal: boolean
  menuOpen: boolean
  activeProject: number | null
  section: string
  idle: boolean
  sound: boolean
  comms: { id: number; text: string }
  setSection: (id: string) => void
  setIdle: (v: boolean) => void
  setSound: (v: boolean) => void
  say: (text: string) => void
  setBooted: (v: boolean) => void
  setSceneReady: (v: boolean) => void
  setRage: (v: boolean) => void
  toggleRage: () => void
  setTerminal: (v: boolean) => void
  setMenuOpen: (v: boolean) => void
  setActiveProject: (i: number | null) => void
}

export const useUI = create<UIState>((set) => ({
  booted: false,
  sceneReady: false,
  rage: false,
  terminal: false,
  menuOpen: false,
  activeProject: null,
  section: 'home',
  idle: false,
  sound: storedSound,
  comms: { id: 0, text: '' },
  setSection: (section) => set({ section }),
  setIdle: (idle) => set({ idle }),
  setSound: (sound) => {
    try {
      localStorage.setItem('kp-sfx', sound ? '1' : '0')
    } catch {
      /* storage unavailable */
    }
    set({ sound })
  },
  say: (text) => set((s) => (s.comms.text === text ? s : { comms: { id: s.comms.id + 1, text } })),
  setBooted: (booted) => set({ booted }),
  setSceneReady: (sceneReady) => set({ sceneReady }),
  setRage: (rage) => set({ rage }),
  toggleRage: () => set((s) => ({ rage: !s.rage })),
  setTerminal: (terminal) => set({ terminal }),
  setMenuOpen: (menuOpen) => set({ menuOpen }),
  setActiveProject: (activeProject) => set({ activeProject }),
}))
