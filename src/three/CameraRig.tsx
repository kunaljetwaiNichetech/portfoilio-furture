import { useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { camState, pointer, useUI } from '../lib/state'

const damp = THREE.MathUtils.damp

/** Follows the GSAP-tweened camState plus mouse parallax; shakes in rage mode. */
export default function CameraRig() {
  const look = useMemo(() => new THREE.Vector3(), [])

  useFrame((state, dt) => {
    const d = Math.min(dt, 0.05)
    const cam = state.camera
    const shake = useUI.getState().rage ? 0.09 : 0
    cam.position.x = damp(cam.position.x, camState.cx + pointer.nx * 0.7, 2.5, d) + (Math.random() - 0.5) * shake
    cam.position.y = damp(cam.position.y, camState.cy + pointer.ny * 0.4, 2.5, d) + (Math.random() - 0.5) * shake
    cam.position.z = damp(cam.position.z, camState.cz, 2.5, d)
    look.x = damp(look.x, camState.lx, 3, d)
    look.y = damp(look.y, camState.ly, 3, d)
    look.z = damp(look.z, camState.lz, 3, d)
    cam.lookAt(look)
  })

  return null
}
