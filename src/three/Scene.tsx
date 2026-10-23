import { Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Grid, PerformanceMonitor } from '@react-three/drei'
import { lowPower } from '../lib/env'
import { useUI } from '../lib/state'
import RobotHead from './RobotHead'
import Drones from './Drones'
import ParticleField from './ParticleField'
import MechBackground from './MechBackground'
import CameraRig from './CameraRig'
import EnergyPulses from './EnergyPulses'
import Effects from './Effects'
import StudioEnv from './StudioEnv'

const maxDpr = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, lowPower ? 1.5 : 2)

/** Fixed full-screen background scene shared by every section. Degrades itself if FPS drops. */
export default function Scene() {
  const setSceneReady = useUI((s) => s.setSceneReady)
  const [dpr, setDpr] = useState(Math.max(1, maxDpr))
  const [degraded, setDegraded] = useState(lowPower)

  const decline = () => {
    setDpr(1)
    setDegraded(true)
  }

  return (
    <Canvas
      className="!pointer-events-none"
      dpr={dpr}
      gl={{ antialias: false, powerPreference: 'high-performance', stencil: false }}
      camera={{ position: [0, 0, 7], fov: 42, near: 0.1, far: 60 }}
      onCreated={() => setSceneReady(true)}
    >
      <PerformanceMonitor onDecline={decline} onFallback={decline} flipflops={3} />
      <color attach="background" args={['#000000']} />
      <fog attach="fog" args={['#000000', 9, 26]} />
      <ambientLight intensity={0.15} />
      <directionalLight position={[-4, 5, 3]} intensity={1.6} color="#ffffff" />
      <directionalLight position={[5, -2, -4]} intensity={2.4} color="#FF1E1E" />
      <pointLight position={[0, -3.5, 2]} intensity={20} distance={10} color="#FF1E1E" />

      <Suspense fallback={null}>
        <StudioEnv />
        <RobotHead />
        <Drones count={lowPower ? 6 : 14} />
        <ParticleField count={lowPower ? 600 : 1800} />
        {!degraded && <MechBackground />}
        <Grid
          position={[0, -3.6, 0]}
          args={[60, 60]}
          cellSize={0.6}
          cellThickness={0.6}
          cellColor="#8B0000"
          sectionSize={3}
          sectionThickness={1.2}
          sectionColor="#FF1E1E"
          fadeDistance={28}
          fadeStrength={1.5}
          infiniteGrid
        />
        <EnergyPulses />
        {!degraded && <Effects />}
      </Suspense>
      <CameraRig />
    </Canvas>
  )
}
