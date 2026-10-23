# KUNAL.EXE — 3D Cyberpunk Developer Portfolio

React 18 + Vite + TypeScript + React Three Fiber, GSAP/ScrollTrigger, Framer Motion, Lenis and Tailwind.

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + production build into dist/
npm run preview    # serve the production build
```

Query flags: `?hq` forces full quality, `?lite` forces the low-power mode.

## Edit content

All text lives in `src/data/resume.ts` (profile, stats, skills, experience, projects, education, marquee, nav).

- Put your resume PDF in `public/` as `Kunal_Prakash_Jetwani_Resume.pdf` (or change `profile.resumeUrl`).
- Replace `profile.socials` with your real LinkedIn / GitHub URLs.
- Add `public/og-image.png` (1200x630) for social previews and update the domain in `index.html`.

## Contact form

Without configuration the form opens the visitor's mail app. To receive messages directly, create a form at
[formspree.io](https://formspree.io) and set `VITE_FORMSPREE_ID` in `.env` (see `.env.example`) or in Vercel's env vars.

## Easter eggs

- `R` — ROBOT RAGE MODE
- `↑ ↑ ↓ ↓ ← → ← → B A` (or the backtick key) — hidden terminal (`help`, `about`, `skills`, `projects`, `contact`, `goto <section>`)
- Leave the mouse alone for 15s — the robot enters standby; switch tabs — the title reports "SIGNAL LOST"

## Extras

- **SFX toggle** (navbar): synthesized Web Audio sound design — hover blips, click zaps, typing ticks, rage alarm, ambient hum. Off by default; the choice is remembered.
- **KP-01 comms panel**: the robot types contextual lines per section and reacts to project hovers, the contact form, idle and rage mode. Edit lines in `src/components/RobotComms.tsx`.
- **Section rail**, **cursor trail**, and **scroll-velocity marquees**.
- **Auto quality**: drei `PerformanceMonitor` drops DPR to 1 and disables post-processing and gears if the frame rate declines.

## Deploy to Vercel

1. Push the folder to a GitHub repo.
2. On [vercel.com/new](https://vercel.com/new) import the repo. Framework preset: **Vite**, build command `npm run build`, output `dist`.
3. (Optional) add `VITE_FORMSPREE_ID` under Settings → Environment Variables.
4. Deploy. `vercel.json` already handles SPA rewrites and long-term asset caching.

Or from the CLI: `npm i -g vercel && vercel --prod`.

## Structure

```
src/
  data/resume.ts      all content
  lib/                env detection, shared state (zustand + mutable refs), gsap, lenis
  hooks/              global input (cursor, click pulses, keys), scroll camera path
  three/              background Scene, RobotHead, Drones, ParticleField, MechBackground,
                      EnergyPulses, Effects, SkillSphere, RobotArm, poses
  components/         Cursor, Preloader, Navbar, Terminal, TiltCard, Magnetic, ScrambleText, ...
  sections/           Hero, About, Skills, Experience, Projects, Education, Contact, Footer
```

## Performance notes

- 3D scenes are lazy-loaded chunks inside `Suspense`; the skill sphere and robot arm mount on first approach and pause (`frameloop="never"`) off-screen.
- Particles and drones are `InstancedMesh`; DPR clamped to `[1, 2]` (`[1, 1.5]` in low-power).
- Low-power mode (mobile, touch, ≤4 CPU cores, or reduced motion) drops post-processing and gears, cuts particle and drone counts, disables the robot arm and uses a vertical project grid.
- `prefers-reduced-motion` disables smooth scroll, glitch, code rain, scan beam and scroll-scrub animations.
