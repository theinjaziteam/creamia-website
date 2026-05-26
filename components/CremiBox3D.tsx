"use client";
import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

// ─── Lotus Biscuit Disc ───────────────────────────────────────────────────────
function LotusBiscuit({
  position,
  rotationSpeed,
  fallSpeed,
  phase,
}: {
  position: [number, number, number];
  rotationSpeed: [number, number, number];
  fallSpeed: number;
  phase: number;
}) {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    // Fall down, loop back to top
    const loopHeight = 24;
    const y = position[1] - ((t * fallSpeed + phase) % loopHeight);
    ref.current.position.set(position[0], y, position[2]);
    ref.current.rotation.x += rotationSpeed[0];
    ref.current.rotation.y += rotationSpeed[1];
    ref.current.rotation.z += rotationSpeed[2];
  });

  return (
    <group ref={ref} position={position}>
      {/* Biscuit disc body */}
      <mesh>
        <cylinderGeometry args={[0.52, 0.52, 0.09, 40]} />
        <meshStandardMaterial color="#C4871F" roughness={0.55} metalness={0.08} />
      </mesh>
      {/* Top face — embossed grid lines */}
      {([-0.24, 0, 0.24] as number[]).map((x) => (
        <mesh key={`hx${x}`} position={[x, 0.049, 0]}>
          <boxGeometry args={[0.035, 0.015, 0.88]} />
          <meshStandardMaterial color="#9A6018" roughness={0.9} />
        </mesh>
      ))}
      {([-0.24, 0, 0.24] as number[]).map((z) => (
        <mesh key={`hz${z}`} position={[0, 0.049, z]}>
          <boxGeometry args={[0.88, 0.015, 0.035]} />
          <meshStandardMaterial color="#9A6018" roughness={0.9} />
        </mesh>
      ))}
      {/* Rim edge */}
      <mesh>
        <torusGeometry args={[0.52, 0.045, 8, 40]} />
        <meshStandardMaterial color="#8B5C14" roughness={0.65} />
      </mesh>
    </group>
  );
}

// ─── Product Box ─────────────────────────────────────────────────────────────
function ProductBox() {
  const groupRef = useRef<THREE.Group>(null);
  const progress = useRef(0);

  useFrame((state) => {
    if (!groupRef.current) return;
    // Pop-in: cubic ease-out spring
    progress.current = Math.min(1, progress.current + 0.018);
    const ease = 1 - Math.pow(1 - progress.current, 3);
    groupRef.current.scale.setScalar(ease);

    // Full continuous spin + gentle bob
    const t = state.clock.elapsedTime;
    groupRef.current.rotation.y = t * 0.55;
    groupRef.current.rotation.x = Math.sin(t * 0.4) * 0.07;
    groupRef.current.position.y = Math.sin(t * 0.9) * 0.1;
  });

  return (
    <group ref={groupRef} scale={0}>
      {/* Frosted clear body */}
      <RoundedBox args={[2.7, 1.75, 2.15]} radius={0.07} smoothness={6}>
        <meshPhysicalMaterial
          color="#EDE1CE"
          transparent
          opacity={0.9}
          roughness={0.03}
          metalness={0}
          transmission={0.5}
          thickness={0.6}
          ior={1.45}
        />
      </RoundedBox>

      {/* Biscuit base layer */}
      <mesh position={[0, -0.59, 0]}>
        <boxGeometry args={[2.5, 0.3, 2.0]} />
        <meshStandardMaterial color="#7A4B25" roughness={0.88} />
      </mesh>

      {/* Cream fill */}
      <mesh position={[0, -0.14, 0]}>
        <boxGeometry args={[2.5, 0.62, 2.0]} />
        <meshStandardMaterial color="#F5ECD7" roughness={0.22} />
      </mesh>

      {/* Top cream */}
      <mesh position={[0, 0.35, 0]}>
        <boxGeometry args={[2.5, 0.34, 2.0]} />
        <meshStandardMaterial color="#FBF5EC" roughness={0.14} />
      </mesh>

      {/* Lotus label band — front face */}
      <mesh position={[0, 0, 1.1]}>
        <boxGeometry args={[2.75, 0.56, 0.04]} />
        <meshStandardMaterial
          color="#C4622D"
          roughness={0.2}
          emissive="#C4622D"
          emissiveIntensity={0.25}
        />
      </mesh>

      {/* Brand name bar on label */}
      <mesh position={[0, 0.08, 1.125]}>
        <boxGeometry args={[0.85, 0.07, 0.01]} />
        <meshStandardMaterial color="#FBF5EC" roughness={0.5} opacity={0.55} transparent />
      </mesh>
      <mesh position={[0, -0.07, 1.125]}>
        <boxGeometry args={[0.5, 0.04, 0.01]} />
        <meshStandardMaterial color="#FBF5EC" roughness={0.5} opacity={0.35} transparent />
      </mesh>

      {/* Frosted lid */}
      <RoundedBox args={[2.75, 0.12, 2.2]} radius={0.04} smoothness={6} position={[0, 0.935, 0]}>
        <meshPhysicalMaterial
          color="#D2C5B0"
          transparent
          opacity={0.72}
          roughness={0.08}
          transmission={0.3}
        />
      </RoundedBox>
    </group>
  );
}

// ─── Full Scene ───────────────────────────────────────────────────────────────
function Scene() {
  const lotusInstances = useMemo(() => {
    return Array.from({ length: 28 }, (_, i) => {
      // Spread left and right of the box, all behind it (z < -0.5)
      const side = i % 2 === 0 ? 1 : -1;
      return {
        position: [
          (Math.random() * 8.5 + 1.2) * side,
          Math.random() * 22 + 2,
          -(Math.random() * 6 + 0.8),
        ] as [number, number, number],
        rotationSpeed: [
          (Math.random() - 0.5) * 0.013,
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.01,
        ] as [number, number, number],
        fallSpeed: 0.65 + Math.random() * 1.3,
        phase: Math.random() * 22,
      };
    });
  }, []);

  return (
    <>
      {/* Falling lotus biscuits — positioned behind box */}
      {lotusInstances.map((d, i) => (
        <LotusBiscuit key={i} {...d} />
      ))}

      {/* Hero product box */}
      <ProductBox />

      <ContactShadows
        position={[0, -1.6, 0]}
        opacity={0.55}
        scale={12}
        blur={3.5}
        far={5}
        color="#080302"
      />
    </>
  );
}

// ─── Canvas Export ────────────────────────────────────────────────────────────
export default function CremiBox3D() {
  return (
    <Canvas
      camera={{ position: [0, 0.6, 7.5], fov: 40 }}
      style={{ width: "100%", height: "100%" }}
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true }}
    >
      {/* Dramatic warm spot from above */}
      <ambientLight intensity={0.2} />
      <directionalLight position={[0, 10, 5]} intensity={4.5} color="#FBF0E0" castShadow />
      <directionalLight position={[-8, 2, -4]} intensity={0.45} color="#C4622D" />
      <spotLight
        position={[6, 8, 4]}
        intensity={3.5}
        color="#C4871F"
        angle={0.35}
        penumbra={0.85}
        decay={1.5}
      />
      {/* Soft cream bounce light from below */}
      <pointLight position={[0, -1.5, 3.5]} intensity={1.0} color="#FBF5EC" />

      <Scene />

      <Environment preset="night" />
    </Canvas>
  );
}
