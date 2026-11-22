import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, Lightformer, Sparkles } from "@react-three/drei";
import * as THREE from "three";

/**
 * Real-time 3D ornaments for the halaman inti (lazy-loaded): drifting gold leaves for the hero and
 * a pair of turning wedding rings. Each canvas pauses when scrolled out of view.
 * three.js materials need sRGB hex, so the royal-gold palette is mirrored here.
 */
const GOLD = "#d6b46f";
const GOLD_LIGHT = "#f1d99a";
const ROSE_GOLD = "#e0a98c";
const WINE = "#7b2a3a";

const rnd = (i: number) => {
  const x = Math.sin(i * 91.7 + 17.3) * 43758.5453;
  return x - Math.floor(x);
};

function useInView<T extends Element>() {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(!!e?.isIntersecting), { rootMargin: "120px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, inView] as const;
}

function Stage({ children, className = "", z = 6 }: { children: ReactNode; className?: string; z?: number }) {
  const [ref, inView] = useInView<HTMLDivElement>();
  const [still, setStill] = useState(false);
  useEffect(() => setStill(window.matchMedia("(prefers-reduced-motion: reduce)").matches), []);
  return (
    <div ref={ref} className={`pointer-events-none ${className}`} aria-hidden>
      <Canvas
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
        camera={{ position: [0, 0, z], fov: 45 }}
        frameloop={inView && !still ? "always" : "demand"}
        onCreated={() => ref.current?.setAttribute("data-scene-ready", "")}
      >
        <ambientLight intensity={0.55} />
        <directionalLight position={[3, 4, 5]} intensity={1.8} color={GOLD_LIGHT} />
        <pointLight position={[-3, -2, 3]} intensity={6} color={WINE} />
        <Environment resolution={64}>
          <Lightformer intensity={2.2} position={[0, 5, 0]} scale={[10, 10, 1]} />
          <Lightformer intensity={1.2} color={GOLD_LIGHT} position={[-5, 1, -1]} rotation-y={Math.PI / 2} scale={[20, 1, 1]} />
          <Lightformer intensity={0.9} color={WINE} position={[5, -1, -1]} rotation-y={-Math.PI / 2} scale={[20, 1, 1]} />
        </Environment>
        {children}
      </Canvas>
    </div>
  );
}

/* --------------------------- drifting gold leaves --------------------------- */

function GoldLeaves({ count = 20 }: { count?: number }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const geo = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, -0.5);
    s.bezierCurveTo(0.36, -0.22, 0.32, 0.28, 0, 0.5);
    s.bezierCurveTo(-0.32, 0.28, -0.36, -0.22, 0, -0.5);
    const g = new THREE.ShapeGeometry(s, 10);
    // slight cup so light rolls across the leaf as it turns
    const p = g.attributes["position"] as THREE.BufferAttribute;
    for (let i = 0; i < p.count; i++) p.setZ(i, -Math.pow(p.getX(i), 2) * 0.9);
    g.computeVertexNormals();
    g.scale(0.34, 0.34, 0.34);
    return g;
  }, []);
  const leaves = useMemo(
    () => Array.from({ length: count }, (_, i) => ({ x: (rnd(i) - 0.5) * 9, y: (rnd(i + 40) - 0.5) * 8, z: -rnd(i + 80) * 3, s: 0.6 + rnd(i + 7) * 0.9, sp: 0.18 + rnd(i + 3) * 0.3, rx: rnd(i + 11) * 6, ry: rnd(i + 13) * 6 })),
    [count],
  );
  const dummy = useMemo(() => new THREE.Object3D(), []);
  useFrame((state, delta) => {
    const m = mesh.current;
    if (!m) return;
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    leaves.forEach((l, i) => {
      l.y -= l.sp * dt;
      if (l.y < -4.5) l.y = 4.5;
      dummy.position.set(l.x + Math.sin(t * 0.6 + i) * 0.45, l.y, l.z);
      dummy.rotation.set(l.rx + t * l.sp * 2.4, l.ry + t * 0.5, Math.sin(t * 0.8 + i) * 0.7);
      dummy.scale.setScalar(l.s);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
  });
  return (
    <instancedMesh ref={mesh} args={[geo, undefined, count]}>
      <meshStandardMaterial color={GOLD} metalness={0.9} roughness={0.28} side={THREE.DoubleSide} />
    </instancedMesh>
  );
}

export function GoldDust3D({ className = "" }: { className?: string }) {
  return (
    <Stage className={className} z={6}>
      <GoldLeaves />
      <Sparkles count={45} scale={[9, 8, 3]} size={2.6} speed={0.35} color={GOLD_LIGHT} opacity={0.85} />
    </Stage>
  );
}

/* ------------------------------ wedding rings ------------------------------ */

function Rings() {
  const g = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (!g.current) return;
    g.current.rotation.y += Math.min(delta, 0.05) * 0.7;
    g.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.6) * 0.22;
  });
  return (
    <group ref={g}>
      <mesh position={[-0.38, 0, 0]} rotation={[0.15, 0.55, 0]}>
        <torusGeometry args={[0.66, 0.085, 24, 96]} />
        <meshStandardMaterial color={GOLD} metalness={1} roughness={0.16} />
      </mesh>
      <mesh position={[0.38, 0, 0]} rotation={[-0.15, -0.55, 0.35]}>
        <torusGeometry args={[0.66, 0.085, 24, 96]} />
        <meshStandardMaterial color={ROSE_GOLD} metalness={1} roughness={0.2} />
      </mesh>
      <mesh position={[-0.38, 0.74, 0.12]} rotation={[0, 0.4, 0]}>
        <octahedronGeometry args={[0.15, 0]} />
        <meshStandardMaterial color="#ffffff" metalness={0.2} roughness={0.02} emissive={GOLD_LIGHT} emissiveIntensity={0.25} flatShading />
      </mesh>
    </group>
  );
}

export function Rings3D({ className = "" }: { className?: string }) {
  return (
    <Stage className={className} z={3.4}>
      <Float speed={2} floatIntensity={0.7} rotationIntensity={0.25}>
        <Rings />
      </Float>
      <Sparkles count={20} scale={[3.2, 2.2, 1.2]} size={2.2} speed={0.45} color={GOLD_LIGHT} />
    </Stage>
  );
}
