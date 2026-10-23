import type { ProjectVariant } from '../data/resume'

const L = ({ w, r = false, h = 6 }: { w: string; r?: boolean; h?: number }) => (
  <div className={r ? 'bg-signal' : 'bg-white/25'} style={{ width: w, height: h }} />
)

/** Procedural UI-mockup artwork per project (no image assets needed). */
function Art({ variant }: { variant: ProjectVariant }) {
  switch (variant) {
    case 'news':
      return (
        <div className="grid h-full grid-cols-3 gap-2 p-3">
          <div className="col-span-2 row-span-2 flex flex-col justify-end gap-1.5 border border-white/15 bg-gradient-to-t from-blood/60 to-transparent p-2">
            <L w="30%" r h={4} /> <L w="90%" h={8} /> <L w="70%" h={8} />
          </div>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col gap-1 border border-white/10 p-1.5">
              <div className="h-6 bg-white/10" /> <L w="80%" h={3} /> <L w="50%" h={3} />
            </div>
          ))}
        </div>
      )
    case 'verify':
      return (
        <div className="flex h-full gap-3 p-3">
          <div className="flex w-1/3 flex-col items-center gap-2 border border-white/15 p-2">
            <div className="h-10 w-10 rounded-full border-2 border-signal" />
            <L w="80%" h={4} /> <L w="60%" h={4} />
            <div className="mt-auto w-full bg-signal/80 py-1 text-center font-mono text-[7px] text-black">VERIFIED</div>
          </div>
          <div className="flex flex-1 flex-col gap-2">
            {[90, 70, 100, 55].map((v, i) => (
              <div key={i} className="border border-white/10 p-1.5">
                <L w="40%" h={3} />
                <div className="mt-1 h-1.5 bg-white/10">
                  <div className="h-full bg-signal" style={{ width: `${v}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    case 'field':
      return (
        <div className="relative h-full overflow-hidden p-3">
          <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.15) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.15) 1px,transparent 1px)', backgroundSize: '18px 18px' }} />
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 200 120" preserveAspectRatio="none">
            <path d="M10 100 C 50 20, 90 110, 130 50 S 180 30, 195 15" stroke="#FF1E1E" strokeWidth="2" fill="none" strokeDasharray="4 4" />
            {[[10, 100], [70, 62], [130, 50], [195, 15]].map(([x, y]) => (
              <circle key={x} cx={x} cy={y} r="4" fill="#000" stroke="#FFF" strokeWidth="1.5" />
            ))}
          </svg>
          <div className="absolute bottom-3 right-3 border border-white/20 bg-black/80 p-1.5 font-mono text-[7px] text-white">
            GPS ● CHECK-IN 09:02
          </div>
        </div>
      )
    case 'license':
      return (
        <div className="flex h-full flex-col gap-1.5 p-3">
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex-1 border border-white/15 p-1.5">
                <L w="50%" h={3} />
                <div className="mt-1 font-display text-sm text-white">{[128, 42, 9][i]}</div>
              </div>
            ))}
          </div>
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-2 border-b border-white/10 py-1">
              <div className={`h-2 w-2 ${i === 1 ? 'bg-signal' : 'bg-white/40'}`} />
              <L w="35%" h={3} /> <div className="flex-1" /> <L w="15%" h={3} r={i === 1} />
            </div>
          ))}
        </div>
      )
    default:
      return (
        <div className="flex h-full flex-col p-3">
          <div className="flex items-center justify-between border-b border-white/15 pb-1.5">
            <L w="20%" r h={5} />
            <div className="flex gap-1.5"><L w="16px" h={3} /><L w="16px" h={3} /><L w="16px" h={3} /></div>
          </div>
          <div className="flex flex-1 flex-col items-start justify-center gap-2">
            <L w="70%" h={10} /> <L w="50%" h={10} />
            <div className="mt-1 border border-signal px-2 py-0.5 font-mono text-[7px] text-signal">GET A QUOTE</div>
          </div>
          <div className="grid grid-cols-3 gap-1.5">{[0, 1, 2].map((i) => <div key={i} className="h-6 border border-white/10 bg-white/5" />)}</div>
        </div>
      )
  }
}

export default function ProjectThumb({ variant, code }: { variant: ProjectVariant; code: string }) {
  return (
    <div className="relative aspect-[16/10] overflow-hidden border border-white/10 bg-char">
      <div className="thumb-inner absolute inset-0">
        <div className="flex h-5 items-center gap-1.5 border-b border-white/10 bg-black px-2">
          <span className="h-1.5 w-1.5 rounded-full bg-signal" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
          <span className="ml-2 font-mono text-[7px] tracking-widest text-ash">{code}.deploy</span>
        </div>
        <div className="h-[calc(100%-1.25rem)]">
          <Art variant={variant} />
        </div>
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: 'repeating-linear-gradient(0deg, rgba(0,0,0,.25) 0 1px, transparent 1px 3px)' }} />
    </div>
  )
}
