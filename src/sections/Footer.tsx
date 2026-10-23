import { useState } from 'react'
import { motion } from 'framer-motion'
import { profile } from '../data/resume'
import { scrollToTarget } from '../lib/scroll'
import Magnetic from '../components/Magnetic'

function Rocket({ launching }: { launching: boolean }) {
  return (
    <motion.svg
      viewBox="0 0 40 72"
      className="h-16 w-9"
      aria-hidden
      animate={launching ? { y: -140, opacity: 0 } : { y: [0, -4, 0], opacity: 1 }}
      transition={launching ? { duration: 0.8, ease: [0.6, 0, 0.9, 0.4] } : { duration: 1.6, repeat: Infinity }}
    >
      <path d="M20 2c8 8 11 18 11 30v14H9V32C9 20 12 10 20 2Z" fill="#0A0A0A" stroke="#FFFFFF" strokeWidth="1.5" />
      <circle cx="20" cy="24" r="4" fill="#FF1E1E" />
      <path d="M9 36 2 46v4l7-4M31 36l7 10v4l-7-4" fill="#0A0A0A" stroke="#FF1E1E" strokeWidth="1.5" />
      <g className="flame">
        <path d="M13 47h14l-7 22Z" fill="#FF1E1E" />
        <path d="M16 47h8l-4 12Z" fill="#FFFFFF" />
      </g>
    </motion.svg>
  )
}

export default function Footer() {
  const [launching, setLaunching] = useState(false)
  const launch = () => {
    setLaunching(true)
    scrollToTarget(0)
    window.setTimeout(() => setLaunching(false), 1800)
  }

  return (
    <footer className="relative z-10 border-t border-signal/30 bg-black/85 backdrop-blur">
      <div className="container-x flex flex-col items-center justify-between gap-8 py-12 md:flex-row">
        <div className="text-center md:text-left">
          <p className="font-display text-lg font-black tracking-[0.2em] text-white">{profile.handle}</p>
          <p className="mt-2 font-mono text-[10px] tracking-[0.25em] text-ash">
            © {new Date().getFullYear()} {profile.name.toUpperCase()} // ALL SYSTEMS NOMINAL
          </p>
        </div>
        <Magnetic strength={0.4}>
          <button onClick={launch} aria-label="Back to top" className="group flex flex-col items-center gap-2">
            <Rocket launching={launching} />
            <span className="font-mono text-[10px] tracking-[0.35em] text-ash transition-colors group-hover:text-signal">BACK TO TOP</span>
          </button>
        </Magnetic>
        <p className="font-mono text-[10px] tracking-[0.25em] text-ash">
          PRESS <span className="text-signal">[R]</span> FOR RAGE // <span className="text-signal">↑↑↓↓←→←→BA</span> FOR ROOT
        </p>
      </div>
    </footer>
  )
}
