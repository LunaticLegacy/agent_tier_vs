import { memo, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const COUNT = 1200
const GRID = 40 // 40x30 grid layout
const SPACING = 1.4
const COOL = new THREE.Color('#2E3A4A')
const WARM = new THREE.Color('#FF5C38')

function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null)
  const mouse = useRef(new THREE.Vector2(999, 999))

  const { basePositions, colors, seeds } = useMemo(() => {
    const basePositions = new Float32Array(COUNT * 3)
    const colors = new Float32Array(COUNT * 3)
    const seeds = new Float32Array(COUNT)
    for (let i = 0; i < COUNT; i++) {
      const gx = (i % GRID) - GRID / 2
      const gy = Math.floor(i / GRID) - Math.ceil(COUNT / GRID) / 2
      basePositions[i * 3] = gx * SPACING + (Math.random() - 0.5) * 0.6
      basePositions[i * 3 + 1] = gy * SPACING + (Math.random() - 0.5) * 0.6
      basePositions[i * 3 + 2] = 0
      const c = Math.random() < 0.3 ? WARM : COOL
      colors[i * 3] = c.r
      colors[i * 3 + 1] = c.g
      colors[i * 3 + 2] = c.b
      seeds[i] = Math.random() * Math.PI * 2
    }
    return { basePositions, colors, seeds }
  }, [])

  const displacement = useMemo(() => new Float32Array(COUNT * 2), [])

  useFrame(({ clock, camera, pointer }) => {
    const points = pointsRef.current
    if (!points) return
    // convert pointer to world coords at z=0 plane
    const vec = new THREE.Vector3(pointer.x, pointer.y, 0.5).unproject(camera)
    const dir = vec.sub(camera.position).normalize()
    const dist = -camera.position.z / dir.z
    const world = camera.position.clone().add(dir.multiplyScalar(dist))
    mouse.current.set(world.x, world.y)

    const t = clock.getElapsedTime()
    const pos = points.geometry.attributes.position.array as Float32Array
    const repelR = 2.2 // ~120px equivalent in world units
    for (let i = 0; i < COUNT; i++) {
      const bx = basePositions[i * 3]
      const by = basePositions[i * 3 + 1]
      const dx = bx - mouse.current.x
      const dy = by - mouse.current.y
      const d = Math.hypot(dx, dy)
      if (d < repelR && d > 0.0001) {
        const f = ((repelR - d) / repelR) * 0.35
        displacement[i * 2] += (dx / d) * f
        displacement[i * 2 + 1] += (dy / d) * f
      }
      // lerp decay
      displacement[i * 2] *= 0.95
      displacement[i * 2 + 1] *= 0.95
      pos[i * 3] = bx + Math.sin(t * 0.4 + seeds[i]) * 0.25 + displacement[i * 2]
      pos[i * 3 + 1] = by + Math.cos(t * 0.3 + seeds[i]) * 0.25 + displacement[i * 2 + 1]
    }
    points.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[basePositions.slice(), 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.09} vertexColors transparent opacity={0.85} sizeAttenuation />
    </points>
  )
}

function HeroParticlesInner() {
  return (
    <Canvas
      camera={{ position: [0, 0, 22], fov: 50 }}
      dpr={[1, 1.5]}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      gl={{ antialias: false, alpha: true }}
    >
      <ParticleField />
    </Canvas>
  )
}

export default memo(HeroParticlesInner)
