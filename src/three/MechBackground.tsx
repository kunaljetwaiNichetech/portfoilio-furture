import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { pointer, useUI } from '../lib/state'

function gearGeometry(teeth: number, r: number, depth = 0.25, toothH = 0.2) {
  const shape = new THREE.Shape()
  const step = (Math.PI * 2) / teeth
  const polar = (rad: number, a: number) => [Math.cos(a) * rad, Math.sin(a) * rad] as const
  for (let i = 0; i < teeth; i++) {
    const a = i * step
    const pts = [polar(r, a), polar(r + toothH, a + step * 0.15), polar(r + toothH, a + step * 0.45), polar(r, a + step * 0.6), polar(r, a + step)]
    pts.forEach(([x, y], j) => (i === 0 && j === 0 ? shape.moveTo(x, y) : shape.lineTo(x, y)))
  }
  const hub = new THREE.Path()
  hub.absarc(0, 0, r * 0.3, 0, Math.PI * 2, true)
  shape.holes.push(hub)
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2
    const h = new THREE.Path()
    h.absarc(Math.cos(a) * r * 0.65, Math.sin(a) * r * 0.65, r * 0.16, 0, Math.PI * 2, true)
    shape.holes.push(h)
  }
  const geo = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false, curveSegments: 12 })
  geo.center()
  return geo
}

function circuitGeometry(seed = 7) {
  let s = seed
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647)
  const pts: number[] = []
  for (let n = 0; n < 70; n++) {
    let x = Math.round((rnd() - 0.5) * 40)
    let y = Math.round((rnd() - 0.5) * 22)
    for (let k = 0; k < 5; k++) {
      const horizontal = rnd() > 0.5
      const len = Math.round(1 + rnd() * 5) * (rnd() > 0.5 ? 1 : -1)
      const nx = horizontal ? x + len : x
      const ny = horizontal ? y : y + len
      pts.push(x, y, 0, nx, ny, 0)
      x = nx
      y = ny
    }
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3))
  return g
}

const GEARS = [
  { p: [-6.5, 3, -9], r: 1.6, t: 24, s: 0.25, layer: 0 },
  { p: [-4.3, 1.4, -9], r: 0.9, t: 14, s: -0.43, layer: 0 },
  { p: [6.8, -2.2, -10], r: 2.2, t: 32, s: -0.15, layer: 1 },
  { p: [5.2, 2.8, -12], r: 1.2, t: 18, s: 0.3, layer: 1 },
  { p: [-7.5, -3.4, -11], r: 1.4, t: 20, s: 0.2, layer: 1 },
  { p: [0.5, 5.5, -14], r: 2.8, t: 40, s: 0.08, layer: 2 },
] as const

/** Parallax layers of rotating gears and wireframe circuitry behind the robot. */
export default function MechBackground() {
  const layers = useRef<THREE.Group[]>([])
  const gearRefs = useRef<THREE.Group[]>([])
  const circuitMat = useRef<THREE.LineBasicMaterial>(null!)

  const geos = useMemo(() => GEARS.map((g) => gearGeometry(g.t, g.r)), [])
  const edges = useMemo(() => geos.map((g) => new THREE.EdgesGeometry(g, 25)), [geos])
  const circuit = useMemo(() => circuitGeometry(), [])
  const circuitRed = useMemo(() => circuitGeometry(91), [])
  const mats = useMemo(
    () => ({
      metal: new THREE.MeshStandardMaterial({ color: '#0d0d0d', metalness: 0.95, roughness: 0.35 }),
      edge: new THREE.LineBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.22 }),
      edgeRed: new THREE.LineBasicMaterial({ color: '#FF1E1E', transparent: true, opacity: 0.5 }),
    }),
    [],
  )

  useFrame((state, dt) => {
    const d = Math.min(dt, 0.05)
    const rage = useUI.getState().rage ? 6 : 1
    gearRefs.current.forEach((g, i) => (g.rotation.z += d * GEARS[i].s * rage))
    layers.current.forEach((l, i) => {
      const depth = 0.4 + i * 0.5
      l.position.x = THREE.MathUtils.damp(l.position.x, -pointer.nx * depth, 2, d)
      l.position.y = THREE.MathUtils.damp(l.position.y, -pointer.ny * depth * 0.6, 2, d)
    })
    circuitMat.current.opacity = 0.25 + Math.sin(state.clock.elapsedTime * 1.5) * 0.15
  })

  return (
    <group>
      {[0, 1, 2].map((layer) => (
        <group key={layer} ref={(g) => g && (layers.current[layer] = g)}>
          {GEARS.map((g, i) =>
            g.layer === layer ? (
              <group key={i} position={g.p as unknown as [number, number, number]} rotation-x={0.25} ref={(el) => el && (gearRefs.current[i] = el)}>
                <mesh geometry={geos[i]} material={mats.metal} />
                <lineSegments geometry={edges[i]} material={i % 2 ? mats.edgeRed : mats.edge} />
              </group>
            ) : null,
          )}
          {layer === 2 && (
            <>
              <lineSegments geometry={circuit} position={[0, 0, -16]}>
                <lineBasicMaterial color="#ffffff" transparent opacity={0.08} />
              </lineSegments>
              <lineSegments geometry={circuitRed} position={[0, 0, -15.8]}>
                <lineBasicMaterial ref={circuitMat} color="#FF1E1E" transparent opacity={0.3} />
              </lineSegments>
            </>
          )}
        </group>
      ))}
    </group>
  )
}
