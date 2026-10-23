import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import { lowPower } from '../lib/env'
import { pointer } from '../lib/state'
import { RED } from './utils'
import StudioEnv from './StudioEnv'

const L1 = 2.3
const L2 = 2.1
const damp = THREE.MathUtils.damp

function Arm() {
  const root = useRef<THREE.Group>(null!)
  const upper = useRef<THREE.Group>(null!)
  const fore = useRef<THREE.Group>(null!)
  const wrist = useRef<THREE.Group>(null!)
  const fingers = useRef<THREE.Group[]>([])
  const tips = useRef<THREE.Group[]>([])
  const target = useMemo(() => new THREE.Vector2(), [])

  const m = useMemo(
    () => ({
      armor: new THREE.MeshStandardMaterial({ color: '#141414', metalness: 0.9, roughness: 0.3 }),
      joint: new THREE.MeshStandardMaterial({ color: '#262626', metalness: 0.8, roughness: 0.25 }),
      red: new THREE.MeshBasicMaterial({ color: RED.clone().multiplyScalar(3), toneMapped: false }),
      white: new THREE.MeshBasicMaterial({ color: '#ffffff' }),
      piston: new THREE.MeshStandardMaterial({ color: '#bbbbbb', metalness: 1, roughness: 0.15 }),
    }),
    [],
  )

  useFrame((state, dt) => {
    const d = Math.min(dt, 0.05)
    const rect = state.gl.domElement.getBoundingClientRect()
    const nx = ((pointer.x - rect.left) / rect.width) * 2 - 1
    const ny = -((pointer.y - rect.top) / rect.height) * 2 + 1
    const { width, height } = state.viewport

    const sx = width / 2 - 1.4
    const sy = -height / 2 + 0.4
    root.current.position.set(sx, sy, 0)

    target.set((nx * width) / 2 - sx, (ny * height) / 2 - sy)
    const dist = THREE.MathUtils.clamp(target.length(), 0.6, L1 + L2 - 0.05)
    const base = Math.atan2(target.y, target.x)
    const a1 = Math.acos(THREE.MathUtils.clamp((L1 * L1 + dist * dist - L2 * L2) / (2 * L1 * dist), -1, 1))
    const a2 = Math.acos(THREE.MathUtils.clamp((L1 * L1 + L2 * L2 - dist * dist) / (2 * L1 * L2), -1, 1))

    upper.current.rotation.z = damp(upper.current.rotation.z, base + a1, 6, d)
    fore.current.rotation.z = damp(fore.current.rotation.z, -(Math.PI - a2), 6, d)
    wrist.current.rotation.z = damp(wrist.current.rotation.z, Math.sin(state.clock.elapsedTime * 2) * 0.12, 4, d)
    fore.current.rotation.x = damp(fore.current.rotation.x, nx * 0.6, 3, d)

    const reaching = target.length() < L1 + L2 + 0.5
    const curl = pointer.down ? 1.25 : reaching ? 0.15 : 0.6
    fingers.current.forEach((f, i) => {
      f.rotation.z = damp(f.rotation.z, -curl * (i === 0 ? -0.8 : 1), 8, d)
    })
    tips.current.forEach((f, i) => {
      f.rotation.z = damp(f.rotation.z, -curl * 1.1 * (i === 0 ? -0.8 : 1), 8, d)
    })
  })

  const finger = (i: number, y: number, z: number, len: number) => (
    <group key={i} position={[0.42, y, z]} ref={(g) => g && (fingers.current[i] = g)}>
      <mesh position={[len / 2, 0, 0]} material={m.armor}>
        <boxGeometry args={[len, 0.09, 0.1]} />
      </mesh>
      <mesh position={[0, 0, 0]} material={m.red}>
        <sphereGeometry args={[0.055, 10, 10]} />
      </mesh>
      <group position={[len, 0, 0]} ref={(g) => g && (tips.current[i] = g)}>
        <mesh position={[len * 0.4, 0, 0]} material={m.joint}>
          <boxGeometry args={[len * 0.8, 0.08, 0.09]} />
        </mesh>
        <mesh position={[len * 0.8, 0, 0]} material={m.white}>
          <boxGeometry args={[0.03, 0.08, 0.1]} />
        </mesh>
      </group>
    </group>
  )

  return (
    <group ref={root} rotation-y={-0.35}>
      <mesh rotation-x={Math.PI / 2} position={[0, -0.2, 0]} material={m.joint}>
        <cylinderGeometry args={[0.7, 0.85, 0.4, 32]} />
      </mesh>
      <group ref={upper}>
        <mesh material={m.joint}>
          <sphereGeometry args={[0.42, 24, 24]} />
        </mesh>
        <mesh material={m.red}>
          <torusGeometry args={[0.44, 0.025, 8, 40]} />
        </mesh>
        <RoundedBox args={[L1, 0.42, 0.46]} radius={0.12} position={[L1 / 2, 0, 0]} material={m.armor} />
        <mesh position={[L1 / 2, 0.26, 0]} rotation-z={Math.PI / 2} material={m.piston}>
          <cylinderGeometry args={[0.04, 0.04, L1 * 0.7, 8]} />
        </mesh>
        <mesh position={[L1 / 2, 0, 0.24]} material={m.red}>
          <boxGeometry args={[L1 * 0.6, 0.03, 0.01]} />
        </mesh>

        <group ref={fore} position={[L1, 0, 0]}>
          <mesh material={m.joint}>
            <sphereGeometry args={[0.34, 24, 24]} />
          </mesh>
          <mesh rotation-x={Math.PI / 2} material={m.red}>
            <torusGeometry args={[0.36, 0.022, 8, 40]} />
          </mesh>
          <RoundedBox args={[L2, 0.34, 0.38]} radius={0.1} position={[L2 / 2, 0, 0]} material={m.armor} />
          <mesh position={[L2 / 2, -0.22, 0]} rotation-z={Math.PI / 2} material={m.piston}>
            <cylinderGeometry args={[0.035, 0.035, L2 * 0.7, 8]} />
          </mesh>
          {[0.3, 0.5, 0.7].map((f) => (
            <mesh key={f} position={[L2 * f, 0, 0.2]} material={m.white}>
              <boxGeometry args={[0.05, 0.2, 0.01]} />
            </mesh>
          ))}

          <group ref={wrist} position={[L2, 0, 0]}>
            <mesh material={m.joint}>
              <sphereGeometry args={[0.22, 16, 16]} />
            </mesh>
            <RoundedBox args={[0.6, 0.5, 0.2]} radius={0.06} position={[0.3, 0, 0]} material={m.armor} />
            <mesh position={[0.3, 0, 0.11]} material={m.red}>
              <circleGeometry args={[0.08, 20]} />
            </mesh>
            {finger(1, 0.18, 0, 0.32)}
            {finger(2, 0.06, 0, 0.36)}
            {finger(3, -0.06, 0, 0.34)}
            {finger(4, -0.18, 0, 0.28)}
            <group position={[-0.28, 0.27, 0]} rotation-z={0.9}>
              {finger(0, 0, 0, 0.26)}
            </group>
          </group>
        </group>
      </group>
    </group>
  )
}

export default function RobotArm({ active }: { active: boolean }) {
  return (
    <Canvas
      dpr={[1, lowPower ? 1.25 : 1.75]}
      frameloop={active ? 'always' : 'never'}
      camera={{ position: [0, 0, 8], fov: 40 }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.2} />
      <directionalLight position={[-3, 4, 5]} intensity={2} />
      <pointLight position={[3, -2, 2]} intensity={25} color="#FF1E1E" distance={10} />
      <StudioEnv />
      <Arm />
    </Canvas>
  )
}
