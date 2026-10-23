import { useEffect, useState } from 'react'
import { reducedMotion } from '../lib/env'

export default function Typewriter({ words, start = true }: { words: string[]; start?: boolean }) {
  const [i, setI] = useState(0)
  const [len, setLen] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (!start) return
    if (reducedMotion) {
      const id = window.setTimeout(() => setI((x) => (x + 1) % words.length), 3000)
      setLen(words[i].length)
      return () => window.clearTimeout(id)
    }
    const word = words[i]
    let delay = deleting ? 28 : 65
    if (!deleting && len === word.length) delay = 1800
    if (deleting && len === 0) delay = 300
    const id = window.setTimeout(() => {
      if (!deleting && len === word.length) setDeleting(true)
      else if (deleting && len === 0) {
        setDeleting(false)
        setI((x) => (x + 1) % words.length)
      } else setLen((l) => l + (deleting ? -1 : 1))
    }, delay)
    return () => window.clearTimeout(id)
  }, [start, i, len, deleting, words])

  return (
    <span aria-live="polite">
      <span className="sr-only">{words[i]}</span>
      <span aria-hidden>
        {words[i].slice(0, len)}
        <span className="caret ml-0.5 text-signal">▌</span>
      </span>
    </span>
  )
}
