import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { pointer, pulses, useUI } from '../lib/state'
import { ndcRay, rayToPlaneZ } from './utils'

const PULSE_LIFE = 1600

/** Instanced particle field: springs to home, repels from the cursor ray, shockwaves on click, hyperspace in rage mode. */
export default function ParticleField({ count = 1800 }: { count?: number }) {
  const mesh = useRef<THREE.InstancedMesh>(null!)

  const { home, pos, vel } = useMemo(() => {
    const home = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      home[i * 3] = (Math.random() - 0.5) * 26
      home[i * 3 + 1] = (Math.random() - 0.5) * 15
      home[i * 3 + 2] = -12 + Math.random() * 15
    }
    return { home, pos: home.slice(), vel: new Float32Array(count * 3) }
  }, [count])

  const tmp = useMemo(() => ({ o: new THREE.Vector3(), d: new THREE.Vector3(), w: new THREE.Vector3(), obj: new THREE.Object3D() }), [])
  const centers = useMemo(() => Array.from({ length: 10 }, () => ({ x: 0, y: 0, z: 0, r: 0, s: 0 })), [])

  useLayoutEffect(() => {
    const c = new THREE.Color()
    for (let i = 0; i < count; i++) {
      if (Math.random() < 0.18) c.set('#FF1E1E').multiplyScalar(2.2)
      else c.set('#A1A1A1').multiplyScalar(0.5 + Math.random() * 0.7)
      mesh.current.setColorAt(i, c)
    }
    if (mesh.current.instanceColor) mesh.current.instanceColor.needsUpdate = true
  }, [count])

  useFrame((state, dt) => {
    const k = Math.min(dt, 0.05) * 60
    const t = state.clock.elapsedTime
    const rage = useUI.getState().rage
    const { o, d, w, obj } = tmp
    const now = performance.now()

    let nc = 0
    for (const p of pulses) {
      const age = now - p.born
      if (age > PULSE_LIFE) continue
      ndcRay(state.camera, p.nx, p.ny, o, d)
      rayToPlaneZ(o, d, 0, w)
      const c = centers[nc++]
      c.x = w.x
      c.y = w.y
      c.z = w.z
      c.r = (age / 1000) * 11
      c.s = 1 - age / PULSE_LIFE
      if (nc >= centers.length) break
    }

    ndcRay(state.camera, pointer.nx, pointer.ny, o, d)
    const ox = o.x, oy = o.y, oz = o.z, dx = d.x, dy = d.y, dz = d.z
    const R = 1.8

    for (let i = 0; i < count; i++) {
      const ix = i * 3, iy = ix + 1, iz = ix + 2
      let px = pos[ix], py = pos[iy], pz = pos[iz]

      if (rage) {
        home[iz] += 0.35 * k
        if (home[iz] > 6) home[iz] -= 18
        pz = home[iz]
        vel[iz] = 0
      }

      const hx = home[ix] + Math.sin(t * 0.3 + i) * 0.25
      const hy = home[iy] + Math.cos(t * 0.25 + i * 0.7) * 0.25
      vel[ix] += (hx - px) * 0.012 * k
      vel[iy] += (hy - py) * 0.012 * k
      if (!rage) vel[iz] += (home[iz] - pz) * 0.012 * k

      const ax = px - ox, ay = py - oy, az = pz - oz
      const along = ax * dx + ay * dy + az * dz
      const ex = ax - dx * along, ey = ay - dy * along, ez = az - dz * along
      const d2 = ex * ex + ey * ey + ez * ez
      if (along > 0 && d2 < R * R && d2 > 1e-5) {
        const dist = Math.sqrt(d2)
        const f = ((1 - dist / R) * 0.12 * k) / dist
        vel[ix] += ex * f
        vel[iy] += ey * f
        vel[iz] += ez * f
      }

      for (let j = 0; j < nc; j++) {
        const c = centers[j]
        const qx = px - c.x, qy = py - c.y, qz = pz - c.z
        const dist = Math.sqrt(qx * qx + qy * qy + qz * qz) + 1e-4
        const band = Math.abs(dist - c.r)
        if (band < 0.9) {
          const f = ((1 - band / 0.9) * 0.35 * c.s * k) / dist
          vel[ix] += qx * f
          vel[iy] += qy * f
          vel[iz] += qz * f
        }
      }

      vel[ix] *= 0.9
      vel[iy] *= 0.9
      vel[iz] *= 0.9
      px += vel[ix] * k
      py += vel[iy] * k
      pz += vel[iz] * k
      pos[ix] = px
      pos[iy] = py
      pos[iz] = pz

      const s = 0.018 + (i % 7) * 0.004
      obj.position.set(px, py, pz)
      if (rage) {
        obj.rotation.set(0, 0, 0)
        obj.scale.set(s, s, s * 14)
      } else {
        obj.rotation.set(t * 0.5 + i, t * 0.3 + i, 0)
        obj.scale.setScalar(s)
      }
      obj.updateMatrix()
      mesh.current.setMatrixAt(i, obj.matrix)
    }
    mesh.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]} frustumCulled={false}>
      <octahedronGeometry args={[1, 0]} />
      <meshBasicMaterial toneMapped={false} />
    </instancedMesh>
  )
}
