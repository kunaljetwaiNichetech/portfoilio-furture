import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Html, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { lowPower } from '../lib/env'
import { useUI } from '../lib/state'
import { RED } from './utils'

function Tags({ skills, radius }: { skills: string[]; radius: number }) {
  const els = useRef<HTMLDivElement[]>([])
  const points = useMemo(() => {
    const n = skills.length
    const golden = Math.PI * (3 - Math.sqrt(5))
    return skills.map((_, i) => {
      const y = 1 - (i / (n - 1)) * 2
      const r = Math.sqrt(1 - y * y)
      const th = golden * i
      return new THREE.Vector3(Math.cos(th) * r * radius, y * radius, Math.sin(th) * r * radius)
    })
  }, [skills, radius])
  const v = useMemo(() => new THREE.Vector3(), [])
  const camDir = useMemo(() => new THREE.Vector3(), [])

  useFrame(({ camera }) => {
    camDir.copy(camera.position).normalize()
    points.forEach((p, i) => {
      const el = els.current[i]
      if (!el) return
      const facing = (v.copy(p).normalize().dot(camDir) + 1) / 2
      el.style.opacity = String(0.15 + facing * 0.85)
      el.style.transform = `scale(${0.7 + facing * 0.5})`
      el.style.color = facing > 0.8 ? '#FF1E1E' : '#FFFFFF'
    })
  })

  return (
    <>
      {points.map((p, i) => (
        <Html key={skills[i]} position={p} center pointerEvents="none" zIndexRange={[20, 0]}>
          <div
            ref={(el) => el && (els.current[i] = el)}
            className="whitespace-nowrap font-mono text-[11px] font-bold uppercase tracking-widest"
            style={{ textShadow: '0 0 10px rgba(255,30,30,.9)' }}
          >
            {skills[i]}
          </div>
        </Html>
      ))}
    </>
  )
}

function Core() {
  const ref = useRef<THREE.Group>(null!)
  useFrame((_, dt) => {
    const k = useUI.getState().rage ? 6 : 1
    ref.current.rotation.y += dt * 0.4 * k
    ref.current.rotation.x += dt * 0.15 * k
  })
  return (
    <group ref={ref}>
      <mesh>
        <icosahedronGeometry args={[1.2, 1]} />
        <meshBasicMaterial color={RED.clone().multiplyScalar(2)} wireframe toneMapped={false} />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[0.7, 0]} />
        <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.4} />
      </mesh>
      {[0, 1, 2].map((i) => (
        <mesh key={i} rotation={[i * 1.05, i * 0.6, 0]}>
          <torusGeometry args={[3.55, 0.006, 6, 160]} />
          <meshBasicMaterial color={i === 1 ? '#FF1E1E' : '#ffffff'} transparent opacity={0.25} />
        </mesh>
      ))}
    </group>
  )
}

export default function SkillSphere({ skills, active }: { skills: string[]; active: boolean }) {
  const rage = useUI((s) => s.rage)
  return (
    <Canvas
      dpr={[1, lowPower ? 1.25 : 1.75]}
      frameloop={active ? 'always' : 'never'}
      camera={{ position: [0, 0, 9.5], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
    >
      <Core />
      <Tags skills={skills} radius={3.4} />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={rage ? 10 : 1.4} rotateSpeed={0.6} enableDamping />
    </Canvas>
  )
}
