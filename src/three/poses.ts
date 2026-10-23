import { isMobile } from '../lib/env'
import { camState, type CamPose } from '../lib/state'

/** Camera + robot-head pose per section id. Tweened by GSAP when a section becomes active. */
export const POSES: Record<string, CamPose> = {
  home:       { cx: 0,    cy: 0,    cz: 7,   lx: 0,    ly: 0,    lz: 0,  hx: 1.9,  hy: -0.1, hz: 0,    hRotY: -0.25, hRotX: 0 },
  about:      { cx: -1.6, cy: 0.8,  cz: 6.5, lx: 0.6,  ly: 0,    lz: 0,  hx: 2.4,  hy: 0,    hz: 0,    hRotY: -0.55, hRotX: 0.05 },
  skills:     { cx: 2.5,  cy: -0.4, cz: 8,   lx: -0.5, ly: 0,    lz: -1, hx: -2.6, hy: 0,    hz: -1,   hRotY: 0.5,   hRotX: 0 },
  experience: { cx: 0,    cy: 2.6,  cz: 9,   lx: 0,    ly: -0.5, lz: -1, hx: 2.8,  hy: -0.6, hz: -1.5, hRotY: -0.4,  hRotX: 0.25 },
  projects:   { cx: 0,    cy: 0.3,  cz: 12,  lx: 0,    ly: 0.6,  lz: -4, hx: 0,    hy: 1.4,  hz: -5,   hRotY: 0,     hRotX: 0.15 },
  education:  { cx: -2.8, cy: 0,    cz: 7.5, lx: -0.4, ly: 0,    lz: 0,  hx: -2.2, hy: 0,    hz: 0,    hRotY: 0.6,   hRotX: 0 },
  contact:    { cx: 0,    cy: -0.8, cz: 6.5, lx: 0,    ly: 0.2,  lz: 0,  hx: 0,    hy: 0.6,  hz: -1.5, hRotY: 0,     hRotX: -0.2 },
}

export function resolvePose(pose: CamPose): CamPose {
  if (!isMobile) return pose
  return { ...pose, hx: 0, cx: pose.cx * 0.4, cz: pose.cz + 3 }
}

Object.assign(camState, resolvePose(POSES.home))
