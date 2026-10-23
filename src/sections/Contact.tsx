import { lazy, Suspense, useRef, useState, type FormEvent } from 'react'
import { AnimatePresence, motion, useInView } from 'framer-motion'
import { profile } from '../data/resume'
import { isMobile } from '../lib/env'
import { useUI } from '../lib/state'
import { sfx } from '../lib/sound'
import SectionHeading from '../components/SectionHeading'
import Magnetic from '../components/Magnetic'
import { Brackets } from '../components/TiltCard'
import { GitHubIcon, LinkedInIcon } from '../components/Icons'

const RobotArm = lazy(() => import('../three/RobotArm'))

type Status = 'idle' | 'sending' | 'sent' | 'error'

function Burst() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 grid place-items-center">
      {Array.from({ length: 28 }).map((_, i) => {
        const a = (i / 28) * Math.PI * 2
        const d = 120 + Math.random() * 120
        return (
          <motion.span
            key={i}
            className={i % 4 ? 'absolute h-1.5 w-1.5 bg-signal' : 'absolute h-1 w-1 bg-white'}
            style={{ boxShadow: '0 0 10px #FF1E1E' }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{ x: Math.cos(a) * d, y: Math.sin(a) * d, opacity: 0, scale: 0.3 }}
            transition={{ duration: 1.1, ease: [0.1, 0.8, 0.2, 1] }}
          />
        )
      })}
    </div>
  )
}

export default function Contact() {
  const section = useRef<HTMLElement>(null)
  const armMounted = useInView(section, { once: true, margin: '300px 0px' })
  const armActive = useInView(section)
  const [status, setStatus] = useState<Status>('idle')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>
    const errs: Record<string, string> = {}
    if (!data.name?.trim()) errs.name = 'Name required'
    if (!/^\S+@\S+\.\S+$/.test(data.email ?? '')) errs.email = 'Valid email required'
    if ((data.message ?? '').trim().length < 10) errs.message = 'Message must be at least 10 characters'
    setErrors(errs)
    if (Object.keys(errs).length) return

    setStatus('sending')
    const id = import.meta.env.VITE_FORMSPREE_ID
    try {
      if (id) {
        const res = await fetch(`https://formspree.io/f/${id}`, {
          method: 'POST',
          headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
        if (!res.ok) throw new Error('failed')
      } else {
        const subject = encodeURIComponent(`Portfolio contact from ${data.name}`)
        const body = encodeURIComponent(`${data.message}\n\n— ${data.name} (${data.email})`)
        window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`
      }
      setStatus('sent')
      sfx.success()
      useUI.getState().say('TRANSMISSION RECEIVED. KUNAL WILL RESPOND SHORTLY.')
      form.reset()
      window.setTimeout(() => setStatus('idle'), 4500)
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="contact" ref={section} className="section relative overflow-hidden" aria-label="Contact">
      {!isMobile && (
        <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
          <Suspense fallback={null}>{armMounted && <RobotArm active={armActive} />}</Suspense>
        </div>
      )}

      <div className="container-x relative z-10">
        <SectionHeading index="06" kicker="ESTABLISH CONNECTION" title="Open A Channel" />

        <p className="fill-text mb-16 font-display text-[clamp(2.6rem,9vw,9rem)] font-black uppercase leading-[0.9]">
          Let&apos;s Build
          <br />
          Together
        </p>

        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div className="space-y-6">
            {[
              { k: 'EMAIL', v: profile.email, href: `mailto:${profile.email}` },
              { k: 'PHONE', v: profile.phone, href: profile.phoneHref },
              { k: 'BASE', v: profile.location },
            ].map((c) => (
              <div key={c.k} className="border-b border-white/10 pb-4">
                <p className="hud-label mb-2">{c.k}</p>
                {c.href ? (
                  <a href={c.href} className="font-tech text-xl font-semibold text-white transition-colors hover:text-signal md:text-2xl">
                    {c.v}
                  </a>
                ) : (
                  <p className="font-tech text-xl font-semibold text-white md:text-2xl">{c.v}</p>
                )}
              </div>
            ))}
            <div className="flex gap-4 pt-2">
              {[
                { label: 'LinkedIn', href: profile.socials.linkedin, Icon: LinkedInIcon },
                { label: 'GitHub', href: profile.socials.github, Icon: GitHubIcon },
              ].map(({ label, href, Icon }) => (
                <Magnetic key={label} strength={0.5}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="grid h-14 w-14 place-items-center border border-white/20 bg-black/60 text-white transition-all hover:border-signal hover:text-signal hover:shadow-red"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                </Magnetic>
              ))}
            </div>
          </div>

          <form
            onSubmit={submit}
            onFocus={() => useUI.getState().say('UPLINK READY. TYPE YOUR TRANSMISSION, HUMAN.')}
            noValidate className="glass relative space-y-5 p-6 md:p-9" aria-label="Contact form">
            <Brackets />
            <p className="hud-label">// SECURE UPLINK — ENCRYPTED</p>
            {[
              { name: 'name', label: 'Callsign / Name', type: 'text', auto: 'name' },
              { name: 'email', label: 'Return Frequency / Email', type: 'email', auto: 'email' },
            ].map((f) => (
              <div key={f.name}>
                <label htmlFor={f.name} className="mb-2 block font-mono text-[10px] uppercase tracking-[0.25em] text-ash">
                  {f.label}
                </label>
                <input id={f.name} name={f.name} type={f.type} autoComplete={f.auto} className="field" aria-invalid={!!errors[f.name]} aria-describedby={`${f.name}-err`} />
                <p id={`${f.name}-err`} className="mt-1 font-mono text-[10px] text-signal">{errors[f.name]}</p>
              </div>
            ))}
            <div>
              <label htmlFor="message" className="mb-2 block font-mono text-[10px] uppercase tracking-[0.25em] text-ash">
                Transmission / Message
              </label>
              <textarea id="message" name="message" rows={5} className="field resize-none" aria-invalid={!!errors.message} aria-describedby="message-err" />
              <p id="message-err" className="mt-1 font-mono text-[10px] text-signal">{errors.message}</p>
            </div>
            <button type="submit" disabled={status === 'sending'} className="btn-primary w-full justify-center disabled:opacity-60">
              {status === 'sending' ? 'TRANSMITTING...' : status === 'error' ? 'RETRY TRANSMISSION' : 'SEND TRANSMISSION'}
            </button>

            <AnimatePresence>
              {status === 'sent' && (
                <motion.div
                  role="status"
                  initial={{ opacity: 0, clipPath: 'inset(50% 0 50% 0)' }}
                  animate={{ opacity: 1, clipPath: 'inset(0% 0 0% 0)' }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-20 grid place-items-center bg-black/90"
                >
                  <Burst />
                  <div className="text-center">
                    <p data-text="TRANSMISSION SENT" className="glitch font-display text-2xl font-black tracking-[0.15em] text-signal md:text-4xl">
                      TRANSMISSION SENT
                    </p>
                    <p className="mt-3 font-mono text-[11px] tracking-[0.25em] text-ash">SIGNAL RECEIVED. RESPONSE INBOUND.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>
      </div>
    </section>
  )
}
