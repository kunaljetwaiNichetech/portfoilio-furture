import { AnimatePresence, motion } from 'framer-motion'
import { useUI } from '../lib/state'

export default function RageBanner() {
  const rage = useUI((s) => s.rage)
  return (
    <AnimatePresence>
      {rage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="pointer-events-none fixed inset-0 z-[65]"
          aria-live="assertive"
        >
          <div className="absolute inset-0" style={{ boxShadow: 'inset 0 0 160px rgba(255,30,30,0.6)' }} />
          <motion.p
            initial={{ y: -40 }}
            animate={{ y: 0 }}
            className="glitch absolute left-1/2 top-24 -translate-x-1/2 whitespace-nowrap border border-signal bg-black/80 px-5 py-2 font-display text-sm font-black tracking-[0.35em] text-signal md:text-lg"
            data-text="⚠ ROBOT RAGE MODE ⚠"
          >
            ⚠ ROBOT RAGE MODE ⚠
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
