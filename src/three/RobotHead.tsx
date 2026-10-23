import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import { camState, pointer, useUI } from '../lib/state'
import { isMobile } from '../lib/env'
import { RED } from './utils'

const damp = THREE.MathUtils.damp

/** Stylized cyberpunk mech bust built from primitives. Head + pupils track the cursor. */
export default function RobotHead() {
  const root = useRef<THREE.Group>(null!)
  const head = useRef<THREE.Group>(null!)
  const eyes = useRef<THREE.Group[]>([])
  const pupils = useRef<THREE.Group[]>([])
  const eyeLight = useRef<THREE.PointLight>(null!)
  const antenna = useRef<THREE.Mesh>(null!)
  const shell = useRef<THREE.Mesh>(null!)
  const rings = useRef<THREE.Group>(null!)

  const m = useMemo(
    () => ({
      armor: new THREE.MeshStandardMaterial({ color: '#111111', metalness: 0.9, roughness: 0.32 }),
      armorLight: new THREE.MeshStandardMaterial({ color: '#222222', metalness: 0.85, roughness: 0.25 }),
      visor: new THREE.MeshStandardMaterial({ color: '#030303', metalness: 1, roughness: 0.06 }),
      grill: new THREE.MeshStandardMaterial({ color: '#0a0a0a', metalness: 0.6, roughness: 0.5 }),
      red: new THREE.MeshBasicMaterial({ color: RED.clone().multiplyScalar(2.5), toneMapped: false }),
      iris: new THREE.MeshBasicMaterial({ color: RED.clone().multiplyScalar(4), toneMapped: false }),
      pupil: new THREE.MeshBasicMaterial({ color: '#000000' }),
      white: new THREE.MeshBasicMaterial({ color: '#ffffff', toneMapped: false }),
      whiteDim: new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.35, side: THREE.DoubleSide }),
      wire: new THREE.MeshBasicMaterial({ color: '#ffffff', wireframe: true, transparent: true, opacity: 0.06 }),
      holo: new THREE.MeshBasicMaterial({ color: RED.clone().multiplyScalar(1.6), transparent: true, opacity: 0.55, side: THREE.DoubleSide, toneMapped: false, depthWrite: false }),
    }),
    [],
  )

  useFrame((state, dt) => {
    const d = Math.min(dt, 0.05)
    const t = state.clock.elapsedTime
    const { rage, idle } = useUI.getState()
    const jitter = rage ? 0.06 : 0
    const track = idle ? 0 : 1

    const r = root.current
    r.position.x = damp(r.position.x, camState.hx + (Math.random() - 0.5) * jitter, 3, d)
    r.position.y = damp(r.position.y, camState.hy + Math.sin(t * 0.8) * 0.08 + (Math.random() - 0.5) * jitter, 3, d)
    r.position.z = damp(r.position.z, camState.hz, 3, d)

    const h = head.current
    const lerpSpeed = idle ? 0.8 : 5
    h.rotation.y = damp(h.rotation.y, pointer.nx * 0.6 * track + camState.hRotY + (idle ? Math.sin(t * 0.4) * 0.08 : 0), lerpSpeed, d)
    h.rotation.x = damp(h.rotation.x, -pointer.ny * 0.32 * track + camState.hRotX + (idle ? 0.38 : 0), lerpSpeed, d)
    h.rotation.z = damp(h.rotation.z, idle ? 0.12 : -pointer.nx * 0.07, idle ? 0.8 : 3, d)

    const blink = idle ? 0.3 : t % 4.7 > 4.58 ? 0.08 : 1
    eyes.current.forEach((e) => {
      e.scale.y = damp(e.scale.y, blink, 30, d)
    })
    pupils.current.forEach((p) => {
      p.rotation.y = damp(p.rotation.y, pointer.nx * 0.45 * track, 12, d)
      p.rotation.x = damp(p.rotation.x, -pointer.ny * 0.4 * track, 12, d)
    })

    const k = idle ? 0.6 + Math.sin(t * 1.2) * 0.4 : (rage ? 9 : 4) * (0.85 + Math.sin(t * (rage ? 18 : 3)) * 0.15)
    m.iris.color.copy(RED).multiplyScalar(k)
    eyeLight.current.intensity = rage ? 40 : idle ? 3 : 14
    ;(antenna.current.material as THREE.MeshBasicMaterial).color.copy(RED).multiplyScalar(Math.sin(t * 4) > 0 ? 4 : 0.4)

    shell.current.rotation.y += d * (rage ? 1.5 : 0.12)
    shell.current.rotation.x += d * 0.05
    rings.current.children.forEach((c, i) => {
      c.rotation.z += d * (i % 2 ? -1 : 1) * (0.3 + i * 0.15) * (rage ? 5 : 1)
    })
  })

  return (
    <group ref={root} scale={isMobile ? 0.72 : 1}>
      <group ref={head}>
        <RoundedBox args={[2.1, 2.2, 2.1]} radius={0.38} smoothness={4} material={m.armor} />
        <RoundedBox args={[0.36, 0.32, 1.9]} radius={0.1} position={[0, 1.14, 0]} material={m.armorLight} />
        <mesh position={[0, 1.31, 0.15]} material={m.red}>
          <boxGeometry args={[0.07, 0.02, 1.3]} />
        </mesh>
        <RoundedBox args={[2.02, 0.28, 0.5]} radius={0.08} position={[0, 0.72, 0.88]} material={m.armorLight} />
        <RoundedBox args={[1.86, 0.8, 0.3]} radius={0.12} position={[0, 0.18, 0.98]} material={m.visor} />
        <mesh position={[0, -0.25, 1.14]} material={m.red}>
          <boxGeometry args={[1.5, 0.022, 0.02]} />
        </mesh>
        <mesh position={[0, 0.95, 1.08]} rotation-z={Math.PI} material={m.red}>
          <circleGeometry args={[0.09, 3]} />
        </mesh>

        {[-0.46, 0.46].map((x, i) => (
          <group key={x} position={[x, 0.2, 1.14]}>
            <mesh material={m.white}>
              <torusGeometry args={[0.2, 0.011, 8, 48]} />
            </mesh>
            <mesh rotation-z={i ? 0.6 : 2.4} material={m.whiteDim}>
              <ringGeometry args={[0.25, 0.27, 40, 1, 0, Math.PI * 1.3]} />
            </mesh>
            <group ref={(g) => g && (eyes.current[i] = g)}>
              <group ref={(g) => g && (pupils.current[i] = g)}>
                <mesh material={m.iris}>
                  <sphereGeometry args={[0.13, 24, 24]} />
                </mesh>
                <mesh position-z={0.132} material={m.pupil}>
                  <circleGeometry args={[0.045, 24]} />
                </mesh>
              </group>
            </group>
          </group>
        ))}
        <pointLight ref={eyeLight} position={[0, 0.2, 1.9]} color="#FF1E1E" intensity={14} distance={6} />

        {[-1, 1].map((s) => (
          <RoundedBox key={s} args={[0.5, 0.72, 0.42]} radius={0.08} position={[s * 0.78, -0.46, 0.84]} rotation={[0, s * 0.35, 0]} material={m.armorLight} />
        ))}
        <group position={[0, -0.56, 1.05]}>
          {Array.from({ length: 7 }).map((_, i) => (
            <mesh key={i} position={[(i - 3) * 0.12, 0, 0]} material={i === 3 ? m.red : m.grill}>
              <boxGeometry args={[0.05, 0.32, 0.05]} />
            </mesh>
          ))}
        </group>
        <RoundedBox args={[1.3, 0.45, 1.5]} radius={0.12} position={[0, -1.12, 0.3]} material={m.armor} />

        {[-1, 1].map((s) => (
          <group key={s} position={[s * 1.1, 0.05, 0]} rotation={[0, 0, Math.PI / 2]}>
            <mesh material={m.armorLight}>
              <cylinderGeometry args={[0.45, 0.5, 0.3, 32]} />
            </mesh>
            <mesh position-y={-s * 0.16} rotation-x={Math.PI / 2} material={m.white}>
              <torusGeometry args={[0.32, 0.014, 8, 48]} />
            </mesh>
            <mesh position-y={-s * 0.17} material={m.red}>
              <cylinderGeometry args={[0.12, 0.12, 0.04, 24]} />
            </mesh>
          </group>
        ))}

        <group position={[0.65, 1.1, -0.3]} rotation-z={-0.15}>
          <mesh position-y={0.45} material={m.armorLight}>
            <cylinderGeometry args={[0.025, 0.04, 0.9, 8]} />
          </mesh>
          <mesh ref={antenna} position-y={0.95}>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshBasicMaterial toneMapped={false} />
          </mesh>
        </group>

        {[-0.5, 0, 0.5].map((x) => (
          <mesh key={x} position={[x, 0.2, -1.06]} material={m.red}>
            <boxGeometry args={[0.25, 0.04, 0.02]} />
          </mesh>
        ))}

        <mesh ref={shell} material={m.wire}>
          <icosahedronGeometry args={[1.95, 1]} />
        </mesh>
      </group>

      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} position={[0, -1.45 - i * 0.17, -0.05]} material={i % 2 ? m.armorLight : m.armor}>
          <cylinderGeometry args={[0.42, 0.45, 0.12, 24]} />
        </mesh>
      ))}
      {[-0.3, 0.3].map((x) => (
        <mesh key={x} position={[x, -1.75, 0.38]} rotation-x={0.25} material={m.red}>
          <cylinderGeometry args={[0.03, 0.03, 0.7, 8]} />
        </mesh>
      ))}

      <RoundedBox args={[4.4, 1.1, 2]} radius={0.42} smoothness={4} position={[0, -2.6, -0.2]} material={m.armor} />
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 2.15, -2.3, -0.2]} scale={[1, 0.7, 1]} material={m.armorLight}>
          <sphereGeometry args={[0.7, 24, 16]} />
        </mesh>
      ))}
      <RoundedBox args={[1.6, 0.8, 0.3]} radius={0.1} position={[0, -2.45, 0.85]} material={m.armorLight} />
      <mesh position={[0, -2.45, 1.01]} material={m.red}>
        <torusGeometry args={[0.22, 0.03, 8, 40]} />
      </mesh>
      <mesh position={[0, -2.45, 1.0]} material={m.iris}>
        <circleGeometry args={[0.1, 24]} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 1.2, -2.2, 0.82]} material={m.white}>
          <boxGeometry args={[0.6, 0.015, 0.015]} />
        </mesh>
      ))}

      <group ref={rings} position={[0, 0, -0.2]}>
        <mesh rotation-x={Math.PI / 2.3} material={m.holo}>
          <ringGeometry args={[2.35, 2.38, 96]} />
        </mesh>
        <mesh rotation={[Math.PI / 2.6, 0.3, 0]} material={m.holo}>
          <ringGeometry args={[2.7, 2.76, 96, 1, 0, Math.PI * 1.2]} />
        </mesh>
        <mesh rotation={[Math.PI / 1.9, -0.4, 0]} material={m.whiteDim}>
          <ringGeometry args={[3.1, 3.115, 128, 1, 0, Math.PI * 0.7]} />
        </mesh>
      </group>
    </group>
  )
}
