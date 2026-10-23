import { isTouch } from '../lib/env'

/** Cursor spotlight that reveals a hidden blueprint/wireframe layer (CSS mask driven by --mx/--my). */
export default function BlueprintReveal() {
  if (isTouch) return null
  return (
    <>
      <div aria-hidden className="blueprint-layer pointer-events-none fixed inset-0 z-[1]" />
      <div aria-hidden className="spotlight-glow pointer-events-none fixed inset-0 z-[1]" />
    </>
  )
}
