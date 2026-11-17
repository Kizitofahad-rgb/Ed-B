import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Line } from "@react-three/drei";
import * as THREE from "three";

type Vec3 = [number, number, number];

interface NetworkNode {
  id: string;
  role: string;
  position: Vec3;
  size: number;
  highlight?: boolean;
}

const NETWORK_NODES: NetworkNode[] = [
  { id: "student-1", role: "Student", position: [-2.4, 0.9, 0.4], size: 0.125, highlight: true },
  { id: "student-2", role: "Student", position: [2.25, 0.75, 0.3], size: 0.115 },
  { id: "mentor-1", role: "Mentor", position: [-1.7, 1.85, -0.5], size: 0.135, highlight: true },
  { id: "mentor-2", role: "Mentor", position: [1.85, 1.7, -0.35], size: 0.115 },
  { id: "alumni-1", role: "Alumni", position: [-2.75, -0.65, -0.4], size: 0.105 },
  { id: "alumni-2", role: "Alumni", position: [2.65, -0.55, -0.25], size: 0.125, highlight: true },
  { id: "community-1", role: "CoCIS", position: [-1.15, -1.45, 0.55], size: 0.13 },
  { id: "community-2", role: "Busia SS", position: [1.2, -1.35, 0.5], size: 0.12 },
  { id: "org-1", role: "Organization", position: [0.1, 2.15, -0.6], size: 0.145, highlight: true },
  { id: "student-3", role: "CS Cohort", position: [0.0, -1.85, -0.45], size: 0.105 },
  { id: "alumni-3", role: "Alumni", position: [-1.05, 0.95, 1.15], size: 0.095 },
  { id: "mentor-3", role: "Mentor", position: [1.15, 0.55, 1.1], size: 0.1 },
];

const CENTER_ANCHOR: Vec3 = [0, -0.18, 0];

const EXTRA_EDGES: [number, number][] = [
  [0, 2],
  [0, 6],
  [1, 3],
  [1, 7],
  [2, 8],
  [3, 8],
  [4, 6],
  [5, 7],
  [6, 9],
  [7, 9],
  [10, 0],
  [11, 1],
  [10, 8],
];

function archCurvePoints(from: Vec3, to: Vec3, arcLift = 0.55, segments = 16): Vec3[] {
  const pts: Vec3[] = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const x = THREE.MathUtils.lerp(from[0], to[0], t);
    const z = THREE.MathUtils.lerp(from[2], to[2], t);
    const baseY = THREE.MathUtils.lerp(from[1], to[1], t);
    const lift = Math.sin(t * Math.PI) * arcLift;
    pts.push([x, baseY + lift, z]);
  }
  return pts;
}

function BridgeLogo3D() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.85) * 0.06;
  });

  return (
    <group ref={groupRef} position={[0, -0.25, 0]}>
      {/* Outer grey arch */}
      <mesh position={[0, -0.12, 0]}>
        <torusGeometry args={[1.02, 0.052, 24, 64, Math.PI]} />
        <meshStandardMaterial color="#4B5552" roughness={0.35} metalness={0.25} />
      </mesh>

      {/* Inner light-green arch */}
      <mesh position={[0, -0.12, 0.02]}>
        <torusGeometry args={[0.64, 0.05, 24, 56, Math.PI]} />
        <meshStandardMaterial
          color="#4AD185"
          emissive="#A8F0C4"
          emissiveIntensity={0.35}
          roughness={0.25}
          metalness={0.15}
        />
      </mesh>

      {/* Grounded light-green connection dot beneath arches */}
      <mesh position={[0, -0.18, 0.02]}>
        <sphereGeometry args={[0.15, 28, 28]} />
        <meshStandardMaterial
          color="#2F9E62"
          emissive="#A8F0C4"
          emissiveIntensity={0.45}
          roughness={0.22}
        />
      </mesh>

      {/* Soft light-green halo ring */}
      <mesh position={[0, -0.18, 0.02]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.21, 0.245, 48]} />
        <meshBasicMaterial color="#7AE0A6" transparent opacity={0.55} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function OrbitingNetwork() {
  const rootRef = useRef<THREE.Group>(null);

  const archLines = useMemo(
    () =>
      NETWORK_NODES.map((n) => ({
        id: n.id,
        points: archCurvePoints(n.position, CENTER_ANCHOR, 0.45, 18),
        highlight: Boolean(n.highlight),
      })),
    [],
  );

  const meshLines = useMemo(
    () =>
      EXTRA_EDGES.map(([a, b], idx) => ({
        id: `edge-${idx}`,
        points: [NETWORK_NODES[a].position, NETWORK_NODES[b].position] as Vec3[],
      })),
    [],
  );

  useFrame((state, delta) => {
    if (!rootRef.current) return;
    const targetRotY = state.pointer.x * 0.28 + Math.sin(state.clock.elapsedTime * 0.22) * 0.18;
    const targetRotX = -state.pointer.y * 0.18 + 0.06;
    rootRef.current.rotation.y = THREE.MathUtils.lerp(
      rootRef.current.rotation.y,
      targetRotY,
      Math.min(1, delta * 2.5),
    );
    rootRef.current.rotation.x = THREE.MathUtils.lerp(
      rootRef.current.rotation.x,
      targetRotX,
      Math.min(1, delta * 2.5),
    );
  });

  return (
    <group ref={rootRef}>
      <BridgeLogo3D />

      {/* Arched light-green connection lines toward the central bridge */}
      {archLines.map((l) => (
        <Line
          key={l.id}
          points={l.points}
          color={l.highlight ? "#2F9E62" : "#7AE0A6"}
          lineWidth={l.highlight ? 1.6 : 1.05}
          transparent
          opacity={l.highlight ? 0.72 : 0.45}
        />
      ))}

      {/* Secondary soft grey edges */}
      {meshLines.map((edge) => (
        <Line
          key={edge.id}
          points={edge.points}
          color="#AEB8B4"
          lineWidth={0.85}
          transparent
          opacity={0.5}
        />
      ))}

      {/* Floating light-green and grey nodes */}
      {NETWORK_NODES.map((node, index) => (
        <Float
          key={node.id}
          speed={1.2 + (index % 3) * 0.35}
          rotationIntensity={0.15}
          floatIntensity={0.35}
        >
          <group position={node.position}>
            <mesh>
              <sphereGeometry args={[node.size, 24, 24]} />
              <meshStandardMaterial
                color={node.highlight ? "#4AD185" : "#9AA5A0"}
                emissive={node.highlight ? "#A8F0C4" : "#E9EDEB"}
                emissiveIntensity={node.highlight ? 0.35 : 0.1}
                roughness={0.3}
                metalness={0.12}
              />
            </mesh>
            {node.highlight && (
              <mesh scale={1.85}>
                <sphereGeometry args={[node.size, 16, 16]} />
                <meshBasicMaterial color="#A8F0C4" transparent opacity={0.28} />
              </mesh>
            )}
          </group>
        </Float>
      ))}
    </group>
  );
}

export default function HeroScene3D() {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0.15, 5.6], fov: 44 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ width: "100%", height: "100%", background: "transparent" }}
    >
      <ambientLight intensity={1.05} />
      <directionalLight position={[4, 6, 5]} intensity={1.2} color="#FFFFFF" />
      <pointLight position={[-3, 2, 4]} intensity={0.9} color="#A8F0C4" />
      <OrbitingNetwork />
    </Canvas>
  );
}
