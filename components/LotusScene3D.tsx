"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox, Float } from "@react-three/drei";
import * as THREE from "three";

/* ── Lotus Biscuit ──────────────────────────────────────────────────────────── */
function LotisBiscuit({ zoomed }: { zoomed: boolean }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current || !zoomed) return;
    const t = state.clock.elapsedTime;
    groupRef.current.rotation.y = Math.sin(t * 0.55) * 0.3;
    groupRef.current.rotation.x = Math.sin(t * 0.35) * 0.1;
    groupRef.current.position.y = Math.sin(t * 0.65) * 0.14;
  });

  return (
    <group ref={groupRef}>
      <Float speed={1.8} rotationIntensity={0.25} floatIntensity={0.35}>

        {/* Main biscuit body */}
        <RoundedBox args={[4.0, 2.5, 0.36]} radius={0.14} smoothness={6} castShadow>
          <meshStandardMaterial color="#C47A2A" roughness={0.7} metalness={0.08} />
        </RoundedBox>

        {/* Inner border ridge */}
        <RoundedBox args={[3.68, 2.2, 0.42]} radius={0.1} smoothness={4} position={[0, 0, -0.02]}>
          <meshStandardMaterial color="#B5661A" roughness={0.82} metalness={0.04} />
        </RoundedBox>

        {/* Inner oval impression */}
        <RoundedBox args={[2.85, 1.62, 0.06]} radius={0.08} smoothness={4} position={[0, 0, 0.2]}>
          <meshStandardMaterial color="#A85C14" roughness={0.88} metalness={0.02} />
        </RoundedBox>

        {/* Surface dot grid (simulates biscuit texture) */}
        {Array.from({ length: 4 }).map((_, row) =>
          Array.from({ length: 7 }).map((_, col) => (
            <mesh
              key={`dot-${row}-${col}`}
              position={[-2.4 + col * 0.78, -0.6 + row * 0.4, 0.22]}
            >
              <cylinderGeometry args={[0.038, 0.038, 0.055, 6]} />
              <meshStandardMaterial color="#9A5010" roughness={0.92} />
            </mesh>
          ))
        )}

        {/* "Lotus" lettering — L */}
        <mesh position={[-1.02, 0.0, 0.25]}>
          <boxGeometry args={[0.08, 0.55, 0.055]} />
          <meshStandardMaterial color="#824510" roughness={0.9} />
        </mesh>
        <mesh position={[-0.84, -0.24, 0.25]}>
          <boxGeometry args={[0.26, 0.075, 0.055]} />
          <meshStandardMaterial color="#824510" roughness={0.9} />
        </mesh>

        {/* o */}
        <mesh position={[-0.52, 0.0, 0.25]}>
          <torusGeometry args={[0.16, 0.046, 8, 14]} />
          <meshStandardMaterial color="#824510" roughness={0.9} />
        </mesh>

        {/* t */}
        <mesh position={[-0.14, 0.04, 0.25]}>
          <boxGeometry args={[0.08, 0.5, 0.055]} />
          <meshStandardMaterial color="#824510" roughness={0.9} />
        </mesh>
        <mesh position={[-0.14, 0.17, 0.25]}>
          <boxGeometry args={[0.26, 0.075, 0.055]} />
          <meshStandardMaterial color="#824510" roughness={0.9} />
        </mesh>

        {/* u */}
        <mesh position={[0.22, 0.04, 0.25]}>
          <boxGeometry args={[0.075, 0.46, 0.055]} />
          <meshStandardMaterial color="#824510" roughness={0.9} />
        </mesh>
        <mesh position={[0.48, 0.04, 0.25]}>
          <boxGeometry args={[0.075, 0.46, 0.055]} />
          <meshStandardMaterial color="#824510" roughness={0.9} />
        </mesh>
        <mesh position={[0.35, -0.19, 0.25]}>
          <boxGeometry args={[0.33, 0.075, 0.055]} />
          <meshStandardMaterial color="#824510" roughness={0.9} />
        </mesh>

        {/* s — three bars */}
        <mesh position={[0.78, 0.12, 0.25]}>
          <boxGeometry args={[0.24, 0.07, 0.055]} />
          <meshStandardMaterial color="#824510" roughness={0.9} />
        </mesh>
        <mesh position={[0.78, 0.0, 0.25]}>
          <boxGeometry args={[0.24, 0.07, 0.055]} />
          <meshStandardMaterial color="#824510" roughness={0.9} />
        </mesh>
        <mesh position={[0.78, -0.12, 0.25]}>
          <boxGeometry args={[0.24, 0.07, 0.055]} />
          <meshStandardMaterial color="#824510" roughness={0.9} />
        </mesh>

      </Float>
    </group>
  );
}

