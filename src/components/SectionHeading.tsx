import ScrambleText from './ScrambleText'

import { cn } from '../lib/cn'

export default function SectionHeading({
  index,
  kicker,
  title,
  sub,
  className,
}: {
  index: string
  kicker: string
  title: string
  sub?: string
  className?: string
}) {
  return (
    <header className={cn('mb-14 md:mb-20', className)}>
      <p className="mb-4 flex items-center gap-3 font-mono text-[11px] tracking-[0.35em] text-signal">
        <span className="h-px w-10 bg-signal" />
        {index} // {kicker}
      </p>
      <ScrambleText
        as="h2"
        text={title}
        reveal="view"
        className="font-display text-4xl font-black uppercase leading-[0.95] tracking-tight text-white md:text-6xl lg:text-7xl"
      />
      {sub && <p className="mt-5 max-w-xl text-sm text-ash md:text-base">{sub}</p>}
    </header>
  )
}
