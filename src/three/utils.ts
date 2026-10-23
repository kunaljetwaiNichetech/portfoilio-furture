import * as THREE from 'three'

/** Ray from the camera through normalized device coords. */
export function ndcRay(camera: THREE.Camera, nx: number, ny: number, origin: THREE.Vector3, dir: THREE.Vector3) {
  camera.getWorldPosition(origin)
  dir.set(nx, ny, 0.5).unproject(camera).sub(origin).normalize()
}

export function rayToPlaneZ(origin: THREE.Vector3, dir: THREE.Vector3, z: number, out: THREE.Vector3) {
  const t = Math.abs(dir.z) < 1e-5 ? 0 : (z - origin.z) / dir.z
  return out.copy(dir).multiplyScalar(t).add(origin)
}

export const RED = new THREE.Color('#FF1E1E')
export const RED_GLOW = new THREE.Color('#FF3B3B')

/** HDR-bright red for bloom (toneMapped: false materials). */
export const hotRed = (k = 3) => RED.clone().multiplyScalar(k)