/* ── Milk Particles ─────────────────────────────────────────────────────────── */
function MilkParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  const COUNT = 90;

  const { positions, velocities } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const velocities = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * 0.4;
      positions[i * 3]     = Math.cos(angle) * r;
      positions[i * 3 + 1] = -1.35;
      positions[i * 3 + 2] = Math.sin(angle) * r;
      velocities[i * 3]     = (Math.random() - 0.5) * 0.055;
      velocities[i * 3 + 1] = Math.random() * 0.11 + 0.035;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.055;
    }
    return { positions, velocities };
  }, []);

  useFrame(() => {
    if (!pointsRef.current) return;
    const pos = pointsRef.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < COUNT; i++) {
      pos[i * 3]     += velocities[i * 3];
      pos[i * 3 + 1] += velocities[i * 3 + 1];
      pos[i * 3 + 2] += velocities[i * 3 + 2];
      velocities[i * 3 + 1] -= 0.0018; // gravity

      if (pos[i * 3 + 1] < -1.35) {
        pos[i * 3 + 1] = -1.35;
        velocities[i * 3 + 1] *= -0.35;
        if (Math.random() > 0.94) {
          const a = Math.random() * Math.PI * 2;
          pos[i * 3]     = Math.cos(a) * Math.random() * 0.28;
          pos[i * 3 + 2] = Math.sin(a) * Math.random() * 0.28;
          velocities[i * 3 + 1] = Math.random() * 0.09 + 0.025;
        }
      }
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial color="#FFFFFF" size={0.055} transparent opacity={0.72} sizeAttenuation />
    </points>
  );
}

/* ── Milk Pool ──────────────────────────────────────────────────────────────── */
function MilkPool() {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((s) => {
    if (!meshRef.current) return;
    (meshRef.current.material as THREE.MeshStandardMaterial).opacity =
      0.55 + Math.sin(s.clock.elapsedTime * 1.4) * 0.1;
  });
  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.36, 0]}>
      <circleGeometry args={[2.6, 48]} />
      <meshStandardMaterial color="#F8F4EE" transparent opacity={0.55} roughness={0.08} metalness={0.06} />
    </mesh>
  );
}

/* ── Camera zoom-in on mount ────────────────────────────────────────────────── */
function CameraZoom({ ready }: { ready: boolean }) {
  useFrame(({ camera }) => {
    if (!ready) return;
    const cam = camera as THREE.PerspectiveCamera;
    const target = 7;
    if (Math.abs(cam.position.z - target) > 0.01) {
      cam.position.z += (target - cam.position.z) * 0.04;
    }
  });
  return null;
}

/* ── Scene ──────────────────────────────────────────────────────────────────── */
function Scene({ ready }: { ready: boolean }) {
  return (
    <>
      <ambientLight intensity={0.65} color="#FFE4C0" />
      <pointLight position={[4, 5, 4]}  intensity={2.2} color="#FFCC88" castShadow />
      <pointLight position={[-4, 2, 3]} intensity={0.9} color="#C4622D" />
      <pointLight position={[0, -2, 5]} intensity={0.5} color="#FFFFFF" />
      <MilkPool />
      <MilkParticles />
      <LotisBiscuit zoomed={ready} />
      <CameraZoom ready={ready} />
    </>
  );
}

/* ── Export ─────────────────────────────────────────────────────────────────── */
export default function LotusScene3D() {
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), 200); return () => clearTimeout(t); }, []);

  return (
    <Canvas
      camera={{ position: [0, 0.5, 12], fov: 42 }}
      gl={{ antialias: true, alpha: true }}
      style={{ width: "100%", height: "100%", background: "transparent" }}
      shadows
    >
      <Scene ready={ready} />
    </Canvas>
  );
}
