import { Environment, Lightformer } from '@react-three/drei'

/** Local procedural environment map (no HDR download) for metallic reflections. */
export default function StudioEnv() {
  return (
    <Environment resolution={128} frames={1}>
      <Lightformer form="rect" intensity={2} color="#ffffff" position={[0, 4, 4]} scale={[8, 1, 1]} />
      <Lightformer form="rect" intensity={1.2} color="#ffffff" position={[-5, 0, 2]} rotation-y={Math.PI / 2} scale={[6, 2, 1]} />
      <Lightformer form="rect" intensity={3} color="#FF1E1E" position={[5, -1, 1]} rotation-y={-Math.PI / 2} scale={[6, 2, 1]} />
      <Lightformer form="ring" intensity={2} color="#FF1E1E" position={[0, -4, -3]} scale={3} />
    </Environment>
  )
}
