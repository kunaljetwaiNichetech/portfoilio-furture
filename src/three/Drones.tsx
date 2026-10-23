import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { pointer, useUI } from '../lib/state'
import { ndcRay, RED } from './utils'

/** Instanced mini-drones with red thrusters. They dodge the cursor ray; in rage mode they swarm it. */
export default function Drones({ count = 12 }: { count?: number }) {
  const body = useRef<THREE.InstancedMesh>(null!)
  const ring = useRef<THREE.InstancedMesh>(null!)
  const thrust = useRef<THREE.InstancedMesh>(null!)

  const drones = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        base: new THREE.Vector3((Math.random() - 0.5) * 16, (Math.random() - 0.5) * 8, -2 - Math.random() * 8),
        offset: new THREE.Vector3(),
        vel: new THREE.Vector3(),
        phase: Math.random() * Math.PI * 2,
        speed: 0.25 + Math.random() * 0.45,
        scale: 0.12 + Math.random() * 0.12,
      })),
    [count],
  )

  const tmp = useMemo(
    () => ({
      o: new THREE.Vector3(),
      d: new THREE.Vector3(),
      p: new THREE.Vector3(),
      c: new THREE.Vector3(),
      diff: new THREE.Vector3(),
      obj: new THREE.Object3D(),
    }),
    [],
  )

  const thrusterGeo = useMemo(() => new THREE.ConeGeometry(0.5, 1.6, 12).rotateX(Math.PI).translate(0, -1.3, 0), [])

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime
    const k = Math.min(dt, 0.05) * 60
    const rage = useUI.getState().rage
    const { o, d, p, c, diff, obj } = tmp
    ndcRay(state.camera, pointer.nx, pointer.ny, o, d)

    drones.forEach((dr, i) => {
      const sp = dr.speed * (rage ? 3 : 1)
      p.set(
        dr.base.x + Math.sin(t * sp + dr.phase) * 1.4,
        dr.base.y + Math.cos(t * sp * 1.3 + dr.phase) * 0.7,
        dr.base.z + Math.sin(t * sp * 0.7 + dr.phase) * 0.9,
      ).add(dr.offset)

      diff.copy(p).sub(o)
      const along = diff.dot(d)
      c.copy(d).multiplyScalar(along).add(o)
      diff.copy(p).sub(c)
      const dist = diff.length()
      const R = 2.4
      if (rage) {
        dr.vel.addScaledVector(c.sub(p), 0.004 * k)
      } else if (dist < R && along > 0) {
        dr.vel.addScaledVector(diff.normalize(), (1 - dist / R) * 0.05 * k)
      }
      dr.vel.addScaledVector(dr.offset, rage ? -0.001 : -0.012 * k)
      dr.vel.multiplyScalar(0.92)
      dr.offset.addScaledVector(dr.vel, k)

      obj.position.copy(p)
      obj.rotation.set(dr.vel.y * 6 + Math.sin(t + dr.phase) * 0.15, t * 0.8 + dr.phase, -dr.vel.x * 6)
      obj.scale.setScalar(dr.scale)
      obj.updateMatrix()
      body.current.setMatrixAt(i, obj.matrix)

      obj.rotation.y = t * 3 + dr.phase
      obj.updateMatrix()
      ring.current.setMatrixAt(i, obj.matrix)

      obj.rotation.set(dr.vel.y * 6, 0, -dr.vel.x * 6)
      obj.scale.set(dr.scale, dr.scale * (0.8 + Math.random() * (rage ? 1.2 : 0.5)), dr.scale)
      obj.updateMatrix()
      thrust.current.setMatrixAt(i, obj.matrix)
    })
    body.current.instanceMatrix.needsUpdate = true
    ring.current.instanceMatrix.needsUpdate = true
    thrust.current.instanceMatrix.needsUpdate = true
  })

  return (
    <group>
      <instancedMesh ref={body} args={[undefined, undefined, count]} frustumCulled={false}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial color="#161616" metalness={0.9} roughness={0.3} flatShading />
      </instancedMesh>
      <instancedMesh ref={ring} args={[undefined, undefined, count]} frustumCulled={false}>
        <torusGeometry args={[1.6, 0.08, 6, 32]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.7} />
      </instancedMesh>
      <instancedMesh ref={thrust} args={[thrusterGeo, undefined, count]} frustumCulled={false}>
        <meshBasicMaterial color={RED.clone().multiplyScalar(4)} toneMapped={false} transparent opacity={0.9} />
      </instancedMesh>
    </group>
  )
}
