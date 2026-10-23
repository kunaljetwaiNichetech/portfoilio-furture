import { useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Bloom, ChromaticAberration, EffectComposer, Glitch, Noise, Scanline, Vignette } from '@react-three/postprocessing'
import { BlendFunction, GlitchMode } from 'postprocessing'
import * as THREE from 'three'
import { pointer, useUI } from '../lib/state'
import { reducedMotion } from '../lib/env'

export default function Effects() {
  const rage = useUI((s) => s.rage)
  const caOffset = useMemo(() => new THREE.Vector2(0.0009, 0.0009), [])
  const glitch = useMemo(
    () => ({
      delay: new THREE.Vector2(5, 12),
      duration: new THREE.Vector2(0.1, 0.3),
      strength: new THREE.Vector2(0.04, 0.12),
    }),
    [],
  )

  useFrame(() => {
    const base = rage ? 0.006 : 0.0008
    caOffset.set(base + Math.abs(pointer.nx) * 0.0012, base + Math.abs(pointer.ny) * 0.0008)
  })

  return (
    <EffectComposer multisampling={0}>
      <Bloom mipmapBlur intensity={rage ? 2.2 : 1.25} luminanceThreshold={0.25} luminanceSmoothing={0.85} radius={0.75} />
      <ChromaticAberration offset={caOffset} radialModulation={false} modulationOffset={0} blendFunction={BlendFunction.NORMAL} />
      <Glitch
        active={!reducedMotion}
        delay={glitch.delay}
        duration={glitch.duration}
        strength={glitch.strength}
        mode={rage ? GlitchMode.CONSTANT_WILD : GlitchMode.SPORADIC}
        ratio={0.85}
      />
      <Noise premultiply blendFunction={BlendFunction.SCREEN} opacity={0.35} />
      <Scanline blendFunction={BlendFunction.OVERLAY} density={1.35} opacity={0.18} />
      <Vignette eskil={false} offset={0.22} darkness={0.85} />
    </EffectComposer>
  )
}
