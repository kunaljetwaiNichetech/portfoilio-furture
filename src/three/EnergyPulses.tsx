import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { pulses } from '../lib/state'
import { ndcRay, RED, rayToPlaneZ } from './utils'

const POOL = 8
const LIFE = 1400

/** Click-fired red energy rings + core bolt that travel from the click point deep into the scene. */
export default function EnergyPulses() {
  const rings = useRef<THREE.Mesh[]>([])
  const cores = useRef<THREE.Mesh[]>([])
  const flash = useRef<THREE.PointLight>(null!)
  const cache = useMemo(() => new Map<number, { start: THREE.Vector3; dir: THREE.Vector3 }>(), [])
  const ringMats = useMemo(
    () => Array.from({ length: POOL }, () => new THREE.MeshBasicMaterial({ color: RED.clone().multiplyScalar(4), transparent: true, toneMapped: false, side: THREE.DoubleSide, depthWrite: false })),
    [],
  )
  const coreMat = useMemo(() => new THREE.MeshBasicMaterial({ color: new THREE.Color('#ffffff').multiplyScalar(3), toneMapped: false, transparent: true }), [])

  useFrame((state) => {
    const now = performance.now()
    let newest = -1
    for (let i = 0; i < POOL; i++) {
      const p = pulses[pulses.length - 1 - i]
      const ring = rings.current[i]
      const core = cores.current[i]
      if (!ring || !core) continue
      if (!p || now - p.born > LIFE) {
        ring.visible = core.visible = false
        continue
      }
      let c = cache.get(p.id)
      if (!c) {
        const o = new THREE.Vector3()
        const dir = new THREE.Vector3()
        ndcRay(state.camera, p.nx, p.ny, o, dir)
        c = { start: rayToPlaneZ(o, dir, 2, new THREE.Vector3()), dir }
        cache.set(p.id, c)
        if (cache.size > 20) cache.delete(cache.keys().next().value as number)
      }
      const a = (now - p.born) / LIFE
      if (i === 0) newest = a
      ring.visible = core.visible = true
      ring.position.copy(c.start).addScaledVector(c.dir, a * 16)
      ring.lookAt(state.camera.position)
      ring.scale.setScalar(0.15 + a * 2.6)
      ringMats[i].opacity = (1 - a) * 0.9
      core.position.copy(c.start).addScaledVector(c.dir, a * 22)
      core.scale.setScalar(0.12 * (1 - a) + 0.02)
    }
    coreMat.opacity = 1
    if (newest >= 0) {
      const p = pulses[pulses.length - 1]
      const c = cache.get(p.id)
      if (c) flash.current.position.copy(c.start).addScaledVector(c.dir, newest * 16)
      flash.current.intensity = (1 - newest) * 60
    } else {
      flash.current.intensity = 0
    }
  })

  return (
    <group>
      {Array.from({ length: POOL }).map((_, i) => (
        <group key={i}>
          <mesh ref={(m) => m && (rings.current[i] = m)} material={ringMats[i]} visible={false}>
            <ringGeometry args={[0.85, 1, 48]} />
          </mesh>
          <mesh ref={(m) => m && (cores.current[i] = m)} material={coreMat} visible={false}>
            <sphereGeometry args={[1, 12, 12]} />
          </mesh>
        </group>
      ))}
      <pointLight ref={flash} color="#FF1E1E" intensity={0} distance={10} />
    </group>
  )
}
