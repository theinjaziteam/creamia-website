"use client";
import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox, Environment, Float, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

function CremiProduct() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.08;
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.08;
  });

  return (
    <group ref={groupRef}>
      {/* Main box body - clear/frosted */}
      <RoundedBox args={[2.8, 1.8, 2.2]} radius={0.08} smoothness={4} position={[0, 0, 0]}>
        <meshPhysicalMaterial
          color="#E8D9C0"
          transparent
          opacity={0.88}
          roughness={0.05}
          metalness={0}
          transmission={0.5}
          thickness={0.5}
        />
      </RoundedBox>

      {/* Biscuit base */}
      <mesh position={[0, -0.6, 0]}>
        <boxGeometry args={[2.6, 0.3, 2.0]} />
        <meshStandardMaterial color="#8B5E3C" roughness={0.8} />
      </mesh>

      {/* Cream layer */}
      <mesh position={[0, -0.15, 0]}>
        <boxGeometry args={[2.6, 0.6, 2.0]} />
        <meshStandardMaterial color="#F5ECD7" roughness={0.3} />
      </mesh>

      {/* Top cream swirl */}
      <mesh position={[0, 0.35, 0]}>
        <boxGeometry args={[2.6, 0.35, 2.0]} />
        <meshStandardMaterial color="#FBF5EC" roughness={0.2} />
      </mesh>

      {/* Label band - orange/lotus */}
      <mesh position={[0, 0, 1.125]}>
        <boxGeometry args={[2.85, 0.55, 0.05]} />
        <meshStandardMaterial color="#C4622D" roughness={0.3} />
      </mesh>

      {/* Lid */}
      <RoundedBox args={[2.85, 0.12, 2.25]} radius={0.05} smoothness={4} position={[0, 0.96, 0]}>
        <meshPhysicalMaterial color="#D0C4B0" transparent opacity={0.7} roughness={0.1} transmission={0.3} />
      </RoundedBox>
    </group>
  );
}

export default function CremiBox3D() {
  return (
    <Canvas
      camera={{ position: [0, 1.5, 6], fov: 38 }}
      style={{ width: "100%", height: "100%" }}
      dpr={[1, 2]}
    >
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 8, 5]} intensity={2.2} color="#FBF5EC" castShadow />
      <directionalLight position={[-5, 3, -3]} intensity={0.8} color="#C4622D" />
      <pointLight position={[0, 4, 2]} intensity={1.5} color="#C4871F" />

      <Float speed={2} rotationIntensity={0.4} floatIntensity={0.6}>
        <CremiProduct />
      </Float>

      <ContactShadows
        position={[0, -1.5, 0]}
        opacity={0.4}
        scale={8}
        blur={2.5}
        far={4}
        color="#2C1810"
      />

      <Environment preset="apartment" />
    </Canvas>
  );
}
