const mq = (q: string) => typeof window !== 'undefined' && window.matchMedia(q).matches
const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null

export const reducedMotion = mq('(prefers-reduced-motion: reduce)')
export const isTouch = mq('(hover: none), (pointer: coarse)')
export const isMobile = mq('(max-width: 768px)')

const weakCpu = typeof navigator !== 'undefined' && (navigator.hardwareConcurrency ?? 8) <= 4

// `?hq` forces full quality, `?lite` forces the low-power path.
export const lowPower: boolean = params?.has('hq')
  ? false
  : Boolean(params?.has('lite') || reducedMotion || isMobile || isTouch || weakCpu)
