import { useUI } from './state'

/** Fully synthesized UI sound design (Web Audio, no audio files). */
let ctx: AudioContext | null = null
let master: GainNode | null = null
let hum: { nodes: OscillatorNode[]; gain: GainNode } | null = null

function audio() {
  if (!ctx) {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    ctx = new AC()
    master = ctx.createGain()
    master.gain.value = 0.7
    master.connect(ctx.destination)
  }
  if (ctx.state === 'suspended') void ctx.resume()
  return { c: ctx, out: master! }
}

type Tone = { f: number; to?: number; dur: number; type?: OscillatorType; gain?: number; delay?: number }

function tone({ f, to, dur, type = 'sine', gain = 0.05, delay = 0 }: Tone) {
  const { c, out } = audio()
  const t = c.currentTime + delay
  const o = c.createOscillator()
  const g = c.createGain()
  o.type = type
  o.frequency.setValueAtTime(f, t)
  if (to) o.frequency.exponentialRampToValueAtTime(to, t + dur)
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(gain, t + 0.008)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  o.connect(g).connect(out)
  o.start(t)
  o.stop(t + dur + 0.05)
}

function noise(dur: number, gain = 0.04, freq = 1200) {
  const { c, out } = audio()
  const buf = c.createBuffer(1, Math.floor(c.sampleRate * dur), c.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length)
  const src = c.createBufferSource()
  src.buffer = buf
  const filt = c.createBiquadFilter()
  filt.type = 'bandpass'
  filt.frequency.value = freq
  const g = c.createGain()
  g.gain.value = gain
  src.connect(filt).connect(g).connect(out)
  src.start()
}

const on = () => useUI.getState().sound
let lastHover = 0
let lastType = 0

export const sfx = {
  hover() {
    const now = performance.now()
    if (!on() || now - lastHover < 70) return
    lastHover = now
    tone({ f: 1500, to: 2300, dur: 0.05, type: 'square', gain: 0.012 })
  },
  click() {
    if (!on()) return
    tone({ f: 190, to: 45, dur: 0.35, type: 'sawtooth', gain: 0.045 })
    noise(0.16, 0.05, 900)
  },
  open() {
    if (!on()) return
    tone({ f: 300, to: 1200, dur: 0.18, type: 'triangle', gain: 0.04 })
    tone({ f: 600, to: 1800, dur: 0.12, type: 'square', gain: 0.012, delay: 0.08 })
  },
  type() {
    const now = performance.now()
    if (!on() || now - lastType < 45) return
    lastType = now
    tone({ f: 2200 + Math.random() * 600, dur: 0.018, type: 'square', gain: 0.006 })
  },
  rage() {
    if (!on()) return
    for (let i = 0; i < 4; i++) tone({ f: 880, to: 420, dur: 0.22, type: 'sawtooth', gain: 0.04, delay: i * 0.25 })
    noise(0.6, 0.06, 300)
  },
  success() {
    if (!on()) return
    ;[523, 659, 784, 1046].forEach((f, i) => tone({ f, dur: 0.2, type: 'triangle', gain: 0.04, delay: i * 0.08 }))
  },
  boot() {
    if (!on()) return
    tone({ f: 50, to: 260, dur: 1.1, type: 'sawtooth', gain: 0.035 })
    tone({ f: 1046, dur: 0.25, type: 'triangle', gain: 0.03, delay: 1 })
  },
}

export function setAmbient(enabled: boolean) {
  if (enabled) {
    if (hum) return
    const { c, out } = audio()
    const gain = c.createGain()
    gain.gain.setValueAtTime(0.0001, c.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.03, c.currentTime + 2)
    const filt = c.createBiquadFilter()
    filt.type = 'lowpass'
    filt.frequency.value = 300
    const nodes = [55, 82.4, 110.6].map((f, i) => {
      const o = c.createOscillator()
      o.type = i === 1 ? 'sawtooth' : 'sine'
      o.frequency.value = f
      o.connect(filt)
      o.start()
      return o
    })
    const lfo = c.createOscillator()
    const lfoGain = c.createGain()
    lfo.frequency.value = 0.12
    lfoGain.gain.value = 120
    lfo.connect(lfoGain).connect(filt.frequency)
    lfo.start()
    nodes.push(lfo)
    filt.connect(gain).connect(out)
    hum = { nodes, gain }
  } else if (hum && ctx) {
    const h = hum
    hum = null
    h.gain.gain.cancelScheduledValues(ctx.currentTime)
    h.gain.gain.setValueAtTime(Math.max(h.gain.gain.value, 0.0001), ctx.currentTime)
    h.gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6)
    window.setTimeout(() => h.nodes.forEach((o) => o.stop()), 700)
  }
}
