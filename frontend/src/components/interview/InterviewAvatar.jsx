import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Sphere } from '@react-three/drei'
import './InterviewAvatar.css'

function AnimatedHead({ speaking }) {
  const meshRef = useRef()
  const time = useRef(0)

  useFrame((state, delta) => {
    time.current += delta
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(time.current * 0.5) * 0.1
      if (speaking) {
        meshRef.current.scale.y = 1 + Math.sin(time.current * 5) * 0.05
      }
    }
  })

  return (
    <group ref={meshRef}>
      {/* Head */}
      <Sphere args={[1, 32, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#FFC107" roughness={0.3} metalness={0.5} />
      </Sphere>
      {/* Left Eye */}
      <Sphere args={[0.15, 16, 16]} position={[-0.3, 0.2, 0.8]}>
        <meshStandardMaterial color="#000000" />
      </Sphere>
      {/* Right Eye */}
      <Sphere args={[0.15, 16, 16]} position={[0.3, 0.2, 0.8]}>
        <meshStandardMaterial color="#000000" />
      </Sphere>
      {/* Mouth */}
      <Sphere args={[0.3, 16, 16]} position={[0, -0.3, 0.8]}>
        <meshStandardMaterial color="#333333" />
      </Sphere>
    </group>
  )
}

function InterviewAvatar({ speaking = false }) {
  return (
    <div className="interview-avatar">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.3} penumbra={1} />
        <pointLight position={[-10, -10, -10]} color="#FFC107" intensity={0.5} />
        <AnimatedHead speaking={speaking} />
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
      <div className="avatar-status">
        <div className={`status-indicator ${speaking ? 'speaking' : ''}`} />
        <span>{speaking ? 'AI Speaking...' : 'AI Listening'}</span>
      </div>
    </div>
  )
}

export default InterviewAvatar
